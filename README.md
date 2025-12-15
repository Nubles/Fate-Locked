# OSRS Fate-Locked UIM Tracker

A single-page web application to track progress for the OSR Fate-Locked Ultimate Ironman game mode.

## Features
- **RNG Rolls**: Roll for keys via Quests, Combat Achievements, Level Ups, and Collection Logs.
- **Pity System**: Bad luck protection ensures you get a key eventually.
- **Gacha Unlocks**: Spend keys to unlock Gear Slots, Skills, or Regions.
- **Persistence**: Your progress is saved automatically to your browser's local storage.
- **Dark Mode**: Themed after OSRS interface.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```

## Deployment

### GitHub Pages (Manual)
1. Run `npm run build`
2. Push the contents of `dist/` to a `gh-pages` branch, or configure GitHub Pages to serve from `dist/` if possible (usually requires a custom action).

### GitHub Pages (Automated Action)
This repository includes a GitHub Action `.github/workflows/deploy.yml` that will automatically build and deploy to GitHub Pages whenever you push to `main` (or `master`).

1. Go to your repository **Settings** > **Pages**.
2. Under "Build and deployment", select **GitHub Actions** as the source.
3. Push your code to `main`. The action will run and deploy your site.

**Note:** If your repository is not at the root domain (e.g. `username.github.io/repo-name`), ensure `vite.config.js` has the correct `base` path set. Currently it is set to `./` which should work for most cases.
