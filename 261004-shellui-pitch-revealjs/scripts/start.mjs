import { spawn } from "node:child_process";

console.log("Shellui pitch (reveal.js): http://localhost:5173");
console.log("Speaker notes: press S. Overview: press O. PDF: http://localhost:5173/?print-pdf");

const child = spawn("serve", [".", "-l", "5173", "--no-port-switching"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
