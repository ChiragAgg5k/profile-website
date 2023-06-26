import Image from "next/image";

export default function Education() {
	return (
		<div className="mb-40 mt-20 sm:mt-0">
			<h1 className="mb-16 cursor-default text-center text-4xl font-medium text-gray-800 transition duration-300 dark:text-white lg:mb-20 xl:mb-24">
				Education
			</h1>
			<div className="mx-0 grid grid-cols-1 sm:grid-cols-2 md:mx-5 lg:grid-cols-4">
				<div className="group m-4 flex justify-between rounded-xl border-2 border-cyan-200 p-5 text-gray-700 hover:border-cyan-500  dark:border-gray-800 dark:text-white dark:hover:border-cyan-700">
					<div>
						<p className="mb-2 cursor-default text-base text-cyan-600 dark:text-cyan-500">
							2020
						</p>
						<p className="my-1 text-xl font-medium">Class X</p>
						<p className="my-1 text-sm font-medium">CBSE</p>
						<p className="text-sm">Grade: 91.2% </p>
					</div>
					<Image
						src="/bps_logo.png"
						alt="BPS Logo"
						width={100}
						height={100}
						onClick={() => {
							window.open("https://www.bpsmv.edu.in/", "_blank");
						}}
						className="hover:cursor-pointer"
					/>
				</div>
				<div className="group m-4 flex justify-between rounded-xl border-2 border-cyan-200 p-5 text-gray-700 hover:border-cyan-500  dark:border-gray-800 dark:text-white dark:hover:border-cyan-700">
					<div>
						<p className="mb-2 cursor-default text-base text-cyan-600 dark:text-cyan-500">
							2020-2022
						</p>
						<p className="my-1 text-xl font-medium">Class XII</p>
						<p className="my-1 text-sm font-medium">Science</p>
						<p className="text-sm">Grade: 89.5% </p>
					</div>
					<Image
						src="/bps_logo.png"
						alt="BPS Logo"
						width={100}
						height={100}
						onClick={() => {
							window.open("https://www.bpsmv.edu.in/", "_blank");
						}}
						className="hover:cursor-pointer"
					/>
				</div>
				<div className="group m-4 flex justify-between rounded-xl border-2 border-cyan-200 p-5 text-gray-700 hover:border-cyan-500 dark:border-gray-800  dark:text-white dark:hover:border-cyan-700 sm:col-span-2">
					<div>
						<p className="mb-2 cursor-default text-base text-cyan-600 dark:text-cyan-500">
							2022-2026
						</p>
						<p className="my-1 font-medium sm:text-xl">
							B.Tech in Computer Science
						</p>
						<p className="my-1 text-sm font-medium">
							Bennett University
						</p>
						<p className="text-sm">CGPA: 9.66</p>
					</div>
					<Image
						src="/bennett_logo.png"
						alt="Bennett Logo"
						width={100}
						height={100}
						onClick={() => {
							window.open(
								"https://www.bennett.edu.in/",
								"_blank"
							);
						}}
						className="object-contain hover:cursor-pointer"
					/>
				</div>
			</div>
		</div>
	);
}