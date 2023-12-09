'use client';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import { AiOutlineMenu } from 'react-icons/ai';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { animateScroll, Link } from 'react-scroll';

function navLinks() {
	return (
		<>
			<li className="scroll-link mt-4 sm:my-0 sm:mr-4">
				<Link
					to="about-me"
					smooth={true}
					offset={-160}
					duration={500}
					onClick={() => {
						const navbar = document.querySelector('#toggle-navbar');
						if (navbar) {
							navbar.classList.add('hidden');
						}
					}}
					className="group transition duration-300 hover:cursor-pointer"
				>
					About Me
					<span className="block h-[1px] max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
				</Link>
			</li>

			<li className="scroll-link sm:my-0 sm:mr-4">
				<Link
					to="education"
					smooth={true}
					offset={-200}
					duration={500}
					onClick={() => {
						const navbar = document.querySelector('#toggle-navbar');
						if (navbar) {
							navbar.classList.add('hidden');
						}
					}}
					className="group transition duration-300 hover:cursor-pointer"
				>
					Education
					<span className="block h-[1px] max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
				</Link>
			</li>

			<li className="scroll-link my-1 sm:my-0 sm:mr-4">
				<Link
					to="toolbox"
					smooth={true}
					offset={-200}
					duration={500}
					onClick={() => {
						const navbar = document.querySelector('#toggle-navbar');
						if (navbar) {
							navbar.classList.add('hidden');
						}
					}}
					className="group transition duration-300 hover:cursor-pointer"
				>
					Toolbox
					<span className="block h-[1px] max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
				</Link>
			</li>

			<li className="scroll-link my-1 sm:my-0 sm:mr-4">
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
					className="group transition duration-300 hover:cursor-pointer"
				>
					Projects
					<span className="block h-[1px] max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
				</Link>
			</li>

			<li className="scroll-link my-1 sm:my-0 sm:mr-4">
				<button
					onClick={() => {
						animateScroll.scrollToBottom();
						const navbar = document.querySelector('#toggle-navbar');
						if (navbar) {
							navbar.classList.add('hidden');
						}
					}}
					className="group w-full transition duration-300 hover:cursor-pointer"
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
			const horizontalNavbar = document.querySelector('#horizontal-navbar');

			if (navbar) {
				if (window.scrollY > 100) {
					navbar.classList.add('py-5');
					navbar.classList.remove('py-8');
				} else {
					navbar.classList.add('py-8');
					navbar.classList.remove('py-5');
				}
			}

			if (horizontalNavbar) {
				if (window.scrollY > 100) {
					horizontalNavbar.classList.add('py-5');
					horizontalNavbar.classList.remove('py-8');
				} else {
					horizontalNavbar.classList.add('py-8');
					horizontalNavbar.classList.remove('py-5');
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
				className="sticky top-0 z-10 w-full border-b-2 border-cyan-400 bg-cyan-100 px-8 py-8 text-gray-700 transition-all ease-in-out dark:border-0 dark:bg-gray-800 dark:text-white md:fixed"
				id="horizontal-navbar"
			>
				<div className="flex w-full items-center justify-between">
					<button
						onClick={() => animateScroll.scrollToTop()}
						className="group text-lg transition duration-300 sm:text-xl"
					>
						ChiragAgg5k
						<span className="block h-0.5 max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
					</button>
					<div className="flex">
						<AiOutlineMenu
							className="mr-4 block text-2xl transition-all duration-300 ease-in-out hover:cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-500 md:hidden"
							onClick={() => {
								const navbar = document.querySelector('#toggle-navbar');
								const horizontalNavbar = document.querySelector('#horizontal-navbar');

								if (navbar) {
									navbar.classList.toggle('hidden');
								}

								if (horizontalNavbar) {
									horizontalNavbar.classList.toggle('pb-8');
									horizontalNavbar.classList.toggle('pb-4');
								}
							}}
						/>
						<ul className="hidden flex-col items-center text-base md:flex md:flex-row">{navLinks()}</ul>

						{
							// Only show dark mode toggle if mounted and can be toggled
							mounted && (
								<button className={`ml-2`}>
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
				<div className={`flex w-full items-center justify-center`}>
					<ul id="toggle-navbar" className="hidden w-fit space-y-2 text-center text-sm">
						{navLinks()}
					</ul>
				</div>
			</nav>
		</>
	);
}
