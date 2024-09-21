import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";

export const metadata = {
	title: "Blogs",
	description: "A list of all my content related work published on various sites."
};

const posts = [
	{
		title: "Mastering npm: A Comprehensive Guide to Package Management",
		thumbnail: "/npm-guide.png",
		icon: "📦",
		href: "https://dev.to/chiragagg5k/mastering-npm-a-comprehensive-guide-to-package-management-3h0m",
		publishedAt: "2023-01-01",
		tags: ["npm", "javascript", "guide"],
		description: "A comprehensive guide to npm, covering everything from installation to publishing packages.",
		links: [
			{
				icon: "💻",
				type: " dev.to",
				href: "https://dev.to/chiragagg5k/mastering-npm-a-comprehensive-guide-to-package-management-3h0m"
			}
		]
	},
	{
		title: "Conditional Dependency Management Using Maven Profiles",
		thumbnail: "/conditional-maven.png",
		icon: "📦",
		href: "https://www.geeksforgeeks.org/conditional-dependency-management-using-maven-profiles/?itm_source=auth&itm_medium=contributions&itm_campaign=articles",
		publishedAt: "2023-01-01",
		tags: ["maven", "java", "guide"],
		description:
			"Introduction to Maven profiles and how to use them to conditionally manage dependencies in a Maven project.",
		links: [
			{
				icon: "🟩",
				type: " geeksforgeeks",
				href: "https://www.geeksforgeeks.org/conditional-dependency-management-using-maven-profiles/?itm_source=auth&itm_medium=contributions&itm_campaign=articles"
			}
		]
	}
];

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
	return (
		<section>
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div className="flex items-center justify-between">
					<h1 className="font-medium text-2xl mb-8 tracking-tighter">Blogs ✏️</h1>
					{/* <div className="space-x-2">
            <Link href={"https://www.linkedin.com/in/chiragagg5k/"} target="_blank">
              <Button size={"sm"}>
                dev.to
              </Button>
            </Link>
            <Link href={"https://www.linkedin.com/in/chiragagg5k/"} target="_blank">
              <Button size={"sm"}>
                geeksforgeeks
              </Button>
            </Link>
          </div> */}
				</div>
				<p className="mb-8">
					So... I not only like to read long and boring documentations, research papers and journals, I also
					like to write them! Here you can find some of my favourite content related work published on various
					sites.
				</p>
			</BlurFade>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mx-auto">
				{posts
					.sort((a, b) => {
						if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
							return -1;
						}
						return 1;
					})
					.map((post, id) => (
						<BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={id}>
							<ProjectCard
								key={post.title}
								title={post.title}
								description={post.description}
								dates={post.publishedAt}
								tags={post.tags}
								href={post.href}
								image={post.thumbnail}
								links={post.links}
							/>
						</BlurFade>
					))}
			</div>
		</section>
	);
}
