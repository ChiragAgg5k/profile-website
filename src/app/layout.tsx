import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Chirag Aggarwal",
	description: "Chirag Aggarwal's portfolio website"
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
				<link rel="icon" href="icon.png" />
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
