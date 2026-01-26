# FormAi 🧬🏏🏓

**FormAi** is a premium, AI-powered sports coaching ecosystem that leverages the massive context window and reasoning capabilities of **Gemini 3 Pro** to democratize elite-level athletic training.

---

## 🌟 The Vision: Your 24/7 Professional Coaching Staff
Elite coaching is expensive, geographically limited, and inconsistent. **FormAi** solves this by providing every athlete with a "Digital Twin" of a world-class coach. 

Unlike traditional fitness apps that offer static routines, FormAi **sees, hears, and reasons** about your performance. It doesn't just count reps; it analyzes the kinetic chain of a Table Tennis loop or the weight distribution in a Cricket cover drive.

---

## 🔬 The "Long Context" Advantage (Powered by Gemini 3 Pro)

The core innovation of FormAi lies in utilizing Gemini 3 Pro's **2-Million+ Token Context Window**. This allows the app to move beyond "single-session" analysis into **Longitudinal Athlete Evolution**:

- **Multi-Session Memory**: Gemini can process and compare *months* of training footage in a single reasoning pass. It remembers how your elbow was tucked 3 weeks ago and compares it to your current session to measure the exact delta of improvement.
- **Dynamic Mastery Plans**: By analyzing hours of footage, FormAi identifies "Root Cause" flaws rather than symptoms. It then generates **4-Week Action Plans** that adapt based on the progress it sees in your daily video uploads.
- **Holistic Reasoning**: The AI relates biomechanical data with equipment performance. If your wrist speed has increased over 10 sessions, it will proactively suggest a stiffer bat or a heavier racket to complement your maturing power profile.

---

## 🚀 Key Features

- **Gemini 3 Pro Deep Analyst**: High-fidelity spatio-temporal reasoning for deep session reviews.
- **Gemini 3 Flash Live Coach**: Snappy, real-time audio and visual corrections during active play.
- **Bento Grid Dashboard**: A premium, "control center" aesthetic showing longitudinal growth metrics and active training streaks.
- **Pro-Grade Equipment Advisory**: Context-aware gear suggestions that evolve as your skill level increases.
- **Dynamic Multi-Sport Engine**: Unified architecture supporting various biomechanical models (Table Tennis, Cricket, and more).

---

## 🛠️ Technology Stack

- **Frontend**: React Native (Expo SDK 54), Lucide Icons, React Navigation.
- **Backend**: FastAPI (Python 3.12).
- **AI Reasoning Engine**: Gemini 3 Pro & Gemini 3 Flash.
- **Data Pipeline**: Secure video handshake & dynamic system prompts for biomechanical analysis.

---

## 📦 Project Structure

```text
FormAi/
├── client/          # React Native (Expo) Mobile Application
│   ├── src/
│   │   ├── context/ # State management (Session & Dynamic Backend URL)
│   │   └── screens/ # Premium UI screens (Bento Dashboard, AI Camera, Profile)
│   └── App.js       # Navigation & Session Provider
└── server/          # FastAPI Backend (The Reasoning Engine)
    ├── configs/     # Sport-specific Biomechanical JSON models
    ├── routers/     # API Endpoints (Deep Analysis, Onboarding, Discovery)
    └── main.py      # Entry point
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+) & Python 3.12+
- Gemini API Key with access to Google's latest reasoning models.

### 2. Backend Setup
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY="your_api_key_here"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd client
npm install
npm start
```

---

## 📱 Mobile Testing
The app is optimized for **Expo Go**. Ensure your device is on the same local network as the server for real-time video streaming and AI handshake.

---

## 🛡️ License
MIT License. Created for the future of sports.
