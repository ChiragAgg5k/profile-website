import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon, Play } from "lucide-react";

export const DATA = {
  name: "Chirag Aggarwal",
  initials: "CA",
  url: "https://www.chiragaggarwal.tech/",
  location: "Delhi NCR, India",
  locationLink: "https://maps.app.goo.gl/Zbzok1mCik445h1C6",
  description:
    "A developer building cool solutions with open source technologies.",
  summary:
    "I am Chirag Aggarwal, a third-year Bachelor of Technology student from India, currently studying Computer Science Engineering. As a **Full-stack Developer**, I enjoy both frontend and backend development equally. Additionally, I have a passion for content writing and conducting research on various topics, particularly in the fields of **Artificial Intelligence** and **Computer Vision**.",
  avatarUrl: "/me.jpg",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Node.js",
    "Python",
    "Postgres",
    "Docker",
    "Kubernetes",
    "Java",
    "C++",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "chiragaggarwal5k@gmail.com",
    tel: "+91 9667685415",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/ChiragAgg5k",
        icon: Icons.github,

        navbar: true,
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
      company: "Skillarena",
      href: "https://skillarena.in/",
      badges: [],
      location: "Remote",
      title: "Backend Developer",
      logoUrl: "/skillarena.png",
      start: "July 2024",
      end: "September 2024",
      description: `-Improved and maintained core backend systems written in the **MERN** stack
        -Implemented a **real-time chat application** backend utilizing WebSockets and FastAPI`,
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
      title: "Next.js Developer",
      logoUrl: "/clearmind.png",
      start: "October 2023",
      end: "December 2023",
      description: `-Implemented **user feedback suggestions** such as more personalized recommendations, memory history etc.
        -Integrated a seamless payment gateway using **Stripe**`,
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
      school: "Bennett University",
      href: "https://bennett.edu.in/",
      degree:
        "Bachelor's of Technology in Computer Science Engineering | 9.71 CGPA",
      logoUrl: "/bennett.png",
      start: "2022",
      end: "2026",
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
      title: "Suraksha AI",
      href: "https://github.com/ChiragAgg5k/suraksha-ai",
      dates: "Feb 2024 - May 2024",
      active: true,
      description:
        "An AI powered home security system providing accurate anomaly and threat detection along with real-time alerts and notifications.",
      technologies: ["Python", "Flask", "Firebase", "Chart.js", "YOLOv11"],
      links: [
        {
          type: "Source",
          href: "https://github.com/ChiragAgg5k/suraksha-ai",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/suraksha-ai.png",
    },
    {
      title: "Asclepius",
      href: "https://github.com/ChiragAgg5k/asclepius",
      dates: "Dec 2022 - Jan 2023",
      active: true,
      description:
        "A desktop application developed in Python and Custom Tkinter to view and request medicines from the Wellness center, check medicine availability, and order medicines directly.",
      technologies: ["Python", "Tkinter", "SQLite"],
      links: [
        {
          type: "Source",
          href: "https://github.com/ChiragAgg5k/asclepius",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/asclepius.png",
    },
    {
      title: "BU News",
      href: "https://github.com/ChiragAgg5k/bu-news-android",
      dates: "April 2023 - March 2024",
      active: true,
      description:
        "A news sharing platform targetting university students in particular, aiming to reduce spread of misinformation.",
      technologies: ["Java", "XML", "Firebase", "Android Studio"],
      links: [
        {
          type: "Source",
          href: "https://github.com/ChiragAgg5k/bu-news-android",
          icon: <Icons.github className="size-3" />,
        },
        {
          type: "Play Store",
          href: "https://play.google.com/store/apps/details?id=com.chiragagg5k.bu_news_android",
          icon: <Play className="size-3" />,
        },
      ],
      image: "/bu-news.png",
    },
    {
      title: "Cal Buddy",
      href: "https://cal-buddy.vercel.app/",
      dates: "September 2024 - October 2024",
      active: true,
      description:
        "Cal Buddy is a smart calendar assistant that helps you schedule, manage, and chat with your calendar. Boost your productivity with AI-powered task management.",
      technologies: ["Next.js", "Typescript", "CopilotKit", "LLaMa3.2"],
      links: [
        {
          type: "Website",
          href: "https://cal-buddy.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/ChiragAgg5k/cal-buddy",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/cal-buddy.png",
    },
  ],
  positions: [
    {
      title: "Content Writer",
      dates: "July 2024 - Present",
      location: "GeeksForGeeks",
      description:
        "I like to write technical articles for GeeksForGeeks in my past time. Let's me be updated with various kinds of technologies.",
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
        "Participated in a 10-day fully funded Summer Immersion Programme in Vietnam hosted by FPT University, providing rich insights into Vietnamese culture from a entrepreneurship and technological point of view.",
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
      title: "Rearch Content Management",
      dates: "September 2022 - May 2023",
      location: "Bennett Undergraduate Research Society (BURS)",
      description:
        "The research society peaked my interest in the field of research, allowing me to be guided by seniors to work on various research related projects as well as organizing events like Rescon.",
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
} as const;
