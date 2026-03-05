# Ocean View Resort — Room Reservation System
### CIS6003 Advanced Programming | Cardiff Metropolitan University

## System Overview
A full-stack distributed web application for managing room reservations at Ocean View Resort, Galle, Sri Lanka.

## Technology Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React Vite + Tailwind CSS |
| Backend | Spring Boot 3.2 + Java 17 |
| Database | MongoDB Atlas (Cloud) |
| Security | JWT + Spring Security + BCrypt |
| Testing | JUnit 5 + Mockito |

## Features
- User Authentication with JWT (Login / Logout)
- Add, View, Update, Delete Reservations
- Guest Registration and Management
- Room Inventory Management
- Bill Calculation and Print
- Occupancy Reports (Admin only)
- Role-based Access Control (Admin / Staff)

## Design Patterns
- **Singleton** — RoomFactory
- **Factory** — RoomFactory.createRoom()
- **DAO/Repository** — MongoRepository interfaces
- **Observer** — NotificationService + AuditLogObserver

## Default Login Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | Admin@123 |
| Staff | staff | Staff@123 |

## How to Run

### Backend
```bash
cd oceanview
./mvnw spring-boot:run
```

### Frontend
```bash
cd ocean-view-frontend
npm install
npm run dev
```

## Running Tests
```bash
cd oceanview
./mvnw test
```