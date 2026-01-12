class Carousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.items = document.querySelectorAll('.carousel-item');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoSlideInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch events for mobile
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Mouse events for desktop drag
        this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.track.addEventListener('mouseup', () => this.handleMouseUp());
        this.track.addEventListener('mouseleave', () => this.handleMouseUp());
        
        // Auto-slide functionality
        this.startAutoSlide();
        
        // Pause auto-slide on hover/interaction
        this.track.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.track.addEventListener('mouseleave', () => this.startAutoSlide());
        this.prevBtn.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.nextBtn.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.prevBtn.addEventListener('mouseleave', () => this.startAutoSlide());
        this.nextBtn.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Initialize position
        this.updateCarousel();
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.items.length - 1;
        this.updateCarousel();
        this.resetAutoSlide();
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        this.currentIndex = this.currentIndex < this.items.length - 1 ? this.currentIndex + 1 : 0;
        this.updateCarousel();
        this.resetAutoSlide();
    }
    
    updateCarousel() {
        this.isTransitioning = true;
        
        // Update transform
        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update active item
        this.items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
        
        // Reset transition flag after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
    
    // Touch handling
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.stopAutoSlide();
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        this.startAutoSlide();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.prevSlide();
            }
        }
    }
    
    // Mouse handling for desktop drag
    handleMouseDown(e) {
        this.dragStartX = e.clientX;
        this.dragStartTime = Date.now();
        this.stopAutoSlide();
        this.track.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.dragStartX) return;
        
        const diff = e.clientX - this.dragStartX;
        const currentTranslate = -this.currentIndex * 100;
        const newTranslate = currentTranslate + (diff / this.track.offsetWidth) * 100;
        
        // Apply resistance for smoother feel
        const resistance = 0.7;
        this.track.style.transform = `translateX(${newTranslate * resistance}%)`;
    }
    
    handleMouseUp() {
        if (!this.dragStartX) return;
        
        const diff = event.clientX - this.dragStartX;
        const dragDistance = Math.abs(diff);
        const dragTime = Date.now() - this.dragStartTime;
        
        // If drag was significant, change slide
        if (dragDistance > 100 || (dragDistance > 50 && dragTime < 300)) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        } else {
            // Return to original position
            this.updateCarousel();
        }
        
        this.dragStartX = null;
        this.track.style.cursor = 'grab';
        this.startAutoSlide();
    }
    
    // Keyboard navigation
    handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            this.prevSlide();
        } else if (e.key === 'ArrowRight') {
            this.nextSlide();
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

// Add smooth reveal animation for cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.carousel-item img');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 100);
        });
    });
});