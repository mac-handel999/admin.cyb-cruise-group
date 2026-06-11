/**
 * CYB CRUISE GROUP — CENTRAL SUBMISSIONS MATRIX
 * Admin Portal: Create, Manage, and Track Submissions
 */

let masterRoster = [];

// 1. INITIALIZATION: Fetch roster and start listener
async function initSubmissionsSystem() {
    try {
        const response = await fetch('class-list.enc');
        const encodedData = await response.text();
        masterRoster = JSON.parse(atob(encodedData.trim()));
        
        // Only start listening AFTER masterRoster is loaded
        listenToLiveSubmissions();
        setupSubmissionsControlListeners();
    } catch (err) {
        console.error("System Init Error:", err);
    }
}

// 2. RENDER LOGIC
function renderSubmissionsLayout(data) {
    const container = document.getElementById('submissionContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const TOTAL_STUDENTS = 241;
    const slots = data || {};

    Object.keys(slots).forEach(taskId => {
        const slot = slots[taskId];
        const students = slot.students || {};
        const submittedCount = Object.keys(students).length;
        const pendingCount = TOTAL_STUDENTS - submittedCount;

        const card = document.createElement('div');
        card.style.cssText = "background: #050b14; color: #fff; padding: 20px; border-radius: 12px; border: 1px solid #00d4ff; margin: 20px 0;";

        card.innerHTML = `
            <h3 style="color:#00d4ff;">${slot.title}</h3>
            <div style="font-size: 0.9rem; margin-bottom:15px; color:#cbd5e1; border-left: 3px solid #00d4ff; padding-left: 10px;">
                Submitted: <b>${submittedCount}</b> | Pending: <b>${pendingCount}</b> | Total: <b>${TOTAL_STUDENTS}</b>
            </div>
            
            <input type="text" placeholder="Search to add student..." onkeyup="filterSubmissions(this, '${taskId}')" 
                   style="width:90%; padding:10px; border-radius:6px; background:#0c1524; color:white; border:1px solid #1c2541;">
            <div id="filterResults-${taskId}" style="margin:10px 0;"></div>

            <table style="width:100%; margin-top:15px; border-collapse:collapse;">
                <tr style="border-bottom:1px solid #1c2541; color:#00d4ff;">
                    <th style="text-align:left;">Name</th><th>Reg Number</th><th>Time</th><th>Action</th>
                </tr>
                ${Object.values(students).map(s => `
                    <tr style="border-bottom:1px solid #0c1524;">
                        <td style="padding:8px 0;">${s.name}</td>
                        <td>${s.regNumber}</td>
                        <td>${s.timestamp}</td>
                        <td><button onclick="removeSubmissionFromCloud('${taskId}', '${s.regNumber}')" style="background:#800020; color:white; border:none; padding:4px 8px; cursor:pointer; border-radius:4px;">Remove</button></td>
                    </tr>
                `).join('')}
            </table>
            <button onclick="deleteSpecificSlot('${taskId}')" style="margin-top:15px; background:transparent; border:1px solid #800020; color:#800020; width:100%; padding:8px; cursor:pointer;">DELETE SLOT</button>
        `;
        container.appendChild(card);
    });
}

// 3. LISTENERS & DATABASE OPS
function listenToLiveSubmissions() {
    database.ref('management/submissions').on('value', (snapshot) => {
        renderSubmissionsLayout(snapshot.val());
    });
}

function filterSubmissions(input, taskId) {
    const query = input.value.toLowerCase();
    const resultsDiv = document.getElementById(`filterResults-${taskId}`);
    if (!resultsDiv) return;
    resultsDiv.innerHTML = '';
    
    if (query.length < 2) return;

    masterRoster.filter(s => s.name.toLowerCase().includes(query) || (s.regNumber && s.regNumber.includes(query)))
        .forEach(s => {
            resultsDiv.innerHTML += `
                <div style="background:#1c2541; padding:5px; margin:2px; display:flex; justify-content:space-between; border-radius:4px; font-size:0.9rem;">
                    ${s.name} (${s.regNumber})
                    <button onclick="addSubmissionViaAdmin('${taskId}', '${s.regNumber}', '${s.name}')" style="background:#00d4ff; border:none; cursor:pointer; padding:0 8px;">Add</button>
                </div>
            `;
        });
}

function addSubmissionViaAdmin(taskId, regNumber, name) {
    database.ref(`management/submissions/${taskId}/students/${regNumber}`).set({
        regNumber: regNumber,
        name: name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
}

function removeSubmissionFromCloud(taskId, regNumber) {
    if (confirm(`Remove student ${regNumber} from this submission list?`)) {
        database.ref(`management/submissions/${taskId}/students/${regNumber}`).remove();
    }
}

function deleteSpecificSlot(taskId) {
    if(confirm("DANGER: Delete this entire submission slot?")) database.ref(`management/submissions/${taskId}`).remove();
}

function setupSubmissionsControlListeners() {
    document.getElementById('deployTargetBtn').onclick = () => {
        const titleInput = document.getElementById('subTitle');
        if (!titleInput.value.trim()) return;
        database.ref('management/submissions').push({
            title: titleInput.value.trim(),
            createdAt: Date.now()
        }).then(() => titleInput.value = "");
    };

    const resetBtn = document.getElementById('resetSubmissionsBtn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (confirm("🚨 WIPE ALL SUBMISSION DATA?")) database.ref('management/submissions').remove();
        };
    }
}

// 4. EXECUTION
document.addEventListener('DOMContentLoaded', initSubmissionsSystem);
