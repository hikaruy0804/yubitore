const required = [22, 13, 0];
const current = process.versions.node.split(".").map(Number);
const supported =
  current[0] > required[0] ||
  (current[0] === required[0] && current[1] > required[1]) ||
  (current[0] === required[0] && current[1] === required[1] && current[2] >= required[2]);

if (!supported) {
  console.error(
    `Node.js ${required.join(".")}以上が必要です（現在: ${process.versions.node}）。` +
      " Node.jsを切り替えてから、もう一度実行してください。",
  );
  process.exit(1);
}
