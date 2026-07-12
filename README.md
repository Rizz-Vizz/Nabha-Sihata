<div align="center">
  
# 🏥 Nabha Sihata
### *Transforming Rural Healthcare: Where Every Village Counts*

[![Smart India Hackathon](https://img.shields.io/badge/Smart_India_Hackathon-2025-blue.svg)](#)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react)](#)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg?logo=vite)](#)
[![Supabase](https://img.shields.io/badge/Supabase-Database_&_Auth-3ECF8E.svg?logo=supabase)](#)

*Scalable. Inclusive. Ready for Rural India.*

</div>

---

## 📖 About The Project

**Nabha Sihata** (developed by Team *Swasthya Rakshak*) is a comprehensive mobile and web-based telemedicine platform designed specifically to bridge the healthcare gap in rural India. Built for the **Smart India Hackathon 2025**, our platform seamlessly connects rural patients with certified doctors, offering video and audio consultations, digital prescriptions, and vital follow-up support.

We recognize that rural healthcare faces unique challenges such as low digital literacy, poor network connectivity, and language barriers. Nabha Sihata is engineered to overcome these hurdles with **offline capabilities, low-data usage, and full multilingual support** (English, Hindi, Punjabi), ensuring that every household has access to quality healthcare.

---

## ✨ Key Features

- 🗣️ **AI-Powered Voice Symptom Checker**: A voice-guided, multilingual interface that allows users to easily communicate their symptoms. The AI chatbot provides preliminary assessments and automatically navigates the patient to the recommended specialist.
- 👨‍👩‍👧‍👦 **Family Portal**: Designed for rural households that may share a single mobile device. Easily add and manage profiles for children, elders, and other family members from one centralized account.
- 🤰 **Women & Maternal Health**: Specialized tools to track periods and pregnancy with culturally relevant guidance, empowering women with care and safety.
- 📶 **Offline & Low-Bandwidth Access**: Critical features remain functional even in low-connectivity zones, syncing data seamlessly once the network is restored.
- 💊 **Health Records & Pharmacy**: Secure digital storage for medical records and prescriptions, along with medication reminders.
- 🪙 **MedCoins Reward System**: A blockchain-powered loyalty program to drive community engagement and incentivize regular health checkups.
- 🔔 **Automated Reminders & Alerts**: Timely notifications via Twilio and Firebase for upcoming appointments, medication, and early disease prevention.

---

## 🛠️ Technical Approach & Stack

Our architecture is built to be robust, secure, and scalable to support millions of users across rural regions.

### **Core Technologies**
- **Frontend (Web):** React.js, Vite, Tailwind CSS
- **Frontend (Mobile):** React Native
- **Backend:** Node.js, Express.js, Python (AI/ML)
- **Database & Auth:** Supabase (PostgreSQL), SQLite (Offline Caching)

### **Enabling Technologies**
- **AI & Machine Learning:** TensorFlow, Python (Predictive insights, symptom checking)
- **Communications:** WebRTC (High-quality Video/Audio consultations)
- **Notifications:** Firebase Cloud Messaging, Twilio
- **Security:** JWT, HTTPS ensuring complete data privacy
- **Deployment & Scaling:** Docker, Kubernetes, AWS/GCP

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) and `npm` installed.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YourUsername/telemedicine-app-nabha.git
   cd telemedicine-app-nabha
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   *The app will be running at `http://localhost:3000`*

### Build for Production
To generate a highly optimized production build:
```bash
npm run build
```

---

## 🌍 Impact and Benefits

* **For the Commoner:** Drastically reduces travel costs and waiting times. Early diagnosis reduces the risk of serious illnesses and empowers families with health awareness in their native language.
* **Economic Viability:** Prevents wage loss due to long medical travels and integrates local pharmacies into the digital ecosystem.
* **Technological Edge:** The AI symptom checker and voice navigation guide act as a neighborhood doctor, seamlessly integrating into the daily lives of villagers.

---

<div align="center">
  <b>Built with ❤️ for the Smart India Hackathon 2025 by Team Swasthya Rakshak</b>
</div>