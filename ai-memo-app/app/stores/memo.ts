import { defineStore } from 'pinia';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface Diary {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  date: string;
  createdAt: number;
  updatedAt: number;
}

export interface MemoState {
  memos: Memo[];
  currentMemoId: string | null;
  searchQuery: string;
  selectedCategory: string;
  isFreePlan: boolean;
  isDarkMode: boolean;
  chatSessions: ChatSession[];
  currentChatSessionId: string | null;
  diaries: Diary[];
  currentDiaryId: string | null;
}

const FREE_PLAN_MAX_MEMOS = 10;
const PREMIUM_PLAN_MAX_MEMOS = Infinity;

export const useMemoStore = defineStore('memo', {
  state: (): MemoState => ({
    memos: [],
    currentMemoId: null,
    searchQuery: '',
    selectedCategory: 'all',
    isFreePlan: true,
    isDarkMode: false,
    chatSessions: [],
    currentChatSessionId: null,
    diaries: [],
    currentDiaryId: null,
  }),

  getters: {
    currentMemo: (state) => {
      return state.memos.find((m) => m.id === state.currentMemoId);
    },

    filteredMemos: (state) => {
      return state.memos.filter((memo) => {
        const query = state.searchQuery.toLowerCase();
        const matchesSearch =
          memo.title.toLowerCase().includes(query) ||
          memo.content.toLowerCase().includes(query) ||
          memo.tags.some((tag) => tag.toLowerCase().includes(query));

        const matchesCategory = state.selectedCategory === 'all' || memo.category === state.selectedCategory;

        return matchesSearch && matchesCategory;
      });
    },

    pinnedMemos: (state) => {
      return state.memos.filter((m) => m.isPinned).sort((a, b) => b.updatedAt - a.updatedAt);
    },

    canCreateMemo: (state) => {
      if (!state.isFreePlan) return true;
      return state.memos.length < FREE_PLAN_MAX_MEMOS;
    },

    remainingMemoSlots: (state) => {
      if (!state.isFreePlan) return Infinity;
      return Math.max(0, FREE_PLAN_MAX_MEMOS - state.memos.length);
    },
  },

  actions: {
    /**
     * 初期化：保存されたデータをすべて復元
     */
    initializeAll() {
      if (!process.client) return;

      try {
        this._loadFromStorage('memos', 'memos');
        this._loadFromStorage('chatSessions', 'chatSessions');
        this._loadFromStorage('diaries', 'diaries');
        this._loadFromStorage('darkMode', 'isDarkMode', (v) => v === 'true');
      } catch (error) {
        console.error('Failed to initialize store:', error);
      }
    },

    /**
     * メモの初期化（後方互換性）
     */
    initializeMemos() {
      if (!process.client) return;
      this._loadFromStorage('memos', 'memos');
    },

    /**
     * チャットセッションの初期化（後方互換性）
     */
    initializeChatSessions() {
      if (!process.client) return;
      this._loadFromStorage('chatSessions', 'chatSessions');
    },

    /**
     * 日記の初期化（後方互換性）
     */
    initializeDiaries() {
      if (!process.client) return;
      this._loadFromStorage('diaries', 'diaries');
    },

    /**
     * ダークモードの初期化
     */
    initializeDarkMode() {
      if (!process.client) return;

      try {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
          this.isDarkMode = saved === 'true';
        }
      } catch (error) {
        console.error('Failed to load dark mode:', error);
      }

      this.applyDarkMode();
    },

    /**
     * メモ作成
     */
    createMemo(title: string = 'Untitled'): Memo {
      const id = generateUUID();
      const now = Date.now();
      const memo: Memo = {
        id,
        title,
        content: '',
        category: 'general',
        tags: [],
        createdAt: now,
        updatedAt: now,
        isPinned: false,
      };
      this.memos.unshift(memo);
      this.currentMemoId = id;
      this._saveToStorage('memos', this.memos);
      return memo;
    },

    /**
     * メモ更新
     */
    updateMemo(id: string, updates: Partial<Memo>) {
      const memo = this.memos.find((m) => m.id === id);
      if (memo) {
        Object.assign(memo, updates, { updatedAt: Date.now() });
        this._saveToStorage('memos', this.memos);
      }
    },

    /**
     * メモ削除
     */
    deleteMemo(id: string) {
      this.memos = this.memos.filter((m) => m.id !== id);
      if (this.currentMemoId === id) {
        this.currentMemoId = null;
      }
      this._saveToStorage('memos', this.memos);
    },

    /**
     * 現在のメモを設定
     */
    setCurrentMemo(id: string | null) {
      this.currentMemoId = id;
    },

    /**
     * 検索クエリを設定
     */
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    /**
     * カテゴリを設定
     */
    setSelectedCategory(category: string) {
      this.selectedCategory = category;
    },

    /**
     * メモのピン留めを切り替え
     */
    togglePin(id: string) {
      const memo = this.memos.find((m) => m.id === id);
      if (memo) {
        memo.isPinned = !memo.isPinned;
        this._saveToStorage('memos', this.memos);
      }
    },

    /**
     * チャットセッション作成
     */
    createChatSession(title: string = 'New Chat'): ChatSession {
      const id = generateUUID();
      const now = Date.now();
      const session: ChatSession = {
        id,
        title,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      this.chatSessions.unshift(session);
      this.currentChatSessionId = id;
      this._saveToStorage('chatSessions', this.chatSessions);
      return session;
    },

    /**
     * 現在のチャットセッション取得
     */
    getCurrentChatSession(): ChatSession | undefined {
      return this.chatSessions.find((s) => s.id === this.currentChatSessionId);
    },

    /**
     * チャットメッセージを追加
     */
    addChatMessage(sessionId: string, role: 'user' | 'assistant', content: string) {
      const session = this.chatSessions.find((s) => s.id === sessionId);
      if (session) {
        const message: ChatMessage = {
          id: generateUUID(),
          role,
          content,
          timestamp: Date.now(),
        };
        session.messages.push(message);
        session.updatedAt = Date.now();
        this._saveToStorage('chatSessions', this.chatSessions);
      }
    },

    /**
     * チャットセッション削除
     */
    deleteChatSession(id: string) {
      this.chatSessions = this.chatSessions.filter((s) => s.id !== id);
      if (this.currentChatSessionId === id) {
        this.currentChatSessionId = null;
      }
      this._saveToStorage('chatSessions', this.chatSessions);
    },

    /**
     * チャットセッション更新
     */
    updateChatSession(id: string, updates: Partial<ChatSession>) {
      const session = this.chatSessions.find((s) => s.id === id);
      if (session) {
        Object.assign(session, updates, { updatedAt: Date.now() });
        this._saveToStorage('chatSessions', this.chatSessions);
      }
    },

    /**
     * 現在のチャットセッション設定
     */
    setCurrentChatSession(id: string | null) {
      this.currentChatSessionId = id;
    },

    /**
     * 日記作成
     */
    createDiary(date: string, title: string = '', mood: string = 'neutral'): Diary {
      const diary: Diary = {
        id: generateUUID(),
        title: title || `${date}の日記`,
        content: '',
        mood,
        tags: [],
        date,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.diaries.push(diary);
      this._saveToStorage('diaries', this.diaries);
      return diary;
    },

    /**
     * 日記更新
     */
    updateDiary(id: string, updates: Partial<Diary>) {
      const diary = this.diaries.find((d) => d.id === id);
      if (diary) {
        Object.assign(diary, updates, { updatedAt: Date.now() });
        this._saveToStorage('diaries', this.diaries);
      }
    },

    /**
     * 日記削除
     */
    deleteDiary(id: string) {
      const index = this.diaries.findIndex((d) => d.id === id);
      if (index !== -1) {
        this.diaries.splice(index, 1);
        if (this.currentDiaryId === id) {
          this.currentDiaryId = null;
        }
        this._saveToStorage('diaries', this.diaries);
      }
    },

    /**
     * 現在の日記を設定
     */
    setCurrentDiary(id: string | null) {
      this.currentDiaryId = id;
    },

    /**
     * 特定の日付の日記を取得
     */
    getDiaryByDate(date: string): Diary | undefined {
      return this.diaries.find((d) => d.date === date);
    },

    /**
     * ダークモードを切り替え
     */
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      this.applyDarkMode();
      this._saveToStorage('darkMode', this.isDarkMode ? 'true' : 'false');
    },

    /**
     * ダークモードを適用
     */
    applyDarkMode() {
      if (!process.client) return;

      const html = document.documentElement;
      if (this.isDarkMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    },

    /**
     * localStorageからデータをロード
     */
    _loadFromStorage(key: string, stateKey: string, parser?: (v: string) => any) {
      if (!process.client) return;

      try {
        const data = localStorage.getItem(key);
        if (data) {
          const state = this as any;
          state[stateKey] = parser ? parser(data) : JSON.parse(data);
        }
      } catch (error) {
        console.error(`Failed to load ${key} from localStorage:`, error);
      }
    },

    /**
     * localStorageにデータを保存
     */
    _saveToStorage(key: string, value: any) {
      if (!process.client) return;

      try {
        const data = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, data);
      } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
      }
    },

    // 後方互換性のための廃止予定メソッド
    saveMemos() {
      this._saveToStorage('memos', this.memos);
    },

    saveChatSessions() {
      this._saveToStorage('chatSessions', this.chatSessions);
    },

    saveDiaries() {
      this._saveToStorage('diaries', this.diaries);
    },
  },
});
