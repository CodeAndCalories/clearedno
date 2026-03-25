// PM2 process configuration
// Start all:   pm2 start ecosystem.config.js
// Stop all:    pm2 stop all
// View logs:   pm2 logs
// Monitor:     pm2 monit

module.exports = {
  apps: [

    // ── Next.js production server ────────────────────────────────────────────
    {
      name: "clearedno-web",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },

    // ── Permit scraper ────────────────────────────────────────────────────────
    // Runs every 2 hours via PM2 cron_restart.
    // Each run is a short-lived process (typically 2–10 min); PM2 restarts it
    // on the schedule rather than keeping it running continuously.
    //
    // To run manually:
    //   npx ts-node --project tsconfig.scripts.json scrapers/index.ts
    //
    // To run in dry-run mode (no DB writes, no emails):
    //   DRY_RUN=true npx ts-node --project tsconfig.scripts.json scrapers/index.ts
    {
      name: "clearedno-scraper",
      script: "node_modules/.bin/ts-node",
      args: "--project tsconfig.scripts.json scrapers/index.ts",
      cwd: __dirname,
      instances: 1,
      autorestart: false,       // Let cron_restart handle scheduling; don't loop on crash
      cron_restart: "0 */2 * * *", // Every 2 hours on the hour
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },

    // ── Outreach agent ────────────────────────────────────────────────────────
    // Runs Mon–Fri at 9 AM. Sends cold emails to contractor leads.
    // Set DRY_RUN=true in env to test without sending.
    {
      name: "clearedno-outreach",
      script: "node_modules/.bin/ts-node",
      args: "--project tsconfig.scripts.json outreach/index.ts",
      cwd: __dirname,
      instances: 1,
      autorestart: false,
      cron_restart: "0 9 * * 1-5", // 9 AM Mon–Fri
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },

  ],
};
