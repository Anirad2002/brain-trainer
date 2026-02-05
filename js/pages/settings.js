// Сторінка налаштувань

function renderSettings() {
  const app = document.getElementById('app');
  const currentLang = i18n.getCurrentLanguage();
  const currentTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'light';
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h2 data-i18n="settings_title">${i18n.t('settings_title')}</h2>
        
        <div class="form-section">
          <h3 class="form-section-title" data-i18n="general_settings">${i18n.t('general_settings')}</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4 data-i18n="language">${i18n.t('language')}</h4>
              <p data-i18n="choose_language">${i18n.t('choose_language')}</p>
            </div>
            <select id="languageSelect" class="btn btn-outline" style="width: auto; padding: 0.5rem 1rem;">
              <option value="uk" ${currentLang === 'uk' ? 'selected' : ''}>🇺🇦 Українська</option>
              <option value="pl" ${currentLang === 'pl' ? 'selected' : ''}>🇵🇱 Polski</option>
              <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            </select>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4 data-i18n="theme">${i18n.t('theme')}</h4>
              <p data-i18n="choose_theme">${i18n.t('choose_theme')}</p>
            </div>
            <select id="themeSelect" class="btn btn-outline" style="width: auto; padding: 0.5rem 1rem;">
              <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>☀️ ${i18n.t('theme_light')}</option>
              <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>🌙 ${i18n.t('theme_dark')}</option>
              <option value="auto" ${currentTheme === 'auto' ? 'selected' : ''}>🔄 ${i18n.t('theme_auto')}</option>
            </select>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4 data-i18n="app_version">${i18n.t('app_version')}</h4>
              <p data-i18n="app_version_desc">${i18n.t('app_version_desc')}</p>
            </div>
            <span class="badge badge-primary">${CONFIG.APP_VERSION}</span>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4 data-i18n="offline_mode">${i18n.t('offline_mode')}</h4>
              <p data-i18n="offline_mode_desc">${i18n.t('offline_mode_desc')}</p>
            </div>
            <span class="badge badge-success">✅ ${i18n.t('active')}</span>
          </div>
        </div>
        
        <div class="form-section">
          <h3 class="form-section-title" data-i18n="account_section">${i18n.t('account_section')}</h3>
          
          <div class="info-row">
            <div class="info-label" style="flex: 1;">
              <h4 style="margin: 0;" data-i18n="delete_account_title">${i18n.t('delete_account_title')}</h4>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: var(--text-light);" data-i18n="delete_account_desc">
                ${i18n.t('delete_account_desc')}
              </p>
            </div>
          </div>
          
          <button class="btn btn-outline" onclick="handleDeleteAccount()" style="color: var(--error); border-color: var(--error); margin-top: 1rem;" data-i18n="delete_account_btn">
            ${i18n.t('delete_account_btn')}
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Обробники зміни налаштувань
  setupSettingsHandlers();
}

function setupSettingsHandlers() {
  // Зміна мови
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', async (e) => {
      const newLang = e.target.value;
      i18n.setLanguage(newLang);
      
      // Зберегти налаштування
      await db.saveSetting('language', newLang);
      
      // Показати успіх
      UI.showAlert(i18n.t('settings_saved'), 'success');
      
      // Перерендерити сторінку через 500мс
      setTimeout(() => {
        renderSettings();
        // Оновити переклади в меню
        updateSidebarTranslations();
      }, 500);
    });
  }
  
  // Зміна теми
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', async (e) => {
      const newTheme = e.target.value;
      applyTheme(newTheme);
      
      // Зберегти налаштування
      localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, newTheme);
      await db.saveSetting('theme', newTheme);
      
      // Показати успіх
      UI.showAlert(i18n.t('settings_saved'), 'success');
    });
  }
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    document.documentElement.removeAttribute('data-theme');
  } else if (theme === 'auto') {
    // Автоматична тема на основі системних налаштувань
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}

async function handleDeleteAccount() {
  const user = auth.getCurrentUser();
  if (!user) {
    UI.showAlert(i18n.t('user_not_auth'), 'error');
    return;
  }
  
  // Підтвердження з двома кроками
  const firstConfirm = confirm(
    i18n.t('confirm_delete_1').replace('{email}', user.email)
  );
  
  if (!firstConfirm) return;
  
  const secondConfirm = confirm(
    i18n.t('confirm_delete_2')
      .replace('{name}', user.name)
      .replace('{email}', user.email)
  );
  
  if (!secondConfirm) return;
  
  try {
    // Додати фінальну активність
    await db.addActivity(user.email, 'account_delete', i18n.t('activity_delete_account'));
    
    // Видалити користувача з бази даних
    await db.deleteUser(user.email);
    
    // Очистити LocalStorage
    localStorage.clear();
    
    // Показати повідомлення
    UI.showAlert(i18n.t('account_deleted'), 'success');
    
    // Вийти з системи
    auth.currentUser = null;
    router.setAuthenticated(false);
    
    // Перенаправити на login через 2 секунди
    setTimeout(() => {
      router.navigate('login');
    }, 2000);
    
  } catch (error) {
    console.error('Account deletion error:', error);
    UI.showAlert(i18n.t('error_delete_account'), 'error');
  }
}

function updateSidebarTranslations() {
  const sidebarTitle = document.getElementById('sidebarTitle');
  if (sidebarTitle) {
    sidebarTitle.textContent = i18n.t('menu');
  }
  
  // Оновити пункти меню через app.js
  if (window.app && window.app.setupSidebar) {
    window.app.setupSidebar();
  }
}

// Глобальні функції
window.handleDeleteAccount = handleDeleteAccount;

// Реєстрація маршруту
if (typeof router !== 'undefined') {
  router.register('settings', renderSettings);
} else {
  console.error('❌ Router not defined in settings.js');
}