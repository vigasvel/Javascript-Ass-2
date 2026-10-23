# TaskPilot – Student Task Manager

**U21CSP12 JavaScript Frameworks – Assignment II – Q2 (Task 2) (MERN stack, 16 marks, CO5)**  
Student: Vigasvel R (24CS241)

## Task

Build a task management application for students: add, edit and delete tasks, set task priority and completion status, use React Hooks to manage the interface, store tasks in MongoDB through a Node.js backend.

## Features

- Kanban board: Pending → In Progress → Completed, one-click move and checkbox to complete
- Priority selector (Low / Medium / High) with colour coding, due dates with Overdue / Due soon labels
- useReducer for the form, useRef to focus the title, useMemo for filtered list and statistics
- Custom hook useTasks() keeps the UI in sync with MongoDB
- Progress ring and counters for total, done, overdue and open high-priority tasks

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) + Axios – Hooks: useState, useEffect, useReducer, useMemo, useCallback, useRef, custom useTasks |
| Backend | Node.js + Express.js (REST API) |
| Database | MongoDB with Mongoose (database `vigasvel_taskpilot`) |

## How to run

> Prerequisite: Node.js and MongoDB installed (see the main README one folder up).

1. Open **two terminals**.
2. Terminal 1 – start the API:

```bash
cd server
npm install
npm start
```

   You should see `MongoDB connected` and the API on **http://localhost:5012**. Sample data is inserted automatically on the first run.
3. Terminal 2 – start the UI:

```bash
cd client
npm install
npm run dev
```

4. Open **http://localhost:5176** in the browser.
5. (Optional) Reset the sample data: inside `server` run `npm run seed`.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List tasks sorted by priority then due date (query: status, priority, subject, q) |
| GET | `/api/tasks/subjects` | Distinct subjects |
| POST | `/api/tasks` | Add a task |
| PUT | `/api/tasks/:id` | Edit a task |
| PATCH | `/api/tasks/:id/status` | Change completion status |
| DELETE | `/api/tasks/:id` | Delete a task |
| DELETE | `/api/tasks?status=Completed` | Clear all completed tasks |

## Folder structure

- `server/` – src/index.js, src/db/connection.js, src/models/task.model.js, src/routes/task.routes.js, src/middleware/validateTask.js
- `client/` – src/App.jsx, src/api.js, hooks/useTasks.js, components/TaskForm.jsx, Board.jsx, TaskCard.jsx, ProgressRing.jsx
