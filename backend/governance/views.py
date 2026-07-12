import json
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.http import require_GET, require_http_methods
from .models import Audit, ComplianceIssue, Department, Notification, Policy, PolicyAcknowledgement
from .services import escalate_overdue, recalculate_score


def staff(user): return user.is_staff
def data(request): return json.loads(request.body or '{}')
def response(value, status=200): return JsonResponse(value, status=status, safe=not isinstance(value, list))
def issue_json(issue): return {'id': issue.id, 'audit': issue.audit.name, 'department': issue.department.name, 'department_id': issue.department_id, 'severity': issue.severity, 'description': issue.description, 'owner': issue.owner.get_username(), 'due_date': issue.due_date, 'status': issue.status}


@login_required
@require_GET
def dashboard(request):
    departments = Department.objects.all().order_by('name')
    issues = ComplianceIssue.objects.exclude(status=ComplianceIssue.RESOLVED)
    return response({'governance_score': round(sum(float(department.governance_score) for department in departments) / max(departments.count(), 1), 2), 'open_issues': issues.filter(status=ComplianceIssue.OPEN).count(), 'overdue_issues': issues.filter(status=ComplianceIssue.OVERDUE).count(), 'departments': [{'id': department.id, 'name': department.name, 'score': department.governance_score} for department in departments], 'recent_issues': [issue_json(issue) for issue in issues.order_by('-created_at')[:5]]})


@login_required
@require_http_methods(['GET', 'POST'])
def policies(request):
    if request.method == 'GET':
        return response([{'id': policy.id, 'title': policy.title, 'version': policy.version, 'effective_date': policy.effective_date, 'status': policy.status, 'acknowledged': policy.acknowledgements.filter(employee=request.user).exists()} for policy in Policy.objects.exclude(status=Policy.ARCHIVED)])
    if not staff(request.user): return response({'error': 'Staff access required'}, 403)
    payload = data(request)
    policy = Policy.objects.create(title=payload['title'], content=payload['content'], version=payload['version'], effective_date=payload['effective_date'], status=payload.get('status', Policy.DRAFT))
    return response({'id': policy.id}, 201)


@login_required
@require_http_methods(['POST'])
def acknowledge(request, policy_id):
    policy = get_object_or_404(Policy, id=policy_id, status=Policy.ACTIVE)
    acknowledgement, _ = PolicyAcknowledgement.objects.get_or_create(policy=policy, employee=request.user)
    return response({'status': 'success', 'acknowledged_at': acknowledgement.acknowledged_at})


@login_required
@require_http_methods(['GET', 'POST'])
def issues(request):
    if request.method == 'GET':
        queryset = ComplianceIssue.objects.select_related('audit', 'department', 'owner').all().order_by('-created_at')
        if request.GET.get('status'): queryset = queryset.filter(status=request.GET['status'])
        return response([issue_json(issue) for issue in queryset])
    if not staff(request.user): return response({'error': 'Staff access required'}, 403)
    payload = data(request)
    issue = ComplianceIssue.objects.create(audit_id=payload['audit_id'], department_id=payload['department_id'], severity=payload['severity'], description=payload['description'], owner_id=payload['owner_id'], due_date=payload['due_date'])
    Notification.objects.create(user=issue.owner, issue=issue, kind='compliance_issue_assigned', message=f'A {issue.severity} compliance issue was assigned to you.')
    recalculate_score(issue.department)
    return response(issue_json(issue), 201)


@login_required
@require_http_methods(['PATCH'])
def update_issue(request, issue_id):
    if not staff(request.user): return response({'error': 'Staff access required'}, 403)
    issue = get_object_or_404(ComplianceIssue, id=issue_id)
    payload = data(request)
    for field in ['severity', 'description', 'due_date', 'status']:
        if field in payload: setattr(issue, field, payload[field])
    if issue.status == ComplianceIssue.RESOLVED: issue.resolved_at = timezone.now()
    issue.save()
    recalculate_score(issue.department)
    return response(issue_json(issue))


@login_required
@user_passes_test(staff)
@require_http_methods(['POST'])
def escalation_job(request): return response({'escalated': escalate_overdue()})


@login_required
@require_GET
def notifications(request):
    return response([{'id': notice.id, 'message': notice.message, 'kind': notice.kind, 'created_at': notice.created_at} for notice in Notification.objects.filter(user=request.user).order_by('-created_at')])
