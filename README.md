# AssetFlow ERP

AssetFlow is a modern, high-performance Enterprise Asset & Resource Management (ERP) system. Designed with a strict multi-tenant architecture and secure, role-based workflows, it allows enterprises to orchestrate, allocate, and audit corporate hardware and software lifecycles in real-time.

---

## Tech Stack

- **Frontend**: React (18+), TypeScript, TailwindCSS, Vite, Axios, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, ts-node.
- **Database**: PostgreSQL (connected via Prisma ORM).
- **Architecture**: Company-isolated Multi-tenancy (each transaction filtered strictly by `companyId` extracted from JWT claims).

---

## Core Concepts & Architecture

### 1. Multi-Tenant Isolation
All system tables (Users, Assets, AssetRequests, Maintenances, Notifications) are mapped to a central `Company` database table via a foreign key relation. Authentication payloads encode the tenant `companyId`, ensuring that queries can never leak cross-tenant information.

### 2. Company Code Registration Flow
1. **First User Registration**: A business owner signs up via `/register-company`.
2. **Company Generation**: The system creates a unique, human-readable `Company Code` (e.g. `ASF-ABCD`) and registers the user as the system `ADMIN` with Employee Code `ADM-0001`.
3. **Employee Login**: Subsequent employees can log into that tenant space using the shared `Company Code` + their system-generated `Employee Code` + `Password`.

### 3. Role Hierarchy & Workflows

```
   ┌──────────────────────────────────────────────────────────┐
   │                        ADMINISTRATOR                     │
   │  • Company registration    • Add employees               │
   │  • Promote/Demote roles    • Activate/Deactivate users   │
   └─────────────────────────────┬────────────────────────────┘
                                 ▼
   ┌──────────────────────────────────────────────────────────┐
   │                        ASSET MANAGER                     │
   │  • Register assets         • Approve/Reject requests     │
   │  • Resolve tickets         • Dynamic company reports     │
   └─────────────────────────────┬────────────────────────────┘
                                 ▼
   ┌──────────────────────────────────────────────────────────┐
   │                       DEPARTMENT HEAD                    │
   │  • Department assets       • Oversee team logistics      │
   │  • Raise tickets           • Request approvals           │
   └─────────────────────────────┬────────────────────────────┘
                                 ▼
   ┌──────────────────────────────────────────────────────────┐
   │                          EMPLOYEE                        │
   │  • Personal allocations    • Raise asset requests        │
   │  • Report asset issues     • Read user profile           │
   └──────────────────────────────────────────────────────────┘
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL database instance

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables in a `.env` file:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/assetflow?schema=public"
   JWT_SECRET="your-jwt-secure-secret-key"
   ```
4. Push the Prisma database schema:
   ```bash
   npx prisma db push
   ```
5. Start the development backend:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Vite variables in `.env` (optional, defaults to port 5000):
   ```env
   VITE_API_BASE_URL="http://localhost:5000/api"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173/`.

---

## API Endpoints Reference

All application endpoints (except authentication and signup) require a valid JWT token attached to the `Authorization: Bearer <token>` header.

### 🔑 Authentication (`/api/auth`)
- `POST /register/admin` — Register a new company and return admin keys.
- `POST /login` — Log in using `companyCode`, `employeeCode`, and `password`.
- `GET /me` — Retrieve active profile from JWT payload.
- `POST /employees` — [Admin Only] Create a new employee.
- `GET /employees` — List all company employees.
- `PATCH /employees/:id/role` — [Admin Only] Update an employee's access role.
- `PATCH /employees/:id/toggle-active` — [Admin Only] Block or activate an employee.

### 📦 Asset Manager (`/api/asset-manager`)
- `GET /dashboard` — Retrieve inventory counts, value aggregates, and pending request cues.
- `GET /assets` — Paginated asset list with name search and status filters.
- `POST /assets` — Create a new inventory record.
- `DELETE /assets/:id` — Delete an asset.
- `PATCH /assets/:id/assign` — Assign a free asset to an employee.
- `PATCH /assets/:id/unassign` — Unassign an asset back to available inventory.
- `GET /requests` — Get all company asset requests.
- `PATCH /requests/:id/resolve` — Approve or reject requests (with auto-assign logic).
- `GET /maintenance` — Get all company maintenance logs.
- `POST /maintenance` — Log a new asset issue.
- `PATCH /maintenance/:id` — Update status of a ticket (Pending -> In Progress -> Completed).
- `GET /reports` — Aggregate data for financial reports.

### 🏢 Department Head (`/api/dept-head`)
- `GET /dashboard` — View department metrics and recent team activity.
- `GET /assets` — List assets assigned to employees in the department.
- `GET /employees` — View employee roster and assigned hardware totals.
- `GET /requests` — View department asset requests.
- `GET /maintenance` — View department maintenance tickets.
- `POST /maintenance` — Raise a new maintenance ticket.
- `GET /reports` — Generate department-specific analytical charts.
- `GET /notifications` — Roster of messages.
- `PATCH /notifications/:id/read` — Mark notification read.

### 👤 Employee (`/api/employee`)
- `GET /dashboard` — Dashboard overview.
- `GET /my-assets` — List of personal hardware currently assigned.
- `GET /requests` — List personal asset requests.
- `POST /requests` — Request a new asset from the company pool.
- `GET /notifications` — List personal notifications.
- `PATCH /notifications/:id/read` — Mark notification read.
- `GET /profile` — Retrieve detailed user profile info.
---

# Project Workflow

## Company Registration

```text
Company Owner
      │
      ▼
Register Company
      │
Company Created
      │
Admin Account Generated
      │
Company Code Generated
      │
Admin Logs In
```

---

## Employee Onboarding

```text
Employee
      │
Receives Company Code
      │
Admin Creates Employee
      │
Employee Receives Employee Code
      │
First Login
      │
Change Password
      │
Access Dashboard
```

---

## Asset Lifecycle

```text
Available
    │
    ▼
Allocated
    │
    ├──────────────┐
    ▼              ▼
Transfer      Maintenance
    │              │
    ▼              ▼
Returned    Under Maintenance
    │              │
    └──────► Available
```

---

# System Modules

## Company Administration

Responsible for complete organizational setup.

### Features

- Company Registration
- Department Management
- Employee Management
- Role Assignment
- User Activation
- Company Settings

---

## Asset Management

Responsible for inventory lifecycle.

### Features

- Asset Registration
- Asset Allocation
- Asset Return
- Asset Transfer
- Asset Categories
- Asset History
- QR Code Ready Architecture

---

## Resource Booking

Employees can reserve shared resources.

Examples

- Conference Rooms
- Projectors
- Testing Devices
- Shared Laptops
- Company Vehicles

### Booking Rules

- Time-slot based
- Auto conflict detection
- No overlapping reservations
- Booking history
- Booking notifications

---

## Maintenance Module

Tracks asset health.

Workflow

Employee

↓

Raise Ticket

↓

Asset Manager Approval

↓

Under Maintenance

↓

Completed

↓

Available Again

---

## Audit Module

Periodic verification of company assets.

Features

- Audit Cycle Creation
- Auditor Assignment
- Asset Verification
- Missing Asset Detection
- Discrepancy Report
- Audit History

---

## Reports

Dynamic analytics powered by PostgreSQL.

Includes

- Asset Distribution
- Department Utilization
- Maintenance Trends
- Asset Allocation
- Request Analytics
- Employee Activity
- Company Dashboard KPIs

---

## Notifications

Real-time system notifications.

Examples

- Asset Assigned
- Booking Approved
- Maintenance Updated
- Audit Assigned
- Asset Returned
- Role Changed

---

# Security

## Authentication

- JWT Authentication
- Password Hashing using bcrypt
- Stateless Sessions

---

## Authorization

Role Based Access Control (RBAC)

Roles

- Administrator
- Asset Manager
- Department Head
- Employee

Every API validates

- JWT
- Role
- Company Ownership

---

## Multi-Tenant Isolation

Every query automatically filters

```sql
WHERE companyId = <jwt.companyId>
```

ensuring complete isolation between companies.

---

# Database Design

Core Entities

```text
Company
│
├── Users
│
├── Departments
│
├── Assets
│
├── Asset Categories
│
├── Asset Requests
│
├── Maintenance Tickets
│
├── Notifications
│
└── Reports
```

---

# Folder Structure

```text
AssetFlow

backend
│
├── prisma
├── src
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── middlewares
│   ├── validators
│   ├── routes
│   ├── utils
│   └── config
│
frontend
│
├── src
│   ├── pages
│   │   ├── admin
│   │   ├── assetManager
│   │   ├── departmentHead
│   │   └── employee
│   │
│   ├── components
│   ├── services
│   ├── hooks
│   ├── layouts
│   └── routes
│
database
│
├── schema.sql
├── constraints.sql
├── indexes.sql
├── seed.sql
└── triggers.sql
```

---

# Future Scope

- QR Code Asset Tracking
- Barcode Integration
- RFID Support
- Mobile Application
- Email Notifications
- Microsoft Teams Integration
- Slack Integration
- Predictive Maintenance using AI
- Asset Depreciation Reports
- Procurement Module
- Vendor Management
- Purchase Orders
- Warranty Tracking

---

# Contributors

| Name | Responsibility |
|------|----------------|
| Harsh Patange | Backend Development, Department Head Module |
| Janhvi Kelkar | Authentication & JWT |
| Varnika Mandal Chaurasia | Database Design |
| Bhagyesh Chaudhari | Frontend Development |

---

# License

MIT License

---

# Built for

🏆 Odoo Hackathon 2026

Enterprise Asset & Resource Management System

Made with ❤️ using React, Node.js, PostgreSQL and Prisma.
