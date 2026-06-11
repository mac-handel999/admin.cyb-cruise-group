/**
 * CYB CRUISE GROUP — REAL-TIME ADMIN CORE
 * Direct connection to Firebase. No server-side API required.
 */
 
 
 
const db = firebase.database();

// --- READ: Listen for data changes in real-time ---
function subscribeToData(path, callback) {
    db.ref(path).on('value', (snapshot) => {
        callback(snapshot.val() || {});
    });
}

// --- CREATE: New Tasks ---
async function createNewTaskRecord(sectionKey, titleValue) {
    if (!titleValue.trim()) return alert("Title required.");
    db.ref(sectionKey).push({
        title: titleValue,
        timestamp: Date.now()
    });
}

// --- UPDATE/TOGGLE: Add/Remove Students ---
async function toggleStudentInTask(sectionKey, taskId, regNumber, action = 'add') {
    const ref = db.ref(`${sectionKey}/${taskId}/students/${regNumber}`);
    if (action === 'add') {
        ref.set({ regNumber: regNumber, timestamp: Date.now() });
    } else {
        ref.remove();
    }
}

// --- DELETE: Wipe entire section ---
async function clearSectionRecords(sectionKey) {
    if (confirm(`⚠️ WARNING: Wiping all ${sectionKey}. This is permanent.`)) {
        db.ref(sectionKey).remove();
    }
}