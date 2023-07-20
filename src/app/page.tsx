"use client";
import { ThemeProvider } from "next-themes";
import NavBar from "./NavBar";
import LandingPage from "./LandingPage";
import ToolBox from "./ToolBox";
import Projects from "./Projects";
import ContactMe from "./ContactMe";
import Education from "./Education";
import AboutMe from "./AboutMe";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main className="bg-white font-geologica text-gray-800 dark:bg-gray-900 dark:text-white">
        {/* Front Section, covers entire screen */}
        <section>
          <NavBar />
          <LandingPage />
        </section>

        {/* Main Section */}
        <section>
          <AboutMe />
          <Education />
          <ToolBox />
          <Projects />
        </section>

        {/* Footer/Contact Me Section */}
        <ContactMe />
      </main>
    </ThemeProvider>
  );
}
