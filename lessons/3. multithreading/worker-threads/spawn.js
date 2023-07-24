const { spawn } = require('child_process');

const childProcess = spawn('ls');

childProcess.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
});

childProcess.stderr.on('data', (data) => {
	console.log(`stderr: ${data}`);
});

childProcess.on('exit', (code) => {
	console.log(`Код выхода: ${code}`);
})