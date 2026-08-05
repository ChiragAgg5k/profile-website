// prismjs ships each language as a side-effect script that attaches itself to
// a global `Prism`. There is nothing to import and @types/prismjs does not
// declare the paths, so give them an ambient module each.
declare module "prismjs/components/*";
