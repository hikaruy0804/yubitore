import { spawn } from "node:child_process";

function parseDuration(value, name) {
  const match = /^(\d+)(ms|s|m)?$/.exec(value);
  if (!match) {
    throw new Error(`${name} must be a duration such as 500ms, 10s, or 3m`);
  }

  const amount = Number(match[1]);
  const multiplier = match[2] === "m" ? 60_000 : match[2] === "s" ? 1_000 : 1;
  return amount * multiplier;
}

const separator = process.argv.indexOf("--");
if (separator < 0 || separator === process.argv.length - 1) {
  console.error("usage: node scripts/run-with-timeout.mjs <timeout> <kill-after> -- command [args...]");
  process.exit(64);
}

const timeout = parseDuration(process.argv[2], "timeout");
const killAfter = parseDuration(process.argv[3], "kill-after");
const [command, ...args] = process.argv.slice(separator + 1);
const child = spawn(command, args, { stdio: "inherit" });

let timedOut = false;
let forceKillTimer;
const timeoutTimer = setTimeout(() => {
  timedOut = true;
  console.error(`Command timed out after ${process.argv[2]}; terminating it.`);
  child.kill("SIGTERM");
  forceKillTimer = setTimeout(() => child.kill("SIGKILL"), killAfter);
  forceKillTimer.unref();
}, timeout);
timeoutTimer.unref();

child.on("error", (error) => {
  clearTimeout(timeoutTimer);
  if (forceKillTimer) clearTimeout(forceKillTimer);
  console.error(`Could not start ${command}: ${error.message}`);
  process.exitCode = 69;
});

child.on("exit", (code, signal) => {
  clearTimeout(timeoutTimer);
  if (forceKillTimer) clearTimeout(forceKillTimer);
  if (timedOut) {
    process.exitCode = 124;
  } else if (signal) {
    console.error(`${command} exited after receiving ${signal}.`);
    process.exitCode = 1;
  } else {
    process.exitCode = code ?? 1;
  }
});
