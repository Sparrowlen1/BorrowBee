# BorrowBee

> Quick cash. Clear terms. Approved in 30 minutes.

BorrowBee is a modern micro-lending platform designed for the Kenyan market. Borrowers sign in using their national ID, select a loan amount (capped at **KES 5,000** for new users), sign a PDF loan agreement with a guarantor, and receive funds through M-Pesa once their application is approved.

Loans run for **30 days at a flat 15% interest rate**. Lenders manage the entire lending process, including approvals, disbursements, repayments, and reminders, through a private developer dashboard.

---

## Features

### Borrower Application

- **ID-based sign-in** with fingerprint authentication planned for production.
- **Loan amount slider** limited according to the borrower's assigned tier.
- **Default loan limit:** KES 5,000 for new borrowers.
- **Live repayment breakdown** showing principal, 15% flat interest, and total amount due before applying.
- **Borrower levels:** New, Trusted, and Gold, unlocking higher borrowing limits through timely repayments.
- **Downloadable PDF loan agreement** that borrowers can complete, sign, and upload through the application.
- **Guarantor information capture** including full name, ID number, and phone number.
- **30-minute approval window** with a live countdown and application status screen.
- **M-Pesa payout confirmation** requiring borrowers to enter and confirm their receiving phone number.
- **Active loan dashboard** displaying outstanding balance, repayment countdown, due date, and a one-tap payment option.
- **Automatic repayment reminders** sent three days before the due date, on the due date, and one day after the due date.
- **Loan history** showing previous borrowing and repayment records.
- **In-app help and support** for borrower assistance.

### Developer Dashboard (Lender)

- **Passcode-protected access** to the developer dashboard.
- **Loan approval queue** displaying borrower details, guarantor information, and loan requests.
- **One-click loan approval or rejection** with status updates reflected in the borrower's application.
- **Adjustable borrowing limits** allowing lenders to increase individual limits from KES 5,000 to KES 10,000 or more after review.
- **Repayment tracker** for marking loans as paid, sending reminders, and monitoring collections.
- **Growth analytics** displaying monthly disbursements, collections, growth percentages, and interest earned.
- **Email notifications** for new loan applications, with console-based notifications during development and SMTP integration planned for production.

---

## Architecture

BorrowBee follows a client-server architecture with separate `frontend/` and `backend/` directories to maintain a clean separation of concerns.

### Project Structure

```text
borrowbee/
├── package.json                 # Root runner using concurrently
├── README.md
├── .gitignore
│
├── frontend/                    # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/          # Header, PhoneMockup, and reusable components
│   │   ├── screens/             # Application screens
│   │   │   ├── Login
│   │   │   ├── Apply
│   │   │   ├── Agreement
│   │   │   ├── Wait
│   │   │   ├── Payout
│   │   │   ├── Active
│   │   │   ├── History
│   │   │   └── Help
│   │   ├── api.js               # API fetch wrapper
│   │   ├── App.jsx
│   │   └── index.css            # Tailwind CSS and theme tokens
│   └── vite.config.js
│
└── backend/                     # Flask + Flask-RESTful + SQLAlchemy
    ├── app.py                   # Application factory and API resource wiring
    ├── config.py
    ├── extensions.py            # Database and migration extensions
    ├── models/
    │   └── loan.py
    ├── schemas/
    │   └── loan.py
    ├── services/
    │   └── loan_service.py      # Loan business logic
    ├── resources/               # Flask-RESTful API resources
    │   ├── health.py
    │   └── loans.py
    ├── utils/
    │   ├── validators.py
    │   └── responses.py
    ├── migrations/              # Alembic database migrations
    ├── requirements.txt
    └── .env
```

### Why `resources/` Instead of `routes/`?

BorrowBee uses Flask-RESTful, which organizes API endpoints using Resource classes.

Each Resource class represents an API resource and provides methods such as:

- `get()` – Retrieve information.
- `post()` – Create or submit information.
- `put()` – Update existing information.
- `delete()` – Remove information.

These methods correspond to standard HTTP methods and provide an organized approach to building RESTful APIs without requiring traditional route-based organization.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 9, Tailwind CSS v4 |
| Backend | Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS |
| Database | SQLite (development); PostgreSQL or MySQL planned for production |
| Authentication | Passcode protection for developer dashboard; JWT planned for borrower authentication |
| Payments | M-Pesa Daraja API (planned; mocked during development) |
| Email | SMTP integration planned; console logging during development |
| API Architecture | RESTful API |
| Database Migrations | Flask-Migrate and Alembic |

---

## Color Palette

BorrowBee uses a modern financial technology-inspired color scheme built around deep teal, mint, and gold.

| Token | Hex Code | Usage |
|---|---|---|
| Primary - Deep Teal | `#004D40` | App bars and primary branding |
| Secondary - Mint/Aqua | `#00BFA5` | Progress bars and active states |
| Accent - Gold/Amber | `#FFB300` | Loan highlights and urgent alerts |
| Surface - Light Mint Gray | `#F0FDF4` | Application backgrounds |
| Ink - Deep Charcoal | `#0F172A` | Primary text |

These colors are defined in `frontend/src/index.css` using Tailwind CSS v4 theme tokens, including `--color-brand-primary`.

---

## Getting Started

Follow these instructions to set up BorrowBee locally.

### Prerequisites

Ensure the following tools are installed:

- Node.js 20.19+ or 22.12+
- Python 3.10+
- Git
- npm

### 1. Clone the Repository

```bash
git clone git@github.com:Sparrowlen1/BorrowBee.git
cd BorrowBee
```

### 2. Frontend Setup

Navigate to the frontend directory and install the dependencies.

```bash
cd frontend
npm install
cd ..
```

### 3. Backend Setup

Navigate to the backend directory, create a virtual environment, and install the required dependencies.

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install flask flask-restful flask-sqlalchemy flask-migrate flask-cors python-dotenv

pip freeze > requirements.txt

cd ..
```

**Windows PowerShell activation:**

```powershell
.\venv\Scripts\Activate.ps1
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend/` directory.

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=dev-secret-change-me
DATABASE_URL=sqlite:///borrowbee.db

NEW_USER_LIMIT=5000
INTEREST_RATE=0.15
LOAN_TERM_DAYS=30
```

**Important:** Replace the development secret key with a secure randomly generated key before deploying to production. Never commit your `.env` file or expose sensitive credentials.

### 5. Initialize the Database

Navigate to the backend directory and activate the virtual environment.

```bash
cd backend

source venv/bin/activate

flask --app app db init
flask --app app db migrate -m "init loans"
flask --app app db upgrade

cd ..
```

The database is now initialized using Flask-Migrate.

### 6. Run the Application

From the project root directory, start both the frontend and backend development servers.

```bash
npm run dev
```

Application URLs:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend Health Check | http://localhost:4000/api/health |
| Developer Dashboard | http://localhost:5173/#/admin |

---

## API Reference

All API endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/health` | Check API service status | Public |
| POST | `/loans` | Submit a loan application | Borrower |
| GET | `/loans` | Retrieve all loans and application history | Developer |
| GET | `/loans/:id` | Retrieve a specific loan and its status | Borrower |
| POST | `/loans/:id/approve` | Approve a pending loan application | Developer |
| POST | `/loans/:id/decline` | Decline a pending loan application | Developer |
| POST | `/loans/:id/disburse` | Confirm payout phone number and activate loan | Borrower |
| POST | `/loans/:id/repay` | Record a loan repayment | Borrower / Developer |

---

## Loan Lifecycle

BorrowBee uses a structured loan lifecycle to track applications from submission to repayment.

### Loan Status Flow

```text
                 ┌──────────┐
                 │ Pending  │
                 └────┬─────┘
                      │
             ┌────────┴────────┐
             │                 │
        ┌────▼─────┐     ┌─────▼────┐
        │ Approved │     │ Declined │
        └────┬─────┘     └──────────┘
             │
        ┌────▼─────┐
        │  Active  │
        └────┬─────┘
             │
        ┌────▼─────┐
        │  Repaid  │
        └──────────┘
```

### Status Descriptions

| Status | Trigger | Borrower Experience |
|---|---|---|
| Pending | Borrower submits a signed loan agreement | Under review screen with a 30-minute countdown |
| Approved | Lender approves the application | Payout phone number confirmation form |
| Active | Borrower confirms the M-Pesa receiving number | Active loan dashboard showing Day 1 of 30 |
| Repaid | Borrower completes repayment or lender records payment | Loan appears in repayment history |
| Declined | Lender rejects the application | Application declined notification |

---

## Manual Testing Flow

Use the following steps to test the complete loan application process.

### 1. Start the Application

Start both development servers from the project root.

```bash
npm run dev
```

### 2. Access the Borrower Application

Open:

http://localhost:5173

### 3. Submit a Loan Application

1. Sign in using a national ID.
2. Select a loan amount within the permitted borrowing limit.
3. Review the repayment breakdown.
4. Download the loan agreement.
5. Complete and upload the signed agreement.
6. Enter guarantor information.
7. Submit the loan application.

### 4. Access the Developer Dashboard

Open:

http://localhost:5173/#/admin

Unlock the dashboard using the development passcode:

```text
bee-admin
```

### 5. Approve the Loan

Navigate to the approval queue and approve the submitted loan application.

### 6. Confirm M-Pesa Payout Details

Return to the borrower application.

The payout screen should now be available.

Enter and confirm the M-Pesa receiving phone number to activate the loan.

### 7. Test Loan Repayment

Use the development demo control to jump to Day 27.

Verify that the repayment reminder is triggered.

Click **Pay Now** to complete the demo repayment process and move the loan into the repayment history.

---

## Roadmap

The following improvements are planned for future releases.

- [ ] **M-Pesa Daraja Integration:** Implement real STK Push payments for loan disbursement and repayment collection.
- [ ] **JWT Authentication:** Replace the development passcode system with secure JWT authentication and refresh tokens.
- [ ] **Email Notifications:** Integrate SMTP or SendGrid for loan application notifications and repayment reminders.
- [ ] **Cloud File Storage:** Integrate Amazon S3 or Cloudinary for storing signed PDF agreements.
- [ ] **Production Database:** Migrate from SQLite to PostgreSQL.
- [ ] **SMS Notifications:** Integrate Africa's Talking for automated borrower reminders.
- [ ] **Credit Scoring:** Explore credit bureau integrations such as Metropol and TransUnion Kenya.
- [ ] **KYC Verification:** Integrate identity verification services such as IPRS or Smile ID.
- [ ] **Administrative Roles:** Introduce multi-lender support with role-based permissions.
- [ ] **Audit Logging:** Maintain an immutable record of loan application and status changes.

---

## Contributing

BorrowBee is currently maintained as a solo development project under Sparrowlen1.

If contributing to the project, create a feature branch before making changes.

```bash
git checkout -b feat/your-feature

# Make your changes and commit them

git add .
git commit -m "feat: describe your changes"

git push -u origin feat/your-feature
```

---

## License

Private / All Rights Reserved.

This project is not licensed for redistribution, modification, or commercial reuse without explicit permission from the owner.

---

## Acknowledgements

BorrowBee was initially developed as an interactive design prototype for a modern Kenyan micro-lending platform and subsequently scaffolded into a full-stack application.

The platform combines React, Vite, and Tailwind CSS on the frontend with Flask-RESTful, SQLAlchemy, and Flask-Migrate on the backend.

**Project:** BorrowBee  
**Developer:** Sparrowlen1  
**Location:** Nairobi, Kenya  
**GitHub:** [Sparrowlen1](https://github.com/Sparrowlen1)
