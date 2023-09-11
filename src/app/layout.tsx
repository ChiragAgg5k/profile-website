import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
	title: 'Chirag Aggarwal',
	description: "Chirag Aggarwal's portfolio website built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
				{/* <link rel="icon" href="profile_pic.png" /> */}
			</head>
			<body suppressHydrationWarning={true}>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
