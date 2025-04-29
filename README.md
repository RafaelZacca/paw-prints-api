# 🐾 Paw Prints API

A backend REST API built with **NestJS**, **Prisma**, and **PostgreSQL**, designed to support the Paw Prints mobile application — helping pet owners track their pets’ medical history and details with ease.

## 🧩 Features

- 🔐 JWT-based authentication via Google OAuth
- 🐶 CRUD operations for pets (with support for multiple types and breeds)
- 📸 Image support (base64-encoded), with default pet photo handling
- 🏥 Medical records module (vaccines, surgeries, checkups)
- 📦 Prisma ORM for clean database access
- ✅ Modular and extensible structure with DTOs, services, and controllers
- 🧪 Test-ready structure using Jest

## 📁 Project Structure

```bash
src/
├── auth/               # Authentication (Google + JWT)
├── pets/               # Pet-related endpoints
├── pet-images/         # Pet image uploads
├── medical-records/    # Medical record endpoints
├── shared/             # Shared like prisma service, etc.
├── users/              # User-related logic
└── main.ts             # App bootstrap
```

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/paw-prints-backend.git
cd paw-prints-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a .env file at the root of the project and add:

```bash
DATABASE_URL="postgresql://youruser:yourpassword@localhost:5432/yourdatabase?schema=public"
JWT_SECRET="your_jwt_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
API_URL="your_api_url"
WEB_REDIRECT_URL="your_web_redirect_url"
MOBILE_REDIRECT_URL="your_mobile_redirect_url"
```

### 4. Run Prisma Migrations

```bash
npx prisma migrate dev
```

To view the DB schema:

```bash
npx prisma studio
```

## 🔥 Running the App

```bash
npm run start:dev
```

The server runs by default at http://localhost:3000.

## 🧪 Running Tests

```bash
npm run test
```

## 📦 API Endpoints

All endpoints below require JWT authentication unless stated otherwise.

### ✅ Auth

- `POST /auth/google` — OAuth callback

- `GET /auth/profile` — Get current user

### 🐾 Pets

- `POST /pets` — Create a new pet

- `GET /pets` — Get all pets

- `GET /pets/:id` — Get a single pet

### 🖼️ Pet Images

- `POST /pet-images` — Upload image for a pet (first image becomes default)

### 🏥 Medical Records

- `POST /medical-records` — Create medical record for a pet

## 🔐 Authentication

This app uses Google OAuth to sign in users. JWT tokens are returned and must be sent with each request:

```bash
Authorization: Bearer <your_token>
```

## 🧑‍💻 Author

Developed by Rafael Francisco Zacca Romano

## 🐾 License

MIT
