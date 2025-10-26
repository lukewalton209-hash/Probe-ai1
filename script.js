// script.js
const AGENT_COUNT = 36;
const AGENTS = [
  "Physics","Mathematics","Logic","Neuroscience","Cognitive Science","Optimization",
  "Robotics","Systems","Ethics","Philosophy","Economics","Sociology",
  "AI Safety","ML Engineering","Data Science","Statistics","HCI","Design",
  "Security","Control Theory","Linguistics","Biology","Chemistry","Materials",
  "Law","Policy","Education","Healthcare","Product","Strategy",
  "Visualization","Hardware","Compilers","Distributed Systems","Causality","Creativity"
];

// UI elements
const startBtn = document.getElementById('startBtn');
const viewToggle = document.getElementById('viewToggle');
const networkView = document.getElementById('networkView');
const gridView = document.getElementById('gridView');
const networkCanvas = document.getElementById('networkCanvas');
const gridEl = document.getElementById('grid');
const logEl = document.getElementById('log');

viewToggle.addEventListener('change', () => {
  if (viewToggle.value === 'network') {
    networkView.classList.remove('hidden');
    gridView.classList.add('hidden');
  } else {
    networkView.classList.add('hidden');
    gridView.classList.remove('hidden');
  }
});

// render network nodes
function renderNetwork(){
  networkCanvas.innerHTML = '';
  const center = document.createElement('div');
  center.className = 'center-node';
  center.innerText = 'Probe AI';
  networkCanvas.appendChild(center);
  const R = 150;
  AGENTS.forEach((g,i)=>{
    const angle = (i / AGENTS.length) * Math.PI * 2;
    const nx = Math.round(Math.cos(angle) * R);
    const ny = Math.round(Math.sin(angle) * R);
    const node = document.createElement('div');
    node.className = 'node';
    node.style.left = `calc(50% + ${nx}px)`;
    node.style.top = `calc(50% + ${ny}px)`;
    node.innerText = g.split(' ')[0];
    networkCanvas.appendChild(node);
  });
}

// render grid view
function renderGrid(){
  gridEl.innerHTML = '';
  AGENTS.forEach((g,i)=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="agent-title">${g}</div><div class="agent-sub">Status: idle</div>`;
    gridEl.appendChild(card);
  });
}

function log(msg){
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerText = msg;
  logEl.prepend(entry);
}

// call backend to run agents
async function runAgents(){
  startBtn.disabled = true;
  startBtn.innerText = 'Activating…';
  log('Starting agents...');

  try {
    const resp = await fetch('/api/agents', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ agents: AGENTS })
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Server error: ${text}`);
    }
    const data = await resp.json();
    if (data && data.agents) {
      data.agents.forEach(a => {
        log(`${a.name}: ${a.result?.slice(0,200).replace(/\n/g,' ') || '[no output]'}`);
      });
      startBtn.innerText = 'Activated';
    } else {
      log('No agent responses returned.');
      startBtn.innerText = 'Activate Probe AI';
    }
  } catch (err) {
    log('Error: ' + err.message);
    startBtn.innerText = 'Activate Probe AI';
  } finally {
    startBtn.disabled = false;
  }
}

startBtn.addEventListener('click', runAgents);

// initial render
renderNetwork();
renderGrid();