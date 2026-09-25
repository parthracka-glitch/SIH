"""Pydantic schemas for Public Health Analytics & Epidemiological Surveillance."""

from datetime import datetime, timezone
from pydantic import BaseModel, Field


class OutbreakAlert(BaseModel):
    id: str
    disease_name: str
    icd10_code: str = "A90"
    district: str = "Jaipur"
    block: str = "Bassi"
    reported_cases_this_week: int = 0
    baseline_threshold: int = 0
    spike_percentage: float = 0.0
    alert_level: str = "WARNING"  # WATCH, WARNING, EPIDEMIC_SPIKE, RED_OUTBREAK, AMBER_WATCH
    recommended_action: str = ""
    detected_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Frontend-friendly compatibility aliases
    disease: str = ""
    cluster_location: str = ""
    cases_last_7d: int = 0
    baseline_mean: int = 0
    anomaly_sigma: float = 2.4
    rapid_action_advised: str = ""


class DiseaseTrendPoint(BaseModel):
    date: str
    cases: int = 0
    category: str = ""

    # Frontend multi-series fields
    dengue: int = 0
    gastroenteritis: int = 0
    hypertension: int = 0
    diabetes: int = 0
    ari_pneumonia: int = 0


class GeoClusterItem(BaseModel):
    id: str
    location_name: str = ""
    facility_type: str = ""
    latitude: float = 26.9124
    longitude: float = 75.7873
    active_cases: int = 0
    outbreak_risk: str = "LOW"  # LOW, MODERATE, HIGH
    primary_condition: str = ""

    # Frontend-friendly compatibility aliases
    block: str = ""
    lat: float = 26.9124
    lng: float = 75.7873
    dominant_condition: str = ""
    alert_level: str = "NORMAL"
    facility_hub: str = ""


class PublicHealthOverview(BaseModel):
    total_consultations: int
    active_referrals: int
    high_risk_maternal_cases: int
    ncd_screenings_count: int
    ncd_screened_count: int = 0
    overall_bed_occupancy_rate: float
    bed_occupancy_rate: float = 0.0
    jan_aushadhi_dispensing_compliance: float = 94.2
    active_outbreak_alerts: int
    outbreaks: list[OutbreakAlert] = Field(default_factory=list)
    outbreak_alerts: list[OutbreakAlert] = Field(default_factory=list)
    geo_clusters: list[GeoClusterItem] = Field(default_factory=list)
