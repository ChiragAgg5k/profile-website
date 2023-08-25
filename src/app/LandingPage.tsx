import { AiFillLinkedin, AiFillGithub } from 'react-icons/ai';
import { SiLeetcode } from 'react-icons/si';

export default function LandingPage() {
	return (
		<div className="min-h-[90dvh] w-full md:flex md:items-center md:justify-center">
			<div className="px-10 pt-10 text-center">
				<h1 className="cursor-default py-2 text-3xl font-medium text-cyan-700 dark:text-cyan-600 sm:text-4xl md:text-5xl">
					Chirag Aggarwal
				</h1>
				<h2 className="cursor-default py-2 text-xl sm:text-2xl">A Computer Science Nerd.</h2>
				<p className="cursor-default py-5 text-base leading-8 text-gray-600 dark:text-gray-400 md:text-lg">
					Hi, I am a passionate computer science student from India🇮🇳 🇮🇳 <br />I like to learn new things and
					build stuff.
				</p>
				<div className="flex justify-center gap-16 py-3 text-5xl text-gray-600">
					<a
						href="https://github.com/ChiragAgg5k"
						target="_blank"
						aria-label="Github"
						rel="noreferrer"
						className="group hover:cursor-pointer hover:text-black dark:hover:text-white"
					>
						<AiFillGithub />
						<p className="invisible text-xs group-hover:visible">Github</p>
					</a>
					<a
						href="https://www.linkedin.com/in/chiragagg5k/"
						target="_blank"
						rel="noreferrer"
						aria-label="LinkedIn"
						className="group hover:cursor-pointer hover:text-cyan-800 dark:hover:text-cyan-500"
					>
						<AiFillLinkedin />
						<p className=" invisible  text-xs group-hover:visible">LinkedIn</p>
					</a>
					<a
						href="https://leetcode.com/ChiragAgg5k/"
						target="_blank"
						rel="noreferrer"
						aria-label="Leetcode"
						className="group hover:cursor-pointer hover:text-yellow-600"
					>
						<SiLeetcode />
						<p className="invisible text-xs group-hover:visible">Leetcode</p>
					</a>
				</div>
			</div>

			<div className="px-10 py-20 md:px-0">
				<video
					autoPlay
					loop
					muted
					className="w-100 mx-auto rounded-full border-4 border-cyan-500"
					poster="/coding_anim_thumb.jpg"
				>
					<source src="/coding_anim.mp4" type="video/mp4" />
				</video>
			</div>
		</div>
	);
}
