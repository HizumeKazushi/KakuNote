import { defineStore } from 'pinia';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface User {
  id: string;
  email: string;
  name: string;
  geminiApiKey?: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoggedIn: false,
    isGuest: false,
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn || state.isGuest,
  },

  actions: {
    /**
     * ゲストモードでログイン
     */
    loginAsGuest() {
      this.isGuest = true;
      this.isLoggedIn = false;
      this.user = {
        id: `guest_${generateUUID()}`,
        email: 'guest@example.com',
        name: 'ゲスト',
      };
    },

    /**
     * ユーザーのメールとパスワードでログイン
     */
    async login(email: string, password: string) {
      this.user = {
        id: generateUUID(),
        email,
        name: email.split('@')[0] || 'User',
      };
      this.token = generateUUID();
      this.isLoggedIn = true;
      this.isGuest = false;
      this._saveToStorage();
    },

    /**
     * ユーザー登録してログイン
     */
    async register(email: string, name: string, password: string) {
      this.user = {
        id: generateUUID(),
        email,
        name,
      };
      this.token = generateUUID();
      this.isLoggedIn = true;
      this.isGuest = false;
      this._saveToStorage();
    },

    /**
     * ログアウト
     */
    logout() {
      this.user = null;
      this.token = null;
      this.isLoggedIn = false;
      this.isGuest = false;
      this._clearStorage();
      if (process.client) {
        navigateTo('/');
      }
    },

    /**
     * Gemini APIキーを設定
     */
    setGeminiApiKey(apiKey: string) {
      if (this.user) {
        this.user.geminiApiKey = apiKey;
        this._saveToStorage();
      }
    },

    /**
     * Gemini APIキーを取得
     */
    getGeminiApiKey(): string | null {
      return this.user?.geminiApiKey || null;
    },

    /**
     * Gemini APIキーが設定されているかチェック
     */
    hasGeminiApiKey(): boolean {
      return !!this.user?.geminiApiKey;
    },

    /**
     * 初期化：保存されたトークンからユーザー情報を復元
     */
    initializeAuth() {
      if (!process.client) return;

      try {
        const token = localStorage.getItem('authToken');
        const userJson = localStorage.getItem('user');

        if (token && userJson) {
          this.token = token;
          this.user = JSON.parse(userJson);
          this.isLoggedIn = true;
          this.isGuest = false;
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        this._clearStorage();
      }
    },

    /**
     * ストレージに保存
     */
    _saveToStorage() {
      if (!process.client) return;
      try {
        localStorage.setItem('authToken', this.token || '');
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Failed to save auth state:', error);
      }
    },

    /**
     * ストレージをクリア
     */
    _clearStorage() {
      if (!process.client) return;
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } catch (error) {
        console.error('Failed to clear auth state:', error);
      }
    },
  },
});
