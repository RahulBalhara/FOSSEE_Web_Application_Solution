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
