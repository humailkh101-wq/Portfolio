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
   STATS DATA
   ========================================================= */
const STATS = [
    { value: 3, suffix: '+', label: 'Years Experience' },
    { value: 20, suffix: '+', label: 'Projects Completed' },
    { value: 10, suffix: '+', label: 'Happy Clients' },
    { value: 15, suffix: '+', label: 'Technologies Used' },
];

/* =========================================================
   TIMELINE DATA — matches your skills
   ========================================================= */
const TIMELINE = [
    {
        year: '2022',
        title: 'Started Software Engineering',
        org: 'Mehran UET',
        desc: 'Began my journey in Software Engineering — mastering C++, data structures, and algorithms.',
        tag: 'Education',
    },
    {
        year: '2023',
        title: 'Full-Stack Development',
        org: 'Self-taught + Bootcamps',
        desc: 'Learned React, Node.js, and modern web architecture. Shipped my first production web apps.',
        tag: 'Web',
    },
    {
        year: '2024',
        title: 'AI Engineering (Python)',
        org: 'Personal + Open Source',
        desc: 'Dove into Python, ML, and AI-powered solutions. Built intelligent tools and automation systems.',
        tag: 'AI',
    },
    {
        year: '2025',
        title: 'Building Scalable Systems',
        org: 'Freelance + Projects',
        desc: 'Now building scalable web applications and AI-powered solutions for real clients.',
        tag: 'Now',
    },
];

/* =========================================================
   HOOK: intersection-based reveal
   ========================================================= */
const useInView = (threshold = 0.2) => {
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
   ANIMATED COUNTER
   ========================================================= */
const AnimatedCounter = ({ value, suffix, duration = 1800, start }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;
        let raf;
        const t0 = performance.now();
        const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(value * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [start, value, duration]);

    return (
        <span>
            {count}
            {suffix}
        </span>
    );
};

/* =========================================================
   ABOUT SECTION
   ========================================================= */
const About = () => {
    const [sectionRef, sectionInView] = useInView(0.15);
    const [imageRef, imageInView] = useInView(0.25);
    const [statsRef, statsInView] = useInView(0.3);
    const [timelineRef, timelineInView] = useInView(0.15);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    /* Mouse parallax for image */
    useEffect(() => {
        const onMove = (e) => {
            const rect = imageRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
            setMouse({ x, y });
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, [imageRef]);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
            style={{
                backgroundColor: COLORS.navyPrimary,
                background: `radial-gradient(circle at 85% 15%, ${COLORS.navyLight} 0%, ${COLORS.navyPrimary} 50%, ${COLORS.navyDark} 100%)`,
            }}
        >
            {/* ───── Background decorations ───── */}
            <div
                className="absolute top-20 -left-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.15), transparent 70%)' }}
            />
            <div
                className="absolute bottom-20 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.12), transparent 70%)' }}
            />

            <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(134,239,172,0.4); }
          50%      { box-shadow: 0 0 0 10px rgba(134,239,172,0); }
        }
        @keyframes dash {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* ───── Section header ───── */}
                <div
                    className="text-center mb-16"
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
                        01 — About Me
                    </p>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                        Get to{' '}
                        <span
                            style={{
                                background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 30px rgba(134,239,172,0.35))',
                            }}
                        >
                            know me
                        </span>
                    </h2>
                </div>

                {/* ───── Main grid ───── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center mb-24">

                    {/* ── LEFT: Profile image ── */}
                    <div
                        ref={imageRef}
                        className="relative flex justify-center lg:justify-start"
                        style={{
                            opacity: imageInView ? 1 : 0,
                            transform: imageInView
                                ? 'translateX(0) rotate(0deg)'
                                : 'translateX(-80px) rotate(-6deg)',
                            transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1)',
                        }}
                    >
                        <div
                            className="relative"
                            style={{
                                transform: `perspective(1000px) rotateY(${mouse.x * 10}deg) rotateX(${mouse.y * -10}deg)`,
                                transition: 'transform 0.4s ease-out',
                            }}
                        >
                            {/* Rotating dashed ring */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    transform: 'scale(1.18)',
                                    animation: 'spinSlow 24s linear infinite',
                                }}
                            >
                                <svg viewBox="0 0 200 200" className="w-full h-full">
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="94"
                                        fill="none"
                                        stroke="rgba(134,239,172,0.28)"
                                        strokeWidth="1"
                                        strokeDasharray="4 8"
                                    />
                                </svg>
                            </div>

                            {/* Glow */}
                            <div
                                className="absolute inset-0 rounded-3xl blur-3xl pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle, rgba(134,239,172,0.30), transparent 70%)',
                                    transform: 'scale(1.15)',
                                }}
                            />

                            {/* Image container — rounded rect for a modern look */}
                            <div
                                className="relative w-72 h-80 sm:w-80 sm:h-96 lg:w-[420px] lg:h-[500px] rounded-3xl overflow-hidden"
                                style={{
                                    border: '1px solid rgba(134,239,172,0.35)',
                                    boxShadow:
                                        '0 25px 70px -20px rgba(0,0,0,0.8), 0 0 80px -30px rgba(134,239,172,0.55), inset 0 1px 0 0 rgba(255,255,255,0.08)',
                                }}
                            >
                                <img
                                    src="../pic.jpeg"
                                    alt="Muhammad Humail"
                                    className="w-full h-full object-cover"
                                    style={{ filter: 'brightness(1.05) contrast(1.05)' }}
                                />
                                {/* Navy tint + gradient overlay */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: `linear-gradient(180deg, transparent 40%, rgba(10,31,61,0.55) 85%, rgba(4,16,31,0.85) 100%)`,
                                    }}
                                />
                                {/* Green corner accent */}
                                <div
                                    className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
                                    style={{
                                        background: `linear-gradient(135deg, rgba(134,239,172,0.25), transparent 70%)`,
                                    }}
                                />

                                {/* Bottom info strip */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                                    <div>
                                        <p className="text-white font-bold text-lg leading-none">Muhammad Humail</p>
                                        <p className="text-xs mt-1.5 font-semibold tracking-wide" style={{ color: COLORS.greenLight }}>
                                            Software Engineer · Mehran UET
                                        </p>
                                    </div>
                                    <span
                                        className="w-3 h-3 rounded-full mb-1"
                                        style={{
                                            background: COLORS.greenLight,
                                            boxShadow: `0 0 12px ${COLORS.greenLight}`,
                                            animation: 'badgePulse 2s ease-in-out infinite',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Floating badge — top right */}
                            <div
                                className="absolute -top-4 -right-4 px-4 py-3 rounded-2xl backdrop-blur-md"
                                style={{
                                    background: 'rgba(10,31,61,0.9)',
                                    border: '1px solid rgba(134,239,172,0.35)',
                                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.7), 0 0 30px -10px rgba(134,239,172,0.5)',
                                    animation: 'floatY 5s ease-in-out infinite',
                                }}
                            >
                                <p className="text-2xl font-black leading-none" style={{ color: COLORS.greenLight }}>
                                    UET
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-white/60 mt-1 font-semibold">
                                    Mehran
                                </p>
                            </div>

                            {/* Floating badge — bottom left */}
                            <div
                                className="absolute -bottom-4 -left-4 px-4 py-3 rounded-2xl backdrop-blur-md"
                                style={{
                                    background: 'rgba(10,31,61,0.9)',
                                    border: '1px solid rgba(134,239,172,0.35)',
                                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.7), 0 0 30px -10px rgba(134,239,172,0.5)',
                                    animation: 'floatY 6s ease-in-out infinite',
                                    animationDelay: '0.8s',
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: COLORS.greenLight, boxShadow: `0 0 10px ${COLORS.greenLight}` }}
                                    />
                                    <p className="text-xs font-bold text-white">Open to Work</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Text content ── */}
                    <div
                        className="text-center lg:text-left"
                        style={{
                            opacity: sectionInView ? 1 : 0,
                            transform: sectionInView ? 'translateX(0)' : 'translateX(60px)',
                            transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.15s',
                        }}
                    >
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-5">
                            A Software Engineering student who loves{' '}
                            <span style={{ color: COLORS.greenLight }}>building</span> things that matter.
                        </h3>

                        {/* Reveal-by-line paragraphs */}
                        <div className="space-y-4 mb-8">
                            {[
                                `I'm Humail — a Full-Stack Developer, AI Engineer (Python), and C++ Developer currently studying Software Engineering at Mehran UET.`,
                                `I specialize in building scalable web applications and AI-powered solutions that solve real problems. From clean UI to backend logic, I care about the details that make products feel polished.`,
                                `When I'm not coding, I'm exploring new AI tools, contributing to open source, and constantly pushing myself to learn something new.`,
                            ].map((text, i) => (
                                <p
                                    key={i}
                                    className="text-base leading-relaxed"
                                    style={{
                                        color: 'rgba(255,255,255,0.65)',
                                        opacity: sectionInView ? 1 : 0,
                                        transform: sectionInView ? 'translateY(0)' : 'translateY(20px)',
                                        transition: `all 0.8s cubic-bezier(0.22,1,0.36,1) ${0.3 + i * 0.12}s`,
                                    }}
                                >
                                    {text}
                                </p>
                            ))}
                        </div>

                        {/* Skill chips */}
                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
                            {['Full-Stack', 'AI / ML', 'Python', 'C++', 'React', 'Node.js'].map((skill, i) => (
                                <span
                                    key={skill}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 hover:-translate-y-1 cursor-default"
                                    style={{
                                        color: COLORS.greenLight,
                                        background: 'rgba(134,239,172,0.08)',
                                        border: '1px solid rgba(134,239,172,0.25)',
                                        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 4px 14px -6px rgba(0,0,0,0.5)',
                                        opacity: sectionInView ? 1 : 0,
                                        transform: sectionInView ? 'translateY(0)' : 'translateY(20px)',
                                        transition: `all 0.8s cubic-bezier(0.22,1,0.36,1) ${0.7 + i * 0.06}s`,
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                        {/* CTA */}
                        <a
                            href="#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById('contact');
                                if (el) {
                                    const offset = el.getBoundingClientRect().top + window.pageYOffset - 80;
                                    window.scrollTo({ top: offset, behavior: 'smooth' });
                                }
                            }}
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{
                                background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright}, ${COLORS.greenLight})`,
                                color: COLORS.navyPrimary,
                                boxShadow:
                                    '0 6px 20px -4px rgba(74,222,128,0.55), 0 14px 40px -10px rgba(34,197,94,0.45), inset 0 1px 0 0 rgba(255,255,255,0.4)',
                            }}
                        >
                            Download CV
                            <span>↓</span>
                        </a>
                    </div>
                </div>

                {/* ───── Stats grid ───── */}
                <div
                    ref={statsRef}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24"
                >
                    {STATS.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="group relative rounded-2xl p-6 sm:p-7 text-center overflow-hidden transition-all duration-500 hover:-translate-y-2"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow:
                                    'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 10px 40px -15px rgba(0,0,0,0.6)',
                                opacity: statsInView ? 1 : 0,
                                transform: statsInView ? 'translateY(0)' : 'translateY(40px)',
                                transition: `all 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s, box-shadow 0.4s ease`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(134,239,172,0.5)';
                                e.currentTarget.style.boxShadow =
                                    'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 20px 50px -15px rgba(0,0,0,0.7), 0 0 50px -15px rgba(134,239,172,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.boxShadow =
                                    'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 10px 40px -15px rgba(0,0,0,0.6)';
                            }}
                        >
                            {/* Hover glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle at 50% 0%, rgba(134,239,172,0.15), transparent 70%)',
                                }}
                            />
                            <div className="relative">
                                <p
                                    className="text-4xl sm:text-5xl font-black leading-none mb-2"
                                    style={{
                                        color: COLORS.greenLight,
                                        filter: 'drop-shadow(0 0 20px rgba(134,239,172,0.4))',
                                    }}
                                >
                                    <AnimatedCounter
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        start={statsInView}
                                    />
                                </p>
                                <p className="text-xs sm:text-sm uppercase tracking-widest text-white/60 font-semibold">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ───── Journey timeline ───── */}
                <div ref={timelineRef}>
                    <div
                        className="text-center mb-14"
                        style={{
                            opacity: timelineInView ? 1 : 0,
                            transform: timelineInView ? 'translateY(0)' : 'translateY(30px)',
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
                            My Journey
                        </p>
                        <h3 className="text-3xl sm:text-4xl font-black text-white">
                            The road so far
                        </h3>
                    </div>

                    {/* Timeline */}
                    <div className="relative max-w-4xl mx-auto">
                        {/* Vertical line */}
                        <div
                            className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] sm:-translate-x-1/2 pointer-events-none"
                            style={{
                                background: `linear-gradient(180deg,
                  transparent 0%,
                  rgba(134,239,172,0.5) 15%,
                  rgba(134,239,172,0.5) 85%,
                  transparent 100%)`,
                                boxShadow: '0 0 20px rgba(134,239,172,0.4)',
                                transformOrigin: 'top',
                                transform: timelineInView ? 'scaleY(1)' : 'scaleY(0)',
                                transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1)',
                            }}
                        />

                        <div className="space-y-8 sm:space-y-10">
                            {TIMELINE.map((item, i) => {
                                const isLeft = i % 2 === 0;
                                return (
                                    <div
                                        key={i}
                                        className={`relative flex items-start sm:items-center gap-6 sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                                            }`}
                                    >
                                        {/* Card */}
                                        <div
                                            className={`flex-1 pl-16 sm:pl-0 sm:pr-0 ${isLeft ? 'sm:pr-16' : 'sm:pl-16'}`}
                                            style={{
                                                opacity: timelineInView ? 1 : 0,
                                                transform: timelineInView
                                                    ? 'translateX(0)'
                                                    : `translateX(${isLeft ? -50 : 50}px)`,
                                                transition: `all 0.9s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.15}s`,
                                            }}
                                        >
                                            <div
                                                className="group relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1"
                                                style={{
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                    boxShadow:
                                                        'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 10px 40px -15px rgba(0,0,0,0.6)',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = 'rgba(134,239,172,0.45)';
                                                    e.currentTarget.style.boxShadow =
                                                        'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 20px 50px -15px rgba(0,0,0,0.7), 0 0 50px -15px rgba(134,239,172,0.5)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                                    e.currentTarget.style.boxShadow =
                                                        'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 10px 40px -15px rgba(0,0,0,0.6)';
                                                }}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span
                                                        className="text-xs font-black tabular-nums px-2.5 py-1 rounded-md"
                                                        style={{
                                                            color: COLORS.navyPrimary,
                                                            background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright})`,
                                                            boxShadow: '0 4px 14px -4px rgba(74,222,128,0.5)',
                                                        }}
                                                    >
                                                        {item.year}
                                                    </span>
                                                    <span
                                                        className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md"
                                                        style={{
                                                            color: COLORS.greenLight,
                                                            background: 'rgba(134,239,172,0.10)',
                                                            border: '1px solid rgba(134,239,172,0.25)',
                                                        }}
                                                    >
                                                        {item.tag}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                                                <p className="text-xs font-semibold mb-2" style={{ color: COLORS.greenLight }}>
                                                    {item.org}
                                                </p>
                                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Dot on the line */}
                                        <div className="absolute left-4 sm:left-1/2 top-6 sm:top-1/2 -translate-x-1/2 sm:-translate-y-1/2 z-10">
                                            <span
                                                className="block w-4 h-4 rounded-full"
                                                style={{
                                                    background: COLORS.greenLight,
                                                    border: `3px solid ${COLORS.navyPrimary}`,
                                                    boxShadow: `0 0 0 3px rgba(134,239,172,0.25), 0 0 20px rgba(134,239,172,0.7)`,
                                                    opacity: timelineInView ? 1 : 0,
                                                    transform: timelineInView ? 'scale(1)' : 'scale(0)',
                                                    transition: `all 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.4 + i * 0.15}s`,
                                                }}
                                            />
                                        </div>

                                        {/* Empty spacer for the other column on desktop */}
                                        <div className="hidden sm:block flex-1" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;