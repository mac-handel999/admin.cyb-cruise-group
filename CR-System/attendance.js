// Global storage for the class list
let classList = [];

// 1. Fetch and decode class list
async function loadClassList() {
    const response = await fetch('class-list.enc');
    const encodedData = await response.text();
    // Assuming Base64 encoding. Use atob() to decode
    const decoded = atob(encodedData);
    classList = JSON.parse(decoded); // Expecting array of objects: {name: '...', reg: '...'}
}

// 2. Updated Render Function with Search and Interactivity
function renderAttendanceLayout(data) {
    const container = document.getElementById('attendanceContainer');
    container.innerHTML = '';
    
    // Total number of students in the class
    const TOTAL_CLASS_SIZE = 241;

    Object.keys(data).forEach(taskId => {
        const sheet = data[taskId];
        const students = sheet.students || {};
        
        // Calculate counts
        const presentCount = Object.keys(students).length;
        const absentCount = TOTAL_CLASS_SIZE - presentCount;

        const card = document.createElement('div');
        card.className = 'attendance-card';
        card.style.cssText = "background: #050b14; color: #fff; padding: 20px; border-radius: 12px; border: 1px solid #00d4ff; margin: 20px auto; max-width: 600px; text-align: center;";
        
        card.innerHTML = `
            <button onclick="wipeSpecificSheet('${taskId}')" style="background:#800020; color:white; border:none; padding:2px 8px; border-radius:4px; cursor:pointer;">Delete List</button>
            <h3 style="color:#00d4ff; margin-top:10px;">${sheet.title}</h3>
            
            <div style="background:#0c1524; padding:10px; border-radius:8px; margin:10px 0; border:1px solid #1c2541;">
                <span style="margin:0 5px;">Total: <b>${TOTAL_CLASS_SIZE}</b></span> | 
                <span style="margin:0 5px; color:#00ff00;">Present: <b>${presentCount}</b></span> | 
                <span style="margin:0 5px; color:#ff4444;">Absent: <b>${absentCount}</b></span>
            </div>
            
            <input type="text" placeholder="Search to add..." onkeyup="filterStudents(this, '${taskId}')" 
                   style="width: 90%; padding: 10px; background: #0c1524; border: 1px solid #1c2541; border-radius: 8px; color: white; margin-bottom: 10px;">
            
            <div id="filterResults-${taskId}" style="margin-bottom: 15px;"></div>
            
            <div id="list-${taskId}" style="text-align: left; border-top: 1px solid #1c2541; padding-top: 10px;">
                <h4 style="color:#cbd5e1;">Logged (${presentCount}):</h4>
                ${Object.values(students).map(s => `
                    <div style="display:flex; justify-content:space-between; padding: 5px 0; border-bottom: 1px solid #0c1524;">
                        <span>${s.name} <small style="color:#00d4ff;">(${s.regNumber})</small></span>
                        <button onclick="removeStudent('${taskId}', '${s.regNumber}')" style="background:#800020; color:white; border:none; padding:2px 8px; border-radius:4px; cursor:pointer;">Remove</button>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(card);
    });
}


function filterStudents(input, taskId) {
    const query = input.value.toLowerCase();
    const resultsDiv = document.getElementById(`filterResults-${taskId}`);
    resultsDiv.innerHTML = '';

    if (query.length < 2) return;

    // ADD SAFETY CHECK: Ensure s exists and has a name property
    const filtered = classList.filter(s => {
        if (!s || typeof s.name === 'undefined') return false; 
        return s.name.toLowerCase().includes(query) || (s.regNumber && s.regNumber.toString().includes(query));
    });

    filtered.forEach(s => {
        resultsDiv.innerHTML += `
            <div style="background:#0c1524; padding:5px; margin:2px 0; border-radius:4px; display:flex; justify-content:space-between; color: white;">
                <span>${s.name} (${s.regNumber})</span>
                <button onclick="addStudent('${taskId}', '${s.regNumber}', '${s.name}')" style="background:#00d4ff; color:#000; border:none; padding:2px 8px; cursor:pointer;">Add</button>
            </div>
        `;
    });
}

function addStudent(taskId, reg, name) {
    database.ref(`attendance/${taskId}/students/${reg}`).set({ regNumber: reg, name: name });
}

function removeStudent(taskId, reg) {
    database.ref(`attendance/${taskId}/students/${reg}`).remove();
}

function wipeSpecificSheet(taskId) {
    if (!taskId) return;
    
    if (confirm("Delete this specific attendance sheet?")) {
        // Explicitly set the reference
        const ref = database.ref('attendance/' + taskId);
        ref.remove()
            .then(() => console.log("Sheet deleted successfully"))
            .catch(err => console.error("Permission Denied: " + err.message));
    }
}

// attendance.js

// Ensure this is globally available or defined in realtime-core.js
// const database = firebase.database(); 

function listenToLiveAttendance() {
    database.ref('attendance').on('value', (snapshot) => {
        const liveData = snapshot.val() || {};
        renderAttendanceLayout(liveData);
    });
}

// Ensure this matches your HTML id="lectureTitle"
function deployNewAttendanceSheet() {
    const titleInput = document.getElementById('lectureTitle');
    if (!titleInput || !titleInput.value.trim()) {
        alert("Please enter a lecture title.");
        return;
    }

    database.ref('attendance').push({
        title: titleInput.value.trim(),
        date: new Date().toLocaleDateString(),
        students: {}
    }).then(() => {
        titleInput.value = "";
        console.log("Task deployed successfully.");
    }).catch(err => console.error("Deployment failed:", err));
}

// WAIT for the DOM to be ready before calling anything
document.addEventListener('DOMContentLoaded', () => {
    // Check if the functions exist before calling
    if (typeof listenToLiveAttendance === 'function') {
        listenToLiveAttendance();
    }
    
    const createBtn = document.getElementById('createTaskBtn');
    if (createBtn) {
        createBtn.onclick = deployNewAttendanceSheet;
    }
});

function cleanupExpiredSheets(data) {
    const now = new Date().getTime();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    Object.keys(data).forEach(taskId => {
        const sheet = data[taskId];
        // Assuming you store a timestamp when creating the task
        if (sheet.createdAt && (now - sheet.createdAt > TWENTY_FOUR_HOURS)) {
            database.ref(`attendance/${taskId}`).remove();
        }
    });
}


// In attendance.js
document.getElementById('wipeSectionBtn').addEventListener('click', () => {
    if (confirm("DANGER: This will delete ALL attendance records. Proceed?")) {
        database.ref('attendance').remove()
            .then(() => alert("All records wiped."))
            .catch(err => alert("Error: " + err.message));
    }
});


// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadClassList();
    listenToLiveAttendance();
});