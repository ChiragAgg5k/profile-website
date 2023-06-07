"use client";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useTheme } from "next-themes";

export default function NavBar() {
	const { systemTheme, theme, setTheme } = useTheme();
	const currentTheme = theme === "system" ? systemTheme : theme;

	return (
		<nav className="mb-10 flex w-full items-center justify-between bg-cyan-100 p-8 dark:bg-gray-800 md:absolute">
			<h1 className="cursor-default text-lg sm:text-xl">ChiragAgg5k</h1>
			<ul className="flex items-center">
				<li>
					<BsFillMoonStarsFill
						className="cursor-pointer text-xl  hover:text-cyan-600 dark:hover:text-cyan-500 sm:text-2xl"
						onClick={() =>
							theme === "dark"
								? setTheme("light")
								: setTheme("dark")
						}
					/>
				</li>
				<li>
					<a
						className="ml-5 rounded bg-cyan-700 px-5 py-2  text-sm text-white sm:text-base"
						href="#">
						Resume
					</a>
				</li>
			</ul>
		</nav>
	);
}
