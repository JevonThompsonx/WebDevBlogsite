import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "personal-site",
    title: "Current Portfolio & Blog Rewrite",
    description:
      "A Next.js rebuild of my personal site that presents my work as a systems administrator with a strong web development background.",
    longDescription:
      "This rewrite replaces my older Express and EJS portfolio with a modern Next.js application. It adds a protected admin workflow, a database-backed blog, better SEO, and a clearer way to present both my self-hosted infrastructure work and my web projects.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Drizzle ORM",
      "Auth.js",
      "Vercel",
      "Turso",
    ],
    highlights: [
      "Rebuilt an older Node and Express portfolio into a modern App Router application.",
      "Added protected blog administration with GitHub OAuth and a database-backed publishing workflow.",
      "Improved SEO, metadata, RSS, sitemap generation, and content structure for long-form writing.",
    ],
    githubUrl: "https://github.com/JevonThompsonx/WebDevBlogsite",
    liveUrl: "https://web-dev-blogsite.vercel.app/",
    image: "/images/mySite.webp",
    featured: true,
    order: 1,
  },
  {
    slug: "personal-site-archived",
    title: "Personal Site Archive",
    description:
      "The original Express and EJS version of my portfolio, preserved as an archived snapshot before the rewrite.",
    longDescription:
      "This archived build was my original personal site and public project hub. It served as a portfolio, resume, and blog built with Node.js, Express, EJS, and custom CSS, including theme-aware styling and automated deployment workflows. It represents the foundation I later rebuilt into the current Next.js site.",
    techStack: [
      "Node.js",
      "Express",
      "EJS",
      "CSS",
      "GitHub Actions",
      "Google Cloud",
    ],
    highlights: [
      "Hosted my early portfolio, resume, and public project showcase.",
      "Used Express routing and EJS templates to serve themed pages and project views.",
      "Included automated deployment workflows and theme-aware color behavior.",
    ],
    liveUrl: "https://web-dev-blog-archive.vercel.app/",
    image: "/images/mySite.webp",
    featured: false,
    order: 2,
  },
  {
    slug: "proxmox-media-automation-platform",
    title: "Proxmox Media & Automation Platform",
    description:
      "A self-hosted media and automation environment running on a multi-node Proxmox cluster with secure remote access and containerized services.",
    longDescription:
      "This project centers on designing and maintaining a private self-hosted platform on top of a six-node Proxmox cluster. I use it to practice virtualization, service isolation, remote access, storage planning, and operational reliability. The stack includes media streaming, request management, transcoding, and supporting automation services, but this portfolio intentionally avoids publishing internal endpoints, topology details, or anything else that would create unnecessary attack surface.",
    techStack: [
      "Proxmox",
      "Linux",
      "Docker Compose",
      "Jellyfin",
      "Tdarr",
      "Tailscale",
      "Cloudflare Tunnel",
    ],
    highlights: [
      "Built and operated a six-node Proxmox cluster for hosting services and infrastructure experimentation.",
      "Containerized a private media and automation stack with secure remote access through Tailscale and Cloudflare.",
      "Focused on service separation, remote administration, and safe external exposure without publishing internal endpoints.",
    ],
    accessNote:
      "This is a private infrastructure project. Public URLs and operational details are intentionally omitted for security.",
    resourceLinks: [
      {
        label: "Proxmox VE",
        url: "https://www.proxmox.com/en/proxmox-virtual-environment/overview",
      },
      { label: "Jellyfin", url: "https://jellyfin.org/" },
      { label: "Tdarr", url: "https://home.tdarr.io/" },
      { label: "Tailscale", url: "https://tailscale.com/" },
      {
        label: "Cloudflare Tunnel",
        url: "https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/",
      },
    ],
    image: "/images/proxmox.webp",
    featured: true,
    order: 3,
  },
  {
    slug: "private-cloud-collaboration-platform",
    title: "Private Cloud Collaboration Platform",
    description:
      "A self-hosted Ubuntu platform combining Nextcloud, Immich, and Docker Compose for file sync, notes, calendar workflows, and private photo management.",
    longDescription:
      "This project is a private collaboration and storage environment built around a bare metal Ubuntu host. I use it as a personal file server and knowledge-management platform through Nextcloud, plus a separate Immich deployment for photo management. Services are exposed through secure remote-access patterns, while public writeups stay intentionally high level so the portfolio shows architecture decisions without exposing useful attack-surface details.",
    techStack: [
      "Ubuntu",
      "Docker Compose",
      "Nextcloud",
      "Immich",
      "WebDAV",
      "Tailscale",
      "Cloudflare Tunnel",
    ],
    highlights: [
      "Runs on bare metal Ubuntu with services managed through Docker Compose.",
      "Supports notes, calendar, task tracking, WebDAV file access, and private photo management.",
      "Balances convenience and security by documenting the architecture publicly without exposing sensitive endpoints.",
    ],
    accessNote:
      "This is a private self-hosted platform. Public URLs and configuration specifics are intentionally withheld.",
    resourceLinks: [
      { label: "Nextcloud", url: "https://nextcloud.com/" },
      { label: "Immich", url: "https://immich.app/" },
      { label: "Docker Compose", url: "https://docs.docker.com/compose/" },
      { label: "Tailscale", url: "https://tailscale.com/" },
    ],
    image: "/images/bareMetal.webp",
    featured: true,
    order: 4,
  },
  {
    slug: "sunline-tic-tac-toe",
    title: "Sunline Tic Tac Toe",
    description:
      "A polished React and TypeScript single-page app with AI difficulty modes, score tracking, and theme persistence.",
    longDescription:
      "Sunline Tic Tac Toe is a modern frontend project focused on interaction design and state management. It supports player-versus-player and player-versus-AI modes, tracks scores across rounds, preserves the selected theme, and detects drawn games early when no future win path remains.",
    techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Vitest"],
    highlights: [
      "Built both player-versus-player and player-versus-AI game flows.",
      "Added easy, medium, and hard AI difficulties with score tracking across rounds.",
      "Included persistent theme state and early stalemate detection for a smoother UX.",
    ],
    image: "/images/tictactoe.webp",
    featured: false,
    order: 5,
  },
  {
    slug: "steam-non-steam-game-manager",
    title: "Steam Non-Steam Game Manager",
    description:
      "An interactive Windows CLI that manages non-Steam shortcuts, repairs broken entries, and downloads SteamGridDB artwork.",
    longDescription:
      "This Python project automates one of the more annoying parts of managing a large Windows game library: keeping non-Steam shortcuts clean inside Steam. It discovers Steam installations and user IDs, reads and writes the binary shortcuts file, creates backups before changes, scans configured drives for games, fixes broken fields, and can download artwork into Steam's grid directory. The result is a more reliable workflow for managing custom shortcuts without editing Steam data by hand.",
    techStack: [
      "Python",
      "Windows CLI",
      "Steam VDF",
      "SteamGridDB",
      "Automation",
    ],
    highlights: [
      "Automatically detects Steam install paths and Steam user IDs.",
      "Repairs broken shortcut fields and creates timestamped backups before every write.",
      "Scans configured drives for games and downloads matching artwork into Steam's grid directory.",
    ],
    githubUrl:
      "https://github.com/JevonThompsonx/Add-Non-Steam-Games/tree/main",
    featured: false,
    order: 6,
  },
  {
    slug: "carolina-heals",
    title: "Carolina Heals",
    description:
      "A client-facing wellness site centered on clarity, discoverability, and frictionless booking.",
    longDescription:
      "Carolina Heals was built to help visitors quickly understand services and book sessions without confusion. I focused on responsiveness, accessible structure, and SEO-minded content presentation while integrating Calendly for scheduling.",
    techStack: ["HTML", "CSS", "Bootstrap", "JavaScript", "Calendly"],
    liveUrl: "https://www.carolinaheals.com",
    githubUrl: "https://carolina-two.vercel.app",
    image: "/images/proj-carolina.webp",
    featured: true,
    order: 7,
  },
  {
    slug: "linktree-clone",
    title: "Linktree Clone",
    description:
      "A lightweight social landing page with responsive layout work and small interactive touches.",
    longDescription:
      "This clone sharpened my layout fundamentals and helped me practice translating a familiar product into a clean responsive build. It includes a simple share interaction and a mobile-friendly layout.",
    techStack: ["HTML", "CSS", "Bootstrap", "JavaScript"],
    liveUrl: "https://link-tree-clone-mu.vercel.app/",
    githubUrl: "https://github.com/JevonThompsonx/LinkTree-Clone",
    image: "/images/proj-linktree.webp",
    featured: false,
    order: 8,
  },
  {
    slug: "ping-pong-score-tracker",
    title: "Ping Pong Score Tracker",
    description:
      "A small DOM-driven scoreboard app that focuses on state changes, limits, and reset behavior.",
    longDescription:
      "This project helped me get comfortable with direct DOM manipulation and application state. The interface keeps score updates clear while enforcing the selected maximum score and supporting instant resets.",
    techStack: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://jevonthompsonx.github.io/PingPongProject/",
    githubUrl: "https://github.com/JevonThompsonx/PingPongProject",
    image: "/images/proj-ping.webp",
    featured: false,
    order: 9,
  },
  {
    slug: "tv-show-search",
    title: "TV Show Search",
    description:
      "An API-powered search experience that renders poster art, titles, and genre data from TV Maze.",
    longDescription:
      "TV Show Search was an early API integration project where I practiced search flows, async requests, and rendering remote data into the page. It presents posters and genre details from the TV Maze API in a simple browsable format.",
    techStack: ["HTML", "CSS", "JavaScript", "TV Maze API"],
    liveUrl: "https://jevonthompsonx.github.io/TV-Show-Search/",
    githubUrl: "https://github.com/JevonThompsonx/TV-Show-Search",
    image: "/images/tv.webp",
    featured: false,
    order: 10,
  },
  {
    slug: "dictionary-api",
    title: "Dictionary API",
    description:
      "A responsive dictionary search tool with theme toggling and live API-backed definitions.",
    longDescription:
      "This app gave me a chance to combine a responsive Bootstrap layout with custom JavaScript interactions. It supports searching definitions through the Dictionary API and includes a dark mode toggle for a more personal UI.",
    techStack: ["HTML", "CSS", "Bootstrap", "JavaScript", "Dictionary API"],
    liveUrl: "https://jevonthompsonx.github.io/DictionaryAPI/",
    githubUrl: "https://github.com/JevonThompsonx/DictionaryAPI",
    image: "/images/proj-dict.webp",
    featured: false,
    order: 11,
  },
];
