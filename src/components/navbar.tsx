import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <nav
      className={`mb-2 flex items-center justify-between rounded-full border border-foreground`}
    >
      <h2 className={`ml-3 text-sm`}>ChiragAgg5k</h2>
      <ThemeToggle />
    </nav>
  );
}
