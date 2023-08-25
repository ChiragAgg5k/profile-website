'use client';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import { AiOutlineMenu } from 'react-icons/ai';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { animateScroll, Link } from 'react-scroll';

function navLinks(){
	return (
		<>
			<li className="scroll-link pt-2 mb-1 mr-4 sm:my-0 sm:pt-0">
				<Link
					to="about-me"
					smooth={true}
					offset={-120}
					duration={500}
					onClick={() => {
						const navbar = document.querySelector('#toggle-navbar');
						if (navbar) {
							navbar.classList.add('hidden');
						}
					}}
					className="group text-base transition duration-300 hover:cursor-pointer"
				>
					About Me
					<span className="block h-[1px] max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
				</Link>
			</li>

			<li className="scroll-link my-1 mr-4 sm:my-0">
				<Link
					to="education"
					smooth={true}
					offset={-120}
					duration={500}
					onClick={() => {
						const navbar = document.querySelector('#toggle-navbar');
						if (navbar) {
							navbar.classList.add('hidden');
						}
					}}
					className="group text-base transition duration-300 hover:cursor-pointer"
				>
					Education
					<span className="block h-[1px] max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
				</Link>
			</li>

			<li className="scroll-link my-1 mr-4 sm:my-0">
				<Link
					to="toolbox"
					smooth={true}
					offset={-120}
					duration={500}
					onClick={() => {
						const navbar = document.querySelector('#toggle-navbar');
						if (navbar) {
							navbar.classList.add('hidden');
						}
					}}
					className="group text-base transition duration-300 hover:cursor-pointer"
				>
					Toolbox
					<span className="block h-[1px] max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
				</Link>
			</li>

			<li className="scroll-link my-1 mr-4 sm:my-0">
				<Link
					to="projects"
					smooth={true}
					offset={-120}
					duration={500}
					onClick={() => {
						const navbar = document.querySelector('#toggle-navbar');
						if (navbar) {
							navbar.classList.add('hidden');
						}
					}}
					className="group text-base transition duration-300 hover:cursor-pointer"
				>
					Projects
					<span className="block h-[1px] max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
				</Link>
			</li>

			<li className="scroll-link pb-4 mt-1 mr-6 sm:my-0 sm:pb-0">
				<button
					onClick={() => {
						animateScroll.scrollToBottom();
						const navbar = document.querySelector('#toggle-navbar');
						if (navbar) {
							navbar.classList.add('hidden');
						}
					}}
					className="group w-full text-base transition duration-300 hover:cursor-pointer"
				>
					Contact
					<span className="block h-[1px] max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
				</button>
			</li>
		</>
	);
}

export default function NavBar() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// When mounted on client, now we can show the UI
	useEffect(() => setMounted(true), []);

	// decrease navbar height on scroll
	useEffect(() => {
		const handleScroll = () => {
			const navbar = document.querySelector('nav');

			if (navbar) {
				if (window.scrollY > 100) {
					navbar.classList.add('py-5');
					navbar.classList.remove('py-8');
				} else {
					navbar.classList.add('py-8');
					navbar.classList.remove('py-5');
				}
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<>
			<nav
				className="sticky top-0 z-10 h-[10dvh] w-full border-b-2 border-cyan-400 bg-cyan-100 px-8 transition-all ease-in-out dark:border-0 dark:bg-gray-800"
				id="horizontal-navbar"
			>
				<div className="flex h-full w-full items-center justify-between">
					<button
						onClick={() => animateScroll.scrollToTop()}
						className="group text-lg text-gray-700 transition duration-300 dark:text-white sm:text-xl"
					>
						ChiragAgg5k
						<span className="block h-0.5 max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
					</button>
					<div className="flex">
						<AiOutlineMenu
							className="mr-4 block text-2xl hover:cursor-pointer sm:hidden"
							onClick={() => {
								const navbar = document.querySelector('#toggle-navbar');

								if (navbar) {
									navbar.classList.toggle('hidden');
								}
							}}
						/>
						<ul className="hidden items-center justify-center sm:flex flex-row">{navLinks()}</ul>

						{
							// Only show dark mode toggle if mounted and can be toggled
							mounted && (
								<button>
									{theme === 'dark' ? (
										<motion.div
											whileHover={{ scale: 1.2, rotate: 90 }}
											whileTap={{
												scale: 0.8,
												rotate: -90,
												borderRadius: '100%',
											}}
										>
											<BsFillMoonStarsFill
												title="Toggle Light Mode"
												className="cursor-pointer text-lg  hover:text-cyan-600 dark:hover:text-cyan-500 sm:text-2xl"
												onClick={() => setTheme('light')}
											/>
										</motion.div>
									) : (
										<motion.div
											whileHover={{ scale: 1.2, rotate: 90 }}
											whileTap={{
												scale: 0.8,
												rotate: -90,
												borderRadius: '100%',
											}}
										>
											<BsFillSunFill
												title="Toggle Dark Mode"
												className="cursor-pointer text-lg text-gray-700  hover:text-cyan-600 dark:hover:text-cyan-500 sm:text-2xl"
												onClick={() => setTheme('dark')}
											/>
										</motion.div>
									)}
								</button>
							)
						}
					</div>
				</div>
			</nav>
			<ul
				id="toggle-navbar"
				className="hidden border-cyan-400 bg-cyan-100 text-center transition-all ease-in-out dark:border-0 dark:bg-gray-800"
			>
				{navLinks()}
			</ul>
		</>
	);
}
