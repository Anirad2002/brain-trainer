// Конфігурація додатку

const CONFIG = {
  APP_NAME: 'Brain Trainer',
  APP_VERSION: '1.2.0',
  DB_NAME: 'ProfileDB',
  DB_VERSION: 1,
  DEFAULT_LANGUAGE: 'pl',
  SUPPORTED_LANGUAGES: ['uk', 'pl', 'en'],
  CACHE_NAME: 'pwa-profile-v1',
  
  // Налаштування безпеки
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_AGE: 13,
  MAX_AGE: 120,
  
  // Налаштування валідації
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  
  // Налаштування UI
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
  
  // LocalStorage ключі
  STORAGE_KEYS: {
    CURRENT_USER: 'currentUserEmail',
    LANGUAGE: 'appLanguage',
    THEME: 'appTheme',
    REMEMBER_ME: 'rememberMe'
  },
  
  // Теми
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  },
  
  // Маршрути
  ROUTES: {
    LOGIN: 'login',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgot-password',
    PROFILE: 'profile',
    SETTINGS: 'settings',
    ABOUT: 'about'
  },
  
  // Повідомлення
  MESSAGES: {
    INSTALL_SUCCESS: 'App installed successfully!',
    UPDATE_AVAILABLE: 'New update available',
    OFFLINE_MODE: 'You are working in offline mode',
    ONLINE_MODE: 'Connection restored',
    CACHE_CLEARED: 'Cache cleared successfully',
    DATA_SAVED: 'Data saved',
    ERROR_OCCURRED: 'An error occurred'
  }
};

// Заморожуємо конфігурацію
Object.freeze(CONFIG);