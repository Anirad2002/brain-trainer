// Гра "Лексичний атлас"

let wordsGameState = {
  level: 1,
  stage: 'intro', // intro, memorize, test, result
  correctWords: [],
  selectedWords: [],
  allWords: [],
  startTime: null
};

// Розширені словники для всіх підтримуваних мов
const WORD_BANK = {
  uk: [
    'яблуко', 'книга', 'вікно', 'стіл', 'сонце', 'місяць', 'зірка', 'квітка',
    'дерево', 'вода', 'вогонь', 'земля', 'небо', 'гора', 'річка', 'море',
    'птах', 'риба', 'кіт', 'собака', 'будинок', 'дорога', 'ліс', 'поле',
    'камінь', 'пісок', 'хмара', 'дощ', 'вітер', 'сніг', 'лід', 'трава',
    'листок', 'корінь', 'гілка', 'плід', 'насіння', 'повітря', 'світло'
  ],
  pl: [
    'jabłko', 'książka', 'okno', 'stół', 'słońce', 'księżyc', 'gwiazda', 'kwiat',
    'drzewo', 'woda', 'ogień', 'ziemia', 'niebo', 'góra', 'rzeka', 'morze',
    'ptak', 'ryba', 'kot', 'pies', 'dom', 'droga', 'las', 'pole',
    'kamień', 'piasek', 'chmura', 'deszcz', 'wiatr', 'śnieg', 'lód', 'trawa',
    'liść', 'korzeń', 'gałąź', 'owoc', 'nasiono', 'powietrze', 'światło'
  ],
  en: [
    'apple', 'book', 'window', 'table', 'sun', 'moon', 'star', 'flower',
    'tree', 'water', 'fire', 'earth', 'sky', 'mountain', 'river', 'ocean',
    'bird', 'fish', 'cat', 'dog', 'house', 'road', 'forest', 'field',
    'stone', 'sand', 'cloud', 'rain', 'wind', 'snow', 'ice', 'grass',
    'leaf', 'root', 'branch', 'fruit', 'seed', 'air', 'light'
  ]
};

function renderGameWords() {
  const app = document.getElementById('app');
  
  loadWordsLevel().then(() => {
    if (wordsGameState.stage === 'intro' || wordsGameState.stage === 'result') {
      renderIntro();
    }
  });
}

async function loadWordsLevel() {
  try {
    const level = await db.getSetting('game_words_level') || 1;
    wordsGameState.level = level;
  } catch (error) {
    console.error('Level loading error:', error);
  }
}

function renderIntro() {
  const app = document.getElementById('app');
  const wordsCount = wordsGameState.level === 1 ? 5 : wordsGameState.level === 2 ? 10 : 15;
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="game-icon-large">📚</div>
          <h2 data-i18n="game_words_title">${i18n.t('game_words_title')}</h2>
          <div class="badge badge-primary" style="font-size: 1.25rem; padding: 0.75rem 1.5rem;">
            ${i18n.t('game_level')} ${wordsGameState.level}
          </div>
        </div>
        
        <div class="game-instructions">
          <h3 data-i18n="game_words_instruction">${i18n.t('game_words_instruction')}</h3>
          <ol>
            <li>${i18n.t('game_words_step1').replace('{count}', wordsCount)}</li>
            <li>${i18n.t('game_words_step2')}</li>
            <li>${i18n.t('game_words_step3')}</li>
            <li>${i18n.t('game_words_step4')}</li>
          </ol>
          
          <div class="alert alert-warning show" style="margin-top: 1rem;">
            ⚠️ ${i18n.t('game_words_warning').replace('{count}', wordsCount)}
          </div>
        </div>
        
        <button class="btn btn-primary" onclick="startWordsGame()">
          ${i18n.t('game_start')}
        </button>
        
        <button class="btn btn-outline" onclick="showWordsHistory()" style="margin-top: 1rem;">
          ${i18n.t('game_history')}
        </button>
        
        <button class="btn btn-outline" onclick="navigateTo('games', event)" style="margin-top: 1rem;">
          ${i18n.t('back_to_profile')}
        </button>
      </div>
    </div>
  `;
}

function startWordsGame() {
  wordsGameState.stage = 'memorize';
  wordsGameState.selectedWords = [];
  wordsGameState.startTime = Date.now();
  
  const wordsCount = wordsGameState.level === 1 ? 5 : wordsGameState.level === 2 ? 10 : 15;
  wordsGameState.correctWords = getRandomWords(wordsCount);
  
  renderMemorizeStage();
}

function getRandomWords(count) {
  const currentLang = i18n.getCurrentLanguage();
  const bank = WORD_BANK[currentLang] || WORD_BANK.uk;
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function renderMemorizeStage() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h2 style="text-align: center; margin-bottom: 2rem;" data-i18n="game_memorize_title">
          ${i18n.t('game_memorize_title')}
        </h2>
        
        <div class="words-display">
          ${wordsGameState.correctWords.map(word => `
            <div class="word-card">${word}</div>
          `).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn btn-primary" onclick="startTest()">
            ${i18n.t('game_got_it')}
          </button>
        </div>
      </div>
    </div>
  `;
}

function startTest() {
  wordsGameState.stage = 'test';
  
  // Створити список-пастку
  const distractorsCount = wordsGameState.correctWords.length;
  const langBank = WORD_BANK[i18n.getCurrentLanguage()] || WORD_BANK.uk;
  
  const filtered = langBank.filter(w => !wordsGameState.correctWords.includes(w));
  const distractors = [...filtered].sort(() => Math.random() - 0.5).slice(0, distractorsCount);
  
  wordsGameState.allWords = [...wordsGameState.correctWords, ...distractors]
    .sort(() => Math.random() - 0.5);
  
  renderTestStage();
}

function renderTestStage() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h2 style="text-align: center; margin-bottom: 1rem;" data-i18n="game_test_title">
          ${i18n.t('game_test_title')}
        </h2>
        
        <div class="badge badge-primary" style="margin: 0 auto 2rem; display: block; width: fit-content;">
          ${i18n.t('game_selected')}: <span id="selectedCount">0</span> / ${wordsGameState.correctWords.length}
        </div>
        
        <div class="words-grid">
          ${wordsGameState.allWords.map((word, index) => `
            <div class="word-choice" onclick="toggleWord(${index}, '${word}')">
              ${word}
            </div>
          `).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn btn-primary" onclick="checkAnswers()" id="checkBtn" disabled>
            ${i18n.t('game_check')}
          </button>
        </div>
      </div>
    </div>
  `;
}

function toggleWord(index, word) {
  const el = document.querySelectorAll('.word-choice')[index];
  
  if (wordsGameState.selectedWords.includes(word)) {
    wordsGameState.selectedWords = wordsGameState.selectedWords.filter(w => w !== word);
    el.classList.remove('selected');
  } else {
    if (wordsGameState.selectedWords.length < wordsGameState.correctWords.length) {
      wordsGameState.selectedWords.push(word);
      el.classList.add('selected');
    }
  }
  
  updateSelectedCount();
}

function updateSelectedCount() {
  const countEl = document.getElementById('selectedCount');
  const checkBtn = document.getElementById('checkBtn');
  
  if (countEl) countEl.textContent = wordsGameState.selectedWords.length;
  if (checkBtn) checkBtn.disabled = wordsGameState.selectedWords.length === 0;
}

async function checkAnswers() {
  wordsGameState.stage = 'result';
  
  const correct = wordsGameState.selectedWords.filter(w => 
    wordsGameState.correctWords.includes(w)
  );
  
  const missed = wordsGameState.correctWords.filter(w => 
    !wordsGameState.selectedWords.includes(w)
  );
  
  const wrong = wordsGameState.selectedWords.filter(w => 
    !wordsGameState.correctWords.includes(w)
  );
  
  const score = correct.length;
  const total = wordsGameState.correctWords.length;
  const passed = score === total;
  
  const user = auth.getCurrentUser();
  if (user) {
    const history = {
      date: new Date().toISOString(),
      level: wordsGameState.level,
      score: score,
      total: total,
      passed: passed,
      time: Date.now() - wordsGameState.startTime
    };
    await saveWordsHistory(history);
  }
  
  // Логіка зміни рівня
  if (passed && wordsGameState.level < 3) {
    wordsGameState.level++;
    await db.saveSetting('game_words_level', wordsGameState.level);
  } else if (!passed && wordsGameState.level > 1) {
    wordsGameState.level--;
    await db.saveSetting('game_words_level', wordsGameState.level);
  }
  
  renderResult(correct, missed, wrong, passed);
}

function renderResult(correct, missed, wrong, passed) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="game-icon-large">${passed ? '🎉' : '😔'}</div>
          <h2>${passed ? i18n.t('game_win') : i18n.t('game_lose')}</h2>
          <div class="badge ${passed ? 'badge-success' : 'badge-error'}" style="font-size: 1.5rem; padding: 1rem 2rem;">
            ${correct.length} / ${wordsGameState.correctWords.length}
          </div>
        </div>
        
        <div class="result-section">
          <h3 style="color: var(--success);">${i18n.t('game_correct')} (${correct.length})</h3>
          <div class="words-result">
            ${correct.map(w => `<span class="word-correct">${w}</span>`).join('')}
          </div>
        </div>
        
        ${missed.length > 0 ? `
          <div class="result-section">
            <h3 style="color: var(--warning);">${i18n.t('game_missed')} (${missed.length})</h3>
            <div class="words-result">
              ${missed.map(w => `<span class="word-missed">${w}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        
        ${wrong.length > 0 ? `
          <div class="result-section">
            <h3 style="color: var(--error);">${i18n.t('game_wrong')} (${wrong.length})</h3>
            <div class="words-result">
              ${wrong.map(w => `<span class="word-wrong">${w}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        
        <button class="btn btn-primary" onclick="startWordsGame()" style="margin-top: 2rem;">
          ${i18n.t('game_play_again')}
        </button>
        
        <button class="btn btn-outline" onclick="navigateTo('games', event)" style="margin-top: 1rem;">
          ${i18n.t('back_to_profile')}
        </button>
      </div>
    </div>
  `;
}

async function saveWordsHistory(entry) {
  try {
    const user = auth.getCurrentUser();
    if (!user) return;
    const history = await db.getSetting('game_words_history') || [];
    history.push({ ...entry, userEmail: user.email });
    const trimmed = history.slice(-50);
    await db.saveSetting('game_words_history', trimmed);
  } catch (error) {
    console.error('Error saving history:', error);
  }
}

async function showWordsHistory() {
  try {
    const history = await db.getSetting('game_words_history') || [];
    const user = auth.getCurrentUser();
    const userHistory = history
      .filter(h => h.userEmail === user.email)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="card">
          <h2 data-i18n="game_history">${i18n.t('game_history')}</h2>
          ${userHistory.length === 0 ? `
            <p style="text-align: center; color: var(--text-light); margin: 2rem 0;" data-i18n="game_history_empty">
              ${i18n.t('game_history_empty')}
            </p>
          ` : `
            <div class="history-list">
              ${userHistory.map(entry => `
                <div class="history-item">
                  <div class="history-date">📅 ${UI.formatDate(entry.date)}</div>
                  <div class="history-stats">
                    <span class="badge ${entry.passed ? 'badge-success' : 'badge-error'}">${i18n.t('game_level')} ${entry.level}</span>
                    <span class="badge badge-primary">${entry.score}/${entry.total}</span>
                    <span style="color: var(--text-light); font-size: 0.875rem;">${Math.round(entry.time / 1000)} ${i18n.t('game_time_sec')}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
          <button class="btn btn-outline" onclick="renderGameWords()" style="margin-top: 2rem;">
            ${i18n.t('back_to_profile')}
          </button>
        </div>
      </div>
    `;
  } catch (error) {
    UI.showAlert(i18n.t('error'), 'error');
  }
}

// Глобальні функції
window.startWordsGame = startWordsGame;
window.startTest = startTest;
window.toggleWord = toggleWord;
window.checkAnswers = checkAnswers;
window.showWordsHistory = showWordsHistory;

if (typeof router !== 'undefined') {
  router.register('game-words', renderGameWords);
}