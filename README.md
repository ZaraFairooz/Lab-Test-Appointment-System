# Lab-Test-Appointment-System

A small full-stack **lab appointment** demo: an ASP.NET Core Web API with SQLite, JWT authentication, and a React web UI.

---

## What this project does
- **Patients** — store name and date of birth (requires login).
- **Appointments** — schedule tests for a patient, status defaults to `Pending` (requires login).
- **Users** — register and log in; API issues a **JWT** used for protected routes.
- **Logging** — important actions are written with **`ILogger`** (console) for debugging and demos.
---
## Tech stack
| Layer | Technologies |
|--------|----------------|
| **Backend** | ASP.NET Core (**.NET 10**), **Minimal hosting** + **Controllers** |
| **Database** | **SQLite** (`labapp.db`), **Entity Framework Core** |
| **Auth** | **JWT Bearer** (`Microsoft.AspNetCore.Authentication.JwtBearer`), **BCrypt.Net** for password hashing |
| **API docs** | **OpenAPI** (`Microsoft.AspNetCore.OpenApi`, `/openapi/...` in Development) |
| **Frontend** | **React** (Create React App), **React Router**, **Material UI (MUI)** |
| **Tools** | **.NET SDK**, **Node.js/npm**, **Postman** (or similar) for API testing |
---
## Backend (`LabApp/`)
### Main pieces
- **`Program.cs`** — Registers EF Core (SQLite), **JWT** authentication/authorization, **CORS** (allows the React dev server), controllers, optional OpenAPI in Development.
- **`Data/AppDbContext.cs`** — `DbSet`s for `Patient`, `Appointment`, `User`, `Result`.
- **`Models/`** — Entity classes mapped to tables.
- **`Controllers/`**
  - **`AuthController`** — `POST /api/auth/register`, `POST /api/auth/login` (returns `{ token }`).
  - **`PatientsController`** — `GET` / `POST /api/patients` — **`[Authorize]`**.
  - **`AppointmentsController`** — `GET` / `POST /api/api/appointments` — **`[Authorize]`** (route is `api/appointments`).
- **`appsettings.json`** — **`Jwt:Key`** (long enough for HMAC) and **`Jwt:Issuer`** — must match token validation.
- **Migrations** — EF Core migrations under `Migrations/`; database updated with `dotnet ef database update`.
### Logging
Controllers inject **`ILogger<T>`** and log structured messages, e.g. after creating patients/appointments and on register/login (and **failed login** at **Warning** level).
---
## Frontend (`LabApp/labapp-ui/`)
- **React app** with **React Router** routes: login, register, patients, appointments.
- **`AuthContext`** — stores JWT in **`localStorage`**, attaches **`Authorization: Bearer …`** to API calls.
- **MUI** — layout (app bar), forms, tables.
- **`.env`** — `REACT_APP_API_URL=http://localhost:5066` (API base URL for `fetch`).
**Important:** Use **`http://localhost:5066`** in the browser/React (same as the default **`http`** launch profile), not a random `https` port from older tutorials.
<img width="1440" height="788" alt="Screenshot 2026-04-20 at 2 25 23 PM" src="https://github.com/user-attachments/assets/31f6fcc0-7ca2-4121-b812-a5e047820dfa" />
<img width="1440" height="788" alt="Screenshot 2026-04-20 at 2 25 19 PM" src="https://github.com/user-attachments/assets/abcac5df-9796-4741-a5c3-80737bb738af" />
<img width="1440" height="788" alt="Screenshot 2026-04-20 at 2 25 46 PM" src="https://github.com/user-attachments/assets/29a6c379-0b9e-4dbf-aa9a-843b029de1aa" />
<img width="1440" height="788" alt="Screenshot 2026-04-20 at 2 25 37 PM" src="https://github.com/user-attachments/assets/a613005d-568d-4fff-b011-d4ecf4430844" />
---
## API overview (for testing)
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET / POST | `/api/patients` | Yes (Bearer) |
| GET / POST | `/api/appointments` | Yes (Bearer) |
Register/login JSON uses **`email`** and **`passwordHash`** (tutorial naming — value is the **plain password**; server hashes on register and verifies on login).
---
## Prerequisites
- [.NET SDK](https://dotnet.microsoft.com/download) (matches **net10.0**)
- [Node.js LTS](https://nodejs.org/) and **npm**
- (Optional) **Postman** or **curl** for raw API tests
---
## How to run
### 1. Backend API
```bash
cd LabApp
dotnet run
Confirm the console shows something like: Now listening on: http://localhost:5066.

2. Frontend (second terminal)
cd LabApp/labapp-ui
npm install    # first time only
npm start
Opens http://localhost:3000. The UI talks to the API using REACT_APP_API_URL.

3. Typical flow
Register (or use an existing user).
Log in — token is saved.
Open Patients — add/list patients.
Open Appointments — pick a patient and create an appointment.
Database
File: LabApp/labapp.db (SQLite).

After model changes: add migration and update (from LabApp/):

dotnet ef migrations add <Name>
dotnet ef database update
Configuration notes
JWT key must be long enough for signing (short keys can cause runtime errors). Keep Jwt:Key and Jwt:Issuer in sync between token creation (AuthController) and validation (Program.cs).
CORS is configured for http://localhost:3000 (React dev server). Change Program.cs if you use another origin/port.

