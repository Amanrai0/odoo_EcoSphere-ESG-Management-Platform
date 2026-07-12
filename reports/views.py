from django.shortcuts import render

# Create your views here.
from io import BytesIO

from django.http import FileResponse
from django.shortcuts import get_object_or_404

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate
from reportlab.platypus import Paragraph
from reportlab.platypus import Spacer

from companies.models import Company
from environment.models import EnvironmentalData
from social.models import SocialData
from governance.models import GovernanceData

from analytics.services import calculate_esg


def generate_report(request, company_id):

    year = request.GET.get("year")
    month = request.GET.get("month")

    company = get_object_or_404(
        Company,
        id=company_id
    )

    environment = get_object_or_404(
        EnvironmentalData,
        company=company,
        year=year,
        month=month
    )

    social = get_object_or_404(
        SocialData,
        company=company,
        year=year,
        month=month
    )

    governance = get_object_or_404(
        GovernanceData,
        company=company,
        year=year,
        month=month
    )

    scores = calculate_esg(
        environment,
        social,
        governance
    )

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph("<b>ESG Sustainability Report</b>", styles["Title"]))
    story.append(Spacer(1, 20))

    story.append(Paragraph(f"<b>Company:</b> {company.name}", styles["Normal"]))
    story.append(Paragraph(f"<b>Industry:</b> {company.industry}", styles["Normal"]))
    story.append(Paragraph(f"<b>Country:</b> {company.country}", styles["Normal"]))
    story.append(Spacer(1, 20))

    story.append(Paragraph("<b>Environment</b>", styles["Heading2"]))
    story.append(Paragraph(f"CO₂ Emissions: {environment.co2_emissions}", styles["Normal"]))
    story.append(Paragraph(f"Water: {environment.water}", styles["Normal"]))
    story.append(Paragraph(f"Electricity: {environment.electricity}", styles["Normal"]))
    story.append(Paragraph(f"Renewable Energy: {environment.renewable_energy}%", styles["Normal"]))
    story.append(Paragraph(f"Environment Score: {scores['environment_score']}", styles["Normal"]))
    story.append(Spacer(1, 15))

    story.append(Paragraph("<b>Social</b>", styles["Heading2"]))
    story.append(Paragraph(f"Employee Satisfaction: {social.employee_satisfaction}", styles["Normal"]))
    story.append(Paragraph(f"Training Hours: {social.training_hours}", styles["Normal"]))
    story.append(Paragraph(f"Workplace Accidents: {social.workplace_accidents}", styles["Normal"]))
    story.append(Paragraph(f"Social Score: {scores['social_score']}", styles["Normal"]))
    story.append(Spacer(1, 15))

    story.append(Paragraph("<b>Governance</b>", styles["Heading2"]))
    story.append(Paragraph(f"Audit Score: {governance.audit_score}", styles["Normal"]))
    story.append(Paragraph(f"Compliance Score: {governance.compliance_score}", styles["Normal"]))
    story.append(Paragraph(f"Ethics Training: {governance.ethics_training_percentage}%", styles["Normal"]))
    story.append(Paragraph(f"Governance Score: {scores['governance_score']}", styles["Normal"]))
    story.append(Spacer(1, 20))

    story.append(
        Paragraph(
            f"<b>Overall ESG Score: {scores['overall_esg_score']}</b>",
            styles["Heading1"],
        )
    )

    doc.build(story)

    buffer.seek(0)

    return FileResponse(
        buffer,
        as_attachment=True,
        filename=f"{company.name}_ESG_Report.pdf",
    )