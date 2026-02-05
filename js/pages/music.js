// Сторінка музики

let musicState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  audio: null
};

// Треки з реальними аудіо файлами
const MUSIC_TRACKS = [
  {
    id: 'forest',
    nameKey: 'track_forest_name',
    descKey: 'track_forest_desc',
    icon: '🌲',
    color: '#10B981',
    url: 'assets/music/Dźwięki lasu.mp3',
    duration: '∞'
  },
  {
    id: 'rain',
    nameKey: 'track_rain_name',
    descKey: 'track_rain_desc',
    icon: '🌧️',
    color: '#3B82F6',
    url: 'assets/music/Odgłos deszczu.mp3',
    duration: '∞'
  },
  {
    id: 'ocean',
    nameKey: 'track_ocean_name',
    descKey: 'track_ocean_desc',
    icon: '🌊',
    color: '#06B6D4',
    url: 'assets/music/Szum morza.mp3',
    duration: '∞'
  },
  {
    id: 'relax',
    nameKey: 'track_relax_name',
    descKey: 'track_relax_desc',
    icon: '🎵',
    color: '#8B5CF6',
    url: 'assets/music/Relaksująca muzyka.mp3',
    duration: '∞'
  }
];

function renderMusic() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h2 data-i18n="music_title">${i18n.t('music_title')}</h2>
        <p style="color: var(--text-light); margin-bottom: 2rem;" data-i18n="music_subtitle">
          ${i18n.t('music_subtitle')}
        </p>
        
        <div class="music-player" id="musicPlayer" style="display: none;">
          <div class="now-playing">
            <div class="track-icon" id="trackIcon">🎵</div>
            <div class="track-info">
              <h3 id="trackName" data-i18n="music_track_name">${i18n.t('music_track_name')}</h3>
              <p id="trackDescription" data-i18n="music_track_desc">${i18n.t('music_track_desc')}</p>
            </div>
          </div>
          
          <div class="player-controls">
            <button class="control-btn" onclick="togglePlay()" id="playBtn">
              <span id="playIcon">▶️</span>
            </button>
            <button class="control-btn" onclick="stopMusic()">⏹️</button>
          </div>
          
          <div class="volume-control">
            <span>🔊</span>
            <input type="range" min="0" max="100" value="50" 
                   class="volume-slider" id="volumeSlider" 
                   oninput="updateVolume(this.value)">
            <span id="volumeValue">50%</span>
          </div>
        </div>
        
        <div class="music-tracks">
          ${MUSIC_TRACKS.map(track => `
            <div class="music-track-card" style="border-left-color: ${track.color};" 
                 onclick="playTrack('${track.id}')">
              <div class="track-icon-large">${track.icon}</div>
              <div class="track-details">
                <h3 data-i18n="${track.nameKey}">${i18n.t(track.nameKey)}</h3>
                <p data-i18n="${track.descKey}">${i18n.t(track.descKey)}</p>
                <span class="track-duration">${track.duration}</span>
              </div>
              <div class="play-button">▶️</div>
            </div>
          `).join('')}
        </div>
        
        <div class="alert alert-warning show" style="margin-top: 2rem;" data-i18n="music_loop_info">
          ${i18n.t('music_loop_info')}
        </div>
      </div>
    </div>
  `;
}

function playTrack(trackId) {
  const track = MUSIC_TRACKS.find(t => t.id === trackId);
  if (!track) return;
  
  musicState.currentTrack = track;
  const player = document.getElementById('musicPlayer');
  player.style.display = 'block';
  
  // Оновлення UI перекладеними назвами
  document.getElementById('trackIcon').textContent = track.icon;
  document.getElementById('trackIcon').style.background = track.color;
  document.getElementById('trackName').textContent = i18n.t(track.nameKey);
  document.getElementById('trackDescription').textContent = i18n.t(track.descKey);
  
  if (musicState.audio) {
    musicState.audio.pause();
    musicState.audio.currentTime = 0;
  }
  
  musicState.audio = new Audio(track.url);
  musicState.audio.volume = musicState.volume;
  musicState.audio.loop = true;
  
  musicState.audio.play()
    .then(() => {
      musicState.isPlaying = true;
      updatePlayButton();
      UI.showAlert(`${i18n.t('music_playing')}: ${i18n.t(track.nameKey)}`, 'success');
    })
    .catch(error => {
      UI.showAlert(i18n.t('music_error_play'), 'error');
    });
  
  saveMusicHistory(track);
}

function togglePlay() {
  if (!musicState.currentTrack) {
    UI.showAlert(i18n.t('music_select_track'), 'warning');
    return;
  }
  
  if (!musicState.audio) return;
  
  if (musicState.isPlaying) {
    musicState.audio.pause();
    musicState.isPlaying = false;
  } else {
    musicState.audio.play().then(() => {
      musicState.isPlaying = true;
    }).catch(() => {
      UI.showAlert(i18n.t('music_error_play'), 'error');
    });
  }
  updatePlayButton();
}

function stopMusic() {
  if (musicState.audio) {
    musicState.audio.pause();
    musicState.audio.currentTime = 0;
  }
  
  musicState.isPlaying = false;
  musicState.currentTrack = null;
  
  const player = document.getElementById('musicPlayer');
  if (player) {
    player.style.display = 'none';
  }
  
  updatePlayButton();
}

function updatePlayButton() {
  const playIcon = document.getElementById('playIcon');
  if (playIcon) {
    playIcon.textContent = musicState.isPlaying ? '⏸️' : '▶️';
  }
}

function updateVolume(value) {
  musicState.volume = value / 100;
  
  if (musicState.audio) {
    musicState.audio.volume = musicState.volume;
  }
  
  const volumeValue = document.getElementById('volumeValue');
  if (volumeValue) {
    volumeValue.textContent = `${value}%`;
  }
}

async function saveMusicHistory(track) {
  try {
    const user = auth.getCurrentUser();
    if (!user) return;
    
    const history = await db.getSetting('music_history') || [];
    history.push({
      trackId: track.id,
      trackName: track.name,
      date: new Date().toISOString(),
      userEmail: user.email
    });
    
    const trimmed = history.slice(-20);
    await db.saveSetting('music_history', trimmed);
  } catch (error) {
    console.error('Error saving history:', error);
  }
}

// Глобальні функції
window.playTrack = playTrack;
window.togglePlay = togglePlay;
window.stopMusic = stopMusic;
window.updateVolume = updateVolume;

// Реєстрація маршруту
if (typeof router !== 'undefined') {
  router.register('music', renderMusic);
} else {
  console.error('❌ Router is not defined in music.js');
}