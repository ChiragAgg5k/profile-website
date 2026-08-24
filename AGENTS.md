# Agent notes

This repo ships one TanStack Start site from `sites/profile-website` to two production hosts. Canonical URLs, sitemap, and robots always use `https://www.chiragaggarwal.tech`.

| Host | URL | How it goes live |
|---|---|---|
| Vercel | https://www.chiragaggarwal.tech | Push `master` to `origin`. Vercel builds from `sites/profile-website/vercel.json`. |
| Appwrite Sites | https://chirag.appwrite.network | `appwrite push site` from the repo root. Config is `appwrite.config.json`. |

`vercel.json` (`trailingSlash`, `X-Robots-Tag`) applies only on Vercel. Shared SEO behavior lives in the app: `trailingSlash: "never"` in `sites/profile-website/src/router.tsx` and `sites/profile-website/public/robots.txt`.

## Vercel (`chiragaggarwal.tech`)

```bash
git push origin master
```

Do not run `vercel` unless the user asks. A push to `master` is enough.

## Appwrite Sites (`chirag.appwrite.network`)

Requires a logged-in Appwrite CLI session against the Singapore Cloud endpoint already in `appwrite.config.json`.

```bash
# Confirm you are on the right project/endpoint
appwrite whoami
# Name     : …
# Endpoint : https://sgp.cloud.appwrite.io/v1

# Deploy only this site. The project has other sites — never `push all`.
appwrite push site --site-id chirag-profile-website --force
```

- `--force` is required for non-interactive agents (`Pass --force instead`).
- Do **not** pass `--with-variables` unless the user asked to replace remote env vars. Variables live on the site, not in git.
- Site id: `chirag-profile-website`
- Project: `chirag-project-prod`
- Path: `sites/profile-website`
- Adapter: static (`./dist/client`)

After the build is `ready`, the Appwrite Network domain updates automatically. Preview URLs (`*.appwrite.network` deployment hosts) are not the public site.

## After a dual deploy

1. Push `master` (Vercel).
2. `appwrite push site --site-id chirag-profile-website --force` (Appwrite).
3. Spot-check both hosts (`/blog` vs `/blog/`, `/feed.xml`, `/robots.txt`).
