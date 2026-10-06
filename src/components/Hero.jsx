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

const ROLES = ['Full-Stack Developer', 'AI Engineer (Python)', 'C++ Developer'];

/* =========================================================
   MAGNETIC BUTTON (sub-component)
   ========================================================= */
const MagneticButton = ({ children, primary, href, onClick }) => {
    const btnRef = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const onMove = (e) => {
        const rect = btnRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        setPos({ x, y });
    };
    const onLeave = () => setPos({ x: 0, y: 0 });

    const sharedProps = {
        ref: btnRef,
        onMouseMove: onMove,
        onMouseLeave: onLeave,
        onClick,
        className:
            'relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95',
        style: {
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            ...(primary
                ? {
                    background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright}, ${COLORS.greenLight})`,
                    color: COLORS.navyPrimary,
                    boxShadow:
                        '0 6px 20px -4px rgba(74,222,128,0.55), 0 14px 40px -10px rgba(34,197,94,0.45), inset 0 1px 0 0 rgba(255,255,255,0.4)',
                }
                : {
                    background: 'rgba(255,255,255,0.04)',
                    color: COLORS.white,
                    border: '1px solid rgba(134,239,172,0.35)',
                    boxShadow:
                        'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 4px 20px -8px rgba(0,0,0,0.5)',
                }),
        },
    };

    return href ? <a href={href} {...sharedProps}>{children}</a> : <button {...sharedProps}>{children}</button>;
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

    /* Entrance trigger */
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 150);
        return () => clearTimeout(t);
    }, []);

    /* Typewriter effect */
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

    /* Mouse parallax */
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
            style={{
                backgroundColor: COLORS.navyPrimary,
                background: `radial-gradient(circle at 20% 30%, ${COLORS.navyLight} 0%, ${COLORS.navyPrimary} 45%, ${COLORS.navyDark} 100%)`,
            }}
        >
            {/* ───── Animated gradient blobs (parallax) ───── */}
            <div
                className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(134,239,172,0.25), transparent 70%)',
                    transform: `translate(${mouse.x * -30}px, ${mouse.y * -30}px)`,
                    transition: 'transform 0.4s ease-out',
                }}
            />
            <div
                className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(74,222,128,0.18), transparent 70%)',
                    animationDelay: '1s',
                    transform: `translate(${mouse.x * 30}px, ${mouse.y * 30}px)`,
                    transition: 'transform 0.4s ease-out',
                }}
            />

            {/* ───── Floating decorative shapes ───── */}
            <div
                className="absolute top-[18%] left-[8%] w-3 h-3 rounded-full pointer-events-none"
                style={{
                    background: COLORS.greenLight,
                    boxShadow: `0 0 20px ${COLORS.greenLight}`,
                    animation: 'float1 6s ease-in-out infinite',
                }}
            />
            <div
                className="absolute top-[70%] right-[12%] w-2 h-2 rounded-full pointer-events-none"
                style={{
                    background: COLORS.greenBright,
                    boxShadow: `0 0 16px ${COLORS.greenBright}`,
                    animation: 'float2 8s ease-in-out infinite',
                }}
            />
            <div
                className="absolute top-[35%] right-[22%] w-16 h-16 rounded-2xl border rotate-45 pointer-events-none"
                style={{
                    borderColor: 'rgba(134,239,172,0.20)',
                    animation: 'spinSlow 20s linear infinite',
                }}
            />
            <div
                className="absolute bottom-[18%] left-[18%] w-24 h-24 rounded-full border pointer-events-none"
                style={{
                    borderColor: 'rgba(134,239,172,0.15)',
                    animation: 'spinSlow 30s linear infinite reverse',
                }}
            />

            {/* ───── Grid overlay ───── */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(20px, -30px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(-25px, 25px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
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
      `}</style>

            <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">

                {/* ─────────────── LEFT: Text ─────────────── */}
                <div className="order-2 lg:order-1 text-center lg:text-left">

                    {/* Status pill */}
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

                    {/* Greeting */}
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

                    {/* Name with text-reveal */}
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
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    filter: 'drop-shadow(0 0 30px rgba(134,239,172,0.35))',
                                }}
                            >
                                Humail
                            </span>
                        </span>
                    </h1>

                    {/* Typewriter role */}
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

                    {/* Subtitle */}
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

                    {/* CTAs */}
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
                        {/* Rotating rings */}
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

                        {/* Glow */}
                        <div
                            className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(134,239,172,0.35), transparent 70%)',
                                transform: 'scale(1.1)',
                            }}
                        />

                        {/* Image frame */}
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
                            {/* Tint overlay */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: `linear-gradient(135deg, rgba(134,239,172,0.10) 0%, transparent 40%, rgba(10,31,61,0.35) 100%)`,
                                }}
                            />
                        </div>

                        {/* Floating badge — "5+ Projects" */}
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

                        {/* Floating badge — "AI + Web" */}
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

            {/* ───── Scroll down indicator ───── */}
            <button
                aria-label="Scroll down"
                onClick={() => scrollToSection('about')}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group"
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
        </section>
    );
};

export default Hero;