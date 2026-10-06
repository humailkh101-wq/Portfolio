import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

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
   FILTERS
   ========================================================= */
const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'web', label: 'Web' },
    { id: 'app', label: 'App' },
    { id: 'ui', label: 'UI' },
];

/* =========================================================
   PROJECTS
   ========================================================= */
const PROJECTS = [
    {
        id: 1,
        title: 'AI Content Studio',
        category: 'web',
        categoryLabel: 'Web · AI',
        year: '2025',
        tagline: 'AI-powered content generation',
        description:
            'A full-stack platform generating blogs, captions, and product copy using LLMs. Real-time streaming, prompt library, and multi-format export.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&q=80',
        tech: ['React', 'Node.js', 'Python', 'OpenAI', 'MongoDB'],
        liveUrl: '#',
        codeUrl: '#',
        stats: { likes: 240, views: '3.2k', commits: 480 },
        accent: '#86EFAC',
    },
    {
        id: 2,
        title: 'DevCollab Workspace',
        category: 'web',
        categoryLabel: 'Web · Full-Stack',
        year: '2024',
        tagline: 'Real-time collaboration for devs',
        description:
            'A collaborative coding workspace with live cursors, shared terminals, and integrated task boards.',
        image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1400&q=80',
        tech: ['Next.js', 'Socket.io', 'TypeScript', 'PostgreSQL'],
        liveUrl: '#',
        codeUrl: '#',
        stats: { likes: 182, views: '2.1k', commits: 320 },
        accent: '#4ADE80',
    },
    {
        id: 3,
        title: 'VisionSort AI',
        category: 'app',
        categoryLabel: 'App · AI',
        year: '2024',
        tagline: 'Image classification on-device',
        description:
            'A Python + TensorFlow application that classifies and organizes images with on-device inference.',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1400&q=80',
        tech: ['Python', 'TensorFlow', 'PyQt', 'OpenCV'],
        liveUrl: '#',
        codeUrl: '#',
        stats: { likes: 156, views: '1.8k', commits: 260 },
        accent: '#22C55E',
    },
    {
        id: 4,
        title: 'C++ Algorithm Visualizer',
        category: 'app',
        categoryLabel: 'App · C++',
        year: '2023',
        tagline: 'Interactive DSA learning tool',
        description:
            'An interactive desktop app that visualizes sorting and pathfinding algorithms in real time.',
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1400&q=80',
        tech: ['C++', 'SFML', 'CMake'],
        liveUrl: '#',
        codeUrl: '#',
        stats: { likes: 210, views: '2.6k', commits: 410 },
        accent: '#86EFAC',
    },
    {
        id: 5,
        title: 'FinTrack Dashboard',
        category: 'ui',
        categoryLabel: 'UI · Web',
        year: '2024',
        tagline: 'Personal finance visual UI',
        description:
            'A polished personal-finance dashboard concept focusing on clarity, motion, and data storytelling.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80',
        tech: ['Figma', 'React', 'Tailwind', 'Recharts'],
        liveUrl: '#',
        codeUrl: '#',
        stats: { likes: 320, views: '4.1k', commits: 190 },
        accent: '#4ADE80',
    },
    {
        id: 6,
        title: 'TaskPilot Mobile',
        category: 'app',
        categoryLabel: 'App · Productivity',
        year: '2023',
        tagline: 'AI-assisted task manager',
        description:
            'A mobile-first task manager that auto-prioritizes your day using heuristics + AI.',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1400&q=80',
        tech: ['React Native', 'Python', 'Firebase'],
        liveUrl: '#',
        codeUrl: '#',
        stats: { likes: 198, views: '2.4k', commits: 300 },
        accent: '#22C55E',
    },
];

/* =========================================================
   HOOKS
   ========================================================= */
const useInView = (threshold = 0.15, once = true) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (once) obs.unobserve(node);
                } else if (!once) setInView(false);
            },
            { threshold }
        );
        obs.observe(node);
        return () => obs.disconnect();
    }, [threshold, once]);
    return [ref, inView];
};

/* =========================================================
   PARTICLE FIELD (canvas)
   ========================================================= */
const ParticleField = ({ accent }) => {
    const canvasRef = useRef(null);
    const accentRef = useRef(accent);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => { accentRef.current = accent; }, [accent]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;
        let particles = [];

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx.scale(dpr, dpr);
            const count = Math.min(60, Math.floor(canvas.offsetWidth / 22));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.offsetWidth,
                y: Math.random() * canvas.offsetHeight,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 1.6 + 0.6,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            const color = accentRef.current || COLORS.greenLight;

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.offsetWidth;
                if (p.x > canvas.offsetWidth) p.x = 0;
                if (p.y < 0) p.y = canvas.offsetHeight;
                if (p.y > canvas.offsetHeight) p.y = 0;

                // Mouse repel
                const dx = p.x - mouseRef.current.x;
                const dy = p.y - mouseRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    p.x += (dx / dist) * force * 1.5;
                    p.y += (dy / dist) * force * 1.5;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.5;
                ctx.fill();

                // Connections
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const ddx = p.x - q.x;
                    const ddy = p.y - q.y;
                    const d = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (d < 110) {
                        ctx.beginPath();
                        ctx.strokeStyle = color;
                        ctx.globalAlpha = (1 - d / 110) * 0.18;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            });
            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(draw);
        };

        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        resize();
        draw();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMove);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.75 }}
        />
    );
};

/* =========================================================
   MAGNETIC BUTTON (enhanced with glow trail)
   ========================================================= */
const MagneticButton = ({ children, onClick, variant = 'primary', size = 'md', icon }) => {
    const ref = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [glow, setGlow] = useState({ x: 50, y: 50 });

    const onMove = (e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        setPos({
            x: (px - rect.width / 2) * 0.35,
            y: (py - rect.height / 2) * 0.35,
        });
        setGlow({ x: (px / rect.width) * 100, y: (py / rect.height) * 100 });
    };
    const onLeave = () => {
        setPos({ x: 0, y: 0 });
        setGlow({ x: 50, y: 50 });
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-7 py-3.5 text-sm',
    };

    const variants = {
        primary: {
            background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright}, ${COLORS.greenLight})`,
            color: COLORS.navyPrimary,
            boxShadow:
                '0 6px 20px -4px rgba(74,222,128,0.55), 0 14px 40px -10px rgba(34,197,94,0.45), inset 0 1px 0 0 rgba(255,255,255,0.4)',
        },
        ghost: {
            background: 'rgba(255,255,255,0.04)',
            color: COLORS.white,
            border: `1px solid rgba(134,239,172,0.35)`,
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
        },
    };

    return (
        <button
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onClick={onClick}
            className={`group relative overflow-hidden inline-flex items-center gap-3 rounded-xl font-bold active:scale-95 ${sizes[size]}`}
            style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                ...variants[variant],
            }}
        >
            {/* Cursor-follow glow for primary */}
            {variant === 'primary' && (
                <span
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.7), transparent 50%)`,
                    }}
                />
            )}
            {/* Shine sweep for ghost */}
            {variant === 'ghost' && (
                <span
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                    style={{
                        background: `linear-gradient(90deg, transparent, rgba(134,239,172,0.25), transparent)`,
                        transform: 'translateX(-100%)',
                        animation: 'btnShine 1.8s ease infinite',
                    }}
                />
            )}
            <span className="relative z-10 flex items-center gap-2">
                {children}
                {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
            </span>
        </button>
    );
};

/* =========================================================
   ANIMATED NUMBER COUNTER
   ========================================================= */
const Counter = ({ value, duration = 1400, prefix = '', suffix = '' }) => {
    const [n, setN] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const t0 = performance.now();
                const tick = (now) => {
                    const p = Math.min((now - t0) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    setN(Math.round(value * eased));
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.4 });
        obs.observe(node);
        return () => obs.disconnect();
    }, [value, duration]);

    return <span ref={ref}>{prefix}{n}{suffix}</span>;
};

/* =========================================================
   3D STACK CARD
   ========================================================= */
const StackCard = ({ project, position, isActive, onSelect, mouse }) => {
    const abs = Math.abs(position);
    const accent = project.accent || COLORS.greenLight;

    const baseScale = isActive ? 1 : 1 - abs * 0.09;
    const baseX = position * 70;
    const baseY = abs * 34;
    const baseRotateY = position * -16 + (isActive ? mouse.x * 8 : 0);
    const baseRotateX = abs * 3 + (isActive ? mouse.y * -6 : 0);
    const baseOpacity = isActive ? 1 : Math.max(0, 1 - abs * 0.4);
    const zIndex = 10 - abs;
    const blur = isActive ? 0 : abs * 1.5;

    return (
        <div
            onClick={() => !isActive && onSelect()}
            className="absolute top-1/2 left-1/2 w-[300px] sm:w-[400px] lg:w-[460px] aspect-[16/10] rounded-3xl overflow-hidden"
            style={{
                transform: `translate(-50%, -50%) translate(${baseX}px, ${baseY}px) scale(${baseScale}) rotateY(${baseRotateY}deg) rotateX(${baseRotateX}deg)`,
                opacity: baseOpacity,
                zIndex,
                filter: `blur(${blur}px)`,
                transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
                transformStyle: 'preserve-3d',
                cursor: isActive ? 'default' : 'pointer',
                border: isActive ? `1px solid ${accent}80` : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isActive
                    ? `0 40px 100px -20px rgba(0,0,0,0.95), 0 0 100px -20px ${accent}90, inset 0 1px 0 0 rgba(255,255,255,0.1)`
                    : '0 20px 60px -20px rgba(0,0,0,0.85)',
            }}
        >
            <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div
                className="absolute inset-0"
                style={{
                    background: isActive
                        ? `linear-gradient(180deg, transparent 40%, rgba(4,16,31,0.75) 100%)`
                        : `linear-gradient(180deg, rgba(4,16,31,0.5) 0%, rgba(4,16,31,0.9) 100%)`,
                }}
            />

            {isActive && (
                <>
                    {/* Scanline grid */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-25"
                        style={{
                            backgroundImage:
                                `linear-gradient(${accent}60 1px, transparent 1px), linear-gradient(90deg, ${accent}60 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                            mixBlendMode: 'overlay',
                        }}
                    />
                    {/* Rotating corner accents */}
                    <div
                        className="absolute top-3 left-3 w-8 h-8 pointer-events-none"
                        style={{
                            borderTop: `2px solid ${accent}`,
                            borderLeft: `2px solid ${accent}`,
                            borderTopLeftRadius: 8,
                            boxShadow: `0 0 15px ${accent}80`,
                        }}
                    />
                    <div
                        className="absolute bottom-3 right-3 w-8 h-8 pointer-events-none"
                        style={{
                            borderBottom: `2px solid ${accent}`,
                            borderRight: `2px solid ${accent}`,
                            borderBottomRightRadius: 8,
                            boxShadow: `0 0 15px ${accent}80`,
                        }}
                    />
                </>
            )}

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1.5" style={{ color: accent }}>
                    {project.categoryLabel}
                </p>
                <p className="text-white font-bold text-lg leading-tight">{project.title}</p>
            </div>

            {/* Accent glow */}
            {isActive && (
                <div
                    className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${accent}70, transparent 70%)` }}
                />
            )}
        </div>
    );
};

/* =========================================================
   SIDE PROGRESS TRACK
   ========================================================= */
const SideProgress = ({ total, current, onSelect, accent }) => (
    <div className="hidden xl:flex flex-col items-center gap-4 fixed left-8 top-1/2 -translate-y-1/2 z-30">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 rotate-180"
            style={{ writingMode: 'vertical-rl' }}>
            Projects
        </div>
        <div className="flex flex-col items-center gap-2.5">
            {Array.from({ length: total }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => onSelect(i)}
                    aria-label={`Project ${i + 1}`}
                    className="relative py-1 group"
                >
                    <span
                        className="block rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{
                            width: 8,
                            height: current === i ? 30 : 8,
                            background: current === i ? accent : 'rgba(255,255,255,0.20)',
                            boxShadow: current === i ? `0 0 20px ${accent}` : 'none',
                        }}
                    />
                    {current === i && (
                        <span
                            className="absolute -inset-2 rounded-full pointer-events-none"
                            style={{
                                border: `1px solid ${accent}60`,
                                animation: 'pulseRing 2s ease-in-out infinite',
                            }}
                        />
                    )}
                </button>
            ))}
        </div>
        <div className="text-[10px] font-black tabular-nums text-white/60"
            style={{ writingMode: 'vertical-rl' }}>
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
    </div>
);

/* =========================================================
   MODAL
   ========================================================= */
const ProjectModal = ({ project, onClose }) => {
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!project) return null;
    const accent = project.accent || COLORS.greenLight;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
            <div
                onClick={onClose}
                className="absolute inset-0 backdrop-blur-2xl"
                style={{ backgroundColor: 'rgba(4,16,31,0.92)', animation: 'fadeIn 0.35s ease' }}
            />
            <div
                className="relative w-full max-w-6xl max-h-[93vh] overflow-y-auto rounded-3xl"
                style={{
                    background: `linear-gradient(180deg, ${COLORS.navyPrimary}, ${COLORS.navyDark})`,
                    border: `1px solid ${accent}40`,
                    boxShadow: `0 50px 120px -25px rgba(0,0,0,0.95), 0 0 120px -30px ${accent}80, inset 0 1px 0 0 rgba(255,255,255,0.08)`,
                    animation: 'modalIn 0.6s cubic-bezier(0.22,1,0.36,1)',
                }}
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-20 w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
                    style={{
                        background: 'rgba(4,16,31,0.85)',
                        border: `1px solid ${accent}50`,
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    ✕
                </button>

                <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(180deg, rgba(4,16,31,0.15) 0%, rgba(10,31,61,0.55) 55%, ${COLORS.navyPrimary} 100%)`,
                        }}
                    />
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(${accent}60 1px, transparent 1px), linear-gradient(90deg, ${accent}60 1px, transparent 1px)`,
                            backgroundSize: '50px 50px',
                            mixBlendMode: 'overlay',
                        }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12">
                        <span
                            className="inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4"
                            style={{
                                color: COLORS.navyPrimary,
                                background: `linear-gradient(90deg, ${accent}, ${COLORS.greenBright})`,
                            }}
                        >
                            {project.categoryLabel} · {project.year}
                        </span>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.02]">
                            {project.title}
                        </h2>
                        <p className="text-sm sm:text-lg mt-3 font-bold" style={{ color: accent }}>
                            {project.tagline}
                        </p>
                    </div>
                </div>

                <div className="p-6 sm:p-10 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2">
                            <h4 className="text-xs uppercase tracking-[0.3em] font-black mb-4" style={{ color: accent }}>
                                Overview
                            </h4>
                            <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.72)' }}>
                                {project.description}
                            </p>

                            <h4 className="text-xs uppercase tracking-[0.3em] font-black mb-4" style={{ color: accent }}>
                                Built With
                            </h4>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {project.tech.map((t) => (
                                    <span
                                        key={t}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5"
                                        style={{
                                            color: accent,
                                            background: `${accent}15`,
                                            border: `1px solid ${accent}45`,
                                        }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <MagneticButton variant="primary" size="lg" onClick={() => window.open(project.liveUrl, '_blank')} icon="↗">
                                    Live Demo
                                </MagneticButton>
                                <MagneticButton variant="ghost" size="lg" onClick={() => window.open(project.codeUrl, '_blank')}>
                                    ⟨/⟩ View Code
                                </MagneticButton>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-[0.3em] font-black mb-4" style={{ color: accent }}>
                                Metrics
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'Likes', value: project.stats.likes },
                                    { label: 'Views', value: project.stats.views },
                                    { label: 'Commits', value: project.stats.commits },
                                    { label: 'Year', value: project.year },
                                ].map((s) => (
                                    <div
                                        key={s.label}
                                        className="flex items-center justify-between rounded-2xl px-4 py-3 transition-all hover:translate-x-1"
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                        }}
                                    >
                                        <span className="text-xs uppercase tracking-widest text-white/50 font-bold">
                                            {s.label}
                                        </span>
                                        <span className="text-base font-black" style={{ color: accent }}>
                                            {s.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* =========================================================
   SECTION
   ========================================================= */
const Projects = () => {
    const [sectionRef, sectionInView] = useInView(0.08);
    const [activeIndex, setActiveIndex] = useState(0);
    const [filter, setFilter] = useState('all');
    const [selected, setSelected] = useState(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isTransitioning, setIsTransitioning] = useState(false);
    const stageRef = useRef(null);

    const filtered = useMemo(
        () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
        [filter]
    );
    const total = filtered.length;
    const current = Math.min(activeIndex, total - 1);
    const activeProject = filtered[current];
    const accent = activeProject?.accent || COLORS.greenLight;

    /* Mouse for 3D tilt */
    useEffect(() => {
        const onMove = (e) => {
            const rect = stageRef.current?.getBoundingClientRect();
            if (!rect) return;
            setMouse({
                x: (e.clientX - rect.left) / rect.width - 0.5,
                y: (e.clientY - rect.top) / rect.height - 0.5,
            });
        };
        const node = stageRef.current;
        node?.addEventListener('mousemove', onMove);
        return () => node?.removeEventListener('mousemove', onMove);
    }, []);

    const goTo = useCallback(
        (i) => {
            if (isTransitioning) return;
            setIsTransitioning(true);
            setActiveIndex(((i % total) + total) % total);
            setTimeout(() => setIsTransitioning(false), 750);
        },
        [total, isTransitioning]
    );

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    /* Keyboard nav */
    useEffect(() => {
        const onKey = (e) => {
            if (selected) return;
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [next, prev, selected]);

    /* Reset on filter change */
    useEffect(() => { setActiveIndex(0); }, [filter]);

    /* Autoplay */
    useEffect(() => {
        if (selected) return;
        const id = setInterval(() => {
            setActiveIndex((i) => (i + 1) % total);
        }, 6500);
        return () => clearInterval(id);
    }, [total, selected]);

    const counts = {
        all: PROJECTS.length,
        web: PROJECTS.filter((p) => p.category === 'web').length,
        app: PROJECTS.filter((p) => p.category === 'app').length,
        ui: PROJECTS.filter((p) => p.category === 'ui').length,
    };

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="relative overflow-hidden py-24 sm:py-32"
            style={{
                backgroundColor: COLORS.navyPrimary,
                background: `radial-gradient(circle at 50% 0%, ${COLORS.navyLight} 0%, ${COLORS.navyPrimary} 45%, ${COLORS.navyDeepest} 100%)`,
            }}
        >
            {/* Particle field */}
            <ParticleField accent={accent} />

            {/* Dynamic blobs */}
            <div
                className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-all duration-1000"
                style={{ background: `radial-gradient(circle, ${accent}25, transparent 70%)` }}
            />
            <div
                className="absolute bottom-0 -right-40 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.10), transparent 70%)' }}
            />

            <style>{`
        @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn  {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes btnShine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes letterWave {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
      `}</style>

            {/* Side progress rail */}
            <SideProgress total={total} current={current} onSelect={goTo} accent={accent} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div
                    className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16"
                    style={{
                        opacity: sectionInView ? 1 : 0,
                        transform: sectionInView ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
                    }}
                >
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-5">
                            <span
                                className="px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.35em]"
                                style={{
                                    color: accent,
                                    background: `${accent}15`,
                                    border: `1px solid ${accent}45`,
                                    transition: 'all 0.6s ease',
                                }}
                            >
                                03 — Portfolio
                            </span>
                        </div>
                        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight">
                            Projects that{' '}
                            <span
                                style={{
                                    background: `linear-gradient(90deg, ${accent}, ${COLORS.greenBright}, ${accent})`,
                                    backgroundSize: '200% 100%',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    animation: 'gradientShift 4s ease infinite',
                                    filter: `drop-shadow(0 0 30px ${accent}70)`,
                                    transition: 'all 0.6s ease',
                                }}
                            >
                                ship.
                            </span>
                        </h2>
                        <p
                            className="text-base sm:text-lg leading-relaxed mt-6 max-w-2xl"
                            style={{ color: 'rgba(255,255,255,0.55)' }}
                        >
                            A curated journey through full-stack platforms, AI tools, and product-focused builds.
                            Navigate with <span className="font-bold" style={{ color: accent }}>← →</span>, the side rail, or the dots below.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((f) => {
                            const isActive = filter === f.id;
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className="group relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                                    style={{
                                        color: isActive ? COLORS.navyPrimary : 'rgba(255,255,255,0.70)',
                                        background: isActive
                                            ? `linear-gradient(90deg, ${accent}, ${COLORS.greenBright})`
                                            : 'rgba(255,255,255,0.04)',
                                        border: isActive ? '1px solid transparent' : '1px solid rgba(255,255,255,0.08)',
                                        boxShadow: isActive
                                            ? `0 6px 20px -4px ${accent}90, inset 0 1px 0 0 rgba(255,255,255,0.4)`
                                            : 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <span className="relative z-10 inline-flex items-center gap-2">
                                        {f.label}
                                        <span
                                            className="text-[10px] font-black px-1.5 py-0.5 rounded tabular-nums"
                                            style={{
                                                color: isActive ? COLORS.navyPrimary : accent,
                                                background: isActive ? 'rgba(10,31,61,0.15)' : `${accent}20`,
                                            }}
                                        >
                                            {counts[f.id]}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main stage */}
                <div
                    ref={stageRef}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                    style={{
                        opacity: sectionInView ? 1 : 0,
                        transform: sectionInView ? 'translateY(0)' : 'translateY(40px)',
                        transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.15s',
                    }}
                >
                    {/* Left info */}
                    <div className="order-2 lg:order-1 min-h-[520px] relative">
                        {activeProject && (
                            <div key={activeProject.id} style={{ animation: 'fadeIn 0.6s ease' }}>
                                {/* Big number */}
                                <div className="flex items-end gap-3 mb-5">
                                    <span
                                        className="text-7xl sm:text-8xl lg:text-9xl font-black leading-none tabular-nums"
                                        style={{
                                            background: `linear-gradient(180deg, ${accent} 0%, ${accent}11 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            filter: `drop-shadow(0 0 30px ${accent}60)`,
                                        }}
                                    >
                                        {String(current + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-2xl font-black text-white/25 mb-6">
                                        / {String(total).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Chips */}
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span
                                        className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                        style={{
                                            color: COLORS.navyPrimary,
                                            background: `linear-gradient(90deg, ${accent}, ${COLORS.greenBright})`,
                                            boxShadow: `0 4px 14px -4px ${accent}90`,
                                        }}
                                    >
                                        {activeProject.categoryLabel}
                                    </span>
                                    <span className="text-xs font-bold text-white/45 tabular-nums">{activeProject.year}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.02] tracking-tight mb-4">
                                    {activeProject.title}
                                </h3>

                                {/* Tagline */}
                                <p className="text-base sm:text-lg font-bold mb-5" style={{ color: accent }}>
                                    {activeProject.tagline}
                                </p>

                                {/* Desc */}
                                <p
                                    className="text-sm sm:text-base leading-relaxed mb-7 max-w-md"
                                    style={{ color: 'rgba(255,255,255,0.62)' }}
                                >
                                    {activeProject.description}
                                </p>

                                {/* Tech */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {activeProject.tech.map((t, i) => (
                                        <span
                                            key={t}
                                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 hover:-translate-y-0.5"
                                            style={{
                                                color: accent,
                                                background: `${accent}15`,
                                                border: `1px solid ${accent}45`,
                                                animation: `letterWave 2.4s ease-in-out infinite`,
                                                animationDelay: `${i * 0.15}s`,
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* CTAs */}
                                <div className="flex flex-wrap items-center gap-3 mb-8">
                                    <MagneticButton
                                        variant="primary"
                                        size="lg"
                                        onClick={() => setSelected(activeProject)}
                                        icon="→"
                                    >
                                        View Project
                                    </MagneticButton>
                                    <MagneticButton
                                        variant="ghost"
                                        size="lg"
                                        onClick={() => window.open(activeProject.codeUrl, '_blank')}
                                    >
                                        ⟨/⟩ Code
                                    </MagneticButton>
                                </div>

                                {/* Metrics grid */}
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    {[
                                        { label: 'Likes', value: activeProject.stats.likes },
                                        { label: 'Views', value: activeProject.stats.views },
                                        { label: 'Commits', value: activeProject.stats.commits },
                                    ].map((s) => (
                                        <div
                                            key={s.label}
                                            className="rounded-2xl px-3 py-3 text-center"
                                            style={{
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                            }}
                                        >
                                            <p className="text-lg font-black tabular-nums" style={{ color: accent }}>
                                                <Counter value={s.value} />
                                            </p>
                                            <p className="text-[9px] uppercase tracking-widest text-white/45 font-bold mt-1">
                                                {s.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Nav row */}
                                <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                    <button
                                        onClick={prev}
                                        aria-label="Previous"
                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:-translate-x-1 hover:bg-white/10"
                                        style={{
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.10)',
                                        }}
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={next}
                                        aria-label="Next"
                                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:translate-x-1"
                                        style={{
                                            background: `linear-gradient(90deg, ${accent}, ${COLORS.greenBright})`,
                                            color: COLORS.navyPrimary,
                                            boxShadow: `0 6px 20px -6px ${accent}90`,
                                        }}
                                    >
                                        →
                                    </button>
                                    <div className="flex-1 h-px ml-2" style={{ background: 'rgba(255,255,255,0.10)' }} />
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">
                                        Keyboard ◄ ►
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right stack */}
                    <div
                        className="relative order-1 lg:order-2 h-[380px] sm:h-[460px] lg:h-[540px]"
                        style={{ perspective: '1500px' }}
                    >
                        {/* Rotating ring */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] sm:w-[540px] sm:h-[540px] rounded-full border pointer-events-none transition-all duration-1000"
                            style={{
                                borderColor: `${accent}25`,
                                borderStyle: 'dashed',
                                animation: 'spinSlow 50s linear infinite',
                            }}
                        />
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] sm:w-[620px] sm:h-[620px] rounded-full pointer-events-none"
                            style={{
                                border: `1px solid ${accent}10`,
                            }}
                        />

                        {/* Cards */}
                        {filtered.map((project, i) => {
                            let rel = i - current;
                            if (total > 4) {
                                if (rel > total / 2) rel -= total;
                                if (rel < -total / 2) rel += total;
                            }
                            if (Math.abs(rel) > 2) return null;
                            return (
                                <StackCard
                                    key={project.id}
                                    project={project}
                                    position={rel}
                                    isActive={rel === 0}
                                    onSelect={() => goTo(i)}
                                    mouse={mouse}
                                />
                            );
                        })}

                        {/* Bottom dots */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            {filtered.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    aria-label={`Project ${i + 1}`}
                                    className="transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                    style={{
                                        width: i === current ? 32 : 8,
                                        height: 8,
                                        borderRadius: 999,
                                        background: i === current ? accent : 'rgba(255,255,255,0.20)',
                                        boxShadow: i === current ? `0 0 15px ${accent}` : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div
                    className="text-center mt-24"
                    style={{
                        opacity: sectionInView ? 1 : 0,
                        transform: sectionInView ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.4s',
                    }}
                >
                    <MagneticButton
                        variant="ghost"
                        size="lg"
                        onClick={() => window.open('https://github.com', '_blank')}
                        icon="↗"
                    >
                        Explore all projects on GitHub
                    </MagneticButton>
                </div>
            </div>

            {/* Modal */}
            {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
        </section>
    );
};

export default Projects;