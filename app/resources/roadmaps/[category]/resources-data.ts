/* ═══════════════════════════════════════════════════════════════
   FREE RESOURCES — mapped to roadmap node IDs
   ═══════════════════════════════════════════════════════════════ */

export interface Link { label: string; url: string }
export interface NodeResources {
  title: string;
  yt: Link[];
  web: Link[];
}

export const RESOURCES: Record<string, NodeResources> = {

  /* ── 1 · INTERNET ──────────────────────────────────────── */
  net: {
    title: 'Internet Basics',
    yt: [
      { label: 'freeCodeCamp — How the Internet Works', url: 'https://www.youtube.com/watch?v=zN8YNNHcaZc' },
      { label: 'Hussein Nasser — Networking deep-dive', url: 'https://www.youtube.com/@hnasr' },
      { label: 'Kunal Kushwaha — How Internet Works', url: 'https://www.youtube.com/watch?v=sMHzfigUxz4' },
    ],
    web: [
      { label: 'MDN — How does the Internet work?', url: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work' },
      { label: 'web.dev — Foundations (by Google)', url: 'https://web.dev/learn' },
      { label: 'howdns.works — interactive explainer', url: 'https://howdns.works' },
    ],
  },
  'net-how': {
    title: 'How does the Internet work?',
    yt: [{ label: 'freeCodeCamp — How the Internet Works', url: 'https://www.youtube.com/watch?v=zN8YNNHcaZc' }],
    web: [{ label: 'MDN — How does the Internet work?', url: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work' }],
  },
  'net-http': {
    title: 'What is HTTP?',
    yt: [{ label: 'Hussein Nasser — HTTP deep-dive', url: 'https://www.youtube.com/@hnasr' }],
    web: [
      { label: 'MDN — HTTP overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
      { label: 'web.dev — Foundations', url: 'https://web.dev/learn' },
    ],
  },
  'net-dns': {
    title: 'DNS and how it works',
    yt: [{ label: 'Kunal Kushwaha — How Internet Works', url: 'https://www.youtube.com/watch?v=sMHzfigUxz4' }],
    web: [{ label: 'howdns.works — interactive comic', url: 'https://howdns.works' }],
  },
  'net-domain': {
    title: 'Domain Names',
    yt: [{ label: 'freeCodeCamp — How the Internet Works', url: 'https://www.youtube.com/watch?v=zN8YNNHcaZc' }],
    web: [{ label: 'MDN — What is a domain name?', url: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_domain_name' }],
  },
  'net-host': {
    title: 'Web Hosting',
    yt: [{ label: 'freeCodeCamp — How the Internet Works', url: 'https://www.youtube.com/watch?v=zN8YNNHcaZc' }],
    web: [{ label: 'MDN — What is a web server?', url: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_web_server' }],
  },
  'net-browser': {
    title: 'How Browsers Work',
    yt: [{ label: 'Hussein Nasser — Browser internals', url: 'https://www.youtube.com/@hnasr' }],
    web: [
      { label: "web.dev — Inside look at modern browsers", url: 'https://developer.chrome.com/blog/inside-browser-part1' },
      { label: 'MDN — How browsers work', url: 'https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work' },
    ],
  },

  /* ── 2 · HTML ──────────────────────────────────────────── */
  html: {
    title: 'HTML',
    yt: [
      { label: 'freeCodeCamp — HTML Full Course', url: 'https://www.youtube.com/watch?v=kUMe1FH4CHE' },
      { label: 'Traversy Media — HTML Crash Course', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE' },
      { label: 'Kevin Powell — Accessibility & semantic HTML', url: 'https://www.youtube.com/@KevinPowell' },
    ],
    web: [
      { label: 'MDN Web Docs — HTML Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
      { label: 'W3Schools — HTML Tutorial', url: 'https://www.w3schools.com/html' },
      { label: 'web.dev/learn/html', url: 'https://web.dev/learn/html' },
    ],
  },
  'html-bas': {
    title: 'HTML Basics',
    yt: [{ label: 'Traversy Media — HTML Crash Course', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE' }],
    web: [{ label: 'MDN — HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics' }],
  },
  'html-sem': {
    title: 'Semantic HTML',
    yt: [{ label: 'Kevin Powell — Semantic HTML', url: 'https://www.youtube.com/@KevinPowell' }],
    web: [{ label: 'MDN — Semantics in HTML', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html' }],
  },
  'html-frm': {
    title: 'Forms & Validations',
    yt: [{ label: 'freeCodeCamp — HTML Full Course', url: 'https://www.youtube.com/watch?v=kUMe1FH4CHE' }],
    web: [{ label: 'MDN — Web forms', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms' }],
  },
  'html-a11': {
    title: 'Accessibility (a11y)',
    yt: [{ label: 'Kevin Powell — Accessibility playlist', url: 'https://www.youtube.com/@KevinPowell' }],
    web: [
      { label: 'web.dev/learn/accessibility', url: 'https://web.dev/learn/accessibility' },
      { label: 'MDN — Accessibility', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility' },
    ],
  },
  'html-seo': {
    title: 'SEO Basics',
    yt: [{ label: 'freeCodeCamp — SEO Tutorial', url: 'https://www.youtube.com/watch?v=-B58GgsehKQ' }],
    web: [
      { label: "Google's SEO Starter Guide", url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' },
      { label: 'web.dev — Discoverable', url: 'https://web.dev/discoverable' },
    ],
  },

  /* ── 3 · CSS ───────────────────────────────────────────── */
  css: {
    title: 'CSS',
    yt: [
      { label: 'Kevin Powell — Best free CSS teacher (full channel)', url: 'https://www.youtube.com/@KevinPowell' },
      { label: 'freeCodeCamp — CSS Full Course', url: 'https://www.youtube.com/watch?v=OXGznpKZ_sA' },
      { label: 'Traversy Media — CSS Crash Course', url: 'https://www.youtube.com/watch?v=yfoY53QXEnI' },
    ],
    web: [
      { label: 'MDN Web Docs — CSS Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
      { label: 'CSS-Tricks', url: 'https://css-tricks.com' },
      { label: 'web.dev/learn/css', url: 'https://web.dev/learn/css' },
      { label: "Josh W Comeau's blog — CSS deep-dives", url: 'https://www.joshwcomeau.com' },
    ],
  },
  'css-bas': {
    title: 'CSS Basics',
    yt: [{ label: 'Kevin Powell — CSS full channel', url: 'https://www.youtube.com/@KevinPowell' }],
    web: [{ label: 'web.dev/learn/css', url: 'https://web.dev/learn/css' }],
  },
  'css-lay': {
    title: 'CSS Layouts (Flexbox & Grid)',
    yt: [{ label: 'Kevin Powell — Flexbox & Grid', url: 'https://www.youtube.com/@KevinPowell' }],
    web: [
      { label: 'CSS-Tricks — Flexbox guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox' },
      { label: 'CSS-Tricks — Grid guide', url: 'https://css-tricks.com/snippets/css/complete-guide-grid' },
    ],
  },
  'css-res': {
    title: 'Responsive Design',
    yt: [{ label: 'Kevin Powell — Responsive CSS', url: 'https://www.youtube.com/@KevinPowell' }],
    web: [{ label: 'MDN — Responsive design', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design' }],
  },
  'css-ani': {
    title: 'Animations & Transitions',
    yt: [{ label: 'Kevin Powell — CSS animations', url: 'https://www.youtube.com/@KevinPowell' }],
    web: [
      { label: 'MDN — CSS animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations' },
      { label: 'web.dev — Animations guide', url: 'https://web.dev/animations-guide' },
    ],
  },

  /* ── 4 · JAVASCRIPT ────────────────────────────────────── */
  js: {
    title: 'JavaScript',
    yt: [
      { label: 'Namaste JavaScript — Akshay Saini (best for deep concepts)', url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP' },
      { label: 'freeCodeCamp — JavaScript Full Course', url: 'https://www.youtube.com/watch?v=jS4aFq5-91M' },
      { label: 'The Net Ninja — Modern JavaScript playlist', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9haFPT7J25Q9GRB_ZkFrMaS' },
      { label: 'Traversy Media — JS Crash Course', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c' },
    ],
    web: [
      { label: 'javascript.info — best free JS text book', url: 'https://javascript.info' },
      { label: 'MDN — JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
      { label: 'Eloquent JavaScript (free book)', url: 'https://eloquentjavascript.net' },
    ],
  },
  'js-bas': {
    title: 'JavaScript Basics',
    yt: [{ label: 'Namaste JavaScript — Akshay Saini', url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP' }],
    web: [{ label: 'javascript.info', url: 'https://javascript.info' }],
  },
  'js-dom': {
    title: 'DOM Manipulation',
    yt: [{ label: 'Traversy Media — JS DOM Crash Course', url: 'https://www.youtube.com/watch?v=0ik6X4DJKCc' }],
    web: [{ label: 'MDN — DOM introduction', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction' }],
  },
  'js-fetch': {
    title: 'Fetch API / Ajax',
    yt: [{ label: 'Traversy Media — Fetch API crash course', url: 'https://www.youtube.com/watch?v=Oive66jrwBs' }],
    web: [
      { label: 'MDN — Using Fetch', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch' },
      { label: 'javascript.info — Fetch', url: 'https://javascript.info/fetch' },
    ],
  },
  'js-es6': {
    title: 'ES6+ Features',
    yt: [{ label: 'Net Ninja — ES6 playlist', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gKfw25slm4CUDUcM_sXdml' }],
    web: [{ label: 'javascript.info — Modern JS', url: 'https://javascript.info' }],
  },

  /* ── 5 · TYPESCRIPT ────────────────────────────────────── */
  ts: {
    title: 'TypeScript',
    yt: [
      { label: 'Net Ninja — TypeScript Tutorial playlist', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI' },
      { label: 'Traversy Media — TypeScript Crash Course', url: 'https://www.youtube.com/watch?v=BCg4U1FzODs' },
      { label: 'Matt Pocock — Total TypeScript free content', url: 'https://www.youtube.com/@mattpocockuk' },
    ],
    web: [
      { label: 'TypeScript official docs', url: 'https://www.typescriptlang.org/docs' },
      { label: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
      { label: 'Total TypeScript free tips', url: 'https://www.totaltypescript.com' },
    ],
  },
  'ts-types': {
    title: 'Types & Interfaces',
    yt: [{ label: 'Net Ninja — TypeScript playlist', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI' }],
    web: [{ label: 'TS Handbook — Interfaces', url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html' }],
  },
  'ts-gen': {
    title: 'Generics',
    yt: [{ label: 'Matt Pocock — Generics', url: 'https://www.youtube.com/@mattpocockuk' }],
    web: [{ label: 'TS Handbook — Generics', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' }],
  },
  'ts-util': {
    title: 'Utility Types',
    yt: [{ label: 'Matt Pocock — Utility Types', url: 'https://www.youtube.com/@mattpocockuk' }],
    web: [{ label: 'TS Handbook — Utility Types', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' }],
  },
  'ts-cfg': {
    title: 'tsconfig Setup',
    yt: [{ label: 'Traversy Media — TypeScript Crash Course', url: 'https://www.youtube.com/watch?v=BCg4U1FzODs' }],
    web: [{ label: 'TS docs — tsconfig reference', url: 'https://www.typescriptlang.org/tsconfig' }],
  },

  /* ── 6 · VERSION CONTROL ───────────────────────────────── */
  vcs: {
    title: 'Version Control (Git / GitHub)',
    yt: [
      { label: 'freeCodeCamp — Git and GitHub for Beginners', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { label: 'Programming with Mosh — Git Tutorial', url: 'https://www.youtube.com/watch?v=8JJ101D3knE' },
      { label: 'CodeWithHarry — Git & GitHub Hindi', url: 'https://www.youtube.com/watch?v=gwWKnnCMQ5c' },
    ],
    web: [
      { label: 'Pro Git book (free)', url: 'https://git-scm.com/book' },
      { label: 'GitHub Docs', url: 'https://docs.github.com' },
      { label: 'Atlassian Git Tutorials', url: 'https://www.atlassian.com/git/tutorials' },
      { label: 'learngitbranching.js.org (interactive)', url: 'https://learngitbranching.js.org' },
    ],
  },
  'vcs-git':  { title: 'Git', yt: [{ label: 'Programming with Mosh — Git Tutorial', url: 'https://www.youtube.com/watch?v=8JJ101D3knE' }], web: [{ label: 'Pro Git book', url: 'https://git-scm.com/book' }, { label: 'learngitbranching.js.org', url: 'https://learngitbranching.js.org' }] },
  'vcs-gh':   { title: 'GitHub', yt: [{ label: 'freeCodeCamp — Git & GitHub', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' }], web: [{ label: 'GitHub Docs', url: 'https://docs.github.com' }] },
  'vcs-gl':   { title: 'GitLab', yt: [], web: [{ label: 'GitLab Docs', url: 'https://docs.gitlab.com' }] },
  'vcs-bb':   { title: 'Bitbucket', yt: [], web: [{ label: 'Atlassian Git Tutorials', url: 'https://www.atlassian.com/git/tutorials' }] },
  'vcs-ci':   { title: 'GitHub Actions', yt: [{ label: 'freeCodeCamp — GitHub Actions', url: 'https://www.youtube.com/watch?v=R8_veQiYBjI' }], web: [{ label: 'GitHub Actions docs', url: 'https://docs.github.com/en/actions' }] },

  /* ── 7 · PACKAGE MANAGERS ──────────────────────────────── */
  pkg: {
    title: 'Package Managers',
    yt: [
      { label: 'Fireship — npm in 100 seconds', url: 'https://www.youtube.com/watch?v=P3aKRdUyr0s' },
      { label: 'Traversy Media — npm Crash Course', url: 'https://www.youtube.com/watch?v=jHDhaSSKmB0' },
    ],
    web: [
      { label: 'docs.npmjs.com', url: 'https://docs.npmjs.com' },
      { label: 'pnpm.io/motivation', url: 'https://pnpm.io/motivation' },
      { label: 'yarnpkg.com/getting-started', url: 'https://yarnpkg.com/getting-started' },
    ],
  },
  'pkg-npm':  { title: 'npm', yt: [{ label: 'Traversy Media — npm Crash Course', url: 'https://www.youtube.com/watch?v=jHDhaSSKmB0' }], web: [{ label: 'docs.npmjs.com', url: 'https://docs.npmjs.com' }] },
  'pkg-pnpm': { title: 'pnpm', yt: [{ label: 'Fireship — pnpm explainer', url: 'https://www.youtube.com/watch?v=P3aKRdUyr0s' }], web: [{ label: 'pnpm.io', url: 'https://pnpm.io' }] },
  'pkg-yarn': { title: 'yarn', yt: [], web: [{ label: 'yarnpkg.com', url: 'https://yarnpkg.com' }] },

  /* ── 8 · FRAMEWORKS ────────────────────────────────────── */
  fw: {
    title: 'Pick a Framework',
    yt: [
      { label: 'freeCodeCamp — React Course', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
      { label: 'Fireship — Framework comparisons', url: 'https://www.youtube.com/@Fireship' },
    ],
    web: [
      { label: 'react.dev (official)', url: 'https://react.dev' },
      { label: 'vuejs.org/guide', url: 'https://vuejs.org/guide/introduction.html' },
      { label: 'angular.dev/tutorials', url: 'https://angular.dev/tutorials' },
    ],
  },
  'fw-react':  { title: 'React', yt: [{ label: 'freeCodeCamp — React Course', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' }, { label: 'Codevolution — React playlist', url: 'https://www.youtube.com/@Codevolution' }], web: [{ label: 'react.dev', url: 'https://react.dev' }] },
  'fw-vue':    { title: 'Vue.js', yt: [{ label: 'Net Ninja — Vue 3 playlist', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9hYYGbV60Vq3IXYNfDk8At1' }], web: [{ label: 'vuejs.org/guide', url: 'https://vuejs.org/guide/introduction.html' }] },
  'fw-ang':    { title: 'Angular', yt: [{ label: 'freeCodeCamp — Angular Course', url: 'https://www.youtube.com/watch?v=3qBXWUpoPHo' }], web: [{ label: 'angular.dev/tutorials', url: 'https://angular.dev/tutorials' }] },
  'fw-svelte': { title: 'Svelte', yt: [{ label: 'Net Ninja — Svelte playlist', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9hlbrVO_2QFVqVPhlZmz7tO' }], web: [{ label: 'svelte.dev/tutorial', url: 'https://svelte.dev/tutorial' }] },
  'fw-solid':  { title: 'Solid JS', yt: [{ label: 'Fireship — Solid JS crash course', url: 'https://www.youtube.com/watch?v=hw3Bx5vxKl0' }], web: [{ label: 'solidjs.com/guides', url: 'https://www.solidjs.com/guides/getting-started' }] },

  /* ── 9 · WRITING CSS ───────────────────────────────────── */
  css2: {
    title: 'Writing CSS (Tailwind, BEM, Sass, Modules)',
    yt: [
      { label: 'Tailwind Labs — official channel', url: 'https://www.youtube.com/@TailwindLabs' },
      { label: 'Kevin Powell — Sass playlist', url: 'https://www.youtube.com/@KevinPowell' },
      { label: 'Traversy Media — Tailwind Crash Course', url: 'https://www.youtube.com/watch?v=dFgzHOX84xQ' },
    ],
    web: [
      { label: 'tailwindcss.com/docs', url: 'https://tailwindcss.com/docs' },
      { label: 'sass-lang.com/guide', url: 'https://sass-lang.com/guide' },
      { label: 'getbem.com — BEM methodology', url: 'https://getbem.com' },
    ],
  },
  'css2-tw':  { title: 'Tailwind CSS', yt: [{ label: 'Tailwind Labs — official channel', url: 'https://www.youtube.com/@TailwindLabs' }], web: [{ label: 'tailwindcss.com/docs', url: 'https://tailwindcss.com/docs' }] },
  'css2-bem': { title: 'BEM', yt: [], web: [{ label: 'getbem.com', url: 'https://getbem.com' }] },
  'css2-pre': { title: 'Sass / PostCSS', yt: [{ label: 'Kevin Powell — Sass playlist', url: 'https://www.youtube.com/@KevinPowell' }], web: [{ label: 'sass-lang.com/guide', url: 'https://sass-lang.com/guide' }] },
  'css2-mod': { title: 'CSS Modules', yt: [], web: [{ label: 'CSS Modules GitHub', url: 'https://github.com/css-modules/css-modules' }] },

  /* ── 10 · BUILD TOOLS ──────────────────────────────────── */
  build: {
    title: 'Build Tools',
    yt: [
      { label: 'Fireship — Vite in 100 seconds', url: 'https://www.youtube.com/watch?v=KCrXgy8qtjM' },
      { label: 'Traversy Media — Webpack Crash Course', url: 'https://www.youtube.com/watch?v=IZGNcSuwBZs' },
    ],
    web: [
      { label: 'vitejs.dev/guide', url: 'https://vitejs.dev/guide' },
      { label: 'webpack.js.org/concepts', url: 'https://webpack.js.org/concepts' },
      { label: 'esbuild.github.io', url: 'https://esbuild.github.io' },
    ],
  },
  'build-vite': { title: 'Vite', yt: [{ label: 'Fireship — Vite in 100 seconds', url: 'https://www.youtube.com/watch?v=KCrXgy8qtjM' }], web: [{ label: 'vitejs.dev/guide', url: 'https://vitejs.dev/guide' }] },
  'build-wp':   { title: 'Webpack', yt: [{ label: 'Traversy Media — Webpack Crash Course', url: 'https://www.youtube.com/watch?v=IZGNcSuwBZs' }], web: [{ label: 'webpack.js.org/concepts', url: 'https://webpack.js.org/concepts' }] },
  'build-esb':  { title: 'esbuild', yt: [], web: [{ label: 'esbuild.github.io', url: 'https://esbuild.github.io' }] },
  'build-lint': { title: 'ESLint / Prettier', yt: [], web: [{ label: 'eslint.org/docs', url: 'https://eslint.org/docs/latest' }, { label: 'prettier.io/docs', url: 'https://prettier.io/docs/en' }] },

  /* ── 11 · TESTING ──────────────────────────────────────── */
  test: {
    title: 'Testing',
    yt: [
      { label: 'freeCodeCamp — Jest Testing Crash Course', url: 'https://www.youtube.com/watch?v=ajiAl5UNzBU' },
      { label: 'Playwright — official tutorials', url: 'https://www.youtube.com/@Playwrightdev' },
      { label: 'Cypress — official channel', url: 'https://www.youtube.com/@Cypressio' },
    ],
    web: [
      { label: 'vitest.dev/guide', url: 'https://vitest.dev/guide' },
      { label: 'jestjs.io/docs', url: 'https://jestjs.io/docs/getting-started' },
      { label: 'playwright.dev/docs/intro', url: 'https://playwright.dev/docs/intro' },
      { label: 'docs.cypress.io', url: 'https://docs.cypress.io' },
    ],
  },
  'test-vi':   { title: 'Vitest', yt: [], web: [{ label: 'vitest.dev/guide', url: 'https://vitest.dev/guide' }] },
  'test-jest': { title: 'Jest', yt: [{ label: 'freeCodeCamp — Jest Testing', url: 'https://www.youtube.com/watch?v=ajiAl5UNzBU' }], web: [{ label: 'jestjs.io/docs', url: 'https://jestjs.io/docs/getting-started' }] },
  'test-play': { title: 'Playwright', yt: [{ label: 'Playwright official', url: 'https://www.youtube.com/@Playwrightdev' }], web: [{ label: 'playwright.dev/docs/intro', url: 'https://playwright.dev/docs/intro' }] },
  'test-cy':   { title: 'Cypress', yt: [{ label: 'Cypress official channel', url: 'https://www.youtube.com/@Cypressio' }], web: [{ label: 'docs.cypress.io', url: 'https://docs.cypress.io' }] },

  /* ── 12 · SECURITY ─────────────────────────────────────── */
  sec: {
    title: 'Web Security Basics',
    yt: [
      { label: 'Traversy Media — CORS Explained', url: 'https://www.youtube.com/watch?v=PNtFSVU-YTI' },
      { label: 'Fireship — HTTPS in 100 seconds', url: 'https://www.youtube.com/watch?v=j9QmMEWmcfo' },
    ],
    web: [
      { label: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten' },
      { label: 'MDN — CORS', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' },
      { label: 'web.dev/secure', url: 'https://web.dev/secure' },
    ],
  },
  'sec-cors':  { title: 'CORS & HTTPS', yt: [{ label: 'Traversy Media — CORS', url: 'https://www.youtube.com/watch?v=PNtFSVU-YTI' }], web: [{ label: 'MDN — CORS', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' }] },
  'sec-csp':   { title: 'Content Security Policy', yt: [], web: [{ label: 'MDN — CSP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' }] },
  'sec-owasp': { title: 'OWASP Top 10', yt: [], web: [{ label: 'owasp.org/www-project-top-ten', url: 'https://owasp.org/www-project-top-ten' }] },

  /* ── 13 · AUTH ─────────────────────────────────────────── */
  auth: {
    title: 'Authentication Strategies',
    yt: [
      { label: 'Web Dev Simplified — JWT & OAuth', url: 'https://www.youtube.com/watch?v=7Q17ubqLfaM' },
      { label: 'Fireship — OAuth 2.0 in 100 seconds', url: 'https://www.youtube.com/watch?v=KT8ybowdyr0' },
    ],
    web: [
      { label: 'jwt.io/introduction', url: 'https://jwt.io/introduction' },
      { label: 'oauth.net/2', url: 'https://oauth.net/2' },
      { label: 'auth0.com/blog (free articles)', url: 'https://auth0.com/blog' },
    ],
  },
  'auth-jwt':   { title: 'JWT Tokens', yt: [{ label: 'Web Dev Simplified — JWT', url: 'https://www.youtube.com/watch?v=7Q17ubqLfaM' }], web: [{ label: 'jwt.io/introduction', url: 'https://jwt.io/introduction' }] },
  'auth-oauth': { title: 'OAuth 2.0 / OIDC', yt: [{ label: 'Fireship — OAuth 2.0', url: 'https://www.youtube.com/watch?v=KT8ybowdyr0' }], web: [{ label: 'oauth.net/2', url: 'https://oauth.net/2' }] },
  'auth-sess':  { title: 'Session Auth', yt: [], web: [{ label: 'MDN — HTTP Cookies', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies' }] },
  'auth-sso':   { title: 'SSO', yt: [], web: [{ label: 'auth0.com/blog', url: 'https://auth0.com/blog' }] },

  /* ── 14 · SSR ──────────────────────────────────────────── */
  ssr: {
    title: 'SSR Frameworks',
    yt: [
      { label: 'freeCodeCamp — Next.js Full Course', url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk' },
      { label: 'Net Ninja — Nuxt.js playlist', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9haQlqdCQyYmL_27TesCGPC' },
    ],
    web: [
      { label: 'nextjs.org/learn', url: 'https://nextjs.org/learn' },
      { label: 'nuxt.com/docs', url: 'https://nuxt.com/docs' },
      { label: 'kit.svelte.dev/docs', url: 'https://kit.svelte.dev/docs' },
      { label: 'reactrouter.com/en/main', url: 'https://reactrouter.com/en/main' },
    ],
  },
  'ssr-next': { title: 'Next.js', yt: [{ label: 'freeCodeCamp — Next.js Full Course', url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk' }], web: [{ label: 'nextjs.org/learn', url: 'https://nextjs.org/learn' }] },
  'ssr-nuxt': { title: 'Nuxt.js', yt: [{ label: 'Net Ninja — Nuxt.js', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9haQlqdCQyYmL_27TesCGPC' }], web: [{ label: 'nuxt.com/docs', url: 'https://nuxt.com/docs' }] },
  'ssr-skit': { title: 'SvelteKit', yt: [], web: [{ label: 'kit.svelte.dev/docs', url: 'https://kit.svelte.dev/docs' }] },
  'ssr-rr':   { title: 'React Router', yt: [], web: [{ label: 'reactrouter.com/en/main', url: 'https://reactrouter.com/en/main' }] },

  /* ── 15 · PERFORMANCE ──────────────────────────────────── */
  perf: {
    title: 'Performance Best Practices',
    yt: [
      { label: 'Google Chrome Developers — Web Vitals', url: 'https://www.youtube.com/@ChromeDevs' },
      { label: 'Fireship — Lighthouse in 100 seconds', url: 'https://www.youtube.com/watch?v=NoRYn6gOtVo' },
    ],
    web: [
      { label: 'web.dev/vitals', url: 'https://web.dev/vitals' },
      { label: 'web.dev/fast', url: 'https://web.dev/fast' },
      { label: 'developer.chrome.com/docs/lighthouse', url: 'https://developer.chrome.com/docs/lighthouse' },
    ],
  },
  'perf-prpl':  { title: 'PRPL Pattern', yt: [], web: [{ label: 'web.dev — PRPL Pattern', url: 'https://web.dev/apply-instant-loading-with-prpl' }] },
  'perf-rail':  { title: 'RAIL Model', yt: [], web: [{ label: 'web.dev — RAIL Model', url: 'https://web.dev/rail' }] },
  'perf-cwv':   { title: 'Core Web Vitals', yt: [{ label: 'Google Chrome Devs — Web Vitals', url: 'https://www.youtube.com/@ChromeDevs' }], web: [{ label: 'web.dev/vitals', url: 'https://web.dev/vitals' }] },
  'perf-lh':    { title: 'Lighthouse', yt: [{ label: 'Fireship — Lighthouse', url: 'https://www.youtube.com/watch?v=NoRYn6gOtVo' }], web: [{ label: 'developer.chrome.com/docs/lighthouse', url: 'https://developer.chrome.com/docs/lighthouse' }] },
  'perf-split': { title: 'Code Splitting', yt: [], web: [{ label: 'web.dev — Code splitting', url: 'https://web.dev/code-splitting-suspense' }] },
  'perf-dt':    { title: 'Using DevTools', yt: [], web: [{ label: 'developer.chrome.com/docs/devtools', url: 'https://developer.chrome.com/docs/devtools' }] },

  /* ── 16 · BROWSER APIS ─────────────────────────────────── */
  browser: {
    title: 'Browser APIs',
    yt: [
      { label: 'Fireship — Service Workers in 100 seconds', url: 'https://www.youtube.com/watch?v=ksXwaWHCW6k' },
      { label: 'Net Ninja — Web APIs playlist', url: 'https://www.youtube.com/@NetNinja' },
    ],
    web: [
      { label: 'MDN — Web APIs', url: 'https://developer.mozilla.org/en-US/docs/Web/API' },
      { label: 'web.dev — Service worker lifecycle', url: 'https://web.dev/service-worker-lifecycle' },
      { label: 'web.dev — Storage for the web', url: 'https://web.dev/storage-for-the-web' },
    ],
  },
  'br-sw':    { title: 'Service Workers', yt: [{ label: 'Fireship — Service Workers', url: 'https://www.youtube.com/watch?v=ksXwaWHCW6k' }], web: [{ label: 'web.dev — Service worker lifecycle', url: 'https://web.dev/service-worker-lifecycle' }] },
  'br-ws':    { title: 'WebSockets / SSE', yt: [], web: [{ label: 'MDN — WebSockets', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' }] },
  'br-stor':  { title: 'Storage APIs', yt: [], web: [{ label: 'web.dev — Storage for the web', url: 'https://web.dev/storage-for-the-web' }] },
  'br-notif': { title: 'Notifications & Push', yt: [], web: [{ label: 'MDN — Notifications API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API' }] },

  /* ── 17 · WEB COMPONENTS ───────────────────────────────── */
  wc: {
    title: 'Web Components',
    yt: [
      { label: 'Fireship — Web Components in 100 seconds', url: 'https://www.youtube.com/watch?v=PCWaFLy3VUo' },
      { label: 'Google Chrome Devs — Web Components playlist', url: 'https://www.youtube.com/@ChromeDevs' },
    ],
    web: [
      { label: 'web.dev/custom-elements-v1', url: 'https://web.dev/custom-elements-v1' },
      { label: 'webcomponents.org/introduction', url: 'https://www.webcomponents.org/introduction' },
      { label: 'MDN — Web Components', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components' },
    ],
  },
  'wc-ce': { title: 'Custom Elements', yt: [{ label: 'Fireship — Web Components', url: 'https://www.youtube.com/watch?v=PCWaFLy3VUo' }], web: [{ label: 'web.dev/custom-elements-v1', url: 'https://web.dev/custom-elements-v1' }] },
  'wc-sd': { title: 'Shadow DOM', yt: [], web: [{ label: 'MDN — Shadow DOM', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM' }] },
  'wc-ht': { title: 'HTML Templates', yt: [], web: [{ label: 'MDN — <template> element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template' }] },

  /* ── 18 · CONTINUE LEARNING ────────────────────────────── */
  cont: {
    title: 'Continue Learning',
    yt: [
      { label: 'freeCodeCamp — Node.js Full Course', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE' },
      { label: 'Matt Pocock — Advanced TypeScript free series', url: 'https://www.youtube.com/@mattpocockuk' },
      { label: 'CodeWithHarry — Fullstack Hindi playlist', url: 'https://www.youtube.com/@CodeWithHarry' },
    ],
    web: [
      { label: 'nodejs.org/en/learn', url: 'https://nodejs.org/en/learn' },
      { label: 'TS Handbook — advanced sections', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
      { label: 'fullstackopen.com (free fullstack course)', url: 'https://fullstackopen.com' },
    ],
  },
  'cont-ts':   { title: 'TypeScript (deep)', yt: [{ label: 'Matt Pocock — Advanced TypeScript', url: 'https://www.youtube.com/@mattpocockuk' }], web: [{ label: 'totaltypescript.com', url: 'https://www.totaltypescript.com' }] },
  'cont-node': { title: 'Node.js', yt: [{ label: 'freeCodeCamp — Node.js Full Course', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE' }], web: [{ label: 'nodejs.org/en/learn', url: 'https://nodejs.org/en/learn' }] },
  'cont-full': { title: 'Fullstack', yt: [{ label: 'CodeWithHarry — Fullstack Hindi', url: 'https://www.youtube.com/@CodeWithHarry' }], web: [{ label: 'fullstackopen.com', url: 'https://fullstackopen.com' }] },
};

/* ═══════════════════════════════════════════════════════════════
   OPTIONAL / ADVANCED TOPICS
   ═══════════════════════════════════════════════════════════════ */

// ── PWA ────────────────────────────────────────────────────────
// opt-hdr maps to the whole optional section header
Object.assign(RESOURCES, {

  'opt-hdr': {
    title: 'Advanced Topics',
    yt: [
      { label: 'Google Chrome Developers — PWA full course', url: 'https://www.youtube.com/@ChromeDevs' },
      { label: 'Fireship — PWA in 100 seconds', url: 'https://www.youtube.com/watch?v=sFsRylCQblw' },
      { label: 'freeCodeCamp — GraphQL Full Course', url: 'https://www.youtube.com/watch?v=ed8SzALpx1Q' },
      { label: 'freeCodeCamp — React Native Full Course', url: 'https://www.youtube.com/watch?v=obH0Po_RdWk' },
      { label: 'Traversy Media — Electron Crash Course', url: 'https://www.youtube.com/watch?v=ML743nrkMHw' },
    ],
    web: [
      { label: 'web.dev/learn/pwa', url: 'https://web.dev/learn/pwa' },
      { label: 'graphql.org/learn', url: 'https://graphql.org/learn' },
      { label: 'reactnative.dev/docs/getting-started', url: 'https://reactnative.dev/docs/getting-started' },
      { label: 'electronjs.org/docs/latest', url: 'https://www.electronjs.org/docs/latest' },
      { label: 'roadmap.sh — the OG roadmap + free guides', url: 'https://roadmap.sh' },
    ],
  },

  // ── PWA phase ─────────────────────────────────────────────────
  'opt-pwa': {
    title: 'PWAs',
    yt: [
      { label: 'Google Chrome Developers — PWA full course', url: 'https://www.youtube.com/@ChromeDevs' },
      { label: 'Fireship — PWA in 100 seconds', url: 'https://www.youtube.com/watch?v=sFsRylCQblw' },
    ],
    web: [
      { label: 'web.dev/learn/pwa', url: 'https://web.dev/learn/pwa' },
      { label: 'MDN — Service Worker API & Offline guide', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API' },
    ],
  },
  'opt-pwa-sw': {
    title: 'PWA — Service Workers',
    yt: [
      { label: 'Google Chrome Developers — PWA full course', url: 'https://www.youtube.com/@ChromeDevs' },
      { label: 'Fireship — Service Workers in 100 seconds', url: 'https://www.youtube.com/watch?v=ksXwaWHCW6k' },
    ],
    web: [
      { label: 'MDN — Service Worker API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API' },
      { label: 'web.dev — Service worker lifecycle', url: 'https://web.dev/service-worker-lifecycle' },
    ],
  },
  'opt-pwa-man': {
    title: 'Web App Manifest',
    yt: [{ label: 'Fireship — PWA in 100 seconds', url: 'https://www.youtube.com/watch?v=sFsRylCQblw' }],
    web: [
      { label: 'MDN — Web App Manifest', url: 'https://developer.mozilla.org/en-US/docs/Web/Manifest' },
      { label: 'web.dev — Add a web app manifest', url: 'https://web.dev/add-manifest' },
    ],
  },
  'opt-pwa-off': {
    title: 'Offline Caching',
    yt: [{ label: 'Google Chrome Developers — Offline & caching', url: 'https://www.youtube.com/@ChromeDevs' }],
    web: [
      { label: 'web.dev/learn/pwa', url: 'https://web.dev/learn/pwa' },
      { label: 'MDN — Offline guide', url: 'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers' },
    ],
  },
  'opt-pwa-push': {
    title: 'Push Notifications',
    yt: [{ label: 'Google Chrome Developers — Push Notifications', url: 'https://www.youtube.com/@ChromeDevs' }],
    web: [
      { label: 'web.dev — Push notifications overview', url: 'https://web.dev/push-notifications-overview' },
      { label: 'MDN — Push API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Push_API' },
    ],
  },

  // ── GraphQL ───────────────────────────────────────────────────
  'opt-gql': {
    title: 'GraphQL',
    yt: [
      { label: 'freeCodeCamp — GraphQL Full Course', url: 'https://www.youtube.com/watch?v=ed8SzALpx1Q' },
      { label: 'Ben Awad — Relay Modern playlist', url: 'https://www.youtube.com/@BenAwad97' },
    ],
    web: [
      { label: 'graphql.org/learn', url: 'https://graphql.org/learn' },
      { label: 'relay.dev/docs/getting-started', url: 'https://relay.dev/docs/getting-started/step-by-step-guide' },
    ],
  },
  'opt-gql-sch': {
    title: 'GraphQL — Schema & Resolvers',
    yt: [{ label: 'freeCodeCamp — GraphQL Full Course', url: 'https://www.youtube.com/watch?v=ed8SzALpx1Q' }],
    web: [{ label: 'graphql.org/learn/schema', url: 'https://graphql.org/learn/schema' }],
  },
  'opt-gql-apo': {
    title: 'Apollo Client',
    yt: [{ label: 'Traversy Media — Apollo Client crash course', url: 'https://www.youtube.com/@TraversyMedia' }],
    web: [{ label: 'apollographql.com/docs/react', url: 'https://www.apollographql.com/docs/react' }],
  },
  'opt-gql-rel': {
    title: 'Relay Modern',
    yt: [{ label: 'Ben Awad — Relay Modern playlist', url: 'https://www.youtube.com/@BenAwad97' }],
    web: [{ label: 'relay.dev/docs/getting-started', url: 'https://relay.dev/docs/getting-started/step-by-step-guide' }],
  },
  'opt-gql-rest': {
    title: 'REST vs GraphQL',
    yt: [{ label: 'Fireship — REST vs GraphQL', url: 'https://www.youtube.com/watch?v=yWzKJPw_VzM' }],
    web: [
      { label: 'graphql.org/learn', url: 'https://graphql.org/learn' },
      { label: 'web.dev — Fetch APIs', url: 'https://web.dev/fetch-api' },
    ],
  },

  // ── Static Site Generators ────────────────────────────────────
  'opt-ssg': {
    title: 'Static Site Generators',
    yt: [
      { label: 'Fireship — SSG comparisons', url: 'https://www.youtube.com/@Fireship' },
      { label: '11ty official YouTube tutorials', url: 'https://www.youtube.com/@11ty' },
    ],
    web: [
      { label: 'nextjs.org/docs — Static Generation', url: 'https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation' },
      { label: '11ty.dev/docs', url: 'https://www.11ty.dev/docs' },
      { label: 'vuepress.vuejs.org/guide', url: 'https://vuepress.vuejs.org/guide/getting-started.html' },
    ],
  },
  'opt-ssg-next': {
    title: 'Next.js SSG',
    yt: [{ label: 'freeCodeCamp — Next.js Full Course', url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk' }],
    web: [{ label: 'nextjs.org/docs — Static Generation', url: 'https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation' }],
  },
  'opt-ssg-ast': {
    title: 'Astro',
    yt: [{ label: 'Fireship — Astro in 100 seconds', url: 'https://www.youtube.com/watch?v=dsTXcSeAZq8' }],
    web: [{ label: 'docs.astro.build', url: 'https://docs.astro.build' }],
  },
  'opt-ssg-elev': {
    title: 'Eleventy (11ty)',
    yt: [{ label: '11ty official YouTube tutorials', url: 'https://www.youtube.com/@11ty' }],
    web: [{ label: '11ty.dev/docs', url: 'https://www.11ty.dev/docs' }],
  },
  'opt-ssg-nuxt': {
    title: 'Nuxt.js SSG',
    yt: [{ label: 'Net Ninja — Nuxt.js playlist', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9haQlqdCQyYmL_27TesCGPC' }],
    web: [{ label: 'nuxt.com/docs — Static Generation', url: 'https://nuxt.com/docs/getting-started/deployment#static-hosting' }],
  },
  'opt-ssg-vp': {
    title: 'VuePress',
    yt: [],
    web: [{ label: 'vuepress.vuejs.org/guide', url: 'https://vuepress.vuejs.org/guide/getting-started.html' }],
  },

  // ── Mobile Apps ───────────────────────────────────────────────
  'opt-mob': {
    title: 'Mobile Apps',
    yt: [
      { label: 'freeCodeCamp — React Native Full Course', url: 'https://www.youtube.com/watch?v=obH0Po_RdWk' },
      { label: 'Traversy Media — Ionic Crash Course', url: 'https://www.youtube.com/watch?v=r2ga-iXS5i4' },
    ],
    web: [
      { label: 'reactnative.dev/docs/getting-started', url: 'https://reactnative.dev/docs/getting-started' },
      { label: 'ionicframework.com/docs', url: 'https://ionicframework.com/docs' },
    ],
  },
  'opt-mob-rn': {
    title: 'React Native',
    yt: [{ label: 'freeCodeCamp — React Native Full Course', url: 'https://www.youtube.com/watch?v=obH0Po_RdWk' }],
    web: [{ label: 'reactnative.dev/docs/getting-started', url: 'https://reactnative.dev/docs/getting-started' }],
  },
  'opt-mob-fl': {
    title: 'Flutter',
    yt: [{ label: 'Flutter official channel', url: 'https://www.youtube.com/@flutterdev' }],
    web: [{ label: 'docs.flutter.dev', url: 'https://docs.flutter.dev' }],
  },
  'opt-mob-ion': {
    title: 'Ionic',
    yt: [{ label: 'Traversy Media — Ionic Crash Course', url: 'https://www.youtube.com/watch?v=r2ga-iXS5i4' }],
    web: [{ label: 'ionicframework.com/docs', url: 'https://ionicframework.com/docs' }],
  },
  'opt-mob-exp': {
    title: 'Expo',
    yt: [{ label: 'Expo official tutorials', url: 'https://www.youtube.com/@expo-dev' }],
    web: [{ label: 'docs.expo.dev', url: 'https://docs.expo.dev' }],
  },

  // ── Desktop Apps ──────────────────────────────────────────────
  'opt-desk': {
    title: 'Desktop Apps',
    yt: [
      { label: 'Traversy Media — Electron Crash Course', url: 'https://www.youtube.com/watch?v=ML743nrkMHw' },
      { label: 'Flutter official — Desktop support', url: 'https://www.youtube.com/@flutterdev' },
    ],
    web: [
      { label: 'electronjs.org/docs/latest', url: 'https://www.electronjs.org/docs/latest' },
      { label: 'docs.flutter.dev — Desktop integration', url: 'https://docs.flutter.dev/platform-integration/desktop' },
    ],
  },
  'opt-desk-el': {
    title: 'Electron',
    yt: [{ label: 'Traversy Media — Electron Crash Course', url: 'https://www.youtube.com/watch?v=ML743nrkMHw' }],
    web: [{ label: 'electronjs.org/docs/latest', url: 'https://www.electronjs.org/docs/latest' }],
  },
  'opt-desk-tau': {
    title: 'Tauri',
    yt: [{ label: 'Fireship — Tauri in 100 seconds', url: 'https://www.youtube.com/watch?v=-X8evddpu7M' }],
    web: [{ label: 'tauri.app/v1/guides', url: 'https://tauri.app/v1/guides/getting-started/prerequisites' }],
  },
  'opt-desk-fl': {
    title: 'Flutter Desktop',
    yt: [{ label: 'Flutter official — Desktop support', url: 'https://www.youtube.com/@flutterdev' }],
    web: [{ label: 'docs.flutter.dev/platform-integration/desktop', url: 'https://docs.flutter.dev/platform-integration/desktop' }],
  },
  'opt-desk-nw': {
    title: 'NW.js',
    yt: [],
    web: [{ label: 'nwjs.io/blog', url: 'https://nwjs.io' }],
  },

  // ── Bonus platforms ───────────────────────────────────────────
  bonus: {
    title: '📌 All-in-One Free Platforms',
    yt: [],
    web: [
      { label: 'freeCodeCamp.org — full curriculum & certifications', url: 'https://www.freecodecamp.org' },
      { label: 'The Odin Project — free structured fullstack path', url: 'https://www.theodinproject.com' },
      { label: 'roadmap.sh — OG roadmap + free guides', url: 'https://roadmap.sh' },
      { label: 'MDN Web Docs — reference for everything', url: 'https://developer.mozilla.org' },
      { label: 'web.dev by Google — modern best practices', url: 'https://web.dev' },
    ],
  },
});
