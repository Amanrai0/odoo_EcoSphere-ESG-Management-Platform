from environment.models import EnvironmentalData
from social.models import SocialData
from governance.models import GovernanceData


def calculate_environment_score(record):
    score = 100

    if record.co2_emissions > 300:
        score -= 20
    elif record.co2_emissions > 200:
        score -= 10

    if record.water > 10000:
        score -= 15

    if record.electricity > 5000:
        score -= 15

    score += record.renewable_energy * 0.2

    return max(0, min(100, round(score, 2)))


def calculate_social_score(record):
    score = 0

    score += record.employee_satisfaction * 0.5
    score += min(record.training_hours / 20, 20)
    score += max(0, 30 - record.workplace_accidents * 5)

    return max(0, min(100, round(score, 2)))


def calculate_governance_score(record):
    score = 0

    score += record.audit_score * 0.4
    score += record.compliance_score * 0.4
    score += record.ethics_training_percentage * 0.2

    return max(0, min(100, round(score, 2)))


def calculate_esg(environment, social, governance):

    env = calculate_environment_score(environment)
    soc = calculate_social_score(social)
    gov = calculate_governance_score(governance)

    overall = round((env + soc + gov) / 3, 2)

    return {
        "environment_score": env,
        "social_score": soc,
        "governance_score": gov,
        "overall_esg_score": overall,
    }