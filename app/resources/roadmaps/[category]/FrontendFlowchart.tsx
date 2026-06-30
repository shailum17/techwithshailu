'use client';

/* ═══════════════════════════════════════════════════════════════
   FRONTEND ROADMAP — Core path + Optional side branch
   ═══════════════════════════════════════════════════════════════ */

const W  = 1400;
const H  = 4200;
const CX = 440;   // core spine shifted left to give room for optional branch

/* ─── Colours ─────────────────────────────────────────────── */
const LM = '#A8E63D';  // lime  — core path
const PU = '#9B7FE8';  // purple — alternating + optional
const DM = '#F59E0B';  // amber — optional branch header

/* ─── Node type ───────────────────────────────────────────── */
interface N {
  id:string; x:number; y:number; w:number; h:number;
  t:'root'|'phase'|'topic'|'item'|'note'|'opt-header'|'opt-phase'|'opt-topic';
  c:string; l:string;
}
const nd=(id:string,x:number,y:number,w:number,h:number,
          t:N['t'],c:string,l:string):N=>({id,x,y,w,h,t,c,l});

/* ─── Optional branch x-anchor ───────────────────────────── */
const OX = 1090;   // centre of optional branch column — shifted right for more space
const OW = 190;    // half-width of optional panel


/* ═══════════════════════════════════════════════════════════════
   NODES — CORE PATH (left spine)
   ═══════════════════════════════════════════════════════════════ */
const NODES: N[] = [

  /* ROOT */
  nd('root', CX, 18, 280, 50, 'root', LM, 'Frontend Roadmap'),

  /* ── 1 · INTERNET (y=110) ─────────────────────────────── */
  nd('net',         CX,      110, 220, 42, 'phase', LM, 'Internet'),
  nd('net-how',     CX-280,  180, 195, 34, 'topic', LM, 'How does internet work?'),
  nd('net-http',    CX-280,  224, 195, 34, 'topic', LM, 'What is HTTP?'),
  nd('net-dns',     CX-280,  268, 195, 34, 'topic', LM, 'DNS and how it works?'),
  nd('net-domain',  CX+280,  180, 195, 34, 'topic', LM, 'What is Domain Name?'),
  nd('net-host',    CX+280,  224, 195, 34, 'topic', LM, 'What is Hosting?'),
  nd('net-browser', CX+280,  268, 195, 34, 'topic', LM, 'How Browsers Work?'),

  /* ── 2 · HTML (y=370) ─────────────────────────────────── */
  nd('html',      CX,      370, 200, 42, 'phase', LM, 'HTML'),
  nd('html-bas',  CX-260,  440, 170, 34, 'topic', LM, 'Learn the Basics'),
  nd('html-sem',  CX-260,  484, 170, 34, 'topic', LM, 'Semantic HTML'),
  nd('html-frm',  CX-260,  528, 170, 34, 'topic', LM, 'Forms & Validations'),
  nd('html-a11',  CX+260,  440, 170, 34, 'topic', LM, 'Accessibility'),
  nd('html-seo',  CX+260,  484, 170, 34, 'topic', LM, 'SEO Basics'),

  /* ── 3 · CSS (y=620) ──────────────────────────────────── */
  nd('css',       CX,      620, 200, 42, 'phase', PU, 'CSS'),
  nd('css-bas',   CX-260,  690, 170, 34, 'topic', PU, 'Learn the Basics'),
  nd('css-lay',   CX-260,  734, 170, 34, 'topic', PU, 'Making Layouts'),
  nd('css-res',   CX+260,  690, 170, 34, 'topic', PU, 'Responsive Design'),
  nd('css-ani',   CX+260,  734, 170, 34, 'topic', PU, 'Animations & Transitions'),

  /* ── 4 · JAVASCRIPT (y=840) ───────────────────────────── */
  nd('js',        CX,      840, 200, 42, 'phase', LM, 'JavaScript'),
  nd('js-bas',    CX-260,  910, 170, 34, 'topic', LM, 'Learn the Basics'),
  nd('js-dom',    CX-260,  954, 170, 34, 'topic', LM, 'DOM Manipulation'),
  nd('js-fetch',  CX+260,  910, 170, 34, 'topic', LM, 'Fetch API / Ajax'),
  nd('js-es6',    CX+260,  954, 170, 34, 'topic', LM, 'ES6+ Features'),

  /* ── 5 · TYPESCRIPT (y=1060) — moved right after JS ──── */
  nd('ts',        CX,     1060, 200, 42, 'phase', PU, 'TypeScript'),
  nd('ts-types',  CX-260, 1130, 170, 34, 'topic', PU, 'Types & Interfaces'),
  nd('ts-gen',    CX-260, 1174, 170, 34, 'topic', PU, 'Generics'),
  nd('ts-util',   CX+260, 1130, 170, 34, 'topic', PU, 'Utility Types'),
  nd('ts-cfg',    CX+260, 1174, 170, 34, 'topic', PU, 'tsconfig Setup'),

  /* ── 6 · VERSION CONTROL (y=1280) ────────────────────── */
  nd('vcs',       CX,     1280, 240, 42, 'phase', LM, 'Version Control Systems'),
  nd('vcs-git',   CX,     1350, 140, 34, 'topic', LM, 'Git'),
  nd('vcs-gh',    CX-260, 1350, 130, 34, 'topic', LM, 'GitHub'),
  nd('vcs-gl',    CX+240, 1350, 130, 34, 'topic', LM, 'GitLab'),
  nd('vcs-bb',    CX+240, 1394, 130, 34, 'topic', LM, 'Bitbucket'),
  nd('vcs-ci',    CX-260, 1394, 130, 34, 'topic', LM, 'GitHub Actions'),

  /* ── 7 · PACKAGE MANAGERS (y=1490) ───────────────────── */
  nd('pkg',       CX,     1490, 230, 42, 'phase', PU, 'Package Managers'),
  nd('pkg-npm',   CX-240, 1560, 120, 34, 'topic', PU, 'npm'),
  nd('pkg-pnpm',  CX,     1560, 120, 34, 'topic', PU, 'pnpm'),
  nd('pkg-yarn',  CX+240, 1560, 120, 34, 'topic', PU, 'yarn'),


  /* ── 8 · FRAMEWORK (y=1660) ───────────────────────────── */
  nd('fw',          CX,     1660, 220, 42, 'phase', LM, 'Pick a Framework'),
  nd('fw-react',    CX-340, 1730, 128, 34, 'topic', LM, 'React'),
  nd('fw-vue',      CX-170, 1730, 128, 34, 'topic', LM, 'Vue.js'),
  nd('fw-ang',      CX,     1730, 128, 34, 'topic', LM, 'Angular'),
  nd('fw-svelte',   CX+170, 1730, 128, 34, 'topic', LM, 'Svelte'),
  nd('fw-solid',    CX+340, 1730, 128, 34, 'topic', LM, 'Solid JS'),

  /* ── 9 · WRITING CSS + BUILD TOOLS (y=1840) parallel ─── */
  nd('css2',        CX-240, 1840, 190, 42, 'phase', PU, 'Writing CSS'),
  nd('css2-tw',     CX-360, 1910, 145, 34, 'topic', PU, 'Tailwind CSS'),
  nd('css2-bem',    CX-200, 1910, 145, 34, 'topic', PU, 'BEM'),
  nd('css2-pre',    CX-360, 1954, 145, 34, 'topic', PU, 'Sass / PostCSS'),
  nd('css2-mod',    CX-200, 1954, 145, 34, 'topic', PU, 'CSS Modules'),

  nd('build',       CX+190, 1840, 200, 42, 'phase', LM, 'Build Tools'),
  nd('build-vite',  CX+100, 1910, 118, 34, 'topic', LM, 'Vite'),
  nd('build-wp',    CX+234, 1910, 118, 34, 'topic', LM, 'Webpack'),
  nd('build-esb',   CX+100, 1954, 118, 34, 'topic', LM, 'esbuild'),
  nd('build-lint',  CX+234, 1954, 118, 34, 'topic', LM, 'ESLint / Prettier'),

  /* ── 10 · TESTING (y=2060) ────────────────────────────── */
  nd('test',        CX,     2060, 220, 42, 'phase', PU, 'Testing'),
  nd('test-vi',     CX-330, 2130, 130, 34, 'topic', PU, 'Vitest'),
  nd('test-jest',   CX-170, 2130, 130, 34, 'topic', PU, 'Jest'),
  nd('test-play',   CX+20,  2130, 130, 34, 'topic', PU, 'Playwright'),
  nd('test-cy',     CX+190, 2130, 130, 34, 'topic', PU, 'Cypress'),

  /* ── 11 · SECURITY + AUTH (y=2240) parallel ───────────── */
  nd('sec',         CX-250, 2240, 210, 42, 'phase', LM, 'Web Security Basics'),
  nd('sec-cors',    CX-380, 2310, 115, 34, 'topic', LM, 'CORS & HTTPS'),
  nd('sec-csp',     CX-240, 2310, 115, 34, 'topic', LM, 'Content Security Policy'),
  nd('sec-owasp',   CX-380, 2354, 235, 34, 'topic', LM, 'OWASP Top 10 Risks'),

  nd('auth',        CX+190, 2240, 250, 42, 'phase', PU, 'Authentication Strategies'),
  nd('auth-jwt',    CX+90,  2310, 130, 34, 'topic', PU, 'JWT Tokens'),
  nd('auth-oauth',  CX+240, 2310, 130, 34, 'topic', PU, 'OAuth 2.0 / OIDC'),
  nd('auth-sess',   CX+90,  2354, 130, 34, 'topic', PU, 'Session Auth'),
  nd('auth-sso',    CX+240, 2354, 130, 34, 'topic', PU, 'SSO'),

  /* ── 12 · SSR (y=2480) ─────────────────────────────────── */
  nd('ssr',         CX,     2480, 220, 42, 'phase', LM, 'SSR Frameworks'),
  nd('ssr-next',    CX-320, 2550, 138, 34, 'topic', LM, 'Next.js'),
  nd('ssr-nuxt',    CX-160, 2550, 138, 34, 'topic', LM, 'Nuxt.js'),
  nd('ssr-skit',    CX+10,  2550, 138, 34, 'topic', LM, 'SvelteKit'),
  nd('ssr-rr',      CX+180, 2550, 138, 34, 'topic', LM, 'React Router'),

  /* ── 13 · PERFORMANCE (y=2670) ─────────────────────────── */
  nd('perf',        CX,     2670, 280, 42, 'phase', PU, 'Performance Best Practices'),
  nd('perf-prpl',   CX-330, 2740, 148, 34, 'topic', PU, 'PRPL Pattern'),
  nd('perf-rail',   CX-160, 2740, 148, 34, 'topic', PU, 'RAIL Model'),
  nd('perf-cwv',    CX+30,  2740, 148, 34, 'topic', PU, 'Core Web Vitals'),
  nd('perf-lh',     CX+200, 2740, 148, 34, 'topic', PU, 'Lighthouse'),
  nd('perf-split',  CX-160, 2784, 148, 34, 'topic', PU, 'Code Splitting'),
  nd('perf-dt',     CX+30,  2784, 148, 34, 'topic', PU, 'Using DevTools'),

  /* ── 14 · BROWSER APIs + WEB COMPONENTS (y=2910) parallel */
  nd('browser',     CX-240, 2910, 200, 42, 'phase', LM, 'Browser APIs'),
  nd('br-sw',       CX-370, 2980, 150, 34, 'topic', LM, 'Service Workers'),
  nd('br-ws',       CX-200, 2980, 150, 34, 'topic', LM, 'Web Sockets / SSE'),
  nd('br-stor',     CX-370, 3024, 150, 34, 'topic', LM, 'Storage APIs'),
  nd('br-notif',    CX-200, 3024, 150, 34, 'topic', LM, 'Notifications & Push'),

  nd('wc',          CX+200, 2910, 210, 42, 'phase', PU, 'Web Components'),
  nd('wc-ce',       CX+90,  2980, 155, 34, 'topic', PU, 'Custom Elements'),
  nd('wc-sd',       CX+265, 2980, 155, 34, 'topic', PU, 'Shadow DOM'),
  nd('wc-ht',       CX+90,  3024, 155, 34, 'topic', PU, 'HTML Templates'),

  /* ── 15 · CONTINUE LEARNING (y=3140) ──────────────────── */
  nd('cont',        CX,     3140, 300, 50, 'phase', LM, 'Continue Learning'),
  nd('cont-ts',     CX-290, 3220, 148, 38, 'topic', LM, 'TypeScript (deep)'),
  nd('cont-node',   CX,     3220, 148, 38, 'topic', LM, 'Node.js'),
  nd('cont-full',   CX+290, 3220, 148, 38, 'topic', LM, 'Fullstack'),


  /* ═══════════════════════════════════════════════════════════
     OPTIONAL / ADVANCED BRANCH — right side panel
     Entry point: branches off from fw node
     ═══════════════════════════════════════════════════════════ */

  /* Header label */
  nd('opt-hdr',       OX,      1660, 240, 42, 'opt-header', DM, 'Optional / Advanced'),

  /* PWAs  (y=1730) */
  nd('opt-pwa',       OX,      1730, 220, 44, 'opt-phase', DM, 'PWAs'),
  nd('opt-pwa-sw',    OX-150,  1802, 180, 36, 'opt-topic', DM, 'Service Workers'),
  nd('opt-pwa-man',   OX+90,   1802, 180, 36, 'opt-topic', DM, 'Web App Manifest'),
  nd('opt-pwa-off',   OX-150,  1848, 180, 36, 'opt-topic', DM, 'Offline Caching'),
  nd('opt-pwa-push',  OX+90,   1848, 180, 36, 'opt-topic', DM, 'Push Notifications'),

  /* GraphQL  (y=1960) */
  nd('opt-gql',       OX,      1960, 220, 44, 'opt-phase', DM, 'GraphQL'),
  nd('opt-gql-sch',   OX-150,  2032, 180, 36, 'opt-topic', DM, 'Schema & Resolvers'),
  nd('opt-gql-apo',   OX+90,   2032, 180, 36, 'opt-topic', DM, 'Apollo Client'),
  nd('opt-gql-rel',   OX-150,  2078, 180, 36, 'opt-topic', DM, 'Relay Modern'),
  nd('opt-gql-rest',  OX+90,   2078, 180, 36, 'opt-topic', DM, 'REST vs GraphQL'),

  /* Static Site Generators  (y=2190) */
  nd('opt-ssg',       OX,      2190, 260, 44, 'opt-phase', DM, 'Static Site Generators'),
  nd('opt-ssg-next',  OX-150,  2262, 180, 36, 'opt-topic', DM, 'Next.js SSG'),
  nd('opt-ssg-ast',   OX+90,   2262, 180, 36, 'opt-topic', DM, 'Astro'),
  nd('opt-ssg-elev',  OX-150,  2308, 180, 36, 'opt-topic', DM, 'Eleventy'),
  nd('opt-ssg-nuxt',  OX+90,   2308, 180, 36, 'opt-topic', DM, 'Nuxt.js SSG'),
  nd('opt-ssg-vp',    OX-150,  2354, 180, 36, 'opt-topic', DM, 'Vuepress'),

  /* Mobile Apps  (y=2460) */
  nd('opt-mob',       OX,      2460, 220, 44, 'opt-phase', DM, 'Mobile Apps'),
  nd('opt-mob-rn',    OX-150,  2532, 180, 36, 'opt-topic', DM, 'React Native'),
  nd('opt-mob-fl',    OX+90,   2532, 180, 36, 'opt-topic', DM, 'Flutter'),
  nd('opt-mob-ion',   OX-150,  2578, 180, 36, 'opt-topic', DM, 'Ionic'),
  nd('opt-mob-exp',   OX+90,   2578, 180, 36, 'opt-topic', DM, 'Expo'),

  /* Desktop Apps  (y=2690) */
  nd('opt-desk',      OX,      2690, 220, 44, 'opt-phase', DM, 'Desktop Apps'),
  nd('opt-desk-el',   OX-150,  2762, 180, 36, 'opt-topic', DM, 'Electron'),
  nd('opt-desk-tau',  OX+90,   2762, 180, 36, 'opt-topic', DM, 'Tauri'),
  nd('opt-desk-fl',   OX-150,  2808, 180, 36, 'opt-topic', DM, 'Flutter Desktop'),
  nd('opt-desk-nw',   OX+90,   2808, 180, 36, 'opt-topic', DM, 'NW.js'),
];

/* ═══════════════════════════════════════════════════════════════
   EDGES
   ═══════════════════════════════════════════════════════════════ */
const CORE_EDGES: [string,string][] = [
  /* main spine */
  ['root','net'], ['net','html'], ['html','css'], ['css','js'],
  ['js','ts'], ['ts','vcs'], ['vcs','pkg'], ['pkg','fw'],
  ['fw','css2'], ['fw','build'],
  ['css2','test'], ['build','test'],
  ['test','sec'], ['test','auth'],
  ['sec','ssr'], ['auth','ssr'],
  ['ssr','perf'], ['perf','browser'], ['perf','wc'],
  ['browser','cont'], ['wc','cont'],

  /* Internet */
  ['net','net-how'],['net','net-http'],['net','net-dns'],
  ['net','net-domain'],['net','net-host'],['net','net-browser'],
  /* HTML */
  ['html','html-bas'],['html','html-sem'],['html','html-frm'],
  ['html','html-a11'],['html','html-seo'],
  /* CSS */
  ['css','css-bas'],['css','css-lay'],['css','css-res'],['css','css-ani'],
  /* JS */
  ['js','js-bas'],['js','js-dom'],['js','js-fetch'],['js','js-es6'],
  /* TS */
  ['ts','ts-types'],['ts','ts-gen'],['ts','ts-util'],['ts','ts-cfg'],
  /* VCS */
  ['vcs','vcs-git'],['vcs','vcs-gh'],['vcs','vcs-gl'],['vcs','vcs-bb'],['vcs','vcs-ci'],
  /* Pkg */
  ['pkg','pkg-npm'],['pkg','pkg-pnpm'],['pkg','pkg-yarn'],
  /* Framework */
  ['fw','fw-react'],['fw','fw-vue'],['fw','fw-ang'],['fw','fw-svelte'],['fw','fw-solid'],
  /* Writing CSS */
  ['css2','css2-tw'],['css2','css2-bem'],['css2','css2-pre'],['css2','css2-mod'],
  /* Build Tools */
  ['build','build-vite'],['build','build-wp'],['build','build-esb'],['build','build-lint'],
  /* Testing */
  ['test','test-vi'],['test','test-jest'],['test','test-play'],['test','test-cy'],
  /* Security */
  ['sec','sec-cors'],['sec','sec-csp'],['sec','sec-owasp'],
  /* Auth */
  ['auth','auth-jwt'],['auth','auth-oauth'],['auth','auth-sess'],['auth','auth-sso'],
  /* SSR */
  ['ssr','ssr-next'],['ssr','ssr-nuxt'],['ssr','ssr-skit'],['ssr','ssr-rr'],
  /* Performance */
  ['perf','perf-prpl'],['perf','perf-rail'],['perf','perf-cwv'],
  ['perf','perf-lh'],['perf','perf-split'],['perf','perf-dt'],
  /* Browser APIs */
  ['browser','br-sw'],['browser','br-ws'],['browser','br-stor'],['browser','br-notif'],
  /* Web Components */
  ['wc','wc-ce'],['wc','wc-sd'],['wc','wc-ht'],
  /* Continue */
  ['cont','cont-ts'],['cont','cont-node'],['cont','cont-full'],
];

/* dashed optional edges — from fw node to opt-header, then internal */
const OPT_EDGES: [string,string][] = [
  /* entry: framework → optional header */
  ['fw','opt-hdr'],
  /* optional spine */
  ['opt-hdr','opt-pwa'],['opt-pwa','opt-gql'],['opt-gql','opt-ssg'],
  ['opt-ssg','opt-mob'],['opt-mob','opt-desk'],
  /* PWA children */
  ['opt-pwa','opt-pwa-sw'],['opt-pwa','opt-pwa-man'],['opt-pwa','opt-pwa-off'],
  /* GQL children */
  ['opt-gql','opt-gql-sch'],['opt-gql','opt-gql-apo'],['opt-gql','opt-gql-rel'],
  /* SSG children */
  ['opt-ssg','opt-ssg-next'],['opt-ssg','opt-ssg-ast'],['opt-ssg','opt-ssg-elev'],
  ['opt-ssg','opt-ssg-nuxt'],['opt-ssg','opt-ssg-vp'],
  /* Mobile children */
  ['opt-mob','opt-mob-rn'],['opt-mob','opt-mob-fl'],
  ['opt-mob','opt-mob-ion'],['opt-mob','opt-mob-exp'],
  /* Desktop children */
  ['opt-desk','opt-desk-el'],['opt-desk','opt-desk-tau'],['opt-desk','opt-desk-fl'],
];

/* ─── Phase band boundaries [y0, y1, color] ──────────────── */
const BANDS: [number,number,string][] = [
  [92,   360,  LM],  // Internet
  [362,  610,  LM],  // HTML
  [612,  830,  PU],  // CSS
  [832,  1050, LM],  // JS
  [1052, 1270, PU],  // TS
  [1272, 1480, LM],  // VCS
  [1482, 1650, PU],  // Pkg
  [1652, 1830, LM],  // Framework
  [1832, 2050, PU],  // Writing CSS + Build
  [2052, 2230, PU],  // Testing
  [2232, 2470, LM],  // Security + Auth
  [2472, 2660, LM],  // SSR
  [2662, 2900, PU],  // Performance
  [2902, 3130, LM],  // Browser APIs + Web Components
  [3132, 3280, LM],  // Continue
];

/* ─── Bézier path ─────────────────────────────────────────── */
function mkPath(a:N, b:N): string {
  const x1=a.x, y1=a.y+a.h, x2=b.x, y2=b.y;
  if (Math.abs(x1-x2)<6) return `M${x1} ${y1}L${x2} ${y2}`;
  const mY=(y1+y2)/2;
  return `M${x1} ${y1}C${x1} ${mY},${x2} ${mY},${x2} ${y2}`;
}

/* ─── Component ───────────────────────────────────────────── */
export default function FrontendFlowchart() {
  const nMap: Record<string,N> = {};
  NODES.forEach(n => (nMap[n.id]=n));

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{display:'block', width:'100%', height:'auto'}}
      aria-label="Frontend Development Roadmap">

      {/* No background — transparent */}

      {/* Optional branch border outline only — no fill */}
      <rect x={OX-155} y={1640} width={310} height={980}
        rx={12} fill="none"
        stroke={DM} strokeOpacity={0.2} strokeWidth={1} strokeDasharray="6 4"/>

      {/* Phase band separator lines only — no tinted fill */}
      {BANDS.map(([y0,_y1,_c],i)=>(
        <g key={i}/>
      ))}

      {/* Vertical divider removed */}

      {/* Core spine */}
      <line x1={CX} y1={66} x2={CX} y2={3290}
        stroke="#2A2A2A" strokeWidth={1} strokeDasharray="4 8"/>

      {/* Optional column spine */}
      <line x1={OX} y1={1700} x2={OX} y2={2620}
        stroke={DM} strokeWidth={1} strokeOpacity={0.25} strokeDasharray="4 8"/>

      {/* ── Core edges ── */}
      {CORE_EDGES.map(([f,t],i)=>{
        const a=nMap[f], b=nMap[t];
        if(!a||!b) return null;
        const isSpine=(a.t==='root'||a.t==='phase')&&(b.t==='phase'||b.t==='root');
        return (
          <path key={`c${i}`} d={mkPath(a,b)} stroke={a.c}
            strokeWidth={isSpine?2:1.5}
            strokeOpacity={isSpine?0.7:0.4}
            fill="none" strokeLinecap="round"/>
        );
      })}

      {/* ── Optional edges — dashed amber ── */}
      {OPT_EDGES.map(([f,t],i)=>{
        const a=nMap[f], b=nMap[t];
        if(!a||!b) return null;
        const isOptSpine=a.t==='opt-header'||a.t==='opt-phase';
        return (
          <path key={`o${i}`} d={mkPath(a,b)} stroke={DM}
            strokeWidth={isOptSpine?1.8:1.2}
            strokeOpacity={isOptSpine?0.55:0.35}
            strokeDasharray={f==='fw'?'6 4':'none'}
            fill="none" strokeLinecap="round"/>
        );
      })}

      {/* ── Nodes ── */}
      {NODES.map(n=>{
        const lx=n.x-n.w/2;

        if(n.t==='root') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={14} fill={LM}/>
            <text x={n.x} y={n.y+n.h/2} textAnchor="middle" dominantBaseline="central"
              fill="#000" fontSize={17} fontWeight="800" fontFamily="system-ui,sans-serif">
              {n.l}
            </text>
          </g>
        );

        if(n.t==='phase') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={8} fill={n.c}/>
            <text x={n.x} y={n.y+n.h/2} textAnchor="middle" dominantBaseline="central"
              fill="#000" fontSize={12} fontWeight="700" fontFamily="system-ui,sans-serif">
              {n.l}
            </text>
          </g>
        );

        if(n.t==='topic') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={6}
              fill="#111111" stroke={n.c} strokeWidth={1.5}/>
            <text x={n.x} y={n.y+n.h/2} textAnchor="middle" dominantBaseline="central"
              fill={n.c} fontSize={11} fontWeight="600" fontFamily="system-ui,sans-serif">
              {n.l}
            </text>
          </g>
        );

        if(n.t==='item') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={4}
              fill="#111111" stroke="#2A2A2A" strokeWidth={0.8}/>
            <rect x={lx} y={n.y} width={3} height={n.h} rx={1.5} fill={n.c}/>
            <text x={lx+11} y={n.y+n.h/2} dominantBaseline="central"
              fill="#A0A0A0" fontSize={10.5} fontFamily="system-ui,sans-serif">
              {n.l}
            </text>
          </g>
        );

        /* Optional header — amber pill with label */
        if(n.t==='opt-header') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={8}
              fill="#1A1100" stroke={DM} strokeWidth={1.5} strokeDasharray="5 3"/>
            <text x={n.x} y={n.y+n.h/2} textAnchor="middle" dominantBaseline="central"
              fill={DM} fontSize={11} fontWeight="700" fontFamily="system-ui,sans-serif">
              ⚡ {n.l}
            </text>
          </g>
        );

        /* Optional phase — amber outline */
        if(n.t==='opt-phase') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={7}
              fill="#1A1100" stroke={DM} strokeWidth={1.8}/>
            <text x={n.x} y={n.y+n.h/2} textAnchor="middle" dominantBaseline="central"
              fill={DM} fontSize={11} fontWeight="700" fontFamily="system-ui,sans-serif">
              {n.l}
            </text>
          </g>
        );

        /* Optional topic — amber tinted */
        if(n.t==='opt-topic') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={5}
              fill="#111111" stroke={DM} strokeWidth={1} strokeOpacity={0.6}/>
            <text x={n.x} y={n.y+n.h/2} textAnchor="middle" dominantBaseline="central"
              fill={DM} fontSize={10} fontWeight="500" fontFamily="system-ui,sans-serif"
              fillOpacity={0.8}>
              {n.l}
            </text>
          </g>
        );

        if(n.t==='note') return (
          <g key={n.id}>
            <rect x={lx} y={n.y} width={n.w} height={n.h} rx={4}
              fill="#111111" stroke="#2A2A2A" strokeDasharray="4 3" strokeWidth={1}/>
            <text x={n.x} y={n.y+n.h/2} textAnchor="middle" dominantBaseline="central"
              fill="#606060" fontSize={9.5} fontFamily="system-ui,sans-serif">
              {n.l}
            </text>
          </g>
        );

        return null;
      })}

      {/* Legend */}
      <g transform={`translate(${OX-155}, 1596)`}>
        <rect x={0} y={0} width={310} height={36} rx={6}
          fill="#111111" stroke="#2A2A2A" strokeWidth={1}/>
        <rect x={10} y={12} width={12} height={12} rx={2} fill={LM}/>
        <text x={26} y={22} fill="#A0A0A0" fontSize={10} fontFamily="system-ui,sans-serif">
          Core Path
        </text>
        <rect x={110} y={12} width={12} height={12} rx={2} fill="#1A1100" stroke={DM} strokeWidth={1.5}/>
        <text x={126} y={22} fill="#A0A0A0" fontSize={10} fontFamily="system-ui,sans-serif">
          Optional / Advanced (not blocking)
        </text>
      </g>

    </svg>
  );
}
