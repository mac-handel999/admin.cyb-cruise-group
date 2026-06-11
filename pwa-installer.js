let deferredPromptEvent;

// 1. Automatically register the Service Worker for the browser layout
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log("PWA Background Stream Operational"))
        .catch(err => console.error("Service Worker Error Context:", err));
}


// 2. Intercept Chrome's installation challenge event globally
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default browser mini-banner from popping up automatically
    e.preventDefault();
    
    // Cache the event tracking vector
    deferredPromptEvent = e;
    
    // Look for the container element on whichever page is currently active
    const installContainer = document.getElementById('pwaInstallContainer');
    if (installContainer) {
        installContainer.style.display = 'block';
    }
});

// 3. Document initialization listener to capture button clicks on the active viewport
document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('pwaInstallBtn');
    const installContainer = document.getElementById('pwaInstallContainer');

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPromptEvent) return;
            
            // Trigger Chrome's native verification prompt interface
            deferredPromptEvent.prompt();
            
            // Await user option choice response
            const { outcome } = await deferredPromptEvent.userChoice;
            console.log(`User installation decision: ${outcome}`);
            
            // Clear the variable state track—it can only be invoked once per cycle
            deferredPromptEvent = null;
            
            if (installContainer) {
                installContainer.style.display = 'none';
            }
        });
    }
});

// 4. Hide UI completely once the platform successfully docks to the desktop/home screen
window.addEventListener('appinstalled', () => {
    const installContainer = document.getElementById('pwaInstallContainer');
    if (installContainer) {
        installContainer.style.display = 'none';
    }
    console.log('CYB Cruise application successfully installed to standalone workspace.');
});
