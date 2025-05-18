# 🛰️ Mini EVV Logger – Electronic Visit Verification System

A full-stack EVV (Electronic Visit Verification) prototype built with **Angular + SignalR + Leaflet + ASP.NET Core**. This system captures, broadcasts, and logs caregiver GPS coordinates in real time and provides a summary view of past visits.

🔗 **Live Repository:** [https://github.com/connect-sw/EVVHealthCareDemo](https://github.com/connect-sw/EVVHealthCareDemo)

---

## 📌 Features

- 📍 Real-time GPS location tracking using browser geolocation
- 🔁 SignalR-based communication for live updates
- 🗺️ Interactive Leaflet map with caregiver and client markers
- ✅ Check-in / Check-out per client
- 📂 Local storage logging of visits
- 📊 Visit summary view with timestamps
- 📱 Responsive, mobile-friendly UI

---

## 🧰 Technologies Used

| Layer           | Stack / Library              |
|----------------|------------------------------|
| Frontend       | Angular 17+                  |
| Real-time Comm | SignalR (via @microsoft/signalr) |
| Mapping        | Leaflet.js                   |
| Backend        | ASP.NET Core Web API (.NET 8)|
| WebSocket Hub  | SignalR Hub                  |
| Storage        | LocalStorage (temporary logging) |

---

## ⚠️ Geolocation Notes

This system **requires access to the browser's Geolocation API** to function properly.

If the browser does not support geolocation or the user denies permission:

- The system will alert: `"Geolocation not supported."` or `"Location error: [error message]"`
- Map and logging functionality will not be initialized
- No data will be sent or stored

To ensure functionality:

- Use a modern browser (e.g., Chrome, Edge, Firefox)
- Grant location access when prompted
- Ensure location/GPS is enabled on your device (especially on mobile)

---

## 📦 Project Structure

