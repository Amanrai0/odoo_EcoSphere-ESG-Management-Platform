from django.db import models

# Create your models here.
from companies.models import Company


class SocialData(models.Model):
    MONTH_CHOICES = [
        ("JAN", "January"),
        ("FEB", "February"),
        ("MAR", "March"),
        ("APR", "April"),
        ("MAY", "May"),
        ("JUN", "June"),
        ("JUL", "July"),
        ("AUG", "August"),
        ("SEP", "September"),
        ("OCT", "October"),
        ("NOV", "November"),
        ("DEC", "December"),
    ]

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="social_records"
    )

    year = models.PositiveIntegerField()
    month = models.CharField(max_length=3, choices=MONTH_CHOICES)

    total_employees = models.PositiveIntegerField()
    male_employees = models.PositiveIntegerField()
    female_employees = models.PositiveIntegerField()

    training_hours = models.FloatField(help_text="Total employee training hours")
    workplace_accidents = models.PositiveIntegerField()
    employee_satisfaction = models.FloatField(help_text="Percentage (0-100)")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("company", "year", "month")
        ordering = ["-year", "-month"]

    def __str__(self):
        return f"{self.company.name} - {self.month} {self.year}"