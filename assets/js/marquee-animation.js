/**
 * Marquee Animation Controller
 * Handles content duplication and seamless looping for marquee section
 */

class MarqueeAnimation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.originalContent = null;
    this.animationDuration = 20; // Default duration in seconds
    
    if (this.container) {
      this.init();
    }
  }

  init() {
    this.setupContent();
    this.calculateAnimationDuration();
    this.startAnimation();
    this.setupEventListeners();
  }

  setupContent() {
    // Store original content
    this.originalContent = this.container.innerHTML;
    
    // Duplicate content for seamless looping
    this.duplicateContent();
  }

  duplicateContent() {
    // Get all direct children that are not already duplicates
    const originalItems = Array.from(this.container.children).filter(
      child => !child.classList.contains('marquee-content-duplicate')
    );
    
    // Create duplicates for seamless loop
    originalItems.forEach(item => {
      const duplicate = item.cloneNode(true);
      duplicate.classList.add('marquee-content-duplicate');
      this.container.appendChild(duplicate);
    });
  }

  calculateAnimationDuration() {
    // Calculate total content width
    const contentWidth = this.container.scrollWidth;
    const viewportWidth = this.container.parentElement.clientWidth;
    
    // Adjust animation duration based on content width
    // Maintain consistent speed: larger content = longer duration
    const baseSpeed = 100; // pixels per second
    this.animationDuration = Math.max(12, contentWidth / baseSpeed);
    
    // Update CSS animation duration
    this.container.style.animationDuration = `${this.animationDuration}s`;
  }

  startAnimation() {
    // Add animation class to start the marquee
    this.container.classList.add('marquee-animate');
  }

  pauseAnimation() {
    this.container.classList.add('paused');
  }

  resumeAnimation() {
    this.container.classList.remove('paused');
  }

  setupEventListeners() {
    // Hover to pause/resume
    this.container.addEventListener('mouseenter', () => {
      this.pauseAnimation();
    });

    this.container.addEventListener('mouseleave', () => {
      this.resumeAnimation();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Respect motion preferences
    this.handleMotionPreferences();
  }

  handleResize() {
    // Recalculate animation duration on resize
    this.calculateAnimationDuration();
  }

  handleMotionPreferences() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      this.container.classList.remove('marquee-animate');
    }

    // Listen for changes in motion preference
    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        this.container.classList.remove('marquee-animate');
      } else {
        this.container.classList.add('marquee-animate');
      }
    });
  }

  // Method to reset and reinitialize if needed
  reset() {
    this.container.classList.remove('marquee-animate', 'paused');
    this.container.innerHTML = this.originalContent;
    this.init();
  }
}

// Initialize marquee animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const marqueeAnimation = new MarqueeAnimation('marqueeContent');
  
  // Make it globally accessible for debugging
  window.marqueeAnimation = marqueeAnimation;
});