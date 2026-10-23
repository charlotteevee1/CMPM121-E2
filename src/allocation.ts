export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let crew = 2;

type ShiftResults = {
  crew: number;
  totalProduction: number;
  requiredSupplies: number;
  supplyBalance: number;
};

function calculateShiftResults(crew: number): ShiftResults {
  const totalProduction = crew * 3;
  const requiredSupplies = 6;
  const supplyBalance = totalProduction - requiredSupplies;
  return { crew, totalProduction, requiredSupplies, supplyBalance };
}

function drawAllocationScreen(results: ShiftResults) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let crewIndex = 0; crewIndex < 6; crewIndex++) {
    ctx.fillStyle = crewIndex < results.crew ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + crewIndex * 45, 16, 36, 36);
    ctx.fillStyle = crewIndex < results.crew ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(crewIndex + 1), 31 + crewIndex * 45, 40);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${results.crew} / 6`, 18, 76);

  type DisplayRecord = {
    label: string;
    value: number;
    color: string;
  };

  const displayRecords: DisplayRecord[] = [
    { label: "Production", value: results.totalProduction, color: "#27766b" },
    { label: "Consumption", value: results.requiredSupplies, color: "#a44d23" },
  ];

  for (let i = 0; i < displayRecords.length; i++) {
    const record = displayRecords[i];
    const textY = 102 + i * 52;
    const barY = 110 + i * 52;

    // Color for the text
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${record.label}: ${record.value}`, 18, textY);
    // Color for the bar
    ctx.fillStyle = record.color;
    ctx.fillRect(18, barY, record.value * 14, 20);
  }
}

function displayShiftResults(results: ShiftResults) {
  readout.textContent =
    `Assigned: ${results.crew}/6 · Production: ${results.totalProduction} · Consumption: ${results.requiredSupplies} · Balance: ${
      results.supplyBalance > 0 ? "+" : ""
    }${results.supplyBalance}`;
}

function updateAllocationScreen() {
  const results = calculateShiftResults(crew);
  drawAllocationScreen(results);
  displayShiftResults(results);
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
