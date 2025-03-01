import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const OriginalPost = ({
  text,
  link,
  className = "",
}: {
  text: string;
  link: string;
  className?: string;
}) => {
  return (
    <div className={`mt-8 flex justify-center mb-24 ${className}`}>
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${text} - opens in new tab`}
      >
        <Button
          variant="outline"
          className="gap-2 px-6 py-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {text}
          <ExternalLink size={16} className="ml-1" aria-hidden="true" />
        </Button>
      </Link>
    </div>
  );
};
