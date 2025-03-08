document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .hero-content a, .about-text a, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply to links that start with #
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Cursor snowflake effect
    function createCursorSnowflakes() {
        let mouseX = 0;
        let mouseY = 0;
        let throttleTimer;
        let activeSnowflakes = 0;
        const maxSnowflakes = 50; // Maximum number of snowflakes to prevent performance issues
        let isMouseInHero = false;
        
        // Get hero element
        const heroElement = document.querySelector('.hero');
        
        // Track when mouse enters/leaves hero section
        if (heroElement) {
            heroElement.addEventListener('mouseenter', function() {
                isMouseInHero = true;
            });
            
            heroElement.addEventListener('mouseleave', function() {
                isMouseInHero = false;
            });
        }
        
        // Track mouse position
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Only create snowflakes if mouse is inside hero section
            if (isMouseInHero && !throttleTimer && activeSnowflakes < maxSnowflakes) {
                throttleTimer = setTimeout(function() {
                    createSnowflakeAtCursor(mouseX, mouseY);
                    throttleTimer = null;
                }, 50); // Create a snowflake every 50ms at most
            }
        });
        
        function createSnowflakeAtCursor(x, y) {
            // Create snowflake element
            const snowflake = document.createElement('div');
            snowflake.className = 'cursor-snowflake';
            
            // Randomly choose between different snowflake characters for variety
            const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❉'];
            snowflake.innerHTML = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
            
            snowflake.style.position = 'fixed';
            snowflake.style.left = x + 'px';
            snowflake.style.top = y + 'px';
            snowflake.style.color = 'white';
            snowflake.style.pointerEvents = 'none'; // Prevent interaction with snowflakes
            snowflake.style.zIndex = '1001';
            snowflake.style.textShadow = '0 0 2px rgba(255, 255, 255, 0.5)';
            
            // Randomize snowflake properties
            const size = Math.random() * 10 + 8; // Size between 8px and 18px
            const opacity = Math.random() * 0.7 + 0.3; // Opacity between 0.3 and 1
            const duration = Math.random() * 3 + 2; // Animation duration between 2s and 5s
            const horizontalMovement = (Math.random() - 0.5) * 100; // Random horizontal drift
            const rotationSpeed = Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1); // Random rotation speed and direction
            
            snowflake.style.fontSize = size + 'px';
            snowflake.style.opacity = opacity;
            
            // Add to document
            heroElement.appendChild(snowflake); // Append to hero element to contain within it
            activeSnowflakes++;
            
            // Animate the snowflake falling
            const startTime = Date.now();
            const startX = x - heroElement.getBoundingClientRect().left; // Convert to relative position
            const startY = y - heroElement.getBoundingClientRect().top; // Convert to relative position
            const heroHeight = heroElement.offsetHeight;
            
            // Change position to absolute for hero containment
            snowflake.style.position = 'absolute';
            snowflake.style.left = startX + 'px';
            snowflake.style.top = startY + 'px';
            
            function animateSnowflake() {
                // Stop animation if mouse is no longer in hero
                if (!isMouseInHero) {
                    activeSnowflakes--;
                }
                
                const elapsed = (Date.now() - startTime) / 1000; // seconds
                const progress = elapsed / duration;
                
                if (progress >= 1) {
                    // Remove snowflake when animation is complete
                    snowflake.remove();
                    activeSnowflakes--;
                    return;
                }
                
                // Calculate new position with slight oscillation for a more natural fall
                const oscillation = Math.sin(elapsed * 3) * 5;
                const newY = startY + progress * (heroHeight - startY);
                const newX = startX + progress * horizontalMovement + oscillation;
                
                // Apply rotation
                const rotation = progress * rotationSpeed;
                
                // Update snowflake position and rotation
                snowflake.style.top = newY + 'px';
                snowflake.style.left = newX + 'px';
                snowflake.style.transform = `rotate(${rotation}deg)`;
                
                // Fade out as it falls
                if (progress > 0.7) {
                    snowflake.style.opacity = opacity * (1 - ((progress - 0.7) / 0.3));
                }
                
                // Continue animation
                requestAnimationFrame(animateSnowflake);
            }
            
            requestAnimationFrame(animateSnowflake);
        }
    }
    
    // Call the function to enable cursor snowflakes
    createCursorSnowflakes();
    
    // Form validation
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'var(--primary-color)';
                } else {
                    field.style.borderColor = '#444';
                }
            });
            
            if (isValid) {
                // Normally would submit the form here
                // For demo purposes, show a success message
                const formGroups = contactForm.querySelectorAll('.form-group');
                const submitButton = contactForm.querySelector('button[type="submit"]');
                
                formGroups.forEach(group => {
                    group.style.display = 'none';
                });
                
                submitButton.style.display = 'none';
                
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: #4CAF50; margin-bottom: 20px;"></i>
                    <h3>Thank You for Your Request!</h3>
                    <p>Santa has received your message and will get back to you within 24 hours.</p>
                    <p>Happy Holidays!</p>
                `;
                
                successMessage.style.textAlign = 'center';
                successMessage.style.padding = '30px';
                
                contactForm.appendChild(successMessage);
            }
        });
    }
    
    // Add snow effect to the hero section
    function createSnowflakes() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        let isMouseInsideHero = false;
        hero.addEventListener('mouseover', () => {
            isMouseInsideHero = true;
        });
        
        hero.addEventListener('mouseout', () => {
            isMouseInsideHero = false;
        });
        
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.style.position = 'absolute';
            snowflake.style.top = '-10px';
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.opacity = Math.random() * 0.7 + 0.3;
            snowflake.style.fontSize = (Math.random() * 10 + 5) + 'px';
            snowflake.style.color = 'white';
            snowflake.style.zIndex = '1';
            snowflake.innerHTML = '❄';
            
            // Set animation properties
            snowflake.style.animation = `snowfall ${Math.random() * 5 + 5}s linear infinite`;
            
            hero.appendChild(snowflake);
            
            // Animate only if mouse is inside the hero section
            function animate() {
                if (isMouseInsideHero) {
                    snowflake.style.animationPlayState = 'running';
                } else {
                    snowflake.style.animationPlayState = 'paused';
                }
            }
            
            window.addEventListener('mousemove', animate);
        }
        
        // Add keyframes for snowfall animation
        const styleSheet = document.styleSheets[0];
        const keyframes = `
        @keyframes snowfall {
            0% {
                transform: translateY(0) rotate(0deg);
            }
            100% {
                transform: translateY(${hero.offsetHeight}px) rotate(360deg);
            }
        }`;
        
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }
    
    // Call the function to create snowflakes
    //createSnowflakes();
    
    // Initialize carousel functionality
    function initCarousel() {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-item');
        const indicators = carousel.querySelectorAll('.indicator');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Set initial height based on the active slide
        function setCarouselHeight() {
            const activeSlide = slides[currentSlide];
            const img = activeSlide.querySelector('img');
            
            // Wait for image to load to get its actual height
            if (img.complete) {
                carousel.style.height = `${activeSlide.offsetHeight}px`;
            } else {
                img.onload = function() {
                    carousel.style.height = `${activeSlide.offsetHeight}px`;
                };
            }
        }
        
        // Call initially and on window resize
        setCarouselHeight();
        window.addEventListener('resize', setCarouselHeight);
        
        // Function to update the active slide
        function goToSlide(index) {
            // Handle out of bounds indices
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            // Update current slide index
            currentSlide = index;
            
            // Update slide visibility
            slides.forEach((slide, i) => {
                if (i === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                if (i === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            // Update carousel height for the new slide
            setCarouselHeight();
        }
        
        // Event listeners for controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
            });
        }
        
        // Event listeners for indicators
        indicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                goToSlide(i);
            });
        });
        
        // Auto advance slides every 5 seconds
        let slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
        
        // Pause auto-advance when hovering over carousel
        carousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // Resume auto-advance when mouse leaves
        carousel.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        });
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goToSlide(currentSlide - 1);
            } else if (e.key === 'ArrowRight') {
                goToSlide(currentSlide + 1);
            }
        });
    }
    
    // Call the function to initialize carousel
    initCarousel();
    
    // Add a warm glow effect to the hero section
    function addWarmGlow() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const glowOverlay = document.createElement('div');
        glowOverlay.className = 'glow-overlay';
        glowOverlay.style.position = 'absolute';
        glowOverlay.style.top = '0';
        glowOverlay.style.left = '0';
        glowOverlay.style.width = '100%';
        glowOverlay.style.height = '100%';
        glowOverlay.style.background = 'radial-gradient(circle at bottom, rgba(255, 160, 0, 0.7), transparent 70%)';
        glowOverlay.style.animation = 'glowPulse 4s infinite alternate';
        glowOverlay.style.zIndex = '1002';
        
        hero.appendChild(glowOverlay);
        
        // Add keyframes for glow pulse animation
        const styleSheet = document.styleSheets[0];
        const keyframes = `
        @keyframes glowPulse {
            0% {
                opacity: 0.5;
            }
            100% {
                opacity: 0.8;
            }
        }`;
        
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }
    
    // Call the function to add warm glow
    // addWarmGlow();
    
    // Add parallax effect to the hero section
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const scrollPosition = window.scrollY;
        hero.style.backgroundPosition = `center ${scrollPosition * 0.4}px`;
    });
    
    // Add Christmas countdown
    function updateChristmasCountdown() {
        const countdownElement = document.querySelector('.hero-content');
        if (!countdownElement) return;
        
        // Create countdown container if it doesn't exist
        let countdownContainer = document.querySelector('.countdown-container');
        if (!countdownContainer) {
            // Add countdown title
            const countdownTitle = document.createElement('div');
            countdownTitle.className = 'countdown-title';
            countdownTitle.innerHTML = '<h3>Christmas Countdown</h3>';
            countdownTitle.style.color = 'var(--accent-color)';
            countdownTitle.style.textAlign = 'center';
            countdownTitle.style.marginTop = '20px';
            countdownTitle.style.fontSize = '1.2rem';
            
            // Create countdown container
            countdownContainer = document.createElement('div');
            countdownContainer.className = 'countdown-container';
            
            // Create countdown items
            const items = ['days', 'hours', 'mins', 'secs'];
            items.forEach(item => {
                const countdownItem = document.createElement('div');
                countdownItem.className = 'countdown-item';
                
                const numberSpan = document.createElement('span');
                numberSpan.className = 'countdown-number';
                numberSpan.id = `countdown-${item}`;
                numberSpan.textContent = '0';
                
                const labelSpan = document.createElement('span');
                labelSpan.className = 'countdown-label';
                labelSpan.textContent = item.charAt(0).toUpperCase() + item.slice(1);
                
                countdownItem.appendChild(numberSpan);
                countdownItem.appendChild(labelSpan);
                countdownContainer.appendChild(countdownItem);
            });
            
            countdownElement.appendChild(countdownTitle);
            countdownElement.appendChild(countdownContainer);
        }
        
        function updateCountdown() {
            const now = new Date();
            const currentYear = now.getFullYear();
            const christmasDate = new Date(currentYear, 11, 25); // December 25th
            
            // If Christmas has passed this year, calculate for next year
            if (now > christmasDate) {
                christmasDate.setFullYear(currentYear + 1);
            }
            
            const diff = christmasDate - now;
            
            // Calculate time units
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            // Update countdown display
            document.getElementById('countdown-days').textContent = days;
            document.getElementById('countdown-hours').textContent = hours;
            document.getElementById('countdown-mins').textContent = minutes;
            document.getElementById('countdown-secs').textContent = seconds;
        }
        
        // Initial update
        updateCountdown();
        
        // Update every second
        setInterval(updateCountdown, 1000);
    }
    
    // Call the function to add Christmas countdown
    updateChristmasCountdown();
});
