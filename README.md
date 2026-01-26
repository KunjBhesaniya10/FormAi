# FormAi 

**The Digital Twin of an Elite Sports Coach.**
*Powered by Gemini 3 Pro & Flash.*

---

**FormAi** is a premium sports coaching ecosystem designed to democratize elite athletic training. By leveraging the **2-Million+ Token Context Window** of Gemini 3 Pro, FormAi doesn't just see a single practice session—it remembers your entire athletic history, reasoning about your biomechanics and growth just like a human pro coach.

---

## 🚀 Core Capabilities

FormAi is built on three pillars of intelligence, providing a feedback loop that covers immediate correction, deep analysis, and long-term evolution.

### 1. 🧬 Deep Biomechanical Analyst (Gemini 3 Pro)
Go beyond simple rep counting. Our **Deep Analyst** engine processes practice footage to understand the kinetic chain of your movement.
* **Spatio-Temporal Reasoning:** Identifies complex flaws like "late hip rotation" in a tennis forehand or "insufficient backlift" in cricket.
* **Root Cause Detection:** Detects not just *what* went wrong, but *why* (e.g., "Your weak wrist position is causing the ball to drift").

### 2. ⚡ Live Audio Coach (Gemini 3 Flash)
Instant feedback when you need it most—during the drill.
* **Real-Time Correction:** Using low-latency Gemini 3 Flash, the app "watches" your live stream and provides immediate audio cues (e.g., *"Stay lower!"*, *"Faster recovery!"*).
* **Hands-Free Interaction:** Fully voice-controlled, allowing athletes to ask questions to their digital coach without stopping their practice.

### 3. 🧠 Longitudinal Memory Engine
The true power of FormAi lies in its ability to **remember**.
* **Multi-Session Context:** The AI compares today's session against footage from weeks or months ago to measure precise improvements.
* **Adaptive Training Plans:** Generates dynamic 4-week evolution plans that shift automatically based on your daily performance data.
* **Smart Equipment Advisory:** *Bonus:* Intelligently suggests gear upgrades (e.g., stiffer racket rubbers) as it detects your skill level and power increasing over time.

### 4. 🧩 Dynamic Multi-Sport Architecture
A modular system designed to scale.
* **Context-Switching Personas:** The app instantly reconfigures its entire "Brain" (System Prompts, Vision Models, and UI Themes) when you switch sports.
* **Specialized Metrics:** Tracks "Spin Rate" for Table Tennis vs. "Bat Speed" for Cricket, ensuring the advice is always domain-specific and grounded in expert rulebooks.

---

## 🛠️ Tech Stack

**Client-Side (Mobile)**
* **Framework:** React Native (Expo SDK)
* **UI/UX:** Lucide Icons, Bento Grid Layouts, React Navigation
* **Features:** Real-time Camera Stream, Interactive Dashboards

**Server-Side (The Brain)**
* **Runtime:** Python 3.12+
* **API Framework:** FastAPI
* **AI Engine:** Google Gemini 3 Pro (Reasoning) & Flash (Real-time)
* **Architecture:** Modular "Sport-Schema" System

---

## 📂 Project Structure

```text
FormAi/
├── client/                 # React Native Mobile Application
│   ├── src/
│   │   ├── context/        # Session State & Dynamic Configs
│   │   ├── screens/        # Dashboard, AI Camera, Analysis UI
│   │   └── components/     # Reusable Bento Grid & Charts
│   └── App.js              # Entry Point & Navigation
│
└── server/                 # FastAPI Reasoning Engine
    ├── configs/            # Sport-Specific Biomechanical Models (JSON)
    ├── routers/            # API Endpoints (Analysis, Streaming)
    ├── utils/              # Gemini Prompts & Context Handlers
    └── main.py             # Server Entry Point
