// Base Configuration
let cachedlist = [];

// Secure One-Way Token Generation Matrix
async function generateDeviceToken(fullName, regNumber) {
    const cleanName = fullName.trim().toLowerCase();
    const cleanReg = regNumber.trim().toLowerCase();
    const serverSalt = "CYB_CRUISE_SECURE_MATRIX_2026"; // Secret app key vector
    
    const encoder = new TextEncoder().encode(cleanName + cleanReg + serverSalt);
    const buffer = await crypto.subtle.digest('SHA-256', encoder);
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Log status updates inside the login matrix box UI
function reportStatus(message, isError = false) {
    const reportBox = document.getElementById('statusReport');
    if (!reportBox) return;
    reportBox.textContent = `[>] ${message}`;
    reportBox.style.color = isError ? '#800020' : '#00d4ff';
}

// Initialize and Fetch Encoded Class list Matrix
async function initAuthHandshake() {
    try {
        reportStatus("Fetching database handshake signals...");
        const response = await fetch('class-list.enc');
        if (!response.ok) throw new Error();
        
        const encryptedData = await response.text();
        const plainText = atob(encryptedData.trim());
        cachedlist = JSON.parse(plainText);
        reportStatus("SYSTEM STATUS: SECURED & READY");
    } catch (err) {
        reportStatus("CRITICAL: Class list retrieval matrix failure.", true);
    }
}

// Handle Verification Event Processes
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const inputName = document.getElementById('studentName').value.trim();
    const inputReg = document.getElementById('studentReg').value.trim();
    
    if (!inputName || !inputReg) {
        reportStatus("Error: Integrity parameters cannot be null.", true);
        return;
    }
    
    reportStatus("Running token check against class lists...");
    
    // Cross-reference against database array strings
    const studentIdentified = cachedlist.find(student => 
        student.regNumber.toLowerCase() === inputReg.toLowerCase() &&
        student.name.toLowerCase().includes(inputName.toLowerCase())
    );
    
    if (studentIdentified) {
    reportStatus("Identity Verified! Syncing token matrix...");
    
    const sessionToken = await generateDeviceToken(inputName, inputReg);
    
    // Scramble the values using Base64 obfuscation before storing
    const scrambledToken = btoa(sessionToken);
    const scrambledReg = btoa(studentIdentified.regNumber);
    const scrambledName = btoa(studentIdentified.name);
    const scrambledTime = btoa(Date.now().toString());
    
    // Save the unreadable data blocks to localStorage
    localStorage.setItem('cruise_session_token', scrambledToken);
    localStorage.setItem('cruise_user_reg', scrambledReg);
    localStorage.setItem('cruise_user_name', scrambledName);
    localStorage.setItem('cruise_login_time', scrambledTime);
    
    setTimeout(() => {
        window.location.href = ' Home.html'; 
    }, 1000);
}
})
// Run payload load instantly on boot
initAuthHandshake();