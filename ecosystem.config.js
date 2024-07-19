module.exports = {
  apps: [
    {
      script: 'dist/main.js',
      name: 'RFID-NESTJS',
      watch: true,
      watch_delay: 1000,
      ignore_watch: ['downloads'],
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
