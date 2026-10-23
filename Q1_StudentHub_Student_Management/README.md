# StudentHub – Student Management System

**U21CSP12 JavaScript Frameworks – Assignment II – Q1 (MERN stack, 8 marks, CO3)**  
Student: Vigasvel R (24CS241)

## Task

Develop a Student Management System using MERN Stack: React form to enter student details, REST APIs with Express.js and Node.js, student records stored in MongoDB, add / view / update / delete operations.

## Features

- React form in a modal dialog (radio buttons, range slider, checkbox) for add and edit
- Express validation middleware + central error handler (422 validation, 409 duplicate)
- Attendance bar with colour code and "Not eligible for exam" warning below 75 %
- Dashboard page with stat cards and department-wise bar chart
- Custom React hook useStudents() holds all CRUD calls (Axios)

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) + Axios |
| Backend | Node.js + Express.js (REST API) |
| Database | MongoDB with Mongoose (database `vigasvel_studenthub`) |

## How to run

> Prerequisite: Node.js and MongoDB installed (see the main README one folder up).

1. Open **two terminals**.
2. Terminal 1 – start the API:

```bash
cd server
npm install
npm start
```

   You should see `MongoDB connected` and the API on **http://localhost:5011**. Sample data is inserted automatically on the first run.
3. Terminal 2 – start the UI:

```bash
cd client
npm install
npm run dev
```

4. Open **http://localhost:5175** in the browser.
5. (Optional) Reset the sample data: inside `server` run `npm run seed`.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | List students (query: q, department, section, shortage=true) |
| GET | `/api/students/stats` | Dashboard numbers: total, average attendance, shortage, by department |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Add a student (validation middleware, 422 / 409 errors) |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

## Folder structure

- `server/` – src/index.js, src/db/connection.js, src/models/student.model.js, src/routes/student.routes.js, src/middleware/validateStudent.js, src/middleware/errorHandler.js
- `client/` – src/App.jsx, src/http.js (Axios), hooks/useStudents.js, components/Sidebar, StatCards, DeptChart, StudentRows, AttendanceBar, StudentModal
