// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scrolling (Lenis)
const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Scroll tracking for character flip direction
let scrollDirection = 'down';
let lastScrollY = 0;

lenis.on('scroll', (e) => {
    if (e.actualScroll > lastScrollY) {
        scrollDirection = 'down';
    } else if (e.actualScroll < lastScrollY) {
        scrollDirection = 'up';
    }
    lastScrollY = e.actualScroll;
});

// DOM Elements
const heroImage = document.querySelector('.hero-image');
const lottieElement = document.querySelector('.lottie');

// Load Lottie Animation (autoplay: false so scroll drives the frames)
const lottyAnimation = lottie.loadAnimation({
    container: lottieElement,
    renderer: 'svg',
    loop: true,
    autoplay: false,
    path: './public/duck.json', // Path to your Lottie JSON file
});

let lottieReady = false;
lottyAnimation.addEventListener('DOMLoaded', () => {
    lottieReady = true;
});

// Target compact thumbnail dimensions
const TARGET_WIDTH = 320;
const TARGET_HEIGHT = 180; // 16:9 ratio for the corner thumbnail
const CORNER_MARGIN = 42;  // 2rem margin from screen edges when docked
const CORNER_MARGIN_TOP = 32;
const CORNER_RADIUS = 20;

// State flag: scrubs frames when false, moves in space when true
let isAnimationPaused = false;

// 1. Full-Screen Image Compression ScrollTrigger
ScrollTrigger.create({
    trigger: '.about',
    start: 'top bottom', // Begins compressing as .about enters the bottom of the viewport
    end: 'top 50%',      // Finishes compression when .about is 30% into the screen
    scrub: true,
    onUpdate: (self) => {
        const p = self.progress;

        // Interpolate width & height from full viewport down to target corner size
        const currentWidth = window.innerWidth - (window.innerWidth - TARGET_WIDTH) * p;
        const currentHeight = window.innerHeight - (window.innerHeight - TARGET_HEIGHT) * p;

        // Smoothly apply corner radius and margin from viewport edges
        const currentRadius = CORNER_RADIUS * p;
        const currentMargin = CORNER_MARGIN * p;
        const currentMarginTop = CORNER_MARGIN_TOP * p;

        gsap.set(heroImage, {
            width: `${currentWidth}px`,
            height: `${currentHeight}px`,
            borderRadius: `${currentRadius}px`,
            marginRight: `${currentMargin}px`,
            marginTop: `${currentMarginTop}px`,
        });
    },
});

// 2. Character Steps Aside / Translates Upward through About Section
ScrollTrigger.create({
    trigger: '.about',
    start: 'top 20.5%',    // Starts immediately after the image compression finishes
    end: 'bottom top',   // Remains active throughout the entire .about section
    scrub: true,
    onEnter: () => {
        isAnimationPaused = true;
    },
    onEnterBack: () => {
        isAnimationPaused = true;
    },
    onLeaveBack: () => {
        isAnimationPaused = false;
    },
    onUpdate: (self) => {
        // Translate character vertically upward across the page
        const yOffset = -(window.innerHeight * 1.25 * self.progress);
        const scaleX = scrollDirection === 'up' ? -1 : 1;

        gsap.set(lottieElement, {
            y: yOffset,
            scaleX: scaleX,
        });
    },
});

// 3. Frame-by-Frame Scrubbing inside Hero Section
ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => {
        if (!isAnimationPaused && lottieReady) {
            const scrollDistance = self.progress * window.innerHeight;
            const pixelsPerFrame = 12; // Controls how fast the character walks
            const totalFrames = lottyAnimation.totalFrames || 60;

            let frameIndex = Math.floor(scrollDistance / pixelsPerFrame) % totalFrames;

            if (frameIndex < 0) {
                frameIndex += totalFrames;
            }

            lottyAnimation.goToAndStop(frameIndex, true);
        }

        // Flip character based on scroll direction during hero scrubbing
        if (!isAnimationPaused) {
            const scaleX = scrollDirection === 'up' ? -1 : 1;
            gsap.set(lottieElement, { scaleX: scaleX });
        }
    },
});