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
                    highlightCurrentPage(); // *** NEW: Highlight the current page after setup ***
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


    // --- NEW: Highlight Current Page Logic (CORRECTED FOR CLEAN URLs) ---
    function highlightCurrentPage() {
        const currentPathname = window.location.pathname.toLowerCase();
        
        // 1. Determine the path segment (e.g., /creations-hub/ or /faq/)
        //    For the home page ('/'), this results in '/'
        //    For project pages (/RepoName/page), it gets the segment after the repo name.
        const pathSegments = currentPathname.split('/').filter(segment => segment.length > 0);
        
        // Use the last segment (or treat home as '/')
        let currentPageSegment = '/';
        if (pathSegments.length > 0) {
            // This handles Project Pages like /Repo/page
            currentPageSegment = '/' + pathSegments[pathSegments.length - 1]; 
        }

        // Handle index.html or empty path for the root (Home)
        if (currentPageSegment === '/index.html' || currentPageSegment === '//') {
            currentPageSegment = '/';
        }
        
        const menuLinks = document.querySelectorAll('.overlay-menu a');

        menuLinks.forEach(link => {
            let linkPath = link.getAttribute('href').toLowerCase();
            
            // Normalize linkPath: Ensure it ends with a slash if it's not the root.
            if (linkPath !== '/' && !linkPath.endsWith('/')) {
                linkPath = linkPath + '/';
            }
            
            // Normalize current segment for comparison (e.g., ensures /faq/ matches /faq/)
            const normalizedCurrentSegment = currentPageSegment.endsWith('/') ? currentPageSegment : currentPageSegment + '/';
            
            // Comparison: Check if the link path (e.g., /creations-hub/) is contained in the current URL path.
            // This is robust for both /project/page and /page/ URLs.
            
            if (currentPathname === linkPath || currentPathname.includes(linkPath) && linkPath !== '/') {
                 // For all links except Home, if the path matches, activate it
                 link.classList.add('active-page');
            } else if (linkPath === '/' && (currentPathname === '/' || currentPathname === '/index.html')) {
                // Special check for Home page activation
                link.classList.add('active-page');
            }
        });
    }

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
                if (parent !== currentOpenParent) {
                    parent.classList.remove('active');
                }
            });
        }
        
        // --- Programs & Offers Submenu Toggle Logic ---
        const programsToggle = document.getElementById('programs-toggle');
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
        const reviewsParent = reviewsToggle ? reviewsToggle.closest('.has-submenu') : null;

        if (reviewsToggle && reviewsParent) {
            reviewsToggle.addEventListener('click', (e) => {
                e.preventDefault(); 
                closeOtherSubmenus(reviewsParent); 
                reviewsParent.classList.toggle('active');
            });
        }
    }
});
