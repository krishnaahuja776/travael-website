# 🌍 STT Holidays - Complete Travel Platform

A modern, full-stack travel booking platform with 3D effects, AI itinerary generation, budget estimation, and admin panel.

## ✨ Features

### Frontend
- **Black Theme** with cyan accent colors
- **3D Particle System** - Interactive particles responding to mouse & scroll
- **Scroll-Controlled Video** - Hero video plays based on scroll position
- **3D Tilt Effects** - Cards tilt on mouse hover
- **Parallax Layers** - Multi-layer parallax scrolling
- **Scroll Reveal Animations**
- **Responsive Design**

### Backend
- **JWT Authentication** - Secure login/register
- **AI Itinerary Generator** - Smart trip planning
- **Budget Estimator** - Calculate trip costs
- **Places Near Me** - Find nearby destinations
- **Contact Form** - Message management
- **Admin Panel** - Dashboard with analytics

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run seed    # Seed demo data
npm run dev     # Start server on port 5000
```

### Frontend
```bash
cd frontend
# Open index.html in browser or use live-server
npx live-server
```

## 📁 Structure
```
stt-holidays/
├── backend/
│   ├── server.js
│   ├── models/ (User, Place, Trip, Contact, Wishlist)
│   ├── routes/ (auth, users, places, trips, itinerary, budget, contact, wishlist, admin)
│   ├── middleware/auth.js
│   └── utils/seed.js
└── frontend/
    ├── index.html
    ├── css/style.css
    ├── js/app.js
    ├── pages/admin.html
    └── assets/
```

## 🔌 API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/register | POST | Register user |
| /api/auth/login | POST | Login user |
| /api/places | GET | Get destinations |
| /api/places/nearby | GET | Nearby places |
| /api/itinerary/generate | POST | AI itinerary |
| /api/budget/estimate | POST | Budget calc |
| /api/contact | POST | Contact form |
| /api/admin/dashboard | GET | Admin stats |

## 📞 Contact
**STT Holidays**
- 📍 516 Radha Govind Tower, Rajnagar Extension, Ghaziabad
- 📧 sttholidays@gmail.com
- 📱 +91 9953974353
