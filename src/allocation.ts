export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let crew = 2;

function updateAllocationScreen() {
  const totalProduction = crew * 3;
  const requiredSupplies = 6;
  const supplyBalance = totalProduction - requiredSupplies;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let crewIndex = 0; crewIndex < 6; crewIndex++) {
    ctx.fillStyle = crewIndex < crew ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + crewIndex * 45, 16, 36, 36);
    ctx.fillStyle = crewIndex < crew ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(crewIndex + 1), 31 + crewIndex * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${crew} / 6`, 18, 76);
  ctx.fillText(`Production: ${totalProduction}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, totalProduction * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${requiredSupplies}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, requiredSupplies * 14, 20);
  readout.textContent =
    `Assigned: ${crew}/6 · Production: ${totalProduction} · Consumption: ${requiredSupplies} · Balance: ${
      supplyBalance > 0 ? "+" : ""
    }${supplyBalance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  crew = Math.max(0, crew - 1);
  updateAllocationScreen();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  crew = Math.min(6, crew + 1);
  updateAllocationScreen();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    crew = 2;
    updateAllocationScreen();
  };
updateAllocationScreen();
