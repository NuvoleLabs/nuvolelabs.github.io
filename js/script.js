// Initialize Lucide icons
lucide.createIcons();

// Listen for changes in the user's system theme
const themeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
themeMatcher.addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// --- Form Submission Logic ---
const notifyForm = document.getElementById('notify-form');
const emailInput = document.getElementById('email');
const successMessage = document.getElementById('success-message');

notifyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (emailInput.value && emailInput.checkValidity()) {
        console.log('Email submitted:', emailInput.value);
        successMessage.textContent = 'Thank you! You are on the list.';
        emailInput.value = '';
        setTimeout(() => { successMessage.textContent = ''; }, 5000);
    }
});

// --- Interactive Particle Background Logic ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

// get mouse position
const mouse = {
    x: null,
    y: null,
    radius: (canvas.height/100) * (canvas.width/100)
}

window.addEventListener('mousemove', 
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// Particle class
class Particle {
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    // check particle position, check mouse position, move the particle, draw the particle
    update() {
        //check if particle is still within canvas
        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// create particle array
function init(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height/100) * (canvas.width/100);
    
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    const isDarkMode = document.documentElement.classList.contains('dark');
    const particleColor = isDarkMode ? 'rgba(167, 139, 250, 0.7)' : 'rgba(56, 189, 248, 0.7)';

    for(let i=0; i< numberOfParticles; i++){
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
    }
}

// animation loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for(let i=0; i<particlesArray.length; i++){
        particlesArray[i].update();
    }
    connect();
}

// check if particles are close enough to draw line between them
function connect(){
    let opacityValue = 1;
    const isDarkMode = document.documentElement.classList.contains('dark');
    const lineColor = isDarkMode ? 'rgba(167, 139, 250, 0.7)' : 'rgba(56, 189, 248, 0.7)';

    for(let a=0; a<particlesArray.length; a++){
        for(let b=a; b<particlesArray.length; b++){
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if(distance < (canvas.width/7) * (canvas.height/7)){
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = lineColor.replace('0.7', opacityValue);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Debounce resize event
let resizeTimer;
window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 250);
});

// Re-initialize on theme change
themeMatcher.addEventListener('change', init);

init();
animate();
