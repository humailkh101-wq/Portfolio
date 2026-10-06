import React, { useState, useEffect, useRef } from 'react';

/* =========================================================
   COLOR PALETTE — Navy Blue · White · Light Green
   ========================================================= */
const COLORS = {
  navyDeepest: '#04101F',
  navyDark:    '#071427',
  navyPrimary: '#0A1F3D',
  navyLight:   '#12305C',
  white:       '#FFFFFF',
  greenLight:  '#86EFAC',
  greenBright: '#4ADE80',
  greenDeep:   '#22C55E',
};

/* =========================================================
   DATA
   ========================================================= */
const CONTACT_DETAILS = [
  {
    label: 'Email',
    value: 'm.humail101@gmail.com',
    href: 'mailto:m.humail101@gmail.com',
    icon: '✉',
    hint: 'Reply within 24h',
  },
  {
    label: 'Phone',
    value: '+92 300 0000000',
    href: 'tel:+923000000000',
    icon: '☎',
    hint: 'Mon–Fri, 9am–6pm PKT',
  },
  {
    label: 'Location',
    value: 'Hyderabad, Pakistan',
    href: null,
    icon: '📍',
    hint: 'Open to remote',
  },
];

const SOCIALS = [
  { name: 'GitHub',   url: 'https://github.com',    icon: '⌥' },
  { name: 'LinkedIn', url: 'https://linkedin.com',  icon: 'in' },
  { name: 'Twitter',  url: 'https://twitter.com',   icon: '𝕏' },
  { name: 'Dribbble', url: 'https://dribbble.com',  icon: '◐' },
];

const FAQS = [
  {
    q: 'What kind of projects do you take on?',
    a: 'Full-stack web apps, AI-powered tools, and product-focused builds — from idea to deployment.',
  },
  {
    q: 'How do we get started?',
    a: 'Send a message with a short brief. I reply within 24 hours with next steps and a rough timeline.',
  },
  {
    q: 'Do you work remotely?',
    a: 'Yes — fully remote and comfortable across time zones. Async-first, with regular check-ins.',
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
   MAGNETIC BUTTON
   ========================================================= */
const MagneticButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  type = 'button',
  disabled = false,
}) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const onMove = (e) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setPos({ x: (px - rect.width / 2) * 0.3, y: (py - rect.height / 2) * 0.3 });
    setGlow({ x: (px / rect.width) * 100, y: (py / rect.height) * 100 });
  };
  const onLeave = () => {
    setPos({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
  };

  const sizes = {
    md: 'px-5 py-3 text-sm',
    lg: 'px-7 py-3.5 text-sm',
    xl: 'px-9 py-4 text-base',
  };

  const variants = {
    primary: {
      background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright}, ${COLORS.greenLight})`,
      color: COLORS.navyPrimary,
      boxShadow:
        '0 8px 30px -6px rgba(74,222,128,0.6), 0 20px 60px -15px rgba(34,197,94,0.5), inset 0 1px 0 0 rgba(255,255,255,0.4)',
    },
    ghost: {
      background: 'rgba(255,255,255,0.04)',
      color: COLORS.white,
      border: '1px solid rgba(134,239,172,0.35)',
      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
    },
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`group relative overflow-hidden inline-flex items-center justify-center gap-3 rounded-2xl font-bold active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${sizes[size]}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        ...variants[variant],
      }}
    >
      {variant === 'primary' && !disabled && (
        <span
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.75), transparent 45%)`,
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

/* =========================================================
   ANIMATED INPUT FIELD
   ========================================================= */
const AnimatedInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  textarea = false,
  required,
  autoComplete,
}) => {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const isActive = focused || value;
  const Field = textarea ? 'textarea' : 'input';

  /* Validate on blur */
  const handleBlur = () => {
    setFocused(false);
    setTouched(true);
    if (required && !value.trim()) {
      setError(`${label.replace(/^Your /, '')} is required`);
    } else if (type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
      setError('Please enter a valid email');
    } else {
      setError('');
    }
  };

  const hasError = touched && error;
  const activeColor = hasError ? '#F87171' : COLORS.greenLight;

  return (
    <div className="relative mb-7">
      <Field
        id={id}
        name={id}
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => {
          onChange(e);
          if (error) setError('');
        }}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        className="peer w-full bg-transparent outline-none text-white text-base pt-6 pb-2 px-0 rounded-none resize-none"
        style={{
          borderBottom: `1px solid ${
            focused ? activeColor : hasError ? '#F87171' : 'rgba(255,255,255,0.15)'
          }`,
          boxShadow: focused ? `0 4px 20px -8px ${activeColor}` : 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      />
      <label
        htmlFor={id}
        className="absolute left-0 pointer-events-none font-semibold transition-all duration-300"
        style={{
          top: isActive ? 0 : textarea ? 20 : 24,
          fontSize: isActive ? 11 : 14,
          color: hasError
            ? '#F87171'
            : focused
            ? COLORS.greenLight
            : isActive
            ? 'rgba(255,255,255,0.55)'
            : 'rgba(255,255,255,0.45)',
          letterSpacing: isActive ? '0.15em' : '0',
          textTransform: isActive ? 'uppercase' : 'none',
          textShadow: focused ? `0 0 20px ${COLORS.greenLight}60` : 'none',
        }}
      >
        {label}
      </label>
      {/* Animated underline */}
      <span
        className="absolute left-0 bottom-0 h-[2px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: focused ? '100%' : '0%',
          background: `linear-gradient(90deg, ${activeColor}, ${COLORS.greenBright})`,
          boxShadow: `0 0 12px ${activeColor}`,
        }}
      />
      {/* Error message */}
      <span
        className="absolute left-0 -bottom-5 text-[11px] font-semibold transition-all duration-300"
        style={{
          color: '#F87171',
          opacity: hasError ? 1 : 0,
          transform: `translateY(${hasError ? 0 : -4}px)`,
        }}
      >
        {error}
      </span>
    </div>
  );
};

/* =========================================================
   SOCIAL LINK
   ========================================================= */
const SocialLink = ({ social, index, inView }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={social.name}
      className="group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 hover:-translate-y-1"
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
        transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${0.3 + index * 0.08}s, background 0.3s ease, color 0.3s ease`,
      }}
    >
      <span className="text-base font-black">{social.icon}</span>
      <span
        className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap pointer-events-none transition-all duration-300"
        style={{
          background: 'rgba(4,16,31,0.95)',
          color: COLORS.greenLight,
          border: `1px solid ${COLORS.greenLight}50`,
          opacity: hovered ? 1 : 0,
          transform: `translate(-50%, ${hovered ? 0 : -6}px)`,
        }}
      >
        {social.name}
      </span>
    </a>
  );
};

/* =========================================================
   FAQ ITEM (accordion)
   ========================================================= */
const FaqItem = ({ faq, index, inView }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${open ? `${COLORS.greenLight}60` : 'rgba(255,255,255,0.08)'}`,
        boxShadow: open
          ? `0 20px 60px -20px rgba(0,0,0,0.7), 0 0 40px -15px ${COLORS.greenLight}60`
          : 'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 10px 30px -15px rgba(0,0,0,0.5)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.8s cubic-bezier(0.22,1,0.36,1) ${0.3 + index * 0.1}s, border-color 0.4s ease, box-shadow 0.4s ease`,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left group"
      >
        <span className="text-sm sm:text-base font-bold text-white group-hover:text-[#86EFAC] transition-colors">
          {faq.q}
        </span>
        <span
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500"
          style={{
            background: open ? `linear-gradient(135deg, ${COLORS.greenLight}, ${COLORS.greenBright})` : 'rgba(255,255,255,0.05)',
            color: open ? COLORS.navyPrimary : COLORS.greenLight,
            border: `1px solid ${open ? 'transparent' : 'rgba(134,239,172,0.30)'}`,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            boxShadow: open ? `0 6px 20px -6px ${COLORS.greenLight}90` : 'none',
          }}
        >
          ▾
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          maxHeight: open ? 200 : 0,
          opacity: open ? 1 : 0,
        }}
      >
        <p
          className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.60)' }}
        >
          {faq.a}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   CONTACT SECTION
   ========================================================= */
const Contact = () => {
  const [headerRef, headerInView] = useInView(0.15);
  const [mainRef, mainInView]     = useInView(0.08);
  const [faqRef, faqInView]       = useInView(0.15);

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: COLORS.navyDark,
        background: `radial-gradient(circle at 80% 20%, ${COLORS.navyLight} 0%, ${COLORS.navyPrimary} 40%, ${COLORS.navyDeepest} 100%)`,
      }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-1/3 -left-40 w-[520px] h-[520px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.16), transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 -right-40 w-[520px] h-[520px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.12), transparent 70%)' }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ────────────────────────────────────── */}
        {/* HERO CTA                                */}
        {/* ────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="text-center mb-24"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Availability pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: 'rgba(134,239,172,0.08)',
              border: '1px solid rgba(134,239,172,0.25)',
              boxShadow: '0 0 40px -10px rgba(134,239,172,0.5)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: COLORS.greenLight,
                boxShadow: `0 0 12px ${COLORS.greenLight}`,
                animation: 'pulseDot 1.8s ease-in-out infinite',
              }}
            />
            <span
              className="text-[10px] font-black uppercase tracking-[0.35em]"
              style={{ color: COLORS.greenLight }}
            >
              Available · Nov 2025
            </span>
          </div>

          {/* Big headline */}
          <h2 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[9rem] font-black leading-[0.9] tracking-tight mb-8">
            <span className="text-white">Let&apos;s </span>
            <span
              className="inline-block"
              style={{
                background: `linear-gradient(90deg, ${COLORS.greenLight}, ${COLORS.greenBright}, ${COLORS.greenLight})`,
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 5s ease infinite',
                filter: 'drop-shadow(0 0 40px rgba(134,239,172,0.5))',
              }}
            >
              build
            </span>
            <br />
            <span className="text-white">something great</span>
            <span style={{ color: COLORS.greenLight }}>.</span>
          </h2>

          <p
            className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Whether you have a project in mind, a role to fill, or just want to
            say hi — my inbox is always open.
          </p>

          {/* Quick CTA row */}
          <div className="flex flex-wrap justify-center gap-4">
            <MagneticButton
              variant="primary"
              size="xl"
              onClick={() => scrollTo('contact-form')}
            >
              Start a project
              <span>↓</span>
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              size="xl"
              onClick={() => window.open('mailto:m.humail101@gmail.com')}
            >
              m.humail101@gmail.com
            </MagneticButton>
          </div>
        </div>

        {/* ────────────────────────────────────── */}
        {/* MAIN GRID                               */}
        {/* ────────────────────────────────────── */}
        <div
          ref={mainRef}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 mb-24"
          style={{
            opacity: mainInView ? 1 : 0,
            transform: mainInView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.15s',
          }}
        >
          {/* ── FORM ── */}
          <div
            id="contact-form"
            className="lg:col-span-3 relative rounded-3xl p-7 sm:p-10 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow:
                'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 30px 80px -30px rgba(0,0,0,0.7)',
            }}
          >
            {/* Top gradient bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLORS.greenLight}, ${COLORS.greenBright}, ${COLORS.greenLight}, transparent)`,
                boxShadow: `0 0 20px ${COLORS.greenLight}`,
              }}
            />

            <div className="mb-8">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Send a message
              </h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Share a few details and I&apos;ll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <AnimatedInput
                  id="name"
                  label="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
                <AnimatedInput
                  id="email"
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
              <AnimatedInput
                id="message"
                label="Your Message"
                value={form.message}
                onChange={handleChange}
                textarea
                required
              />

              {/* Submit row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-10">
                <MagneticButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <span
                        className="inline-block w-4 h-4 rounded-full border-2 animate-spin"
                        style={{
                          borderColor: COLORS.navyPrimary,
                          borderTopColor: 'transparent',
                        }}
                      />
                      Sending…
                    </>
                  ) : submitted ? (
                    <>✓ Message sent</>
                  ) : (
                    <>
                      Send Message
                      <span>→</span>
                    </>
                  )}
                </MagneticButton>

                <p
                  className="text-xs font-semibold"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  🔒 Your data stays private
                </p>
              </div>

              {/* Success toast */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{
                  maxHeight: submitted ? 100 : 0,
                  opacity: submitted ? 1 : 0,
                  marginTop: submitted ? 20 : 0,
                }}
              >
                <div
                  className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
                  style={{
                    color: COLORS.greenLight,
                    background: 'rgba(134,239,172,0.10)',
                    border: `1px solid ${COLORS.greenLight}50`,
                    boxShadow: `0 0 30px -10px ${COLORS.greenLight}70`,
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                    style={{
                      background: COLORS.greenLight,
                      color: COLORS.navyPrimary,
                    }}
                  >
                    ✓
                  </span>
                  Thanks! Your message was sent successfully.
                </div>
              </div>
            </form>
          </div>

          {/* ── SIDE PANEL ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Availability card */}
            <div
              className="relative rounded-3xl p-6 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${COLORS.greenLight}10, transparent 60%)`,
                border: `1px solid ${COLORS.greenLight}40`,
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.06), 0 20px 60px -20px ${COLORS.greenLight}30`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: COLORS.greenLight,
                    boxShadow: `0 0 12px ${COLORS.greenLight}`,
                    animation: 'pulseDot 1.8s ease-in-out infinite',
                  }}
                />
                <span
                  className="text-[10px] font-black uppercase tracking-[0.3em]"
                  style={{ color: COLORS.greenLight }}
                >
                  Currently Available
                </span>
              </div>
              <p className="text-white font-bold text-lg mb-1">Open to opportunities</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Freelance · Contract · Full-time · Remote
              </p>
            </div>

            {/* Contact details */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow:
                  'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 20px 60px -20px rgba(0,0,0,0.7)',
              }}
            >
              <h4
                className="text-[10px] font-black uppercase tracking-[0.3em] mb-5"
                style={{ color: COLORS.greenLight }}
              >
                Contact Details
              </h4>

              <div className="space-y-4">
                {CONTACT_DETAILS.map((c) => {
                  const Wrapper = c.href ? 'a' : 'div';
                  const props = c.href
                    ? {
                        href: c.href,
                        className:
                          'group flex items-start gap-3 transition-transform duration-300 hover:translate-x-1',
                      }
                    : { className: 'flex items-start gap-3' };
                  return (
                    <Wrapper key={c.label} {...props}>
                      <span
                        className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-300"
                        style={{
                          background: `${COLORS.greenLight}15`,
                          border: `1px solid ${COLORS.greenLight}40`,
                          color: COLORS.greenLight,
                          boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.06)`,
                        }}
                      >
                        {c.icon}
                      </span>
                      <div className="pt-0.5 min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-0.5">
                          {c.label}
                        </p>
                        <p className="text-sm font-semibold text-white group-hover:text-[#86EFAC] transition-colors truncate">
                          {c.value}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {c.hint}
                        </p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </div>

            {/* Socials */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow:
                  'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 20px 60px -20px rgba(0,0,0,0.7)',
              }}
            >
              <h4
                className="text-[10px] font-black uppercase tracking-[0.3em] mb-5"
                style={{ color: COLORS.greenLight }}
              >
                Find Me Online
              </h4>
              <div className="flex flex-wrap gap-3">
                {SOCIALS.map((s, i) => (
                  <SocialLink key={s.name} social={s} index={i} inView={mainInView} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────── */}
        {/* FAQ                                     */}
        {/* ────────────────────────────────────── */}
        <div ref={faqRef} className="mb-20">
          <div
            className="text-center mb-12"
            style={{
              opacity: faqInView ? 1 : 0,
              transform: faqInView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <h3 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Frequently asked
            </h3>
            <p
              className="max-w-xl mx-auto text-sm"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Quick answers to the things people usually ask before reaching out.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} inView={faqInView} />
            ))}
          </div>
        </div>

        {/* ────────────────────────────────────── */}
        {/* FOOTER STRIP                            */}
        {/* ────────────────────────────────────── */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Muhammad Humail — Crafted with{' '}
            <span style={{ color: COLORS.greenLight }}>React</span> &amp;{' '}
            <span style={{ color: COLORS.greenLight }}>Tailwind</span>.
          </p>
          <button
            onClick={() => scrollTo('home')}
            className="group inline-flex items-center gap-2 text-sm font-bold transition-colors duration-300"
            style={{ color: COLORS.greenLight }}
          >
            <span className="transition-transform duration-300 group-hover:-translate-y-1">
              ↑
            </span>
            Back to top
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(134,239,172,0.6); }
          50%      { box-shadow: 0 0 0 12px rgba(134,239,172,0); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};

export default Contact;