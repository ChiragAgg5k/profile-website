"use client";
import { ThemeProvider } from "next-themes";
import NavBar from "./NavBar";
import LandingPage from "./LandingPage";
import ToolBox from "./ToolBox";

export default function Home() {
	return (
		<ThemeProvider attribute="class">
			<main className="bg-white font-geologica text-gray-800 dark:bg-gray-900 dark:text-white">
				{/* Main Section, covers entire screen */}
				<section>
					<NavBar />
					<LandingPage />
				</section>

				{/* Skills Section */}
				<section className="min-h-screen">
					<ToolBox />
					<h5 className="my-20 text-center">
						Rest is work in progres...
					</h5>
				</section>
			</main>
		</ThemeProvider>
	);
}
