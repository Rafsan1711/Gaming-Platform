// ================================================
// ANIMATIONS SETUP (GSAP, Particles, AOS)
// ================================================

const Animations = {
  // Initialize all animations
  init() {
    this.initParticles();
    this.initAOS();
    this.initGSAP();
  },
  
  // Initialize Particles.js
  initParticles() {
    if (typeof particlesJS === 'undefined') return;
    
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#4a9eff'
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#4a9eff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  },
  
  // Initialize AOS (Animate On Scroll)
  initAOS() {
    if (typeof AOS === 'undefined') return;
    
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  },
  
  // Initialize GSAP animations
  initGSAP() {
    if (typeof gsap === 'undefined') return;
    
    // Add any custom GSAP animations here
    // Example: Floating animation for home title
    gsap.to('.title-line', {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.2
    });
  },
  
  // Animate view transition
  animateViewTransition(fromView, toView) {
    if (typeof gsap === 'undefined') return;
    
    const timeline = gsap.timeline();
    
    // Fade out current view
    timeline.to(fromView, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        fromView.classList.remove('active');
      }
    });
    
    // Fade in new view
    timeline.to(toView, {
      opacity: 1,
      duration: 0.3,
      onStart: () => {
        toView.classList.add('active');
      }
    });
  },
  
  // Ripple effect on click
  createRipple(element, event) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add('ripple');
    
    element.appendChild(circle);
    
    setTimeout(() => circle.remove(), 600);
  }
};

// Add ripple CSS
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
