'use client';
import { ThemeProvider } from 'next-themes';
import NavBar from './NavBar';
import LandingPage from './LandingPage';
import ToolBox from './ToolBox';
import Projects from './Projects';
import ContactMe from './ContactMe';
import Education from './Education';
import AboutMe from './AboutMe';

export default function Home() {
	return (
		<ThemeProvider attribute="class" defaultTheme="dark">
			<NavBar />
			<main className="bg-white font-geologica text-gray-800 dark:bg-gray-900 dark:text-white">
				{/* Front Section, covers entire screen */}
				<section>
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
				<section>
					<ContactMe />
				</section>
			</main>
		</ThemeProvider>
	);
}
