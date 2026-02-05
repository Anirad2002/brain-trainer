// Гра "Нейронні пари"

let memoryGameState = {
  level: 1,
  stage: 'intro',
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  totalPairs: 0,
  moves: 0,
  startTime: null,
  timeLimit: 0,
  timer: null
};

const CARD_SETS = {
  colors: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🔷'],
  numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  fruits: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍑', '🍒', '🥝'],
  shapes: ['⭐', '🔺', '🔻', '🔶', '🔷', '🔸', '🔹', '🟨', '🟦', '🟩']
};

function renderGameMemory() {
  loadMemoryLevel().then(() => {
    if (memoryGameState.stage === 'intro' || memoryGameState.stage === 'playing') {
      renderMemoryIntro();
    }
  });
}

async function loadMemoryLevel() {
  try {
    const level = await db.getSetting('game_memory_level') || 1;
    memoryGameState.level = level;
  } catch (error) {
    console.error('ПомилLevel loading error:', error);
  }
}

function renderMemoryIntro() {
  const app = document.getElementById('app');
  const pairsCount = memoryGameState.level === 1 ? 4 : memoryGameState.level === 2 ? 6 : memoryGameState.level === 3 ? 8 : 10;
  const timeLimit = memoryGameState.level === 1 ? 60 : memoryGameState.level === 2 ? 90 : memoryGameState.level === 3 ? 120 : 180;
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="game-icon-large">🧠</div>
          <h2 data-i18n="game_memory_title">${i18n.t('game_memory_title')}</h2>
          <div class="badge badge-primary" style="font-size: 1.25rem; padding: 0.75rem 1.5rem;">
            ${i18n.t('game_level')} ${memoryGameState.level}
          </div>
        </div>
        
        <div class="game-instructions">
          <h3 data-i18n="game_words_instruction">${i18n.t('game_words_instruction')}</h3>
          <ol>
            <li data-i18n="mem_step1">${i18n.t('mem_step1')}</li>
            <li data-i18n="mem_step2">${i18n.t('mem_step2')}</li>
            <li data-i18n="mem_step3">${i18n.t('mem_step3')}</li>
            <li>${i18n.t('mem_step4').replace('{pairs}', pairsCount).replace('{time}', timeLimit)}</li>
          </ol>
          
          <div class="game-stats-preview">
            <div class="stat-item">
              <span class="stat-label" data-i18n="mem_pairs">${i18n.t('mem_pairs')}:</span>
              <span class="stat-value">${pairsCount}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label" data-i18n="mem_time">${i18n.t('mem_time')}:</span>
              <span class="stat-value">${timeLimit}${i18n.t('mem_sec')}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label" data-i18n="mem_grid">${i18n.t('mem_grid')}:</span>
              <span class="stat-value">${Math.ceil(Math.sqrt(pairsCount * 2))}×${Math.ceil((pairsCount * 2) / Math.ceil(Math.sqrt(pairsCount * 2)))}</span>
            </div>
          </div>
        </div>
        
        <button class="btn btn-primary" onclick="startMemoryGame()" data-i18n="game_start">${i18n.t('game_start')}</button>
        <button class="btn btn-outline" onclick="showMemoryHistory()" style="margin-top: 1rem;" data-i18n="game_history">${i18n.t('game_history')}</button>
        <button class="btn btn-outline" onclick="navigateTo('games', event)" style="margin-top: 1rem;" data-i18n="back_to_profile">${i18n.t('back_to_profile')}</button>
      </div>
    </div>
  `;
}

function startMemoryGame() {
  memoryGameState.stage = 'playing';
  memoryGameState.flippedCards = [];
  memoryGameState.matchedPairs = 0;
  memoryGameState.moves = 0;
  memoryGameState.startTime = Date.now();
  
  const pairsCount = memoryGameState.level === 1 ? 4 : memoryGameState.level === 2 ? 6 : memoryGameState.level === 3 ? 8 : 10;
  memoryGameState.totalPairs = pairsCount;
  memoryGameState.timeLimit = memoryGameState.level === 1 ? 60 : memoryGameState.level === 2 ? 90 : memoryGameState.level === 3 ? 120 : 180;
  
  const setKeys = Object.keys(CARD_SETS);
  const randomSet = CARD_SETS[setKeys[Math.floor(Math.random() * setKeys.length)]];
  const selectedIcons = randomSet.slice(0, pairsCount);
  const pairs = [...selectedIcons, ...selectedIcons];
  
  memoryGameState.cards = pairs
    .map((icon, index) => ({ id: index, icon, matched: false, flipped: false }))
    .sort(() => Math.random() - 0.5);
  
  renderMemoryUI();
  startTimer();
}

function renderMemoryUI() {
  const app = document.getElementById('app');
  const gridSize = Math.ceil(Math.sqrt(memoryGameState.cards.length));
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="memory-header">
          <h2 data-i18n="game_memory_title">${i18n.t('game_memory_title')}</h2>
          <div class="memory-stats">
            <div class="stat-box"><span>⏱️</span><span id="timer">${memoryGameState.timeLimit}</span></div>
            <div class="stat-box"><span>🎯</span><span id="pairs">${memoryGameState.matchedPairs}/${memoryGameState.totalPairs}</span></div>
            <div class="stat-box"><span>🔄</span><span id="moves">${memoryGameState.moves}</span></div>
          </div>
        </div>
        
        <div class="memory-grid" style="grid-template-columns: repeat(${gridSize}, 1fr);">
          ${memoryGameState.cards.map((card, index) => `
            <div class="memory-card ${card.matched ? 'matched' : ''} ${card.flipped ? 'flipped' : ''}" 
                 onclick="flipCard(${index})" data-index="${index}">
              <div class="card-inner">
                <div class="card-front">❓</div>
                <div class="card-back">${card.icon}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-outline" onclick="quitMemoryGame()" style="margin-top: 2rem;" data-i18n="mem_exit">${i18n.t('mem_exit')}</button>
      </div>
    </div>
  `;
}

function startTimer() {
  if (memoryGameState.timer) clearInterval(memoryGameState.timer);
  let timeLeft = memoryGameState.timeLimit;
  memoryGameState.timer = setInterval(() => {
    timeLeft--;
    const timerEl = document.getElementById('timer');
    if (timerEl) {
      timerEl.textContent = timeLeft;
      if (timeLeft <= 10) { timerEl.style.color = 'var(--error)'; timerEl.style.fontWeight = 'bold'; }
    }
    if (timeLeft <= 0) { clearInterval(memoryGameState.timer); gameOver(false); }
  }, 1000);
}

function flipCard(index) {
  const card = memoryGameState.cards[index];
  if (card.matched || card.flipped || memoryGameState.flippedCards.length >= 2) return;
  
  card.flipped = true;
  memoryGameState.flippedCards.push(index);
  document.querySelector(`.memory-card[data-index="${index}"]`).classList.add('flipped');
  
  if (memoryGameState.flippedCards.length === 2) {
    memoryGameState.moves++;
    updateStats();
    checkMatch();
  }
}

function checkMatch() {
  const [index1, index2] = memoryGameState.flippedCards;
  const card1 = memoryGameState.cards[index1];
  const card2 = memoryGameState.cards[index2];
  
  if (card1.icon === card2.icon) {
    setTimeout(() => {
      card1.matched = card2.matched = true;
      memoryGameState.matchedPairs++;
      document.querySelector(`.memory-card[data-index="${index1}"]`).classList.add('matched');
      document.querySelector(`.memory-card[data-index="${index2}"]`).classList.add('matched');
      memoryGameState.flippedCards = [];
      updateStats();
      if (memoryGameState.matchedPairs === memoryGameState.totalPairs) setTimeout(() => gameOver(true), 500);
    }, 500);
  } else {
    setTimeout(() => {
      card1.flipped = card2.flipped = false;
      document.querySelector(`.memory-card[data-index="${index1}"]`).classList.remove('flipped');
      document.querySelector(`.memory-card[data-index="${index2}"]`).classList.remove('flipped');
      memoryGameState.flippedCards = [];
    }, 1000);
  }
}

function updateStats() {
  const p = document.getElementById('pairs');
  const m = document.getElementById('moves');
  if (p) p.textContent = `${memoryGameState.matchedPairs}/${memoryGameState.totalPairs}`;
  if (m) m.textContent = memoryGameState.moves;
}

async function gameOver(won) {
  clearInterval(memoryGameState.timer);
  const timeSpent = Math.round((Date.now() - memoryGameState.startTime) / 1000);
  const timeLeft = Math.max(0, memoryGameState.timeLimit - timeSpent);
  
  const user = auth.getCurrentUser();
  if (user) {
    await saveMemoryHistory({ date: new Date().toISOString(), level: memoryGameState.level, won, moves: memoryGameState.moves, timeLeft: won ? timeLeft : 0, timeSpent });
  }
  
  if (won && memoryGameState.level < 5) {
    memoryGameState.level++;
    await db.saveSetting('game_memory_level', memoryGameState.level);
  } else if (!won && memoryGameState.level > 1) {
    memoryGameState.level--;
    await db.saveSetting('game_memory_level', memoryGameState.level);
  }
  renderMemoryResult(won, timeLeft, timeSpent);
}

function renderMemoryResult(won, timeLeft, timeSpent) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="game-icon-large">${won ? '🎉' : '⏱️'}</div>
          <h2 data-i18n="${won ? 'game_win' : 'mem_time_over'}">${won ? i18n.t('game_win') : i18n.t('mem_time_over')}</h2>
          <div class="badge ${won ? 'badge-success' : 'badge-error'}" style="font-size: 1.5rem; padding: 1rem 2rem;">
            ${won ? i18n.t('mem_level_pass') : i18n.t('game_lose')}
          </div>
        </div>
        
        <div class="alert ${won ? 'alert-success' : 'alert-error'} show">
          ${won ? `
            <span data-i18n="mem_found_all">${i18n.t('mem_found_all')}</span><br>
            ${i18n.t('mem_time_left')}: ${timeLeft}${i18n.t('mem_sec')}
          ` : `
            <span data-i18n="mem_time_over">${i18n.t('mem_time_over')}</span> ${i18n.t('game_level')} ${memoryGameState.level}<br>
            ${i18n.t('mem_found_stat')}: ${memoryGameState.matchedPairs}/${memoryGameState.totalPairs}
          `}
          <br>${i18n.t('mem_moves')}: ${memoryGameState.moves}
        </div>
        
        <button class="btn btn-primary" onclick="startMemoryGame()" style="margin-top: 2rem;" data-i18n="game_play_again">${i18n.t('game_play_again')}</button>
        <button class="btn btn-outline" onclick="navigateTo('games', event)" style="margin-top: 1rem;" data-i18n="back_to_profile">${i18n.t('back_to_profile')}</button>
      </div>
    </div>
  `;
}

function quitMemoryGame() {
  if (confirm(i18n.t('mem_quit_conf'))) {
    clearInterval(memoryGameState.timer);
    navigateTo('games');
  }
}

async function saveMemoryHistory(entry) {
  try {
    const user = auth.getCurrentUser();
    if (!user) return;
    const history = await db.getSetting('game_memory_history') || [];
    history.push({ ...entry, userEmail: user.email });
    await db.saveSetting('game_memory_history', history.slice(-50));
  } catch (e) { console.error(e); }
}

async function showMemoryHistory() {
  try {
    const history = await db.getSetting('game_memory_history') || [];
    const user = auth.getCurrentUser();
    const userHistory = history.filter(h => h.userEmail === user.email).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    
    document.getElementById('app').innerHTML = `
      <div class="container">
        <div class="card">
          <h2 data-i18n="game_history">${i18n.t('game_history')}</h2>
          ${userHistory.length === 0 ? `<p style="text-align: center; color: var(--text-light); margin: 2rem 0;" data-i18n="game_history_empty">${i18n.t('game_history_empty')}</p>` : `
            <div class="history-list">
              ${userHistory.map(entry => `
                <div class="history-item">
                  <div class="history-date">📅 ${UI.formatDate(entry.date)}</div>
                  <div class="history-stats">
                    <span class="badge ${entry.won ? 'badge-success' : 'badge-error'}">${i18n.t('game_level')} ${entry.level}</span>
                    <span class="badge badge-primary">${entry.moves} ${i18n.t('game_check').toLowerCase()}</span>
                    <span style="color: ${entry.won ? 'var(--success)' : 'var(--error)'}; font-size: 0.875rem;">
                      ⏱️ ${entry.won ? '+' + entry.timeLeft : entry.timeSpent}${i18n.t('mem_sec')}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
          <button class="btn btn-outline" onclick="renderGameMemory()" style="margin-top: 2rem;" data-i18n="back_to_profile">${i18n.t('back_to_profile')}</button>
        </div>
      </div>
    `;
  } catch (e) { console.error(e); }
}

// Global exposure
window.startMemoryGame = startMemoryGame;
window.flipCard = flipCard;
window.quitMemoryGame = quitMemoryGame;
window.showMemoryHistory = showMemoryHistory;

if (typeof router !== 'undefined') router.register('game-memory', renderGameMemory);