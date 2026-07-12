from datetime import timedelta
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from .models import Audit, ComplianceIssue, Department
from .services import escalate_overdue


class GovernanceServiceTests(TestCase):
    def test_overdue_issue_reduces_governance_score(self):
        owner = get_user_model().objects.create_user('owner')
        department = Department.objects.create(name='Operations', code='OPS')
        audit = Audit.objects.create(name='Safety review', date=timezone.localdate(), scope='Depot', auditor='Kunal')
        ComplianceIssue.objects.create(audit=audit, department=department, severity='high', description='Unsafe storage', owner=owner, due_date=timezone.localdate() - timedelta(days=1))

        self.assertEqual(escalate_overdue(), 1)
        department.refresh_from_db()
        self.assertEqual(department.governance_score, 75)
