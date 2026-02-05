// Робота з IndexedDB

class Database {
  constructor() {
    this.db = null;
    this.dbName = CONFIG.DB_NAME;
    this.dbVersion = CONFIG.DB_VERSION;
  }
  
  // Ініціалізація бази даних
  async init() {
    return new Promise((resolve, reject) => {
      console.log(`📂 Opening database: ${this.dbName} v${this.dbVersion}`);
      
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('❌ IndexedDB opening error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB connected successfully');
        console.log('📦 Available stores:', Array.from(this.db.objectStoreNames));
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        console.log('🔄 Updating database structure...');
        const db = event.target.result;
        
        // Створення сховища користувачів
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'email' });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('name', 'name', { unique: false });
          console.log('📦 Created users store');
        }
        
        // Створення сховища налаштувань
        if (!db.objectStoreNames.contains('settings')) {
          const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
          console.log('📦 Created settings store');
        }
        
        // Створення сховища активності
        if (!db.objectStoreNames.contains('activity')) {
          const activityStore = db.createObjectStore('activity', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          activityStore.createIndex('userEmail', 'userEmail', { unique: false });
          activityStore.createIndex('timestamp', 'timestamp', { unique: false });
          console.log('📦 Created activity store');
        }
        
        console.log('✅ Database structure updated');
      };
      
      // Обробка блокування бази даних
      request.onblocked = () => {
        console.warn('⚠️ Database blocked. Please close other tabs with this application.');
      };
    });
  }
  
  // Перевірка чи база даних ініціалізована
  checkConnection() {
    if (!this.db) {
      throw new Error('Database not initialized. Call db.init() first.');
    }
  }
  
  // Зберегти користувача
  async saveUser(user) {
    this.checkConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      
      // Додаємо дату створення якщо її немає
      if (!user.createdAt) {
        user.createdAt = new Date().toISOString();
      }
      
      // Додаємо дату оновлення
      user.updatedAt = new Date().toISOString();
      
      const request = store.add(user);
      
      request.onsuccess = () => {
        console.log('✅ User saved:', user.email);
        resolve(user);
      };
      
      request.onerror = () => {
        console.error('❌ Error saving user:', request.error);
        reject(request.error);
      };
    });
  }
  
  // Оновити користувача
  async updateUser(email, updates) {
    this.checkConnection();
    
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.getUser(email);
        if (!user) {
          reject(new Error('User not found'));
          return;
        }
        
        // Оновлюємо дані
        const updatedUser = {
          ...user,
          ...updates,
          email: user.email, // Email не можна змінити
          updatedAt: new Date().toISOString()
        };
        
        const transaction = this.db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.put(updatedUser);
        
        request.onsuccess = () => {
          console.log('✅ User updated:', email);
          resolve(updatedUser);
        };
        
        request.onerror = () => {
          console.error('❌ Error updating user:', request.error);
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Отримати користувача
  async getUser(email) {
    this.checkConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(email);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        console.error('❌ Error getting user:', request.error);
        reject(request.error);
      };
    });
  }
  
  // Отримати всіх користувачів
  async getAllUsers() {
    this.checkConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      
      request.onerror = () => {
        console.error('❌ Error getting users:', request.error);
        reject(request.error);
      };
    });
  }
  
  // Видалити користувача
  async deleteUser(email) {
    this.checkConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.delete(email);
      
      request.onsuccess = () => {
        console.log('✅ User deleted:', email);
        resolve(true);
      };
      
      request.onerror = () => {
        console.error('❌ Error deleting user:', request.error);
        reject(request.error);
      };
    });
  }
  
  // Зберегти налаштування
  async saveSetting(key, value) {
    this.checkConnection();
    
    return new Promise((resolve, reject) => {
      // Перевірка чи існує сховище
      if (!this.db.objectStoreNames.contains('settings')) {
        reject(new Error('Settings store does not exist'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(['settings'], 'readwrite');
        const store = transaction.objectStore('settings');
        const request = store.put({ key, value, updatedAt: new Date().toISOString() });
        
        request.onsuccess = () => {
          console.log('✅ Setting saved:', key, '=', value);
          resolve(value);
        };
        
        request.onerror = () => {
          console.error('❌ Error saving setting:', request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error('❌ Transaction error:', error);
        reject(error);
      }
    });
  }
  
  // Отримати налаштування
  async getSetting(key) {
    // Якщо база не ініціалізована, повертаємо null
    if (!this.db) {
      return null;
    }
    
    return new Promise((resolve, reject) => {
      // Перевірка чи існує сховище
      if (!this.db.objectStoreNames.contains('settings')) {
        resolve(null);
        return;
      }
      
      try {
        const transaction = this.db.transaction(['settings'], 'readonly');
        const store = transaction.objectStore('settings');
        const request = store.get(key);
        
        request.onsuccess = () => {
          const result = request.result ? request.result.value : null;
          console.log('📖 Setting retrieved:', key, '=', result);
          resolve(result);
        };
        
        request.onerror = () => {
          console.error('❌ Error retrieving setting:', request.error);
          resolve(null); // Повертаємо null замість помилки
        };
      } catch (error) {
        console.error('❌ Transaction error:', error);
        resolve(null);
      }
    });
  }
  
  // Додати активність
  async addActivity(userEmail, type, description) {
    this.checkConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['activity'], 'readwrite');
      const store = transaction.objectStore('activity');
      
      const activity = {
        userEmail,
        type,
        description,
        timestamp: new Date().toISOString()
      };
      
      const request = store.add(activity);
      
      request.onsuccess = () => {
        console.log('✅ Activity added:', type);
        resolve(activity);
      };
      
      request.onerror = () => {
        console.error('❌ Error adding activity:', request.error);
        reject(request.error);
      };
    });
  }
  
  // Отримати активність користувача
  async getUserActivity(userEmail, limit = 10) {
    this.checkConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['activity'], 'readonly');
      const store = transaction.objectStore('activity');
      const index = store.index('userEmail');
      const request = index.getAll(userEmail);
      
      request.onsuccess = () => {
        const activities = request.result || [];
        // Сортуємо за датою (новіші першими) і обмежуємо кількість
        const sorted = activities
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, limit);
        resolve(sorted);
      };
      
      request.onerror = () => {
        console.error('❌ Error retrieving activity:', request.error);
        reject(request.error);
      };
    });
  }
  
  // Очистити всі дані
  async clearAll() {
    this.checkConnection();
    
    return new Promise((resolve, reject) => {
      const storeNames = ['users', 'settings', 'activity'];
      const transaction = this.db.transaction(storeNames, 'readwrite');
      
      let cleared = 0;
      storeNames.forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => {
          cleared++;
          console.log(`🗑️ Store ${storeName} cleared`);
          if (cleared === storeNames.length) {
            console.log('✅ All data cleared');
            resolve(true);
          }
        };
      });
      
      transaction.onerror = () => {
        console.error('❌ Error clearing data:', transaction.error);
        reject(transaction.error);
      };
    });
  }
  
  // Отримати статистику бази даних
  async getStats() {
    this.checkConnection();
    
    try {
      const users = await this.getAllUsers();
      const stats = {
        totalUsers: users.length,
        dbName: this.dbName,
        dbVersion: this.dbVersion,
        stores: Array.from(this.db.objectStoreNames)
      };
      
      console.log('📊 Database statistics:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error retrieving statistics:', error);
      return null;
    }
  }
}

// Глобальний екземпляр бази даних
const db = new Database();