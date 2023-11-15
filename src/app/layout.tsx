import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Geologica } from 'next/font/google';

const montserrat = Geologica({
	subsets: ['latin'],
});

export const metadata = {
	title: 'Chirag Aggarwal',
	description: "Hi There! I'm a student at Bennett University in Greater Noida, India...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
			</head>
			<body suppressHydrationWarning={true} className={montserrat.className}>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
