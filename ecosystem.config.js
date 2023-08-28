module.exports = {
  apps : [{
    script: 'dist/main.js',
	name: 'RFID-NESTJS',  
	exp_backoff_restart_delay: 100,
	watch: true, 
	instances : 1,
	exec_mode: 'cluster',
	env: {
      NODE_ENV: 'production'
    }
  }]
};
