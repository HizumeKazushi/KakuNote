import { ref } from 'vue';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useMemoStore } from '~/stores/memo';
import { useAuthStore } from '~/stores/auth';

export interface AIResponse {
  text: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export const useGeminiAI = () => {
  const memoStore = useMemoStore();
  const authStore = useAuthStore();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const apiKey = authStore.getGeminiApiKey();
  let genAI: GoogleGenerativeAI | null = null;
  let model: any = null;

  // APIキーの妥当性チェック
  const initializeModel = (): boolean => {
    if (!apiKey || apiKey.trim() === '') {
      error.value = 'Gemini API key is not configured. Please set it in API Setup.';
      return false;
    }

    if (!apiKey.startsWith('AIza')) {
      error.value = `Invalid Gemini API key format. Expected to start with 'AIza', got: ${apiKey.substring(0, 10)}...`;
      return false;
    }

    try {
      genAI = new GoogleGenerativeAI(apiKey);
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      error.value = null;
      return true;
    } catch (err) {
      error.value = 'Failed to initialize Gemini AI model';
      return false;
    }
  };

  const generateContent = async (prompt: string): Promise<AIResponse> => {
    // ゲストアカウントはAI機能を使用できない
    if (authStore.isGuest) {
      throw new Error('AI機能はゲストアカウントでは使用できません。メールアドレスで登録してください。');
    }

    if (!initializeModel()) {
      throw new Error(error.value || 'Gemini API is not configured');
    }

    isLoading.value = true;
    error.value = null;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return {
        text,
        usage: {
          inputTokens: result.response.usageMetadata?.promptTokenCount || 0,
          outputTokens: result.response.usageMetadata?.candidatesTokenCount || 0,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * アイデア創出支援（対話的版）
   */
  const generateIdeas = async (theme: string, history?: Array<{ role: string; content: string }>): Promise<string> => {
    let conversationContext = '';
    if (history && history.length > 0) {
      conversationContext = '【これまでの会話】\n';
      history.forEach((msg) => {
        conversationContext += `${msg.role === 'user' ? 'ユーザー' : 'AI'}: ${msg.content}\n`;
      });
      conversationContext += '\n';
    }

    const prompt = `${conversationContext}ユーザーが「${theme}」について話しかけてくれました。

あなたのやること：
- 自然な会話のように、短く返答する
- 1-2個の質問や提案を入れる
- 丁寧で誠実なトーン（カジュアルすぎず、かたすぎず）
- 相手を尊重しながらも親しみやすく
- 絵文字は使わない
- 改行は最小限に
- 全体で3-4文以内に

重要：見出しや番号リストは使わない。段落で返す。`;

    const response = await generateContent(prompt);
    return response.text;
  };

  /**
   * 文章生成・編集支援
   */
  const improveText = async (text: string, instruction: string): Promise<string> => {
    const prompt = `以下のテキストに対して、${instruction}してください。

【元のテキスト】
${text}

修正または改善されたテキストのみを返してください。`;

    const response = await generateContent(prompt);
    return response.text;
  };

  /**
   * タグ抽出
   */
  const extractTags = async (content: string): Promise<string[]> => {
    const prompt = `以下のメモ内容から、3～5個の適切なタグを抽出してください。

【メモ内容】
${content}

タグはJSON形式で配列として返してください。例: ["タグ1", "タグ2", "タグ3"]
ただしタグのみを返し、他の説明は不要です。`;

    const response = await generateContent(prompt);
    try {
      const tags = JSON.parse(response.text);
      return Array.isArray(tags) ? tags : [];
    } catch {
      return [];
    }
  };

  /**
   * タスク抽出
   */
  const extractTasks = async (content: string): Promise<string[]> => {
    const prompt = `以下のメモ内容から、実行可能なタスク/アクションアイテムを抽出してください。

【メモ内容】
${content}

各タスクは「〇〇をする」という形式で、JSONの配列として返してください。
例: ["タスク1を完了する", "タスク2を確認する"]
ただしタスクのみを返し、他の説明は不要です。`;

    const response = await generateContent(prompt);
    try {
      const tasks = JSON.parse(response.text);
      return Array.isArray(tasks) ? tasks : [];
    } catch {
      return [];
    }
  };

  /**
   * テキスト要約
   */
  const summarizeText = async (text: string): Promise<string> => {
    const prompt = `以下のチャット内容から、出てきたアイデアや具体的な内容を要約してください。

【チャット内容】
${text}

要約の書き方：
- ユーザーが提示したアイデアや課題
- 出てきた具体的なアイデアの内容
- 重要な視点や洞察
- 検討すべき観点

会話の流れ（誰が何を言ったか）ではなく、実質的なアイデアや内容に焦点を当ててください。

要約のみを返してください。`;

    const response = await generateContent(prompt);
    return response.text;
  };

  /**
   * 関連トピック提案
   */
  const suggestRelatedTopics = async (content: string): Promise<string[]> => {
    const prompt = `以下のメモ内容に関連する、さらに学ぶべきトピックやリソースを5個提案してください。

【メモ内容】
${content}

各トピックは1行で、JSON形式の配列として返してください。
例: ["トピック1", "トピック2", "トピック3"]
ただしトピックのみを返し、他の説明は不要です。`;

    const response = await generateContent(prompt);
    try {
      const topics = JSON.parse(response.text);
      return Array.isArray(topics) ? topics : [];
    } catch {
      return [];
    }
  };

  /**
   * ウェルカムメッセージ（APIを呼び出さない）
   */
  const generateWelcomeMessage = async (): Promise<string> => {
    return `## ようこそ！

新しいアイデアの可能性を探る旅へ、ようこそ！あなたの創造力を最大限に引き出すお手伝いをさせてください。

まずは、どんなことについて考えているか教えてください！

### あなたに知りたいこと

1. **どんな分野でアイデアを深掘りしたいですか？**
   例：新しいサービス、既存の課題解決、趣味や個人的なプロジェクトなど

2. **具体的にどんな課題を解決したいですか？**
   それとも、どんな夢や目標を実現したいですか？

3. **誰のためにそのアイデアを形にしたいですか？**
   ターゲットユーザーや、恩恵を受けたい人など

4. **既に考えていることや、参考になりそうな情報**
   興味、関心、課題意識など、何でも構いません

どんな些細なことでも構いませんので、お気軽にお話しください！`;
  };

  /**
   * チャットタイトル生成
   */
  const generateChatTitle = async (text: string): Promise<string> => {
    const prompt = `以下のチャット内容から、短く、わかりやすいタイトル（5～10文字）を生成してください。

【チャット内容】
${text}

タイトルのみを返してください。マークダウンや説明は不要です。`;

    const response = await generateContent(prompt);
    return response.text.trim();
  };

  /**
   * メモタイトル生成
   */
  const generateMemoTitle = async (summary: string): Promise<string> => {
    const prompt = `以下の要約内容から、メモとして適切なタイトル（5～15文字）を生成してください。

【要約内容】
${summary}

タイトルのみを返してください。マークダウンや説明は不要です。`;

    const response = await generateContent(prompt);
    return response.text.trim();
  };

  return {
    isLoading,
    error,
    generateIdeas,
    improveText,
    extractTags,
    extractTasks,
    summarizeText,
    suggestRelatedTopics,
    generateWelcomeMessage,
    generateChatTitle,
    generateMemoTitle,
  };
};
