import { Button } from "@/components/ui/button";

const recoveryLinks = [
  { href: "/", label: "Home" },
  { href: "/developers", label: "Developer resources" },
  { href: "/blog", label: "Blog" },
  { href: "/llms.txt", label: "llms.txt" },
  { href: "/sitemap.xml", label: "Sitemap" },
];

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex-col items-center justify-center flex px-6">
      <h1 className="text-center text-3xl font-semibold text-primary">
        Page not found
      </h1>
      <p className="text-center text-base mt-4 text-muted-foreground">
        This path does not exist on chiragaggarwal.tech.
      </p>
      <p className="text-center text-sm mt-6 text-muted-foreground">
        Where to look next
      </p>
      <ul className="mt-3 text-sm text-center space-y-1">
        {recoveryLinks.map((link) => (
          <li key={link.href}>
            <a className="underline" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <a href="/">
        <Button className="mt-6" variant="outline">
          Go back home
        </Button>
      </a>
    </div>
  );
}
