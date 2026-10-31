# 🐝 BorrowBee

> Quick cash. Clear terms. Approved in 30 minutes.

BorrowBee is a modern micro-lending platform for the Kenyan market. Borrowers sign in with their ID, choose a loan amount (capped at **KES 5,000** for new users), sign a PDF agreement with a guarantor, and receive funds to their M-Pesa number once approved. Loans run for **30 days at a flat 15% interest**. Lenders manage the entire flow — approvals, disbursements, repayments, and reminders — from a private developer dashboard.

---

## ✨ Features

### Borrower App
- **ID-based sign-in** (with fingerprint sign-in ready for production)
- **Loan amount slider** limited to the borrower's tier (default KES 5,000 for new users)
- **Live repayment breakdown** — principal, 15% flat interest, and total due shown *before* applying
- **Borrower levels** — New → Trusted → Gold, unlocking higher limits on timely repayment
- **Downloadable PDF loan agreement** — filled, signed, and uploaded back in-app
- **Guarantor capture** — full name, ID number, and phone number
- **30-minute approval window** with a live countdown and status screen
- **M-Pesa payout confirmation** — enter and confirm the receiving number before disbursement
- **Active loan dashboard** — amount due, day counter, due date, and one-tap "Pay now"
- **Automatic reminders** — 3 days before due, on the due date, and 1 day late
- **Loan history** and in-app **help/support**

### Developer Dashboard (Lender)
- **Passcode-protected access**
- **Approval queue** with borrower, guarantor, and request details
- **One-click approve / decline** — instantly reflected on the borrower's device
- **Adjustable per-user limits** — raise from KES 5,000 up to KES 10,000+ on review
- **Repayments tracker** — mark as paid, send reminders, view collected vs. disbursed
- **Growth analytics** — monthly disbursed vs. collected bars, growth %, interest earned
- **Automatic email notifications** on new loan requests (mock in dev, SMTP in prod)

---

## 🏗️ Architecture

BorrowBee is split into a **`frontend/`** and **`backend/`** for clean separation of concerns:
borrowbee/
├── package.json # Root runner (concurrently)
├── README.md
├── .gitignore
│
├── frontend/ # React + Vite + Tailwind CSS
│ ├── src/
│ │ ├── components/ # Header, PhoneMockup, screens…
│ │ ├── screens/ # Login, Apply, Agreement, Wait, Payout, Active, History, Help
│ │ ├── api.js # Fetch wrapper → Flask API
│ │ ├── App.jsx
│ │ └── index.css # Tailwind + @theme tokens
│ └── vite.config.js
│
└── backend/ # Flask + Flask-RESTful + SQLAlchemy + Migrate
├── app.py # Application factory + API resource wiring
├── config.py
├── extensions.py # db, migrate
├── models/
│ └── loan.py
├── schemas/
│ └── loan.py
├── services/
│ └── loan_service.py # Business logic (create/approve/disburse/repay)
├── resources/ # Flask-RESTful endpoints (≡ Express routes)
│ ├── health.py
│ └── loans.py
├── utils/
│ ├── validators.py
│ └── responses.py
├── migrations/ # Alembic (flask db init)
├── requirements.txt
└── .env

### Why `resources/` instead of `routes/`?
Flask-RESTful's **Resource classes are the idiomatic equivalent of Express routes**. Each `Resource` handles one endpoint and its `get`/`post`/`put`/`delete` methods map to HTTP verbs — no Blueprints needed.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 9, Tailwind CSS v4 |
| **Backend** | Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS |
| **Database** | SQLite (dev) — swap `DATABASE_URL` for Postgres/MySQL in prod |
| **Auth** | Passcode gate on developer dashboard (dev); JWT for borrower in prod |
| **Payments** | M-Pesa Daraja API (planned — mocked in dev) |
| **Email** | SMTP (planned) — logged to console in dev |

---

## 🎨 Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary — Deep Teal | `#004D40` | App bars, primary branding |
| Secondary — Mint/Aqua | `#00BFA5` | Progress bars, active states |
| Accent — Gold/Amber | `#FFB300` | Loan offer highlights, urgent alerts |
| Surface — Light Mint Gray | `#F0FDF4` | Background |
| Ink — Deep Charcoal | `#0F172A` | Text |

Defined in `frontend/src/index.css` as Tailwind v4 `@theme` tokens (`--color-brand-primary`, etc.).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20.19+ or 22.12+
- **Python** 3.10+
- **Git**

### 1. Clone the repo

```bash
git clone git@github.com:Sparrowlen1/BorrowBee.git
cd BorrowBee
```


### 2. Frontend Setup
cd frontend
npm install
cd ..

### 3. Backend setup

cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask flask-restful flask-sqlalchemy flask-migrate flask-cors python-dotenv
pip freeze > requirements.txt
cd ..

### 4. Configure the Backend
Create the backend/.env

FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=dev-secret-change-me
DATABASE_URL=sqlite:///borrowbee.db
NEW_USER_LIMIT=5000
INTEREST_RATE=0.15
LOAN_TERM_DAYS=30

### 5. Initialize the database
cd backend
source venv/bin/activate
flask --app app db init
flask --app app db migrate -m "init loans"
flask --app app db upgrade
cd ..

### 6. Run everything
npm run dev

Frontend → http://localhost:5173

Backend → http://localhost:4000/api/health

🔌 API Reference
All endpoints are prefixed with /api.

Method	Endpoint	Description	Called by
GET	/health	Service health check	—
POST	/loans	Submit a loan application	Borrower
GET	/loans	List all loans (queue + history)	Developer
GET	/loans/:id	Get a single loan (status polling)	Borrower
POST	/loans/:id/approve	Approve a pending loan	Developer
POST	/loans/:id/decline	Decline a pending loan	Developer
POST	/loans/:id/disburse	Confirm payout phone → loan becomes active	Borrower
POST	/loans/:id/repay	Mark loan as repaid	Borrower / Developer

### 7.lifecycle
pending → approved → active → repaid
                    ↘ declined
                    Status	Trigger	Borrower sees
pending	Borrower submits signed agreement	"Under review" + 30-min timer
approved	Lender approves in dashboard	Payout number form
active	Borrower confirms M-Pesa number	Active loan dashboard (Day 1 of 30)
repaid	Borrower pays / lender marks paid	History entry
declined	Lender declines	"Request declined"

### Manual Test Flow
Start both servers: npm run dev

Open the borrower app at http://localhost:5173

Sign in with an ID, pick an amount, download → upload the agreement, fill guarantor details → submit

Go to the developer dashboard at http://localhost:5173/#/admin, unlock with passcode bee-admin

Approve the request in the Approval queue

Return to the borrower app — the payout screen appears

Enter and confirm an M-Pesa number → loan becomes active

Click "Demo: jump to day 27" → reminder fires → click Pay now → loan moves to History

 Roadmap
□ M-Pesa Daraja — real STK Push for disbursement and collection
□ JWT auth — replace the demo passcode gate; add refresh tokens
□ Real email — SMTP/SendGrid for new-request + reminder notifications
□ File storage — S3/Cloudinary for signed PDFs instead of local disk
□ Postgres — production database
□ SMS reminders — Africa's Talking integration
□ Credit scoring — integrate a bureau (Metropol / TransUnion KE)
□ KYC — ID verification via IPRS or Smile ID
□ Admin roles — multi-lender with per-user permissions
□ Audit log — immutable record of every status change
### Contributing
This is currently a solo project for Sparrowlen1. 

bash
git checkout -b feat/your-feature
# ...commits...
git push -u origin feat/your-feature
 License
Private / all rights reserved. Not licensed for redistribution.

Acknowledgements
Built as an interactive design prototype for a modern Kenyan micro-lending product, then scaffolded into a full-stack app with React + Vite + Tailwind (frontend) and Flask-RESTful + SQLAlchemy + Migrate (backend).

Contact: Sparrowlen1 · BorrowBee · Nairobi, Kenya



### Save it, then push:

```bash
cd ~/loan/borrowbee
git add README.md
git commit -m "docs: add project README"
git push

