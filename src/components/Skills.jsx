import React, { useState, useEffect, useRef } from 'react';

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
   SKILL CATEGORIES — tailored to Full-Stack · AI · C++
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

/* Floating tech icons for background decoration */
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
   3D TILT CARD
   ========================================================= */
const TiltCard = ({ children, accent, inView, delay }) => {
    const cardRef = useRef(null);
    const [style, setStyle] = useState({});

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
    };

    const onLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
            transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        });
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
            <div className="relative z-10">{children}</div>
        </div>
    );
};

/* =========================================================
   ANIMATED PROGRESS BAR
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

    const filtered =
        activeCategory === 'all'
            ? CATEGORIES
            : CATEGORIES.filter((c) => c.id === activeCategory);

    return (
        <section
            id="skills"
            ref={sectionRef}
            className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
            style={{
                backgroundColor: COLORS.navyDark,
                background: `radial-gradient(circle at 15% 20%, ${COLORS.navyLight} 0%, ${COLORS.navyPrimary} 40%, ${COLORS.navyDeepest} 100%)`,
            }}
        >
            {/* ───── Background blobs ───── */}
            <div
                className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.15), transparent 70%)' }}
            />
            <div
                className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.12), transparent 70%)' }}
            />

            {/* ───── Floating tech icons ───── */}
            {FLOATING_ICONS.map((icon) => (
                <div
                    key={icon.label}
                    className="hidden md:block absolute pointer-events-none select-none"
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
                            opacity: 0.5,
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
                                background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 30px rgba(134,239,172,0.35))',
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
                                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
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
                                {cat.title}
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
                                <div
                                    className="relative w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
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

                            {/* Bottom accent line */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: `linear-gradient(90deg, transparent, ${cat.accent}, transparent)`,
                                    boxShadow: `0 0 20px ${cat.accent}`,
                                }}
                            />
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
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="text-center rounded-2xl py-5 px-4 transition-all duration-500 hover:-translate-y-1"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow:
                                    'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 10px 40px -15px rgba(0,0,0,0.6)',
                            }}
                        >
                            <p
                                className="text-2xl sm:text-3xl font-black mb-1"
                                style={{
                                    color: COLORS.greenLight,
                                    filter: 'drop-shadow(0 0 20px rgba(134,239,172,0.4))',
                                }}
                            >
                                {s.value}
                            </p>
                            <p className="text-[11px] uppercase tracking-widest text-white/55 font-semibold">
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