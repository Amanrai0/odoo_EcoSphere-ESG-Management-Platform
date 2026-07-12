from django.conf import settings
from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=30, unique=True)
    governance_score = models.DecimalField(max_digits=5, decimal_places=2, default=100)

    def __str__(self): return self.name


class Policy(models.Model):
    DRAFT, ACTIVE, ARCHIVED = 'draft', 'active', 'archived'
    STATUS_CHOICES = [(DRAFT, 'Draft'), (ACTIVE, 'Active'), (ARCHIVED, 'Archived')]
    title = models.CharField(max_length=200)
    content = models.TextField()
    version = models.CharField(max_length=30)
    effective_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=DRAFT)


class PolicyAcknowledgement(models.Model):
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name='acknowledgements')
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    acknowledged_at = models.DateTimeField(auto_now_add=True)

    class Meta: unique_together = [('policy', 'employee')]


class Audit(models.Model):
    DRAFT, IN_PROGRESS, COMPLETED = 'draft', 'in_progress', 'completed'
    name = models.CharField(max_length=200)
    date = models.DateField()
    scope = models.CharField(max_length=300)
    auditor = models.CharField(max_length=120)
    findings = models.TextField(blank=True)
    status = models.CharField(max_length=15, default=DRAFT)


class ComplianceIssue(models.Model):
    OPEN, RESOLVED, OVERDUE = 'open', 'resolved', 'overdue'
    SEVERITIES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')]
    audit = models.ForeignKey(Audit, on_delete=models.CASCADE, related_name='issues')
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='issues')
    severity = models.CharField(max_length=10, choices=SEVERITIES)
    description = models.TextField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='owned_issues')
    due_date = models.DateField()
    status = models.CharField(max_length=10, default=OPEN)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.CharField(max_length=300)
    kind = models.CharField(max_length=50)
    issue = models.ForeignKey(ComplianceIssue, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
