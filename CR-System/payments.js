/**
 * CYB CRUISE GROUP — REAL-TIME PAYMENTS ENGINE
 * Key mapping: Using 'regNumber' to match class-list.enc
 */

let classList = [];

// 1. RENDER LOGIC
function renderPaymentsLayout(data) {
    const container = document.getElementById('paymentsContainer');
    if (!container) return;
    container.innerHTML = '';

    const TOTAL_CLASS_SIZE = 241;

    Object.keys(data).forEach(taskId => {
        const sheet = data[taskId];
        const students = sheet.paidStudents || {};
        
        // Calculate metrics
        const paidCount = Object.keys(students).length;
        const pendingCount = TOTAL_CLASS_SIZE - paidCount;

        const card = document.createElement('div');
        card.style.cssText = "background: #050b14; color: #fff; padding: 20px; border-radius: 12px; border: 1px solid #00d4ff; margin: 20px 0;";
        
        card.innerHTML = `
            <h3 style="color:#00d4ff; text-align:center;">${sheet.title}</h3>
            
            <div style="background:#0c1524; padding:10px; border-radius:8px; margin-bottom:15px; text-align:center; border:1px solid #1c2541;">
                <span style="margin:0 10px;">Total: <b>${TOTAL_CLASS_SIZE}</b></span> | 
                <span style="margin:0 10px; color:#00ff00;">Paid: <b>${paidCount}</b></span> | 
                <span style="margin:0 10px; color:#ff4444;">Pending: <b>${pendingCount}</b></span>
            </div>

            <input type="text" placeholder="Search student by name or reg..." onkeyup="filterStudents(this, '${taskId}')" 
                   style="width:90%; padding:10px; margin: 10px auto; display:block; border-radius:8px; border:1px solid #1c2541; background:#0c1524; color:white;">
            <div id="filterResults-${taskId}" style="margin-bottom:10px;"></div>
            
            <table style="width:100%; border-collapse:collapse; color:#fff;">
                <thead>
                    <tr style="border-bottom: 2px solid #00d4ff;">
                        <th>Name</th><th>Status</th><th>Collection</th><th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.keys(students).map(regNum => `
                        <tr style="border-bottom: 1px solid #1c2541;">
                            <td>${students[regNum].name}<br><small style="color:#666;">${regNum}</small></td>
                            <td><span style="background:#008000; padding:2px 5px; border-radius:4px; font-size:0.7rem;">PAID</span></td>
                            <td>
                                <button onclick="toggleCollection('${taskId}', '${regNum}', ${!!students[regNum].collected})" 
                                        style="cursor:pointer; background:${students[regNum].collected ? '#008000' : '#800020'}; color:white; border:none; padding:4px 8px; border-radius:4px;">
                                    ${students[regNum].collected ? 'COLLECTED' : 'NOT COLLECTED'}
                                </button>
                            </td>
                            <td><button onclick="removeEntry('${taskId}', '${regNum}')" style="background:#800020; color:white; border:2px solid red; border-radius:6px; padding:6px;">Remove</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <button onclick="wipeSpecificList('${taskId}')" style="margin-top:10px; background:#4a0e17; color:white; border:none; padding:5px; width:100%; cursor:pointer;">DELETE THIS LIST</button>
        `;
        container.appendChild(card);
    });
}

// 2. SEARCH & INTERACTION (Fixed regNumber key)
function filterStudents(input, taskId) {
    const query = input.value.toLowerCase();
    const resultsDiv = document.getElementById(`filterResults-${taskId}`);
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = '';
    if (query.length < 2) return;

    // Corrected to use s.regNumber
    const filtered = classList.filter(s => 
        s.name.toLowerCase().includes(query) || (s.regNumber && s.regNumber.toString().toLowerCase().includes(query))
    );
    
    filtered.forEach(s => {
        resultsDiv.innerHTML += `
            <div style="background:#1c2541; padding:5px; margin:2px; display:flex; justify-content:space-between; border-radius:4px; color:white;">
                ${s.name} (${s.regNumber})
                <button onclick="addPaymentEntry('${taskId}', '${s.regNumber}', '${s.name}')" style="background:#00d4ff; border:2px solid red; border-radius:5px; padding:6px; cursor:pointer;">Add</button>
            </div>
        `;
    });
}

// 3. FIREBASE OPERATIONS
function addPaymentEntry(taskId, regNumber, name) {
    database.ref(`payments/${taskId}/paidStudents/${regNumber}`).set({ name, collected: false });
}

function removeEntry(taskId, regNumber) {
    database.ref(`payments/${taskId}/paidStudents/${regNumber}`).remove();
}

function toggleCollection(taskId, regNumber, status) {
    database.ref(`payments/${taskId}/paidStudents/${regNumber}/collected`).set(!status);
}

function wipeSpecificList(taskId) {
    if(confirm("Delete this entire ledger?")) database.ref(`payments/${taskId}`).remove();
}

// 4. INIT
document.addEventListener('DOMContentLoaded', () => {
    // Load and decode class list
    fetch('class-list.enc').then(r => r.text()).then(t => classList = JSON.parse(atob(t)));

    // Real-time listener
    database.ref('payments').on('value', (s) => renderPaymentsLayout(s.val() || {}));

    // Wipe Ledger Button
    const wipeBtn = document.getElementById('wipeLedgerBtn');
    if(wipeBtn) {
        wipeBtn.onclick = () => {
            if(confirm("DANGER: This will delete ALL ledgers.")) database.ref('payments').remove();
        };
    }

    // Deploy Material Button
    document.getElementById('deployMaterialBtn').onclick = () => {
        const title = document.getElementById('payTitle').value;
        if(title) database.ref('payments').push({ title, createdAt: Date.now() });
    };
});
