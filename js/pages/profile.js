// Сторінка профілю

function renderProfile() {
  const user = auth.getCurrentUser();
  if (!user) {
    router.navigate('login');
    return;
  }
  
  const app = document.getElementById('app');
  const userAvatar = user.avatar || null;
  const initials = user.name.charAt(0).toUpperCase();
  const formattedDate = UI.formatDate(user.createdAt, i18n.getCurrentLanguage() === 'en' ? 'en-US' : 'uk-UA');
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="profile-header">
          <div class="profile-avatar" id="profileAvatar" style="${userAvatar ? `background-image: url('${userAvatar}'); background-size: cover; background-position: center;` : ''}">
            ${userAvatar ? '' : initials}
          </div>
          <button class="btn btn-outline" onclick="showAvatarSelector()" style="margin-top: 1rem;" data-i18n="change_avatar">
            ${i18n.t('change_avatar')}
          </button>
          <div class="profile-info">
            <h2 class="profile-name">${user.name}</h2>
            <p class="profile-email">${user.email}</p>
          </div>
        </div>
        
        <div class="tabs">
          <button class="tab active" onclick="switchTab('info')" data-i18n="profile_info">
            ${i18n.t('profile_info')}
          </button>
          <button class="tab" onclick="switchTab('edit')" data-i18n="profile_edit">
            ${i18n.t('profile_edit')}
          </button>
        </div>
        
        <div id="tabInfo" class="tab-content active">
          <div class="info-row">
            <span class="info-label" data-i18n="name">${i18n.t('name')}</span>
            <span class="info-value">${user.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label" data-i18n="age">${i18n.t('age')}</span>
            <span class="info-value">${user.age} ${i18n.t('years_old')}</span>
          </div>
          <div class="info-row">
            <span class="info-label" data-i18n="email">${i18n.t('email')}</span>
            <span class="info-value">${user.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label" data-i18n="registered_date">${i18n.t('registered_date')}</span>
            <span class="info-value">${formattedDate}</span>
          </div>
        </div>
        
        <div id="tabEdit" class="tab-content">
          <form id="editProfileForm">
            <div class="form-section">
              <h3 class="form-section-title" data-i18n="personal_info">${i18n.t('personal_info')}</h3>
              
              <div class="form-group">
                <label for="profileName" data-i18n="name">${i18n.t('name')}<span class="required">*</span></label>
                <input type="text" id="profileName" value="${user.name}" required minlength="2">
                <div class="error-msg" id="profileNameError"></div>
              </div>
              
              <div class="form-group">
                <label for="profileAge" data-i18n="age">${i18n.t('age')}<span class="required">*</span></label>
                <input type="number" id="profileAge" value="${user.age}" required min="13" max="120">
                <div class="error-msg" id="profileAgeError"></div>
              </div>
            </div>
            
            <div class="form-section">
              <h3 class="form-section-title" data-i18n="account_info">${i18n.t('account_info')}</h3>
              
              <div class="form-group">
                <label for="profileEmail" data-i18n="email">${i18n.t('email')}</label>
                <input type="email" id="profileEmail" value="${user.email}" disabled>
                <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;" data-i18n="email_change_lock">
                  ${i18n.t('email_change_lock')}
                </p>
              </div>
              
              <div class="form-group">
                <label for="currentPassword" data-i18n="password_current">${i18n.t('password_current')}</label>
                <input type="password" id="currentPassword" placeholder="${i18n.t('password_placeholder')}" autocomplete="current-password">
                <div class="error-msg" id="currentPasswordError"></div>
              </div>
              
              <div class="form-group">
                <label for="newPassword" data-i18n="password_new">${i18n.t('password_new')}</label>
                <input type="password" id="newPassword" placeholder="${i18n.t('password_placeholder')}" autocomplete="new-password" minlength="6">
                <div class="error-msg" id="newPasswordError"></div>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary" id="saveProfileBtn">
              💾 <span data-i18n="save">${i18n.t('save')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Обробка форми редагування
  const form = document.getElementById('editProfileForm');
  form.addEventListener('submit', handleProfileUpdate);
  
  // Очистка помилок при введенні
  ['profileName', 'profileAge', 'currentPassword', 'newPassword'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => UI.clearFieldError(id));
    }
  });
  
  // Оновити sidebar
  updateSidebarUserName(user.name);
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const updates = {};
  const name = UI.getValue('profileName');
  const age = UI.getValue('profileAge');
  const currentPassword = UI.getValue('currentPassword');
  const newPassword = UI.getValue('newPassword');
  
  // Зібрати зміни
  const user = auth.getCurrentUser();
  
  if (name !== user.name) {
    updates.name = name;
  }
  
  if (parseInt(age) !== user.age) {
    updates.age = age;
  }
  
  // Якщо хочуть змінити пароль
  if (currentPassword || newPassword) {
    if (!currentPassword) {
      UI.showFieldError('currentPassword', i18n.t('enter_current_pass'));
      return;
    }
    if (!newPassword) {
      UI.showFieldError('newPassword', i18n.t('enter_new_pass'));
      return;
    }
    updates.currentPassword = currentPassword;
    updates.newPassword = newPassword;
  }
  
  // Якщо немає змін
  if (Object.keys(updates).length === 0) {
    UI.showAlert(i18n.t('no_changes'), 'warning');
    return;
  }
  
  // Очистити помилки
  UI.clearFormErrors('editProfileForm');
  
  // Показати loader
  UI.setButtonLoading('saveProfileBtn', true);
  
  try {
    const result = await auth.updateProfile(updates);
    
    if (result.success) {
      UI.showAlert(i18n.t('profile_updated'), 'success');
      
      // Оновити sidebar
      updateSidebarUserName(result.user.name);
      
      // Перерендерити сторінку через 1 секунду
      setTimeout(() => {
        renderProfile();
        // Переключитися на вкладку інформації
        switchTab('info');
      }, 1000);
    } else {
      if (result.field) {
        UI.showFieldError(result.field, result.error);
      } else {
        UI.showAlert(result.error, 'error');
      }
    }
  } catch (error) {
    console.error('Profile update error:', error);
    UI.showAlert(i18n.t('error'), 'error');
  } finally {
    UI.setButtonLoading('saveProfileBtn', false);
  }
}

function switchTab(tabName) {
  // Видалити активні класи
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  // Додати активні класи
  if (tabName === 'info') {
    document.querySelectorAll('.tab')[0].classList.add('active');
    document.getElementById('tabInfo').classList.add('active');
  } else if (tabName === 'edit') {
    document.querySelectorAll('.tab')[1].classList.add('active');
    document.getElementById('tabEdit').classList.add('active');
  }
}

function updateSidebarUserName(name) {
  const sidebarUserName = document.getElementById('sidebarUserName');
  if (sidebarUserName) {
    sidebarUserName.textContent = name;
  }
}

// Аватари
const avatarsList = [
  { id: 'cat', name: i18n.t('avatar_cat'), image: 'assets/images/cat.jpg' },
  { id: 'dog', name: i18n.t('avatar_dog'), image: 'assets/images/dog.jpg' },
  { id: 'butterfly', name: i18n.t('avatar_butterfly'), image: 'assets/images/butterfly.jpg' },
  { id: 'fox', name: i18n.t('avatar_fox'), image: 'assets/images/fox.jpg' }
];

function showAvatarSelector() {
  const user = auth.getCurrentUser();
  if (!user) return;
  
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h2 data-i18n="choose_avatar">${i18n.t('choose_avatar')}</h2>
        <p style="color: var(--text-light); margin-bottom: 2rem;" data-i18n="avatar_desc">
          ${i18n.t('avatar_desc')}
        </p>
        
        <div class="avatar-grid">
          ${avatarsList.map(avatar => `
            <div class="avatar-option ${user.avatar === avatar.image ? 'selected' : ''}" onclick="selectAvatar('${avatar.image}')">
              <img src="${avatar.image}" alt="${avatar.name}">
              <p>${avatar.name}</p>
              ${user.avatar === avatar.image ? '<div class="avatar-check">✓</div>' : ''}
            </div>
          `).join('')}
          
          <div class="avatar-option ${!user.avatar ? 'selected' : ''}" onclick="selectAvatar(null)">
            <div class="avatar-initial">${user.name.charAt(0).toUpperCase()}</div>
            <p data-i18n="initials">${i18n.t('initials')}</p>
            ${!user.avatar ? '<div class="avatar-check">✓</div>' : ''}
          </div>
        </div>
        
        <button class="btn btn-outline" onclick="renderProfile()" style="margin-top: 2rem;" data-i18n="back_to_profile">
          ${i18n.t('back_to_profile')}
        </button>
      </div>
    </div>
  `;
}

async function selectAvatar(avatarImage) {
  const user = auth.getCurrentUser();
  if (!user) return;
  
  try {
    // Оновити аватар в базі даних
    await db.updateUser(user.email, { avatar: avatarImage });
    
    // Оновити в поточному користувачі
    user.avatar = avatarImage;
    
    // Показати успіх
    UI.showAlert(i18n.t('avatar_updated'), 'success');
    
    // Перерендерити селектор
    setTimeout(() => {
      showAvatarSelector();
    }, 500);
  } catch (error) {
    console.error('Avatar update error:', error);
    UI.showAlert(i18n.t('error'), 'error');
  }
}

// Глобальна функція для переключення вкладок
window.switchTab = switchTab;
window.showAvatarSelector = showAvatarSelector;
window.selectAvatar = selectAvatar;

// Реєстрація маршруту
if (typeof router !== 'undefined') {
  router.register('profile', renderProfile);
} else {
  console.error('❌ Router is not defined in profile.js');
}