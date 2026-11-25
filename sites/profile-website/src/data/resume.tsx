import { Icons } from "@/components/icons";
import { FileText, HomeIcon, NotebookIcon, TrendingUp } from "lucide-react";
import { DiPostgresql } from "react-icons/di";
import { FaDocker, FaNodeJs, FaPhp, FaPython } from "react-icons/fa";
import { SiAppwrite, SiGo, SiKubernetes } from "react-icons/si";

export const DATA = {
  name: "Chirag Aggarwal",
  initials: "CA",
  url: "https://www.chiragaggarwal.tech",
  location: "Limerick, Ireland",
  locationLink: "https://www.google.com/maps/place/Limerick,+Ireland",
  description:
    "Platform Engineer at Appwrite, building cool solutions with open source technologies.",
  summary:
    "I am Chirag Aggarwal, a **Platform Engineer** at Appwrite and an MSc Software Engineering student at the University of Limerick, based in Ireland. I build scalable, robust backend systems with open-source technologies and also enjoy working on the frontend when a project calls for it. I write about platform engineering, system architecture, and the tools I use day to day — latest articles on the [blog](/blog), usage data on [trends](/trends), and [developer resources](/developers) for agents.",
  // Plain-text, ~155 char summary used for meta/OpenGraph descriptions.
  // Keep it free of Markdown so it renders cleanly in search results.
  seoDescription:
    "Platform Engineer at Appwrite building scalable, robust backend systems with open-source tech. I also write about engineering, AI, and system architecture.",
  jobTitle: "Platform Engineer",
  twitterHandle: "@ChiragAgg5k",
  avatarUrl: "/me.webp",
  skills: [
    {
      name: "PHP",
      icon: <FaPhp className="size-3" />,
    },
    {
      name: "Go",
      icon: <SiGo className="size-3" />,
    },
    {
      name: "Typescript",
      icon: <Icons.typescript className="size-3" />,
    },
    {
      name: "Node.js",
      icon: <FaNodeJs className="size-3" />,
    },
    {
      name: "Python",
      icon: <FaPython className="size-3" />,
    },
    {
      name: "Postgres",
      icon: <DiPostgresql className="size-3" />,
    },
    {
      name: "Docker",
      icon: <FaDocker className="size-3" />,
    },
    {
      name: "Kubernetes",
      icon: <SiKubernetes className="size-3" />,
    },
    {
      name: "Appwrite",
      icon: <SiAppwrite className="size-3" />,
    },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
    { href: "/resume", icon: FileText, label: "Resume" },
    { href: "/trends", icon: TrendingUp, label: "Trends" },
  ],
  contact: {
    email: "chiragaggarwal5k@gmail.com",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/ChiragAgg5k",
        icon: Icons.github,

        navbar: true,
      },
      Cursor: {
        name: "Cursor",
        url: "https://cursor.com/@chiragagg5k",
        icon: Icons.cursor,

        navbar: false,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/chiragagg5k/",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/ChiragAgg5k",
        icon: Icons.x,

        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:chiragaggarwal5k@gmail.com",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Appwrite",
      href: "https://appwrite.io/",
      badges: [],
      location: "Remote",
      title: "Platform Engineer",
      logoUrl: "/work-experience/appwrite.png",
      start: "June 2025",
      end: "Present",
      description: [
        "- Build and run **Appwrite Cloud**: PHP/Swoole services on Kubernetes across **6 public regions**, plus the edge. On call for production incidents.",
        "- Rewrote the **Appwrite CLI in Go**, and maintain the SDKs for **11+ languages**.",
        "- Built Appwrite's hosted **MCP server**: OAuth 2.1, four tools over 981 endpoints.",
        "- Took **observability and synthetic monitoring** in-house on Prometheus, Grafana, Loki and OpenTelemetry.",
        "- **2,000+ merged PRs** across Appwrite's open-source and internal repos.",
        "---",
        "- Part-time (20 hours a week) during term while I study for my MSc.",
      ],
      links: [
        {
          type: "Website",
          href: "https://appwrite.io/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "GitHub",
          href: "https://github.com/appwrite/appwrite",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
    {
      company: "Appwrite",
      href: "https://appwrite.io/",
      badges: [],
      location: "Remote",
      title: "Engineering Intern",
      logoUrl: "/work-experience/appwrite.png",
      start: "December 2024",
      end: "May 2025",
      description: [
        "- Worked on the Appwrite CLI, SDKs and Cloud infrastructure before moving to a Platform Engineer role.",
      ],
      links: [],
    },
    {
      company: "Skillarena",
      href: "https://skillarena.in/",
      badges: [],
      location: "Remote",
      title: "Backend Developer Intern",
      logoUrl: "/work-experience/skillarena.png",
      start: "July 2024",
      end: "September 2024",
      description: [
        "- Improved and maintained core backend systems written in the **MERN** stack",
        "- Implemented a **real-time chat application** backend utilizing WebSockets and FastAPI",
      ],
      links: [
        {
          type: "Website",
          href: "https://skillarena.in/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Letter of Recommendation",
          href: "https://drive.google.com/file/d/1ONCudngptfuLZuR7hjSinbvVSr7fEnbd/view?usp=sharing",
          icon: <Icons.email className="size-3" />,
        },
      ],
    },
    {
      company: "Clearmind AI",
      badges: [],
      href: "https://www.clearmind.plus/",
      location: "Remote",
      title: "Full Stack Developer Intern",
      logoUrl: "/work-experience/clearmind.png",
      start: "October 2023",
      end: "December 2023",
      description: [
        "- Implemented **user feedback suggestions** such as more personalized recommendations, memory history etc.",
        "- Integrated a seamless payment gateway using **Stripe**",
      ],
      links: [
        {
          type: "Website",
          href: "https://www.clearmind.plus/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Letter of Recommendation",
          href: "https://drive.google.com/file/d/1cgXwtu__St6bJzZNiq7SId0kWw5UVdPc/view?usp=sharing",
          icon: <Icons.email className="size-3" />,
        },
      ],
    },
  ],
  education: [
    {
      school: "University of Limerick",
      href: "https://www.ul.ie/",
      degree: "Master of Science in Software Engineering",
      logoUrl: "/university-of-limerick.png",
      start: "Sep 2026",
      end: "Aug 2027 (expected)",
    },
    {
      school: "Bennett University",
      href: "https://bennett.edu.in/",
      degree:
        "Bachelor of Technology in Computer Science Engineering (AI) | 9.57 CGPA",
      logoUrl: "/bennett.png",
      start: "2022",
      end: "May 2026",
    },
    {
      school: "Bharti Public School",
      href: "https://www.bps.edu.in/",
      degree: "Senior Secondary (CBSE) | X - 91.2% | XII - 89.5%",
      logoUrl: "/bharti.jpg",
      start: "2010",
      end: "2022",
    },
  ],
  projects: [
    {
      title: "synthetics-operator",
      href: "https://github.com/loks0n/synthetics-operator",
      dates: "Apr 2026 - Nov 2026",
      active: true,
      description:
        "Kubernetes operator for synthetic monitoring: CRDs for HTTP, DNS and TCP probes, Playwright browser flows and k6 load tests, exported as Prometheus metrics. Used to monitor Appwrite Cloud.",
      technologies: ["Go", "Kubernetes", "Prometheus", "Playwright", "k6"],
      links: [
        {
          type: "Source",
          href: "https://github.com/loks0n/synthetics-operator",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
    {
      title: "layby",
      href: "https://github.com/ChiragAgg5k/layby",
      dates: "Jul 2026",
      active: false,
      description:
        "Declarative disposable sandbox environments from a mise.toml, on infrastructure you choose. Local Docker and DigitalOcean drivers, destroyed on a timer.",
      technologies: ["Go", "Docker", "DigitalOcean"],
      links: [
        {
          type: "Source",
          href: "https://github.com/ChiragAgg5k/layby",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
    {
      title: "kubectl-appwrite",
      href: "https://github.com/ChiragAgg5k/kubectl-appwrite",
      dates: "May 2026",
      active: false,
      description:
        "Read-only kubectl plugin that triages Appwrite deployments and surfaces broken, risky or suspicious workloads in a namespace at a glance.",
      technologies: ["Go", "Kubernetes"],
      links: [
        {
          type: "Source",
          href: "https://github.com/ChiragAgg5k/kubectl-appwrite",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
    {
      title: "docker-use",
      href: "https://github.com/ChiragAgg5k/docker-use",
      dates: "May 2026",
      active: false,
      description: "CLI to switch between multiple Docker Hub accounts.",
      technologies: ["Go", "Docker"],
      links: [
        {
          type: "Source",
          href: "https://github.com/ChiragAgg5k/docker-use",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
  ],
  positions: [
    {
      title: "Content Writer",
      dates: "July 2024 - October 2024",
      location: "GeeksForGeeks",
      description:
        "Wrote technical articles for GeeksforGeeks on Java, Django, Selenium and Firebase.",
      image: "/gfg.png",
      links: [
        {
          title: "Contributions",
          href: "https://www.geeksforgeeks.org/user/chiragaggarwal5k/contributions/",
        },
      ],
    },
    {
      title: "Summer Immersion Participant",
      dates: "July 2024",
      location: "FPT University, Da Nang, Vietnam",
      description:
        "Participated in a 10-day fully funded Summer Immersion Programme in Vietnam hosted by FPT University, providing rich insights into Vietnamese culture from an entrepreneurial and technological point of view.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_fpt_university.jpg",
      links: [
        {
          title: "Website",
          href: "https://international.fpt.edu.vn/",
        },
        {
          title: "Photos",
          href: "https://www.linkedin.com/posts/bennett-university_bennettuniversity-globalexposure-entrepreneurshipjourney-ugcPost-7232006796473683968-tKMa?utm_source=share&utm_medium=member_desktop",
        },
      ],
    },
    {
      title: "Technical Co-Head",
      dates: "August 2023 - May 2024",
      location: "Computer Society of India, Bennett University",
      description:
        "As the technical co-head of the CSI chapter of my university, I was responsible for organizing various events, workshops, and hackathons. I also mentored and guided students in their technical journey.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGnicMMBfXdQJrZy9RvzmnhzvVw1bgLTs_qA&s",
      links: [
        { title: "Website", href: "https://csiindia.org/" },
        {
          title: "LinkedIn",
          href: "https://www.linkedin.com/company/csi-india/",
        },
        {
          title: "Welcome Letter",
          href: "https://www.linkedin.com/posts/chiragagg5k_newrole-bennettuniversity-technology-activity-7097467074863636480-M1q6",
        },
      ],
    },
    {
      title: "Research Content Management",
      dates: "September 2022 - May 2023",
      location: "Bennett Undergraduate Research Society (BURS)",
      description:
        "The research society piqued my interest in the field of research, allowing me to be guided by seniors to work on various research related projects as well as organizing events like Rescon.",
      image: "/burs.png",
      links: [
        { title: "Website", href: "https://www.burs.bennett.edu.in/" },
        {
          title: "LinkedIn",
          href: "https://www.linkedin.com/company/buresearchsociety/posts/?feedView=all/",
        },
      ],
    },
  ],
  achievements: [
    {
      title: "Meetup at The Big Chill Cakery",
      dates: "August 2026",
      location: "Delhi NCR",
      image: "/achievements/big-chill-meetup.jpeg",
    },
    {
      title: "Summer Immersion in Vietnam",
      dates: "July 2024",
      location: "FPT University, Da Nang, Vietnam",
      image: "/achievements/summer-immersion.jpeg",
    },
    {
      title: "Github Constellation",
      dates: "June 2024",
      location: "Bangalore",
      image: "/achievements/github-constellation.jpeg",
    },
    {
      title: "Hackaccino",
      dates: "April 2024",
      location: "CSI Bennett University",
      image: "/achievements/hackaccino.jpeg",
    },
    {
      title: "HackWithDelhi",
      dates: "April 2024",
      location: "GL Bajaj Institute of Technology and Management",
      image: "/achievements/hackwithdelhi.jpeg",
    },
    {
      title: "HackCBS",
      dates: "November 2023",
      location: "Shaheed Sukhdev College of Business Studies",
      image: "/achievements/hackcbs.jpeg",
    },
    {
      title: "Luminous TechnoX Hackathon",
      dates: "December 2023",
      location: "Taj City Center, Gurugram",
      image: "/achievements/luminous.jpg",
    },
  ],
} as const;
