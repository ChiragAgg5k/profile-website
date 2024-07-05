import Image from "next/image";
import dynamic from "next/dynamic";

export default function ResumeRotate({
  className = "",
  showMouseTracker = false,
}: {
  className?: string;
  showMouseTracker?: boolean;
}) {
  return (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <div className="relative h-56 w-48 animate-flip-slow border border-foreground/30 bg-white/90">
        <Image
          src="/resume.png"
          alt="Resume"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          quality={100}
        />
      </div>
    </div>
  );
}
