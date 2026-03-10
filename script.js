// script.js
document.addEventListener('DOMContentLoaded', () => {
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    const audio = document.getElementById('bg-music');
    let isPlaying = false;

    function toggleMusic() {
        if (isPlaying) {
            audio.pause();
            musicIcon.innerHTML = `<path d="M8 19V5L18 12L8 19Z" fill="white"/>`;
        } else {
            audio.play().catch(() => {});
            musicIcon.innerHTML = `
                <rect x="6" y="4" width="4" height="16" rx="1" fill="white"/>
                <rect x="14" y="4" width="4" height="16" rx="1" fill="white"/>
            `;
        }
        isPlaying = !isPlaying;
    }

    musicBtn.addEventListener('click', toggleMusic);

    // Canvas partículas - RESPONSIVE
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles = [];
    let animationFrame;

    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height * 0.3;
            this.vy = 12 + Math.random() * 14;
            this.size = 12 + Math.random() * 22;
            this.angle = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.15;
        }
        update() { 
            this.y += this.vy; 
            this.angle += this.rotSpeed; 
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = '#ff1a1a';
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff1a1a';
            ctx.fillText('★', 0, 0);
            ctx.restore();
        }
    }

    class Confetti {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.vx = (Math.random() - 0.5) * 18;
            this.vy = (Math.random() - 0.5) * 18 - 8;
            this.gravity = 0.28;
            this.size = 8 + Math.random() * 9;
            this.color = '#ffffff';
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.3;
            this.life = 90;
        }
        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotSpeed;
            this.life--;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#fff';
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size * 0.6);
            ctx.restore();
        }
    }

    function launchStarsRain() {
        particles = [];
        // Menos partículas en móviles para mejor performance
        const particleCount = window.innerWidth < 768 ? 50 : 95;
        for (let i = 0; i < particleCount; i++) particles.push(new Star());
        animateParticles();
    }

    function launchConfettiFrom(x, y) {
        const confettiCount = window.innerWidth < 768 ? 40 : 75;
        for (let i = 0; i < confettiCount; i++) {
            const c = new Confetti(x, y);
            c.vx *= 1.6; c.vy *= 1.6;
            particles.push(c);
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            if ((p instanceof Star && p.y < canvas.height + 50) || (p instanceof Confetti && p.life > 0 && p.y < canvas.height + 100)) alive = true;
            if ((p instanceof Star && p.y > canvas.height + 50) || (p instanceof Confetti && p.life <= 0)) particles.splice(i, 1);
        }
        if (alive) animationFrame = requestAnimationFrame(animateParticles);
        else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; }
    }

    // NUEVA SECUENCIA CINEMATOGRÁFICA
    function startSequence() {
        const presenting = document.getElementById('presentando-text');
        const whiteFlash = document.getElementById('white-flash');
        const introScreen = document.getElementById('intro-screen');
        const mainScreen = document.getElementById('main-screen');
        const spotlights = document.getElementById('spotlights');

        // 1. Aparece texto
        setTimeout(() => { presenting.style.opacity = '1'; }, 300);

        // 2. Reflectores + cegamiento (2 segundos después)
        setTimeout(() => {
            const beams = document.querySelectorAll('.beam');
            beams.forEach((beam, i) => {
                setTimeout(() => {
                    beam.style.opacity = '1';
                    beam.style.height = '160vh';
                }, i * 120);
            });

            // Flash cegador
            setTimeout(() => {
                whiteFlash.style.transition = 'opacity 0.6s ease';
                whiteFlash.style.opacity = '0.95';

                setTimeout(() => {
                    whiteFlash.style.transition = 'opacity 0.9s ease';
                    whiteFlash.style.opacity = '0';

                    // === INICIO DE LA PARTE FINAL DE LA INTRO ===
                    setTimeout(() => {
                        presenting.style.opacity = '0';
                        spotlights.style.display = 'none';

                        // 3. Sacudida tipo terremoto (un poco)
                        setTimeout(() => {
                            document.body.classList.add('shake');
                            setTimeout(() => {
                                document.body.classList.remove('shake');
                            }, 850);
                        }, 400);

                        // 4. Parpadeo blanco final
                        setTimeout(() => {
                            whiteFlash.style.transition = 'opacity 0.15s';
                            whiteFlash.style.opacity = '0.75';
                            setTimeout(() => {
                                whiteFlash.style.opacity = '0';
                            }, 180);

                            // 5. Pasar a pantalla principal
                            setTimeout(() => {
                                introScreen.style.transition = 'opacity 1.6s ease';
                                introScreen.style.opacity = '0';

                                setTimeout(() => {
                                    introScreen.style.display = 'none';
                                    mainScreen.style.display = 'flex';
                                    mainScreen.style.opacity = '1';

                                    // Fondo foto
                                    document.body.style.backgroundImage = "url('fondo.jpg')";
                                    document.body.style.backgroundSize = 'cover';
                                }, 1600);
                            }, 700);
                        }, 700);
                    }, 900);
                }, 650);
            }, 1400);
        }, 2000);
    }

    // Click en perfiles
    function setupProfiles() {
        const cards = document.querySelectorAll('.profile-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const targetUrl = card.getAttribute('data-url');
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                canvas.style.display = 'block';
                launchStarsRain();
                launchConfettiFrom(centerX, centerY);

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 2000);
            });
        });
    }

    startSequence();
    setupProfiles();
});