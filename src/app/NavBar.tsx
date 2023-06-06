"use client";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useTheme } from "next-themes";

export default function NavBar() {
	const { systemTheme, theme, setTheme } = useTheme();
	const currentTheme = theme === "system" ? systemTheme : theme;

	return (
		<nav className="mb-10 flex w-full items-center justify-between bg-cyan-100 p-8 dark:bg-gray-800 md:absolute">
			<h1 className="cursor-default text-xl">ChiragAgg5k</h1>
			<ul className="flex items-center">
				<li>
					<BsFillMoonStarsFill
						className="cursor-pointer text-2xl hover:text-cyan-600 dark:hover:text-cyan-500"
						onClick={() =>
							theme === "dark"
								? setTheme("light")
								: setTheme("dark")
						}
					/>
				</li>
				<li>
					<a
						className="ml-10 rounded bg-cyan-500 px-5 py-2 text-white"
						href="#">
						Resume
					</a>
				</li>
			</ul>
		</nav>
	);
}
