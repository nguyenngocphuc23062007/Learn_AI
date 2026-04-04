module.exports = {
  apps: [
    {
      name: "uet-lms-bot",
      script: "./scheduler.js",
      interpreter: "/Users/admin/.nvm/versions/node/v24.12.0/bin/node",
      cwd: "/Users/admin/Code/web/velorah/bot",
      restart_delay: 5000,
      max_restarts: 10,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
    },
  ],
};
