/**
 * scripts/seed-tools.ts
 *
 * Seeds the `tools` table in Supabase with all AI tools data.
 * Run with:  npx ts-node -e "require('./scripts/seed-tools.ts')"
 * Or use the /api/admin/seed-tools API endpoint instead.
 */

export const TOOLS_SEED = [
  // Chatbots
  { name: 'ChatGPT',        description: 'Conversational AI by OpenAI for writing, coding, research and more.',          category: 'Chatbots',       url: 'https://chat.openai.com',          is_free: true,  votes: 12400, logo: null },
  { name: 'Claude',         description: "Anthropic's AI assistant — thoughtful, safe and great for long documents.",    category: 'Chatbots',       url: 'https://claude.ai',                is_free: true,  votes: 8900,  logo: null },
  { name: 'Gemini',         description: "Google's multimodal AI assistant integrated with Google Workspace.",           category: 'Chatbots',       url: 'https://gemini.google.com',        is_free: true,  votes: 7800,  logo: null },
  { name: 'Grok',           description: 'xAI chatbot with real-time web access and witty personality.',                 category: 'Chatbots',       url: 'https://grok.x.ai',               is_free: true,  votes: 5200,  logo: 'x.ai' },
  { name: 'Meta AI',        description: "Meta's AI assistant available across WhatsApp, Instagram and Messenger.",      category: 'Chatbots',       url: 'https://www.meta.ai',              is_free: true,  votes: 4600,  logo: null },
  { name: 'Copilot',        description: "Microsoft's AI companion powered by GPT-4 built into Windows and Edge.",      category: 'Chatbots',       url: 'https://copilot.microsoft.com',    is_free: true,  votes: 6100,  logo: null },
  { name: 'Perplexity',     description: 'AI-powered search engine with cited, real-time answers from the web.',        category: 'Chatbots',       url: 'https://perplexity.ai',            is_free: true,  votes: 5900,  logo: null },
  { name: 'Albase.ai',      description: 'AI assistant platform for building and deploying smart chatbot workflows.',    category: 'Chatbots',       url: 'https://albase.ai',               is_free: false, votes: 1200,  logo: null },
  { name: 'Gemini Spark',   description: "Google's personal AI agent that checks emails, manages messages and is built into Google AI Studio.", category: 'Chatbots', url: 'https://aistudio.google.com', is_free: true, votes: 3200, logo: 'google.com' },

  // Presentations
  { name: 'Gamma',          description: 'Create beautiful AI-generated presentations, docs and webpages instantly.',    category: 'Presentations',  url: 'https://gamma.app',               is_free: true,  votes: 5400,  logo: null },
  { name: 'Pitch',          description: 'Collaborative presentation software with AI design suggestions.',              category: 'Presentations',  url: 'https://pitch.com',               is_free: true,  votes: 3200,  logo: null },
  { name: 'Plus',           description: 'AI presentation tool that turns prompts into polished slide decks.',           category: 'Presentations',  url: 'https://www.plusdocs.com',        is_free: false, votes: 1800,  logo: null },
  { name: 'PopAI',          description: 'AI workspace for presentations, PDF reading and image generation.',            category: 'Presentations',  url: 'https://www.popai.pro',           is_free: true,  votes: 2100,  logo: null },
  { name: 'Slidesgo',       description: 'Free Google Slides and PowerPoint templates with AI customisation.',           category: 'Presentations',  url: 'https://slidesgo.com',            is_free: true,  votes: 2800,  logo: null },
  { name: 'Tome',           description: 'AI-native storytelling and presentation format for modern teams.',             category: 'Presentations',  url: 'https://tome.app',                is_free: true,  votes: 3500,  logo: null },
  { name: 'Beautiful.ai',   description: 'Smart slide software that auto-designs your presentations as you type.',       category: 'Presentations',  url: 'https://www.beautiful.ai',        is_free: false, votes: 2600,  logo: null },
  { name: 'PresentationsAI', description: 'Generate complete slide decks from a single text prompt in seconds.',        category: 'Presentations',  url: 'https://presentations.ai',        is_free: true,  votes: 1900,  logo: null },

  // Coding
  { name: 'AskCodi',        description: 'AI coding assistant that answers dev questions and generates code snippets.',  category: 'Coding',         url: 'https://askcodi.com',             is_free: true,  votes: 2100,  logo: null },
  { name: 'Codeium',        description: 'Free AI code completion — Copilot alternative supporting 70+ languages.',     category: 'Coding',         url: 'https://codeium.com',             is_free: true,  votes: 4200,  logo: null },
  { name: 'Cursor',         description: 'AI-first code editor built on VS Code with chat, edit and autocomplete.',     category: 'Coding',         url: 'https://cursor.sh',               is_free: true,  votes: 7600,  logo: null },
  { name: 'Devin',          description: 'Autonomous AI software engineer that plans and executes coding tasks end-to-end.', category: 'Coding',    url: 'https://devin.ai',               is_free: false, votes: 5800,  logo: null },
  { name: 'Replit',         description: 'Browser-based IDE with AI that helps you code, collaborate and deploy.',      category: 'Coding',         url: 'https://replit.com',              is_free: true,  votes: 3900,  logo: null },
  { name: 'Tabnine',        description: 'AI code completion for all major IDEs trained on your codebase.',             category: 'Coding',         url: 'https://tabnine.com',             is_free: true,  votes: 3300,  logo: null },
  { name: 'GitHub Copilot', description: 'AI pair programmer by GitHub that writes code as you type inside your IDE.',  category: 'Coding',         url: 'https://copilot.github.com',      is_free: false, votes: 8600,  logo: null },
  { name: 'Bolt',           description: 'AI full-stack web app builder — describe your app and it builds it live.',    category: 'Coding',         url: 'https://bolt.new',                is_free: true,  votes: 4100,  logo: null },
  { name: 'Lovable',        description: 'AI product engineer that turns ideas into working web apps with one prompt.',  category: 'Coding',         url: 'https://lovable.dev',             is_free: true,  votes: 3700,  logo: null },
  { name: 'Windsurf',       description: 'Agentic AI code editor by Codeium with deep codebase understanding.',         category: 'Coding',         url: 'https://codeium.com/windsurf',    is_free: true,  votes: 3200,  logo: 'windsurf.com' },
  { name: 'Claude Code',    description: 'Agentic CLI coding tool by Anthropic — reads your codebase and codes directly in your terminal.', category: 'Coding', url: 'https://claude.ai/code', is_free: false, votes: 5600, logo: 'claude.ai' },
  { name: 'OpenAI Codex CLI', description: 'CLI-based AI coding agent. OpenAI tool that understands code context and makes direct edits.', category: 'Coding', url: 'https://github.com/openai/codex', is_free: true, votes: 4800, logo: 'openai.com' },
  { name: 'Antigravity',    description: "Google's AI coding tool — Deepmind's autonomous coding platform for enterprise app development.", category: 'Coding', url: 'https://antigravity.dev', is_free: false, votes: 1800, logo: 'antigravity.dev' },
  { name: 'CodeMender',     description: 'Security-focused AI agent from Google DeepMind that autonomously finds and fixes code flaws.', category: 'Coding', url: 'https://codemender.ai', is_free: false, votes: 1500, logo: 'codemender.ai' },
  { name: 'v0 by Vercel',   description: 'AI UI generator by Vercel — describe a UI and get production-ready React/Tailwind code instantly.', category: 'Coding', url: 'https://v0.dev', is_free: true, votes: 5800, logo: null },

  // Emails
  { name: 'Clippit AI',     description: 'AI email assistant that drafts, summarises and replies to emails faster.',    category: 'Emails',         url: 'https://clippit.ai',              is_free: true,  votes: 1400,  logo: null },
  { name: 'Friday',         description: 'AI email and calendar assistant that keeps your inbox and schedule on track.', category: 'Emails',        url: 'https://friday.app',              is_free: false, votes: 1600,  logo: null },
  { name: 'MailMaestro',    description: 'Outlook and Gmail AI plugin for writing professional emails in one click.',   category: 'Emails',         url: 'https://mailmaestro.com',         is_free: true,  votes: 2000,  logo: null },
  { name: 'ShortenAI',      description: 'AI tool that rewrites long emails into short, clear and punchy messages.',    category: 'Emails',         url: 'https://shorten.ai',              is_free: true,  votes: 1100,  logo: null },
  { name: 'Superhuman',     description: 'The fastest email client with AI triage, summaries and keyboard shortcuts.',  category: 'Emails',         url: 'https://superhuman.com',          is_free: false, votes: 3800,  logo: null },

  // Image
  { name: 'Adobe Firefly',  description: "Adobe's family of creative generative AI tools built into Creative Cloud.",  category: 'Image',          url: 'https://firefly.adobe.com',       is_free: true,  votes: 6200,  logo: null },
  { name: 'DALL·E',         description: "OpenAI's image generation model that creates art from text descriptions.",   category: 'Image',          url: 'https://openai.com/dall-e-3',     is_free: true,  votes: 7100,  logo: 'openai.com' },
  { name: 'FLUX.1',         description: 'State-of-the-art open-source image generation model by Black Forest Labs.',  category: 'Image',          url: 'https://blackforestlabs.ai',      is_free: true,  votes: 4300,  logo: null },
  { name: 'Ideogram',       description: 'AI image generator with excellent text rendering inside images.',             category: 'Image',          url: 'https://ideogram.ai',             is_free: true,  votes: 3800,  logo: null },
  { name: 'Midjourney',     description: 'Generate stunning, photorealistic and artistic images from text prompts.',    category: 'Image',          url: 'https://midjourney.com',          is_free: false, votes: 9800,  logo: null },
  { name: 'Recraft',        description: 'AI design tool for generating vector icons, illustrations and brand assets.', category: 'Image',          url: 'https://recraft.ai',              is_free: true,  votes: 2900,  logo: null },
  { name: 'StableDiffusion', description: 'Open-source image AI model for generating detailed art and photorealism.',  category: 'Image',          url: 'https://stability.ai',            is_free: true,  votes: 5500,  logo: null },
  { name: 'LactoPic',       description: 'AI photo editor and enhancer for quick background removal and retouching.',   category: 'Image',          url: 'https://lactopic.com',            is_free: true,  votes: 1300,  logo: null },
  { name: 'Leonardo AI',    description: 'AI image generation platform for game assets, art and creative projects.',    category: 'Image',          url: 'https://leonardo.ai',             is_free: true,  votes: 4700,  logo: null },

  // Spreadsheet
  { name: 'Rows',           description: 'Spreadsheet with built-in AI to analyse data, write formulas and create charts.', category: 'Spreadsheet', url: 'https://rows.com',              is_free: true,  votes: 2200,  logo: null },
  { name: 'Formula Bot',    description: 'AI that generates Excel and Google Sheets formulas from plain English.',      category: 'Spreadsheet',    url: 'https://formulabot.com',          is_free: true,  votes: 3100,  logo: null },
  { name: 'Gigasheet',      description: 'Handle massive CSV and data files in the browser with AI-powered analysis.',  category: 'Spreadsheet',    url: 'https://gigasheet.com',           is_free: true,  votes: 1800,  logo: null },
  { name: 'Rows AI',        description: 'AI-powered data analysis and summarisation directly inside spreadsheets.',    category: 'Spreadsheet',    url: 'https://rows.com/ai',             is_free: true,  votes: 1500,  logo: 'rows.com' },
  { name: 'SheetAI',        description: 'Google Sheets add-on that brings GPT-4 intelligence to your spreadsheets.',  category: 'Spreadsheet',    url: 'https://sheetai.app',             is_free: true,  votes: 2400,  logo: null },

  // Meetings
  { name: 'Avoma',          description: 'AI meeting assistant that records, transcribes and summarises every call.',   category: 'Meetings',       url: 'https://avoma.com',               is_free: true,  votes: 2500,  logo: null },
  { name: 'Equal Time',     description: 'Meeting equity tool that tracks who is speaking and helps balance discussions.', category: 'Meetings',    url: 'https://equaltime.io',            is_free: false, votes: 1100,  logo: null },
  { name: 'Fathom',         description: 'Free AI notetaker that records and summarises your Zoom calls automatically.', category: 'Meetings',      url: 'https://fathom.video',            is_free: true,  votes: 4800,  logo: null },
  { name: 'Fellow.app',     description: 'Meeting productivity app with AI summaries, action items and agendas.',       category: 'Meetings',       url: 'https://fellow.app',              is_free: true,  votes: 3200,  logo: null },
  { name: 'Fireflies',      description: 'AI meeting recorder and transcription tool for all video conferencing apps.',  category: 'Meetings',      url: 'https://fireflies.ai',            is_free: true,  votes: 4100,  logo: null },
  { name: 'Krisp',          description: 'AI noise cancellation app that removes background noise from any call.',      category: 'Meetings',       url: 'https://krisp.ai',                is_free: true,  votes: 5600,  logo: null },
  { name: 'Otter.ai',       description: 'AI meeting recorder and transcription for online and in-person meetings.',    category: 'Meetings',       url: 'https://otter.ai',                is_free: true,  votes: 3700,  logo: null },
  { name: 'Granola',        description: 'AI meeting notepad that runs locally and works with any meeting platform.',     category: 'Meetings',       url: 'https://granola.ai',              is_free: true,  votes: 2900,  logo: null },

  // Workflows
  { name: 'Integrately',    description: 'One-click automation tool to connect 1,200+ apps without any coding.',        category: 'Workflows',      url: 'https://integrately.com',         is_free: true,  votes: 2100,  logo: null },
  { name: 'Make',           description: 'Visual automation platform to build complex multi-step workflows with ease.',  category: 'Workflows',      url: 'https://make.com',                is_free: true,  votes: 4300,  logo: null },
  { name: 'Monday.com',     description: 'Work OS with AI automations for project management and team workflows.',      category: 'Workflows',      url: 'https://monday.com',              is_free: false, votes: 5200,  logo: null },
  { name: 'n8n',            description: 'Open-source workflow automation tool with 400+ integrations and AI nodes.',   category: 'Workflows',      url: 'https://n8n.io',                  is_free: true,  votes: 3900,  logo: null },
  { name: 'Unito',          description: 'Two-way sync tool that keeps your project management apps in perfect sync.',  category: 'Workflows',      url: 'https://unito.io',                is_free: false, votes: 1700,  logo: null },
  { name: 'Zapier',         description: 'The leading no-code automation platform connecting 6,000+ apps with AI.',     category: 'Workflows',      url: 'https://zapier.com',              is_free: true,  votes: 7800,  logo: null },
  { name: 'Google Flow',    description: 'AI creative studio for generating and managing AI content using Google Gemini.', category: 'Workflows',   url: 'https://labs.google/flow',        is_free: true,  votes: 2600,  logo: 'google.com' },

  // Writing
  { name: 'Copy.ai',        description: 'AI marketing copy generator for ads, emails, blog posts and social media.',   category: 'Writing',        url: 'https://copy.ai',                 is_free: true,  votes: 4200,  logo: null },
  { name: 'Grammarly',      description: 'AI writing assistant for grammar, clarity, tone and plagiarism detection.',   category: 'Writing',        url: 'https://grammarly.com',           is_free: true,  votes: 6800,  logo: null },
  { name: 'Jasper',         description: 'AI content platform for marketing teams to produce on-brand content at scale.', category: 'Writing',      url: 'https://jasper.ai',               is_free: false, votes: 5100,  logo: null },
  { name: 'JetBot',         description: 'AI writing assistant for generating and editing content faster.',              category: 'Writing',        url: 'https://jetbot.ai',               is_free: true,  votes: 1300,  logo: null },
  { name: 'Quanta',         description: 'AI-powered writing and research assistant for students and professionals.',    category: 'Writing',        url: 'https://quanta.ai',               is_free: true,  votes: 1600,  logo: null },
  { name: 'Quillbot',       description: 'AI paraphrasing and summarising tool used by millions of students worldwide.', category: 'Writing',       url: 'https://quillbot.com',            is_free: true,  votes: 7200,  logo: null },
  { name: 'Rytr',           description: 'Affordable AI writing assistant for blogs, emails and social media posts.',    category: 'Writing',        url: 'https://rytr.me',                 is_free: true,  votes: 3600,  logo: null },
  { name: 'Sudowrite',      description: 'AI writing tool specifically designed for fiction writers and storytellers.',  category: 'Writing',        url: 'https://sudowrite.com',           is_free: false, votes: 2400,  logo: null },
  { name: 'Writesonic',     description: 'AI writer for SEO-optimised articles, ads and landing pages at scale.',       category: 'Writing',        url: 'https://writesonic.com',          is_free: true,  votes: 3900,  logo: null },
  { name: 'Jenni AI',       description: 'AI writing assistant for academic essays, research papers and citations.',     category: 'Writing',        url: 'https://jenni.ai',                is_free: true,  votes: 2800,  logo: null },
  { name: 'Nix',            description: 'AI content creation platform for fast, high-quality marketing copy.',         category: 'Writing',        url: 'https://nix.com',                 is_free: false, votes: 1100,  logo: null },
  { name: 'Purrail',        description: 'AI-powered social media content generator for brands and creators.',          category: 'Writing',        url: 'https://purrail.com',             is_free: false, votes: 1400,  logo: 'purrail.com' },

  // Scheduling
  { name: 'Calendly',       description: 'Automated scheduling tool that eliminates back-and-forth meeting coordination.', category: 'Scheduling',  url: 'https://calendly.com',            is_free: true,  votes: 7400,  logo: null },
  { name: 'Clockwise',      description: 'AI calendar assistant that finds the best meeting times and protects focus.', category: 'Scheduling',     url: 'https://getclockwise.com',        is_free: true,  votes: 3100,  logo: null },
  { name: 'Motion',         description: 'AI planner that automatically schedules tasks and meetings in your calendar.', category: 'Scheduling',    url: 'https://usemotion.com',           is_free: false, votes: 4600,  logo: null },
  { name: 'Reclaim AI',     description: 'Smart calendar app that auto-schedules tasks, habits and meetings intelligently.', category: 'Scheduling', url: 'https://reclaim.ai',             is_free: true,  votes: 3800,  logo: null },
  { name: 'Taskade',        description: 'AI-powered task manager and collaboration tool with built-in automation.',    category: 'Scheduling',     url: 'https://taskade.com',             is_free: true,  votes: 2700,  logo: null },
  { name: 'Trevor AI',      description: 'AI daily planner that integrates with your to-do list and time-blocks tasks.', category: 'Scheduling',   url: 'https://trevorai.com',            is_free: true,  votes: 1900,  logo: null },

  // Video
  { name: 'Descript',       description: 'Video and podcast editor where you edit video by editing the transcript text.', category: 'Video',        url: 'https://descript.com',            is_free: true,  votes: 5800,  logo: null },
  { name: 'HeyGen AI',      description: 'AI video generator that creates talking avatar videos from text in minutes.',  category: 'Video',         url: 'https://heygen.com',              is_free: true,  votes: 6400,  logo: null },
  { name: 'Kling',          description: 'AI video generation model by Kuaishou that produces cinematic quality clips.', category: 'Video',        url: 'https://klingai.com',             is_free: true,  votes: 4200,  logo: null },
  { name: 'Krea AI',        description: 'Real-time AI image and video generation with live canvas and enhancement.',   category: 'Video',          url: 'https://krea.ai',                 is_free: true,  votes: 3100,  logo: null },
  { name: 'LTX Studio',     description: 'AI video creation platform for generating and editing professional videos.',  category: 'Video',          url: 'https://ltx.studio',              is_free: false, votes: 2200,  logo: null },
  { name: 'Luma AI',        description: 'AI video model that generates high-quality cinematic video from text prompts.', category: 'Video',        url: 'https://lumalabs.ai',             is_free: true,  votes: 5100,  logo: null },
  { name: 'Pika AI',        description: 'AI video generator for creating and editing videos with simple text prompts.', category: 'Video',        url: 'https://pika.art',                is_free: true,  votes: 4700,  logo: null },
  { name: 'PixAI',          description: 'Anime-focused AI art and video generator with a large community of creators.', category: 'Video',        url: 'https://pixai.art',               is_free: true,  votes: 2800,  logo: null },
  { name: 'Runwayml',       description: 'Professional AI video creation and editing platform used by film studios.',   category: 'Video',          url: 'https://runwayml.com',            is_free: true,  votes: 6900,  logo: null },
  { name: 'Sora',           description: "OpenAI's text-to-video model that generates realistic and imaginative videos.", category: 'Video',        url: 'https://openai.com/sora',         is_free: false, votes: 7800,  logo: 'openai.com' },
  { name: 'DeepAI',         description: 'AI video and image generation APIs for developers and creative professionals.', category: 'Video',        url: 'https://deepai.org',              is_free: true,  votes: 2400,  logo: null },
  { name: 'LacidPic',       description: 'AI video enhancement tool for upscaling and improving video quality.',        category: 'Video',          url: 'https://lacidpic.com',            is_free: true,  votes: 1200,  logo: null },
  { name: 'Veo 3',          description: "Google's state-of-the-art video generation model with native audio output.",  category: 'Video',          url: 'https://deepmind.google/veo',     is_free: false, votes: 4100,  logo: 'deepmind.google' },
  { name: 'Sora 2',         description: "OpenAI's next-gen video model with both realistic and imaginative video generation improvements.", category: 'Video', url: 'https://openai.com/sora', is_free: false, votes: 5200, logo: 'openai.com' },
  { name: 'Seedance 2.0',   description: 'ByteDance AI video model for creating high-quality, cinematic shots with precise motion control.', category: 'Video', url: 'https://seedance.ai', is_free: true, votes: 3400, logo: 'bytedance.com' },
  { name: 'Kling 3.0',      description: 'Upgraded Kling AI video model with faster generation and higher fidelity output.',  category: 'Video',    url: 'https://klingai.com',             is_free: true,  votes: 3800,  logo: null },
  { name: 'Higgsfield',     description: 'Multi-modal AI video hub for character-consistent, story-driven AI video production.', category: 'Video',  url: 'https://higgsfield.ai',           is_free: true,  votes: 2700,  logo: null },

  // Graphic Design
  { name: 'AutoDraw',       description: "Google's AI drawing tool that recognises rough sketches and suggests clean icons.", category: 'Graphic Design', url: 'https://autodraw.com',        is_free: true,  votes: 2600,  logo: null },
  { name: 'Canva',          description: 'Drag-and-drop design tool with AI features for anyone to create stunning visuals.', category: 'Graphic Design', url: 'https://canva.com',           is_free: true,  votes: 9100,  logo: null },
  { name: 'Design.com',     description: 'AI brand identity and logo design platform for businesses and creators.',     category: 'Graphic Design', url: 'https://design.com',              is_free: true,  votes: 2300,  logo: null },
  { name: 'Framer',         description: 'AI website builder and design tool that turns prompts into live websites.',   category: 'Graphic Design', url: 'https://framer.com',              is_free: true,  votes: 5400,  logo: null },
  { name: 'Slider3',        description: 'AI-powered website slider and visual content builder for modern web design.', category: 'Graphic Design', url: 'https://slider3.com',             is_free: false, votes: 1400,  logo: null },
  { name: 'Microsoft Designer', description: 'Free AI graphic design app by Microsoft for social posts and visuals.',  category: 'Graphic Design', url: 'https://designer.microsoft.com',  is_free: true,  votes: 3700,  logo: 'microsoft.com' },
  { name: 'Google Stitch',  description: 'Google tool to quickly build and prototype mobile app UIs from text prompts.', category: 'Graphic Design', url: 'https://stitch.withgoogle.com',  is_free: true,  votes: 2200,  logo: 'google.com' },

  // Knowledge
  { name: 'Hana',           description: 'AI knowledge assistant that helps teams capture and retrieve information fast.', category: 'Knowledge',   url: 'https://hana.ai',                 is_free: false, votes: 1300,  logo: null },
  { name: 'Notion',         description: 'All-in-one workspace with AI for notes, docs, wikis, tasks and databases.',  category: 'Knowledge',      url: 'https://notion.so',               is_free: true,  votes: 8400,  logo: null },
  { name: 'Tetra',          description: 'AI note-taking assistant that listens to your calls and captures action items.', category: 'Knowledge',   url: 'https://asktetra.com',            is_free: false, votes: 1600,  logo: null },
  { name: 'Notions AI 3.0', description: 'Major upgrade to Notions AI layer — deeper reasoning, auto-databases and project management built on top of your notes.', category: 'Knowledge', url: 'https://notion.so/product/ai', is_free: false, votes: 3100, logo: 'notion.so' },

  // Research
  { name: 'NotebookLM',     description: 'Google AI research assistant that analyses your uploaded docs and generates podcasts.', category: 'Research', url: 'https://notebooklm.google.com',  is_free: true,  votes: 6800,  logo: 'google.com' },
  { name: 'NVIDIA AI Blueprint', description: 'Knowledge management using AI — combines summarisation, translation and retrieval for research.', category: 'Research', url: 'https://developer.nvidia.com/ai-blueprint', is_free: false, votes: 1700, logo: 'nvidia.com' },
  { name: 'Elon',           description: 'AI for academic research — finds papers, explains concepts and summarises research since 2020.', category: 'Research', url: 'https://elon.io',            is_free: true,  votes: 2200,  logo: null },

  // Agent
  { name: 'NVIDIA Agent Toolkit', description: 'Enterprise platform for building multi-step AI agents with safety-ready compute and proven guardrails.', category: 'Agent', url: 'https://developer.nvidia.com/agent-toolkit', is_free: false, votes: 2400, logo: 'nvidia.com' },
  { name: 'NVIDIA Nemo',    description: 'Open-source AI model platform for building custom enterprise-grade LLMs.',     category: 'Agent',          url: 'https://developer.nvidia.com/nemo', is_free: true, votes: 2100, logo: 'nvidia.com' },
  { name: 'NVIDIA DGX Spark', description: 'NVIDIA AI supercomputer for training large AI models on a single desktop device.', category: 'Agent',    url: 'https://www.nvidia.com/dgx-spark', is_free: false, votes: 2800, logo: 'nvidia.com' },
  { name: 'NVIDIA Omniverse', description: 'Digital twin and simulation platform for building real-time 3D industrial workflows.', category: 'Agent', url: 'https://developer.nvidia.com/omniverse', is_free: false, votes: 3200, logo: 'nvidia.com' },
  { name: 'ChatGPT Agent',  description: 'AI agent that browses the web, completes tasks and fills forms autonomously on your behalf.', category: 'Agent', url: 'https://chat.openai.com', is_free: false, votes: 6200, logo: 'openai.com' },
  { name: 'Perplexity Comet', description: 'Agentic browser by Perplexity that autonomously finds, clicks and completes tasks on any site.', category: 'Agent', url: 'https://perplexity.ai/comet', is_free: false, votes: 3600, logo: 'perplexity.ai' },

  // Audio
  { name: 'ElevenLabs',     description: 'Industry-leading AI voice synthesis and audio cloning tool for any language.',  category: 'Audio',          url: 'https://elevenlabs.io',           is_free: true,  votes: 7600,  logo: null },
  { name: 'Suno',           description: 'Generate complete songs with AI — full melodies, lyrics and vocals from a text prompt.', category: 'Audio', url: 'https://suno.ai',                is_free: true,  votes: 6400,  logo: null },
];
