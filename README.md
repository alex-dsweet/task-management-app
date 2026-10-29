# TaskFlow --- Task Management App

A full-stack task management application built with **React, TypeScript,
Spring Boot, and MySQL**.

TaskFlow provides a dashboard for creating, viewing, updating,
searching, filtering, and deleting tasks. This project is being
developed incrementally as a full-stack portfolio project.

## Tech Stack

### Frontend

-   React 19.3.1
-   TypeScript 5.9.3
-   Vite 8.3.5
-   Tailwind CSS 4.3.3
-   Axios 1.21.0

### Backend

-   Java 17
-   Spring Boot 4.0.9
-   Spring Data JPA
-   Hibernate
-   REST API

### Database

-   MySQL

## Features

-   Create, view, update, and delete tasks (CRUD)
-   Task statuses: `TODO`, `IN_PROGRESS`, and `DONE`
-   Search and filter tasks
-   Task statistics dashboard
-   Persist task data in MySQL through the Spring Boot REST API
-   DTO-based API data transfer
-   Input validation and exception handling
-   Status-specific UI styling

## Architecture

``` text
React + TypeScript
       |
       | HTTP / REST API
       v
Spring Boot
  Controller
      |
    Service
      |
  Repository
      |
      v
    MySQL
```

The frontend communicates with the Spring Boot backend over HTTP. The
backend uses Spring Data JPA/Hibernate to access MySQL.

## Getting Started

### Prerequisites

-   Java version compatible with the backend project
-   Maven, or the Maven Wrapper if included
-   Node.js LTS and npm
-   MySQL
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/alex-dsweet/task-management-app.git
cd task-management-app
```

### 2. Configure MySQL and the backend

1.  Create a MySQL database named `task_management_db`, or use the
    database name configured in your backend.
2.  Configure the database URL, username, and password in the backend
    configuration.
3.  Keep real credentials out of Git. Prefer environment variables or a
    local, untracked configuration file.
4.  Start the Spring Boot application from your IDE or with the
    project's Maven command.

The following examples assume the backend runs on port `8080` and
exposes the task API at `/api/tasks`. Adjust these values if your
configuration differs.

### 3. Configure and run the frontend

From the frontend directory, create a `.env` file:

``` env
VITE_API_BASE_URL=http://localhost:8080/api/tasks
```

Install dependencies and start the development server:

``` bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### 4. CORS configuration

During local development, configure Spring Boot to allow requests from
the frontend origin, usually:

``` text
http://localhost:5173
```

If Vite uses a different port, update the allowed origin in the backend
configuration.
Class config in backend: CorsConfig.java

## API Endpoints

The frontend is configured around these REST API routes. Confirm them
against the current backend implementation.

  Method     Endpoint            Purpose
  ---------- ------------------- ----------------
  `GET`      `/api/tasks`        Retrieve tasks
  `POST`     `/api/tasks`        Create a task
  `PUT`      `/api/tasks/{id}`   Update a task
  `DELETE`   `/api/tasks/{id}`   Delete a task

## Project Structure

The exact folder names may vary depending on how the repository is
organized.

``` text
task-management-app/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env
├── backend/
│   ├── src/
│   └── pom.xml
├── .gitignore
└── README.md
```

## Roadmap

-   [ ] Pagination and sorting
-   [ ] Automated unit and integration tests
-   [ ] Docker setup
-   [ ] Improve API documentation
-   [ ] Deploy the application

## Development Notes

-   Do not commit `.env` files containing real credentials.
-   Do not commit `node_modules/`, build output, or generated files.
-   Keep frontend API configuration aligned with the backend port and
    endpoint paths.

## License

This project is available for personal and educational use.

For commercial use, please contact me at **conghau.contact@gmail.com** to obtain permission.
