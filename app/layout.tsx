import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space_grotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-grotesk",
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${space_grotesk.variable} ${inter.variable}`}>
				{children}
			</body>
		</html>
	);
}
