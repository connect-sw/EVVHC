# 🛰️ Mini EVV Logger – Electronic Visit Verification System

A full-stack **Electronic Visit Verification (EVV)** prototype built by [Connect Software Solutions](https://connect-sw.com), combining **Angular + SignalR + Leaflet + ASP.NET Core**. The system captures and streams caregiver GPS positions in real time and provides a simple summary of all activities for audit and verification purposes.

---

## 🔗 Live Demos

- **Frontend (Angular):** [https://evvhc.azurewebsites.net](https://evvhc.azurewebsites.net)  
- **Backend (ASP.NET Core SignalR Hub):** [https://evvhcapi.azurewebsites.net/locationHub](https://evvhcapi.azurewebsites.net/locationHub)

---

## 📁 Source Code

- **Angular Frontend Repo:** [https://github.com/connect-sw/EVVHC](https://github.com/connect-sw/EVVHC)
- **ASP.NET Core API Repo:** [https://github.com/connect-sw/EVVHCAPI](https://github.com/connect-sw/EVVHCAPI)

---

## 📌 Key Features

- 📍 Real-time GPS location tracking using browser geolocation
- 🔁 SignalR-based WebSocket communication
- 🗺️ Leaflet-powered interactive map with caregiver and client markers
- ✅ Client-specific check-in / check-out actions
- 📂 Visit activity logs stored in localStorage
- 📊 Visit summary screen with timestamps and movement history
- 📱 Fully responsive, mobile-friendly UI

---

## 👣 User Experience Flow

1. **Login Simulation:** Choose a caregiver → starts shift
2. **Visit Logger:** Location tracked, accuracy validated, map view shown
3. **Real-Time Updates:** Multiple caregivers tracked simultaneously
4. **Check-In/Out:** With hardcoded demo clients
5. **Visit Summary:** All movements and timestamps shown

---

## ⚠️ Geolocation Requirements

Works best on **mobile browsers** with GPS enabled. Desktop browsers may report low-accuracy positions.

---

## 🧰 Technology Stack

| Layer            | Technology                      |
|------------------|----------------------------------|
| Frontend         | Angular 17+                     |
| Real-Time Comm   | SignalR (via @microsoft/signalr)|
| Map Visualization| Leaflet.js                      |
| Backend API      | ASP.NET Core (.NET 8)           |
| WebSocket Server | SignalR Hub                     |
| Visit Storage    | localStorage (temporary)        |

---

## 📦 Project Structure

```text
📁 EVVHC (Frontend - Angular)
├── home/               → Caregiver login
├── user/               → Shift & visit modules
│   ├── shift-view/     → Login / start shift
│   ├── visit-logger/   → Map tracking + actions
│   └── visit-summary/  → Summary of activities
├── services/           → Location, Visit, SignalR
📁 EVVHCAPI (Backend - .NET Core)
├── LocationHub.cs      → SignalR Hub
├── BroadcastService.cs → Location push/pull
└── Program.cs          → API setup
