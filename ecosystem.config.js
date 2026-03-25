// PM2 process configuration
// Start all processes: pm2 start ecosystem.config.js
// Stop all:           pm2 stop all
// View logs:          pm2 logs

module.exports = {
  apps: [
    // ── Next.js production server ──────────────────────────────────────────
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

    // ── Permit scraper — runs on a schedule ───────────────────────────────
    // Checks every 3 hours. PM2 cron_restart triggers re-runs automatically.
    {
      name: "clearedno-scraper",
      script: "node_modules/.bin/ts-node",
      args: "--project tsconfig.scripts.json scrapers/index.ts",
      cwd: __dirname,
      instances: 1,
      autorestart: false, // Let cron_restart handle scheduling
      cron_restart: "0 */3 * * *", // Every 3 hours
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },

    // ── Outreach agent — runs once daily ──────────────────────────────────
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
