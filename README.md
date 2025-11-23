# ⚗️ Chemical Equipment Parameter Visualizer

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Django](https://img.shields.io/badge/Backend-Django%20REST-092E20)
![PyQt5](https://img.shields.io/badge/Desktop-PyQt5-41CD52)

> A powerful hybrid application (Web + Desktop) for analyzing, visualizing, and reporting chemical equipment data.

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [1. Backend Setup](#1-backend-setup-django)
  - [2. Web App Setup](#2-web-application-react)
  - [3. Desktop App Setup](#3-desktop-application-pyqt5)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Contribution](#-contribution)

---

## 💡 About the Project
This project provides a unified analytics platform for chemical engineers. It allows users to upload equipment CSV data, automatically calculates statistical metrics (averages, distributions), visualizes the data using interactive charts, and generates downloadable PDF reports.

It features a **Centralized Architecture** where both the **React Web App** and **PyQt5 Desktop App** consume the same **Django REST API**, ensuring data consistency across platforms.

---

## 🛠 Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Django + DRF | API Logic, Auth, Data Processing |
| **Database** | SQLite | Data Persistence & History Management |
| **Analysis** | Pandas | High-performance CSV parsing & math |
| **Web Frontend** | React.js + Vite | Responsive Web Dashboard |
| **Web Charts** | Chart.js | Interactive Browser Visualizations |
| **Desktop Frontend** | PyQt5 | Native Desktop GUI |
| **Desktop Charts** | Matplotlib | Native Desktop Visualizations |
| **Reporting** | ReportLab | Dynamic PDF Generation |

---

## 📂 Project Architecture

```text
FOSSEE/
├── backend_project/        # Django REST API
│   ├── api/                # Core Business Logic
│   ├── backend/            # Project Settings
│   └── manage.py
├── frontend/               # React Web Application
│   ├── src/
│   │   ├── components/     # FileUpload, Dashboard, HistoryList
│   │   └── App.jsx
│   └── vite.config.js
└── desktop_app/            # PyQt5 Desktop Application
    └── main.py
```
🚀 Getting Started
Follow these instructions to set up the project locally on your machine.

Prerequisites
Python (v3.8 or higher)

Node.js (v16 or higher)

Git

1. Backend Setup (Django)
The backend must be running for the Web and Desktop apps to work.

Bash

# 1. Navigate to the backend folder
cd backend_project

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# 4. Install dependencies
pip install django djangorestframework pandas reportlab django-cors-headers PyQt5 requests matplotlib

# 5. Set up the Database
python manage.py migrate

# 6. Create an Admin User (Required for Login)
python manage.py createsuperuser
# (Follow the prompts to set username/password)

# 7. Start the Server
python manage.py runserver
The backend is now running at http://127.0.0.1:8000/

2. Web Application (React)
Open a new terminal (keep the backend running).

Bash

# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Development Server
npm run dev
Open your browser to the URL shown (usually http://localhost:5173).

Note: If connecting to a live backend (e.g., PythonAnywhere), ensure vite.config.js is configured with the proxy.

3. Desktop Application (PyQt5)
Open a new terminal.

Bash

# 1. Navigate to the desktop app folder
cd desktop_app

# 2. Activate the Backend Virtual Environment
# (We reuse the libraries installed in the backend step)
..\backend_project\venv\Scripts\activate

# 3. Run the Desktop App
python main.py
✨ Key Features
📊 1. Data Analysis & Visualization
CSV Upload: Drag-and-drop support for equipment data files.

Instant Metrics: Automatically calculates Flowrate, Pressure, and Temperature averages.

Visuals:

Web: Interactive Bar Charts using Chart.js.

Desktop: Static Plots using Matplotlib.

📜 2. History Management
Smart Storage: Automatically stores the last 5 uploads.

Auto-Cleanup: Older records are deleted automatically to save space.

📄 3. Reporting
PDF Generation: One-click download of detailed PDF reports for any historical dataset.

🔒 4. Security
Basic Authentication: All API endpoints are protected. Only authorized admin users can upload or view data.

📸 Screenshots
Web Dashboard
 <img width="1920" height="1080" alt="image" src="screenshots\Screenshot 2025-11-23 214241.png" />
 <img width="1920" height="1080" alt="image" src="screenshots\Screenshot 2025-11-23 214301.png" />
 <img width="1920" height="1080" alt="image" src="screenshots\Screenshot 2025-11-23 214230.png" />



Desktop Application
<img width="1920" height="1080" alt="image" src="screenshots\Screenshot 2025-11-23 214145.png" />


PDF Report
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/277b5e1e-2e31-49c1-86b2-3e9f51db4c91" />
<img width="1889" height="934" alt="image" src="https://github.com/user-attachments/assets/38191538-1ee6-4c4c-99b6-c5aee440d972" />


Built for FOSSEE Summer Fellowship Screening Task.
