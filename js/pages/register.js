// Сторінка реєстрації

function renderRegister() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="auth-container">
      <div class="card auth-card">
        <div class="auth-header">
          <div class="auth-logo">✍️</div>
          <h2 class="auth-title" data-i18n="register_title">${i18n.t('register_title')}</h2>
          <p class="auth-subtitle" data-i18n="register_subtitle">${i18n.t('register_subtitle')}</p>
        </div>
        
        <form id="registerForm">
          <div class="form-group">
            <label for="regName" data-i18n="name">${i18n.t('name')}<span class="required">*</span></label>
            <input 
              type="text" 
              id="regName" 
              placeholder="${i18n.t('name')}"
              autocomplete="name"
              required
              minlength="2"
            >
            <div class="error-msg" id="regNameError"></div>
          </div>
          
          <div class="form-group">
            <label for="regAge" data-i18n="age">${i18n.t('age')}<span class="required">*</span></label>
            <input 
              type="number" 
              id="regAge" 
              placeholder="${i18n.t('age')}"
              required
              min="13"
              max="120"
            >
            <div class="error-msg" id="regAgeError"></div>
          </div>
          
          <div class="form-group">
            <label for="regEmail" data-i18n="email">${i18n.t('email')}<span class="required">*</span></label>
            <input 
              type="email" 
              id="regEmail" 
              placeholder="${i18n.t('email')}"
              autocomplete="email"
              required
            >
            <div class="error-msg" id="regEmailError"></div>
          </div>
          
          <div class="form-group">
            <label for="regPassword" data-i18n="password">${i18n.t('password')}<span class="required">*</span></label>
            <input 
              type="password" 
              id="regPassword" 
              placeholder="${i18n.t('password')}"
              autocomplete="new-password"
              required
              minlength="6"
            >
            <div class="password-strength" id="passwordStrength">
              <div class="password-strength-bar"></div>
            </div>
            <div class="error-msg" id="regPasswordError"></div>
          </div>
          
          <div class="form-group">
            <label for="regPasswordConfirm" data-i18n="password_confirm">${i18n.t('password_confirm')}<span class="required">*</span></label>
            <input 
              type="password" 
              id="regPasswordConfirm" 
              placeholder="${i18n.t('password_confirm')}"
              autocomplete="new-password"
              required
            >
            <div class="error-msg" id="regPasswordConfirmError"></div>
          </div>
          
          <button type="submit" class="btn btn-primary" id="registerBtn">
            <span data-i18n="register_button">${i18n.t('register_button')}</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <span data-i18n="have_account">${i18n.t('have_account')}</span>
          <a href="#login" class="link" onclick="navigateTo('login', event)" data-i18n="login_button">
            ${i18n.t('login_button')}
          </a>
        </div>
      </div>
    </div>
  `;
  
  // Показати індикатор сили пароля
  const passwordInput = document.getElementById('regPassword');
  const strengthEl = document.getElementById('passwordStrength');
  
  passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    if (password.length === 0) {
      strengthEl.classList.remove('show', 'weak', 'medium', 'strong');
      return;
    }
    
    const strength = UI.checkPasswordStrength(password);
    strengthEl.classList.add('show');
    strengthEl.classList.remove('weak', 'medium', 'strong');
    strengthEl.classList.add(strength);
  });
  
  // Обробка форми
  const form = document.getElementById('registerForm');
  form.addEventListener('submit', handleRegisterSubmit);
  
  // Очистка помилок при введенні
  ['regName', 'regAge', 'regEmail', 'regPassword', 'regPasswordConfirm'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => UI.clearFieldError(id));
  });
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  
  const userData = {
    name: UI.getValue('regName'),
    age: UI.getValue('regAge'),
    email: UI.getValue('regEmail'),
    password: UI.getValue('regPassword'),
    passwordConfirm: UI.getValue('regPasswordConfirm')
  };
  
  // Очистити попередні помилки
  UI.clearFormErrors('registerForm');
  
  // Показати loader
  UI.setButtonLoading('registerBtn', true);
  
  try {
    const result = await auth.register(userData);
    
    if (result.success) {
      // Показати успіх
      UI.showAlert(i18n.t('register_success'), 'success');
      
      // Очистити форму
      UI.clearForm('registerForm');
      
      // Перейти на вхід через 2 секунди
      setTimeout(() => {
        router.navigate('login');
      }, 2000);
    } else {
      // Показати помилку
      if (result.field) {
        UI.showFieldError(result.field, result.error);
      } else {
        UI.showAlert(result.error, 'error');
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    UI.showAlert(i18n.t('error'), 'error');
  } finally {
    UI.setButtonLoading('registerBtn', false);
  }
}

// Реєстрація маршруту
if (typeof router !== 'undefined') {
  router.register('register', renderRegister);
} else {
  console.error('❌ Router is not defined in register.js');
}