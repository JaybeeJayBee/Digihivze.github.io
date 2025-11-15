document.addEventListener('DOMContentLoaded', () => {
    const navPlaceholder = document.getElementById('nav-system-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Function to run the copyright script after the footer is loaded
    function setupFooter() {
        const currentYear = new Date().getFullYear();
        // Target the ID used in the new footer HTML
        const copyrightElement = document.getElementById('copyright-notice'); 
        if (copyrightElement) {
             copyrightElement.textContent = `© ${currentYear} Digihivze. All Rights Reserved.`;
        }
    }

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
                    setupNavigation(); // Setup Nav after injection
                }
                if (sourceFile === 'footer.html') {
                    setupFooter(); // Setup Footer text after injection
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
            floatingIcon.style.display = 'none';
        });

        closeButton.addEventListener('click', () => {
            navOverlay.classList.remove('open');
            setTimeout(() => {
                floatingIcon.style.display = 'flex'; 
            }, 500); 
        });

        // Visibility Control (Corrected Scroll Logic)
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (navOverlay.classList.contains('open')) return;

            if (scrollTop > lastScrollTop) {
                // Scrolling DOWN - ICON DISAPPEARS
                floatingIcon.classList.add('hidden');
            } 
            else if (scrollTop < lastScrollTop) {
                // Scrolling UP - ICON REAPPEARS
                floatingIcon.classList.remove('hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
        });


        // Helper function to ensure only one submenu is open at a time
        function closeOtherSubmenus(currentOpenParent) {
            document.querySelectorAll('.has-submenu.active').forEach(parent => {
                // The querySelectorAll('.has-submenu.active') needs to be scoped to the navigation menu
                // For simplicity, we compare the parent elements directly
                if (parent !== currentOpenParent) {
                    parent.classList.remove('active');
                }
            });
        }
        
        // --- NEW: Programs & Offers Submenu Toggle Logic ---
        const programsToggle = document.getElementById('programs-toggle');
        // Find the closest parent <li> with class .has-submenu for reliability
        const programsParent = programsToggle ? programsToggle.closest('.has-submenu') : null;

        if (programsToggle && programsParent) {
            programsToggle.addEventListener('click', (e) => {
                e.preventDefault(); 
                closeOtherSubmenus(programsParent);
                programsParent.classList.toggle('active');
            });
        }

        // --- Reviews Submenu Toggle Logic (Updated for single-open functionality) ---
        const reviewsToggle = document.getElementById('reviews-toggle');
        // Find the closest parent <li> with class .has-submenu for reliability
        const reviewsParent = reviewsToggle ? reviewsToggle.closest('.has-submenu') : null;

        if (reviewsToggle && reviewsParent) {
            reviewsToggle.addEventListener('click', (e) => {
                e.preventDefault(); 
                closeOtherSubmenus(reviewsParent); // Ensure 'Programs' closes if 'Reviews' opens
                reviewsParent.classList.toggle('active');
            });
        }
    }
});
