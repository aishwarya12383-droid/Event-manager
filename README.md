# Book Borrowing Record Manager

## Description

A small college application to manage book borrowing records. The app allows librarians or staff to keep track of which students have borrowed which books, when they were borrowed, when they are due back, and whether they have been returned. All records are stored in a JSON file on the server and managed through a simple web interface.

## CRUD Explanation

The application supports all four CRUD operations:

- **Create:** Click the "Add Record" button to open a form modal. Fill in the student name, register number, book name, book ID, borrow date, return date, and status, then submit to create a new borrowing record.
- **Read:** All records are displayed in a table on the main page showing student name, register number, book name, borrow date, return date, status, and action buttons. A search box lets you filter records by student name or book name.
- **Update:** Click the "Edit" button next to any record to open the same form pre-filled with that record's data. Change any field and save to update the record.
- **Delete:** Click the "Delete" button next to a record. A confirmation dialog appears before the record is permanently removed.

## Technology Stack

- **Frontend:** React + Vite (JavaScript)
- **Backend:** Node.js + Express
- **Data Storage:** JSON file (`backend/data/records.json`)
- **Styling:** Simple CSS (blue and white theme)

## How to Run the Project

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Start the backend server:**
   ```
   npm run server
   ```
   The API server runs on `http://localhost:5000`.

3. **Start the frontend (in a separate terminal):**
   ```
   npm run dev
   ```
   The frontend runs on `http://localhost:5173`.

4. Open `http://localhost:5173` in your browser to use the application.

## Backend API Endpoints

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | `/api/records`        | Get all records       |
| GET    | `/api/records/:id`    | Get a single record   |
| POST   | `/api/records`        | Create a new record   |
| PUT    | `/api/records/:id`    | Update a record       |
| DELETE | `/api/records/:id`    | Delete a record       |

## Project Structure

```
src/
  App.jsx
  main.jsx
  styles.css
backend/
  server.js
  data/
    records.json
package.json
README.md
```
