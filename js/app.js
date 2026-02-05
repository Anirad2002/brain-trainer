// Головний файл додатку

class App {
  constructor() {
    this.isOnline = navigator.onLine;
    this.installPrompt = null;
    this.isInitialized = false;
  }
  
  // Ініціалізація додатку
  async init() {
    // Перевірка чи вже ініціалізовано
    if (this.isInitialized) {
      console.warn('⚠️ The app has already been initialised');
      return;
    }
    
    console.log('🚀 Initialisation of the PWA applicationу...');
    
    try {
      // 1. Ініціалізація бази даних (НАЙВАЖЛИВІШЕ!)
      console.log('1️⃣ Database initialisation...');
      await db.init();
      console.log('✅ Database initialised');
      
      // Перевірка статистики бази даних
      await db.getStats();
      
      // 2. Завантаження налаштувань
      console.log('2️⃣ Loading settings...');
      await this.loadSettings();
      console.log('✅ Settings downloaded');
      
      // 3. Реєстрація Service Worker
      console.log('3️⃣ Service Worker registration...');
      await this.registerServiceWorker();
      
      // 4. Налаштування UI
      console.log('4️⃣ UI settings...');
      this.setupUI();
      console.log('✅ UI configured');
      
      // 5. Перевірка авторизації
      console.log('5️⃣ Authorisation verification...');
      const isAuth = await auth.checkAuth();
      console.log('✅ Authorisation verified:', isAuth);
      
      // 6. Дати час для реєстрації всіх маршрутів
      console.log('6️⃣ Expectations for route registration...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 7. Ініціалізація роутера
      console.log('7️⃣ Initialising the router...');
      router.init();
      console.log('✅ Router initialised');
      
      // 8. Відслідковування статусу з'єднання
      console.log('8️⃣ Configuring connection monitoring...');
      this.setupOnlineStatus();
      console.log('✅ Connection monitoring enabled');
      
      // 9. Обробка встановлення PWA
      console.log('9️⃣ PWA settings...');
      this.setupInstallPrompt();
      
      this.isInitialized = true;
      console.log('✅✅✅ The application is fully initialised!');
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR during initialisation:', error);
      UI.showAlert('Application initialisation error: ' + error.message, 'error');
      
      // Спроба повторної ініціалізації через 3 секунди
      console.log('🔄 Attempt to reinitialise after 3 seconds...');
      setTimeout(() => {
        this.isInitialized = false;
        this.init();
      }, 3000);
    }
  }
  
  // Завантаження налаштувань
  async loadSettings() {
    try {
      // Мова
      const savedLang = await db.getSetting('language');
      if (savedLang) {
        console.log('🌍 Downloaded language:', savedLang);
        i18n.setLanguage(savedLang);
      } else {
        const browserLang = navigator.language.split('-')[0];
        console.log('🌍 Browser language:', browserLang);
        if (CONFIG.SUPPORTED_LANGUAGES.includes(browserLang)) {
          i18n.setLanguage(browserLang);
        } else {
          console.log('🌍 Default language is used');
        }
      }
      
      // Тема
      const savedTheme = await db.getSetting('theme');
      if (savedTheme) {
        console.log('🎨 Downloaded theme:', savedTheme);
        this.applyTheme(savedTheme);
      } else {
        // За замовчуванням використовуємо системну тему
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? 'dark' : 'light';
        console.log('🎨 Системна тема:', defaultTheme);
        this.applyTheme(defaultTheme);
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      // Продовжуємо з дефолтними налаштуваннями
    }
  }
  
  // Застосування теми
  applyTheme(theme) {
    console.log('🎨 Application of the theme:', theme);
    
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }
  
  // Реєстрація Service Worker
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Перевірка оновлень кожну годину
        setInterval(() => {
          registration.update();
          console.log('🔄 Checking for Service Worker updates...');
        }, 3600000); // 1 година
        
        // Обробка оновлень
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('📦 A new update is available!');
              this.showUpdateNotification();
            }
          });
        });
        
      } catch (error) {
        console.error('❌ Service Worker registration error:', error);
      }
    } else {
      console.warn('⚠️ Service Worker is not supported');
    }
  }
  
  // Показати повідомлення про оновлення
  showUpdateNotification() {
    const shouldUpdate = confirm('A new version of the app is available. Update now?');
    
    if (shouldUpdate) {
      window.location.reload();
    }
  }
  
  // Налаштування UI
  setupUI() {
    // Кнопка меню
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => UI.toggleMenu());
    }
    
    // Overlay
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.addEventListener('click', () => UI.closeMenu());
    }
    
    // Sidebar навігація
    this.setupSidebar();
    
    // Обробка зміни розміру вікна
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Закрити меню при зміні орієнтації
        if (window.innerWidth > 768) {
          UI.closeMenu();
        }
      }, 150);
    });
  }
  
  // Налаштування sidebar
  setupSidebar() {
    const sidebarNav = document.getElementById('sidebarNav');
    if (!sidebarNav) return;
    
    const menuItems = [
      { label: 'nav_profile', route: 'profile', icon: '👤' },
      { label: 'nav_games', route: 'games', icon: '🎮' },
      { label: 'nav_music', route: 'music', icon: '🎵' },
      { label: 'nav_settings', route: 'settings', icon: '⚙️' },
      { label: 'nav_about', route: 'about', icon: 'ℹ️' },
      { label: 'nav_logout', action: 'logout', isDanger: true, icon: '🚪' }
    ];
    
    sidebarNav.innerHTML = menuItems.map((item, index) => `
      <div class="nav-item ${index === 0 ? 'active' : ''} ${item.isDanger ? 'nav-item-danger' : ''}" 
           onclick="${item.action ? 'logout()' : `navigateTo('${item.route}', event)`}">
        <span data-i18n="${item.label}">${i18n.t(item.label)}</span>
      </div>
    `).join('');
    
    console.log('✅ Sidebar навігація створена');
  }
  
  // Відслідковування статусу з'єднання
  setupOnlineStatus() {
    const updateStatus = () => {
      this.isOnline = navigator.onLine;
      
      if (this.isOnline) {
        UI.showStatusBar(i18n.t('online_status') || 'Online', 'online');
        console.log('🌐 Online');
      } else {
        UI.showStatusBar(i18n.t('offline_status') || 'Offline', 'error');
        console.log('📴 Offline');
      }
    };
    
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    
    // Початковий статус
    if (!this.isOnline) {
      UI.showStatusBar(i18n.t('offline_status') || 'Offline', 'error');
    }
  }
  
  // Обробка встановлення PWA
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Запобігти автоматичному показу prompt
      e.preventDefault();
      this.installPrompt = e;
      
      console.log('📲 PWA can be installed');
      
      // Можна показати кнопку "Встановити додаток"
      this.showInstallButton();
    });
    
    // Відслідковування успішного встановлення
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA has been successfully installed!');
      this.installPrompt = null;
      UI.showAlert('The app has been installed!', 'success');
    });
  }
  
  // Показати кнопку встановлення
  showInstallButton() {
    // Можна додати кнопку "Встановити" в UI
    // Наразі просто логуємо
    console.log('💡 Tip: You can add the app to your home screen.');
  }
  
  // Встановити PWA
  async installApp() {
    if (!this.installPrompt) {
      console.warn('⚠️ Prompt installation is unavailable');
      return;
    }
    
    // Показати prompt
    this.installPrompt.prompt();
    
    // Очікування вибору користувача
    const { outcome } = await this.installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ The user accepted the installation.');
    } else {
      console.log('❌ User declined installation');
    }
    
    this.installPrompt = null;
  }
}

// Глобальна функція logout
window.logout = async function() {
  const confirmed = confirm(i18n.t('logout_confirm') || 'Are you sure you want to exit?');
  
  if (confirmed) {
    await auth.logout();
  }
};

// Ініціалізація додатку при завантаженні
const app = new App();

// Запуск після завантаження DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  // Якщо DOM вже завантажено
  app.init();
}

// Експорт для можливого використання
window.app = app;