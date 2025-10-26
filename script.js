// script.js - Clean version for stripped-down Probe AI

const AGENTS = [
  "Physics","Mathematics","Logic","Neuroscience","Cognitive Science","Optimization",
  "Robotics","Systems","Ethics","Philosophy","Economics","Sociology",
  "AI Safety","ML Engineering","Data Science","Statistics","HCI","Design",
  "Security","Control Theory","Linguistics","Biology","Chemistry","Materials",
  "Law","Policy","Education","Healthcare","Product","Strategy",
  "Visualization","Hardware","Compilers","Distributed Systems","Causality","Creativity"
];

// UI elements
const startBtn = document.getElementById('startBtn'); // you may keep if you want a start button elsewhere
const superAgentsGrid = document.getElementById('superAgentsGrid');
const activityLog = document.getElementById('activityLog');

// Function to log messages
function log(msg){
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerText = msg;
  activityLog.prepend(entry);
}

// Render the Super Agents grid
function renderGrid(){
  superAgentsGrid.innerHTML = '';
  AGENTS.forEach(agent => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="agent-title">${agent}</div>`;
    superAgentsGrid.appendChild(card);
  });
}

// Simulate agent activation
function runAgents(){
  if(startBtn){
    startBtn.disabled = true;
    startBtn.innerText = 'Activating…';
  }

  log('Starting all agents...');

  AGENTS.forEach(agent => {
    const result = `${agent}: simulated result ready`;
    log(result);

    // Mark agent as active in grid
    const cards = superAgentsGrid.getElementsByClassName('card');
    for (let card of cards){
      if(card.querySelector('.agent-title').innerText === agent){
        card.classList.add('active');
        break;
      }
    }
  });

  if(startBtn){
    startBtn.innerText = 'Activated';
    startBtn.disabled = false;
  }
}

// Initial render
renderGrid();

// Optional: attach to start button if you still have one
if(startBtn){
  startBtn.addEventListener('click', runAgents);
}

// Optional: add some CSS dynamically for the cards
const style = document.createElement('style');
style.innerHTML = `
  .super-agents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    width: 100%;
  }
  .card {
    background-color: #1a1f3d;
    border-radius: 8px;
    padding: 10px;
    color: white;
    text-align: center;
    transition: transform 0.2s, background-color 0.2s;
  }
  .card.active {
    background-color: #4a9eff;
    transform: scale(1.05);
    box-shadow: 0 0 10px #4a9eff;
  }
  .agent-title {
    font-weight: bold;
    font-size: 14px;
  }
  .log-entry {
    font-size: 12px;
    margin-bottom: 2px;
    color: #ffffff;
  }
`;
document.head.appendChild(style);