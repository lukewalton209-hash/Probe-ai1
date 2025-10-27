// === PROBE AI FULL LIVE ENGINE (NO HTML CHANGES NEEDED) ===
// Works with your existing <div class="super-agents-grid"> and all IDs

const PROBE = {
  running: false,
  agents: [],
  superAgents: [],
  problemIdx: 0,
  solved: 0,
  novel: 0,
  tfModel: null,
  superSimulator: null
};

const $ = (id) => document.getElementById(id);
const refs = {
  superAgents: document.querySelector('.super-agents-grid') || $('superAgents'),
  neuralStream: $('neuralStream'),
  agentChat: $('agentChat'),
  thoughtProcessing: $('thoughtProcessing'),
  activityLog: $('activityLog'),
  streamStatus: $('streamStatus'),
  probCount: $('probCount'),
  solvedCount: $('solvedCount'),
  novelCount: $('novelCount'),
  problemContent: $('problemContent'),
  solutionContent: $('solutionContent'),
  collabStream: $('collabStream'),
  simulatorStats: $('simulator-stats')
};

const SUPER_AGENTS = [
  {name:'Physics',   color:'physics',   emoji:'Atom'},
  {name:'Math',      color:'math',      emoji:'Infinity'},
  {name:'Chemistry', color:'chemistry', emoji:'Flask'},
  {name:'Biology',   color:'biology',   emoji:'DNA'},
  {name:'Logic',     color:'logic',     emoji:'Puzzle'},
  {name:'Medicine',  color:'medicine',  emoji:'Heart'}
];

// TensorFlow.js R² Model
async function initTF() {
  try {
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 8, activation: 'relu', inputShape: [1]}));
    model.add(tf.layers.dense({units: 1}));
    model.compile({optimizer: 'adam', loss: 'meanSquaredError'});
    const xs = tf.randomUniform([100], 0, 10);
    const ys = xs.mul(0.3).add(tf.randomNormal([100]).mul(0.1));
    await model.fit(xs, ys, {epochs: 50, verbose: 0});
    PROBE.tfModel = model;
  } catch (e) {
    console.error('TF.js failed to load:', e);
  }
}
initTF();

function buildSuperAgents() {
  if (!refs.superAgents) return;
  refs.superAgents.innerHTML = '';
  PROBE.superAgents = [];
  SUPER_AGENTS.forEach((sa, i) => {
    const card = document.createElement('div');
    card.className = `super-agent-card ${sa.color}`;
    card.innerHTML = `
      <div class="super-agent-header">
        <div class="super-agent-title">
          <span class="super-agent-icon">${sa.emoji}</span>
          <div class="super-agent-name">${sa.name}</div>
        </div>
        <div class="super-agent-stats">R²: <span class="r2-val">—</span></div>
      </div>
      <div class="sub-agents-grid" id="sub-${i}"></div>
    `;
    refs.superAgents.appendChild(card);
    PROBE.superAgents.push({grid: $(`sub-${i}`)});
  });
}

function spawnAgents() {
  if (PROBE.superAgents.length === 0) return;
  PROBE.agents = [];
  let id = 0;
  SUPER_AGENTS.forEach((sa, sIdx) => {
    const grid = PROBE.superAgents[sIdx].grid;
    if (!grid) return;
    for (let j = 0; j < 6; j++) {
      const sub = document.createElement('div');
      sub.className = 'sub-agent-card';
      sub.dataset.id = id;
      sub.innerHTML = `
        <div class="sub-agent-header"><span class="sub-agent-icon">Robot</span></div>
        <div class="sub-agent-name">A${id}</div>
        <div class="sub-agent-status">idle</div>
        <div class="sub-agent-r2">—</div>
        <div class="sub-agent-progress"><div class="sub-agent-progress-fill" style="width:0%"></div></div>
        <div class="sub-agent-discoveries">0</div>
      `;
      grid.appendChild(sub);
      PROBE.agents.push({
        id, sIdx, el: sub, status: 'idle',
        progress: 0, r2: null, discoveries: 0
      });
      id++;
    }
  });
}

function log(msg, type = '') {
  if (!refs.activityLog) return;
  const el = document.createElement('div');
  el.className = 'log-entry';
  el.innerHTML = `<span class="log-time">[${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})}]</span><span class="log-message ${type}">${msg}</span>`;
  refs.activityLog.appendChild(el);
  refs.activityLog.scrollTop = refs.activityLog.scrollHeight;
}

function stream(topic, text) {
  if (!refs.neuralStream) return;
  const el = document.createElement('div');
  el.className = 'stream-item';
  el.innerHTML = `<span class="stream-topic">${topic}</span> ${text}`;
  refs.neuralStream.appendChild(el);
  refs.neuralStream.scrollTop = refs.neuralStream.scrollHeight;
}

function chat(id, msg, domain) {
  if (!refs.agentChat) return;
  const el = document.createElement('div');
  el.className = `chat-message ${domain}`;
  el.innerHTML = `<div class="chat-agent">A${id}</div><div class="chat-content">${msg}</div>`;
  refs.agentChat.appendChild(el);
  refs.agentChat.scrollTop = refs.agentChat.scrollHeight;
}

function think(type, label, text) {
  if (!refs.thoughtProcessing) return;
  const el = document.createElement('div');
  el.className = `thought-message ${type}`;
  el.innerHTML = `<span class="thought-icon">Idea</span><div class="thought-content"><div class="thought-label">${label}</div><div class="thought-text">${text}</div></div>`;
  refs.thoughtProcessing.appendChild(el);
  refs.thoughtProcessing.scrollTop = refs.thoughtProcessing.scrollHeight;
}

const PROBLEMS = [
  {title:'Quantum Tunneling', equation:'Ψ(x) = A e^(i k x)', desc:'Calculate transmission coefficient.', domains:['Physics']},
  {title:'Non-linear Fit', equation:'y = a·x³ + b·x² + c', desc:'Fit cubic model to data.', domains:['Math']},
  {title:'Enzyme Kinetics', equation:'v = V_max·[S]/(K_m + [S])', desc:'Find Michaelis-Menten params.', domains:['Chemistry', 'Biology']},
  {title:'DNA Alignment', equation:'Score = Σ match - gap', desc:'Align two sequences.', domains:['Biology']},
  {title:'Logic Proof', equation:'(P∨Q) ∧ ¬P ⇒ Q', desc:'Prove using deduction.', domains:['Logic']},
  {title:'Pharmacokinetics', equation:'C(t) = D/V · e^(-k t)', desc:'Predict plasma curve.', domains:['Medicine']}
];

let interval = null;
function startProbe() {
  if (PROBE.running) return;
  PROBE.running = true;
  if (refs.streamStatus) refs.streamStatus.textContent = 'Active';
  log('PROBE AI Activated – 36 agents online', 'api-success');

  let tick = 0;
  interval = setInterval(() => {
    tick++;

    // Training
    if (tick < 180 && PROBE.agents.length > 0) {
      const a = PROBE.agents[Math.floor(Math.random() * PROBE.agents.length)];
      if (a.status !== 'training') {
        a.status = 'training';
        a.el.classList.add('training');
        a.el.querySelector('.sub-agent-status').textContent = 'training';
      }
      a.progress = Math.min(100, a.progress + 2.5);
      a.el.querySelector('.sub-agent-progress-fill').style.width = a.progress + '%';
      if (a.progress >= 100) {
        a.status = 'active';
        a.el.classList.remove('training'); a.el.classList.add('active');
        a.el.querySelector('.sub-agent-status').textContent = 'ready';
        if (PROBE.tfModel) {
          (async () => {
            const pred = PROBE.tfModel.predict(tf.tensor2d([[Math.random()*10]], [1,1]));
            const r2 = (await pred.data())[0].toFixed(3);
            a.el.querySelector('.sub-agent-r2').textContent = `R² ${r2}`;
            a.r2 = parseFloat(r2);
          })();
        }
      }
    }

    // New Problem
    if (tick % 45 === 0 && PROBE.problemIdx < PROBLEMS.length) {
      const p = PROBLEMS[PROBE.problemIdx++];
      if (refs.probCount) refs.probCount.textContent = PROBE.problemIdx;
      if (refs.problemContent) refs.problemContent.innerHTML = `
        <div class="problem-title">${p.title}</div>
        <div class="problem-equation">${p.equation}</div>
        <div class="problem-desc">${p.desc}</div>
        <div class="problem-desc" style="color: var(--accent-purple); margin-top: 4px;">Domains: ${p.domains.join(', ')}</div>`;
      stream('PROBLEM', p.title);
      log(`New challenge: ${p.title}`, 'breakthrough');
    }

    // Solve
    if (tick % 30 === 0 && PROBE.problemIdx > PROBE.solved && PROBE.agents.length > 0) {
      const active = PROBE.agents.filter(a => a.status === 'active');
      if (active.length > 0) {
        const initiator = active[Math.floor(Math.random() * active.length)];
        const problem = PROBLEMS[PROBE.solved];
        if (PROBE.superSimulator) {
          PROBE.superSimulator.runSimulation(
            { name: `A${initiator.id}`, r2Score: a.r2 || 0.5 },
            problem.title
          );
        }
092        PROBE.solved++;
        if (refs.solvedCount) refs.solvedCount.textContent = PROBE.solved;
        if (Math.random() < 0.35) { PROBE.novel++; if (refs.novelCount) refs.novelCount.textContent = PROBE.novel; }
        log(`Problem #${PROBE.solved} solved`, 'api-success');
        chat(initiator.id, `Contributed to ${problem.title}`, SUPER_AGENTS[initiator.sIdx].color);
      }
    }

    if (PROBE.solved >= PROBLEMS.length) stopProbe();
  }, 200);
}

function stopProbe() {
  clearInterval(interval);
  PROBE.running = false;
  if (refs.streamStatus) refs.streamStatus.textContent = 'Complete';
  log('All problems solved.', 'api-success');
}

// Button Controls
document.addEventListener('click', e => {
  const t = e.target;
  if (t.matches('#startBtn, #simStart, .btn-active, #startSimBtn')) startProbe();
  if (t.matches('#simPause')) { clearInterval(interval); PROBE.running = false; if (refs.streamStatus) refs.streamStatus.textContent = 'Paused'; }
  if (t.matches('#simReset, #resetBtn, #resetBtn2')) resetProbe();
});

function resetProbe() {
  clearInterval(interval);
  PROBE.running = false;
  PROBE.problemIdx = PROBE.solved = PROBE.novel = 0;
  ['probCount','solvedCount','novelCount'].forEach(id => { const el = $(id); if (el) el.textContent = '0'; });
  if (refs.problemContent) refs.problemContent.textContent = 'Waiting...';
  if (refs.solutionContent) refs.solutionContent.innerHTML = '';
  ['neuralStream','agentChat','thoughtProcessing','activityLog','collabStream'].forEach(id => { const el = $(id); if (el) el.innerHTML = ''; });
  if (refs.streamStatus) refs.streamStatus.textContent = 'Idle';
  buildSuperAgents();
  spawnAgents();
  log('System reset', 'cache-hit');
}

// SuperSimulator Class (your original)
class SuperSimulator {
  constructor(agents) {
    this.agents = agents;
    this.activeSimulations = [];
    this.collaborations = 0;
  }
  async runSimulation(initiatorAgent, problemType) {
    this.collaborations++;
    log(`Simulation: ${initiatorAgent.name} → ${problemType}`, 'simulation');
  }
  getStats() {
    return {
      totalSimulations: this.activeSimulations.length,
      collaborations: this.collaborations,
      activeNow: this.activeSimulations.filter(s => Date.now() - s.startTime < 10000).length
    };
  }
}
PROBE.superSimulator = new SuperSimulator(PROBE.agents);

// Real-time UI
setInterval(() => {
  if (typeof updateAgentDisplay === 'function') updateAgentDisplay();
  if (typeof updateActivityLog === 'function') updateActivityLog();
  if (typeof updateDiscoveries === 'function') updateDiscoveries();
  updateSimulatorStats();
}, 500);

function updateSimulatorStats() {
  const stats = PROBE.superSimulator ? PROBE.superSimulator.getStats() : { totalSimulations: 0, collaborations: 0, activeNow: 0 };
  const statsEl = document.getElementById('simulator-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="sim-stat">Simulations: ${stats.totalSimulations}</div>
      <div class="sim-stat">Collaborations: ${stats.collaborations}</div>
      <div class="sim-stat">Active: ${stats.activeNow}</div>
    `;
  }
}

// Init
setTimeout(() => {
  buildSuperAgents();
  spawnAgents();
  log('PROBE AI loaded – 36 agents ready', 'cache-hit');
  setTimeout(startProbe, 1000);
}, 500);