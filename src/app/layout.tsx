import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Geologica } from 'next/font/google';
import React from 'react';

const geologica = Geologica({
	subsets: ['latin'],
	display: 'swap',
	adjustFontFallback: false,
});

export const metadata = {
	title: 'Chirag Aggarwal',
	description:
		"Showcasing the projects, skills, and achievements of Chirag Aggarwal, a talented computer science engineering student from India. Explore Chirag Aggarwal's expertise in programming, problem-solving, and technical development through this carefully curated portfolio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body suppressHydrationWarning={true} className={geologica.className}>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
