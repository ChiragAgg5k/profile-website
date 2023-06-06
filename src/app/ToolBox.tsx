import { useState } from "react";
import { TbBrandCpp, TbBrandNextjs } from "react-icons/tb";
import {
	DiJava,
	DiPython,
	DiJavascript1,
	DiReact,
	DiMongodb,
	DiPostgresql
} from "react-icons/di";
import { SiDjango, SiExpress } from "react-icons/si";
import { BsGit } from "react-icons/bs";
import { FcLinux } from "react-icons/fc";

export default function ToolBox() {
	const languageTools = [
		{
			index: 0,
			name: "Python",
			icon: (
				<DiPython className="m-4 text-6xl text-cyan-700 hover:scale-105" />
			)
		},
		{
			index: 1,
			name: "C++",
			icon: (
				<TbBrandCpp className="m-4 text-6xl text-purple-600 hover:scale-105" />
			)
		},
		{
			index: 2,
			name: "Java",
			icon: (
				<DiJava
					className={"m-4 text-6xl text-orange-700 hover:scale-105"}
				/>
			)
		},
		{
			index: 3,
			name: "JavaScript",
			icon: (
				<DiJavascript1 className="m-4 text-6xl text-yellow-600 hover:scale-105" />
			)
		}
	];

	const frameworkTools = [
		{
			index: 0,
			name: "React",
			icon: (
				<DiReact
					className={"m-4 text-6xl text-cyan-700 hover:scale-105"}
				/>
			)
		},
		{
			index: 1,
			name: "Next.js",
			icon: (
				<TbBrandNextjs
					className={"m-4 text-6xl text-white hover:scale-105"}
				/>
			)
		},
		{
			index: 2,
			name: "Django",
			icon: (
				<SiDjango
					className={"m-4 text-6xl text-green-800 hover:scale-105"}
				/>
			)
		},
		{
			index: 3,
			name: "Express.js",
			icon: (
				<SiExpress
					className={"m-4 text-6xl text-white hover:scale-105"}
				/>
			)
		}
	];

	const databaseTools = [
		{
			index: 0,
			name: "MongoDB",
			icon: (
				<DiMongodb
					className={"m-4 text-6xl text-green-800 hover:scale-105"}
				/>
			)
		},
		{
			index: 1,
			name: "PostgreSQL",
			icon: (
				<DiPostgresql
					className={"m-4 text-6xl text-blue-600 hover:scale-105"}
				/>
			)
		}
	];

	const otherTools = [
		{
			index: 0,
			name: "Git",
			icon: (
				<BsGit
					className={"m-4 text-6xl text-red-500 hover:scale-105"}
				/>
			)
		},
		{
			index: 1,
			name: "Linux",
			icon: (
				<FcLinux
					className={"m-4 text-6xl text-white hover:scale-105"}
				/>
			)
		}
	];

	const [tools, setTools] = useState(languageTools);

	return (
		<div className="mx-5 overflow-hidden rounded-2xl bg-cyan-100 px-4 pb-8 pt-6 dark:bg-gray-800 md:mx-10 md:px-8">
			<h3 className="text-center text-2xl md:text-3xl">My Toolbox</h3>
			<div className="mt-6 flex">
				<div className="mr-8 flex flex-col justify-between rounded-xl bg-cyan-200 px-2 py-5 dark:bg-gray-700 md:px-5">
					<h4
						className="mb-2 cursor-pointer rounded px-4 py-2 text-center hover:bg-cyan-400 dark:hover:bg-gray-600"
						onClick={() => {
							setTools([...languageTools]);
						}}>
						Languages
					</h4>
					<h4
						className="mb-2 cursor-pointer rounded px-4 py-2 text-center hover:bg-cyan-400 dark:hover:bg-gray-600"
						onClick={() => {
							setTools([...frameworkTools]);
						}}>
						Frameworks
					</h4>
					<h4
						className="mb-2 cursor-pointer rounded px-4 py-2 text-center hover:bg-cyan-400 dark:hover:bg-gray-600"
						onClick={() => {
							setTools([...databaseTools]);
						}}>
						Databases
					</h4>
					<h4
						className="mb-2 cursor-pointer rounded px-4 py-2 text-center hover:bg-cyan-400 dark:hover:bg-gray-600"
						onClick={() => {
							setTools([...otherTools]);
						}}>
						Other Tools
					</h4>
				</div>
				<div className="grid w-full rounded-xl bg-cyan-200 p-5 dark:bg-gray-700 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8  xl:grid-cols-10">
					{tools.map((tool) => {
						return (
							<div key={tool.index} className="m-auto">
								{tool.icon}
								<p className="text-center text-sm">
									{tool.name}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
