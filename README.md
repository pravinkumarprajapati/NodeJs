# NodeJs

A simple to-do app built with Node.js, Express, and MongoDB. It includes:

- User registration and login
- JWT-based authentication
- CRUD operations for personal to-do items

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (optional) and configure:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/todo-app
   JWT_SECRET=change-this-secret
   ```
3. Start the app:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /auth/register` → `{ email, password }`
- `POST /auth/login` → `{ email, password }`
- `GET /todos` (auth)
- `POST /todos` (auth) → `{ title }`
- `PATCH /todos/:id` (auth) → `{ title?, completed? }`
- `DELETE /todos/:id` (auth)

Use header `Authorization: Bearer <token>` for authenticated routes.

## Tests

```bash
npm test
```
