import React, { useState, useEffect, useRef, useMemo } from 'react';

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

/* =========================================================
   SKILL CATEGORIES
   ========================================================= */
const CATEGORIES = [
    {
        id: 'frontend',
        title: 'Frontend',
        icon: '⚛',
        description: 'Modern, responsive interfaces with smooth interactions.',
        accent: '#86EFAC',
        skills: [
            { name: 'React / Next.js', level: 92 },
            { name: 'JavaScript (ES6+)', level: 90 },
            { name: 'TypeScript', level: 85 },
            { name: 'Tailwind CSS', level: 94 },
            { name: 'HTML5 / CSS3', level: 95 },
        ],
    },
    {
        id: 'backend',
        title: 'Backend',
        icon: '⚙',
        description: 'Scalable APIs, databases, and server-side logic.',
        accent: '#4ADE80',
        skills: [
            { name: 'Node.js / Express', level: 88 },
            { name: 'Python', level: 92 },
            { name: 'REST APIs', level: 90 },
            { name: 'MongoDB / SQL', level: 85 },
            { name: 'Authentication', level: 82 },
        ],
    },
    {
        id: 'ai',
        title: 'AI / ML',
        icon: '🧠',
        description: 'Building intelligent, AI-powered solutions.',
        accent: '#22C55E',
        skills: [
            { name: 'Python for AI', level: 90 },
            { name: 'Machine Learning', level: 82 },
            { name: 'TensorFlow / PyTorch', level: 78 },
            { name: 'Data Processing', level: 85 },
            { name: 'OpenAI / LLMs', level: 88 },
        ],
    },
    {
        id: 'cpp',
        title: 'C++ / DSA',
        icon: '⌘',
        description: 'Strong fundamentals in algorithms and system design.',
        accent: '#86EFAC',
        skills: [
            { name: 'C++', level: 92 },
            { name: 'Data Structures', level: 90 },
            { name: 'Algorithms', level: 88 },
            { name: 'OOP Design', level: 90 },
            { name: 'Problem Solving', level: 93 },
        ],
    },
    {
        id: 'uiux',
        title: 'UI / UX',
        icon: '✦',
        description: 'Designing clean, intuitive, user-first experiences.',
        accent: '#4ADE80',
        skills: [
            { name: 'Figma', level: 85 },
            { name: 'Wireframing', level: 88 },
            { name: 'Responsive Design', level: 94 },
            { name: 'Design Systems', level: 82 },
            { name: 'Accessibility', level: 80 },
        ],
    },
    {
        id: 'tools',
        title: 'Tools',
        icon: '⚡',
        description: 'The workflow that keeps everything shipping smoothly.',
        accent: '#22C55E',
        skills: [
            { name: 'Git / GitHub', level: 92 },
            { name: 'VS Code', level: 95 },
            { name: 'Postman', level: 88 },
            { name: 'Docker (basics)', level: 75 },
            { name: 'Vercel / Netlify', level: 90 },
        ],
    },
];

/* =========================================================
   FLOATING TECH ICONS
   ========================================================= */
const FLOATING_ICONS = [
    { label: 'React', x: '8%', y: '18%', delay: 0 },
    { label: 'Python', x: '82%', y: '12%', delay: 0.8 },
    { label: 'C++', x: '15%', y: '72%', delay: 1.6 },
    { label: 'Node', x: '78%', y: '68%', delay: 2.4 },
    { label: 'AI', x: '48%', y: '88%', delay: 1.2 },
    { label: 'JS', x: '88%', y: '42%', delay: 2.0 },
    { label: 'TS', x: '6%', y: '48%', delay: 0.4 },
    { label: 'Git', x: '55%', y: '8%', delay: 1.4 },
];

/* =========================================================
   HOOK: intersection reveal
   ========================================================= */
const useInView = (threshold = 0.15) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(node);
                }
            },
            { threshold }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold]);
    return [ref, inView];
};

/* =========================================================
   ANIMATED BACKGROUND (Hero-style)
   ========================================================= */
const SkillsBackground = ({ mouse }) => {
    const particles = useMemo(
        () =>
            Array.from({ length: 32 }).map((_, i) => ({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 2.5 + 1,
                duration: Math.random() * 12 + 8,
                delay: Math.random() * 8,
                driftX: (Math.random() - 0.5) * 60,
                driftY: -(Math.random() * 80 + 40),
                opacity: Math.random() * 0.5 + 0.15,
                green: Math.random() > 0.4,
            })),
        []
    );

    const shootingStars = useMemo(
        () =>
            Array.from({ length: 3 }).map((_, i) => ({
                id: i,
                top: Math.random() * 60,
                delay: Math.random() * 12,
                duration: Math.random() * 3 + 4,
            })),
        []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* ── Base gradient ── */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at 15% 20%, ${COLORS.navyLight} 0%, ${COLORS.navyPrimary} 40%, ${COLORS.navyDeepest} 100%)`,
                }}
            />

            {/* ── Aurora layers ── */}
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    background:
                        'radial-gradient(ellipse 55% 50% at 15% 20%, rgba(134,239,172,0.20), transparent 60%)',
                    animation: 'auroraDrift1 20s ease-in-out infinite alternate',
                    transform: `translate(${mouse.x * -15}px, ${mouse.y * -15}px)`,
                }}
            />
            <div
                className="absolute inset-0 opacity-70"
                style={{
                    background:
                        'radial-gradient(ellipse 65% 55% at 85% 80%, rgba(74,222,128,0.16), transparent 60%)',
                    animation: 'auroraDrift2 24s ease-in-out infinite alternate',
                    transform: `translate(${mouse.x * 20}px, ${mouse.y * 20}px)`,
                }}
            />
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background:
                        'radial-gradient(circle 35% at 50% 50%, rgba(34,197,94,0.10), transparent 70%)',
                    animation: 'auroraPulse 12s ease-in-out infinite',
                }}
            />

            {/* ── Conic orbs ── */}
            <div
                className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full blur-[110px]"
                style={{
                    background: `conic-gradient(from 0deg, transparent, rgba(134,239,172,0.22), transparent, rgba(74,222,128,0.20), transparent)`,
                    animation: 'spinSlow 26s linear infinite',
                    transform: `translate(${mouse.x * -30}px, ${mouse.y * -30}px)`,
                }}
            />
            <div
                className="absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full blur-[110px]"
                style={{
                    background: `conic-gradient(from 180deg, transparent, rgba(34,197,94,0.22), transparent, rgba(134,239,172,0.18), transparent)`,
                    animation: 'spinSlow 30s linear infinite reverse',
                    transform: `translate(${mouse.x * 30}px, ${mouse.y * 30}px)`,
                }}
            />

            {/* ── Animated grid ── */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(134,239,172,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(134,239,172,0.9) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    maskImage:
                        'radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)',
                    animation: 'gridShift 25s linear infinite',
                }}
            />

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
                            : `0 0 ${p.size * 3}px rgba(255,255,255,0.5)`,
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
                    className="absolute h-[2px] w-20"
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
            {[20, 55, 80].map((left, i) => (
                <div
                    key={i}
                    className="absolute top-0 bottom-0 w-[1px] opacity-20"
                    style={{
                        left: `${left}%`,
                        background: `linear-gradient(180deg, transparent, ${COLORS.greenLight}, transparent)`,
                        animation: `beamScan ${10 + i * 2}s linear ${i * 1.5}s infinite`,
                    }}
                />
            ))}

            {/* ── Hexagon pattern overlay (subtle, tech-feel) ── */}
            <svg
                className="absolute inset-0 w-full h-full opacity-[0.03]"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="hex-pattern"
                        x="0"
                        y="0"
                        width="60"
                        height="52"
                        patternUnits="userSpaceOnUse"
                        patternTransform="scale(1.5)"
                    >
                        <path
                            d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z"
                            fill="none"
                            stroke="#86EFAC"
                            strokeWidth="0.6"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex-pattern)" />
            </svg>

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
                    style={{ animation: 'waveMove 9s ease-in-out infinite' }}
                />
                <path
                    fill="none"
                    stroke={COLORS.greenBright}
                    strokeWidth="1"
                    d="M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60"
                    style={{ animation: 'waveMove 13s ease-in-out 1s infinite reverse' }}
                />
            </svg>

            {/* ── Top waves ── */}
            <svg
                className="absolute top-0 left-0 w-full h-16 opacity-[0.12]"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
                style={{ transform: 'scaleY(-1)' }}
            >
                <path
                    fill="none"
                    stroke={COLORS.greenLight}
                    strokeWidth="1"
                    d="M0,50 C240,10 480,90 720,50 C960,10 1200,90 1440,50"
                    style={{ animation: 'waveMove 11s ease-in-out infinite reverse' }}
                />
            </svg>

            {/* ── Cursor glow ── */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(134,239,172,0.08), transparent 70%)',
                    transform: `translate(calc(50vw + ${mouse.x * 200}px - 250px), calc(50vh + ${mouse.y * 200}px - 250px))`,
                    transition: 'transform 0.6s ease-out',
                }}
            />

            {/* ── Noise texture ── */}
            <div
                className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

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
                    50%      { opacity: 0.6; transform: scale(1.15); }
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes gridShift {
                    0%   { background-position: 0 0, 0 0; }
                    100% { background-position: 60px 60px, 60px 60px; }
                }
                @keyframes particleFloat {
                    0%, 100% { transform: translate(0, 0); }
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
                @keyframes waveMove {
                    0%, 100% { transform: translateX(0); }
                    50%      { transform: translateX(-40px); }
                }
            `}</style>
        </div>
    );
};

/* =========================================================
   3D TILT CARD (enhanced)
   ========================================================= */
const TiltCard = ({ children, accent, inView, delay }) => {
    const cardRef = useRef(null);
    const [style, setStyle] = useState({});
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const onMove = (e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * 16;
        const rotX = (0.5 - y) * 16;
        setStyle({
            transform: `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(0)`,
            transition: 'transform 0.15s ease-out',
        });
        setGlare({ x: x * 100, y: y * 100, opacity: 1 });
    };

    const onLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
            transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        });
        setGlare((g) => ({ ...g, opacity: 0 }));
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="group relative rounded-2xl p-6 sm:p-7 overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow:
                    'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 10px 40px -15px rgba(0,0,0,0.6)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(50px)',
                transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
                ...style,
            }}
        >
            {/* Hover glow ring */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at 50% 0%, ${accent}25, transparent 70%)`,
                    boxShadow: `0 0 0 1px ${accent}50 inset, 0 0 50px -10px ${accent}80`,
                }}
            />

            {/* ═══ NEW: Cursor glare — light follows mouse ═══ */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
                style={{
                    background: `radial-gradient(circle 220px at ${glare.x}% ${glare.y}%, ${accent}30, transparent 60%)`,
                    opacity: glare.opacity,
                }}
            />

            {/* ═══ NEW: Animated corner brackets ═══ */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                fill="none"
            >
                <path
                    d="M 8 8 L 8 24 M 8 8 L 24 8"
                    stroke={accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M -8 8 L -8 24 M -8 8 L -24 8"
                    stroke={accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    transform="translate(100%, 0)"
                    style={{ transform: 'translateX(calc(100% - 0px))' }}
                />
            </svg>

            <div className="relative z-10">{children}</div>

            {/* Bottom accent line */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                    boxShadow: `0 0 20px ${accent}`,
                }}
            />
        </div>
    );
};

/* =========================================================
   ANIMATED PROGRESS BAR (enhanced with orbiting dot)
   ========================================================= */
const ProgressBar = ({ name, level, accent, inView, delay }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const t = setTimeout(() => setWidth(level), 300 + delay * 1000);
        return () => clearTimeout(t);
    }, [inView, level, delay]);

    return (
        <div className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white/85">{name}</span>
                <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: accent }}
                >
                    {level}%
                </span>
            </div>
            <div
                className="relative h-2 rounded-full overflow-hidden"
                style={{
                    background: 'rgba(255,255,255,0.06)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
                }}
            >
                <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${accent}, ${COLORS.greenBright})`,
                        boxShadow: `0 0 12px ${accent}90, inset 0 1px 0 0 rgba(255,255,255,0.3)`,
                        transition: 'width 1.6s cubic-bezier(0.22,1,0.36,1)',
                    }}
                >
                    {/* Shine sweep */}
                    <div
                        className="absolute inset-0 rounded-full opacity-70"
                        style={{
                            background:
                                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                            animation: 'shine 2.4s linear infinite',
                        }}
                    />

                    {/* ═══ NEW: Glowing orb at the tip ═══ */}
                    <span
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full"
                        style={{
                            background: accent,
                            boxShadow: `0 0 10px ${accent}, 0 0 20px ${accent}80`,
                            animation: 'orbPulse 2s ease-in-out infinite',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

/* =========================================================
   SKILLS SECTION
   ========================================================= */
const Skills = () => {
    const [sectionRef, sectionInView] = useInView(0.1);
    const [gridRef, gridInView] = useInView(0.1);
    const [activeCategory, setActiveCategory] = useState('all');
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    /* Mouse tracker — feeds background parallax */
    useEffect(() => {
        const onMove = (e) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
            setMouse({ x, y });
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    const filtered =
        activeCategory === 'all'
            ? CATEGORIES
            : CATEGORIES.filter((c) => c.id === activeCategory);

    return (
        <section
            id="skills"
            ref={(node) => {
                sectionRef.current = node;
                containerRef.current = node;
            }}
            className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: COLORS.navyDark }}
        >
            {/* ═══════ ANIMATED BACKGROUND ═══════ */}
            <SkillsBackground mouse={mouse} />

            {/* ───── Floating tech icons ───── */}
            {FLOATING_ICONS.map((icon) => (
                <div
                    key={icon.label}
                    className="hidden md:block absolute pointer-events-none select-none z-[5]"
                    style={{
                        left: icon.x,
                        top: icon.y,
                        animation: `floatIcon 7s ease-in-out infinite`,
                        animationDelay: `${icon.delay}s`,
                    }}
                >
                    <div
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold backdrop-blur-sm"
                        style={{
                            color: COLORS.greenLight,
                            background: 'rgba(134,239,172,0.06)',
                            border: '1px solid rgba(134,239,172,0.20)',
                            boxShadow: '0 4px 20px -8px rgba(134,239,172,0.4)',
                            opacity: 0.55,
                        }}
                    >
                        {icon.label}
                    </div>
                </div>
            ))}

            <style>{`
                @keyframes shine {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                @keyframes floatIcon {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50%      { transform: translateY(-18px) translateX(8px); }
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(134,239,172,0.4); }
                    50%      { box-shadow: 0 0 0 12px rgba(134,239,172,0); }
                }
                @keyframes orbPulse {
                    0%, 100% { transform: translate(50%, -50%) scale(1); opacity: 1; }
                    50%      { transform: translate(50%, -50%) scale(1.4); opacity: 0.7; }
                }
                @keyframes badgeRotate {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes countRise {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* ───── Section header ───── */}
                <div
                    className="text-center mb-14"
                    style={{
                        opacity: sectionInView ? 1 : 0,
                        transform: sectionInView ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)',
                    }}
                >
                    <p
                        className="inline-block text-xs font-bold uppercase tracking-[0.4em] mb-4 px-4 py-1.5 rounded-full"
                        style={{
                            color: COLORS.greenLight,
                            background: 'rgba(134,239,172,0.08)',
                            border: '1px solid rgba(134,239,172,0.25)',
                        }}
                    >
                        02 — Skills
                    </p>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                        My{' '}
                        <span
                            style={{
                                background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright}, ${COLORS.greenLight})`,
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 30px rgba(134,239,172,0.35))',
                                animation: 'shimmerText 4s linear infinite',
                            }}
                        >
                            expertise
                        </span>
                    </h2>
                    <p
                        className="max-w-2xl mx-auto mt-5 text-base leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                        A blend of full-stack engineering, AI development, and strong computer-science
                        fundamentals — built to ship real products.
                    </p>
                </div>

                {/* ───── Filter tabs ───── */}
                <div
                    className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
                    style={{
                        opacity: sectionInView ? 1 : 0,
                        transform: sectionInView ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s',
                    }}
                >
                    {[{ id: 'all', title: 'All' }, ...CATEGORIES].map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className="group relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                                style={{
                                    color: isActive ? COLORS.navyPrimary : 'rgba(255,255,255,0.70)',
                                    background: isActive
                                        ? `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright})`
                                        : 'rgba(255,255,255,0.04)',
                                    border: isActive
                                        ? '1px solid transparent'
                                        : '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: isActive
                                        ? '0 6px 20px -4px rgba(74,222,128,0.55), inset 0 1px 0 0 rgba(255,255,255,0.4)'
                                        : 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
                                }}
                            >
                                <span className="relative z-10">{cat.title}</span>
                                {/* Hover sweep */}
                                {!isActive && (
                                    <span
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            background:
                                                'linear-gradient(90deg, transparent, rgba(134,239,172,0.15), transparent)',
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ───── Skill cards grid ───── */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
                >
                    {filtered.map((cat, i) => (
                        <TiltCard
                            key={cat.id}
                            accent={cat.accent}
                            inView={gridInView}
                            delay={i * 0.08}
                        >
                            {/* Card header */}
                            <div className="flex items-start gap-4 mb-5">
                                {/* ═══ NEW: Animated rotating icon wrapper ═══ */}
                                <div className="relative w-12 h-12 shrink-0">
                                    {/* Rotating outer ring */}
                                    <div
                                        className="absolute inset-0 rounded-xl pointer-events-none"
                                        style={{
                                            border: `1px dashed ${cat.accent}70`,
                                            animation: 'badgeRotate 12s linear infinite',
                                        }}
                                    />
                                    {/* Static tile */}
                                    <div
                                        className="relative w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${cat.accent}30, ${cat.accent}10)`,
                                            border: `1px solid ${cat.accent}50`,
                                            boxShadow: `0 4px 20px -6px ${cat.accent}70, inset 0 1px 0 0 rgba(255,255,255,0.1)`,
                                        }}
                                    >
                                        <span>{cat.icon}</span>
                                        <span
                                            className="absolute inset-0 rounded-xl pointer-events-none"
                                            style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-white leading-tight">
                                        {cat.title}
                                    </h3>
                                    <p
                                        className="text-xs leading-snug mt-1"
                                        style={{ color: 'rgba(255,255,255,0.5)' }}
                                    >
                                        {cat.description}
                                    </p>
                                </div>
                            </div>

                            {/* Progress bars */}
                            <div>
                                {cat.skills.map((skill, j) => (
                                    <ProgressBar
                                        key={skill.name}
                                        name={skill.name}
                                        level={skill.level}
                                        accent={cat.accent}
                                        inView={gridInView}
                                        delay={i * 0.08 + j * 0.1}
                                    />
                                ))}
                            </div>
                        </TiltCard>
                    ))}
                </div>

                {/* ───── Bottom summary strip ───── */}
                <div
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
                    style={{
                        opacity: gridInView ? 1 : 0,
                        transform: gridInView ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s',
                    }}
                >
                    {[
                        { label: 'Frontend', value: '90%+' },
                        { label: 'Backend', value: '88%+' },
                        { label: 'AI / ML', value: '85%+' },
                        { label: 'C++ / DSA', value: '92%+' },
                    ].map((s, i) => (
                        <div
                            key={s.label}
                            className="group relative text-center rounded-2xl py-5 px-4 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow:
                                    'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 10px 40px -15px rgba(0,0,0,0.6)',
                            }}
                        >
                            {/* ═══ NEW: Hover radial glow ═══ */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background:
                                        'radial-gradient(circle at 50% 100%, rgba(134,239,172,0.20), transparent 70%)',
                                }}
                            />
                            <p
                                className="relative text-2xl sm:text-3xl font-black mb-1"
                                style={{
                                    color: COLORS.greenLight,
                                    filter: 'drop-shadow(0 0 20px rgba(134,239,172,0.4))',
                                    animation: gridInView
                                        ? `countRise 0.8s cubic-bezier(0.22,1,0.36,1) ${0.5 + i * 0.1}s both`
                                        : 'none',
                                }}
                            >
                                {s.value}
                            </p>
                            <p className="relative text-[11px] uppercase tracking-widest text-white/55 font-semibold">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;