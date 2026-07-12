from django.db.models import Count, Q
from django.utils import timezone
from .models import ComplianceIssue, Notification


def recalculate_score(department):
    counts = department.issues.values('status').annotate(total=Count('id'))
    totals = {row['status']: row['total'] for row in counts}
    department.governance_score = max(0, min(100, 100 - totals.get('open', 0) * 10 - totals.get('overdue', 0) * 25))
    department.save(update_fields=['governance_score'])
    return department.governance_score


def escalate_overdue():
    issues = list(ComplianceIssue.objects.filter(status=ComplianceIssue.OPEN, due_date__lt=timezone.localdate()))
    departments = set()
    for issue in issues:
        issue.status = ComplianceIssue.OVERDUE
        issue.save(update_fields=['status'])
        Notification.objects.create(user=issue.owner, issue=issue, kind='compliance_issue_overdue', message='Your compliance issue is overdue and needs immediate action.')
        departments.add(issue.department)
    for department in departments: recalculate_score(department)
    return len(issues)
