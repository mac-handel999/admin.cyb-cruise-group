document.addEventListener('DOMContentLoaded', () => {
    // Listen to all three primary nodes
    const paths = ['attendance', 'submissions', 'payments'];
    
    paths.forEach(path => {
        db.ref(path).on('value', (snapshot) => {
            const data = snapshot.val() || {};
            const count = Object.keys(data).length;
            
            // Update the UI based on ID (attCount, subCount, payCount)
            const element = document.getElementById(`${path.substring(0,3)}Count`);
            if (element) element.textContent = count;
            
            updateTotalTasks();
        });
    });

    function updateTotalTasks() {
        const total = (parseInt(document.getElementById('attCount').textContent) || 0) +
                      (parseInt(document.getElementById('subCount').textContent) || 0) +
                      (parseInt(document.getElementById('payCount').textContent) || 0);
        document.getElementById('totalTasksCount').textContent = `${total} Active Tasks`;
    }

    document.getElementById('closeAdminBtn').addEventListener('click', () => {
        window.location.href = '/Home.html';
    });
});