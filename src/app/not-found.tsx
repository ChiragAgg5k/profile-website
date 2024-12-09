import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex-col items-center justify-center flex">
      <h1 className="text-center text-3xl font-semibold text-primary">
        Oops... Page not found
      </h1>
      <p className="text-center text-base mt-4 text-muted-foreground">
        Sorry I don&apos;t have the necessary page you were looking for in my
        portfolio. <br />
        Can you please check the URL or <a href="/">go back to home</a>?
      </p>
      <Link href={"/"}>
        <Button className="mt-4" variant={"outline"}>
          Go back home
        </Button>
      </Link>
    </div>
  );
}
