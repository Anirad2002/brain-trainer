// Аутентифікація та валідація

class Auth {
  constructor() {
    this.currentUser = null;
  }
  
  // Валідація email
  validateEmail(email) {
    if (!email || email.length === 0) {
      return { valid: false, error: i18n.t('error_email_required') };
    }
    
    if (!CONFIG.EMAIL_REGEX.test(email)) {
      return { valid: false, error: i18n.t('error_email_invalid') };
    }
    
    return { valid: true };
  }
  
  // Валідація пароля
  validatePassword(password) {
    if (!password || password.length === 0) {
      return { valid: false, error: i18n.t('error_password_required') };
    }
    
    if (password.length < CONFIG.MIN_PASSWORD_LENGTH) {
      return { valid: false, error: i18n.t('error_password_short') };
    }
    
    return { valid: true };
  }
  
  // Валідація імені
  validateName(name) {
    if (!name || name.length === 0) {
      return { valid: false, error: i18n.t('error_name_required') };
    }
    
    if (name.length < CONFIG.NAME_MIN_LENGTH) {
      return { valid: false, error: i18n.t('error_name_short') };
    }
    
    return { valid: true };
  }
  
  // Валідація віку
  validateAge(age) {
    const ageNum = parseInt(age);
    
    if (!age || isNaN(ageNum)) {
      return { valid: false, error: i18n.t('error_age_required') };
    }
    
    if (ageNum < CONFIG.MIN_AGE || ageNum > CONFIG.MAX_AGE) {
      return { valid: false, error: i18n.t('error_age_invalid') };
    }
    
    return { valid: true };
  }
  
  // Реєстрація користувача
  async register(userData) {
    const { name, age, email, password, passwordConfirm } = userData;
    
    // Валідація
    const validations = [
      { field: 'name', value: name, validator: this.validateName },
      { field: 'age', value: age, validator: this.validateAge },
      { field: 'email', value: email, validator: this.validateEmail },
      { field: 'password', value: password, validator: this.validatePassword }
    ];
    
    for (const { field, value, validator } of validations) {
      const result = validator.call(this, value);
      if (!result.valid) {
        return { success: false, field: `reg${field.charAt(0).toUpperCase() + field.slice(1)}`, error: result.error };
      }
    }
    
    // Перевірка співпадіння паролів
    if (password !== passwordConfirm) {
      return { success: false, field: 'regPasswordConfirm', error: i18n.t('error_password_mismatch') };
    }
    
    // Перевірка чи користувач вже існує
    try {
      const existingUser = await db.getUser(email.toLowerCase());
      if (existingUser) {
        return { success: false, field: 'regEmail', error: i18n.t('error_user_exists') };
      }
      
      // Створення користувача
      const user = {
        name: name.trim(),
        age: parseInt(age),
        email: email.toLowerCase(),
        password: password, // В реальному додатку треба хешувати!
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await db.saveUser(user);
      await db.addActivity(user.email, 'register', 'Account registration');
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Вхід користувача
  async login(email, password) {
    // Валідація
    const emailValidation = this.validateEmail(email);
    if (!emailValidation.valid) {
      return { success: false, field: 'loginEmail', error: emailValidation.error };
    }
    
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, field: 'loginPassword', error: passwordValidation.error };
    }
    
    // Пошук користувача
    try {
      const user = await db.getUser(email.toLowerCase());
      
      if (!user) {
        return { success: false, field: 'loginEmail', error: i18n.t('error_user_not_found') };
      }
      
      // Перевірка пароля
      if (user.password !== password) {
        return { success: false, field: 'loginPassword', error: i18n.t('error_wrong_password') };
      }
      
      // Зберегти поточного користувача
      this.currentUser = user;
      localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, user.email);
      
      // Додати активність
      await db.addActivity(user.email, 'login', 'System login');
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Вихід користувача
  async logout() {
    if (this.currentUser) {
      await db.addActivity(this.currentUser.email, 'logout', 'System logout');
    }
    
    this.currentUser = null;
    localStorage.removeItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
    router.setAuthenticated(false);
    router.navigate('login');
    
    UI.showAlert(i18n.t('logout_success'), 'success');
  }
  
  // Перевірка авторизації
  async checkAuth() {
    const savedEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
    
    if (savedEmail) {
      try {
        const user = await db.getUser(savedEmail);
        if (user) {
          this.currentUser = user;
          router.setAuthenticated(true);
          return true;
        }
      } catch (error) {
        console.error('❌ Authorization check error:', error);
      }
    }
    
    this.currentUser = null;
    router.setAuthenticated(false);
    return false;
  }
  
  // Отримати поточного користувача
  getCurrentUser() {
    return this.currentUser;
  }
  
  // Оновити профіль
  async updateProfile(updates) {
    if (!this.currentUser) {
      return { success: false, error: 'User is not authorized' };
    }
    
    try {
      // Валідація оновлень
      if (updates.name) {
        const nameValidation = this.validateName(updates.name);
        if (!nameValidation.valid) {
          return { success: false, field: 'profileName', error: nameValidation.error };
        }
      }
      
      if (updates.age) {
        const ageValidation = this.validateAge(updates.age);
        if (!ageValidation.valid) {
          return { success: false, field: 'profileAge', error: ageValidation.error };
        }
        updates.age = parseInt(updates.age);
      }
      
      if (updates.newPassword) {
        const passwordValidation = this.validatePassword(updates.newPassword);
        if (!passwordValidation.valid) {
          return { success: false, field: 'newPassword', error: passwordValidation.error };
        }
        
        // Перевірка старого пароля
        if (!updates.currentPassword || updates.currentPassword !== this.currentUser.password) {
          return { success: false, field: 'currentPassword', error: i18n.t('error_wrong_password') };
        }
        
        updates.password = updates.newPassword;
        delete updates.newPassword;
        delete updates.currentPassword;
      }
      
      // Оновлення користувача
      const updatedUser = await db.updateUser(this.currentUser.email, updates);
      this.currentUser = updatedUser;
      
      await db.addActivity(this.currentUser.email, 'profile_update', 'Profile update');
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Відновлення пароля (симуляція)
  async resetPassword(email) {
    const emailValidation = this.validateEmail(email);
    if (!emailValidation.valid) {
      return { success: false, field: 'resetEmail', error: emailValidation.error };
    }
    
    try {
      const user = await db.getUser(email.toLowerCase());
      if (!user) {
        // З безпеки не кажемо що користувача не існує
        return { success: true };
      }
      
      // В реальному додатку тут би відправлялося email
      console.log('📧 Sending password recovery email to:', email);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Password recovery error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Глобальний екземпляр
const auth = new Auth();

// Глобальна функція виходу
window.logout = () => auth.logout();