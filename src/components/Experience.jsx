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
   TIMELINE DATA — Experience + Education
   ========================================================= */
const TIMELINE = [
    {
        id: 1,
        type: 'work',
        year: '2024 — Present',
        title: 'Full-Stack Developer',
        org: 'Freelance · Remote',
        location: 'Remote',
        description:
            'Building scalable web applications for startups and clients using React, Node.js, and Python. Delivering end-to-end features from design to deployment.',
        tags: ['React', 'Node.js', 'Python', 'MongoDB'],
    },
    {
        id: 2,
        type: 'work',
        year: '2024',
        title: 'AI Engineer (Python)',
        org: 'Open Source · Personal',
        location: 'Remote',
        description:
            'Developed AI-powered tools using Python, TensorFlow, and LLMs. Focused on practical automation, content generation, and computer-vision projects.',
        tags: ['Python', 'TensorFlow', 'LLMs', 'OpenCV'],
    },
    {
        id: 3,
        type: 'education',
        year: '2022 — Present',
        title: 'BE Software Engineering',
        org: 'Mehran University of Engineering & Technology',
        location: 'Jamshoro, Pakistan',
        description:
            'Specializing in algorithms, data structures, and system design. Active in competitive programming and building production-grade projects alongside coursework.',
        tags: ['C++', 'DSA', 'OOP', 'System Design'],
    },
    {
        id: 4,
        type: 'work',
        year: '2023',
        title: 'C++ Developer',
        org: 'Personal Projects',
        location: 'Remote',
        description:
            'Developed desktop applications and algorithm visualizers with C++ and SFML. Strong focus on performance, memory, and clean architecture.',
        tags: ['C++', 'SFML', 'CMake'],
    },
];

/* =========================================================
   HOOK: intersection reveal
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
   TIMELINE ITEM
   ========================================================= */
const TimelineItem = ({ item, index, inView }) => {
    const isLeft = index % 2 === 0;
    const isEdu = item.type === 'education';
    const accent = isEdu ? COLORS.greenBright : COLORS.greenLight;
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`relative flex items-start sm:items-center gap-6 sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                } mb-12 sm:mb-20 last:mb-0`}
        >
            {/* Card */}
            <div
                className={`flex-1 pl-16 sm:pl-0 ${isLeft ? 'sm:pr-16' : 'sm:pl-16'}`}
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView
                        ? 'translateX(0) rotateY(0deg)'
                        : `translateX(${isLeft ? -70 : 70}px) rotateY(${isLeft ? -12 : 12}deg)`,
                    transition: `all 1.1s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s`,
                    transformStyle: 'preserve-3d',
                    perspective: 1000,
                }}
            >
                <div
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="group relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1.5"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${hovered ? `${accent}70` : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: hovered
                            ? `inset 0 1px 0 0 rgba(255,255,255,0.08), 0 25px 60px -15px rgba(0,0,0,0.7), 0 0 60px -15px ${accent}80`
                            : 'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 10px 40px -15px rgba(0,0,0,0.6)',
                    }}
                >
                    {/* Top row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                            className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
                            style={{
                                color: COLORS.navyPrimary,
                                background: `linear-gradient(90deg, ${accent}, ${COLORS.greenBright})`,
                                boxShadow: `0 4px 14px -4px ${accent}90`,
                            }}
                        >
                            {isEdu ? '🎓 Education' : '⚡ Work'}
                        </span>
                        <span
                            className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md"
                            style={{
                                color: accent,
                                background: `${accent}15`,
                                border: `1px solid ${accent}45`,
                            }}
                        >
                            {item.year}
                        </span>
                    </div>

                    <h4 className="text-xl font-bold text-white leading-tight mb-1.5">
                        {item.title}
                    </h4>
                    <p className="text-sm font-bold mb-2" style={{ color: accent }}>
                        {item.org}
                    </p>
                    <p
                        className="text-xs font-semibold mb-3 flex items-center gap-2"
                        style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                        <span>📍</span> {item.location}
                    </p>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.60)' }}>
                        {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((t) => (
                            <span
                                key={t}
                                className="px-2.5 py-1 rounded-md text-[10px] font-bold transition-all duration-300 hover:-translate-y-0.5"
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

                    {/* Bottom glow line */}
                    <div
                        className="absolute bottom-0 left-6 right-6 h-[2px] transition-opacity duration-500"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                            boxShadow: `0 0 20px ${accent}`,
                            opacity: hovered ? 1 : 0,
                        }}
                    />
                </div>
            </div>

            {/* Timeline dot */}
            <div className="absolute left-4 sm:left-1/2 top-6 sm:top-1/2 -translate-x-1/2 sm:-translate-y-1/2 z-10">
                <span
                    className="block w-5 h-5 rounded-full"
                    style={{
                        background: accent,
                        border: `3px solid ${COLORS.navyPrimary}`,
                        boxShadow: `0 0 0 4px ${accent}30, 0 0 30px ${accent}`,
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'scale(1)' : 'scale(0)',
                        transition: `all 0.7s cubic-bezier(0.34,1.56,0.64,1) ${0.35 + index * 0.12}s`,
                    }}
                />
                <span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                        border: `2px solid ${accent}`,
                        animation: 'pulseDot 2.4s ease-out infinite',
                        animationDelay: `${index * 0.4}s`,
                    }}
                />
            </div>

            {/* Spacer for the other column */}
            <div className="hidden sm:block flex-1" />
        </div>
    );
};

/* =========================================================
   EXPERIENCE SECTION
   ========================================================= */
const Experience = () => {
    const [headerRef, headerInView] = useInView(0.15);
    const [timelineRef, timelineInView] = useInView(0.05);

    return (
        <section
            id="experience"
            className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
            style={{
                backgroundColor: COLORS.navyPrimary,
                background: `radial-gradient(circle at 20% 10%, ${COLORS.navyLight} 0%, ${COLORS.navyPrimary} 45%, ${COLORS.navyDeepest} 100%)`,
            }}
        >
            {/* Background blobs */}
            <div
                className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.14), transparent 70%)' }}
            />
            <div
                className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.10), transparent 70%)' }}
            />

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* ───── Header ───── */}
                <div
                    ref={headerRef}
                    className="text-center mb-20"
                    style={{
                        opacity: headerInView ? 1 : 0,
                        transform: headerInView ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
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
                        04 — Journey
                    </p>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
                        Experience &{' '}
                        <span
                            style={{
                                background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 30px rgba(134,239,172,0.4))',
                            }}
                        >
                            education
                        </span>
                    </h2>
                    <p
                        className="max-w-2xl mx-auto text-base leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                        The road so far — from university coursework to shipping production applications.
                    </p>
                </div>

                {/* ───── Timeline ───── */}
                <div ref={timelineRef} className="relative">
                    {/* Glowing vertical line */}
                    <div
                        className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] sm:-translate-x-1/2 pointer-events-none"
                        style={{
                            background: `linear-gradient(180deg,
                transparent 0%,
                rgba(134,239,172,0.55) 10%,
                rgba(134,239,172,0.55) 90%,
                transparent 100%)`,
                            boxShadow: '0 0 24px rgba(134,239,172,0.5)',
                            transformOrigin: 'top',
                            transform: timelineInView ? 'scaleY(1)' : 'scaleY(0)',
                            transition: 'transform 1.6s cubic-bezier(0.22,1,0.36,1)',
                        }}
                    />

                    {TIMELINE.map((item, i) => (
                        <TimelineItem key={item.id} item={item} index={i} inView={timelineInView} />
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes pulseDot {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
        </section>
    );
};

export default Experience;