// Сторінка входу

function renderLogin() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="auth-container">
      <div class="card auth-card">
        <div class="auth-header">
          <div class="auth-logo">👤</div>
          <h2 class="auth-title" data-i18n="login_title">${i18n.t('login_title')}</h2>
          <p class="auth-subtitle" data-i18n="login_subtitle">${i18n.t('login_subtitle')}</p>
        </div>
        
        <form id="loginForm">
          <div class="form-group">
            <label for="loginEmail" data-i18n="email">${i18n.t('email')}<span class="required">*</span></label>
            <input 
              type="email" 
              id="loginEmail" 
              placeholder="${i18n.t('email')}"
              autocomplete="email"
              required
            >
            <div class="error-msg" id="loginEmailError"></div>
          </div>
          
          <div class="form-group">
            <label for="loginPassword" data-i18n="password">${i18n.t('password')}<span class="required">*</span></label>
            <input 
              type="password" 
              id="loginPassword" 
              placeholder="${i18n.t('password')}"
              autocomplete="current-password"
              required
            >
            <div class="error-msg" id="loginPasswordError"></div>
          </div>
          
          <button type="submit" class="btn btn-primary" id="loginBtn">
            <span data-i18n="login_button">${i18n.t('login_button')}</span>
          </button>
        </form>
        
        <div class="forgot-password">
          <a href="#forgot-password" class="link" onclick="navigateTo('forgot-password', event)" data-i18n="forgot_password">
            ${i18n.t('forgot_password')}
          </a>
        </div>
        
        <div class="auth-footer">
          <span data-i18n="no_account">${i18n.t('no_account')}</span>
          <a href="#register" class="link" onclick="navigateTo('register', event)" data-i18n="register_button">
            ${i18n.t('register_button')}
          </a>
        </div>
      </div>
    </div>
  `;
  
  // Обробка форми
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', handleLoginSubmit);
  
  // Очистка помилок при введенні
  ['loginEmail', 'loginPassword'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => UI.clearFieldError(id));
  });
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  
  const email = UI.getValue('loginEmail');
  const password = UI.getValue('loginPassword');
  
  // Очистити попередні помилки
  UI.clearFormErrors('loginForm');
  
  // Показати loader
  UI.setButtonLoading('loginBtn', true);
  
  try {
    const result = await auth.login(email, password);
    
    if (result.success) {
      // Показати успіх
      UI.showAlert(i18n.t('login_success'), 'success');
      
      // Встановити авторизацію і перейти на профіль
      router.setAuthenticated(true);
      
      setTimeout(() => {
        router.navigate('profile');
      }, 500);
    } else {
      // Показати помилку
      if (result.field) {
        UI.showFieldError(result.field, result.error);
      } else {
        UI.showAlert(result.error, 'error');
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    UI.showAlert(i18n.t('error'), 'error');
  } finally {
    UI.setButtonLoading('loginBtn', false);
  }
}

// Реєстрація маршруту - ВАЖЛИВО: має бути в кінці файлу
if (typeof router !== 'undefined') {
  router.register('login', renderLogin);
} else {
  console.error('❌ Router is not defined in login.js');
}