export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const pendingList = document.querySelector<HTMLOListElement>(
  "#rover-pending",
)!;
const statusDisplay = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

let x = 2;
let y = 2;
let direction = 0;

type Direction = {
  heading: string;
  dx: number;
  dy: number;
};

const directions: Direction[] = [
  { heading: "North", dx: 0, dy: -1 },
  { heading: "East", dx: 1, dy: 0 },
  { heading: "South", dx: 0, dy: 1 },
  { heading: "West", dx: -1, dy: 0 },
];

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].heading
  }`;
}

function updateQueueButtons() {
  runButton.disabled = statusQueue.length > 0 ? false : true;
  clearButton.disabled = statusQueue.length > 0 ? false : true;
}

function updateQueueDisplay() {
  // Remove all children from list
  pendingList.innerHTML = "";
  // Add all command labels to the displayed list
  for (const command of statusQueue) {
    pendingList.innerHTML += `<li>${command.label}</li>`;
  }

  statusDisplay.textContent = `${statusQueue.length} commands pending`;
}

function updateQueue() {
  updateQueueButtons();
  updateQueueDisplay();
}

type Command = {
  label: string;
  execute: () => void;
};

const forwardCommand: Command = {
  label: "Forward",
  execute: function forward() {
    const currentDirection = directions[direction];

    // Max and min keep the rover from going outside of bounds
    x = Math.max(0, Math.min(4, x + currentDirection.dx));
    y = Math.max(0, Math.min(4, y + currentDirection.dy));
    drawRover();
  },
};

const rightCommand: Command = {
  label: "Right",
  execute: function right() {
    direction = (direction + 1) % 4;
    drawRover();
  },
};

const resetCommand: Command = {
  label: "Reset",
  execute: function reset() {
    x = 2;
    y = 2;
    direction = 0;
    drawRover();
  },
};

const statusQueue: Command[] = [];

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  statusQueue.push(forwardCommand);
  updateQueue();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  statusQueue.push(rightCommand);
  updateQueue();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  resetCommand.execute();
  statusQueue.length = 0;
  updateQueue();
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  for (const command of statusQueue) {
    command.execute();
  }
  statusQueue.length = 0;
  updateQueue();
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  statusQueue.length = 0;
  updateQueue();
};

drawRover();
updateQueue();
