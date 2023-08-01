import { useState } from 'react';
import { TbBrandCpp, TbBrandNextjs, TbBrandTypescript } from 'react-icons/tb';
import { DiJava, DiPython, DiMongodb, DiPostgresql } from 'react-icons/di';
import { SiDjango, SiExpress, SiMysql, SiKotlin, SiFirebase, SiFlutter, SiSqlite } from 'react-icons/si';
import { BsGit, BsAndroid2 } from 'react-icons/bs';
import { FcLinux } from 'react-icons/fc';
import { FaDocker } from 'react-icons/fa';
import Slide from 'react-reveal/Slide';

interface Tool {
	index: number;
	name: string;
	icon: React.ReactElement;
}

const languageTools: Tool[] = [
	{
		index: 0,
		name: 'Python',
		icon: <DiPython className="m-4 text-6xl text-cyan-700 hover:scale-105" />,
	},
	{
		index: 1,
		name: 'C++',
		icon: <TbBrandCpp className="m-4 text-6xl text-blue-600 hover:scale-105" />,
	},
	{
		index: 2,
		name: 'Java',
		icon: <DiJava className={'m-4 text-6xl text-orange-700 hover:scale-105'} />,
	},
	{
		index: 3,
		name: 'Kotlin',
		icon: <SiKotlin className={'m-4 text-6xl text-purple-700 hover:scale-105'} />,
	},
	{
		index: 4,
		name: 'TypeScript',
		icon: <TbBrandTypescript className="m-4 text-6xl text-blue-600 hover:scale-105" />,
	},
];

const frameworkTools: Tool[] = [
	{
		index: 0,
		name: 'Next.js',
		icon: <TbBrandNextjs className={'m-4 text-6xl text-white hover:scale-105'} />,
	},
	{
		index: 1,
		name: 'Django',
		icon: <SiDjango className={'m-4 text-6xl text-green-800 hover:scale-105'} />,
	},
	{
		index: 2,
		name: 'Express.js',
		icon: <SiExpress className={'m-4 text-6xl text-white hover:scale-105'} />,
	},
	{
		index: 3,
		name: 'Flutter',
		icon: <SiFlutter className={'m-4 text-6xl text-cyan-500 hover:scale-105'} />,
	},
	{
		index: 4,
		name: 'Android',
		icon: <BsAndroid2 className={'m-4 text-6xl text-green-600 hover:scale-105'} />,
	},
];

const databaseTools: Tool[] = [
	{
		index: 0,
		name: 'MongoDB',
		icon: <DiMongodb className={'m-4 text-6xl text-green-800 hover:scale-105'} />,
	},
	{
		index: 1,
		name: 'PostgreSQL',
		icon: <DiPostgresql className={'m-4 text-6xl text-blue-600 hover:scale-105'} />,
	},
	{
		index: 2,
		name: 'MySQL',
		icon: <SiMysql className={'m-4 text-6xl text-orange-600 hover:scale-105'} />,
	},
	{
		index: 3,
		name: 'SQLite',
		icon: <SiSqlite className={'m-4 text-6xl text-blue-600 hover:scale-105'} />,
	},
];

const otherTools = [
	{
		index: 0,
		name: 'Git',
		icon: <BsGit className={'m-4 text-6xl text-red-500 hover:scale-105'} />,
	},
	{
		index: 1,
		name: 'Linux',
		icon: <FcLinux className={'m-4 text-6xl text-white hover:scale-105'} />,
	},
	{
		index: 2,
		name: 'Docker',
		icon: <FaDocker className={'m-4 text-6xl text-blue-600 hover:scale-105'} />,
	},
	{
		index: 3,
		name: 'Firebase',
		icon: <SiFirebase className={'m-4 text-6xl text-yellow-600 hover:scale-105'} />,
	},
];

const columnHeaders = [
	{
		name: 'Languages',
		tools: languageTools,
	},
	{
		name: 'Frameworks',
		tools: frameworkTools,
	},
	{
		name: 'Databases',
		tools: databaseTools,
	},
	{
		name: 'Other',
		tools: otherTools,
	},
];

export default function ToolBox() {
	const [tools, setTools] = useState(languageTools);

	return (
		<Slide right>
			<div className="mx-5 mb-32 overflow-hidden rounded-xl  border-2 border-cyan-300 bg-cyan-100 px-4 pb-5 pt-6 text-gray-700 dark:border-0 dark:bg-gray-800 dark:text-white md:mx-10 md:px-8 md:pb-8">
				<h3 className="cursor-default text-center text-2xl font-medium md:text-3xl">My Toolbox</h3>
				<div className="mt-6 flex flex-col sm:flex-row">
					<div className="mb-5 flex flex-row justify-between overflow-scroll rounded-xl bg-cyan-200 px-2 py-5 dark:bg-gray-700 sm:mb-0 sm:mr-8 sm:flex-col sm:overflow-visible md:px-5">
						{columnHeaders.map((columnHeader) => {
							return (
								<h4
									key={columnHeader.name}
									className="mb-2 cursor-pointer whitespace-nowrap rounded px-4 py-2 text-center hover:bg-cyan-500 hover:text-white dark:hover:bg-gray-600"
									onClick={() => {
										setTools([...columnHeader.tools]);
									}}
								>
									{columnHeader.name}
								</h4>
							);
						})}
					</div>
					<div className="grid w-full grid-cols-2 rounded-xl bg-cyan-200 p-5 dark:bg-gray-700 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8  xl:grid-cols-10">
						{tools.map((tool) => {
							return (
								<div key={tool.index} className="m-auto">
									{tool.icon}
									<p className="text-center text-sm">{tool.name}</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Slide>
	);
}
