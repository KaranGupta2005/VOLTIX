---
description: How to run and test the authentication system
---

# Authentication Workflow

This workflow describes how to start the authentication system and test sign up/login flows.

## Prerequisites

// turbo-all

1. Ensure MongoDB is accessible (cloud or local)
2. Start Redis:
   ```bash
   brew services start redis
   ```
3. Start the backend server:
   ```bash
   cd backend && npm run dev
   ```
4. Start the frontend:
   ```bash
   cd my-app && npm run dev
   ```

## Testing Sign Up

1. Open browser to `http://localhost:3000/SignUp`
2. Fill in Step 1 (Personal Info):
   - Full Name
   - Email (valid format)
   - Phone (+91XXXXXXXXXX format)
   - Password (min 6 characters)
3. Click **Next**
4. Fill in Step 2 (Vehicle & Location):
   - City (select from dropdown)
   - Vehicle Type (sedan/suv/hatchback/commercial)
   - Make & Model
   - Year (2015+)
   - Registration Number
   - Battery Capacity (10-200 kWh)
5. Click **Next**
6. Fill in Step 3 (Plan):
   - Select Basic, Premium, or Enterprise
7. Click **Submit**
8. On success, you will be redirected to `/login`

## Testing Login

1. Open browser to `http://localhost:3000/login`
2. Enter the email and password used during sign up
3. Click **Login**
4. On success:
   - JWT token is stored in `localStorage` as `token`
   - User data is stored as `user`
   - Redirects to `/dashboard`

## Verifying Token Storage

Open browser DevTools → Application → Local Storage → `http://localhost:3000`:

- `token`: JWT string
- `user`: JSON object with user profile

## API Endpoints Used

| Action  | Method | Endpoint            |
| ------- | ------ | ------------------- |
| Sign Up | POST   | `/api/auth/signup`  |
| Login   | POST   | `/api/auth/login`   |
| Get Me  | GET    | `/api/auth/me`      |
| Refresh | POST   | `/api/auth/refresh` |

## Troubleshooting

- **Redis errors**: Run `brew services start redis`
- **Port 5000 in use**: Backend uses port 6000 (configured in `.env`)
- **CORS errors**: Ensure `CLIENT_URL=http://localhost:3000` in backend `.env`
- **MongoDB connection**: Check `MONGO_URL` in backend `.env`
