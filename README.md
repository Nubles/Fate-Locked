# Fate-Locked UIM Tracker

A tracking tool for Fate-Locked Ultimate Ironman accounts in Old School RuneScape.

## Deployment Instructions (Important)

This application is built with Vite and TypeScript. It **must** be built before being served. It cannot be served directly from the source code (`main` branch) by GitHub Pages.

### How to Fix "Failed to load module script" or 404 Errors

If you see errors like `MIME type of "application/octet-stream"` or `404 Not Found` for `index.tsx`, your GitHub Pages is likely configured to serve the **Source** (main branch) instead of the **Build Artifacts**.

**To fix this:**

1.  Go to your GitHub Repository **Settings**.
2.  Click on **Pages** in the left sidebar.
3.  Under **Build and deployment** > **Source**, ensure "Deploy from a branch" is selected.
4.  Under **Branch**, change the branch from `main` to **`gh-pages`**.
5.  Click **Save**.

*Note: The `gh-pages` branch is automatically created and updated by the "Deploy to GitHub Pages" Action whenever you push to `main`. If you don't see `gh-pages` yet, check the "Actions" tab to see if the deployment workflow has finished successfully.*

## Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Build for production:
    ```bash
    npm run build
    ```

4.  Preview the production build locally:
    ```bash
    npm run preview
    ```
