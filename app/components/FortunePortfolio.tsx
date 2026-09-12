'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

type Project = {
  title: string;
  year: string;
  url?: string;
  img?: string;
  shot?: string;
  tags: string[];
  blurb: string;
};

type Job = {
  span: string;
  role: string;
  co: string;
  desc: string;
};

type Pill = {
  label: string;
  bg: string;
  color: string;
  rot: number;
  duration: number;
  delay: number;
};

const THEMES: Record<'light' | 'dark', Record<string, string>> = {
  light: {
    '--bg': '#e5e5de',
    '--panel': '#ffffff',
    '--ink': '#201c2b',
    '--muted': '#8a8398',
    '--line': '#e7e0f7',
    '--a1': '#6605de',
    '--a2': '#2f9e5c',
    '--a3': '#fdce1c',
    '--a4': '#b889f2',
    '--grid': 'rgba(32,28,43,.05)',
  },
  dark: {
    '--bg': '#131118',
    '--panel': '#1e1b26',
    '--ink': '#f2eef9',
    '--muted': '#a39bb0',
    '--line': '#2c2836',
    '--a1': '#a78bfa',
    '--a2': '#34d399',
    '--a3': '#fdce1c',
    '--a4': '#c4b5fd',
    '--grid': 'rgba(255,255,255,.06)',
  },
};

const NAV_SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Résumé' },
  { id: 'contact', label: 'Say hi' },
];

const MARQUEE_IMAGES = [
  { file: 'sewmywears-home.jpg', alt: 'SewMyWears landing page' },
  { file: 'wave-productions.jpg', alt: 'Wave Productions landing page' },
  { file: 'el-ran-hero.jpg', alt: 'EL-RAN Transformational Rendezvous hero section' },
  { file: 'cryptotrybe.jpg', alt: 'CryptoTrybe landing page' },
  { file: 'floral-portrait.jpg', alt: 'Illustrated portrait with floral hair' },
  { file: 'anchor-pathway.jpg', alt: 'Anchor Pathway about page' },
  { file: 'flower-vase.jpg', alt: 'Illustrated still life of a flower vase' },
  { file: 'melanin-muse-cover.jpg', alt: 'Melanin & Muse magazine cover illustration' },
  { file: 'apex-hotel-hero.jpg', alt: 'Apex Continental Hotel landing page' },
  { file: 'soundtrack-app-onboarding.jpg', alt: 'Music aesthetic app onboarding screens' },
];
const MARQUEE_SEQUENCE = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES];

const PROJECTS: Project[] = [
  {
    title: 'Apex Continental Hotel',
    year: '2026',
    url: 'https://hotel-website-seven-gold.vercel.app/',
    img: '/assets/apex-hotel-hero.jpg',
    tags: ['hospitality', 'web', 'booking'],
    blurb: 'A concept hotel site built to make reserving a room feel as effortless as the stay itself.',
  },
  {
    title: 'SewMyWears',
    year: '2025',
    url: 'https://sewmywears.com/',
    img: '/assets/sewmywears-home.jpg',
    tags: ['fashion', 'web', '0→1'],
    blurb: 'A bespoke fashion platform I designed and built, connecting customers to verified tailors for custom African wear.',
  },
  {
    title: 'Wave Productions',
    year: '2026',
    url: 'https://www.waveproductionsnet.com/',
    img: '/assets/wave-productions.jpg',
    tags: ['podcast', 'audio editing', 'web'],
    blurb: 'A podcast editing website I designed and built.',
  },
  {
    title: 'EL-RAN Transformational Rendezvous',
    year: '2026',
    url: 'https://elranrendevous.com.ng/',
    img: '/assets/el-ran-hero.jpg',
    tags: ['ministry', 'web', 'branding'],
    blurb: 'A ministry and book showcase website, crafted from scratch.',
  },
];

const JOBS: Job[] = [
  {
    span: 'January 2026 — Present',
    role: 'Product Design Engineer',
    co: 'Freelance',
    desc: 'Designed and built websites across various sectors like hospitality, fashion, podcast production, and real estate.',
  },
  {
    span: 'Mar 2025 — Nov 2025',
    role: 'UI/UX Design Intern',
    co: 'Dev and Design',
    desc: 'Designed user interfaces for web and mobile projects in Figma — wireframes, mockups, and interactive prototypes. Conducted basic user research to inform design decisions and collaborated with developers on handoff and implementation.',
  },
  {
    span: '2024',
    role: 'Social Media Manager / Graphics Designer',
    co: 'ABC Capital Limited',
    desc: 'Designed graphics across websites, social media, and direct mail, and contributed to creative brainstorms for campaign activations and marketing content.',
  },
  {
    span: 'Jan 2023 — Dec 2024',
    role: 'Social Media Manager & Graphics Designer',
    co: 'She is Near',
    desc: 'Designed social media graphics, banners, and event flyers; wrote and edited content across advertising, social media, and newsletters; and built consistent brand templates for weekly updates and webinars.',
  },
  {
    span: 'Jan 2022 — Dec 2023',
    role: 'Content Writer',
    co: 'Icy Tales',
    desc: 'Wrote engaging, SEO-friendly articles on current trends and new products to grow search visibility and reader engagement.',
  },
  {
    span: 'Feb 2021 — Dec 2022',
    role: 'Technical / Content Writer',
    co: 'TMLT Innovation Hub',
    desc: 'Published eight articles a month, wrote press releases and media backgrounders, and partnered with design teams on social content — recognized as Staff of the Month.',
  },
  {
    span: '2018 — 2020',
    role: 'Freelance Creative Writer / Editor',
    co: 'Independent',
    desc: 'Delivered creative writing and editing services for online and print media clients.',
  },
];

type ToolIcon = 'figma' | 'claude' | 'chatgpt';
type Tool = { name: string; icon: ToolIcon };

const TOOL_GROUPS: { label: string; items: Tool[] }[] = [
  {
    label: 'Design',
    items: [{ name: 'Figma', icon: 'figma' }],
  },
  {
    label: 'AI',
    items: [
      { name: 'Claude', icon: 'claude' },
      { name: 'ChatGPT', icon: 'chatgpt' },
    ],
  },
];

const TOOL_ICON_BG: Record<ToolIcon, string> = {
  figma: '#ffffff',
  claude: '#1a1a1a',
  chatgpt: '#0f0f0f',
};

function ToolIconGlyph({ icon }: { icon: ToolIcon }) {
  if (icon === 'figma') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path fill="#0ACF83" d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" />
        <path fill="#A259FF" d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" />
        <path fill="#F24E1E" d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" />
        <path fill="#FF7262" d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" />
        <path fill="#1ABCFE" d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" />
      </svg>
    );
  }
  if (icon === 'claude') {
    return (
      <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
        <g fill="#d97757">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x="15" y="3" width="2.2" height="11" rx="1.1" transform={`rotate(${i * 45} 16 16)`} />
          ))}
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="#fff"
        d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.7948.7948 0 0 0-.407-.667zm2.0107-3.0231-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4592a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
      />
    </svg>
  );
}

const SKILLS: Pill[] = [
  { label: 'UX Research', bg: '#dbf5e6', color: '#12805a', rot: -3, duration: 3.5, delay: 0 },
  { label: 'Visual Design', bg: '#fbe3ee', color: '#b23a73', rot: 2, duration: 3.8, delay: 0.25 },
  { label: 'Wireframing', bg: '#fff2c2', color: '#8a6b00', rot: -2, duration: 3.4, delay: 0.5 },
  { label: 'AI Engineering', bg: '#dde9fb', color: '#2450b0', rot: 3, duration: 3.9, delay: 0.15 },
  { label: 'Vibe Coding', bg: '#ece0fb', color: '#6605de', rot: -2, duration: 3.3, delay: 0.35 },
  { label: 'Prototyping', bg: '#ffe1d6', color: '#c2542f', rot: 2, duration: 3.6, delay: 0.45 },
];

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function FortunePortfolio() {
  const [active, setActive] = useState('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [spin, setSpin] = useState(false);
  const [eggFound, setEggFound] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const projectMediaRefs = useRef<(HTMLDivElement | null)[]>([]);

  const logoClicksRef = useRef(0);

  const party = useCallback(() => {
    const layer = confettiRef.current;
    if (!layer) return;
    const colors = ['#e685b3', '#7ecbb6', '#f2c85f', '#8fb2ee', '#c8724d', '#879a52'];
    for (let i = 0; i < 90; i++) {
      const s = document.createElement('span');
      const c = colors[i % colors.length];
      s.style.cssText = `position:fixed;left:${Math.random() * 100}vw;top:-24px;width:${8 + Math.random() * 8}px;height:${9 + Math.random() * 15}px;background:${c};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};pointer-events:none;animation:confetti-fall ${1 + Math.random() * 1.6}s linear forwards;transform:rotate(${Math.random() * 360}deg);`;
      layer.appendChild(s);
      setTimeout(() => s.remove(), 2800);
    }
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 66, behavior: 'smooth' });
    }
  }, []);

  const goTo = useCallback(
    (id: string) => () => {
      setMenuOpen(false);
      scrollToSection(id);
    },
    [scrollToSection],
  );

  const goTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogoClick = useCallback(() => {
    goTop();
    setSpin(true);
    setTimeout(() => setSpin(false), 700);
    const next = logoClicksRef.current + 1;
    if (next >= 5) {
      logoClicksRef.current = 0;
      party();
      setEggFound(true);
    } else {
      logoClicksRef.current = next;
    }
  }, [goTop, party]);

  // magnetic hover: buttons drift toward the cursor, then spring back
  const magneticMove = useCallback((e: { currentTarget: HTMLElement; clientX: number; clientY: number }) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transition = 'transform 0.08s ease';
    el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
  }, []);

  const magneticLeave = useCallback((e: { currentTarget: HTMLElement }) => {
    const el = e.currentTarget;
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.transform = 'translate(0px, 0px)';
  }, []);

  // tilt hover: project media leans toward the cursor in 3D
  const tiltMove = useCallback((e: { currentTarget: HTMLElement; clientX: number; clientY: number }) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) scale(1.02)`;
  }, []);

  const tiltLeave = useCallback((e: { currentTarget: HTMLElement }) => {
    e.currentTarget.style.transform = '';
  }, []);

  // apply theme CSS custom properties whenever theme changes
  useEffect(() => {
    const vars = THEMES[theme];
    for (const k in vars) document.documentElement.style.setProperty(k, vars[k]);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((o) => !o);
  }, []);

  // project media scroll-tilt: cards unfold from a tilted, scaled-down state to flat
  // as they travel up through the viewport, re-computed every frame while scrolling
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const vh = window.innerHeight;
      projectMediaRefs.current.forEach((el) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        const t = Math.min(Math.max((vh - top) / (vh * 0.9), 0), 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const scale = 0.85 + 0.15 * eased;
        const tilt = 28 * (1 - eased);
        el.style.transform = `scale(${scale}) rotateX(${tilt}deg)`;
      });
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  // one-time mount effects: custom cursor, drag, konami code, scroll spy, scroll reveals
  useEffect(() => {
    const mouse ={ mx: window.innerWidth / 2, my: window.innerHeight / 2, rx: window.innerWidth / 2, ry: window.innerHeight / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.mx = e.clientX;
      mouse.my = e.clientY;
      if (cursorDotRef.current) cursorDotRef.current.style.transform = `translate(${mouse.mx}px,${mouse.my}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    let raf = 0;
    const loop = () => {
      mouse.rx += (mouse.mx - mouse.rx) * 0.2;
      mouse.ry += (mouse.my - mouse.ry) * 0.2;
      if (cursorRingRef.current) cursorRingRef.current.style.transform = `translate(${mouse.rx}px,${mouse.ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // draggable stickers
    let current: { el: HTMLElement; sx: number; sy: number; ox: number; oy: number } | null = null;
    const handlePointerDown = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-drag]');
      if (!t) return;
      e.preventDefault();
      t.style.animation = 'none';
      current = { el: t, sx: e.clientX, sy: e.clientY, ox: parseFloat(t.dataset.ox || '0'), oy: parseFloat(t.dataset.oy || '0') };
      t.style.zIndex = '60';
      t.style.cursor = 'grabbing';
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!current) return;
      const nx = current.ox + (e.clientX - current.sx);
      const ny = current.oy + (e.clientY - current.sy);
      current.el.dataset.ox = String(nx);
      current.el.dataset.oy = String(ny);
      current.el.style.transform = `translate(${nx}px,${ny}px) rotate(${current.el.dataset.rot || 0}deg)`;
    };
    const handlePointerUp = () => {
      if (current) {
        current.el.style.cursor = 'grab';
        current = null;
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    // konami code easter egg
    let seq: string[] = [];
    const handleKeyDown = (e: KeyboardEvent) => {
      seq = [...seq, e.key].slice(-KONAMI_CODE.length);
      if (seq.join(',').toLowerCase() === KONAMI_CODE.join(',').toLowerCase()) {
        party();
        setEggFound(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // scroll spy
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['home', 'work', 'about', 'resume', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spyObserver.observe(el);
    });

    // staggered scroll reveals
    document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((c) => {
      Array.from(c.children).forEach((ch, i) => {
        (ch as HTMLElement).dataset.si = String(i);
      });
    });
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const d = (Number(el.dataset.si) || 0) * 85;
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'none';
            }, d);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => revealObserver.observe(el));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      spyObserver.disconnect();
      revealObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const themeLabel = theme === 'light' ? 'dark mode' : 'light mode';

  return (
    <div className="fortune">
      <div ref={cursorRingRef} data-cursor className="cursor-ring" />
      <div ref={cursorDotRef} data-cursor className="cursor-dot" />
      <div ref={confettiRef} className="confetti-layer" />

      <div className="fortune-content">
        <nav className="nav">
          <div className="nav-inner">
            <button className="nav-logo" onClick={handleLogoClick}>
              <span className={`nav-logo-icon${spin ? ' is-spinning' : ''}`}>✷</span>
              <span>
                FORTUNE<sup className="nav-logo-tm">™</sup>
              </span>
            </button>
            <div className="nav-right">
              <button data-menu-btn className="nav-menu-btn" onClick={toggleMenu} aria-label="menu">
                {menuOpen ? '✕' : '☰'}
              </button>
              <div data-nav-links data-open={menuOpen ? 'true' : 'false'} className="nav-links">
                {NAV_SECTIONS.map((nav) => (
                  <button key={nav.id} className="nav-link" onClick={goTo(nav.id)}>
                    {active === nav.id && <span className="nav-dot" />}
                    {nav.label}
                  </button>
                ))}
                <button data-theme-btn className="nav-theme-btn" onClick={toggleTheme}>
                  ◐ {themeLabel}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* HOME */}
        <section id="home" data-screen-label="Home" className="hero">
          <div className="hero-marquee-wrap">
            <div className="hero-marquee-track">
              {MARQUEE_SEQUENCE.map((img, i) => (
                <div key={i} className="hero-marquee-item">
                  <img src={`/assets/${img.file}`} alt={img.alt} />
                </div>
              ))}
            </div>
          </div>
          <div className="hero-inner">
            <p className="hero-eyebrow">product designer · illustrator · vibe coder</p>
            <h1 className="hero-title">
              HELLO,
              <br />
              I&apos;M FORTUNE.
            </h1>
            <p className="hero-sub">
              I&apos;m a Product Designer who enjoys turning messy ideas into simple, intuitive experiences.
              I&apos;m curious by nature, and obsessed with good interfaces.
            </p>
            <div className="hero-ctas">
              <button
                className="btn"
                onClick={goTo('work')}
                onPointerMove={magneticMove}
                onPointerLeave={magneticLeave}
              >
                see the work →
              </button>
              <button
                className="btn"
                onClick={goTo('contact')}
                onPointerMove={magneticMove}
                onPointerLeave={magneticLeave}
              >
                say hi
              </button>
            </div>

            <div data-drag data-hero-sticker data-rot="-9" className="hero-sticker hero-sticker-1">
              drag
              <br />
              me!
            </div>
            <div data-drag data-hero-sticker data-rot="7" className="hero-sticker hero-sticker-2">
              ● open for work · 2026
            </div>
            <div data-drag data-hero-sticker data-rot="-4" className="hero-sticker hero-sticker-3">
              ✦
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" data-screen-label="Work" className="work-section">
          <h1 data-reveal className="section-title reveal">
            SELECTED WORK
          </h1>
          <p data-reveal className="section-sub reveal">
            A handful of projects I&apos;m proud of, minus the NDAs and the parts where everything was on fire. Hover
            to peek.
          </p>
          <div data-stagger className="project-list">
            {PROJECTS.map((p, i) => (
              <article key={p.title} data-reveal className="project reveal-article">
                <div className="project-media-wrap" ref={(el) => { projectMediaRefs.current[i] = el; }}>
                  <div className="project-media" onPointerMove={tiltMove} onPointerLeave={tiltLeave}>
                    {p.img ? (
                      <img src={p.img} alt={p.title} />
                    ) : (
                      <span className="project-media-placeholder">{'// '}{p.shot}</span>
                    )}
                  </div>
                </div>
                <div className="project-header">
                  <div className="project-heading">
                    <h2 className="project-title">{p.title}</h2>
                    <span className="project-year">{p.year}</span>
                  </div>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="project-link">
                      visit site ↗
                    </a>
                  )}
                </div>
                <div className="project-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="project-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="project-blurb">{p.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" data-screen-label="About" className="about-section">
          <h1 data-reveal className="section-title section-title--about reveal">
            ABOUT ME
          </h1>
          <div data-reveal data-about-grid className="about-grid reveal">
            <div className="about-portrait">
              <img src="/assets/fortune-portrait.jpg" alt="Fortune" />
              <div data-drag data-rot="6" className="about-portrait-tag">
                that&apos;s me!
              </div>
            </div>

            <div className="about-right">
              <div className="about-bio">
                <p>
                  I&apos;m a Product Designer with a background in Physical Oceanography, so my brain naturally
                  moves between structure, curiosity, and problem-solving. I enjoy taking complex ideas and figuring
                  out how to make them more human.
                </p>
                <p>
                  I&apos;m also a writer at heart, and when I&apos;m not designing, I&apos;m usually working on my
                  newsletter and sharing my thoughts with my subscribers. I love me a very good Kdrama on a cold and
                  rainy day.
                </p>
              </div>

              <div className="stats-card">
                <div>
                  <div className="stats-num">20+</div>
                  <div className="stats-label">BRANDS</div>
                </div>
                <div className="stats-divider" />
                <div>
                  <div className="stats-num">50+</div>
                  <div className="stats-label">CLIENTS</div>
                </div>
                <button
                  className="stats-cta"
                  onClick={goTo('contact')}
                  onPointerMove={magneticMove}
                  onPointerLeave={magneticLeave}
                >
                  Let&apos;s connect ↗
                </button>
              </div>

              <div className="info-card">
                <div className="info-card-label">TOOLS &amp; WORKFLOW</div>
                {TOOL_GROUPS.map((group) => (
                  <div key={group.label} className="tools-group">
                    <div className="tools-group-label">{group.label}</div>
                    <div className="tools-row">
                      {group.items.map((tool) => (
                        <div key={tool.name} className="tool-item">
                          <span className="tool-icon" style={{ background: TOOL_ICON_BG[tool.icon] }}>
                            <ToolIconGlyph icon={tool.icon} />
                          </span>
                          <span>{tool.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="tools-note">
                  I use AI to accelerate research, exploration, and documentation while keeping product decisions
                  human-led.
                </p>
              </div>

              <div className="info-card">
                <div className="info-card-label">MY SKILLS</div>
                <div className="pill-row">
                  {SKILLS.map((item, i) => (
                    <span
                      key={i}
                      className="pill"
                      style={
                        {
                          background: item.bg,
                          color: item.color,
                          '--pr': `${item.rot}deg`,
                          animationDuration: `${item.duration}s`,
                          animationDelay: `${item.delay}s`,
                        } as CSSVars
                      }
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RÉSUMÉ */}
        <section id="resume" data-screen-label="Résumé" className="resume-section">
          <div data-reveal className="resume-header reveal">
            <h1 className="resume-title">RÉSUMÉ</h1>
            <a href="/assets/fortune-resume.pdf" download="Fortune-Resume.pdf" className="btn-download" onClick={party}>
              download PDF
            </a>
          </div>
          <h3 className="section-label">EXPERIENCE</h3>
          <div data-stagger>
            {JOBS.map((j) => (
              <div key={j.role + j.span} data-reveal data-resume-row className="resume-row reveal-sm">
                <div className="resume-row-span">{j.span}</div>
                <div>
                  <div className="resume-role">{j.role}</div>
                  <div className="resume-co">{j.co}</div>
                  <p className="resume-desc">{j.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <h3 className="section-label section-label--spaced">EDUCATION &amp; EXTRAS</h3>
          <div data-resume-row className="resume-row resume-row--static">
            <div className="resume-row-span">2017–2021</div>
            <div>
              <div className="resume-role">B.Sc. Physical Oceanography</div>
              <div className="resume-desc">University of Calabar, Nigeria</div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" data-screen-label="Contact" data-stagger className="contact-section">
          <h1 data-reveal className="contact-title reveal-hero-title">
            LET&apos;S
            <br />
            CONNECT
          </h1>
          <a
            href="https://calendly.com/marvieoma/30min"
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            className="contact-cta reveal-cta"
            onPointerMove={magneticMove}
            onPointerLeave={magneticLeave}
          >
            Book a call
          </a>
          <div data-reveal className="contact-social-row reveal-cta">
            <a href="#" className="social-link social-link--a2">
              twitter/x ↗
            </a>
            <a href="#" className="social-link social-link--a4">
              read.cv ↗
            </a>
            <a
              href="https://www.linkedin.com/in/yomabasi-fortune-bassey-236024234"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link social-link--a3"
            >
              linkedin ↗
            </a>
          </div>
          <div data-drag data-hero-sticker data-rot="-8" className="contact-sticker">
            reply
            <br />
            within
            <br />
            24h!
          </div>
        </section>

        <footer className="footer">
          <div className="footer-inner">
            <span>© 2026 Fortune · made with too much coffee</span>
            {eggFound && (
              <span>
                <span className="footer-egg">you found it! 🎉</span>
              </span>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
