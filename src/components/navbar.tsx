import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <nav
      className={`flex items-center justify-end rounded-full border border-foreground`}
    >
      <ThemeToggle />
    </nav>
  );
}
