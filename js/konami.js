// The secret Konami Code sequence
const konamiCode = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a"
];

let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    // Get the key pressed
    const key = e.key;

    // Check if the key matches the current expected key in the sequence
    if (key === konamiCode[konamiIndex]) {
        // Move to the next key in the sequence
        konamiIndex++;

        // If the entire sequence is entered correctly
        if (konamiIndex === konamiCode.length) {
            activateKonami();
            // Reset index to allow triggering it again
            konamiIndex = 0;
        }
    } else {
        // If the key is wrong, reset the index
        konamiIndex = 0;
    }
});

function activateKonami() {
    console.log("Konami Code Activated! Do a barrel roll!");
    const body = document.body;

    // Add the class to trigger the animation
    body.classList.add('barrel-roll');

    // Remove the class after the animation completes so it can be triggered again
    setTimeout(() => {
        body.classList.remove('barrel-roll');
    }, 2000); // Matches the 2s animation duration
}

/**
 * Easter Egg 2: Console Signature
 * A fun message for developers who check the console.
 */
console.log(
    "%c🚀 Hello there, Explorer! 🌌",
    "color: #8a2be2; font-size: 20px; font-weight: bold; background: #f0f0f0; padding: 10px; border-radius: 5px;"
);
console.log(
    "%cIf you're looking for the source code, you're already in the right place (Github). Feel free to look around!",
    "color: #333; font-size: 12px;"
);
console.log(
    "%cTry entering the Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) for a spin!",
    "color: #e67e22; font-style: italic;"
);


/**
 * Easter Egg 3: Tab Title Marquee
 * Changes the document title when the user switches tabs.
 */
const originalTitle = document.title;
const funTitles = [
    "Miss you already! 🚀",
    "Drifting in space... 🛸",
    "Come back to Earth! 🌍",
    "System: Offline 🌑"
];

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pick a random fun title
        const randomTitle = funTitles[Math.floor(Math.random() * funTitles.length)];
        document.title = randomTitle;
    } else {
        // Restore original title
        document.title = originalTitle;
    }
});

/**
 * Easter Egg 4: Halo "Combat Evolved" Rotation
 * Cycling through iconic Halo moments each time 'halo' is typed.
 * 1. Halo 3: Grunt Birthday Party
 * 2. Halo Reach: Armor Lock
 * 3. Halo 3: Sandtrap (Guardians)
 * 4. Halo 2: Super Bounce
 * 5. Halo 1: Shield Recharge
 */
const haloCode = ["h", "a", "l", "o"];
let haloIndex = 0;
let haloRotationIndex = 0;
let isHaloActive = false;

document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === haloCode[haloIndex]) {
        haloIndex++;
        if (haloIndex === haloCode.length) {
            if (!isHaloActive) {
                cycleHaloEffect();
            }
            haloIndex = 0;
        }
    } else {
        haloIndex = 0;
    }
});

function cycleHaloEffect() {
    isHaloActive = true;
    console.log(`🦾 SPARTAN DETECTED. ACTIVATING PROTOCOL ${haloRotationIndex + 1}.`);
    
    // Rotation Logic
    switch(haloRotationIndex % 5) {
        case 0:
            triggerGruntBirthday();
            break;
        case 1:
            triggerArmorLock();
            break;
        case 2:
            triggerSandtrap();
            break;
        case 3:
            triggerSuperBounce();
            break;
        case 4:
            triggerShieldRecharge();
            break;
    }
    
    haloRotationIndex++;
}

// --- EFFECT 1: GRUNT BIRTHDAY PARTY (Halo 3) ---
function triggerGruntBirthday() {
    // Effect: Confetti explosion + "YAY!" text
    const yayText = document.createElement('div');
    yayText.innerText = "YAY!";
    yayText.className = 'halo-grunt-yay';
    document.body.appendChild(yayText);

    // Create Confetti
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'halo-confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 200;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        confetti.style.setProperty('--tx', `${tx}px`);
        confetti.style.setProperty('--ty', `${ty}px`);
        
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 2000);
    }

    setTimeout(() => {
        yayText.remove();
        isHaloActive = false;
    }, 2000);
}

// --- EFFECT 2: ARMOR LOCK (Halo Reach) ---
function triggerArmorLock() {
    // Effect: Screen pulses Cyan/White, page freezes
    const body = document.body;
    body.classList.add('halo-armor-lock');

    setTimeout(() => {
        body.classList.remove('halo-armor-lock');
        isHaloActive = false;
    }, 2500);
}

// --- EFFECT 3: SANDTRAP / GUARDIANS (Halo 3) ---
function triggerSandtrap() {
    console.log("⚠️ WARNING: LEAVING THE MAP. RETURN TO THE BATTLEFIELD.");
    
    // 1. Spawn Da Vinci Eggs (Canvas)
    const eggContainer = document.createElement('div');
    eggContainer.id = 'sandtrap-container';
    document.body.appendChild(eggContainer);

    const eggObjects = [];
    let isSandtrapRunning = true;

    for(let i=0; i<3; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'davinci-egg-canvas';
        wrapper.style.left = `${20 + (i * 30)}%`; // 20%, 50%, 80%
        
        const canvas = document.createElement('canvas');
        canvas.width = 160; 
        canvas.height = 160;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        wrapper.appendChild(canvas);
        eggContainer.appendChild(wrapper);

        eggObjects.push(new DaVinciEgg3D(canvas, i));
    }

    // Animation Loop
    function animate() {
        if (!isSandtrapRunning) return;
        eggObjects.forEach(egg => egg.render());
        requestAnimationFrame(animate);
    }
    animate();

    // 2. Fire Lasers
    setTimeout(() => {
        const wrappers = document.querySelectorAll('.davinci-egg-canvas');
        wrappers.forEach(wrapper => {
            const beam = document.createElement('div');
            beam.className = 'guardian-beam';
            wrapper.appendChild(beam);
        });
        
        document.body.style.animation = "armorLockShake 0.5s ease-in-out";
    }, 1000);

    // 3. Kill Message
    let killFeed;
    setTimeout(() => {
        killFeed = document.createElement('div');
        killFeed.className = 'halo-kill-feed';
        killFeed.innerHTML = `
            <span class="kill-icon">⚡</span>
            <span class="kill-player">You</span>
            <span class="kill-separator">were neutralized by</span>
            <span class="kill-guardian">The Guardians</span>
        `;
        document.body.appendChild(killFeed);
        
        console.log("%c🐘 UNSC Elephant 'Behemoth' [S/N: 80816] reports: Spartan down in the minefield.", "color: #8b7d6b; font-style: italic;");
        console.log("%c(That was a Da Vinci Egg laser strike. Watch where you step!)", "color: #aaa; font-size: 10px;");
    }, 1800);

    // Cleanup
    setTimeout(() => {
        isSandtrapRunning = false;
        eggContainer.remove();
        if(killFeed) killFeed.remove();
        document.body.style.animation = "";
        isHaloActive = false;
    }, 5000);
}

// --- EFFECT 4: SUPER BOUNCE (Halo 2) ---
function triggerSuperBounce() {
    // Effect: Page launches into air, blurs
    const body = document.body;
    body.classList.add('halo-super-bounce');

    setTimeout(() => {
        body.classList.remove('halo-super-bounce');
        isHaloActive = false;
    }, 2500);
}

// --- EFFECT 5: SHIELD RECHARGE (Halo 1) ---
function triggerShieldRecharge() {
    // Effect: Gold overlay wipe
    const body = document.body;
    body.classList.add('halo-shield-recharge');

    setTimeout(() => {
        body.classList.remove('halo-shield-recharge');
        isHaloActive = false;
    }, 2000);
}


// --- 3D Da Vinci Egg Renderer (Helper Class) ---
class DaVinciEgg3D {
    constructor(canvas, id) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.id = id;
        
        // Icosahedron Vertices
        const t = (1 + Math.sqrt(5)) / 2;
        this.vertices = [
            [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
            [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
            [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1]
        ].map(v => ({x: v[0], y: v[1], z: v[2]}));

        // Normalize
        this.vertices.forEach(v => {
            const mag = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
            v.x /= mag; v.y /= mag; v.z /= mag;
        });

        // Faces
        this.faces = [
            [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
            [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
            [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
            [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
        ];

        // Debug Texture Colors
        const palette = ['#4444dd', '#5522aa', '#3355ee', '#6633cc'];
        this.faceColors = this.faces.map((_, i) => palette[i % palette.length]);
        this.faceLabels = this.faces.map((_, i) => String.fromCharCode(65 + (i % 8)) + (Math.floor(i / 8) + 1));
    }

    render() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);
        
        const cx = width / 2;
        const cy = height / 2;
        const scale = width * 0.35; 

        // Rotate
        const time = Date.now() * 0.001;
        const rotX = time * (0.5 + this.id * 0.1);
        const rotY = time * (0.3 - this.id * 0.2);

        // Transform
        const projected = this.vertices.map(v => {
            let x = v.x * Math.cos(rotY) - v.z * Math.sin(rotY);
            let z = v.x * Math.sin(rotY) + v.z * Math.cos(rotY);
            let y = v.y;

            let y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
            let z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
            let x2 = x;

            return {
                x: cx + x2 * scale,
                y: cy + y2 * scale,
                z: z2
            };
        });

        // Sort Painter's Algo
        const sortedFaces = this.faces.map((face, index) => {
            const v0 = projected[face[0]];
            const v1 = projected[face[1]];
            const v2 = projected[face[2]];
            const zDepth = (v0.z + v1.z + v2.z) / 3;
            return { face, index, zDepth, v0, v1, v2 };
        }).sort((a, b) => b.zDepth - a.zDepth);

        // Draw
        sortedFaces.forEach(f => {
            const ax = f.v1.x - f.v0.x;
            const ay = f.v1.y - f.v0.y;
            const bx = f.v2.x - f.v0.x;
            const by = f.v2.y - f.v0.y;
            
            if ((ax * by - ay * bx) < 0) return; // Cull

            this.ctx.beginPath();
            this.ctx.moveTo(f.v0.x, f.v0.y);
            this.ctx.lineTo(f.v1.x, f.v1.y);
            this.ctx.lineTo(f.v2.x, f.v2.y);
            this.ctx.closePath();

            this.ctx.fillStyle = this.faceColors[f.index];
            this.ctx.fill();
            
            this.ctx.strokeStyle = "rgba(255,255,255,0.3)";
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            const centX = (f.v0.x + f.v1.x + f.v2.x) / 3;
            const centY = (f.v0.y + f.v1.y + f.v2.y) / 3;
            this.ctx.fillStyle = "rgba(255,255,255,0.8)";
            this.ctx.font = "10px monospace";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(this.faceLabels[f.index], centX, centY);
        });
    }
}