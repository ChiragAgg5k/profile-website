import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AiFillGithub, AiFillCloseCircle } from 'react-icons/ai';
import Fade from 'react-reveal/Fade';
import { useTheme } from 'next-themes';

interface Project {
	index: number;
	image: string;
	image_dark: string;
	description: string;
	name: string;
	demo_link: string;
	github_link: string;
}

export default function Projects() {
	const [modalImg, setModalImg] = useState<string | undefined>(undefined);
	const [showModal, setShowModal] = useState<boolean>(false);
	const { theme } = useTheme();

	useEffect(() => {
		const closeOnEscapeKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setModalImg(undefined);
			}
		};
		window.addEventListener('keydown', closeOnEscapeKey);
		return () => window.removeEventListener('keydown', closeOnEscapeKey);
	}, []);

	useEffect(() => {
		if (modalImg === undefined) {
			setShowModal(false);
		} else {
			setShowModal(true);
		}
	}, [modalImg]);

	const projects: Project[] = [
		{
			index: 0,
			image: '/project_thumbnails/light/asclepius.png',
			image_dark: '/project_thumbnails/dark/asclepius.png',
			description: 'Desktop Application',
			name: 'Asclepius',
			demo_link: '#',
			github_link: 'https://github.com/ChiragAgg5k/asclepius',
		},
		{
			index: 1,
			image: '/project_thumbnails/spot-clone.png',
			image_dark: '/project_thumbnails/spot-clone.png',
			description: 'Web Application',
			name: 'Spot Clone',
			demo_link: 'https://spot-clonee.netlify.app/',
			github_link: 'https://github.com/ChiragAgg5k/spot-clone',
		},
		{
			index: 2,
			image: '/project_thumbnails/light/bu-news-android.png',
			image_dark: '/project_thumbnails/dark/bu-news-android.png',
			description: 'Android Application',
			name: 'BU News',
			demo_link: '#',
			github_link: 'https://github.com/ChiragAgg5k/bu-news-android',
		},
		{
			index: 3,
			image: '/project_thumbnails/light/bu-news.png',
			image_dark: '/project_thumbnails/dark/bu-news.png',
			description: 'Web Application',
			name: 'BU News',
			demo_link: 'https://bu-news.vercel.app/',
			github_link: 'https://github.com/ChiragAgg5k/bu-news-website',
		},
		{
			index: 4,
			image: '/project_thumbnails/light/weatherly.png',
			image_dark: '/project_thumbnails/dark/weatherly.png',
			description: 'Web Application',
			name: 'Weatherly',
			demo_link: 'https://weatherrly.vercel.app/',
			github_link: 'https://github.com/ChiragAgg5k/weatherly',
		},
	];

	return (
		<>
			<div className="mb-32">
				<h1 className="mb-16 cursor-default text-center text-4xl font-medium text-gray-800 transition duration-300 dark:text-white lg:mb-20 xl:mb-24">
					Projects
				</h1>
				<div className="mx-0 grid grid-cols-1 sm:grid-cols-2 md:mx-10 lg:grid-cols-3">
					<Fade bottom cascade>
						{projects.map((project, index) => {
							return (
								<div
									key={project.index}
									className="m-5 rounded-xl border-2 border-cyan-200 p-5 text-gray-700 hover:border-cyan-500  dark:border-gray-800 dark:text-white dark:hover:border-cyan-700"
								>
									<Image
										src={theme === 'dark' ? project.image_dark : project.image}
										alt={project.name}
										width={300}
										height={300}
										title="Click to enlarge"
										onClick={() => {
											setModalImg(theme === 'dark' ? project.image_dark : project.image);
										}}
										className="mb-4 h-auto max-h-56 w-full transform rounded-lg object-cover transition duration-500 ease-in-out hover:cursor-pointer"
									/>
									<div>
										<p className="mb-2 cursor-default text-base text-cyan-600 dark:text-cyan-500">
											{project.description}
										</p>
										<p className="my-1 text-xl font-medium">{project.name}</p>
										<div className="flex justify-between">
											<a
												className="text-sm  hover:underline"
												href={project.demo_link}
												aria-label="Visit Demo"
												onClick={
													project.demo_link === '#'
														? (e) => {
																e.preventDefault();
														  }
														: (e) => {
																e.preventDefault();
																window.open(project.demo_link, '_blank');
														  }
												}
											>
												{project.demo_link === '#' ? '' : 'Visit'}
											</a>
											<Link
												href={project.github_link}
												rel="noreferrer"
												title="Github Link"
												target="_blank"
											>
												<AiFillGithub className="inline-block text-4xl text-black transition delay-75 ease-in-out hover:scale-110 dark:text-white" />
											</Link>
										</div>
									</div>
								</div>
							);
						})}
					</Fade>
				</div>
			</div>
			<div
				id="modal"
				className={`fixed left-0 top-0 z-10 h-screen w-screen items-center justify-center bg-black/70 ${
					showModal ? 'flex' : 'hidden'
				}
				`}
				onClick={() => {
					setModalImg(undefined);
				}}
			>
				<div className="relative h-full w-full sm:m-10 lg:m-20">
					<Image id="modal-img" fill alt="" src={modalImg ? modalImg : ''} className="object-contain" />
				</div>
			</div>
		</>
	);
}
