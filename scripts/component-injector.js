document.addEventListener('DOMContentLoaded', () => {
    // ... (rest of the file content remains the same) ...

    // --- Navigation System Logic (Visibility, Open/Close) ---
    function setupNavigation() {
        // ... (floatingIcon, navOverlay, closeButton definitions remain the same) ...

        // ... (Open/Close Handlers remain the same) ...

        // Visibility Control (Disappear/Reappear on scroll direction)
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (navOverlay.classList.contains('open')) return; // Do nothing if menu is open

            // CORRECTION START:
            if (scrollTop > lastScrollTop) {
                // Scrolling DOWN (User scrolls content up) - ICON DISAPPEARS
                floatingIcon.classList.add('hidden');
            } 
            else if (scrollTop < lastScrollTop) {
                // Scrolling UP (User pulls content down) - ICON REAPPEARS
                floatingIcon.classList.remove('hidden');
            }
            // CORRECTION END

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
        });
    }
});
