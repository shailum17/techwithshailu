'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ALL_TOOLS: { name: string; desc: string; cat: string; url: string; logo?: string; free: boolean; votes: number }[] = [
  // Chatbots
  { name: 'ChatGPT',        desc: 'Conversational AI by OpenAI for writing, coding, research and more.',          cat: 'Chatbots',       url: 'https://chat.openai.com',          free: true,  votes: 12400 },
  { name: 'Claude',         desc: "Anthropic's AI assistant — thoughtful, safe and great for long documents.",    cat: 'Chatbots',       url: 'https://claude.ai',                free: true,  votes: 8900  },
  { name: 'Gemini',         desc: "Google's multimodal AI assistant integrated with Google Workspace.",           cat: 'Chatbots',       url: 'https://gemini.google.com',        free: true,  votes: 7800  },
  { name: 'Grok',           desc: 'xAI chatbot with real-time web access and witty personality.',                 cat: 'Chatbots',       url: 'https://grok.x.ai',               logo: 'x.ai',                      free: true,  votes: 5200  },
  { name: 'Meta AI',        desc: "Meta's AI assistant available across WhatsApp, Instagram and Messenger.",      cat: 'Chatbots',       url: 'https://www.meta.ai',              free: true,  votes: 4600  },
  { name: 'Copilot',        desc: "Microsoft's AI companion powered by GPT-4 built into Windows and Edge.",      cat: 'Chatbots',       url: 'https://copilot.microsoft.com',    free: true,  votes: 6100  },
  { name: 'Perplexity',     desc: 'AI-powered search engine with cited, real-time answers from the web.',        cat: 'Chatbots',       url: 'https://perplexity.ai',            free: true,  votes: 5900  },
  { name: 'Albase.ai',      desc: 'AI assistant platform for building and deploying smart chatbot workflows.',    cat: 'Chatbots',       url: 'https://albase.ai',               free: false, votes: 1200  },

  // Presentations
  { name: 'Gamma',          desc: 'Create beautiful AI-generated presentations, docs and webpages instantly.',    cat: 'Presentations',  url: 'https://gamma.app',               free: true,  votes: 5400  },
  { name: 'Pitch',          desc: 'Collaborative presentation software with AI design suggestions.',              cat: 'Presentations',  url: 'https://pitch.com',               free: true,  votes: 3200  },
  { name: 'Plus',           desc: 'AI presentation tool that turns prompts into polished slide decks.',           cat: 'Presentations',  url: 'https://www.plusdocs.com',        free: false, votes: 1800  },
  { name: 'PopAI',          desc: 'AI workspace for presentations, PDF reading and image generation.',            cat: 'Presentations',  url: 'https://www.popai.pro',           free: true,  votes: 2100  },
  { name: 'Slidesgo',       desc: 'Free Google Slides and PowerPoint templates with AI customisation.',           cat: 'Presentations',  url: 'https://slidesgo.com',            free: true,  votes: 2800  },
  { name: 'Tome',           desc: 'AI-native storytelling and presentation format for modern teams.',             cat: 'Presentations',  url: 'https://tome.app',                free: true,  votes: 3500  },
  { name: 'Beautiful.ai',   desc: 'Smart slide software that auto-designs your presentations as you type.',       cat: 'Presentations',  url: 'https://www.beautiful.ai',        free: false, votes: 2600  },
  { name: 'PresentationsAI', desc: 'Generate complete slide decks from a single text prompt in seconds.',         cat: 'Presentations',  url: 'https://presentations.ai',        free: true,  votes: 1900  },

  // Coding
  { name: 'AskCodi',        desc: 'AI coding assistant that answers dev questions and generates code snippets.',  cat: 'Coding',         url: 'https://askcodi.com',             free: true,  votes: 2100  },
  { name: 'Codeium',        desc: 'Free AI code completion — Copilot alternative supporting 70+ languages.',     cat: 'Coding',         url: 'https://codeium.com',             free: true,  votes: 4200  },
  { name: 'Cursor',         desc: 'AI-first code editor built on VS Code with chat, edit and autocomplete.',     cat: 'Coding',         url: 'https://cursor.sh',               free: true,  votes: 7600  },
  { name: 'Devin',          desc: 'Autonomous AI software engineer that plans and executes coding tasks end-to-end.', cat: 'Coding',    url: 'https://devin.ai',               free: false, votes: 5800  },
  { name: 'Replit',         desc: 'Browser-based IDE with AI that helps you code, collaborate and deploy.',      cat: 'Coding',         url: 'https://replit.com',              free: true,  votes: 3900  },
  { name: 'Tabnine',        desc: 'AI code completion for all major IDEs trained on your codebase.',             cat: 'Coding',         url: 'https://tabnine.com',             free: true,  votes: 3300  },
  { name: 'GitHub Copilot', desc: 'AI pair programmer by GitHub that writes code as you type inside your IDE.',  cat: 'Coding',         url: 'https://copilot.github.com',      free: false, votes: 8600  },
  { name: 'Bolt',           desc: 'AI full-stack web app builder — describe your app and it builds it live.',    cat: 'Coding',         url: 'https://bolt.new',                free: true,  votes: 4100  },
  { name: 'Lovable',        desc: 'AI product engineer that turns ideas into working web apps with one prompt.',  cat: 'Coding',         url: 'https://lovable.dev',             free: true,  votes: 3700  },
  { name: 'Windsurf',       desc: 'Agentic AI code editor by Codeium with deep codebase understanding.',         cat: 'Coding',         url: 'https://codeium.com/windsurf',    logo: 'windsurf.com',              free: true,  votes: 3200  },

  // Emails
  { name: 'Clippit AI',     desc: 'AI email assistant that drafts, summarises and replies to emails faster.',    cat: 'Emails',         url: 'https://clippit.ai',              free: true,  votes: 1400  },
  { name: 'Friday',         desc: 'AI email and calendar assistant that keeps your inbox and schedule on track.', cat: 'Emails',        url: 'https://friday.app',              free: false, votes: 1600  },
  { name: 'MailMaestro',    desc: 'Outlook and Gmail AI plugin for writing professional emails in one click.',   cat: 'Emails',         url: 'https://mailmaestro.com',         free: true,  votes: 2000  },
  { name: 'ShortenAI',      desc: 'AI tool that rewrites long emails into short, clear and punchy messages.',    cat: 'Emails',         url: 'https://shorten.ai',              free: true,  votes: 1100  },
  { name: 'Superhuman',     desc: 'The fastest email client with AI triage, summaries and keyboard shortcuts.',  cat: 'Emails',         url: 'https://superhuman.com',          free: false, votes: 3800  },

  // Image
  { name: 'Adobe Firefly',  desc: 'Adobe\'s family of creative generative AI tools built into Creative Cloud.',  cat: 'Image',          url: 'https://firefly.adobe.com',       free: true,  votes: 6200  },
  { name: 'DALL·E',         desc: 'OpenAI\'s image generation model that creates art from text descriptions.',   cat: 'Image',          url: 'https://openai.com/dall-e-3',     logo: 'openai.com',                free: true,  votes: 7100  },
  { name: 'FLUX.1',         desc: 'State-of-the-art open-source image generation model by Black Forest Labs.',  cat: 'Image',          url: 'https://blackforestlabs.ai',      free: true,  votes: 4300  },
  { name: 'Ideogram',       desc: 'AI image generator with excellent text rendering inside images.',             cat: 'Image',          url: 'https://ideogram.ai',             free: true,  votes: 3800  },
  { name: 'Midjourney',     desc: 'Generate stunning, photorealistic and artistic images from text prompts.',    cat: 'Image',          url: 'https://midjourney.com',          free: false, votes: 9800  },
  { name: 'Recraft',        desc: 'AI design tool for generating vector icons, illustrations and brand assets.', cat: 'Image',          url: 'https://recraft.ai',              free: true,  votes: 2900  },
  { name: 'StableDiffusion', desc: 'Open-source image AI model for generating detailed art and photorealism.',   cat: 'Image',          url: 'https://stability.ai',            free: true,  votes: 5500  },
  { name: 'LactoPic',       desc: 'AI photo editor and enhancer for quick background removal and retouching.',   cat: 'Image',          url: 'https://lactopic.com',            free: true,  votes: 1300  },
  { name: 'Leonardo AI',    desc: 'AI image generation platform for game assets, art and creative projects.',    cat: 'Image',          url: 'https://leonardo.ai',             free: true,  votes: 4700  },

  // Spreadsheet
  { name: 'Rows',           desc: 'Spreadsheet with built-in AI to analyse data, write formulas and create charts.', cat: 'Spreadsheet', url: 'https://rows.com',               free: true,  votes: 2200  },
  { name: 'Formula Bot',    desc: 'AI that generates Excel and Google Sheets formulas from plain English.',      cat: 'Spreadsheet',    url: 'https://formulabot.com',          free: true,  votes: 3100  },
  { name: 'Gigasheet',      desc: 'Handle massive CSV and data files in the browser with AI-powered analysis.',  cat: 'Spreadsheet',    url: 'https://gigasheet.com',           free: true,  votes: 1800  },
  { name: 'Rows AI',        desc: 'AI-powered data analysis and summarisation directly inside spreadsheets.',    cat: 'Spreadsheet',    url: 'https://rows.com/ai',             logo: 'rows.com',                  free: true,  votes: 1500  },
  { name: 'SheetAI',        desc: 'Google Sheets add-on that brings GPT-4 intelligence to your spreadsheets.',  cat: 'Spreadsheet',    url: 'https://sheetai.app',             free: true,  votes: 2400  },

  // Meetings
  { name: 'Avoma',          desc: 'AI meeting assistant that records, transcribes and summarises every call.',   cat: 'Meetings',       url: 'https://avoma.com',               free: true,  votes: 2500  },
  { name: 'Equal Time',     desc: 'Meeting equity tool that tracks who is speaking and helps balance discussions.', cat: 'Meetings',    url: 'https://equaltime.io',            free: false, votes: 1100  },
  { name: 'Fathom',         desc: 'Free AI notetaker that records and summarises your Zoom calls automatically.', cat: 'Meetings',      url: 'https://fathom.video',            free: true,  votes: 4800  },
  { name: 'Fellow.app',     desc: 'Meeting productivity app with AI summaries, action items and agendas.',       cat: 'Meetings',       url: 'https://fellow.app',              free: true,  votes: 3200  },
  { name: 'Fireflies',      desc: 'AI meeting recorder and transcription tool for all video conferencing apps.',  cat: 'Meetings',      url: 'https://fireflies.ai',            free: true,  votes: 4100  },
  { name: 'Krisp',          desc: 'AI noise cancellation app that removes background noise from any call.',      cat: 'Meetings',       url: 'https://krisp.ai',                free: true,  votes: 5600  },
  { name: 'Otter.ai',       desc: 'AI meeting recorder and transcription for online and in-person meetings.',    cat: 'Meetings',       url: 'https://otter.ai',                free: true,  votes: 3700  },

  // Workflows
  { name: 'Integrately',    desc: 'One-click automation tool to connect 1,200+ apps without any coding.',        cat: 'Workflows',      url: 'https://integrately.com',         free: true,  votes: 2100  },
  { name: 'Make',           desc: 'Visual automation platform to build complex multi-step workflows with ease.',  cat: 'Workflows',      url: 'https://make.com',                free: true,  votes: 4300  },
  { name: 'Monday.com',     desc: 'Work OS with AI automations for project management and team workflows.',      cat: 'Workflows',      url: 'https://monday.com',              free: false, votes: 5200  },
  { name: 'n8n',            desc: 'Open-source workflow automation tool with 400+ integrations and AI nodes.',   cat: 'Workflows',      url: 'https://n8n.io',                  free: true,  votes: 3900  },
  { name: 'Unito',          desc: 'Two-way sync tool that keeps your project management apps in perfect sync.',  cat: 'Workflows',      url: 'https://unito.io',                free: false, votes: 1700  },
  { name: 'Zapier',         desc: 'The leading no-code automation platform connecting 6,000+ apps with AI.',     cat: 'Workflows',      url: 'https://zapier.com',              free: true,  votes: 7800  },

  // Writing
  { name: 'Copy.ai',        desc: 'AI marketing copy generator for ads, emails, blog posts and social media.',   cat: 'Writing',        url: 'https://copy.ai',                 free: true,  votes: 4200  },
  { name: 'Grammarly',      desc: 'AI writing assistant for grammar, clarity, tone and plagiarism detection.',   cat: 'Writing',        url: 'https://grammarly.com',           free: true,  votes: 6800  },
  { name: 'Jasper',         desc: 'AI content platform for marketing teams to produce on-brand content at scale.', cat: 'Writing',      url: 'https://jasper.ai',               free: false, votes: 5100  },
  { name: 'JetBot',         desc: 'AI writing assistant for generating and editing content faster.',              cat: 'Writing',        url: 'https://jetbot.ai',               free: true,  votes: 1300  },
  { name: 'Quanta',         desc: 'AI-powered writing and research assistant for students and professionals.',    cat: 'Writing',        url: 'https://quanta.ai',               free: true,  votes: 1600  },
  { name: 'Quillbot',       desc: 'AI paraphrasing and summarising tool used by millions of students worldwide.', cat: 'Writing',       url: 'https://quillbot.com',            free: true,  votes: 7200  },
  { name: 'Rytr',           desc: 'Affordable AI writing assistant for blogs, emails and social media posts.',    cat: 'Writing',        url: 'https://rytr.me',                 free: true,  votes: 3600  },
  { name: 'Sudowrite',      desc: 'AI writing tool specifically designed for fiction writers and storytellers.',  cat: 'Writing',        url: 'https://sudowrite.com',           free: false, votes: 2400  },
  { name: 'Writesonic',     desc: 'AI writer for SEO-optimised articles, ads and landing pages at scale.',       cat: 'Writing',        url: 'https://writesonic.com',          free: true,  votes: 3900  },
  { name: 'Jenni AI',       desc: 'AI writing assistant for academic essays, research papers and citations.',     cat: 'Writing',        url: 'https://jenni.ai',                free: true,  votes: 2800  },
  { name: 'Nix',            desc: 'AI content creation platform for fast, high-quality marketing copy.',         cat: 'Writing',        url: 'https://nix.com',                 free: false, votes: 1100  },

  // Scheduling
  { name: 'Calendly',       desc: 'Automated scheduling tool that eliminates back-and-forth meeting coordination.', cat: 'Scheduling',  url: 'https://calendly.com',            free: true,  votes: 7400  },
  { name: 'Clockwise',      desc: 'AI calendar assistant that finds the best meeting times and protects focus.', cat: 'Scheduling',     url: 'https://getclockwise.com',        free: true,  votes: 3100  },
  { name: 'Motion',         desc: 'AI planner that automatically schedules tasks and meetings in your calendar.', cat: 'Scheduling',    url: 'https://usemotion.com',           free: false, votes: 4600  },
  { name: 'Reclaim AI',     desc: 'Smart calendar app that auto-schedules tasks, habits and meetings intelligently.', cat: 'Scheduling', url: 'https://reclaim.ai',             free: true,  votes: 3800  },
  { name: 'Taskade',        desc: 'AI-powered task manager and collaboration tool with built-in automation.',    cat: 'Scheduling',     url: 'https://taskade.com',             free: true,  votes: 2700  },
  { name: 'Trevor AI',      desc: 'AI daily planner that integrates with your to-do list and time-blocks tasks.', cat: 'Scheduling',   url: 'https://trevorai.com',            free: true,  votes: 1900  },

  // Video
  { name: 'Descript',       desc: 'Video and podcast editor where you edit video by editing the transcript text.', cat: 'Video',        url: 'https://descript.com',            free: true,  votes: 5800  },
  { name: 'HeyGen AI',      desc: 'AI video generator that creates talking avatar videos from text in minutes.',  cat: 'Video',         url: 'https://heygen.com',              free: true,  votes: 6400  },
  { name: 'Kling',          desc: 'AI video generation model by Kuaishou that produces cinematic quality clips.', cat: 'Video',        url: 'https://klingai.com',             free: true,  votes: 4200  },
  { name: 'Krea AI',        desc: 'Real-time AI image and video generation with live canvas and enhancement.',   cat: 'Video',          url: 'https://krea.ai',                 free: true,  votes: 3100  },
  { name: 'LTX Studio',     desc: 'AI video creation platform for generating and editing professional videos.',  cat: 'Video',          url: 'https://ltx.studio',              free: false, votes: 2200  },
  { name: 'Luma AI',        desc: 'AI video model that generates high-quality cinematic video from text prompts.', cat: 'Video',        url: 'https://lumalabs.ai',             free: true,  votes: 5100  },
  { name: 'Pika AI',        desc: 'AI video generator for creating and editing videos with simple text prompts.', cat: 'Video',        url: 'https://pika.art',                free: true,  votes: 4700  },
  { name: 'PixAI',          desc: 'Anime-focused AI art and video generator with a large community of creators.', cat: 'Video',        url: 'https://pixai.art',               free: true,  votes: 2800  },
  { name: 'Runwayml',       desc: 'Professional AI video creation and editing platform used by film studios.',   cat: 'Video',          url: 'https://runwayml.com',            free: true,  votes: 6900  },
  { name: 'Sora',           desc: "OpenAI's text-to-video model that generates realistic and imaginative videos.", cat: 'Video',        url: 'https://openai.com/sora',         logo: 'openai.com',                free: false, votes: 7800  },
  { name: 'DeepAI',         desc: 'AI video and image generation APIs for developers and creative professionals.', cat: 'Video',        url: 'https://deepai.org',              free: true,  votes: 2400  },
  { name: 'LacidPic',       desc: 'AI video enhancement tool for upscaling and improving video quality.',        cat: 'Video',          url: 'https://lacidpic.com',            free: true,  votes: 1200  },

  // Graphic Design
  { name: 'AutoDraw',       desc: "Google's AI drawing tool that recognises rough sketches and suggests clean icons.", cat: 'Graphic Design', url: 'https://autodraw.com',        free: true,  votes: 2600  },
  { name: 'Canva',          desc: 'Drag-and-drop design tool with AI features for anyone to create stunning visuals.', cat: 'Graphic Design', url: 'https://canva.com',           free: true,  votes: 9100  },
  { name: 'Design.com',     desc: 'AI brand identity and logo design platform for businesses and creators.',     cat: 'Graphic Design', url: 'https://design.com',              free: true,  votes: 2300  },
  { name: 'Framer',         desc: 'AI website builder and design tool that turns prompts into live websites.',   cat: 'Graphic Design', url: 'https://framer.com',              free: true,  votes: 5400  },
  { name: 'Slider3',        desc: 'AI-powered website slider and visual content builder for modern web design.', cat: 'Graphic Design', url: 'https://slider3.com',             free: false, votes: 1400  },
  { name: 'Microsoft Designer', desc: 'Free AI graphic design app by Microsoft for social posts and visuals.',  cat: 'Graphic Design', url: 'https://designer.microsoft.com',  logo: 'microsoft.com',             free: true,  votes: 3700  },

  // Knowledge Management
  { name: 'Hana',           desc: 'AI knowledge assistant that helps teams capture and retrieve information fast.', cat: 'Knowledge',   url: 'https://hana.ai',                 free: false, votes: 1300  },
  { name: 'Notion',         desc: 'All-in-one workspace with AI for notes, docs, wikis, tasks and databases.',  cat: 'Knowledge',      url: 'https://notion.so',               free: true,  votes: 8400  },
  { name: 'Tetra',          desc: 'AI note-taking assistant that listens to your calls and captures action items.', cat: 'Knowledge',   url: 'https://asktetra.com',            free: false, votes: 1600  },

  // Research
  { name: 'NotebookLM',     desc: 'Google AI research assistant that analyses your uploaded docs and generates podcasts.', cat: 'Research', url: 'https://notebooklm.google.com',  logo: 'google.com',                free: true,  votes: 6800  },
  { name: 'Veo 3',          desc: "Google's state-of-the-art video generation model with native audio output.",  cat: 'Video',          url: 'https://deepmind.google/veo',     logo: 'deepmind.google',           free: false, votes: 4100  },
  { name: 'Google Stitch',  desc: 'Google tool to quickly build and prototype mobile app UIs from text prompts.', cat: 'Graphic Design', url: 'https://stitch.withgoogle.com',  logo: 'google.com',                free: true,  votes: 2200  },
  { name: 'Purrail',        desc: 'AI-powered social media content generator for brands and creators.',          cat: 'Writing',        url: 'https://purrail.com',             logo: 'purrail.com',               free: false, votes: 1400  },
  { name: 'Gemini Spark',   desc: "Google's personal AI agent that checks emails, manages messages and is built into Google AI Studio.", cat: 'Chatbots', url: 'https://aistudio.google.com', logo: 'google.com',   free: true, votes: 3200 },
  { name: 'Google Flow',    desc: 'AI creative studio for generating and managing AI content using Google Gemini.', cat: 'Workflows',   url: 'https://labs.google/flow',        logo: 'google.com',                free: true,  votes: 2600  },
  { name: 'Antigravity',    desc: "Google's AI coding tool — Deepmind's autonomous coding platform for enterprise app development.", cat: 'Coding', url: 'https://antigravity.dev',      logo: 'antigravity.dev',           free: false, votes: 1800  },
  { name: 'CodeMender',     desc: 'Security-focused AI agent from Google DeepMind that autonomously finds and fixes code flaws.', cat: 'Coding', url: 'https://codemender.ai',         logo: 'codemender.ai',             free: false, votes: 1500  },

  // Enterprise Agents
  { name: 'NVIDIA Agent Toolkit', desc: 'Enterprise platform for building multi-step AI agents with safety-ready compute and proven guardrails.', cat: 'Agent', url: 'https://developer.nvidia.com/agent-toolkit', logo: 'nvidia.com', free: false, votes: 2400 },
  { name: 'NVIDIA Nemo',    desc: 'Open-source AI model platform for building custom enterprise-grade LLMs.',     cat: 'Agent',          url: 'https://developer.nvidia.com/nemo', logo: 'nvidia.com', free: true, votes: 2100 },
  { name: 'NVIDIA AI Blueprint', desc: 'Knowledge management using AI — combines summarisation, translation and retrieval for research.', cat: 'Research', url: 'https://developer.nvidia.com/ai-blueprint', logo: 'nvidia.com', free: false, votes: 1700 },
  { name: 'NVIDIA DGX Spark', desc: 'NVIDIA AI supercomputer for training large AI models on a single desktop device.', cat: 'Agent',    url: 'https://www.nvidia.com/dgx-spark', logo: 'nvidia.com', free: false, votes: 2800 },
  { name: 'NVIDIA Omniverse', desc: 'Digital twin and simulation platform for building real-time 3D industrial workflows.', cat: 'Agent', url: 'https://developer.nvidia.com/omniverse', logo: 'nvidia.com', free: false, votes: 3200 },

  // Coding agents
  { name: 'Claude Code',    desc: 'Agentic CLI coding tool by Anthropic — reads your codebase and codes directly in your terminal.', cat: 'Coding', url: 'https://claude.ai/code',        logo: 'claude.ai',                 free: false, votes: 5600 },
  { name: 'Sora 2',         desc: "OpenAI's next-gen video model with both realistic and imaginative video generation improvements.", cat: 'Video', url: 'https://openai.com/sora',        logo: 'openai.com',                free: false, votes: 5200 },
  { name: 'OpenAI Codex CLI', desc: 'CLI-based AI coding agent. OpenAI tool that understands code context and makes direct edits.', cat: 'Coding', url: 'https://github.com/openai/codex', logo: 'openai.com',              free: true, votes: 4800 },
  { name: 'ChatGPT Agent',  desc: 'AI agent that browses the web, completes tasks and fills forms autonomously on your behalf.', cat: 'Agent', url: 'https://chat.openai.com',        logo: 'openai.com',                free: false, votes: 6200 },

  // Video (additional)
  { name: 'Seedance 2.0',   desc: 'ByteDance AI video model for creating high-quality, cinematic shots with precise motion control.', cat: 'Video', url: 'https://seedance.ai',           logo: 'bytedance.com',             free: true,  votes: 3400 },
  { name: 'ElevenLabs',     desc: 'Industry-leading AI voice synthesis and audio cloning tool for any language.',  cat: 'Audio',          url: 'https://elevenlabs.io',           free: true,  votes: 7600  },
  { name: 'Suno',           desc: 'Generate complete songs with AI — full melodies, lyrics and vocals from a text prompt.', cat: 'Audio', url: 'https://suno.ai',                free: true,  votes: 6400  },
  { name: 'Kling 3.0',      desc: 'Upgraded Kling AI video model with faster generation and higher fidelity output.',  cat: 'Video',        url: 'https://klingai.com',             free: true,  votes: 3800  },
  { name: 'Granola',        desc: 'AI meeting notepad that runs locally and works with any meeting platform.',     cat: 'Meetings',       url: 'https://granola.ai',              free: true,  votes: 2900  },
  { name: 'v0 by Vercel',   desc: 'AI UI generator by Vercel — describe a UI and get production-ready React/Tailwind code instantly.', cat: 'Coding', url: 'https://v0.dev',             free: true,  votes: 5800 },
  { name: 'Elon',           desc: 'AI for academic research — finds papers, explains concepts and summarises research since 2020.', cat: 'Research', url: 'https://elon.io',            free: true,  votes: 2200 },
  { name: 'Perplexity Comet', desc: 'Agentic browser by Perplexity that autonomously finds, clicks and completes tasks on any site.', cat: 'Agent', url: 'https://perplexity.ai/comet',  logo: 'perplexity.ai',             free: false, votes: 3600 },
  { name: 'Notions AI 3.0', desc: 'Major upgrade to Notions AI layer — deeper reasoning, auto-databases and project management built on top of your notes.', cat: 'Knowledge', url: 'https://notion.so/product/ai', logo: 'notion.so', free: false, votes: 3100 },
  { name: 'Higgsfield',     desc: 'Multi-modal AI video hub for character-consistent, story-driven AI video production.', cat: 'Video',    url: 'https://higgsfield.ai',           free: true,  votes: 2700 },
];

const CATEGORIES = [
  'Chatbots', 'Coding', 'Writing', 'Image', 'Video', 'Audio',
  'Presentations', 'Emails', 'Spreadsheet', 'Meetings',
  'Workflows', 'Scheduling', 'Graphic Design', 'Knowledge',
  'Research', 'Agent',
] as const;
type Cat = typeof CATEGORIES[number];

const catCount: Record<string, number> = {};
ALL_TOOLS.forEach(t => { catCount[t.cat] = (catCount[t.cat] || 0) + 1; });

const categoryColors: Record<string, string> = {
  Chatbots:        'text-emerald-400 bg-emerald-950 border-emerald-800',
  Coding:          'text-purple-400 bg-purple-950 border-purple-800',
  Writing:         'text-blue-400 bg-blue-950 border-blue-800',
  Image:           'text-pink-400 bg-pink-950 border-pink-800',
  Video:           'text-red-400 bg-red-950 border-red-800',
  Audio:           'text-rose-400 bg-rose-950 border-rose-800',
  Presentations:   'text-orange-400 bg-orange-950 border-orange-800',
  Emails:          'text-cyan-400 bg-cyan-950 border-cyan-800',
  Spreadsheet:     'text-green-400 bg-green-950 border-green-800',
  Meetings:        'text-sky-400 bg-sky-950 border-sky-800',
  Workflows:       'text-amber-400 bg-amber-950 border-amber-800',
  Scheduling:      'text-violet-400 bg-violet-950 border-violet-800',
  'Graphic Design': 'text-fuchsia-400 bg-fuchsia-950 border-fuchsia-800',
  Knowledge:       'text-teal-400 bg-teal-950 border-teal-800',
  Research:        'text-indigo-400 bg-indigo-950 border-indigo-800',
  Agent:           'text-lime bg-lime/10 border-lime/30',
};

const categoryAvatarBg: Record<string, string> = {
  Chatbots:        'bg-emerald-900 text-emerald-400',
  Coding:          'bg-purple-900 text-purple-400',
  Writing:         'bg-blue-900 text-blue-400',
  Image:           'bg-pink-900 text-pink-400',
  Video:           'bg-red-900 text-red-400',
  Audio:           'bg-rose-900 text-rose-400',
  Presentations:   'bg-orange-900 text-orange-400',
  Emails:          'bg-cyan-900 text-cyan-400',
  Spreadsheet:     'bg-green-900 text-green-400',
  Meetings:        'bg-sky-900 text-sky-400',
  Workflows:       'bg-amber-900 text-amber-400',
  Scheduling:      'bg-violet-900 text-violet-400',
  'Graphic Design': 'bg-fuchsia-900 text-fuchsia-400',
  Knowledge:       'bg-teal-900 text-teal-400',
  Research:        'bg-indigo-900 text-indigo-400',
  Agent:           'bg-lime/10 text-lime',
};

function ToolLogo({ name, url, logo, avatarClass }: { name: string; url: string; logo?: string; avatarClass: string }) {
  const [errored, setErrored] = useState(false);
  const domain = logo ?? (() => { try { return new URL(url).hostname; } catch { return ''; } })();
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  if (!errored) {
    return (
      <img
        src={faviconUrl}
        alt={name}
        width={36}
        height={36}
        className="w-9 h-9 rounded-xl object-contain group-hover:scale-110 transition-transform flex-shrink-0"
        style={{ background: '#1A1A1A', padding: '4px' }}
        onError={() => setErrored(true)}
      />
    );
  }
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold
                    group-hover:scale-110 transition-transform flex-shrink-0 ${avatarClass}`}>
      {name.slice(0, 2)}
    </div>
  );
}

function ToolCard({ name, desc, cat, url, logo, free, votes, active }: {
  name: string; desc: string; cat: string; url: string; logo?: string;
  free: boolean; votes: number; active: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [upvoted, setUpvoted] = useState(false);
  const [localVotes, setLocalVotes] = useState(votes);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientY - r.top)  / r.height - 0.5) * 10;
    const y = ((e.clientX - r.left) / r.width  - 0.5) * -10;
    el.style.transform = `perspective(700px) rotateX(${x}deg) rotateY(${y}deg) translateY(-3px)`;
  };
  const resetTilt = () => { if (cardRef.current) cardRef.current.style.transform = ''; };

  const colorClass = categoryColors[cat] || 'text-ink-muted bg-surface-tertiary border-surface-border';
  const avatarClass = categoryAvatarBg[cat] || 'bg-surface-tertiary text-ink-muted';

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (upvoted) { setLocalVotes(v => v - 1); setUpvoted(false); }
    else { setLocalVotes(v => v + 1); setUpvoted(true); }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      style={{ transition: 'transform 0.15s ease, box-shadow 0.25s ease', transformStyle: 'preserve-3d' }}
      className={`group flex flex-col gap-3 p-4 rounded-2xl cursor-pointer
                  border shadow-card transition-all duration-300 ${
                    active
                      ? 'border-lime shadow-lime-glow'
                      : 'border-surface-border hover:border-lime/50 hover:shadow-[0_8px_28px_rgba(168,230,61,0.15)]'
                  }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <ToolLogo name={name} url={url} logo={logo} avatarClass={avatarClass} />
          <div>
            <p className="text-ink text-sm font-semibold font-poppins group-hover:text-lime transition-colors">
              {name}
            </p>
            {/* Upvote button — clickable */}
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 text-xs mt-0.5 transition-colors ${
                upvoted ? 'text-lime font-semibold' : 'text-ink-faint hover:text-lime'
              }`}
            >
              <span>▲</span>
              <span>{(localVotes / 1000).toFixed(1)}K</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-ink-muted text-xs leading-relaxed line-clamp-2">{desc}</p>

      <div className="flex flex-wrap gap-1.5">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass}`}>{cat}</span>
        {free ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ color: '#A8E63D', background: 'rgba(168,230,61,0.12)', border: '1px solid rgba(168,230,61,0.35)' }}>
            Free
          </span>
        ) : (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ color: '#FCD34D', background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.4)' }}>
            Paid
          </span>
        )}
      </div>

      {/* Lime Try Now button */}
      <a href={url} target="_blank" rel="noopener noreferrer"
         className="text-xs py-2 text-center mt-auto rounded-xl font-semibold transition-all duration-200
                    hover:shadow-lime-glow active:scale-95"
         style={{ background: '#A8E63D', color: '#000' }}
         onClick={e => e.stopPropagation()}>
        Try Now →
      </a>
    </div>
  );
}

export default function AIToolsClient({ initialCategory, initialQ }: { initialCategory?: string; initialQ?: string }) {
  const [activeCategory, setActiveCategory] = useState<Cat | 'All'>((initialCategory as Cat) || 'All');
  const [q,       setQ]       = useState(initialQ || '');
  const [pricing, setPricing] = useState<'All' | 'Free' | 'Paid'>('All');
  const [sort,    setSort]    = useState<'popular' | 'newest' | 'az'>('popular');
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const filtered = ALL_TOOLS
    .filter(t => activeCategory === 'All' || t.cat === activeCategory)
    .filter(t => pricing === 'All' || (pricing === 'Free' ? t.free : !t.free))
    .filter(t => !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.desc.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name) : sort === 'newest' ? 0 : b.votes - a.votes);

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
  const cardVariants = {
    hidden:  { opacity: 0, y: 20, scale: 0.97 },
    visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <div className="pt-20 min-h-screen" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* Sidebar */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <div className="rounded-2xl p-5 sticky top-24 space-y-6"
                 style={{ background: '#111111', border: '1px solid #2A2A2A', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              <div>
                <h1 className="font-poppins font-bold text-ink text-base">Discover</h1>
                <p className="text-ink-muted text-xs mt-1 leading-snug">
                  Find the best AI tools to boost your productivity.
                </p>
              </div>

              {/* Quick filters */}
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Quick Filters</p>
                {[
                  { label: 'All Tools',    count: ALL_TOOLS.length },
                  { label: 'Free',         count: ALL_TOOLS.filter(t => t.free).length },
                  { label: 'Paid',         count: ALL_TOOLS.filter(t => !t.free).length },
                ].map(({ label, count }) => (
                  <button key={label}
                    className="w-full flex items-center justify-between text-sm py-1.5 px-2 rounded-lg
                               text-ink-muted hover:text-ink hover:bg-surface-hover transition-colors text-left">
                    <span>{label}</span>
                    <span className="text-xs text-ink-faint">{count}</span>
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Categories</p>
                {CATEGORIES.map(cat => (
                  <button key={cat}
                    onClick={() => setActiveCategory(cat === activeCategory ? 'All' : cat)}
                    className={`w-full flex items-center justify-between text-sm py-1.5 px-2 rounded-lg
                                transition-colors text-left ${
                                  activeCategory === cat
                                    ? 'text-lime font-medium'
                                    : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
                                }`}
                    style={activeCategory === cat ? { background: 'rgba(168,230,61,0.08)' } : {}}>
                    <span>{cat}</span>
                    <span className={`text-xs ${activeCategory === cat ? 'text-lime' : 'text-ink-faint'}`}>
                      {catCount[cat] || 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* Pricing */}
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Pricing</p>
                {[
                  { label: 'Free', count: ALL_TOOLS.filter(t => t.free).length },
                  { label: 'Paid', count: ALL_TOOLS.filter(t => !t.free).length },
                ].map(({ label, count }) => (
                  <label key={label} className="flex items-center justify-between py-1.5 px-2 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input type="checkbox"
                        checked={pricing === label}
                        onChange={() => setPricing(pricing === label ? 'All' : label as 'Free' | 'Paid')}
                        className="accent-lime" />
                      <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">{label}</span>
                    </div>
                    <span className="text-xs text-ink-faint">{count}</span>
                  </label>
                ))}
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Sort By</p>
                {[
                  { label: 'Most Popular', value: 'popular' },
                  { label: 'Newest',       value: 'newest' },
                  { label: 'A–Z',          value: 'az' },
                ].map(({ label, value }) => (
                  <button key={value}
                    onClick={() => setSort(value as typeof sort)}
                    className={`w-full text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${
                      sort === value
                        ? 'text-lime font-medium'
                        : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
                    }`}
                    style={sort === value ? { background: 'rgba(168,230,61,0.08)' } : {}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <h2 className="font-poppins font-bold text-2xl text-ink">AI Tools Directory</h2>
              <p className="text-ink-muted text-sm mt-1">
                Discover the best AI tools to supercharge your workflow.
              </p>
            </div>

            {/* Category pill tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {(['All', ...CATEGORIES] as const).map(cat => (
                <button key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                    activeCategory === cat
                      ? 'text-lime font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  style={
                    activeCategory === cat
                      ? { borderColor: 'rgba(168,230,61,0.5)', background: 'rgba(168,230,61,0.08)' }
                      : { borderColor: '#2A2A2A', background: 'transparent' }
                  }>
                  {cat}
                </button>
              ))}
            </div>

            {/* Search + sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                </svg>
                <input type="text" value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Search AI tools..."
                  className="w-full rounded-xl px-4 py-2.5 pl-10 pr-16
                             text-ink placeholder-ink-faint text-sm focus:outline-none"
                  style={{ background: '#111111', border: '1px solid #2A2A2A' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(168,230,61,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#2A2A2A')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-faint
                                  rounded px-1.5 py-0.5 font-mono"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                  ⌘K
                </span>
              </div>
              <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
                className="rounded-xl px-4 py-2.5 text-ink text-sm focus:outline-none cursor-pointer"
                style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="az">A–Z</option>
              </select>
            </div>

            <p className="text-ink-muted text-sm mb-4">
              <span className="text-lime font-semibold">{filtered.length}</span> tools found
            </p>

            {filtered.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={`${activeCategory}-${q}-${sort}`}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
              >
                {filtered.map(tool => (
                  <motion.div key={tool.name} variants={cardVariants}
                    onClick={() => setActiveCard(activeCard === tool.name ? null : tool.name)}>
                    <ToolCard {...tool} active={activeCard === tool.name} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="rounded-2xl p-12 text-center"
                   style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <p className="font-poppins font-semibold text-ink">No tools found</p>
                <p className="text-ink-muted text-sm mt-1">Try a different search or category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
