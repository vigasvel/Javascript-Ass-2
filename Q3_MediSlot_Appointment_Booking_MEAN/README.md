# MediSlot – Appointment Booking (MEAN)

**U21CSP12 JavaScript Frameworks – Assignment II – Q3 (Task 2) (MEAN stack, 16 marks, CO4)**  
Student: Vigasvel R (24CS241)

## Task

Design an appointment booking application: create Angular forms for patient registration, display doctors and their available appointment slots, develop REST APIs for appointment management, store patient and appointment records in MongoDB.

## Features

- Angular Reactive Form for patient registration with field-level error messages
- Auto-generated Patient ID card and direct link to booking (query parameter → component input)
- Doctors filtered by specialization; slots shown per date as free / booked / over
- Server rules: doctor working day, no past slots, no double booking, token number per day
- Appointments page with filters and Complete / Cancel actions (Angular Router, 3 pages)

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Angular 20 (standalone components, Router, Reactive Forms, signals) |
| Backend | Node.js + Express.js (REST API) |
| Database | MongoDB with Mongoose (database `vigasvel_medislot`) |

## How to run

> Prerequisite: Node.js and MongoDB installed (see the main README one folder up).

1. Open **two terminals**.
2. Terminal 1 – start the API:

```bash
cd server
npm install
npm start
```

   You should see `MongoDB connected` and the API on **http://localhost:5013**. Sample data is inserted automatically on the first run.
3. Terminal 2 – start the UI:

```bash
cd client
npm install
npm start
```

4. Open **http://localhost:4201** in the browser.
5. (Optional) Reset the sample data: inside `server` run `npm run seed`.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/doctors` | List doctors (query: specialization) |
| GET | `/api/doctors/:id/slots?date=` | Slots for a date with available / booked flags |
| POST | `/api/patients` | Register a patient (generates Patient ID) |
| GET | `/api/patients/:patientId` | Find a patient |
| POST | `/api/appointments` | Book a slot (blocks double booking – 409) |
| GET | `/api/appointments` | List (query: patientId, date, status) |
| PATCH | `/api/appointments/:id/status` | Cancel or complete an appointment |
| DELETE | `/api/appointments/:id` | Delete an appointment |

## Folder structure

- `server/` – src/index.js, src/models/doctor.model.js, patient.model.js, appointment.model.js, src/routes/doctor.routes.js, patient.routes.js, appointment.routes.js
- `client/` – app.routes.ts, core/api.service.ts, core/models.ts, pages/patient-register, pages/book-appointment, pages/appointments
