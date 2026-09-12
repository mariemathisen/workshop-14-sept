import { spawn } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const targets = [
  { name: 'server', color: '\u001b[36m' },
  { name: 'web', color: '\u001b[35m' },
];

const children = targets.map(({ name, color }) => {
  const child = spawn(npm, ['run', 'dev', '--workspace', name], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const prefix = `${color}[${name}]\u001b[0m `;
  const forward = (stream, target) => {
    let buffer = '';
    stream.setEncoding('utf8');
    stream.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) target.write(prefix + line + '\n');
    });
  };

  forward(child.stdout, process.stdout);
  forward(child.stderr, process.stderr);

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      process.stdout.write(`${prefix}exited with code ${code}\n`);
      shutdown(code);
    }
  });

  return child;
});

let shuttingDown = false;
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) child.kill('SIGTERM');
  process.exitCode = code;
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
