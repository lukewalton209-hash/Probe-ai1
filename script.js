// script.js - Clean, fully functional version for Super Agents

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
const networkCanvas = document.getElementById('superAgentsGrid'); // grid display
const logEl = document.getElementById('activityLog');            // logs
const container = document.querySelector('.container');          // container

// create grid container for Super Agents
let gridEl = document.createElement('div');
gridEl.className = 'super-agents-grid';
container.appendChild(gridEl);

// function to log messages
function log(msg){
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerText = msg;
  logEl.prepend(entry);
}

// render network nodes – only keep the "Probe AI" center node
function renderNetwork(){
  networkCanvas.innerHTML = ''; // clear previous nodes

  const center = document.createElement('div');
  center.className = 'center-node';
  center.innerText = 'Probe AI';
  networkCanvas.appendChild(center);

  // Removed all 36 agent nodes above grid
}

// render Super Agents grid
function renderGrid(){
  gridEl.innerHTML = ''; // clear previous

  AGENTS.forEach(agent => {
    const card = document.createElement('div');
    card.className = 'card';

    // Only the agent title
    card.innerHTML = `<div class="agent-title">${agent}</div>`;
    gridEl.appendChild(card);
  });
}

// simulate agent activation
function runAgents(){
  startBtn.disabled = true;
  startBtn.innerText = 'Activating…';
  log('Starting all 36 agents...');

  AGENTS.forEach(agent => {
    const result = `${agent}: simulated result ready`;
    log(result);

    // highlight active card
    const cards = gridEl.getElementsByClassName('card');
    for (let card of cards){
      if(card.querySelector('.agent-title').innerText === agent){
        card.classList.add('active');
        break;
      }
    }
  });

  startBtn.innerText = 'Activated';
  startBtn.disabled = false;
}

// initial render
renderNetwork();
renderGrid();

// attach click handler
startBtn.addEventListener('click', runAgents);

// dynamic CSS for Super Agents cards
const style = document.createElement('style');
style.innerHTML = `
  .super-agents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
    width: 100%;
    margin-top: 10px;
  }

  .card {
    background-color: #1a1f3d;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    color: white;
    text-align: center;
    transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
    cursor: pointer;
  }

  .card.active {
    background-color: #4a9eff;
    transform: scale(1.05);
    box-shadow: 0 0 10px #4a9eff;
  }

  .agent-title {
    font-weight: bold;
    font-size: 14px;
    line-height: 1.2;
  }
`;
document.head.appendChild(style);