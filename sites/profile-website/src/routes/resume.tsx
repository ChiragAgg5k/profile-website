import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, Mail, MapPin } from "lucide-react";
import Markdown from "react-markdown";

const PAGE_URL = `${DATA.url}/resume`;
const PAGE_TITLE = `${DATA.name} Resume | ${DATA.jobTitle}`;
const PAGE_DESCRIPTION =
  "Resume of Chirag Aggarwal, a Platform Engineer at Appwrite specializing in backend systems, Kubernetes, PHP, Go, SDKs, observability, and open source.";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "Chirag Aggarwal resume, Platform Engineer, Appwrite, backend engineer, Kubernetes, PHP, Go, open source",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: PAGE_TITLE,
          url: PAGE_URL,
          description: PAGE_DESCRIPTION,
          mainEntity: {
            "@type": "Person",
            name: DATA.name,
            url: DATA.url,
            image: `${DATA.url}${DATA.avatarUrl}`,
            jobTitle: DATA.jobTitle,
            email: `mailto:${DATA.contact.email}`,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Delhi NCR",
              addressCountry: "IN",
            },
            worksFor: {
              "@type": "Organization",
              name: "Appwrite",
              url: "https://appwrite.io",
            },
            alumniOf: DATA.education.map((education) => ({
              "@type": "EducationalOrganization",
              name: education.school,
            })),
            sameAs: Object.values(DATA.contact.social)
              .filter((social) => !social.url.startsWith("mailto:"))
              .map((social) => social.url),
          },
        },
      },
    ],
    links: [
      { rel: "canonical", href: PAGE_URL },
      {
        rel: "alternate",
        type: "application/pdf",
        href: `${DATA.url}/resume.pdf`,
      },
    ],
  }),
  component: ResumePage,
});

function MarkdownLine({ children }: { children: string }) {
  return (
    <Markdown components={{ p: ({ children: content }) => <>{content}</> }}>
      {children.replace(/^\-\s*/, "")}
    </Markdown>
  );
}

function ResumePage() {
  return (
    <main className="mx-8 pb-20">
      <header className="mb-12 border-b pb-8">
        <div className="flex flex-col-reverse justify-between gap-6 sm:flex-row sm:items-start">
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Resume
            </p>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              {DATA.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {DATA.jobTitle} at Appwrite
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <a
                className="inline-flex items-center gap-1.5 hover:text-foreground"
                href={DATA.locationLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="size-4" aria-hidden="true" />
                {DATA.location}
              </a>
              <a
                className="inline-flex items-center gap-1.5 hover:text-foreground"
                href={`mailto:${DATA.contact.email}`}
              >
                <Mail className="size-4" aria-hidden="true" />
                {DATA.contact.email}
              </a>
            </div>
          </div>
          <Avatar className="size-24 border sm:size-28">
            <AvatarImage
              src={DATA.avatarUrl}
              alt={DATA.name}
              width={112}
              height={112}
            />
            <AvatarFallback>{DATA.initials}</AvatarFallback>
          </Avatar>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <a href="/resume.pdf" download>
              <Download className="mr-2 size-4" aria-hidden="true" />
              Download PDF
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={DATA.contact.social.LinkedIn.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
              <ExternalLink className="ml-2 size-3.5" aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={DATA.contact.social.GitHub.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <ExternalLink className="ml-2 size-3.5" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </header>

      <div className="space-y-12">
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="mb-3 text-xl font-bold">
            Summary
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Platform Engineer building and operating Appwrite Cloud. I work
            across backend services, Kubernetes infrastructure, SDKs,
            observability, developer tooling, and open-source systems.
          </p>
        </section>

        <section aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="mb-5 text-xl font-bold">
            Experience
          </h2>
          <div className="space-y-8">
            {DATA.work.map((work) => (
              <article key={work.company}>
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <div>
                    <h3 className="font-semibold">
                      <a
                        className="hover:underline"
                        href={work.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {work.company}
                      </a>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {work.title}
                    </p>
                  </div>
                  <p className="text-sm tabular-nums text-muted-foreground">
                    {work.start} – {work.end ?? "Present"}
                  </p>
                </div>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground marker:text-foreground/50">
                  {work.description
                    ?.filter((line) => line !== "---")
                    .map((line) => (
                      <li key={line}>
                        <MarkdownLine>{line}</MarkdownLine>
                      </li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="mb-3 text-xl font-bold">
            Skills
          </h2>
          <ul className="flex flex-wrap gap-2" aria-label="Technical skills">
            {DATA.skills.map((skill) => (
              <li
                key={skill.name}
                className="rounded-md border bg-muted/30 px-3 py-1.5 text-sm"
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="mb-5 text-xl font-bold">
            Selected projects
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {DATA.projects.map((project) => (
              <article key={project.title}>
                <h3 className="font-semibold">
                  <a
                    className="hover:underline"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.title}
                  </a>
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {project.dates}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {project.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {project.technologies.join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="education-heading">
          <h2 id="education-heading" className="mb-5 text-xl font-bold">
            Education
          </h2>
          <div className="space-y-5">
            {DATA.education.map((education) => (
              <article
                key={education.school}
                className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline"
              >
                <div>
                  <h3 className="font-semibold">{education.school}</h3>
                  <p className="text-sm text-muted-foreground">
                    {education.degree}
                  </p>
                </div>
                <p className="text-sm tabular-nums text-muted-foreground">
                  {education.start} – {education.end}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
