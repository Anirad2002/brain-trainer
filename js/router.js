// Маршрутизація

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.isAuthenticated = false;
    
    // Публічні маршрути (без авторизації)
    this.publicRoutes = ['login', 'register', 'forgot-password'];
    
    // Обробка кнопки назад
    window.addEventListener('popstate', (e) => {
      const route = e.state?.route || 'login';
      this.navigate(route, false);
    });
  }
  
  // Зареєструвати маршрут
  register(name, renderFunction) {
    this.routes[name] = renderFunction;
    console.log(`📝 Route registered: ${name}`);
  }
  
  // Перейти на маршрут
  navigate(routeName, addToHistory = true) {
    // Перевірка чи маршрут існує
    if (!this.routes[routeName]) {
      console.error('❌ Route not found:', routeName);
      return;
    }
    
    // Перевірка авторизації тільки для захищених сторінок
    if (!this.publicRoutes.includes(routeName) && !this.isAuthenticated) {
      console.log('⚠️ Access denied, redirecting to login');
      this.navigate('login', addToHistory);
      return;
    }
    
    // Додавання в історію
    if (addToHistory) {
      window.history.pushState({ route: routeName }, '', `#${routeName}`);
    }
    
    this.currentRoute = routeName;
    
    // Рендер маршруту
    this.render(routeName);
    
    // Оновити активний пункт меню
    this.updateActiveMenuItem(routeName);
    
    // Закрити меню
    UI.closeMenu();
  }
  
  // Відрендерити маршрут
  render(routeName) {
    const app = document.getElementById('app');
    if (!app) {
      console.error('❌ Container "app" not found');
      return;
    }
    
    // Очистити попередній вміст
    app.innerHTML = '';
    
    // Викликати функцію рендерингу
    const renderFunction = this.routes[routeName];
    if (renderFunction) {
      renderFunction();
    }
    
    // Оновити навігацію
    if (!this.publicRoutes.includes(routeName)) {
      UI.updateNav(routeName);
    }
    
    // Оновити заголовок
    this.updateTitle(routeName);
    
    // Оновити переклади
    UI.updateTranslations();
    
    console.log('📍 Route:', routeName);
  }
  
  // Оновити заголовок
  updateTitle(routeName) {
    const titles = {
      login: i18n.t('login_title'),
      register: i18n.t('register_title'),
      'forgot-password': i18n.t('forgot_password_title'),
      profile: i18n.t('profile_title'),
      games: 'Games',
      'game-words': 'Lexical Atlas',
      'game-memory': 'Neural Pairs',
      music: 'Music',
      settings: i18n.t('settings_title'),
      about: i18n.t('about_title')
    };
    
    const title = titles[routeName] || i18n.t('app_name');
    document.title = `${title} - ${i18n.t('app_name')}`;
    
    const headerTitle = document.getElementById('headerTitle');
    if (headerTitle) {
      headerTitle.textContent = title;
    }
  }
  
  // Оновити активний пункт меню
  updateActiveMenuItem(routeName) {
    const menuItems = document.querySelectorAll('.nav-item');
    
    menuItems.forEach(item => {
      // Видаляємо клас active у всіх
      item.classList.remove('active');
      
      // Отримуємо onclick атрибут
      const onclick = item.getAttribute('onclick');
      
      // Перевіряємо чи це поточний маршрут
      if (onclick) {
        // Для звичайних маршрутів
        if (onclick.includes(`'${routeName}'`)) {
          item.classList.add('active');
        }
        // Для підмаршрутів ігор
        if (routeName.startsWith('game-') && onclick.includes("'games'")) {
          item.classList.add('active');
        }
      }
    });
    
    console.log('✅ Active menu item updated:', routeName);
  }
  
  // Встановити статус авторизації
  setAuthenticated(isAuth) {
    this.isAuthenticated = isAuth;
    
    // Показати/сховати header
    const header = document.getElementById('header');
    if (header) {
      header.style.display = isAuth ? 'flex' : 'none';
    }
  }
  
  // Отримати поточний маршрут
  getCurrentRoute() {
    return this.currentRoute;
  }
  
  // Ініціалізація маршрутів з URL
  init() {
    // Перевірка чи маршрути зареєстровані
    const registeredRoutes = Object.keys(this.routes);
    console.log('📋 Registered routes:', registeredRoutes);
    
    if (registeredRoutes.length === 0) {
      console.error('❌ No routes registered!');
      return;
    }
    
    const hash = window.location.hash.substring(1);
    const route = hash || (this.isAuthenticated ? 'profile' : 'login');
    
    // Перевірка чи маршрут існує
    if (!this.routes[route]) {
      console.warn(`⚠️ Route "${route}" not found, using login`);
      this.navigate('login', false);
    } else {
      this.navigate(route, false);
    }
  }
}

// Глобальний екземпляр роутера
const router = new Router();

// Глобальна функція навігації
window.navigateTo = (route, event) => {
  // Запобігти поведінці за замовчуванням якщо є подія
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  router.navigate(route);
};