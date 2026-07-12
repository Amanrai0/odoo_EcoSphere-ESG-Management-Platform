from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class GlobalSettings(models.Model):
    """Manages system-wide toggles"""
    auto_emission_calculation = models.BooleanField(default=True)
    evidence_requirement = models.BooleanField(default=True)
    badge_auto_award = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Global Settings"

class UserProfile(models.Model):
    """Tracks employee profile, accrued XP, and points balance"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    xp = models.IntegerField(default=0)
    points_balance = models.IntegerField(default=0)
    
    def __str__(self):
        return self.user.username

class Challenge(models.Model):
    """Handles the Challenge lifecycle"""
    STATUS_CHOICES = [
        ('draft', 'Draft'), ('active', 'Active'), 
        ('review', 'Under Review'), ('completed', 'Completed'), ('archived', 'Archived')
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    xp_reward = models.IntegerField(default=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')

class Reward(models.Model):
    """Manages the redeemable incentives catalog"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    points_required = models.IntegerField()
    stock = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class RewardRedemption(models.Model):
    """Executes points deduction and stock constraints checks[cite: 1]"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    redemption_date = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # Business Rule: Check points balance and stock availability[cite: 1]
        profile = self.user.profile
        if profile.points_balance < self.reward.points_required:
            raise ValidationError("Insufficient points balance for this reward[cite: 1].")
        if self.reward.stock <= 0:
            raise ValidationError("This incentive is currently out of stock[cite: 1].")

    def save(self, *args, **kwargs):
        self.full_clean()
        # Deduct points and reduce catalog stock[cite: 1]
        profile = self.user.profile
        profile.points_balance -= self.reward.points_required
        profile.save()

        self.reward.stock -= 1
        self.reward.save()
        super().save(*args, **kwargs)