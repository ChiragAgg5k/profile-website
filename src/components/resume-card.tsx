"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Markdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: readonly string[];
  links?: readonly {
    type: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  period,
  description,
  links,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCardClick = () => {
    if (description) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleDescriptionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      aria-label={`${title} resume`}
      className={cn(
        "block",
        description ? "cursor-pointer" : "",
        !href ? "pointer-events-none" : "",
      )}
      onClick={handleCardClick}
    >
      <Card className="flex">
        <div className="flex-grow ml-4 items-center flex-col group">
          <CardHeader>
            <div className="flex">
              <Avatar className="border size-10 m-auto bg-muted-background dark:bg-foreground mr-4">
                <AvatarImage
                  src={logoUrl}
                  alt={altText}
                  className="object-contain"
                />
                <AvatarFallback>{altText[0]}</AvatarFallback>
              </Avatar>
              <div className="w-full">
                <div className="flex items-center justify-between gap-x-2 text-base">
                  <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                    {title}
                    {description ? (
                      <ChevronRightIcon
                        className={cn(
                          "size-3 ml-1 translate-x-0 transform opacity-80 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:size-4",
                          isExpanded ? "rotate-90" : "rotate-0",
                        )}
                      />
                    ) : null}
                  </h3>
                  <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                    {period}
                  </div>
                </div>
                {subtitle && (
                  <div className="font-sans text-xs">{subtitle}</div>
                )}
              </div>
            </div>
          </CardHeader>
          {description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                height: isExpanded ? "auto" : 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-2 text-xs sm:text-sm mb-4"
              // @ts-ignore
              onClick={handleDescriptionClick}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {description.map((item, index) => (
                  <Markdown
                    key={index}
                    components={{
                      p: ({ children }) => (
                        <p className="whitespace-pre-wrap mb-2">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-4 mb-2">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="-mb-3">{children}</li>
                      ),
                    }}
                  >
                    {item}
                  </Markdown>
                ))}
                {links && (
                  <div className="flex flex-wrap gap-x-2 mt-8">
                    {links.map((link, index) => (
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        key={index}
                        href={link.href}
                        className="flex items-center gap-x-2 text-xs no-underline hover:underline"
                        onClick={handleDescriptionClick}
                      >
                        {link.icon}
                        {link.type}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};
