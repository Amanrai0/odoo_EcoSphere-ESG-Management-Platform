from django.db import models

# Create your models here.


class Company(models.Model):
    INDUSTRY_CHOICES = [
        ("IT", "Information Technology"),
        ("MAN", "Manufacturing"),
        ("FIN", "Finance"),
        ("HEALTH", "Healthcare"),
        ("EDU", "Education"),
        ("OTHER", "Other"),
    ]

    name = models.CharField(max_length=200)
    industry = models.CharField(max_length=20, choices=INDUSTRY_CHOICES)
    country = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
