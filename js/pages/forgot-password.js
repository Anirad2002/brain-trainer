// Сторінка відновлення пароля

function renderForgotPassword() {
  const app = document.getElementById('app');
  if (!app) return;
  
  app.innerHTML = `
    <div class="auth-container">
      <div class="card auth-card">
        <div class="auth-header">
          <div class="auth-logo">🔑</div>
          <h2 class="auth-title" data-i18n="forgot_password_title">${i18n.t('forgot_password_title')}</h2>
          <p class="auth-subtitle" data-i18n="forgot_password_subtitle">${i18n.t('forgot_password_subtitle')}</p>
        </div>
        
        <form id="forgotPasswordForm">
          <div class="form-group">
            <label for="resetEmail" data-i18n="email">${i18n.t('email')}<span class="required">*</span></label>
            <input 
              type="email" 
              id="resetEmail" 
              data-i18n="email"
              placeholder="${i18n.t('email')}"
              autocomplete="email"
              required
            >
            <div class="error-msg" id="resetEmailError"></div>
          </div>
          
          <button type="submit" class="btn btn-primary" id="resetBtn">
            <span data-i18n="reset_password">${i18n.t('reset_password')}</span>
          </button>
          
          <button type="button" class="btn btn-outline" onclick="navigateTo('login', event)">
            <span data-i18n="back_to_login">${i18n.t('back_to_login')}</span>
          </button>
        </form>
        
        <div id="resetSuccess" style="display: none; margin-top: 1.5rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px;">
          <h3 style="color: var(--success); margin-bottom: 0.5rem;" data-i18n="new_password_created_title">
            ${i18n.t('new_password_created_title')}
          </h3>
          <p style="margin-bottom: 0.5rem;" data-i18n="temp_password_label">
            ${i18n.t('temp_password_label')}
          </p>
          <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 1.25rem; font-weight: bold; text-align: center; color: var(--primary); border: 2px solid var(--primary);" id="newPasswordDisplay"></div>
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-light);" data-i18n="save_password_warning">
            ${i18n.t('save_password_warning')}
          </p>
          <p style="font-size: 0.875rem; color: var(--text-light);" data-i18n="change_password_tip">
            ${i18n.t('change_password_tip')}
          </p>
        </div>
      </div>
    </div>
  `;
  
  const form = document.getElementById('forgotPasswordForm');
  form.addEventListener('submit', handleForgotPasswordSubmit);
  
  const emailInput = document.getElementById('resetEmail');
  emailInput.addEventListener('input', () => UI.clearFieldError('resetEmail'));
}

// Генерація випадкового пароля
function generatePassword(length = 12) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

async function handleForgotPasswordSubmit(e) {
  e.preventDefault();
  
  const email = UI.getValue('resetEmail');
  UI.clearFormErrors('forgotPasswordForm');
  
  const successDiv = document.getElementById('resetSuccess');
  successDiv.style.display = 'none';
  
  UI.setButtonLoading('resetBtn', true);
  
  try {
    const emailValidation = auth.validateEmail(email);
    if (!emailValidation.valid) {
      UI.showFieldError('resetEmail', emailValidation.error);
      return;
    }
    
    const user = await db.getUser(email.toLowerCase());
    
    if (!user) {
      UI.showFieldError('resetEmail', 'error_user_not_found');
      return;
    }
    
    const newPassword = generatePassword(12);
    
    await db.updateUser(email.toLowerCase(), {
      password: newPassword,
      passwordResetAt: new Date().toISOString()
    });
    
    await db.addActivity(email.toLowerCase(), 'password_reset', i18n.t('activity_password_reset'));
    
    document.getElementById('newPasswordDisplay').textContent = newPassword;
    successDiv.style.display = 'block';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    
    UI.showAlert('reset_success_alert', 'success');
    
  } catch (error) {
    console.error('Password reset error:', error);
    UI.showAlert('reset_error_alert', 'error');
  } finally {
    UI.setButtonLoading('resetBtn', false);
  }
}

// Реєстрація маршруту
if (typeof router !== 'undefined') {
  router.register('forgot-password', renderForgotPassword);
} else {
  console.error('❌ Router is not defined');
}