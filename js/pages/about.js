// Сторінка "Про додаток"

function renderAbout() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h2 data-i18n="about_title">${i18n.t('about_title')}</h2>
        
        <div style="text-align: center; margin: 2rem 0;">
          <img src="assets/images/icon-brain-training.png" alt="Brain Trainer" 
               style="width: 120px; height: 120px; border-radius: 20px; box-shadow: 0 4px 12px var(--shadow);"
               onerror="this.src='https://ui-avatars.com/api/?name=BT&background=6366f1&color=fff&size=128'">
          <h3 style="margin-top: 1rem; color: var(--primary);">Brain Trainer</h3>
        </div>
        
        <p style="line-height: 1.8; color: var(--text-light); margin-bottom: 2rem; text-align: justify;" data-i18n="about_description">
          ${i18n.t('about_description')}
        </p>
        
        <div class="form-section">
          <h3 class="form-section-title" data-i18n="about_subtitle">${i18n.t('about_subtitle')}</h3>
          
          <div class="info-row">
            <span class="info-label" data-i18n="developer">${i18n.t('developer')}</span>
            <span class="info-value">Daryna Pasiura</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Album</span>
            <span class="info-value">44066</span>
          </div>
          
          <div class="info-row">
            <span class="info-label" data-i18n="technologies">${i18n.t('technologies')}</span>
            <span class="info-value">HTML5, CSS3, JavaScript</span>
          </div>
          
          <div class="info-row">
            <span class="info-label" data-i18n="database">${i18n.t('database')}</span>
            <span class="info-value">IndexedDB</span>
          </div>
          
          <div class="info-row">
            <span class="info-label" data-i18n="offline_support">${i18n.t('offline_support')}</span>
            <span class="info-value">Service Worker + Cache API</span>
          </div>
          
          <div class="info-row">
            <span class="info-label" data-i18n="app_version">${i18n.t('app_version')}</span>
            <span class="info-value">${CONFIG.APP_VERSION}</span>
          </div>
        </div>
        
        <div class="form-section">
          <h3 class="form-section-title" data-i18n="pwa_features">${i18n.t('pwa_features')}</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4 data-i18n="offline_title">${i18n.t('offline_title')}</h4>
              <p data-i18n="offline_desc">${i18n.t('offline_desc')}</p>
            </div>
            <span class="badge badge-success">✅</span>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4 data-i18n="local_db_title">${i18n.t('local_db_title')}</h4>
              <p data-i18n="local_db_desc">${i18n.t('local_db_desc')}</p>
            </div>
            <span class="badge badge-success">✅</span>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4 data-i18n="multi_lang_title">${i18n.t('multi_lang_title')}</h4>
              <p data-i18n="multi_lang_desc">${i18n.t('multi_lang_desc')}</p>
            </div>
            <span class="badge badge-success">✅</span>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4 data-i18n="themes_title">${i18n.t('themes_title')}</h4>
              <p data-i18n="themes_desc">${i18n.t('themes_desc')}</p>
            </div>
            <span class="badge badge-success">✅</span>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4 data-i18n="responsive_title">${i18n.t('responsive_title')}</h4>
              <p data-i18n="responsive_desc">${i18n.t('responsive_desc')}</p>
            </div>
            <span class="badge badge-success">✅</span>
          </div>
        </div>
        
        <div class="form-section">
          <h3 class="form-section-title" data-i18n="used_tech">${i18n.t('used_tech')}</h3>
          
          <div class="stat-card" style="background: linear-gradient(135deg, #E34F26 0%, #F06529 100%); color: white; margin-bottom: 1rem;">
            <h4 style="color: white;">HTML5</h4>
            <p style="color: rgba(255,255,255,0.9); font-size: 0.875rem;" data-i18n="html_desc">${i18n.t('html_desc')}</p>
          </div>
          
          <div class="stat-card" style="background: linear-gradient(135deg, #1572B6 0%, #33A9DC 100%); color: white; margin-bottom: 1rem;">
            <h4 style="color: white;">CSS3</h4>
            <p style="color: rgba(255,255,255,0.9); font-size: 0.875rem;" data-i18n="css_desc">${i18n.t('css_desc')}</p>
          </div>
          
          <div class="stat-card" style="background: linear-gradient(135deg, #F7DF1E 0%, #F0DB4F 100%); color: #000; margin-bottom: 1rem;">
            <h4>JavaScript ES6+</h4>
            <p style="color: rgba(0,0,0,0.7); font-size: 0.875rem;" data-i18n="js_desc">${i18n.t('js_desc')}</p>
          </div>
          
          <div class="stat-card" style="background: linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%); color: white; margin-bottom: 1rem;">
            <h4 style="color: white;">IndexedDB</h4>
            <p style="color: rgba(255,255,255,0.9); font-size: 0.875rem;" data-i18n="idb_desc">${i18n.t('idb_desc')}</p>
          </div>
          
          <div class="stat-card" style="background: linear-gradient(135deg, #5A67D8 0%, #4C51BF 100%); color: white;">
            <h4 style="color: white;">Service Worker</h4>
            <p style="color: rgba(255,255,255,0.9); font-size: 0.875rem;" data-i18n="sw_desc">${i18n.t('sw_desc')}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border);">
          <p style="color: var(--text-light);" data-i18n="app_slogan">
            ${i18n.t('app_slogan')}
          </p>
          <p style="color: var(--text-lighter); font-size: 0.875rem; margin-top: 0.5rem;">
            © 2026 Daryna Pasiura • <span data-i18n="app_version">${i18n.t('app_version')}</span> ${CONFIG.APP_VERSION}
          </p>
        </div>
      </div>
    </div>
  `;
}

// Реєстрація маршруту
if (typeof router !== 'undefined') {
  router.register('about', renderAbout);
} else {
  console.error('❌ Router is not defined in about.js');
}