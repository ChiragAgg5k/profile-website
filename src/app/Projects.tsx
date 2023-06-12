import Image from "next/image";
import { AiFillGithub } from "react-icons/ai";

interface Project {
	index: number;
	image: string;
	description: string;
	name: string;
	demo_link: string;
	github_link: string;
}

export default function Projects() {
	const projects: Project[] = [
		{
			index: 0,
			image: "https://github.com/ChiragAgg5k/asclepius/blob/master/assets/images/thumbnail.png?raw=true",
			description: "Desktop Application",
			name: "Asclepius",
			demo_link: "#",
			github_link: "https://github.com/ChiragAgg5k/asclepius"
		},
		{
			index: 1,
			image: "https://github.com/ChiragAgg5k/bu-news-android/blob/master/screenshots/screenshot_2.png?raw=true",
			description: "Android Application",
			name: "BU News",
			demo_link: "#",
			github_link: "https://github.com/ChiragAgg5k/bu-news-android"
		},
		{
			index: 2,
			image: "https://github.com/ChiragAgg5k/spot-clone/blob/master/Thumbnail.png?raw=true",
			description: "Web Application",
			name: "Spot Clone",
			demo_link: "https://spot-clonee.netlify.app/",
			github_link: "https://github.com/ChiragAgg5k/spot-clone"
		}
	];

	return (
		<>
			<div className="mt-24 lg:mt-32 xl:mt-40">
				<h1 className="mb-16 cursor-default text-center text-4xl font-medium text-gray-800 transition duration-300 dark:text-white lg:mb-20 xl:mb-24">
					Projects
				</h1>
				<div className="mx-0 grid grid-cols-1 sm:grid-cols-2 md:mx-10 lg:grid-cols-3">
					{projects.map((project) => {
						return (
							<div
								key={project.index}
								className="group m-5 rounded-xl border-2 border-cyan-200 p-5  hover:border-cyan-400 dark:border-gray-800 dark:hover:border-cyan-700">
								<Image
									src={project.image}
									alt={project.name}
									width={300}
									height={300}
									className="mb-4 h-auto max-h-52 w-full transform rounded-lg object-cover transition duration-500 ease-in-out group-hover:-translate-y-1 group-hover:scale-110"
								/>
								<div>
									<p className="mb-2 cursor-default text-base text-cyan-500">
										{project.description}
									</p>
									<p className="font-mediumc my-1 text-xl">
										{project.name}
									</p>
									<div className="flex justify-between">
										<a
											className="text-sm  hover:underline"
											href={project.demo_link}
											onClick={
												project.demo_link === "#"
													? (e) => {
															e.preventDefault();
													  }
													: (e) => {
															e.preventDefault();
															window.open(
																project.demo_link,
																"_blank"
															);
													  }
											}>
											{project.demo_link === "#"
												? ""
												: "Visit"}
										</a>
										<a
											href={project.github_link}
											target="_blank">
											<AiFillGithub className="inline-block text-3xl hover:scale-110	" />
										</a>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
