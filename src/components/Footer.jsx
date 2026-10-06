import React, { useState, useEffect, useRef, useCallback } from 'react';

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
   DATA
   ========================================================= */
const NAV_GROUPS = [
    {
        title: 'Navigate',
        links: [
            { label: 'Home', href: '#home' },
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#skills' },
            { label: 'Projects', href: '#projects' },
        ],
    },
    {
        title: 'Explore',
        links: [
            { label: 'Experience', href: '#experience' },
            { label: 'Contact', href: '#contact' },
            { label: 'Resume', href: '#' },
            { label: 'Blog', href: '#' },
        ],
    },
];

const SOCIALS = [
    { name: 'GitHub', url: 'https://github.com', icon: '⌥' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'in' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '𝕏' },
    { name: 'Email', url: 'mailto:hello@ayaan.dev', icon: '@' },
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
   ANIMATED LOGO
   ========================================================= */
const AnimatedLogo = ({ inView }) => (
    <a
        href="#home"
        className="group inline-flex items-center gap-3"
        style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)',
        }}
    >
        <div className="relative">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110"
                style={{
                    background: `linear-gradient(135deg, ${COLORS.greenLight}, ${COLORS.greenDeep})`,
                    color: COLORS.navyPrimary,
                    boxShadow:
                        '0 4px 14px -2px rgba(34,197,94,0.5), 0 8px 30px -6px rgba(34,197,94,0.35), inset 0 1px 0 0 rgba(255,255,255,0.4)',
                }}
            >
                H
            </div>
            <span
                className="absolute inset-0 rounded-xl animate-ping opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{ background: 'rgba(134,239,172,0.35)' }}
            />
        </div>
        <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-xl tracking-tight">
                Muhammad<span style={{ color: COLORS.greenLight }}> </span>Humail
            </span>
            <span
                className="text-[10px] uppercase tracking-[0.3em] mt-1 font-semibold"
                style={{ color: COLORS.greenLight, opacity: 0.75 }}
            >
                Full-Stack · AI
            </span>
        </div>
    </a>
);

/* =========================================================
   SOCIAL ICON
   ========================================================= */
const SocialIcon = ({ social, index, inView }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <a
            href={social.url}
            target="_blank"
            rel="noreferrer"
            aria-label={social.name}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 hover:-translate-y-1"
            style={{
                background: hovered
                    ? `linear-gradient(135deg, ${COLORS.greenLight}, ${COLORS.greenBright})`
                    : 'rgba(255,255,255,0.04)',
                border: `1px solid ${hovered ? 'transparent' : 'rgba(255,255,255,0.10)'}`,
                color: hovered ? COLORS.navyPrimary : COLORS.white,
                boxShadow: hovered
                    ? `0 10px 30px -6px ${COLORS.greenLight}90, inset 0 1px 0 0 rgba(255,255,255,0.5)`
                    : 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${0.3 + index * 0.08}s, background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease`,
            }}
        >
            <span className="text-sm font-black">{social.icon}</span>
            <span
                className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap pointer-events-none transition-all duration-300"
                style={{
                    background: 'rgba(4,16,31,0.95)',
                    color: COLORS.greenLight,
                    border: `1px solid ${COLORS.greenLight}50`,
                    opacity: hovered ? 1 : 0,
                    transform: `translate(-50%, ${hovered ? 0 : 6}px)`,
                }}
            >
                {social.name}
            </span>
        </a>
    );
};

/* =========================================================
   BACK-TO-TOP BUTTON with circular progress
   ========================================================= */
const BackToTop = ({ progress }) => {
    const [hovered, setHovered] = useState(false);
    const r = 22;
    const circumference = 2 * Math.PI * r;
    const dashOffset = circumference - (progress / 100) * circumference;
    const visible = progress > 4;

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <button
            onClick={scrollTop}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90"
            style={{
                background: 'rgba(10,31,61,0.90)',
                border: `1px solid ${hovered ? COLORS.greenLight : 'rgba(134,239,172,0.35)'}`,
                color: COLORS.greenLight,
                backdropFilter: 'blur(10px)',
                boxShadow: hovered
                    ? `0 15px 40px -10px ${COLORS.greenLight}90, 0 0 40px -10px ${COLORS.greenLight}70`
                    : '0 10px 30px -10px rgba(0,0,0,0.7)',
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? 'auto' : 'none',
                transform: `translateY(${visible ? 0 : 20}px) scale(${hovered ? 1.05 : 1})`,
            }}
        >
            {/* Circular progress SVG */}
            <svg
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                viewBox="0 0 56 56"
            >
                <circle
                    cx="28"
                    cy="28"
                    r={r}
                    fill="none"
                    stroke="rgba(134,239,172,0.15)"
                    strokeWidth="2"
                />
                <circle
                    cx="28"
                    cy="28"
                    r={r}
                    fill="none"
                    stroke={COLORS.greenLight}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{
                        transition: 'stroke-dashoffset 0.2s linear',
                        filter: `drop-shadow(0 0 6px ${COLORS.greenLight})`,
                    }}
                />
            </svg>
            {/* Arrow */}
            <span
                className="relative z-10 text-lg font-black transition-transform duration-300"
                style={{ transform: hovered ? 'translateY(-3px)' : 'translateY(0)' }}
            >
                ↑
            </span>
        </button>
    );
};

/* =========================================================
   FOOTER LINK
   ========================================================= */
const FooterLink = ({ link, index, inView }) => {
    const handleClick = (e) => {
        if (link.href.startsWith('#')) {
            e.preventDefault();
            const el = document.getElementById(link.href.slice(1));
            if (el) {
                const offset = el.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        }
    };

    return (
        <li
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${0.2 + index * 0.06}s`,
            }}
        >
            <a
                href={link.href}
                onClick={handleClick}
                className="group inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
                style={{ color: 'rgba(255,255,255,0.60)' }}
            >
                <span
                    className="w-0 h-px transition-all duration-500"
                    style={{ background: COLORS.greenLight }}
                />
                <span className="group-hover:text-[#86EFAC] transition-colors duration-300">
                    {link.label}
                </span>
            </a>
        </li>
    );
};

/* =========================================================
   FOOTER SECTION
   ========================================================= */
const Footer = () => {
    const [footerRef, footerInView] = useInView(0.1);
    const [progress, setProgress] = useState(0);
    const [tiltX, setTiltX] = useState(0);

    /* Scroll progress for back-to-top ring */
    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Subtle parallax on the big background word */
    useEffect(() => {
        const onMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            setTiltX(x);
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    return (
        <>
            <footer
                ref={footerRef}
                className="relative overflow-hidden pt-24 pb-10 px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundColor: COLORS.navyDeepest,
                    background: `radial-gradient(circle at 50% 0%, ${COLORS.navyPrimary} 0%, ${COLORS.navyDark} 45%, ${COLORS.navyDeepest} 100%)`,
                }}
            >
                {/* ───── Moving gradient background ───── */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{
                        background: `linear-gradient(120deg,
              transparent 0%,
              rgba(134,239,172,0.10) 30%,
              transparent 60%,
              rgba(74,222,128,0.08) 100%)`,
                        backgroundSize: '200% 200%',
                        animation: 'moveGradient 18s ease infinite',
                    }}
                />

                {/* ───── Blobs ───── */}
                <div
                    className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.15), transparent 70%)' }}
                />
                <div
                    className="absolute bottom-0 -left-40 w-[420px] h-[420px] rounded-full blur-[130px] pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.10), transparent 70%)' }}
                />
                <div
                    className="absolute bottom-0 -right-40 w-[420px] h-[420px] rounded-full blur-[130px] pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.08), transparent 70%)' }}
                />

                {/* ───── Grid pattern ───── */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* ───── Giant animated background word ───── */}
                <div
                    className="absolute bottom-0 left-1/2 pointer-events-none select-none whitespace-nowrap"
                    style={{
                        transform: `translate(-50%, 30%) translateX(${tiltX}px)`,
                        fontSize: 'clamp(6rem, 22vw, 22rem)',
                        fontWeight: 900,
                        lineHeight: 0.85,
                        letterSpacing: '-0.05em',
                        color: 'transparent',
                        WebkitTextStroke: `1px rgba(134,239,172,0.10)`,
                        opacity: 0.7,
                        transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)',
                    }}
                >
                    Muhammad Humail
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">

                    {/* ───── Top: logo + socials ───── */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-14">
                        {/* Left: brand */}
                        <div className="max-w-md">
                            <AnimatedLogo inView={footerInView} />
                            <p
                                className="mt-5 text-sm leading-relaxed"
                                style={{
                                    color: 'rgba(255,255,255,0.55)',
                                    opacity: footerInView ? 1 : 0,
                                    transform: footerInView ? 'translateY(0)' : 'translateY(20px)',
                                    transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s',
                                }}
                            >
                                Full-Stack Developer & AI Engineer building scalable web
                                applications and AI-powered solutions. Currently studying
                                Software Engineering at Mehran UET.
                            </p>

                            {/* Availability pill */}
                            <div
                                className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
                                style={{
                                    background: 'rgba(134,239,172,0.08)',
                                    border: '1px solid rgba(134,239,172,0.25)',
                                    opacity: footerInView ? 1 : 0,
                                    transform: footerInView ? 'translateY(0)' : 'translateY(20px)',
                                    transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s',
                                }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        background: COLORS.greenLight,
                                        boxShadow: `0 0 10px ${COLORS.greenLight}`,
                                        animation: 'pulseDot 1.8s ease-in-out infinite',
                                    }}
                                />
                                <span
                                    className="text-[10px] font-black uppercase tracking-[0.3em]"
                                    style={{ color: COLORS.greenLight }}
                                >
                                    Available for work
                                </span>
                            </div>
                        </div>

                        {/* Right: nav groups */}
                        <div className="grid grid-cols-2 gap-10 sm:gap-16">
                            {NAV_GROUPS.map((group, gi) => (
                                <div key={group.title}>
                                    <h5
                                        className="text-[10px] font-black uppercase tracking-[0.35em] mb-5"
                                        style={{
                                            color: COLORS.greenLight,
                                            opacity: footerInView ? 1 : 0,
                                            transform: footerInView ? 'translateY(0)' : 'translateY(20px)',
                                            transition: `all 0.9s cubic-bezier(0.22,1,0.36,1) ${0.1 + gi * 0.1}s`,
                                        }}
                                    >
                                        {group.title}
                                    </h5>
                                    <ul className="space-y-3">
                                        {group.links.map((link, i) => (
                                            <FooterLink
                                                key={link.label}
                                                link={link}
                                                index={i + gi * 4}
                                                inView={footerInView}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ───── Divider ───── */}
                    <div
                        className="h-px mb-10"
                        style={{
                            background: `linear-gradient(90deg, transparent, rgba(134,239,172,0.30), transparent)`,
                            opacity: footerInView ? 1 : 0,
                            transform: footerInView ? 'scaleX(1)' : 'scaleX(0)',
                            transformOrigin: 'center',
                            transition: 'all 1.2s cubic-bezier(0.22,1,0.36,1) 0.4s',
                        }}
                    />

                    {/* ───── Socials row ───── */}
                    <div
                        className="flex flex-wrap items-center justify-between gap-6 mb-12"
                    >
                        <div className="flex flex-wrap gap-3">
                            {SOCIALS.map((s, i) => (
                                <SocialIcon key={s.name} social={s} index={i} inView={footerInView} />
                            ))}
                        </div>

                        <a
                            href="mailto:hello@ayaan.dev"
                            className="group inline-flex items-center gap-3 text-sm font-bold transition-all duration-300"
                            style={{
                                color: COLORS.greenLight,
                                opacity: footerInView ? 1 : 0,
                                transform: footerInView ? 'translateX(0)' : 'translateX(20px)',
                                transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.6s',
                            }}
                        >
                            <span className="relative">
                                hello@ayaan.dev
                                <span
                                    className="absolute left-0 -bottom-0.5 h-px w-0 group-hover:w-full transition-all duration-400"
                                    style={{
                                        background: COLORS.greenLight,
                                        boxShadow: `0 0 8px ${COLORS.greenLight}`,
                                    }}
                                />
                            </span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </a>
                    </div>

                    {/* ───── Bottom bar ───── */}
                    <div
                        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
                        style={{
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            opacity: footerInView ? 1 : 0,
                            transform: footerInView ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.75s',
                        }}
                    >
                        <p className="text-xs text-center sm:text-left" style={{ color: 'rgba(255,255,255,0.40)' }}>
                            © {new Date().getFullYear()}{' '}
                            <span className="font-semibold text-white/60">Muhammad Humail</span>. All rights reserved.
                        </p>

                        <div className="flex items-center gap-4">
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
                                Built with{' '}
                                <span style={{ color: COLORS.greenLight }}>React</span> &amp;{' '}
                                <span style={{ color: COLORS.greenLight }}>Tailwind</span>
                            </p>
                            <span
                                className="hidden sm:block w-px h-4"
                                style={{ background: 'rgba(255,255,255,0.10)' }}
                            />
                            <span
                                className="hidden sm:inline-flex items-center gap-1.5 text-xs"
                                style={{ color: 'rgba(255,255,255,0.40)' }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                        background: COLORS.greenLight,
                                        boxShadow: `0 0 8px ${COLORS.greenLight}`,
                                        animation: 'pulseDot 1.8s ease-in-out infinite',
                                    }}
                                />
                                v1.0
                            </span>
                        </div>
                    </div>
                </div>

                {/* ───── Keyframes ───── */}
                <style>{`
          @keyframes moveGradient {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulseDot {
            0%, 100% { box-shadow: 0 0 0 0 rgba(134,239,172,0.6); }
            50%      { box-shadow: 0 0 0 10px rgba(134,239,172,0); }
          }
        `}</style>
            </footer>

            {/* ───── Back to top ───── */}
            <BackToTop progress={progress} />
        </>
    );
};

export default Footer;