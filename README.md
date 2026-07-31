# BLOOD4LIFE - Life For All Blood Donation & Emergency System

BLOOD4LIFE is a high-performance blood donation awareness, eligibility assessment, emergency matching, and AP district analytics platform built with **Next.js 14**, **Tailwind CSS**, **Oracle PL/SQL**, and **Node.js**.

---

## 🌟 Key Features

- **Dynamic Interactive Eligibility Assessment**: Evaluates donor health metrics and renders real-time fluid liquid wave animation inside the human body graphic.
- **AP Statewide District Dashboard**: Interactive Andhra Pradesh map visualizing blood center availability and active emergency requests.
- **Light / Dark Mode (Black Mode)**: Seamless theme switching for optimal user experience across all devices.
- **Oracle PL/SQL Enterprise Backend**: Complete stored procedure package (`PKG_BLOOD_DONATION`) handling donor registration, health scoring, and availability tracking.
- **Dual Architecture**:
  1. **Next.js Full-Stack Web App** (`apps/web`)
  2. **Standalone Pure Vanilla App** (`vanilla_app`)

---

## 📁 Repository Structure (Essential Files)

```
Life For All/
├── apps/
│   └── web/                   # Next.js Application
│       ├── app/               # Page routes & Layouts
│       ├── components/        # UI Components & Human Graphic
│       ├── lib/               # Utility functions & API clients
│       ├── public/            # Static assets (Map images, Human diagrams)
│       ├── next.config.js
│       ├── tailwind.config.ts
│       └── package.json
├── vanilla_app/               # Pure HTML/CSS/JS Standalone Application
│       ├── index.html         # Frontend entry point
│       ├── styles.css         # Styling system & dark mode tokens
│       ├── app.js             # UI Engine & Quiz logic
│       └── backend/           # Node.js + Oracle PL/SQL Middleware
│           ├── server.js      # Express API server
│           └── oracle_schema.sql # Oracle database schema & PL/SQL package
└── README.md
```

---

## 🚀 Getting Started

### 1. Next.js Web Application (`apps/web`)

```bash
cd apps/web
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. Standalone HTML Application (`vanilla_app`)

Simply open `vanilla_app/index.html` in any web browser!

### 3. Oracle PL/SQL Backend Setup

1. Execute `vanilla_app/backend/oracle_schema.sql` in Oracle SQL Developer / SQL*Plus.
2. Configure `.env` with your database credentials:
   ```env
   ORACLE_USER=blood4life
   ORACLE_PASSWORD=your_password
   ORACLE_CONN_STR=localhost:1521/XEPDB1
   PORT=5000
   ```
3. Run the API server:
   ```bash
   cd vanilla_app/backend
   npm install express oracledb dotenv cors
   node server.js
   ```

---

## 📄 License
MIT License - Created for Blood4Life Awareness initiative.
