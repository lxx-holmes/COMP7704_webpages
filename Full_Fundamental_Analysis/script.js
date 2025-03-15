document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const fontIncreaseBtn = document.getElementById('font-increase');
    const fontDecreaseBtn = document.getElementById('font-decrease');
    const darkModeToggle = document.getElementById('toggle-dark-mode');
    const bookmarkBtn = document.getElementById('bookmark-page');
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    
    // Current font size (in percentage)
    let currentFontSize = 100;
    const fontSizeStep = 10;
    const minFontSize = 80;
    const maxFontSize = 150;
    
    // Font size adjustment
    fontIncreaseBtn.addEventListener('click', function() {
        if (currentFontSize < maxFontSize) {
            currentFontSize += fontSizeStep;
            updateFontSize();
        }
    });
    
    fontDecreaseBtn.addEventListener('click', function() {
        if (currentFontSize > minFontSize) {
            currentFontSize -= fontSizeStep;
            updateFontSize();
        }
    });
    
    function updateFontSize() {
        document.querySelector('.content').style.fontSize = `${currentFontSize}%`;
    }
    
    // Dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Update icon and text
        const icon = darkModeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            darkModeToggle.innerHTML = icon.outerHTML + ' Light Mode';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            darkModeToggle.innerHTML = icon.outerHTML + ' Dark Mode';
        }
        
        // Save preference to localStorage
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    // Load dark mode preference from localStorage
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        darkModeToggle.innerHTML = icon.outerHTML + ' Light Mode';
    }
    
    // Bookmark functionality
    bookmarkBtn.addEventListener('click', function() {
        alert('Page has been bookmarked!');
        // In a real application, this would save the current page to bookmarks
    });
    
    // Smooth scrolling for table of contents links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            tocLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section id from href
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Smooth scroll to target section
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Active section detection on scroll
    window.addEventListener('scroll', debounce(function() {
        const sections = document.querySelectorAll('section');
        let currentActiveSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentActiveSection = '#' + section.getAttribute('id');
            }
        });
        
        // Update active link in table of contents
        if (currentActiveSection) {
            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentActiveSection) {
                    link.classList.add('active');
                }
            });
        }
    }, 100));
    
    // Reading progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'progress-indicator';
    progressIndicator.style.height = '3px';
    progressIndicator.style.backgroundColor = 'var(--primary-color)';
    progressIndicator.style.position = 'fixed';
    progressIndicator.style.top = '0';
    progressIndicator.style.left = '0';
    progressIndicator.style.zIndex = '1000';
    progressIndicator.style.width = '0%';
    document.body.appendChild(progressIndicator);
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / documentHeight) * 100;
        progressIndicator.style.width = `${progress}%`;
    });
    
    // Print functionality
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i> Print';
    printButton.style.marginTop = '1rem';
    document.querySelector('.tools').appendChild(printButton);
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Helper function: Debounce
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
}); 