// --- script.js ---

// --- Super Agents Setup ---
const AGENTS = [
  { name: "Physics", class: "physics" },
  { name: "Mathematics", class: "math" },
  { name: "Logic", class: "logic" },
  { name: "Chemistry", class: "chemistry" },
  { name: "Biology", class: "biology" },
  { name: "Medicine", class: "medicine" },
];

const SUB_AGENT_COUNT = 6;

const superAgentsGrid = document.getElementById("superAgentsGrid");

// Generate super agent cards with sub-agents
AGENTS.forEach(agent => {
  const card = document.createElement("div");
  card.classList.add("super-agent-card", agent.class);

  const header = document.createElement("div");
  header.classList.add("super-agent-header");

  const title = document.createElement("div");
  title.classList.add("super-agent-title");
  title.innerHTML = `<span class="super-agent-icon">🧠</span> <span class="super-agent-name">${agent.name}</span>`;

  header.appendChild(title);
  card.appendChild(header);

  const stats = document.createElement("div");
  stats.classList.add("super-agent-stats");
  stats.innerText = `Sub-Agents: ${SUB_AGENT_COUNT}`;
  card.appendChild(stats);

  const subGrid = document.createElement("div");
  subGrid.classList.add("sub-agents-grid");

  for (let i = 0; i < SUB_AGENT_COUNT; i++) {
    const subCard = document.createElement("div");
    subCard.classList.add("sub-agent-card");
    subCard.innerHTML = `<div class="sub-agent-icon">🤖</div><div class="sub-agent-name">Agent ${i+1}</div>`;
    subGrid.appendChild(subCard);
  }

  card.appendChild(subGrid);
  superAgentsGrid.appendChild(card);
});

// --- Neural Stream ---
const neuralStream = document.getElementById("neuralStream");
function addNeuralStream(message) {
  const div = document.createElement("div");
  div.classList.add("stream-item");
  div.textContent = message;
  neuralStream.appendChild(div);
  neuralStream.scrollTop = neuralStream.scrollHeight;
}

// --- Thought Processing ---
const thoughtProcessing = document.getElementById("thoughtProcessing");
function addThought(message, type = "insight") {
  const div = document.createElement("div");
  div.classList.add("thought-message", type);
  div.innerHTML = `<span class="thought-icon">💡</span><div class="thought-content">${message}</div>`;
  thoughtProcessing.appendChild(div);
  thoughtProcessing.scrollTop = thoughtProcessing.scrollHeight;
}

// --- Agent Chat ---
const agentChat = document.getElementById("agentChat");
function addChat(agent, message, agentClass) {
  const div = document.createElement("div");
  div.classList.add("chat-message", agentClass);
  div.innerHTML = `<span class="chat-agent">${agent}</span><div class="chat-content">${message}</div>`;
  agentChat.appendChild(div);
  agentChat.scrollTop = agentChat.scrollHeight;
}

// --- Collaboration Stream ---
const collaborationStream = document.getElementById("collaborationStream");
function addCollab(agent, message) {
  const div = document.createElement("div");
  div.classList.add("collab-message");
  div.innerHTML = `<span class="collab-icon">🤝</span><div class="collab-text"><strong>${agent}</strong>: ${message}</div>`;
  collaborationStream.appendChild(div);
  collaborationStream.scrollTop = collaborationStream.scrollHeight;
}

// --- Activity Log ---
const activityLog = document.getElementById("activityLog");
function logActivity(message, type = "") {
  const div = document.createElement("div");
  div.classList.add("log-entry");
  div.innerHTML = `<span class="log-time">[${new Date().toLocaleTimeString()}]</span> <span class="log-message ${type}">${message}</span>`;
  activityLog.appendChild(div);
  activityLog.scrollTop = activityLog.scrollHeight;
}

// --- Simulation Buttons ---
document.getElementById("startSimBtn").addEventListener("click", () => {
  logActivity("Simulation started.");
  addNeuralStream("Neural Stream: Active...");
});

document.getElementById("generateProblemBtn").addEventListener("click", () => {
  logActivity("Generated new problem.");
  document.getElementById("problemContent").innerText = "Solve X + Y = ?";
});

document.getElementById("solveBtn").addEventListener("click", () => {
  logActivity("Solution computed.");
  document.getElementById("solutionContent").innerText = "X=5, Y=3";
  addCollab("Physics", "Verified calculation.");
  addChat("Math", "Solution confirmed.", "math");
  addThought("Cross-domain validation complete.", "cross-learning");
});

// --- Optional: Start button (if you want dynamic start) ---
document.getElementById("startBtn").addEventListener("click", () => {
  logActivity("System STARTED.");
  addNeuralStream("Probe AI online...");
});