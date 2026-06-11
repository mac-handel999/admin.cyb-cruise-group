/**
 * CYB CRUISE GROUP — REAL-TIME UPDATES ENGINE
 */
function fetchUpdates() {
    database.ref('updates').on('value', (snapshot) => {
        const updates = snapshot.val() || {};
        renderUpdates(updates);
    });
}

document.getElementById('deployUpdateBtn').onclick = () => {
    const heading = document.getElementById('updateTitle').value.toUpperCase();
    const content = document.getElementById('updateBody').value;
    
    if (!heading || !content) return alert("Required fields missing.");

    database.ref('updates').push({
        heading,
        content,
        author: "COURSE REP",
        date: new Date().toLocaleDateString()
    }).then(() => {
        document.getElementById('updateTitle').value = '';
        document.getElementById('updateBody').value = '';
    });
};

document.addEventListener('DOMContentLoaded', fetchUpdates);