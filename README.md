### 1. What is this?

This is a scroll-driven Lottie animation interaction. As the user scrolls down, a Lottie character animation advances frame-by-frame based on scroll progress. As the user approaches the next section, a hero image smoothly compresses into the corner. Once in the new section, the Lottie animation stops scrubbing its frames and instead translates physically upward across the page, flipping horizontally based on scroll direction (up vs. down).

### 2. Tech stack

* **Markup:** HTML5
* **Styling:** CSS3
* **Scripting:** JavaScript (ES6+)
* **Animation & Scroll:** [GSAP 3](https://gsap.com/) & [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
* **Smooth Scrolling:** [Lenis](https://lenis.darkroom.engineering/)
* **Lottie Player:** [Lottie-Web](https://github.com/airbnb/lottie-web)

### 3. Project structure

```text
project/
│
├── public/
│   └── duck.json        (Lottie animation file)
│
├── assets/
│   └── image.jpg        (Hero media image)
│
├── index.html
├── styles.css
└── script.js

```

### 4. Setup instructions

1. Create the project folder structure outlined above.
2. Ensure you have an image to act as the compressing hero media saved at `assets/image.jpg`.
3. Download a free Lottie JSON file (e.g., from [Lottiefiles](https://lottiefiles.com/)) and save it as `duck.json` in a folder named `public/`.
4. Open the `index.html` file with a local web server (like VS Code's "Live Server" extension) so the browser can properly fetch the Lottie JSON file avoiding CORS errors.