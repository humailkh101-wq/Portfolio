import React, { useState, useEffect, useRef, useCallback } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [logoVisible, setLogoVisible] = useState(false);
  const [logoHover, setLogoHover] = useState(false);

  const navRef = useRef(null);
  const linkRefs = useRef({});
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLogoVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks.map((link) => document.getElementById(link.id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const updateIndicator = useCallback(() => {
    const activeLink = linkRefs.current[activeSection];
    if (activeLink && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }

        /* ═══════ LOGO ANIMATIONS ═══════ */
        @keyframes logoFadeIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.96); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes letterReveal {
          0%   { opacity: 0; transform: translateY(14px) rotateX(-90deg); filter: blur(6px); }
          60%  { opacity: 1; transform: translateY(-2px) rotateX(10deg); filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) rotateX(0deg); filter: blur(0); }
        }
        @keyframes logoTileSpin {
          0%   { transform: rotateY(0deg) rotateX(0deg); }
          50%  { transform: rotateY(180deg) rotateX(8deg); }
          100% { transform: rotateY(360deg) rotateX(0deg); }
        }
        @keyframes logoOrbit {
          from { transform: rotate(0deg) translateX(26px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(26px) rotate(-360deg); }
        }
        @keyframes logoOrbitReverse {
          from { transform: rotate(360deg) translateX(32px) rotate(-360deg); }
          to   { transform: rotate(0deg) translateX(32px) rotate(0deg); }
        }
        @keyframes logoRingSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes logoRingSpinReverse {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50%      { transform: scale(1.35); opacity: 0; }
        }
        @keyframes logoPulseBlue {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50%      { transform: scale(1.5); opacity: 0; }
        }
        @keyframes logoGlowShift {
          0%, 100% {
            box-shadow:
              0 4px 14px -2px rgba(34, 197, 94, 0.55),
              0 8px 30px -6px rgba(34, 197, 94, 0.35),
              inset 0 1px 0 0 rgba(255,255,255,0.4);
          }
          50% {
            box-shadow:
              0 4px 18px -2px rgba(34, 211, 238, 0.65),
              0 10px 36px -6px rgba(34, 211, 238, 0.45),
              inset 0 1px 0 0 rgba(255,255,255,0.5);
          }
        }
        @keyframes gradientSlide {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(220%) skewX(-20deg); }
        }
        @keyframes dotFlicker {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.4); }
        }
        @keyframes textUnderlineExpand {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes cornerTrace {
          0%   { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes electricArc {
          0%, 100% { opacity: 0.15; transform: scaleY(0.8); }
          50%      { opacity: 0.9; transform: scaleY(1.2); }
        }
        @keyframes borderTrace {
          0%   { background-position: 0% 0%; }
          100% { background-position: 300% 0%; }
        }

        /* ═══════ NAV ANIMATIONS ═══════ */
        @keyframes navLinkFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(134, 239, 172, 0.5), 0 0 20px rgba(134, 239, 172, 0.3); }
          50% { box-shadow: 0 0 0 10px rgba(134, 239, 172, 0), 0 0 30px rgba(134, 239, 172, 0.5); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        .animate-logo { animation: logoFadeIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-nav-link { animation: navLinkFade 0.6s ease forwards; }

        .header-shadow {
          box-shadow:
            0 1px 0 0 rgba(134, 239, 172, 0.08) inset,
            0 10px 30px -10px rgba(0, 0, 0, 0.6),
            0 20px 60px -20px rgba(10, 25, 47, 0.8);
        }
        .header-shadow-soft {
          box-shadow:
            0 1px 0 0 rgba(134, 239, 172, 0.04) inset,
            0 4px 20px -8px rgba(0, 0, 0, 0.35);
        }

        .logo-shadow {
          box-shadow:
            0 4px 14px -2px rgba(34, 197, 94, 0.5),
            0 8px 30px -6px rgba(34, 197, 94, 0.35),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
        }

        .cta-shadow {
          box-shadow:
            0 4px 14px -2px rgba(74, 222, 128, 0.5),
            0 10px 30px -8px rgba(34, 197, 94, 0.4),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
        }
        .cta-shadow:hover {
          box-shadow:
            0 6px 20px -2px rgba(74, 222, 128, 0.7),
            0 15px 45px -10px rgba(34, 197, 94, 0.6),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
        }

        .pill-shadow {
          box-shadow:
            0 0 20px rgba(134, 239, 172, 0.35),
            0 0 40px rgba(134, 239, 172, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
        }
        .link-hover-shadow:hover {
          box-shadow: 0 4px 16px -4px rgba(134, 239, 172, 0.25);
        }
        .mobile-panel-shadow {
          box-shadow:
            -20px 0 60px -15px rgba(0, 0, 0, 0.7),
            -4px 0 20px -4px rgba(134, 239, 172, 0.15),
            inset 1px 0 0 0 rgba(134, 239, 172, 0.1);
        }
        .mobile-item-shadow {
          box-shadow:
            0 4px 14px -4px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.06);
        }
        .mobile-item-shadow-active {
          box-shadow:
            0 4px 20px -4px rgba(34, 197, 94, 0.35),
            0 0 0 1px rgba(134, 239, 172, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
        }

        .text-glow {
          text-shadow: 0 0 20px rgba(134, 239, 172, 0.5);
        }
        .text-glow-blue {
          text-shadow: 0 0 20px rgba(34, 211, 238, 0.6);
        }

        .logo-tile-bg {
          background: linear-gradient(135deg,
            #86EFAC 0%,
            #4ADE80 20%,
            #22D3EE 50%,
            #38BDF8 80%,
            #86EFAC 100%);
          background-size: 300% 300%;
          animation: gradientSlide 6s ease-in-out infinite;
        }
        .logo-tile-bg-hover {
          background: linear-gradient(135deg,
            #22D3EE 0%,
            #38BDF8 25%,
            #86EFAC 50%,
            #4ADE80 75%,
            #22D3EE 100%);
          background-size: 300% 300%;
          animation: gradientSlide 3s ease-in-out infinite;
        }

        .name-gradient {
          background: linear-gradient(90deg,
            #FFFFFF 0%,
            #86EFAC 25%,
            #22D3EE 50%,
            #86EFAC 75%,
            #FFFFFF 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientSlide 5s linear infinite;
        }

        .shimmer-sweep {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,0.55) 50%,
            transparent 100%);
          transform: translateX(-120%) skewX(-20deg);
        }
        .group:hover .shimmer-sweep {
          animation: shimmerSweep 1.1s ease-out;
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled
          ? 'bg-[#0A1F3D]/95 backdrop-blur-2xl py-3 border-b border-emerald-300/15 header-shadow'
          : 'bg-[#0A1F3D]/50 backdrop-blur-md py-5 border-b border-transparent header-shadow-soft'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* ═══════════════ LOGO — Fully Animated ═══════════════ */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              onMouseEnter={() => setLogoHover(true)}
              onMouseLeave={() => setLogoHover(false)}
              className={`group flex items-center gap-3 transition-all duration-700 ${logoVisible ? 'animate-logo' : 'opacity-0'
                }`}
            >
              {/* ── Animated Logo Mark ── */}
              <div className="relative w-12 h-12 flex items-center justify-center">

                {/* Outer rotating ring — emerald */}
                <div
                  className="absolute inset-0 rounded-2xl border pointer-events-none"
                  style={{
                    borderColor: 'rgba(134,239,172,0.35)',
                    borderTopColor: 'rgba(134,239,172,0.9)',
                    borderRightColor: 'rgba(34,211,238,0.9)',
                    animation: 'logoRingSpin 6s linear infinite',
                  }}
                />

                {/* Inner counter-rotating ring — electric blue */}
                <div
                  className="absolute inset-1 rounded-xl border pointer-events-none"
                  style={{
                    borderColor: 'rgba(34,211,238,0.20)',
                    borderTopColor: 'rgba(34,211,238,0.85)',
                    animation: 'logoRingSpinReverse 8s linear infinite',
                  }}
                />

                {/* Pulse ping — emerald */}
                <span
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    border: '1px solid rgba(134,239,172,0.6)',
                    animation: 'logoPulse 2.4s ease-out infinite',
                  }}
                />

                {/* Pulse ping — electric blue (offset) */}
                <span
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    border: '1px solid rgba(34,211,238,0.6)',
                    animation: 'logoPulseBlue 2.4s ease-out 1.2s infinite',
                  }}
                />

                {/* Orbiting dot — emerald */}
                <span
                  className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                  style={{
                    background: '#86EFAC',
                    boxShadow: '0 0 10px #86EFAC, 0 0 20px rgba(134,239,172,0.6)',
                    animation: 'logoOrbit 4.5s linear infinite',
                  }}
                />

                {/* Orbiting dot — electric blue */}
                <span
                  className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                  style={{
                    background: '#22D3EE',
                    boxShadow: '0 0 10px #22D3EE, 0 0 20px rgba(34,211,238,0.7)',
                    animation: 'logoOrbitReverse 6s linear infinite',
                  }}
                />

                {/* Main Tile */}
                <div
                  className={`relative w-10 h-10 rounded-xl ${logoHover ? 'logo-tile-bg-hover' : 'logo-tile-bg'
                    } flex items-center justify-center overflow-hidden transition-all duration-500 ${logoHover
                      ? 'rotate-[10deg] scale-110'
                      : 'rotate-0 scale-100'
                    }`}
                  style={{
                    animation: 'logoGlowShift 4s ease-in-out infinite',
                  }}
                >
                  {/* Shimmer sweep on hover */}
                  <span className="shimmer-sweep" />

                  {/* Letter H — animated */}
                  <span
                    className="relative text-[#0A1F3D] font-black text-lg leading-none"
                    style={{
                      textShadow: '0 1px 2px rgba(255,255,255,0.5)',
                      transform: logoHover ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  >
                    H
                  </span>

                  {/* Corner dots inside tile */}
                  <span
                    className="absolute top-1 left-1 w-1 h-1 rounded-full"
                    style={{
                      background: 'rgba(10,31,61,0.7)',
                      animation: 'dotFlicker 2s ease-in-out infinite',
                    }}
                  />
                  <span
                    className="absolute bottom-1 right-1 w-1 h-1 rounded-full"
                    style={{
                      background: 'rgba(10,31,61,0.7)',
                      animation: 'dotFlicker 2s ease-in-out 0.6s infinite',
                    }}
                  />
                </div>

                {/* Electric arc — top */}
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-[2px] h-3 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, transparent, #22D3EE, transparent)',
                    animation: 'electricArc 1.8s ease-in-out infinite',
                  }}
                />
                {/* Electric arc — bottom */}
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[2px] h-3 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, transparent, #86EFAC, transparent)',
                    animation: 'electricArc 1.8s ease-in-out 0.9s infinite',
                  }}
                />
              </div>

              {/* ── Animated Wordmark ── */}
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-xl tracking-tight drop-shadow-md flex">
                  {'Muhammad'.split('').map((char, i) => (
                    <span
                      key={`m-${i}`}
                      style={{
                        animation: logoVisible
                          ? `letterReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.3 + i * 0.05}s both`
                          : 'none',
                        opacity: logoVisible ? 1 : 0,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                  <span className="w-2" />
                  {logoVisible &&
                    'Humail'.split('').map((char, i) => (
                      <span
                        key={`h-${i}`}
                        className="name-gradient"
                        style={{
                          animation: `letterReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.75 + i * 0.05}s both`,
                        }}
                      >
                        {char}
                      </span>
                    ))}
                </span>

                {/* Underline + Portfolio with electric blue accent */}
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="h-[1px] w-6 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #86EFAC, #22D3EE)',
                      boxShadow: '0 0 6px rgba(34,211,238,0.6)',
                      transformOrigin: 'left',
                      animation: logoVisible
                        ? 'textUnderlineExpand 0.8s cubic-bezier(0.22,1,0.36,1) 1.2s both'
                        : 'none',
                    }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-[0.3em] font-semibold"
                    style={{
                      background:
                        'linear-gradient(90deg, #86EFAC 0%, #22D3EE 50%, #86EFAC 100%)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: logoVisible
                        ? 'letterReveal 0.6s ease 1.3s both, gradientSlide 4s linear infinite'
                        : 'none',
                    }}
                  >
                    Portfolio
                  </span>
                </div>
              </div>
            </a>

            {/* ═══════════════ DESKTOP NAV ═══════════════ */}
            <nav
              ref={navRef}
              className="hidden md:flex items-center relative gap-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] px-2 py-1.5 backdrop-blur-sm"
              style={{
                boxShadow:
                  'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 4px 20px -8px rgba(0,0,0,0.5)',
              }}
            >
              {/* Animated Active Indicator — Emerald + Blue mix */}
              <span
                className="absolute top-1/2 -translate-y-1/2 h-9 rounded-xl pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                  background:
                    'linear-gradient(90deg, rgba(134,239,172,0.25), rgba(34,211,238,0.22), rgba(134,239,172,0.25))',
                  border: '1px solid rgba(134,239,172,0.4)',
                  boxShadow:
                    '0 0 20px rgba(134,239,172,0.35), 0 0 40px rgba(34,211,238,0.2), inset 0 1px 0 0 rgba(255,255,255,0.2)',
                }}
              />

              {navLinks.map((link, index) => (
                <a
                  key={link.id}
                  ref={(el) => (linkRefs.current[link.id] = el)}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  style={{ animationDelay: `${index * 80 + 300}ms` }}
                  className={`relative z-10 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 animate-nav-link link-hover-shadow ${activeSection === link.id
                    ? 'text-emerald-300 text-glow'
                    : 'text-white/70 hover:text-white'
                    }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #86EFAC, #22D3EE)',
                        boxShadow:
                          '0 0 10px rgba(134,239,172,0.9), 0 0 14px rgba(34,211,238,0.6)',
                      }}
                    />
                  )}
                </a>
              ))}
            </nav>

            {/* ═══════════════ CTA BUTTON ═══════════════ */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="group hidden md:inline-flex ml-3 relative overflow-hidden px-5 py-2.5 rounded-xl text-[#0A1F3D] text-sm font-bold cta-shadow hover:scale-105 active:scale-95 transition-all duration-300 animate-nav-link"
              style={{
                animationDelay: '800ms',
                background:
                  'linear-gradient(90deg, #86EFAC, #4ADE80, #22D3EE, #38BDF8, #86EFAC)',
                backgroundSize: '300% 100%',
                animation:
                  'navLinkFade 0.6s ease 800ms both, gradientSlide 5s linear infinite 800ms',
              }}
            >
              <span className="shimmer-sweep" />
              <span className="relative flex items-center gap-2">
                Hire Me
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>

            {/* ═══════════════ MOBILE HAMBURGER ═══════════════ */}
            <button
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`md:hidden relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 ${isMobileMenuOpen
                ? 'bg-emerald-400/15 border border-emerald-300/40 shadow-[0_0_20px_rgba(134,239,172,0.35)]'
                : 'bg-white/[0.06] border border-white/10 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:bg-emerald-400/10 hover:border-emerald-300/30 hover:shadow-[0_0_20px_rgba(134,239,172,0.3)]'
                }`}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen
                    ? 'rotate-45 translate-y-[9px] bg-emerald-300 shadow-[0_0_8px_rgba(134,239,172,0.9)]'
                    : 'bg-white'
                    }`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''
                    }`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen
                    ? '-rotate-45 -translate-y-[9px] bg-emerald-300 shadow-[0_0_8px_rgba(134,239,172,0.9)]'
                    : 'bg-white'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════ MOBILE MENU ═══════════════ */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
      >
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-[#071427]/85 backdrop-blur-md transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
        />

        <nav
          ref={mobileMenuRef}
          className={`absolute top-0 right-0 h-full w-[82%] max-w-sm bg-gradient-to-b from-[#0A1F3D] via-[#0A1F3D] to-[#071427] mobile-panel-shadow border-l border-emerald-300/15 pt-24 px-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Top gradient bar with emerald→blue glow */}
          <div
            className="absolute top-0 left-0 w-full h-1"
            style={{
              background:
                'linear-gradient(90deg, #86EFAC, #22D3EE, #86EFAC)',
              backgroundSize: '200% 100%',
              animation: 'gradientSlide 3s linear infinite',
              boxShadow:
                '0 0 15px rgba(134,239,172,0.6), 0 0 25px rgba(34,211,238,0.4)',
            }}
          />

          <ul className="space-y-2.5">
            {navLinks.map((link, index) => (
              <li
                key={link.id}
                style={{ transitionDelay: isMobileMenuOpen ? `${index * 60 + 150}ms` : '0ms' }}
                className={`transition-all duration-500 ${isMobileMenuOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-8'
                  }`}
              >
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`group flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 ${activeSection === link.id
                    ? 'bg-emerald-400/12 border border-emerald-300/40 text-emerald-300 mobile-item-shadow-active'
                    : 'text-white/75 hover:bg-white/[0.06] hover:text-white border border-white/[0.06] mobile-item-shadow'
                    }`}
                >
                  <span
                    className={`text-lg font-semibold ${activeSection === link.id ? 'text-glow' : ''
                      }`}
                  >
                    {link.label}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${activeSection === link.id
                      ? 'translate-x-0 text-emerald-300 drop-shadow-[0_0_6px_rgba(134,239,172,0.8)]'
                      : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            style={{
              transitionDelay: isMobileMenuOpen ? '550ms' : '0ms',
              background:
                'linear-gradient(90deg, #86EFAC, #4ADE80, #22D3EE, #38BDF8, #86EFAC)',
              backgroundSize: '300% 100%',
            }}
            className={`group mt-8 relative overflow-hidden block w-full text-center py-4 rounded-xl text-[#0A1F3D] font-bold cta-shadow transition-all duration-500 ${isMobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
              }`}
          >
            <span className="shimmer-sweep" />
            <span className="relative">Hire Me</span>
          </a>

          {/* Decorative glows — emerald + blue */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-52 h-52 bg-cyan-400/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-2/3 -left-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </nav>
      </div>

      <div className="h-20 md:h-24" />
    </>
  );
};

export default Header;