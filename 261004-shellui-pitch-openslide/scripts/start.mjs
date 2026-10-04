import { spawn } from "node:child_process";

console.log("Shellui pitch (open-slide): http://localhost:5174/s/shellui-pitch");
console.log("All decks: http://localhost:5174/");
console.log("Speaker notes: press P for the presenter view, or open http://localhost:5174/s/shellui-pitch/presenter");

const child = spawn("open-slide", ["dev"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
