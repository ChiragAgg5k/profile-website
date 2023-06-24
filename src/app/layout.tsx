import Head from "next/head";
import "./globals.css";

export const metadata = {
	title: "Chirag Aggarwal",
	description: "Chirag Aggarwal's portfolio website built with Next.js"
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<Head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
				<link rel="icon" href="icon.png" />
			</Head>
			<body suppressHydrationWarning={true}>{children}</body>
		</html>
	);
}
