'use client';
import { ThemeProvider } from 'next-themes';
import NavBar from './NavBar';
import LandingPage from './LandingPage';
import ToolBox from './ToolBox';
import Projects from './Projects';
import ContactMe from './ContactMe';
import Education from './Education';
import AboutMe from './AboutMe';
import AnimatedCursor from 'react-animated-cursor';
import { useEffect, useState } from 'react';

export default function Home() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<ThemeProvider attribute="class" defaultTheme="dark">
			{mounted && (
				<AnimatedCursor
					innerSize={8}
					outerSize={35}
					innerScale={0}
					outerScale={1.5}
					outerAlpha={0}
					innerStyle={{
						backgroundColor: `var(--cursor-color)`,
					}}
					outerStyle={{
						border: `3px solid var(--cursor-color)`,
					}}
				/>
			)}

			<NavBar />
			<main className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white">
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
