// UI допоміжники

const UI = {
  // Показати/сховати елемент
  toggle(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
  },
  
  // Показати елемент
  show(elementId, display = 'block') {
    const el = document.getElementById(elementId);
    if (el) el.style.display = display;
  },
  
  // Сховати елемент
  hide(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.style.display = 'none';
  },
  
  // Додати клас
  addClass(elementId, className) {
    const el = document.getElementById(elementId);
    if (el) el.classList.add(className);
  },
  
  // Видалити клас
  removeClass(elementId, className) {
    const el = document.getElementById(elementId);
    if (el) el.classList.remove(className);
  },
  
  // Показати статус бар
  showStatusBar(message, type = 'error') {
    const statusBar = document.getElementById('statusBar');
    const statusText = document.getElementById('statusText');
    
    if (statusBar && statusText) {
      // Якщо передано ключ перекладу, використовуємо його, інакше — чистий текст
      statusText.textContent = i18n.t(message) || message;
      statusBar.className = `status-bar ${type} show`;
      
      if (type === 'online' || type === 'success') {
        setTimeout(() => {
          statusBar.classList.remove('show');
        }, CONFIG.TOAST_DURATION);
      }
    }
  },
  
  // Сховати статус бар
  hideStatusBar() {
    const statusBar = document.getElementById('statusBar');
    if (statusBar) {
      statusBar.classList.remove('show');
    }
  },
  
  // Показати помилку поля
  showFieldError(inputId, messageKey) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + 'Error');
    
    if (input) {
      input.classList.add('error');
      input.classList.remove('success');
    }
    
    if (errorEl) {
      errorEl.textContent = i18n.t(messageKey);
      errorEl.classList.add('show');
    }
  },
  
  // Очистити помилку поля
  clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + 'Error');
    
    if (input) {
      input.classList.remove('error');
    }
    
    if (errorEl) {
      errorEl.classList.remove('show');
      errorEl.textContent = '';
    }
  },
  
  // Очистити всі помилки форми
  clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.querySelectorAll('.error-msg').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
      });
      form.querySelectorAll('input, select').forEach(input => {
        input.classList.remove('error', 'success');
      });
    }
  },
  
  // Показати успіх поля
  showFieldSuccess(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.classList.add('success');
      input.classList.remove('error');
    }
    this.clearFieldError(inputId);
  },
  
  // Показати loader на кнопці
  setButtonLoading(buttonId, loading = true) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.disabled = loading;
      if (loading) {
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="loading"></span> ' + (i18n.t('loading') || '...');
      } else {
        button.textContent = button.dataset.originalText || button.textContent;
      }
    }
  },
  
  // Оновити текст елемента
  setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = text;
  },
  
  // Оновити HTML елемента
  setHTML(elementId, html) {
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = html;
  },
  
  // Отримати значення поля
  getValue(inputId) {
    const input = document.getElementById(inputId);
    return input ? input.value.trim() : '';
  },
  
  // Встановити значення поля
  setValue(inputId, value) {
    const input = document.getElementById(inputId);
    if (input) input.value = value;
  },
  
  // Очистити форму
  clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
      this.clearFormErrors(formId);
    }
  },
  
  // Показати alert
  showAlert(messageKey, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} show`;
    alertDiv.textContent = i18n.t(messageKey) || messageKey;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '80px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.zIndex = '3000';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.maxWidth = '90%';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 300);
    }, CONFIG.TOAST_DURATION);
  },
  
  // Форматувати дату (Використовуємо поточну мову)
  formatDate(dateString) {
    const lang = i18n.getCurrentLanguage() === 'uk' ? 'uk-UA' : (i18n.getCurrentLanguage() === 'pl' ? 'pl-PL' : 'en-US');
    const date = new Date(dateString);
    return date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  // Форматувати час
  formatTime(dateString) {
    const lang = i18n.getCurrentLanguage() === 'uk' ? 'uk-UA' : (i18n.getCurrentLanguage() === 'pl' ? 'pl-PL' : 'en-US');
    const date = new Date(dateString);
    return date.toLocaleTimeString(lang, {
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  // Форматувати дату та час
  formatDateTime(dateString) {
    return this.formatDate(dateString) + ' ' + this.formatTime(dateString);
  },
  
  // Показати меню
  openMenu() {
    UI.addClass('sidebar', 'open');
    UI.addClass('overlay', 'show');
  },
  
  // Сховати меню
  closeMenu() {
    UI.removeClass('sidebar', 'open');
    UI.removeClass('overlay', 'show');
  },
  
  // Toggle меню
  toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  },
  
  // Оновити навігацію
  updateNav(activeRoute) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
    });
    
    // Карта індексів пунктів меню (має збігатися з порядком у sidebar)
    const routeMap = {
      'profile': 0,
      'games': 1,
      'music': 2,
      'settings': 3,
      'about': 4
    };
    
    if (routeMap[activeRoute] !== undefined && navItems[routeMap[activeRoute]]) {
      navItems[routeMap[activeRoute]].classList.add('active');
    }
  },
  
  // Оновити переклади на сторінці
  updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const translation = i18n.t(key);
      
      if (el.tagName === 'INPUT') {
        if (el.placeholder) el.placeholder = translation;
        if (el.type === 'button' || el.type === 'submit') el.value = translation;
      } else {
        // Це оновить текст всередині <h2>, <p>, <span> тощо
        el.textContent = translation;
      }
    });
  },
  
  // Перевірка сили пароля
  checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  },
  
  // Показати індикатор сили пароля
  showPasswordStrength(inputId, strengthId) {
    const input = document.getElementById(inputId);
    const strengthEl = document.getElementById(strengthId);
    
    if (!input || !strengthEl) return;
    
    input.addEventListener('input', (e) => {
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
  }
};

// Глобальні обробники подій
window.toggleMenu = () => UI.toggleMenu();
window.closeMenu = () => UI.closeMenu();