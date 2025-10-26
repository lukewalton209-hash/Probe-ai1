// script.js - Fixed for your Alpha layout

const AGENTS = [
  "Physics","Mathematics","Logic","Neuroscience","Cognitive Science","Optimization",
  "Robotics","Systems","Ethics","Philosophy","Economics","Sociology",
  "AI Safety","ML Engineering","Data Science","Statistics","HCI","Design",
  "Security","Control Theory","Linguistics","Biology","Chemistry","Materials",
  "Law","Policy","Education","Healthcare","Product","Strategy",
  "Visualization","Hardware","Compilers","Distributed Systems","Causality","Creativity"
];

const startBtn = document.getElementById('startBtn');
const superAgentsGrid = document.getElementById('superAgentsGrid');
const activityLog = document.getElementById('activityLog');

// Render your Super Agents cards exactly as before
function renderGrid(){
  superAgentsGrid.innerHTML = '';
  AGENTS.forEach(agent => {
    const card = document.createElement('div');
    card.className = 'card';
    // Keep the agent name inside the card
    card.innerHTML = `<div class="agent-title">${agent}</div>`;
    superAgentsGrid.appendChild(card);
  });
}

// Simulate agent activation
function runAgents(){
  startBtn.disabled = true;
  startBtn.innerText = 'Activating…';
  log('Activating all Super Agents...');

  AGENTS.forEach(agent => {
    const result = `${agent}: ready`;
    log(result);

    // mark card as active visually
    const cards = superAgentsGrid.getElementsByClassName('card');
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

// log helper
function log(msg){
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerText = msg;
  activityLog.prepend(entry);
}

// Initial render
renderGrid();
startBtn.addEventListener('click', runAgents);

// Optional CSS for cards and activity log
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
    text-align: center;
    color: white;
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