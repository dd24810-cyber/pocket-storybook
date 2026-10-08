# Pocket Storybook

A React and TypeScript graded English reader with stories, vocabulary practice,
reading progress, narration, and comprehension quizzes.

## Run locally

Requirements: Node.js 20.19+ (or 22.12+) and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually <http://localhost:3000>).

## Validate and build

```bash
npm run lint
npm run build
npm run preview
```

The production-ready static site is generated in `dist/`.

## Deploy with Vercel

1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import that GitHub repository.
3. Keep the detected Vite settings: build command `npm run build`, output
   directory `dist`, and install command `npm install`.
4. Select **Deploy**. No environment variables are required for the current
   client-side app.

Vercel can automatically redeploy the site whenever changes are pushed to the
repository's production branch.
