document.addEventListener('DOMContentLoaded', () => {
    const navPlaceholder = document.getElementById('nav-system-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Function to inject component HTML from a source file
    const injectComponent = (placeholder, sourceFile) => {
        fetch(`components/${sourceFile}`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                if (sourceFile === 'nav.html') {
                    setupNavigation(); // Call setup function after injection
                }
            })
            .catch(error => console.error(`Could not load ${sourceFile}:`, error));
    };

    // Load components
    injectComponent(navPlaceholder, 'nav.html');
    injectComponent(footerPlaceholder, 'footer.html');

    // --- Navigation System Logic (Visibility, Open/Close) ---
    function setupNavigation() {
        const floatingIcon = document.getElementById('floating-nav-icon');
        const navOverlay = document.getElementById('nav-overlay');
        const closeButton = document.getElementById('nav-close-btn');

        if (!floatingIcon || !navOverlay || !closeButton) return;

        // Open/Close Handlers
        floatingIcon.addEventListener('click', () => {
            navOverlay.classList.add('open');
            floatingIcon.style.display = 'none'; // Disappear when menu opens
        });

        closeButton.addEventListener('click', () => {
            // AI's choice: Simple Slide animation (controlled by CSS transform)
            navOverlay.classList.remove('open');
            
            // Reappear the icon after the menu slides out (0.5s transition in CSS)
            setTimeout(() => {
                floatingIcon.style.display = 'flex'; 
            }, 500); 
        });

        // Visibility Control (Disappear/Reappear on scroll direction)
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (navOverlay.classList.contains('open')) return; // Do nothing if menu is open

            // Scrolling Down (Icon is visible)
            if (scrollTop > lastScrollTop) {
                floatingIcon.classList.remove('hidden');
            } 
            // Scrolling Up (Icon is hidden)
            else if (scrollTop < lastScrollTop) {
                floatingIcon.classList.add('hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
        });
    }
});
