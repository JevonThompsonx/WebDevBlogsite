import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "personal-site",
    title: "Personal Blog & Portfolio",
    description:
      "A full-stack rewrite of my portfolio into a Next.js app with a real CMS-style blog, protected admin tools, and polished content design.",
    longDescription:
      "This project turns my old Express and EJS portfolio into a modern App Router experience. It focuses on strong SEO, a better reading experience for technical writing, and a production-ready blog workflow with authentication and persistence.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Drizzle ORM",
      "Auth.js",
    ],
    githubUrl: "https://github.com/JevonThompsonx/WebDevBlogsite",
    image: "/images/mySite.webp",
    featured: true,
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
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
    featured: true,
    order: 5,
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
    order: 6,
  },
];
