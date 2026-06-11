/**
 * CYB CRUISE GROUP — REAL-TIME CORE ENGINE
 * Direct Firebase connection. Bypasses server API.
 */

// 1. Initialize your Firebase App
const firebaseConfig = {
    apiKey: "AIzaSyCO71lvobszEJyjrAVEjo340kypv9EV7IU",
    authDomain: "cyb-cruise-hub.firebaseapp.com",
    databaseURL: "https://cyb-cruise-hub-default-rtdb.firebaseio.com",
    projectId: "cyb-cruise-hub",
    storageBucket: "cyb-cruise-hub.firebasestorage.app",
    messagingSenderId: "793275106982",
    appId: "1:793275106982:web:75fb6f75a3afd7bb6ad667"
  };
// Only initialize if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Set the global database object that your other scripts (submission.js, etc.) use
const database = firebase.database();

console.log("🚀 Real-time Matrix Link Established.");