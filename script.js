// --- Configuration ---
const AGENTS = [
  { name: "Physics", type: "physics" },
  { name: "Mathematics", type: "math" },
  { name: "Logic", type: "logic" },
  { name: "Chemistry", type: "chemistry" },
  { name: "Biology", type: "biology" },
  { name: "Medicine", type: "medicine" }
];

const SUBAGENTS_PER_AGENT = 6;

// --- DOM References ---
const superAgentsGrid = document.querySelector('.super-agents-grid');

// --- Utility Functions ---
function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

// --- Build Super Agents ---
function buildSuperAgents() {
  AGENTS.forEach(agent => {
    // Super Agent Card
    const card = createElement('div', `super-agent-card ${agent.type}`);

    // Header
    const header = createElement('div', 'super-agent-header');
    const title = createElement('div', 'super-agent-title');
    const icon = createElement('span', 'super-agent-icon', '⚡');
    const name = createElement('span', 'super-agent-name', agent.name);
    title.appendChild(icon);
    title.appendChild(name);
    header.appendChild(title);

    // Stats
    const stats = createElement('div', 'super-agent-stats', `0/${SUBAGENTS_PER_AGENT} subagents active`);
    header.appendChild(stats);
    card.appendChild(header);

    // Sub Agents Grid
    const subGrid = createElement('div', 'sub-agents-grid');
    for (let i = 1; i <= SUBAGENTS_PER_AGENT; i++) {
      const sub = createElement('div', 'sub-agent-card');
      const subHeader = createElement('div', 'sub-agent-header');
      const subIcon = createElement('span', 'sub-agent-icon', '🧠');
      const subName = createElement('div', 'sub-agent-name', `${agent.name} ${i}`);
      const subStatus = createElement('div', 'sub-agent-status', 'idle');

      subHeader.appendChild(subIcon);
      subHeader.appendChild(subName);
      sub.appendChild(subHeader);
      sub.appendChild(subStatus);

      // Progress Bar
      const progress = createElement('div', 'sub-agent-progress');
      const progressFill = createElement('div', 'sub-agent-progress-fill');
      progress.appendChild(progressFill);
      sub.appendChild(progress);

      sub.addEventListener('click', () => toggleSubAgent(sub, stats));

      subGrid.appendChild(sub);
    }

    card.appendChild(subGrid);
    superAgentsGrid.appendChild(card);
  });
}

// --- Sub Agent Click Handler ---
function toggleSubAgent(sub, stats) {
  const isActive = sub.classList.contains('active');
  if (isActive) {
    sub.classList.remove('active');
    sub.querySelector('.sub-agent-status').textContent = 'idle';
    sub.querySelector('.sub-agent-progress-fill').style.width = '0%';
  } else {
    sub.classList.add('active');
    sub.querySelector('.sub-agent-status').textContent = 'active';
    sub.querySelector('.sub-agent-progress-fill').style.width = `${Math.floor(Math.random()*100)}%`;
  }

  // Update super-agent stats
  const parentCard = sub.closest('.super-agent-card');
  const activeSubs = parentCard.querySelectorAll('.sub-agent-card.active').length;
  parentCard.querySelector('.super-agent-stats').textContent = `${activeSubs}/${SUBAGENTS_PER_AGENT} subagents active`;
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  buildSuperAgents();
});