// Сторінка ігор

function renderGames() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h2 data-i18n="games_title">${i18n.t('games_title')}</h2>
        <p style="color: var(--text-light); margin-bottom: 2rem;" data-i18n="games_subtitle">
          ${i18n.t('games_subtitle')}
        </p>
        
        <div class="games-grid">
          <div class="game-card" onclick="navigateTo('game-words', event)">
            <div class="game-icon">📚</div>
            <h3 data-i18n="game_words_title">${i18n.t('game_words_title')}</h3>
            <p data-i18n="game_words_desc">${i18n.t('game_words_desc')}</p>
            <div class="game-stats">
              <span class="game-level" id="wordsLevel">${i18n.t('game_level')}: 1</span>
            </div>
          </div>
          
          <div class="game-card" onclick="navigateTo('game-memory', event)">
            <div class="game-icon">🧠</div>
            <h3 data-i18n="game_memory_title">${i18n.t('game_memory_title')}</h3>
            <p data-i18n="game_memory_desc">${i18n.t('game_memory_desc')}</p>
            <div class="game-stats">
              <span class="game-level" id="memoryLevel">${i18n.t('game_level')}: 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  loadGameLevels();
}

async function loadGameLevels() {
  try {
    const wordsLevel = await db.getSetting('game_words_level') || 1;
    const memoryLevel = await db.getSetting('game_memory_level') || 1;
    
    const wordsEl = document.getElementById('wordsLevel');
    const memoryEl = document.getElementById('memoryLevel');
    
    const levelText = i18n.t('game_level');
    if (wordsEl) wordsEl.textContent = `${levelText}: ${wordsLevel}`;
    if (memoryEl) memoryEl.textContent = `${levelText}: ${memoryLevel}`;
  } catch (error) {
    console.error('Error loading levels:', error);
  }
}

// Реєстрація маршруту
if (typeof router !== 'undefined') {
  router.register('games', renderGames);
} else {
  console.error('❌ Router is not defined in games.js');
}