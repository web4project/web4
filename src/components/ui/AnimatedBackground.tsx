import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    pulse: number;
    pulseSpeed: number;
}

interface FloatingOrb {
    x: number;
    y: number;
    radius: number;
    vx: number;
    vy: number;
    hue: number;
    opacity: number;
}

export function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        resize();
        window.addEventListener('resize', resize);

        // Track mouse for interactive glow
        const onMouse = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', onMouse, { passive: true });

        // Create particles
        const PARTICLE_COUNT = Math.min(80, Math.floor((width * height) / 15000));
        const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.005,
        }));

        // Create floating orbs (large, soft glowing circles)
        const ORB_COUNT = 4;
        const orbs: FloatingOrb[] = Array.from({ length: ORB_COUNT }, (_, i) => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 200 + 150,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            hue: i === 0 ? 90 : i === 1 ? 85 : i === 2 ? 260 : 200,
            opacity: 0.025 + Math.random() * 0.02,
        }));

        const CONNECTION_DIST = 120;
        let time = 0;

        const draw = () => {
            time += 0.005;
            ctx.clearRect(0, 0, width, height);

            // Draw floating orbs (mesh gradient effect)
            for (const orb of orbs) {
                orb.x += orb.vx;
                orb.y += orb.vy;

                // Bounce off edges softly
                if (orb.x < -orb.radius) orb.x = width + orb.radius;
                if (orb.x > width + orb.radius) orb.x = -orb.radius;
                if (orb.y < -orb.radius) orb.y = height + orb.radius;
                if (orb.y > height + orb.radius) orb.y = -orb.radius;

                const pulse = Math.sin(time * 2 + orb.hue) * 0.01;
                const gradient = ctx.createRadialGradient(
                    orb.x, orb.y, 0,
                    orb.x, orb.y, orb.radius
                );

                if (orb.hue === 90 || orb.hue === 85) {
                    // Accent green orbs
                    gradient.addColorStop(0, `rgba(158, 251, 79, ${(orb.opacity + pulse) * 1.5})`);
                    gradient.addColorStop(0.4, `rgba(158, 251, 79, ${(orb.opacity + pulse) * 0.5})`);
                    gradient.addColorStop(1, 'rgba(158, 251, 79, 0)');
                } else if (orb.hue === 260) {
                    // Purple accent
                    gradient.addColorStop(0, `rgba(120, 80, 255, ${(orb.opacity + pulse) * 1.2})`);
                    gradient.addColorStop(0.4, `rgba(120, 80, 255, ${(orb.opacity + pulse) * 0.4})`);
                    gradient.addColorStop(1, 'rgba(120, 80, 255, 0)');
                } else {
                    // Blue accent
                    gradient.addColorStop(0, `rgba(59, 130, 246, ${(orb.opacity + pulse) * 1.2})`);
                    gradient.addColorStop(0.4, `rgba(59, 130, 246, ${(orb.opacity + pulse) * 0.4})`);
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                }

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Mouse-follow glow
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            if (mx > 0 && my > 0) {
                const mouseGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 180);
                mouseGlow.addColorStop(0, 'rgba(158, 251, 79, 0.06)');
                mouseGlow.addColorStop(0.5, 'rgba(158, 251, 79, 0.02)');
                mouseGlow.addColorStop(1, 'rgba(158, 251, 79, 0)');
                ctx.fillStyle = mouseGlow;
                ctx.beginPath();
                ctx.arc(mx, my, 180, 0, Math.PI * 2);
                ctx.fill();
            }

            // Update and draw particles
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += p.pulseSpeed;

                // Wrap around edges
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Mouse repulsion
                const dx = p.x - mx;
                const dy = p.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150 && dist > 0) {
                    const force = (150 - dist) / 150 * 0.02;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // Damping
                p.vx *= 0.999;
                p.vy *= 0.999;

                const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

                // Draw particle with glow
                ctx.shadowColor = 'rgba(158, 251, 79, 0.5)';
                ctx.shadowBlur = 8;
                ctx.fillStyle = `rgba(158, 251, 79, ${alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Draw connections between nearby particles
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DIST) {
                        const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
                        ctx.strokeStyle = `rgba(158, 251, 79, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Scan line effect (subtle)
            const scanY = ((time * 60) % (height + 100)) - 50;
            const scanGradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
            scanGradient.addColorStop(0, 'rgba(158, 251, 79, 0)');
            scanGradient.addColorStop(0.5, 'rgba(158, 251, 79, 0.015)');
            scanGradient.addColorStop(1, 'rgba(158, 251, 79, 0)');
            ctx.fillStyle = scanGradient;
            ctx.fillRect(0, scanY - 30, width, 60);

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouse);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ opacity: 0.85 }}
            aria-hidden="true"
        />
    );
}
