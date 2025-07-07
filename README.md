# LatrosFlow - Smart Hospital Management System 🏥

LatrosFlow is a smart IoT-based hospital management system that automates patient check-in, vital checks, and record-keeping through a kiosk and sensor interface.

---

## 🚀 Features

- Self-service patient kiosk
- Real-time sensor-based vital check (temperature, pulse, etc.)
- Admin and doctor dashboards
- Role-based login system
- ESP32 sensor integration
- Web-based UI

---

## 📁 Project Structure

LatrosFlow/
- frontend/
  - index.html
- backend/
  - app.py
  - requirements.txt
  - templates/
    - login.html
- hardware/
  - esp32_kiosk.ino
- database/
  - schema.sql
- media/
  - kiosk_ui.png
  - sensor_setup.png
- LICENSE
- README.md

---

## 🧰 Tech Stack

- Frontend: HTML, CSS, Bootstrap, JavaScript
- Backend: Python (Flask or Django)
- Database: MySQL / SQLite
- IoT: ESP32 with sensors (DHT22, Pulse, etc.)
- Communication: REST API / Serial

---

## ⚙️ Installation

### 1. Backend

cd backend
pip install -r requirements.txt
python app.py

Server URL: http://localhost:5000

### 2. Frontend
Open frontend/index.html in any browser

### 3. ESP32
Open hardware/esp32_kiosk.ino in Arduino IDE
Upload to ESP32
