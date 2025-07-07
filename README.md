# LatrosFlow - Smart Hospital Management System 🏥

LatrosFlow is an IoT-integrated Hospital Management System designed to streamline patient intake, basic diagnostics, and record-keeping through an intelligent kiosk setup. It combines software, sensors, and embedded hardware to enable real-time health data collection and efficient hospital operations.

## 💡 Key Features

- 🔍 **Smart Kiosk**: Self-service patient registration and check-in.
- 🌡️ **Primary Health Screening**: Real-time vitals collection (e.g., temperature, pulse, SPO2, etc.) using sensors.
- 🩺 **Automated Triage**: Basic medical categorization based on sensor data.
- 🧾 **Database Integration**: Stores patient records and vitals securely.
- 📊 **Live Dashboard**: Admin dashboard for monitoring patient data and flow.
- 🖥️ **User Roles**: Supports admin, doctor, and patient interfaces.
- 🔐 **Secure Access**: Login system for authorized users.
- 🌐 **Web Interface**: User-friendly UI for hospital staff and patients.

## 📁 Project Structure

LatrosFlow/
│
├── Backend/ # Django/Flask backend server (APIs & DB)
├── Frontend/ # Web UI (HTML/CSS/JS or React)
├── Hardware/ # Arduino/ESP32 code & sensor integration
├── Database/ # SQL schema or DB dump
├── Media/ # Project images, diagrams, or mockups
└── README.md


## 🧰 Technologies Used

- **Frontend**: HTML5, CSS3, Bootstrap, JavaScript
- **Backend**: Python (Flask/Django)
- **Database**: MySQL / SQLite
- **IoT Hardware**: ESP32, DHT22, Pulse Sensor, IR Sensor, etc.
- **Communication**: Serial/HTTP
- **Platform**: Kiosk or Raspberry Pi/ESP32-based embedded setup

## 🚀 How to Run

### Backend Setup

```bash
cd Backend
pip install -r requirements.txt
python manage.py runserver
