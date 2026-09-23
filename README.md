# 🏥 Arogya Mitra (आरोग्य मित्र)
### National Unified Public Healthcare & Clinical Hospital Management Platform

Arogya Mitra is a full-stack, ABDM-compliant (M1/M2/M3), AI-assisted healthcare ecosystem engineered for rural sub-centres, primary health centres (PHCs), community health centres (CHCs), and district hospitals.

---

## 📂 Project Architecture

```
Aarogya Mitra Final/
├── frontend/                   # React 18 + TypeScript + Vite + Tailwind UI
│   ├── src/
│   │   ├── components/         # Modular UI, AI Chatbots, QR Scanners, Modals
│   │   ├── lib/                # API client, Auth Store (Zustand), i18n, Sync engine
│   │   ├── locales/            # Multilingual dictionaries (English, Hindi, Marathi)
│   │   ├── pages/              # Dedicated portals (Patient, Doctor, ASHA, Admin)
│   │   └── styles/             # Tailwind & Design tokens
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                    # FastAPI + SQLAlchemy Async + SQLite/Postgres
│   ├── app/
│   │   ├── core/               # JWT Auth, RBAC, Multi-tenancy, Audit logging
│   │   ├── modules/            # ABDM, Clinical, Referrals, Lab, Emergency, etc.
│   │   └── main.py             # ASGI application root
│   ├── tests/                  # Pytest end-to-end API test suite
│   ├── requirements.txt
│   └── seed_data.py            # Phase 1, 2, 3 database seeder
│
├── docs/                       # Technical architecture & compliance specifications
│   ├── 01_SYSTEM_ARCHITECTURE.md
│   ├── 02_DATABASE_SCHEMA.md
│   ├── 03_API_SPECIFICATION.md
│   └── ...
│
├── scripts/                    # 1-Click Launchers & Setup Automation
│   ├── start_dev.bat           # Concurrently launches backend & frontend
│   ├── setup_backend.bat       # Pip install & database seeding
│   └── setup_frontend.bat      # Npm install & production bundle build
│
├── .gitignore
└── README.md
```

---

## 🌟 Key Features

1. **Role-Isolated Dedicated Dashboards**:
   - 🧑‍🦰 **Citizen / Patient Portal (`/patient`)**: ABHA Digital Health card, appointments, live vitals history, video doctor, Jan Aushadhi prescriptions, and nearby ICU bed availability.
   - 👨‍⚕️ **Doctor OPD Console (`/doctor`)**: Live ESI triage queue, SNOMED CT / ICD-10 clinical notes, digital e-prescriptions, and WebRTC teleconsultation.
   - 👩‍⚕️ **ASHA / CHO Field Station (`/asha`)**: Village household register, high-risk maternal (ANC) surveillance, NCD monitoring, and offline sync.
   - 🏢 **Facility & Superadmin Hub (`/dashboard`)**: Bed ward ICU meters, epidemic GIS heatmaps, centralized pharmacy formulary, and system audit logs.

2. **ABDM Milestone 1, 2, & 3 Compliance**:
   - Instant 14-digit ABHA ID & address generation (`@abdm`).
   - Health Information Provider (HIP) care-context linking.
   - Health Information User (HIU) consent exchange and FHIR R4 Bundle composition.

3. **Clinical Decision Support (CDSS)**:
   - Real-time Drug-Drug Interaction (DDI) auditing.
   - Pregnancy trimester contraindicated alerts.
   - Automated 108 emergency triage triggers for critical vitals.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: v3.11+

### Quick Start (Windows)
Double-click `scripts/start_dev.bat` or run:
```bash
# 1. Setup & run Backend
cd backend
pip install -r requirements.txt
python seed_data.py
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 2. In another terminal, run Frontend
cd frontend
npm install
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Interactive API Documentation**: `http://localhost:8000/docs`

---

## 🔑 Demo Credentials

| Role | Username | Password | Dedicated View |
|---|---|---|---|
| **Patient / Citizen** | `patient.ramesh` | `patient123` | Patient Portal (`/patient`) |
| **Doctor (DH Hub)** | `dr.sharma` | `doctor123` | Doctor OPD Console (`/doctor`) |
| **ASHA Worker** | `asha.rekha` | `asha123` | ASHA Field Station (`/asha`) |
| **CHO (Sub-Centre)** | `cho.meena` | `cho123` | Sub-Centre Care Hub (`/asha`) |
| **Superintendent / Admin** | `admin` | `admin123` | Enterprise Admin Hub (`/dashboard`) |

---

## 📄 License
MIT License. Built for the Smart India Hackathon (SIH).
