// script.js - Safari/GitHub Pages ready with network + grid view

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
const networkCanvas = document.getElementById('superAgentsGrid'); // network display
const logEl = document.getElementById('activityLog');            // logs
const container = document.querySelector('.container');          // for grid

// create grid container
let gridEl = document.createElement('div');
gridEl.className = 'grid';
container.insertBefore(gridEl, container.firstChild.nextSibling); // insert after banner

// function to log messages
function log(msg){
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerText = msg;
  logEl.prepend(entry);
}

// render network nodes
function renderNetwork(){
  networkCanvas.innerHTML = '';
  
  // center node
  const center = document.createElement('div');
  center.className = 'center-node';
  center.innerText = 'Probe AI';
  networkCanvas.appendChild(center);

  const R = 150; // radius
  AGENTS.forEach((agent, i)=>{
    const angle = (i / AGENTS.length) * Math.PI * 2;
    const nx = Math.round(Math.cos(angle) * R);
    const ny = Math.round(Math.sin(angle) * R);
    const node = document.createElement('div');
    node.className = 'node';
    node.style.left = `calc(50% + ${nx}px)`;
    node.style.top = `calc(50% + ${ny}px)`;
    node.innerText = agent.split(' ')[0];
    networkCanvas.appendChild(node);
  });
}

// render grid view
function renderGrid(){
  gridEl.innerHTML = '';
  AGENTS.forEach(agent => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="agent-title">${agent}</div><div class="agent-sub">Status: idle</div>`;
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
    
    // update grid card
    const cards = gridEl.getElementsByClassName('card');
    for (let card of cards){
      if(card.querySelector('.agent-title').innerText === agent){
        card.querySelector('.agent-sub').innerText = 'Status: active';
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