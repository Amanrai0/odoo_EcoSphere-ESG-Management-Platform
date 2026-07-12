from django.contrib import admin
from .models import Audit, ComplianceIssue, Department, Notification, Policy, PolicyAcknowledgement

admin.site.register([Department, Policy, PolicyAcknowledgement, Audit, ComplianceIssue, Notification])
