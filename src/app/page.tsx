"use client";
import { ThemeProvider } from "next-themes";
import NavBar from "./NavBar";
import LandingPage from "./LandingPage";
import ToolBox from "./ToolBox";
import Projects from "./Projects";

export default function Home() {
	return (
		<ThemeProvider attribute="class" defaultTheme="dark">
			<main className="bg-white font-geologica text-gray-800 dark:bg-gray-900 dark:text-white">
				{/* Main Section, covers entire screen */}
				<section>
					<NavBar />
					<LandingPage />
				</section>

				{/* Skills Section */}
				<section className="min	-h-screen pb-20">
					<ToolBox />
					<Projects />
				</section>
			</main>
		</ThemeProvider>
	);
}
