import React, { useState, useEffect, useRef, useCallback } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [logoVisible, setLogoVisible] = useState(false);

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

  // Logo entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setLogoVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll detection for header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section tracking with IntersectionObserver
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

  // Move the active indicator
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Smooth scroll handler
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
        @keyframes logoFadeIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.96); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes navLinkFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(134, 239, 172, 0.5), 0 0 20px rgba(134, 239, 172, 0.3); }
          50% { box-shadow: 0 0 0 10px rgba(134, 239, 172, 0), 0 0 30px rgba(134, 239, 172, 0.5); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
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
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled
            ? 'bg-[#0A1F3D]/95 backdrop-blur-2xl py-3 border-b border-emerald-300/15 header-shadow'
            : 'bg-[#0A1F3D]/50 backdrop-blur-md py-5 border-b border-transparent header-shadow-soft'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className={`group flex items-center gap-3 transition-all duration-700 ${logoVisible ? 'animate-logo' : 'opacity-0'
                }`}
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-200 via-emerald-300 to-emerald-500 flex items-center justify-center logo-shadow transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                  <span className="text-[#0A1F3D] font-black text-lg drop-shadow-sm">H</span>
                </div>
                <span className="absolute inset-0 rounded-xl bg-emerald-300/40 animate-ping opacity-0 group-hover:opacity-100" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-xl tracking-tight drop-shadow-md">
                  Muhammad<span className="text-emerald-300 text-glow"> </span>Humail
                </span>
                <span className="text-emerald-300/80 text-[10px] uppercase tracking-[0.3em] mt-1 font-semibold">
                  Portfolio
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav
              ref={navRef}
              className="hidden md:flex items-center relative gap-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] px-2 py-1.5 backdrop-blur-sm"
              style={{
                boxShadow:
                  'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 4px 20px -8px rgba(0,0,0,0.5)',
              }}
            >
              {/* Animated Active Indicator */}
              <span
                className="absolute top-1/2 -translate-y-1/2 h-9 rounded-xl bg-gradient-to-r from-emerald-400/25 via-emerald-300/20 to-emerald-400/25 border border-emerald-300/40 pill-shadow transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
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
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(134,239,172,0.9)]" />
                  )}
                </a>
              ))}
            </nav>

            {/* CTA Button (Desktop) */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="hidden md:inline-flex ml-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 text-[#0A1F3D] text-sm font-bold cta-shadow hover:scale-105 active:scale-95 transition-all duration-300 animate-nav-link"
              style={{ animationDelay: '800ms' }}
            >
              Hire Me
            </a>

            {/* Mobile Hamburger */}
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-[#071427]/85 backdrop-blur-md transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
        />

        {/* Menu Panel */}
        <nav
          ref={mobileMenuRef}
          className={`absolute top-0 right-0 h-full w-[82%] max-w-sm bg-gradient-to-b from-[#0A1F3D] via-[#0A1F3D] to-[#071427] mobile-panel-shadow border-l border-emerald-300/15 pt-24 px-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Top gradient bar with glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 shadow-[0_0_15px_rgba(134,239,172,0.6)]" />

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
            style={{ transitionDelay: isMobileMenuOpen ? '550ms' : '0ms' }}
            className={`mt-8 block w-full text-center py-4 rounded-xl bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 text-[#0A1F3D] font-bold cta-shadow transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Hire Me
          </a>

          {/* Decorative glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </nav>
      </div>

      {/* Spacer to prevent content jump under fixed header */}
      <div className="h-20 md:h-24" />
    </>
  );
};

export default Header;