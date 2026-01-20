
# CanRoad Real-time Migration Guide 🚀

This app is currently "Real-time Ready" using a **BroadcastChannel** simulation. To make it work across different devices over the internet, follow these steps in VS Code:

## 1. Environment Setup
Create a `.env` file in your root directory:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_GEMINI_API_KEY=your_gemini_key
```

## 2. Install Dependencies
Run in your VS Code terminal:
```bash
npm install firebase @google/genai
```

## 3. The "Big Switch" (JobContext.tsx)
In `src/contexts/JobContext.tsx`, you will see a section for `BroadcastChannel`. 
**The Prompt to use with Cursor/AI:**
> "Replace the BroadcastChannel logic in JobContext.tsx with Firebase Firestore. Use `onSnapshot` to listen to the 'jobs' collection for real-time updates across all users."

## 4. Live GPS Tracking
**The Prompt to use with Cursor/AI:**
> "In MechanicDashboard.tsx, when location sharing is active, update a 'locations' collection in Firestore with the mechanic's current ID and coordinates. In LiveTracking.tsx, subscribe to this specific document so the customer sees the car move live on the map."

## 5. Deployment
Once tested, you can deploy using:
```bash
npm run build
firebase deploy
```

Now you have a fully functional Uber-like app for roadside assistance!
