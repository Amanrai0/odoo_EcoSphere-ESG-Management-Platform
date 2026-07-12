from django.db import models

# Create your models here.
from django.db import models
from companies.models import Company


class EnvironmentalData(models.Model):
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
        related_name="environmental_records"
    )

    year = models.PositiveIntegerField()
    month = models.CharField(max_length=3, choices=MONTH_CHOICES)

    electricity = models.FloatField(help_text="Electricity consumption (kWh)")
    water = models.FloatField(help_text="Water consumption (Liters)")
    fuel = models.FloatField(help_text="Fuel consumption (Liters)")
    waste = models.FloatField(help_text="Waste generated (Kg)")
    co2_emissions = models.FloatField(help_text="CO₂ emissions (Tons)")
    renewable_energy = models.FloatField(help_text="Renewable energy used (%)")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("company", "year", "month")
        ordering = ["-year", "-month"]

    def __str__(self):
        return f"{self.company.name} - {self.month} {self.year}"