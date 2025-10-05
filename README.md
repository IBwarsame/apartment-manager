# 🏢 Apartment Manager

A full‑stack apartment management system designed to simplify property oversight — built with **React**, **Node.js**, and **MongoDB**, and containerized with **Docker** for seamless deployment.

---

## Tech Stack

**Frontend:** React (Hooks, Fetch API, modular components)  
**Backend:** Express + Node.js (RESTful API architecture)  
**Database:** MongoDB (Mongoose ODM)  
**DevOps:** Docker, Docker Compose, Kubernetes (optional manifests)  
**Styling:** Custom CSS, beige + neutral UI palette for a professional feel  

---

## Overview

Apartment Manager helps landlords or building admins manage:
- Apartment inventory  
- Tenant information  
- Lease/bookings  
- Rent payments  
- Maintenance requests  

Each module connects through a clean, RESTful API and is surfaced on a unified dashboard built for usability.

---

## Features

| Module | Description |
|:--|:--|
| **Apartments** | Create, edit, delete, and track units (available / occupied / maintenance). |
| **Tenants** | Manage tenant details, link to apartments, auto‑update unit status when leases end. |
| **Bookings** | Reflect lease agreements between units and tenants. |
| **Payments** | Record and update rent payments (pending, paid, overdue). |
| **Maintenance** | Log and track repair requests by priority and status. |
| **Dashboard** | Visual summary of occupancy, revenue, and maintenance health status. |
| **Health Check** | `/health` endpoint for container/service monitoring. |

---

## API Endpoints

| Method | Endpoint | Purpose |
|:--:|:--|:--|
| GET | `/api/apartments` | List all apartments |
| POST | `/api/apartments` | Add a new apartment |
| PUT | `/api/apartments/:id` | Update apartment info |
| DELETE | `/api/apartments/:id` | Remove an apartment |
| GET | `/api/tenants` | Fetch tenants |
| POST | `/api/tenants` | Add tenant and assign to unit |
| PUT | `/api/tenants/:id` | Edit tenant info or status |
| DELETE | `/api/tenants/:id` | Delete tenant (frees apartment) |
| GET | `/api/payments` | Retrieve all payments |
| POST | `/api/payments` | Record a rent payment |
| PUT | `/api/payments/:id` | Mark as paid / update payment |
| GET | `/api/maintenance` | View maintenance requests |
| POST | `/api/maintenance` | Report a new issue |
| PUT | `/api/maintenance/:id` | Update issue status |
| GET | `/health` | Returns service + DB status |

---

## Run Locally Using Docker

```bash
# Clone the repository
git clone https://github.com/IBwarsame/apartment-manager.git
cd apartment-manager

# Build and start services
docker-compose -f docker-compose.dev.yml up --build
```

**Services started:**
- Frontend → [http://localhost:3001](http://localhost:3001)  
- Backend → [http://localhost:8000](http://localhost:8000)  
- MongoDB → localhost:27017  

You can view live logs in Docker Desktop or your terminal window.

---

## ☸️ Kubernetes (Optional)

For local K8s deployment (kind or minikube):

```bash
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
```

The manifests spin up MongoDB and a scaled backend (`replicas: 2`) behind a ClusterIP service.

---

## UI Highlights

- Professional neutral palette (beige, dark brown, warm white)
- Simple navigation tabs  
- Responsive layout  
- Redesigned dashboard landing page for a clean portfolio‑ready look  

_The interface was built from scratch without UI frameworks to demonstrate styling and layout skills._

---

## ⚙️ Project Structure
apartment-manager/

├── backend/

│   ├── src/

│   │   ├── models/       # Mongoose schemas

│   │   ├── routes/       # Express routes

│   │   └── server.js     # Server entry

│   ├── package.json

│   └── Dockerfile

├── frontend/

│   ├── src/

│   │   ├── components/   # React component modules

│   │   ├── styles/       # Custom CSS

│   │   └── App.js

│   ├── package.json

│   └── Dockerfile

├── docker-compose.dev.yml

├── k8s/ (optional)

└── README.md

---

## Environment Variables

| Variable | Description | Default |
|:--|:--|:--|
| `MONGODB_URL` | Mongo connection string | mongodb://mongo:27017/apartment_manager |
| `PORT` | Backend port | 8000 |
| `NODE_ENV` | Environment | development |

---

## Future Enhancements

- Add role‑based authentication (Admin / Tenant).  
- Extend Dashboard with small charts (occupancy %, revenue trends).  
- Deploy live demo on Render, Railway, or Vercel + MongoDB Atlas.  
- Integrate AI module for smart rent pricing or maintenance categorization.  

---

## Author

**Ibrahim Warsame**  
📍 Full‑Stack & DevOps Engineer  
🔗 [github.com/IBwarsame](https://github.com/IBwarsame)  

---

> “Built with patience, Docker, and gallons of coffee ☕”