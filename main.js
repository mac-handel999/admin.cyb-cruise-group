// // 


//for the log out btn logic

document.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault(); // Stop the default link transition

                // Scrub credentials out of local storage matrix
                localStorage.removeItem('cruise_session_token');
                localStorage.removeItem('cruise_user_reg');
                
                alert('You Have Successfully Logged Out!!! ');


                // Redirect back to login terminal screen
                window.location.href = '/index.html';
            });
        }
    });





/**
 * CRITICAL ACCESS CONTROL ROUTE GUARD
 * Injected at runtime to check hardware configuration credentials.
 */
function verifySessionIntegrity() {
    const localToken = localStorage.getItem('cruise_session_token');
    const localReg = localStorage.getItem('cruise_user_reg');
    
    // If no session token is saved in their phone/laptop browser, boot them back out to login
    if (!localToken || !localReg) {
        window.location.href = 'index.html';
    }
}

// Run protection evaluation instantly on layout boot
verifySessionIntegrity();





//for login page, we will implement a simple authentication mechanism that checks the user's credentials against a predefined list of authorized course representatives. This will ensure that only those with the correct registration numbers can access the export functionalities.










//for user name display


document.addEventListener('DOMContentLoaded', () => {
    const badgeElement = document.getElementById('identityBadge');
    const scrambledName = localStorage.getItem('cruise_user_name');
    
    if (badgeElement && scrambledName) {
        try {
            // Unscramble the name cleanly on the fly for UI presentation
            const realName = atob(scrambledName);
            
            badgeElement.innerHTML = `<i class="fa fa-user-circle"></i> LOGGED IN AS HACKER 👨‍💻: <span style="color: #ffffff; font-weight: bold;">${realName.toUpperCase()}</span>`;
        } catch (error) {
            console.error("Identity vector corruption detected.");
        }
    }
});





// document.addEventListener('DOMContentLoaded', () => {
    
    
//     const badgeElement = document.getElementById('identityBadge');
//     const storedName = localStorage.getItem('cruise_user_name');
    
//     if (badgeElement && storedName) {
//         badgeElement.innerHTML = `<i class="fa fa-user-circle"></i> LOGGED IN AS HACKER 👨‍💻: <span style="color: #ffffff; font-weight: bold;">${storedName.toUpperCase()}</span>`;
//     }
// });







//for the class list page section

// Global memory state for tracking the student database array
let studentDatabase = [];
let currentlyFilteredStudents = []; 

/**
 * 1. DESIGNATED ADMIN CREDENTIALS
 * Add the exact registration numbers of the course reps allowed to export data here.
 */
const AUTHORIZED_ADMIN_REGS = [
    "20241470772", // Example: EMEANA IKECHUKWU FABIAN
    "20241436322"  //EXAMPLE: GODSWILL KENNETH NDUBISI
    
    // Add other authorized course rep reg numbers here
];

/**
 * 2. SYSTEM SECURITY LOGGER
 */
function logSecurityEvent(message, type = 'info') {
    const logPanel = document.getElementById('auditLog');
    if (!logPanel) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type === 'warn' ? 'log-warn' : ''}`;
    logEntry.textContent = `[${timestamp}] ${message}`;
    
    logPanel.appendChild(logEntry);
    logPanel.scrollTop = logPanel.scrollHeight;
}

/**
 * 3. DEFENSIVE INPUT SANITIZATION
 */
function sanitizeInput(rawString) {
    return rawString.replace(/[/\\&<>"']/g, function (match) {
        const specialChars = {
            '/': '&#x2F;', '\\': '&#x5C;', '&': '&amp;',
            '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;'
        };
        return specialChars[match];
    });
}

/**
 * 4. ASYNC DATABASE INITIALIZATION
 */

async function loadStudentData() {
    try {
        logSecurityEvent("Requesting secure class list matrix payload...");
        const response = await fetch('/class-list.enc'); // Or 'database.enc'
        
        if (!response.ok) {
            throw new Error(`HTTP handshake rejected. Status: ${response.status}`);
        }
        
        const obfuscatedData = await response.text();
        const decodedText = atob(obfuscatedData.trim());
        studentDatabase = JSON.parse(decodedText);
        logSecurityEvent("Security Handshake complete. Dataset decrypted into buffer.");
    } catch (error) {
        logSecurityEvent(`CRITICAL: Database load failure.`, 'warn');
        
        // 🛡️ THE SAFETY GUARD FIX:
        const resultsContainer = document.getElementById('results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `<p class="error">Class list data matrix decryption error.</p>`;
        } else {
            // Quietly log it in the console without crashing the rest of your JS thread
            console.warn("UI Status: Decryption failed, but 'results' container is not present on this viewport.");
        }
    }
}
/**
 * 6. SEARCH QUERY ENGINE
 */
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('results');
    const actionControls = document.getElementById('actionControls');
    
    if (!searchInput || !resultsContainer || !actionControls) return;

    const rawInput = searchInput.value.trim();
    resultsContainer.innerHTML = '';
    actionControls.style.display = 'none';

    if (rawInput === '') {
        resultsContainer.innerHTML = '<p class="error">Search parameter cannot be empty.</p>';
        return;
    }

    const sanitizedQuery = sanitizeInput(rawInput).toLowerCase();
    logSecurityEvent(`Executing query scan for token: "${sanitizedQuery}"`);

    currentlyFilteredStudents = studentDatabase.filter(student => {
        return student.name.toLowerCase().includes(sanitizedQuery) || 
               student.regNumber.toLowerCase().includes(sanitizedQuery);
    });

    if (currentlyFilteredStudents.length === 0) {
        resultsContainer.innerHTML = '<p class="error">No matching datasets identified.</p>';
        return;
    }

    logSecurityEvent(`Scan finalized: ${currentlyFilteredStudents.length} record(s) isolated.`);
    actionControls.style.display = 'block';

    currentlyFilteredStudents.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <h3>${student.name}</h3>
            <p><strong>S/N:</strong> ${student.sn}</p>
            <p><strong>REG No:</strong> ${student.regNumber || 'N/A'}</p>
        `;
        resultsContainer.appendChild(card);
    });
}

/**
 * 7. EXCEL EXPORT ENGINE
 */
function compileAndDownloadCSV(dataset, filename) {
    let csvContent = "data:text/csv;charset=utf-8,S/N,Registration Number,Full Name\n";

    dataset.forEach(student => {
        const row = `${student.sn},${student.regNumber || 'N/A'},"${student.name}"`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", filename);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
}

// Handler for filtered search results export (Now Protected)
function exportFilteredExcel() {
    if (!authenticateCourseRep()) return; // Auth check wrapper
    compileAndDownloadCSV(currentlyFilteredStudents, `CYB_Class_List.csv`);
    logSecurityEvent("Export Successful: Filtered data downloaded.");
}

// Protected Master Excel Export
function exportMasterExcel() {
    if (!authenticateCourseRep()) return; // Auth check wrapper
    compileAndDownloadCSV(studentDatabase, `CYB_2024/2025_CLASS_LISTS.csv`);
    logSecurityEvent("ADMIN COMPLIANCE: Full master roster file generated.");
}

/**
 * 8. PROTECTED MASTER PDF PRINTING
 */
function exportMasterPdf() {
    if (!authenticateCourseRep()) return; // Auth check wrapper

    const resultsContainer = document.getElementById('results');
    if (!resultsContainer || studentDatabase.length === 0) return;

    logSecurityEvent("ADMIN COMPLIANCE: Compiling master print preview template...");
    const originalView = resultsContainer.innerHTML;
    resultsContainer.innerHTML = '';

    studentDatabase.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <h3>${student.name}</h3>
            <p><strong>S/N:</strong> ${student.sn}</p>
            <p><strong>REG No:</strong> ${student.regNumber || 'N/A'}</p>
        `;
        resultsContainer.appendChild(card);
    });

    setTimeout(() => {
        window.print();
        resultsContainer.innerHTML = originalView;
        logSecurityEvent("Master print window closed. Local screen reset.");
    }, 500);
}

/**
 * 9. LIFECYCLE LISTENERS
 */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchBtn')?.addEventListener('click', handleSearch);
    
    // Original buttons (Now wired up cleanly to our protected filtered function)
    document.getElementById('printPdfBtn')?.addEventListener('click', exportFilteredExcel); 
    document.getElementById('exportExcelBtn')?.addEventListener('click', exportFilteredExcel);
    
    // Administrative Master controls
    document.getElementById('masterExcelBtn')?.addEventListener('click', exportMasterExcel);
    document.getElementById('masterPdfBtn')?.addEventListener('click', exportMasterPdf);

    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    loadStudentData();
});




























// // Global memory state for tracking the student database array
// let studentDatabase = [];
// let currentlyFilteredStudents = []; 

// /**
//  * 1. SYSTEM SECURITY LOGGER
//  * Outputs timestamped operations directly to the terminal panel UI.
//  */
// function logSecurityEvent(message, type = 'info') {
//     const logPanel = document.getElementById('auditLog');
//     if (!logPanel) return;
    
//     const timestamp = new Date().toLocaleTimeString();
//     const logEntry = document.createElement('div');
//     logEntry.className = `log-entry ${type === 'warn' ? 'log-warn' : ''}`;
//     logEntry.textContent = `[${timestamp}] ${message}`;
    
//     logPanel.appendChild(logEntry);
//     logPanel.scrollTop = logPanel.scrollHeight;
// }

// /**
//  * 2. DEFENSIVE INPUT SANITIZATION
//  */
// function sanitizeInput(rawString) {
//     return rawString.replace(/[/\\&<>"']/g, function (match) {
//         const specialChars = {
//             '/': '&#x2F;', '\\': '&#x5C;', '&': '&amp;',
//             '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;'
//         };
//         return specialChars[match];
//     });
// }

// /**
//  * 3. ASYNC OBFUSCATED DATA INITIALIZATION
//  * Fetches the encrypted payload string, decodes it in memory, and strips it from view.
//  */
// async function loadStudentData() {
//     try {
//         logSecurityEvent("Requesting secure roster matrix payload...");
//         const response = await fetch('class-list.enc'); // Or 'database.enc'
        
//         if (!response.ok) {
//             throw new Error(`HTTP target rejected handshake. Status: ${response.status}`);
//         }
        
//         // Read the file as raw text instead of JSON
//         const obfuscatedData = await response.text();
        
//         // Decode the Base64 string back into standard text on the fly
//         const decodedText = atob(obfuscatedData.trim());
        
//         // Parse the text into our secure memory array
//         studentDatabase = JSON.parse(decodedText);
//         logSecurityEvent("Security Handshake complete. Dataset decrypted into memory buffer.");
//     } catch (error) {
//         logSecurityEvent(`CRITICAL: Database load failure. Check encoding structure.`, 'warn');
//         console.error(error);
//         document.getElementById('results').innerHTML = `<p class="error">Data matrix decryption error.</p>`;
//     }
// }

// /**
//  * 4. SEARCH QUERY ENGINE
//  */
// function handleSearch() {
//     const searchInput = document.getElementById('searchInput');
//     const resultsContainer = document.getElementById('results');
//     const actionControls = document.getElementById('actionControls');
    
//     if (!searchInput || !resultsContainer || !actionControls) return;

//     const rawInput = searchInput.value.trim();
//     resultsContainer.innerHTML = '';
//     actionControls.style.display = 'none';

//     if (rawInput === '') {
//         resultsContainer.innerHTML = '<p class="error">Search parameter cannot be empty.</p>';
//         logSecurityEvent("Search execution aborted: Null input vector.", "warn");
//         return;
//     }

//     const sanitizedQuery = sanitizeInput(rawInput).toLowerCase();
//     logSecurityEvent(`Executing query scan for token: "${sanitizedQuery}"`);

//     currentlyFilteredStudents = studentDatabase.filter(student => {
//         return student.name.toLowerCase().includes(sanitizedQuery) || 
//                student.regNumber.toLowerCase().includes(sanitizedQuery);
//     });

//     if (currentlyFilteredStudents.length === 0) {
//         resultsContainer.innerHTML = '<p class="error">No matching datasets identified.</p>';
//         logSecurityEvent(`Scan finalized: 0 matches found.`);
//         return;
//     }

//     logSecurityEvent(`Scan finalized: ${currentlyFilteredStudents.length} record(s) isolated.`);
//     actionControls.style.display = 'block';

//     currentlyFilteredStudents.forEach(student => {
//         const card = document.createElement('div');
//         card.className = 'student-card';
//         card.innerHTML = `
//             <h3>${student.name}</h3>
//             <p><strong>S/N:</strong> ${student.sn}</p>
//             <p><strong>REG No:</strong> ${student.regNumber || 'N/A'}</p>
//         `;
//         resultsContainer.appendChild(card);
//     });
// }

// /**
//  * 5. CORE GENERATION LOOP FOR EXCEL EXPORT
//  * Compiles targeted arrays into downloadable CSV tables
//  */
// function compileAndDownloadCSV(dataset, filename) {
//     let csvContent = "data:text/csv;charset=utf-8,S/N,Registration Number,Full Name\n";

//     dataset.forEach(student => {
//         const row = `${student.sn},${student.regNumber || 'N/A'},"${student.name}"`;
//         csvContent += row + "\n";
//     });

//     const encodedUri = encodeURI(csvContent);
//     const downloadAnchor = document.createElement("a");
//     downloadAnchor.setAttribute("href", encodedUri);
//     downloadAnchor.setAttribute("download", filename);
    
//     document.body.appendChild(downloadAnchor);
//     downloadAnchor.click();
//     document.body.removeChild(downloadAnchor);
// }

// // Handler for filtered search results export
// function exportFilteredExcel() {
//     compileAndDownloadCSV(currentlyFilteredStudents, `CYB_Filtered_List.csv`);
//     logSecurityEvent("Export Successful: Filtered index saved.");
// }

// // COURSE REP TOOL: Export the entire class list at once
// function exportMasterExcel() {
//     if (studentDatabase.length === 0) {
//         logSecurityEvent("Master Export failed: Memory buffer empty.", "warn");
//         return;
//     }
//     compileAndDownloadCSV(studentDatabase, `CRUISE_GROUP_CYB_2024_MASTER_ROSTER.csv`);
//     logSecurityEvent("ADMIN ACTION: Full roster database exported to Excel CSV format.");
// }

// /**
//  * 6. COURSE REP TOOL: MASTER PDF PRINTING
//  * Temporarily displays the full class list on screen so the browser print utility saves everyone.
//  */
// function exportMasterPdf() {
//     const resultsContainer = document.getElementById('results');
//     if (!resultsContainer || studentDatabase.length === 0) return;

//     logSecurityEvent("ADMIN ACTION: Compiling master print preview stream...");
    
//     // Cache the original searched elements to restore them after printing
//     const originalView = resultsContainer.innerHTML;
//     resultsContainer.innerHTML = '';

//     // Inject all 241 students into the DOM for printing
//     studentDatabase.forEach(student => {
//         const card = document.createElement('div');
//         card.className = 'student-card';
//         card.innerHTML = `
//             <h3>${student.name}</h3>
//             <p><strong>S/N:</strong> ${student.sn}</p>
//             <p><strong>REG No:</strong> ${student.regNumber || 'N/A'}</p>
//         `;
//         resultsContainer.appendChild(card);
//     });

//     logSecurityEvent("Master manifest compiled. Launching engine print window...");
    
//     // Brief delay to let the UI update layout engines, then print
//     setTimeout(() => {
//         window.print();
//         // Restore whatever search the user was looking at previously
//         resultsContainer.innerHTML = originalView;
//         logSecurityEvent("Master print job finalized. Viewport interface normalized.");
//     }, 500);
// }

// /**
//  * 7. EVENT DRIVER LIFECYCLE LISTENERS
//  */
// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('searchBtn')?.addEventListener('click', handleSearch);
//     document.getElementById('printPdfBtn')?.addEventListener('click', exportFilteredExcel); // Links up original buttons
//     document.getElementById('exportExcelBtn')?.addEventListener('click', exportFilteredExcel);
    
//     // Hook up the new administrative Course Rep master macro buttons
//     document.getElementById('masterExcelBtn')?.addEventListener('click', exportMasterExcel);
//     document.getElementById('masterPdfBtn')?.addEventListener('click', exportMasterPdf);

//     document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter') handleSearch();
//     });

//     loadStudentData();
// });































// // Global memory state for tracking the student database array
// // let studentDatabase = [];
// // let currentlyFilteredStudents = []; 

// // /**
// //  * 1. SYSTEM SECURITY LOGGER
// //  * Outputs timestamped operations directly to the terminal panel UI.
// //  */
// // function logSecurityEvent(message, type = 'info') {
// //     const logPanel = document.getElementById('auditLog');
// //     if (!logPanel) return;
    
// //     const timestamp = new Date().toLocaleTimeString();
// //     const logEntry = document.createElement('div');
// //     logEntry.className = `log-entry ${type === 'warn' ? 'log-warn' : ''}`;
// //     logEntry.textContent = `[${timestamp}] ${message}`;
    
// //     logPanel.appendChild(logEntry);
// //     logPanel.scrollTop = logPanel.scrollHeight; // Auto-scrolls terminal to newest log
// // }

// // /**
// //  * 2. DEFENSIVE INPUT SANITIZATION
// //  * Strips potentially dangerous script characters to mitigate Cross-Site Scripting (XSS).
// //  */
// // function sanitizeInput(rawString) {
// //     return rawString.replace(/[/\\&<>"']/g, function (match) {
// //         const specialChars = {
// //             '/': '&#x2F;', '\\': '&#x5C;', '&': '&amp;',
// //             '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;'
// //         };
// //         return specialChars[match];
// //     });
// // }

// // /**
// //  * 3. ASYNC DATABASE INITIALIZATION
// //  * Fetches the JSON dataset immediately upon view loading.
// //  */
// // async function loadStudentData() {
// //     try {
// //         logSecurityEvent("Requesting student roster database payload...");
// //         const response = await fetch('class-list.json');
        
// //         if (!response.ok) {
// //             throw new Error(`HTTP target rejected handshake. Status code: ${response.status}`);
// //         }
        
// //         studentDatabase = await response.json();
// //         logSecurityEvent("Database payload mapped to memory allocation successfully.");
// //     } catch (error) {
// //         logSecurityEvent(`CRITICAL: Database load failure. ${error.message}`, 'warn');
// //         document.getElementById('results').innerHTML = `<p class="error">Database connectivity error. Check console logs.</p>`;
// //     }
// // }

// // /**
// //  * 4. SEARCH QUERY ENGINE
// //  * Filters database matching user strings and updates DOM elements.
// //  */
// // function handleSearch() {
// //     const searchInput = document.getElementById('searchInput');
// //     const resultsContainer = document.getElementById('results');
// //     const actionControls = document.getElementById('actionControls');
    
// //     if (!searchInput || !resultsContainer || !actionControls) return;

// //     const rawInput = searchInput.value.trim();
// //     resultsContainer.innerHTML = '';
// //     actionControls.style.display = 'none'; // Conceal export options until safe match

// //     if (rawInput === '') {
// //         resultsContainer.innerHTML = '<p class="error">Search parameter cannot be empty.</p>';
// //         logSecurityEvent("Search execution aborted: Null input vector.", "warn");
// //         return;
// //     }

// //     // Pass query through safety sanitization filter
// //     const sanitizedQuery = sanitizeInput(rawInput).toLowerCase();
// //     logSecurityEvent(`Executing query scan for token: "${sanitizedQuery}"`);

// //     // Scan database array memory for matches against name or registration number
// //     currentlyFilteredStudents = studentDatabase.filter(student => {
// //         return student.name.toLowerCase().includes(sanitizedQuery) || 
// //                student.regNumber.toLowerCase().includes(sanitizedQuery);
// //     });

// //     if (currentlyFilteredStudents.length === 0) {
// //         resultsContainer.innerHTML = '<p class="error">No matching datasets identified.</p>';
// //         logSecurityEvent(`Scan finalized: 0 matches found for query string.`);
// //         return;
// //     }

// //     logSecurityEvent(`Scan finalized: ${currentlyFilteredStudents.length} secure record(s) isolated.`);
// //     actionControls.style.display = 'block'; // Reveal Excel/PDF export toolbars

// //     // Inject matching student elements into the results wrapper
// //     currentlyFilteredStudents.forEach(student => {
// //         const card = document.createElement('div');
// //         card.className = 'student-card';
// //         card.innerHTML = `
// //             <h3>${student.name}</h3>
// //             <p><strong>S/N:</strong> ${student.sn}</p>
// //             <p><strong>REG No:</strong> ${student.regNumber}</p>
// //         `;
// //         resultsContainer.appendChild(card);
// //     });
// // }

// // /**
// //  * 5. MANAGEMENT EXPORT MECHANICS: EXCEL (CSV)
// //  * Parses current in-memory results directly into a downloadable Excel matrix file.
// //  */
// // function exportToExcelCSV() {
// //     if (currentlyFilteredStudents.length === 0) {
// //         logSecurityEvent("Export failed: Isolated active dataset index is null.", "warn");
// //         return;
// //     }

// //     // Construct spreadsheet headers
// //     let csvContent = "data:text/csv;charset=utf-8,S/N,Registration Number,Full Name\n";

// //     // Build row blocks separated by structural commas
// //     currentlyFilteredStudents.forEach(student => {
// //         const row = `${student.sn},${student.regNumber},"${student.name}"`;
// //         csvContent += row + "\n";
// //     });

// //     // Create a virtual anchor element to trigger browser local download automatically
// //     const encodedUri = encodeURI(csvContent);
// //     const downloadAnchor = document.createElement("a");
// //     downloadAnchor.setAttribute("href", encodedUri);
// //     downloadAnchor.setAttribute("download", `CYB_Class_List_${new Date().toISOString().slice(0, 10)}.csv`);
    
// //     document.body.appendChild(downloadAnchor);
// //     downloadAnchor.click(); // Execution trigger
// //     document.body.removeChild(downloadAnchor); // Garbage cleanup
    
// //     logSecurityEvent("System Export: Generated local Excel-compatible CSV schema sheet.");
// // }

// // /**
// //  * 6. MANAGEMENT EXPORT MECHANICS: PDF
// //  * Hooks into the native browser print rendering pipeline.
// //  */
// // function exportToPdf() {
// //     logSecurityEvent("System Trigger: Activating hardware print wrapper interface.");
// //     window.print(); // Handed off directly to the browser print engine governed by CSS media print rules
// // }

// // /**
// //  * 7. EVENT DRIVER LIFECYCLE LISTENERS
// //  */
// // document.addEventListener('DOMContentLoaded', () => {
// //     const searchBtn = document.getElementById('searchBtn');
// //     const printPdfBtn = document.getElementById('printPdfBtn');
// //     const exportExcelBtn = document.getElementById('exportExcelBtn');
// //     const searchInput = document.getElementById('searchInput');

// //     if (searchBtn) searchBtn.addEventListener('click', handleSearch);
// //     if (printPdfBtn) printPdfBtn.addEventListener('click', exportToPdf);
// //     if (exportExcelBtn) exportExcelBtn.addEventListener('click', exportToExcelCSV);
    
// //     if (searchInput) {
// //         searchInput.addEventListener('keypress', (e) => {
// //             if (e.key === 'Enter') handleSearch();
// //         });
// //     }

// //     // Fire network payload fetch setup
// //     loadStudentData();
// // });