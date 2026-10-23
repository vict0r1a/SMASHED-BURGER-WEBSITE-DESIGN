const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');


gsap.set("#hero-canvas", { xPercent: -50, yPercent: -50, transformOrigin: "center center" });

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    if (images[burger.frame]) {
        drawImageContain(images[burger.frame]);
    }
}

const frameCount = 125; 

const currentFrame = index => {
    const frameNum = index.toString().padStart(3, '0');
    const time = ((index - 1) * 0.04).toFixed(3);
    return `./frames/video_frame_${frameNum}_${time}s.png`;
};

const images = [];
const burger = { frame: 0 };

function drawImageContain(img) {
    if (!img || !img.complete) return;
    
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    const zoomFactor = 1.5; 

    if (canvasRatio > imgRatio) {
        drawHeight = canvas.height * zoomFactor;
        drawWidth = img.width * (drawHeight / img.height);
    } else {
        drawWidth = canvas.width * zoomFactor;
        drawHeight = img.height * (drawWidth / img.width);
    }

    offsetX = (canvas.width - drawWidth) / 2;
    offsetY = (canvas.height - drawHeight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i + 1);
  images.push(img);
}

images[0].onload = () => {
  resizeCanvas();
  playIntro(); 
};

function playIntro() {
    gsap.set([".subtitle", ".main-title", ".description", ".cta-button"], { opacity: 0, y: 30 });
    
    const tl = gsap.timeline({ delay: 0.5 });
    const t2 = gsap.timeline({delay: 1.0});

    tl.to(".navbar", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    }, 0) 

    .to(burger, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "power2.inOut", 
        duration: 4.5, 
        onUpdate: () => {
            if (images[burger.frame]) {
                drawImageContain(images[burger.frame]); 
            }
        },
        onComplete: () => {
            drawImageContain(images[frameCount - 1]); 
        }
    }, 0.5) 
    
    .add(() => {
        const idleTl = gsap.timeline({ repeat: -1, yoyo: true });
        
        idleTl.to("#hero-canvas", { rotation: 3, y: "-=5", duration: 3, ease: "sine.inOut" })
              .to("#hero-canvas", { rotation: -3, y: "+=10", duration: 6, ease: "sine.inOut" });
        
        t2.to(".subtitle", { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "+=0.2")
        .to(".main-title", { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "-=0.4")
        .to(".description", { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "-=0.4")
        .to(".cta-button", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" }, "-=0.2")
    });
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const scrollBtn = document.getElementById('scroll-btn');
if (scrollBtn) {
    scrollBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        gsap.to(window, {
            duration: 1.5, 
            scrollTo: { y: "#menu-section", offsetY: 0 },
            ease: "power3.inOut" 
        });
    });
} 


const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        if (navLinks.classList.contains('active')) {
            hamburger.innerHTML = '✕';
            
            document.body.classList.add('menu-open'); 
        } else {
            hamburger.innerHTML = '☰';
          
            document.body.classList.remove('menu-open'); 
        }
    });
}
