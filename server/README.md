# ⚙️ Server App — Node.js / Express REST API

The backend API server handling database migrations, user authentication, GitHub API event syncing, and analytics computations.

## 🛠 Tech Stack

- **Runtime:** Node.js & Express.js
- **Database:** MySQL
- **Migrations & ORM:** Sequelize / Prisma
- **Authentication:** JWT & NextAuth Provider utilities
- **External APIs:** GitHub REST API

## 📁 Directory Structure

```text
server/
├── config/           # Database connection & environment configuration
├── middleware/       # Custom Express middleware (auth, error handlers)
├── controllers/      # Route request handlers & business logic
├── migrations/       # Database SQL schema migration files
├── migration/        # Custom migration scripts & utilities
├── models/           # Database models & schema definitions
├── routes/           # REST API endpoints routing
├── seeders/          # Database seed scripts for initial/dummy data
├── services/         # GitHub sync service & background jobs
├── .env              # Active local environment variables (git-ignored)
├── .env.example      # Environment variables blueprint
├── package.json      # Dependencies and server scripts
├── app.js            # Express application setup & middleware registration
└── server.js         # Entry point (starts HTTP server & database connection)