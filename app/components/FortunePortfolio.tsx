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

const THEMES: Record<'lavender' | 'citrus', Record<string, string>> = {
  lavender: {
    '--bg': '#f6f1ff',
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
  citrus: {
    '--bg': '#fff8ec',
    '--panel': '#ffffff',
    '--ink': '#241f13',
    '--muted': '#96895f',
    '--line': '#f2e4c4',
    '--a1': '#d97706',
    '--a2': '#6605de',
    '--a3': '#2f9e5c',
    '--a4': '#ff8a65',
    '--grid': 'rgba(36,31,19,.05)',
  },
};

const NAV_SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'play', label: 'Play' },
  { id: 'resume', label: 'Résumé' },
  { id: 'contact', label: 'Say hi' },
];

const PROJECTS: Project[] = [
  {
    title: 'SewMyWears',
    year: '2025',
    url: 'https://sewmywears.com/',
    img: '/assets/sewmywears-styles.png',
    tags: ['fashion', 'web', '0→1'],
    blurb:
      'The operating system for bespoke fashion. Order custom African wear through a transparent flow — guided measurements, verified tailors, and real-time order updates.',
  },
  {
    title: 'Nestful',
    year: '2025',
    shot: 'banking dashboard',
    tags: ['0→1', 'iOS', 'design system'],
    blurb: 'Renovated a banking app people genuinely dreaded. Turns out you can make money feel calm.',
  },
  {
    title: 'Verdant',
    year: '2024',
    shot: 'plant care app',
    tags: ['mobile', 'research', 'motion'],
    blurb: 'A plant-care companion that nags you gently. Retention up, houseplants alive.',
  },
  {
    title: 'Loop',
    year: '2023',
    shot: 'community feed',
    tags: ['web', '0→1', 'systems'],
    blurb: 'Community tools for small creators. Designed for belonging, not doomscrolling.',
  },
  {
    title: 'Ledgerly',
    year: '2022',
    shot: 'B2B invoicing',
    tags: ['B2B', 'dashboard', 'ic → lead'],
    blurb: "Made invoicing software freelancers don't rage-quit. Unsexy problem, sexy solution.",
  },
];

const JOBS: Job[] = [
  {
    span: '2023 — now',
    role: 'Senior Product Designer',
    co: 'A fintech startup, probably',
    desc: 'Lead designer on the consumer app. Built the design system, shipped the redesign, mentored two juniors.',
  },
  {
    span: '2021 — 2023',
    role: 'Product Designer',
    co: 'Loop (acquired)',
    desc: 'Owned end-to-end flows for creator tools. Went from 1 to 3 designers, survived the acquisition.',
  },
  {
    span: '2019 — 2021',
    role: 'Product Designer',
    co: 'Ledgerly',
    desc: 'First design hire. Wore every hat, designed the whole B2B suite, learned what not to do.',
  },
  {
    span: '2018 — 2019',
    role: 'Design Intern',
    co: 'A big agency',
    desc: 'Made a lot of decks. Learned that constraints are a gift and clients are chaos.',
  },
];

const WHAT_I_DO: ({ type: 'pill' } & Pill | { type: 'sep' })[] = [
  { type: 'pill', label: "I'm Fortune", bg: '#ece0fb', color: '#6605de', rot: -3, duration: 3.2, delay: 0 },
  { type: 'sep' },
  { type: 'pill', label: 'UX Designer', bg: '#fff2c2', color: '#8a6b00', rot: 2, duration: 3.6, delay: 0.3 },
  { type: 'pill', label: 'I vibe code', bg: '#dbf5e6', color: '#12805a', rot: -2, duration: 3.9, delay: 0.15 },
  { type: 'sep' },
  { type: 'pill', label: 'AI Design Engineer', bg: '#ffe1d6', color: '#c2542f', rot: 3, duration: 3.4, delay: 0.5 },
  { type: 'pill', label: 'Content Creator', bg: '#dde9fb', color: '#2450b0', rot: -2, duration: 3.7, delay: 0.2 },
  { type: 'sep' },
  { type: 'pill', label: 'I design', bg: '#fbe3ee', color: '#b23a73', rot: 2, duration: 3.3, delay: 0.4 },
];

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
  const [theme, setTheme] = useState<'lavender' | 'citrus'>('lavender');
  const [spin, setSpin] = useState(false);
  const [eggFound, setEggFound] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [gameActive, setGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(15);
  const [gameHigh, setGameHigh] = useState(0);
  const [targetPos, setTargetPos] = useState({ tx: 50, ty: 50 });

  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const projectMediaRefs = useRef<(HTMLDivElement | null)[]>([]);

  const logoClicksRef = useRef(0);
  const gameActiveRef = useRef(false);
  const gameScoreRef = useRef(0);
  const gameHighRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const driftRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const moveTarget = useCallback(() => {
    setTargetPos({ tx: 8 + Math.random() * 84, ty: 12 + Math.random() * 74 });
  }, []);

  const stopGameTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (driftRef.current) clearInterval(driftRef.current);
    timerRef.current = null;
    driftRef.current = null;
  }, []);

  const startGame = useCallback(() => {
    if (gameActiveRef.current) return;
    stopGameTimers();
    gameActiveRef.current = true;
    gameScoreRef.current = 0;
    setGameActive(true);
    setGameScore(0);
    setGameTime(15);
    moveTarget();

    timerRef.current = setInterval(() => {
      setGameTime((t) => {
        if (t <= 1) {
          stopGameTimers();
          gameActiveRef.current = false;
          setGameActive(false);
          const newHigh = Math.max(gameHighRef.current, gameScoreRef.current);
          gameHighRef.current = newHigh;
          setGameHigh(newHigh);
          try {
            localStorage.setItem('fortune_high', String(newHigh));
          } catch {}
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    driftRef.current = setInterval(() => {
      if (gameActiveRef.current) moveTarget();
    }, 850);
  }, [moveTarget, stopGameTimers]);

  const hitTarget = useCallback(() => {
    if (!gameActiveRef.current) return;
    gameScoreRef.current += 1;
    setGameScore(gameScoreRef.current);
    moveTarget();
  }, [moveTarget]);

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
    setTheme((t) => (t === 'lavender' ? 'citrus' : 'lavender'));
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
    try {
      const storedHigh = +(localStorage.getItem('fortune_high') || 0);
      gameHighRef.current = storedHigh;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
      setGameHigh(storedHigh);
    } catch {}

    const mouse = { mx: window.innerWidth / 2, my: window.innerHeight / 2, rx: window.innerWidth / 2, ry: window.innerHeight / 2 };
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
    ['home', 'work', 'about', 'play', 'resume', 'contact'].forEach((id) => {
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
      stopGameTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const themeLabel = theme === 'lavender' ? 'citrus mode' : 'lavender mode';

  return (
    <div className="fortune">
      <div ref={cursorRingRef} data-cursor className="cursor-ring" />
      <div ref={cursorDotRef} data-cursor className="cursor-dot" />
      <div ref={confettiRef} className="confetti-layer" />

      <div className="fortune-content">
        <nav className="nav">
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
        </nav>

        {/* HOME */}
        <section id="home" data-screen-label="Home" className="hero">
          <div className="hero-inner">
            <p className="hero-eyebrow">product designer · illustrator · vibe coder</p>
            <h1 className="hero-title">
              HELLO,
              <br />
              I&apos;M FORTUNE.
            </h1>
            <p className="hero-sub">
              I design software that feels less like <span className="hero-strike">software</span> and more like a
              good conversation. Currently making fintech friendlier at a startup you haven&apos;t heard of yet.
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
              <span className="about-portrait-placeholder">{'// portrait coming soon'}</span>
              <div data-drag data-rot="6" className="about-portrait-tag">
                that&apos;s me!
              </div>
            </div>

            <div className="about-right">
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
                <div className="info-card-label">WHAT I DO</div>
                <div className="pill-row">
                  {WHAT_I_DO.map((item, i) =>
                    item.type === 'sep' ? (
                      <span key={i} className="pill-sep">
                        ✦
                      </span>
                    ) : (
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
                    ),
                  )}
                </div>
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

        {/* PLAY */}
        <section id="play" data-screen-label="Play" className="play-section">
          <h1 data-reveal className="section-title reveal">
            PLAY TIME
          </h1>
          <p data-reveal className="section-sub section-sub--play reveal">
            The internet should be fun. Smash the star as many times as you can in 15 seconds. (Also: try the
            ↑↑↓↓←→←→ B A dance anywhere on the site.)
          </p>

          <div data-stagger className="play-stats-row">
            <div data-reveal className="play-stat reveal-sm">
              <div className="play-stat-label">SCORE</div>
              <div className="play-stat-value">{gameScore}</div>
            </div>
            <div data-reveal className="play-stat reveal-sm">
              <div className="play-stat-label">TIME</div>
              <div className="play-stat-value">{gameTime}s</div>
            </div>
            <div data-reveal className="play-stat play-stat--high reveal-sm">
              <div className="play-stat-label">HIGH SCORE</div>
              <div className="play-stat-value">{gameHigh}</div>
            </div>
          </div>

          <div data-reveal className="arena reveal">
            {gameActive ? (
              <button
                className="arena-target"
                style={{ left: `${targetPos.tx}%`, top: `${targetPos.ty}%` }}
                onClick={hitTarget}
              >
                ✦
              </button>
            ) : (
              <div className="arena-idle">
                <p className="arena-idle-text">
                  last score: {gameScore} · best: {gameHigh}
                </p>
                <button className="btn" onClick={startGame}>
                  start smashing
                </button>
              </div>
            )}
          </div>

          <div data-stagger className="play-extra-grid">
            <div data-reveal className="play-extra-card reveal">
              <div className="play-extra-title">now playing 🎧</div>
              <div className="play-extra-placeholder">{'// embed a playlist'}</div>
            </div>
            <div data-reveal className="play-extra-card reveal">
              <div className="play-extra-title">doodle of the week ✏️</div>
              <div className="play-extra-placeholder">{'// drop a sketch'}</div>
            </div>
            <div data-reveal className="play-extra-card play-extra-card--accent reveal">
              <div className="play-extra-title">unpopular opinion</div>
              <p className="play-extra-text">
                Skeuomorphism was right about some things and I will not be taking questions.
              </p>
            </div>
          </div>
        </section>

        {/* RÉSUMÉ */}
        <section id="resume" data-screen-label="Résumé" className="resume-section">
          <div data-reveal className="resume-header reveal">
            <h1 className="resume-title">RÉSUMÉ</h1>
            <button className="btn-download" onClick={party}>
              download PDF
            </button>
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
            <div className="resume-row-span">2015–2019</div>
            <div>
              <div className="resume-role">BFA, Interaction Design</div>
              <div className="resume-desc">Some Very Good Art School · minor in being annoying about kerning</div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" data-screen-label="Contact" data-stagger className="contact-section">
          <p data-reveal className="contact-eyebrow reveal-sm">
            got a project, a question, or a good meme?
          </p>
          <h1 data-reveal className="contact-title reveal-hero-title">
            LET&apos;S
            <br />
            MAKE
            <br />
            STUFF.
          </h1>
          <a
            href="mailto:hi@fortune.design"
            data-reveal
            className="contact-email reveal-cta"
            onPointerMove={magneticMove}
            onPointerLeave={magneticLeave}
          >
            hi@fortune.design
          </a>
          <div data-reveal className="contact-social-row reveal-cta">
            <a href="#" className="social-link social-link--a2">
              twitter/x ↗
            </a>
            <a href="#" className="social-link social-link--a4">
              read.cv ↗
            </a>
            <a href="#" className="social-link social-link--a3">
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
          <span>© 2026 Fortune · made with too much coffee</span>
          <span>
            psst — click the ✷ five times · {eggFound && <span className="footer-egg">you found it! 🎉</span>}
          </span>
        </footer>
      </div>
    </div>
  );
}
