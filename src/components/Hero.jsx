import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/* =========================================================
   COLOR PALETTE — Navy Blue · White · Light Green
   ========================================================= */
const COLORS = {
    navyDeepest: '#04101F',
    navyDark: '#071427',
    navyPrimary: '#0A1F3D',
    navyLight: '#12305C',
    white: '#FFFFFF',
    greenLight: '#86EFAC',
    greenBright: '#4ADE80',
    greenDeep: '#22C55E',
};

const ROLES = ['Full-Stack Developer', 'AI Engineer (Python)', 'C++ Developer'];

/* =========================================================
   MINI COMPONENTS — Reusable animated bits
   ========================================================= */

/* ── Animated Code Rain (Matrix-style, subtle) ── */
const CodeRain = () => {
    const columns = useMemo(
        () =>
            Array.from({ length: 18 }).map((_, i) => ({
                id: i,
                left: (i / 18) * 100 + Math.random() * 3,
                delay: Math.random() * 8,
                duration: Math.random() * 6 + 8,
                chars: Array.from({ length: 14 }).map(
                    () => '01ABCDEF{}[]</>;=+*'.charAt(Math.floor(Math.random() * 20))
                ),
                opacity: Math.random() * 0.4 + 0.15,
            })),
        []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {columns.map((col) => (
                <div
                    key={col.id}
                    className="absolute top-0 font-mono text-[10px] leading-tight"
                    style={{
                        left: `${col.left}%`,
                        color: COLORS.greenLight,
                        opacity: col.opacity,
                        animation: `codeRain ${col.duration}s linear ${col.delay}s infinite`,
                    }}
                >
                    {col.chars.map((c, j) => (
                        <div
                            key={j}
                            style={{
                                opacity: 1 - j * 0.06,
                                textShadow: `0 0 6px ${COLORS.greenLight}`,
                            }}
                        >
                            {c}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

/* ── Particle Network (connecting dots) ── */
const ParticleNetwork = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = canvas.offsetWidth);
        let height = (canvas.height = canvas.offsetHeight);

        const PARTICLE_COUNT = 60;
        const MAX_DIST = 130;
        const MOUSE_RADIUS = 180;

        // Init particles
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.6 + 0.6,
        }));

        const onResize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        const onMouse = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const onLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouse);
        window.addEventListener('mouseleave', onLeave);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            const particles = particlesRef.current;

            // Update positions
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Mouse attraction
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const dist = Math.hypot(dx, dy);
                if (dist < MOUSE_RADIUS) {
                    const force = (1 - dist / MOUSE_RADIUS) * 0.6;
                    p.x += (dx / dist) * force;
                    p.y += (dy / dist) * force;
                }
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * 0.22;
                        ctx.strokeStyle = `rgba(134,239,172,${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(134,239,172,0.55)`;
                ctx.shadowColor = COLORS.greenLight;
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

/* ── Radial Scan Sweep ── */
const RadialSweep = () => (
    <div
        className="absolute top-1/2 left-1/2 w-[1400px] h-[1400px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
            background:
                'conic-gradient(from 0deg, transparent 0deg, transparent 340deg, rgba(134,239,172,0.10) 355deg, rgba(134,239,172,0.25) 359deg, transparent 360deg)',
            animation: 'radialSweep 12s linear infinite',
            maskImage: 'radial-gradient(circle, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, black 20%, transparent 70%)',
        }}
    />
);

/* ── Floating Geometric Shapes ── */
const GeometricShapes = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Hexagon outline */}
        <svg
            className="absolute top-[12%] left-[6%] w-20 h-20 opacity-30"
            viewBox="0 0 100 100"
            style={{ animation: 'shapeRotate 25s linear infinite' }}
        >
            <polygon
                points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="none"
                stroke={COLORS.greenLight}
                strokeWidth="1.2"
            />
        </svg>

        {/* Triangle */}
        <svg
            className="absolute bottom-[22%] right-[8%] w-16 h-16 opacity-25"
            viewBox="0 0 100 100"
            style={{ animation: 'shapeRotate 18s linear infinite reverse' }}
        >
            <polygon points="50,10 90,90 10,90" fill="none" stroke={COLORS.greenBright} strokeWidth="1.2" />
        </svg>

        {/* Square rotating */}
        <svg
            className="absolute top-[60%] left-[12%] w-12 h-12 opacity-30"
            viewBox="0 0 100 100"
            style={{ animation: 'shapeRotate3D 16s ease-in-out infinite' }}
        >
            <rect x="15" y="15" width="70" height="70" fill="none" stroke={COLORS.greenLight} strokeWidth="1.5" />
        </svg>

        {/* Diamond outline */}
        <svg
            className="absolute top-[30%] right-[40%] w-10 h-10 opacity-20"
            viewBox="0 0 100 100"
            style={{ animation: 'shapeFloat 9s ease-in-out infinite' }}
        >
            <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke={COLORS.greenBright} strokeWidth="1.5" />
        </svg>
    </div>
);

/* ── Animated Crosshair Target (top-right) ── */
const CrosshairTarget = () => (
    <div
        className="absolute top-[20%] right-[6%] w-24 h-24 opacity-20 pointer-events-none"
        style={{ animation: 'crosshairPulse 4s ease-in-out infinite' }}
    >
        <div className="absolute inset-0 rounded-full border" style={{ borderColor: COLORS.greenLight }} />
        <div
            className="absolute inset-3 rounded-full border"
            style={{ borderColor: COLORS.greenLight, animation: 'spinSlow 6s linear infinite' }}
        />
        <div
            className="absolute top-1/2 left-0 right-0 h-[1px]"
            style={{ background: COLORS.greenLight }}
        />
        <div
            className="absolute left-1/2 top-0 bottom-0 w-[1px]"
            style={{ background: COLORS.greenLight }}
        />
    </div>
);

/* ── Floating Ring Trail (multiple rings expanding & fading) ── */
const RingTrail = () => (
    <div className="absolute bottom-[15%] right-[25%] pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
            <div
                key={i}
                className="absolute top-0 left-0 rounded-full border"
                style={{
                    width: '80px',
                    height: '80px',
                    marginLeft: '-40px',
                    marginTop: '-40px',
                    borderColor: 'rgba(134,239,172,0.4)',
                    animation: `ringTrail 3.2s ease-out ${i * 0.8}s infinite`,
                }}
            />
        ))}
    </div>
);

/* ── Animated Progress Bars (aesthetic, decorative) ── */
const DecorativeLines = () => (
    <div className="absolute inset-0 pointer-events-none">
        {[
            { top: '28%', left: '0', width: '8%', delay: 0 },
            { top: '72%', left: '0', width: '12%', delay: 1.5 },
            { top: '45%', right: '0', width: '10%', delay: 0.8 },
            { top: '85%', right: '0', width: '6%', delay: 2.2 },
        ].map((line, i) => (
            <div
                key={i}
                className="absolute h-[1px]"
                style={{
                    top: line.top,
                    left: line.left,
                    right: line.right,
                    width: line.width,
                    background: `linear-gradient(90deg, transparent, ${COLORS.greenLight}, transparent)`,
                    animation: `lineExpand 5s ease-in-out ${line.delay}s infinite`,
                }}
            />
        ))}
    </div>
);

/* ── Floating Dots Orbiting ── */
const OrbitDots = () => (
    <div className="absolute top-[8%] right-[35%] w-32 h-32 pointer-events-none opacity-40">
        {[0, 1, 2, 3].map((i) => (
            <div
                key={i}
                className="absolute inset-0"
                style={{ animation: `orbit 12s linear ${i * 3}s infinite` }}
            >
                <span
                    className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2"
                    style={{
                        background: COLORS.greenLight,
                        boxShadow: `0 0 12px ${COLORS.greenLight}`,
                    }}
                />
            </div>
        ))}
    </div>
);

/* =========================================================
   ANIMATED BACKGROUND (main)
   ========================================================= */
const AnimatedBackground = ({ mouse }) => {
    const particles = useMemo(
        () =>
            Array.from({ length: 36 }).map((_, i) => ({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 3 + 1,
                duration: Math.random() * 12 + 8,
                delay: Math.random() * 8,
                driftX: (Math.random() - 0.5) * 60,
                driftY: -(Math.random() * 80 + 40),
                opacity: Math.random() * 0.6 + 0.2,
                green: Math.random() > 0.4,
            })),
        []
    );

    const shootingStars = useMemo(
        () =>
            Array.from({ length: 4 }).map((_, i) => ({
                id: i,
                top: Math.random() * 60,
                delay: Math.random() * 10,
                duration: Math.random() * 3 + 3,
            })),
        []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* ── Base gradient ── */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at 20% 30%, ${COLORS.navyLight} 0%, ${COLORS.navyPrimary} 45%, ${COLORS.navyDark} 100%)`,
                }}
            />

            {/* ── Aurora layers ── */}
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    background: 'radial-gradient(ellipse 60% 50% at 20% 20%, rgba(74,222,128,0.18), transparent 60%)',
                    animation: 'auroraDrift1 18s ease-in-out infinite alternate',
                    transform: `translate(${mouse.x * -20}px, ${mouse.y * -20}px)`,
                }}
            />
            <div
                className="absolute inset-0 opacity-70"
                style={{
                    background: 'radial-gradient(ellipse 70% 55% at 80% 80%, rgba(134,239,172,0.15), transparent 60%)',
                    animation: 'auroraDrift2 22s ease-in-out infinite alternate',
                    transform: `translate(${mouse.x * 25}px, ${mouse.y * 25}px)`,
                }}
            />
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background: 'radial-gradient(circle 40% at 50% 50%, rgba(34,197,94,0.12), transparent 70%)',
                    animation: 'auroraPulse 10s ease-in-out infinite',
                }}
            />

            {/* ── Code rain layer ── */}
            <CodeRain />

            {/* ── Radial sweep (radar effect) ── */}
            <RadialSweep />

            {/* ── Floating geometric shapes ── */}
            <GeometricShapes />

            {/* ── Crosshair target ── */}
            <CrosshairTarget />

            {/* ── Ring trail ── */}
            <RingTrail />

            {/* ── Decorative progress lines ── */}
            <DecorativeLines />

            {/* ── Orbiting dots ── */}
            <OrbitDots />

            {/* ── Conic orbs ── */}
            <div
                className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[110px]"
                style={{
                    background: `conic-gradient(from 0deg, transparent, rgba(134,239,172,0.30), transparent, rgba(74,222,128,0.25), transparent)`,
                    animation: 'spinSlow 22s linear infinite',
                    transform: `translate(${mouse.x * -40}px, ${mouse.y * -40}px)`,
                }}
            />
            <div
                className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-[110px]"
                style={{
                    background: `conic-gradient(from 180deg, transparent, rgba(34,197,94,0.28), transparent, rgba(134,239,172,0.22), transparent)`,
                    animation: 'spinSlow 28s linear infinite reverse',
                    transform: `translate(${mouse.x * 40}px, ${mouse.y * 40}px)`,
                }}
            />

            {/* ── Animated grid ── */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(134,239,172,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(134,239,172,0.9) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
                    animation: 'gridShift 20s linear infinite',
                }}
            />

            {/* ── Pulse rings ── */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="absolute rounded-full border"
                        style={{
                            width: '200px',
                            height: '200px',
                            borderColor: 'rgba(134,239,172,0.12)',
                            animation: `pulseRing 6s ease-out infinite`,
                            animationDelay: `${i * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* ── Particle network (canvas) ── */}
            <ParticleNetwork />

            {/* ── Floating particles ── */}
            {particles.map((p) => (
                <span
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.green ? COLORS.greenLight : COLORS.white,
                        opacity: p.opacity,
                        boxShadow: p.green
                            ? `0 0 ${p.size * 4}px ${COLORS.greenLight}`
                            : `0 0 ${p.size * 3}px rgba(255,255,255,0.6)`,
                        animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
                        '--drift-x': `${p.driftX}px`,
                        '--drift-y': `${p.driftY}px`,
                    }}
                />
            ))}

            {/* ── Shooting stars ── */}
            {shootingStars.map((s) => (
                <span
                    key={s.id}
                    className="absolute h-[2px] w-24"
                    style={{
                        top: `${s.top}%`,
                        left: '-10%',
                        background: `linear-gradient(90deg, transparent, ${COLORS.greenLight}, transparent)`,
                        filter: 'drop-shadow(0 0 6px rgba(134,239,172,0.8))',
                        animation: `shootingStar ${s.duration}s linear ${s.delay}s infinite`,
                        opacity: 0,
                    }}
                />
            ))}

            {/* ── Beam scan lines ── */}
            {[15, 50, 85].map((left, i) => (
                <div
                    key={i}
                    className="absolute top-0 bottom-0 w-[1px] opacity-30"
                    style={{
                        left: `${left}%`,
                        background: `linear-gradient(180deg, transparent, ${COLORS.greenLight}, transparent)`,
                        animation: `beamScan ${8 + i * 2}s linear ${i * 1.5}s infinite`,
                    }}
                />
            ))}

            {/* ── Floating tech symbols ── */}
            <div
                className="absolute top-[15%] right-[10%] text-4xl font-mono select-none"
                style={{ color: 'rgba(134,239,172,0.10)', animation: 'symbolFloat 12s ease-in-out infinite' }}
            >
                {'</>'}
            </div>
            <div
                className="absolute bottom-[20%] left-[8%] text-5xl font-mono select-none"
                style={{ color: 'rgba(134,239,172,0.08)', animation: 'symbolFloat 15s ease-in-out 2s infinite reverse' }}
            >
                {'{ }'}
            </div>
            <div
                className="absolute top-[55%] right-[18%] text-3xl font-mono select-none"
                style={{ color: 'rgba(134,239,172,0.09)', animation: 'symbolFloat 10s ease-in-out 1s infinite' }}
            >
                {'[ ]'}
            </div>

            {/* ── Dot matrix corners ── */}
            {[
                { top: '10%', left: '5%' },
                { top: '10%', right: '5%' },
                { bottom: '10%', left: '5%' },
                { bottom: '10%', right: '5%' },
            ].map((pos, i) => (
                <div
                    key={i}
                    className="absolute grid grid-cols-4 gap-1.5"
                    style={{ ...pos, animation: `cornerPulse 5s ease-in-out ${i * 0.4}s infinite` }}
                >
                    {Array.from({ length: 16 }).map((_, j) => (
                        <span
                            key={j}
                            className="w-1 h-1 rounded-full"
                            style={{
                                background: 'rgba(134,239,172,0.35)',
                                animation: `dotBlink 3s ease-in-out ${(i + j) * 0.1}s infinite`,
                            }}
                        />
                    ))}
                </div>
            ))}

            {/* ── Bottom waves ── */}
            <svg
                className="absolute bottom-0 left-0 w-full h-24 opacity-20"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
            >
                <path
                    fill="none"
                    stroke={COLORS.greenLight}
                    strokeWidth="1"
                    d="M0,50 C240,10 480,90 720,50 C960,10 1200,90 1440,50"
                    style={{ animation: 'waveMove 8s ease-in-out infinite' }}
                />
                <path
                    fill="none"
                    stroke={COLORS.greenBright}
                    strokeWidth="1"
                    d="M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60"
                    style={{ animation: 'waveMove 12s ease-in-out 1s infinite reverse' }}
                />
            </svg>

            {/* ── Cursor glow ── */}
            <div
                className="absolute w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(134,239,172,0.10), transparent 70%)',
                    transform: `translate(calc(50vw + ${mouse.x * 200}px - 200px), calc(50vh + ${mouse.y * 200}px - 200px))`,
                    transition: 'transform 0.5s ease-out',
                }}
            />

            {/* ── Noise texture ── */}
            <div
                className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* ── ALL KEYFRAMES ── */}
            <style>{`
                @keyframes auroraDrift1 {
                    0%   { transform: translate(0, 0) scale(1); }
                    50%  { transform: translate(40px, -30px) scale(1.1); }
                    100% { transform: translate(-20px, 20px) scale(1.05); }
                }
                @keyframes auroraDrift2 {
                    0%   { transform: translate(0, 0) scale(1); }
                    50%  { transform: translate(-50px, 30px) scale(1.15); }
                    100% { transform: translate(30px, -40px) scale(1.05); }
                }
                @keyframes auroraPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50%      { opacity: 0.6; transform: scale(1.2); }
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes gridShift {
                    0%   { background-position: 0 0, 0 0; }
                    100% { background-position: 60px 60px, 60px 60px; }
                }
                @keyframes pulseRing {
                    0%   { transform: scale(0.5); opacity: 0.8; }
                    100% { transform: scale(3.5); opacity: 0; }
                }
                @keyframes particleFloat {
                    0%, 100% { transform: translate(0, 0); opacity: 0.5; }
                    50%      { transform: translate(var(--drift-x), var(--drift-y)); }
                }
                @keyframes shootingStar {
                    0%   { transform: translate(0, 0) rotate(15deg); opacity: 0; }
                    10%  { opacity: 1; }
                    100% { transform: translate(120vw, 30vh) rotate(15deg); opacity: 0; }
                }
                @keyframes beamScan {
                    0%   { transform: translateY(-100%); opacity: 0; }
                    20%  { opacity: 0.5; }
                    80%  { opacity: 0.5; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
                @keyframes symbolFloat {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25%      { transform: translate(15px, -20px) rotate(8deg); }
                    50%      { transform: translate(-10px, -35px) rotate(-5deg); }
                    75%      { transform: translate(-20px, -15px) rotate(6deg); }
                }
                @keyframes cornerPulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50%      { opacity: 1; transform: scale(1.08); }
                }
                @keyframes dotBlink {
                    0%, 100% { opacity: 0.25; }
                    50%      { opacity: 1; box-shadow: 0 0 8px rgba(134,239,172,0.9); }
                }
                @keyframes waveMove {
                    0%, 100% { transform: translateX(0); }
                    50%      { transform: translateX(-40px); }
                }

                /* ═══════ NEW PROFESSIONAL ANIMATIONS ═══════ */
                @keyframes codeRain {
                    0%   { transform: translateY(-100%); opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
                @keyframes radialSweep {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to   { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes shapeRotate {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes shapeRotate3D {
                    0%   { transform: rotate(0deg) scale(1); }
                    50%  { transform: rotate(180deg) scale(1.2); }
                    100% { transform: rotate(360deg) scale(1); }
                }
                @keyframes shapeFloat {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33%      { transform: translate(15px, -15px) rotate(120deg); }
                    66%      { transform: translate(-10px, 10px) rotate(240deg); }
                }
                @keyframes crosshairPulse {
                    0%, 100% { opacity: 0.15; transform: scale(1); }
                    50%      { opacity: 0.35; transform: scale(1.1); }
                }
                @keyframes ringTrail {
                    0%   { transform: scale(0.3); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
                @keyframes lineExpand {
                    0%, 100% { transform: scaleX(0.3); opacity: 0.3; }
                    50%      { transform: scaleX(1); opacity: 1; }
                }
                @keyframes orbit {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

/* =========================================================
   MAGNETIC BUTTON
   ========================================================= */
const MagneticButton = ({ children, primary, href, onClick }) => {
    const btnRef = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [hovering, setHovering] = useState(false);

    const onMove = (e) => {
        const rect = btnRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        setPos({ x, y });
    };
    const onLeave = () => {
        setPos({ x: 0, y: 0 });
        setHovering(false);
    };
    const onEnter = () => setHovering(true);

    const sharedProps = {
        ref: btnRef,
        onMouseMove: onMove,
        onMouseLeave: onLeave,
        onMouseEnter: onEnter,
        onClick,
        className:
            'relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 overflow-hidden',
        style: {
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            ...(primary
                ? {
                    background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright}, ${COLORS.greenLight})`,
                    backgroundSize: '200% 100%',
                    color: COLORS.navyPrimary,
                    boxShadow: hovering
                        ? '0 10px 30px -4px rgba(74,222,128,0.75), 0 20px 60px -10px rgba(34,197,94,0.55), inset 0 1px 0 0 rgba(255,255,255,0.5)'
                        : '0 6px 20px -4px rgba(74,222,128,0.55), 0 14px 40px -10px rgba(34,197,94,0.45), inset 0 1px 0 0 rgba(255,255,255,0.4)',
                    animation: 'shimmerBtn 4s linear infinite',
                }
                : {
                    background: 'rgba(255,255,255,0.04)',
                    color: COLORS.white,
                    border: '1px solid rgba(134,239,172,0.35)',
                    boxShadow: hovering
                        ? 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 8px 30px -8px rgba(134,239,172,0.4)'
                        : 'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 4px 20px -8px rgba(0,0,0,0.5)',
                }),
        },
    };

    return (
        <>
            {href ? <a href={href} {...sharedProps}>
                {/* Ripple shine on hover */}
                <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
                        transform: hovering ? 'translateX(100%)' : 'translateX(-100%)',
                        transition: 'transform 0.7s ease-out',
                    }}
                />
                {children}
            </a> : <button {...sharedProps}>
                <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
                        transform: hovering ? 'translateX(100%)' : 'translateX(-100%)',
                        transition: 'transform 0.7s ease-out',
                    }}
                />
                {children}
            </button>}
            <style>{`
                @keyframes shimmerBtn {
                    0%   { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
            `}</style>
        </>
    );
};

/* =========================================================
   HERO SECTION
   ========================================================= */
const Hero = () => {
    const [mounted, setMounted] = useState(false);
    const [roleIndex, setRoleIndex] = useState(0);
    const [typed, setTyped] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 150);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const current = ROLES[roleIndex];
        const speed = deleting ? 45 : 90;
        const timeout = setTimeout(() => {
            if (!deleting) {
                setTyped(current.slice(0, typed.length + 1));
                if (typed.length + 1 === current.length) {
                    setTimeout(() => setDeleting(true), 1400);
                }
            } else {
                setTyped(current.slice(0, typed.length - 1));
                if (typed.length === 0) {
                    setDeleting(false);
                    setRoleIndex((i) => (i + 1) % ROLES.length);
                }
            }
        }, speed);
        return () => clearTimeout(timeout);
    }, [typed, deleting, roleIndex]);

    useEffect(() => {
        const onMove = (e) => {
            const rect = heroRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
            setMouse({ x, y });
        };
        const node = heroRef.current;
        node?.addEventListener('mousemove', onMove);
        return () => node?.removeEventListener('mousemove', onMove);
    }, []);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = el.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    return (
        <section
            id="home"
            ref={heroRef}
            className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: COLORS.navyPrimary }}
        >
            <AnimatedBackground mouse={mouse} />

            <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">

                {/* ─────────────── LEFT: Text ─────────────── */}
                <div className="order-2 lg:order-1 text-center lg:text-left">

                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                        style={{
                            background: 'rgba(134,239,172,0.08)',
                            border: '1px solid rgba(134,239,172,0.25)',
                            boxShadow: '0 0 30px -8px rgba(134,239,172,0.4)',
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.1s',
                        }}
                    >
                        <span
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ background: COLORS.greenLight, boxShadow: `0 0 10px ${COLORS.greenLight}` }}
                        />
                        <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: COLORS.greenLight }}>
                            Available for work
                        </span>
                    </div>

                    <p
                        className="text-base mb-3 font-medium"
                        style={{
                            color: 'rgba(255,255,255,0.55)',
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.25s',
                        }}
                    >
                        Hello, I&apos;m
                    </p>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] mb-5">
                        <span className="inline-block overflow-hidden align-bottom">
                            <span
                                className="inline-block"
                                style={{
                                    transform: mounted ? 'translateY(0)' : 'translateY(110%)',
                                    opacity: mounted ? 1 : 0,
                                    transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s',
                                }}
                            >
                                Muhammad
                            </span>
                        </span>{' '}
                        <span className="inline-block overflow-hidden align-bottom">
                            <span
                                className="inline-block"
                                style={{
                                    transform: mounted ? 'translateY(0)' : 'translateY(110%)',
                                    opacity: mounted ? 1 : 0,
                                    transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.55s',
                                    background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright}, ${COLORS.greenLight})`,
                                    backgroundSize: '200% auto',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    filter: 'drop-shadow(0 0 30px rgba(134,239,172,0.35))',
                                    animation: mounted ? 'textShimmer 4s linear infinite' : 'none',
                                }}
                            >
                                Humail
                            </span>
                        </span>
                    </h1>

                    <div
                        className="flex items-center justify-center lg:justify-start gap-2 mb-6 min-h-[36px]"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.75s',
                        }}
                    >
                        <span className="text-lg sm:text-xl font-semibold text-white/90">{typed}</span>
                        <span
                            className="inline-block w-[2px] h-6"
                            style={{
                                background: COLORS.greenLight,
                                boxShadow: `0 0 10px ${COLORS.greenLight}`,
                                animation: 'cursorBlink 0.9s step-end infinite',
                            }}
                        />
                    </div>

                    <p
                        className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
                        style={{
                            color: 'rgba(255,255,255,0.60)',
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.9s',
                        }}
                    >
                        Software Engineering Student at{' '}
                        <span className="font-semibold" style={{ color: COLORS.greenLight }}>Mehran UET</span>{' '}
                        — Building scalable web applications and AI-powered solutions.
                    </p>

                    <div
                        className="flex flex-wrap gap-4 justify-center lg:justify-start"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1) 1.05s',
                        }}
                    >
                        <MagneticButton primary onClick={() => scrollToSection('projects')}>
                            View My Work
                            <span className="text-base">→</span>
                        </MagneticButton>
                        <MagneticButton onClick={() => scrollToSection('contact')}>
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ background: COLORS.greenLight, boxShadow: `0 0 10px ${COLORS.greenLight}` }}
                            />
                            Let&apos;s Talk
                        </MagneticButton>
                    </div>
                </div>

                {/* ─────────────── RIGHT: Profile image ─────────────── */}
                <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <div
                        className="relative"
                        style={{
                            transform: `perspective(1000px) rotateY(${mouse.x * 8}deg) rotateX(${mouse.y * -8}deg)`,
                            transition: 'transform 0.4s ease-out',
                        }}
                    >
                        <div
                            className="absolute inset-0 rounded-full border-2 pointer-events-none"
                            style={{
                                borderColor: 'rgba(134,239,172,0.20)',
                                borderTopColor: COLORS.greenLight,
                                animation: 'spinSlow 8s linear infinite',
                                transform: 'scale(1.15)',
                            }}
                        />
                        <div
                            className="absolute inset-0 rounded-full border pointer-events-none"
                            style={{
                                borderColor: 'rgba(134,239,172,0.10)',
                                animation: 'spinSlow 14s linear infinite reverse',
                                transform: 'scale(1.28)',
                            }}
                        />

                        <div
                            className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(134,239,172,0.35), transparent 70%)',
                                transform: 'scale(1.1)',
                                animation: 'glowPulse 4s ease-in-out infinite',
                            }}
                        />

                        <div
                            className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden"
                            style={{
                                border: '3px solid rgba(134,239,172,0.35)',
                                boxShadow:
                                    '0 20px 60px -15px rgba(0,0,0,0.7), 0 0 80px -20px rgba(134,239,172,0.5), inset 0 1px 0 0 rgba(255,255,255,0.1)',
                                animation: 'floatY 6s ease-in-out infinite',
                                opacity: mounted ? 1 : 0,
                                transition: 'opacity 1s ease 0.5s',
                            }}
                        >
                            <img
                                src="../pic.jpeg"
                                alt="Muhammad Humail"
                                className="w-full h-full object-cover"
                                style={{ filter: 'brightness(1.05) contrast(1.05)' }}
                            />
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: `linear-gradient(135deg, rgba(134,239,172,0.10) 0%, transparent 40%, rgba(10,31,61,0.35) 100%)`,
                                }}
                            />
                        </div>

                        <div
                            className="absolute -bottom-2 -left-4 px-4 py-2.5 rounded-xl backdrop-blur-md"
                            style={{
                                background: 'rgba(10,31,61,0.85)',
                                border: '1px solid rgba(134,239,172,0.30)',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.7), 0 0 30px -10px rgba(134,239,172,0.4)',
                                animation: 'floatY 5s ease-in-out infinite',
                                animationDelay: '0.5s',
                            }}
                        >
                            <p className="text-2xl font-black leading-none" style={{ color: COLORS.greenLight }}>
                                5+
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-white/60 mt-1 font-semibold">
                                Projects
                            </p>
                        </div>

                        <div
                            className="absolute top-4 -right-4 px-4 py-2.5 rounded-xl backdrop-blur-md"
                            style={{
                                background: 'rgba(10,31,61,0.85)',
                                border: '1px solid rgba(134,239,172,0.30)',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.7), 0 0 30px -10px rgba(134,239,172,0.4)',
                                animation: 'floatY 6s ease-in-out infinite',
                                animationDelay: '1.2s',
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{ background: COLORS.greenLight, boxShadow: `0 0 10px ${COLORS.greenLight}` }}
                                />
                                <p className="text-xs font-bold text-white">AI + Web</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Scroll indicator ── */}
            <button
                aria-label="Scroll down"
                onClick={() => scrollToSection('about')}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group z-10"
                style={{
                    opacity: mounted ? 1 : 0,
                    transition: 'opacity 1s ease 1.4s',
                }}
            >
                <span className="text-[10px] uppercase tracking-[0.35em] text-white/50 font-semibold group-hover:text-white/90 transition-colors">
                    Scroll
                </span>
                <span
                    className="relative flex h-10 w-6 rounded-full border"
                    style={{ borderColor: 'rgba(134,239,172,0.5)' }}
                >
                    <span
                        className="absolute left-1/2 top-1.5 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{
                            background: COLORS.greenLight,
                            boxShadow: `0 0 10px ${COLORS.greenLight}`,
                            animation: 'scrollBounce 1.6s ease-in-out infinite',
                        }}
                    />
                </span>
                <svg
                    className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300"
                    style={{ color: COLORS.greenLight }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </button>

            <style>{`
                @keyframes cursorBlink {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0; }
                }
                @keyframes scrollBounce {
                    0%, 100% { transform: translateY(0); opacity: 1; }
                    50%      { transform: translateY(10px); opacity: 0.4; }
                }
                @keyframes floatY {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-14px); }
                }
                @keyframes textShimmer {
                    0%   { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.6; transform: scale(1.1); }
                    50%      { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
        </section>
    );
};

export default Hero;