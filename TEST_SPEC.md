# テスト仕様書・テスト観点

## テスト戦略

### テスト方針
- **品質優先**: ユーザー体験に直結する機能の徹底テスト
- **多層テスト**: 単体→統合→E2E→負荷の段階的テスト
- **自動化重視**: CI/CDパイプラインでの自動テスト実行
- **AIテスト**: AI応答の品質・一貫性の特別な検証

### テストピラミッド
```
              E2E Tests
           (20% - 重要フロー)
          ┌─────────────────┐
         │                 │
        │   Integration    │
       │   Tests (30%)     │
      │                   │
     │      Unit Tests     │
    │       (50%)          │
   └─────────────────────────┘
```

## 単体テスト（Unit Tests）

### フロントエンド単体テスト

#### コンポーネントテスト
```typescript
// tests/components/MessageBubble.test.tsx
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '@/components/chat/MessageBubble';

describe('MessageBubble', () => {
  it('ユーザーメッセージが正しく表示される', () => {
    const message = {
      id: '1',
      type: 'user' as const,
      content: 'テストメッセージ',
      timestamp: new Date(),
    };

    render(<MessageBubble message={message} />);
    
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
    expect(screen.getByTestId('user-message')).toHaveClass('user-message');
  });

  it('AIメッセージにアバターが表示される', () => {
    const message = {
      id: '2',
      type: 'ai' as const,
      content: 'AI応答です',
      timestamp: new Date(),
    };

    render(<MessageBubble message={message} />);
    
    expect(screen.getByTestId('ai-avatar')).toBeInTheDocument();
    expect(screen.getByText('AI応答です')).toBeInTheDocument();
  });

  it('長いメッセージが適切に改行される', () => {
    const longMessage = {
      id: '3',
      type: 'ai' as const,
      content: 'これは非常に長いメッセージです。'.repeat(10),
      timestamp: new Date(),
    };

    render(<MessageBubble message={longMessage} />);
    
    const messageElement = screen.getByTestId('message-content');
    expect(messageElement).toHaveStyle('word-wrap: break-word');
  });
});
```

#### フック（Hooks）テスト
```typescript
// tests/hooks/useChat.test.ts
import { renderHook, act } from '@testing-library/react';
import { useChat } from '@/hooks/useChat';
import { vi } from 'vitest';

// API モック
vi.mock('@/lib/api', () => ({
  sendMessage: vi.fn(),
  startSession: vi.fn(),
}));

describe('useChat', () => {
  it('メッセージ送信が正常に動作する', async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('テストメッセージ');
    });

    expect(result.current.messages).toHaveLength(2); // user + ai
    expect(result.current.messages[0].content).toBe('テストメッセージ');
    expect(result.current.isLoading).toBe(false);
  });

  it('セッション開始時にタイマーが設定される', async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.startSession(30); // 30分
    });

    expect(result.current.timeRemaining).toBe(1800); // 30分 = 1800秒
    expect(result.current.sessionId).toBeTruthy();
  });

  it('エラー発生時に適切に処理される', async () => {
    const { sendMessage } = require('@/lib/api');
    sendMessage.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('エラーテスト');
    });

    expect(result.current.error).toBe('メッセージの送信に失敗しました');
    expect(result.current.isLoading).toBe(false);
  });
});
```

### バックエンド単体テスト

#### Lambda関数テスト
```typescript
// tests/functions/chat/sendMessage.test.ts
import { handler } from '@/functions/chat/sendMessage';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { vi } from 'vitest';

// AWS SDK モック
vi.mock('@aws-sdk/client-dynamodb');

describe('sendMessage Lambda', () => {
  const mockEvent = {
    httpMethod: 'POST',
    headers: {
      'Authorization': 'Bearer valid-token',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: 'test-session-id',
      content: 'テストメッセージ',
    }),
  };

  it('正常なメッセージ送信が処理される', async () => {
    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).success).toBe(true);
  });

  it('認証トークンなしでアクセス拒否される', async () => {
    const unauthorizedEvent = {
      ...mockEvent,
      headers: {},
    };

    const result = await handler(unauthorizedEvent);

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body).error).toBe('認証が必要です');
  });

  it('不正なリクエストボディでバリデーションエラー', async () => {
    const invalidEvent = {
      ...mockEvent,
      body: JSON.stringify({ sessionId: 'invalid' }), // contentがない
    };

    const result = await handler(invalidEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toContain('バリデーション');
  });
});
```

#### ユーティリティ関数テスト
```typescript
// tests/lib/prompts.test.ts
import { generatePrompt, SYSTEM_PROMPT } from '@/lib/prompts';

describe('Prompt Generation', () => {
  const mockContext = {
    userName: '田中さん',
    experienceYears: 3,
    specialization: 'フロントエンド',
    timeRemaining: 25,
    currentTopic: 'React Hooks',
    comprehensionLevel: 7,
    recentMessages: [
      { type: 'user', content: 'useStateについて教えて' },
      { type: 'ai', content: 'useStateは状態管理のフックです' },
    ],
  };

  it('システムプロンプトが正しく生成される', () => {
    const result = generatePrompt('新しい質問', mockContext);

    expect(result).toContain('田中さん');
    expect(result).toContain('3年');
    expect(result).toContain('React Hooks');
    expect(result).toContain('25分');
  });

  it('コンテキストが適切に置換される', () => {
    const result = generatePrompt('テスト', mockContext);

    expect(result).toContain('ユーザー名: 田中さん');
    expect(result).toContain('経験年数: 3年');
    expect(result).toContain('理解度: 7/10');
  });

  it('過去の会話が含まれる', () => {
    const result = generatePrompt('テスト', mockContext);

    expect(result).toContain('useStateについて教えて');
    expect(result).toContain('useStateは状態管理のフックです');
  });
});
```

## 統合テスト（Integration Tests）

### API統合テスト
```typescript
// tests/integration/chat-api.test.ts
import request from 'supertest';
import { app } from '@/app';
import { setupTestDatabase, teardownTestDatabase } from '@/tests/helpers/database';

describe('Chat API Integration', () => {
  let authToken: string;
  let sessionId: string;

  beforeAll(async () => {
    await setupTestDatabase();
    // テストユーザーでログイン
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPassword123!',
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('セッション操作', () => {
    it('新しいセッションを作成できる', async () => {
      const response = await request(app)
        .post('/chat/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          duration: 30,
          topic: 'React Hooks',
        });

      expect(response.status).toBe(201);
      expect(response.body.sessionId).toBeTruthy();
      expect(response.body.duration).toBe(30);

      sessionId = response.body.sessionId;
    });

    it('メッセージ送信と AI応答を受信できる', async () => {
      const response = await request(app)
        .post('/chat/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          content: 'useStateについて教えてください',
        });

      expect(response.status).toBe(200);
      expect(response.body.content).toBeTruthy();
      expect(response.body.content).toContain('useState');
    });

    it('セッションを正常に終了できる', async () => {
      const response = await request(app)
        .post(`/chat/sessions/${sessionId}/end`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.summary).toBeTruthy();
      expect(response.body.comprehensionScore).toBeGreaterThan(0);
    });
  });
});
```

### データベース統合テスト
```typescript
// tests/integration/database.test.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UserRepository } from '@/repositories/UserRepository';
import { SessionRepository } from '@/repositories/SessionRepository';

describe('Database Integration', () => {
  let userRepo: UserRepository;
  let sessionRepo: SessionRepository;
  let testUserId: string;

  beforeAll(async () => {
    userRepo = new UserRepository();
    sessionRepo = new SessionRepository();
  });

  describe('ユーザー管理', () => {
    it('ユーザーを作成・取得できる', async () => {
      const userData = {
        email: 'integration-test@example.com',
        name: 'テストユーザー',
        passwordHash: 'hashed-password',
        profile: {
          experienceYears: 3,
          specialization: ['React', 'TypeScript'],
        },
      };

      const user = await userRepo.create(userData);
      testUserId = user.id;

      expect(user.id).toBeTruthy();
      expect(user.email).toBe(userData.email);

      const retrievedUser = await userRepo.findById(testUserId);
      expect(retrievedUser?.email).toBe(userData.email);
    });

    it('メールアドレスでユーザーを検索できる', async () => {
      const user = await userRepo.findByEmail('integration-test@example.com');
      
      expect(user).toBeTruthy();
      expect(user?.id).toBe(testUserId);
    });
  });

  describe('セッション管理', () => {
    it('セッションを作成・管理できる', async () => {
      const sessionData = {
        userId: testUserId,
        duration: 30,
        topics: ['React Hooks'],
      };

      const session = await sessionRepo.create(sessionData);

      expect(session.id).toBeTruthy();
      expect(session.userId).toBe(testUserId);
      expect(session.status).toBe('active');

      // セッション終了
      await sessionRepo.end(session.id, {
        comprehensionScore: 85,
        messagesCount: 12,
      });

      const endedSession = await sessionRepo.findById(session.id);
      expect(endedSession?.status).toBe('completed');
      expect(endedSession?.comprehensionScore).toBe(85);
    });
  });
});
```

## E2Eテスト（End-to-End Tests）

### Cypress E2Eテスト
```typescript
// cypress/e2e/chat-flow.cy.ts
describe('チャット機能 E2E', () => {
  beforeEach(() => {
    // テストユーザーでログイン
    cy.login('test@example.com', 'TestPassword123!');
    cy.visit('/');
  });

  it('完全な学習セッションフローを実行できる', () => {
    // セッション開始
    cy.get('[data-testid="start-session"]').click();
    cy.get('[data-testid="session-duration"]').select('30');
    cy.get('[data-testid="confirm-start"]').click();

    // AIの挨拶メッセージを確認
    cy.get('[data-testid="ai-message"]')
      .should('contain', 'お疲れさまです')
      .should('contain', '30分');

    // メッセージ送信
    cy.get('[data-testid="message-input"]')
      .type('useStateについて教えてください{enter}');

    // AI応答を確認
    cy.get('[data-testid="ai-message"]', { timeout: 10000 })
      .last()
      .should('contain', 'useState');

    // タイマーの動作確認
    cy.get('[data-testid="timer"]')
      .should('contain', '29:');

    // セッション終了
    cy.get('[data-testid="end-session"]').click();
    cy.get('[data-testid="session-summary"]')
      .should('be.visible')
      .should('contain', 'お疲れさまでした');

    // 履歴に記録されていることを確認
    cy.visit('/history');
    cy.get('[data-testid="session-item"]')
      .first()
      .should('contain', 'useState');
  });

  it('音声入力機能が動作する', () => {
    cy.get('[data-testid="start-session"]').click();
    cy.get('[data-testid="confirm-start"]').click();

    // 音声入力ボタンをクリック
    cy.get('[data-testid="voice-input"]').click();
    
    // 音声入力中のUIを確認
    cy.get('[data-testid="voice-recording"]')
      .should('be.visible')
      .should('contain', '音声を認識中');

    // 音声入力終了（モック）
    cy.window().then((win) => {
      win.postMessage({
        type: 'VOICE_RESULT',
        text: 'TypeScriptの基本について教えて',
      }, '*');
    });

    // 認識されたテキストが入力欄に表示される
    cy.get('[data-testid="message-input"]')
      .should('have.value', 'TypeScriptの基本について教えて');
  });

  it('オフライン時に適切にフォールバックする', () => {
    // ネットワークを無効化
    cy.window().then((win) => {
      win.navigator.serviceWorker.controller?.postMessage({
        type: 'SIMULATE_OFFLINE',
      });
    });

    cy.visit('/');

    // オフライン状態の表示を確認
    cy.get('[data-testid="offline-indicator"]')
      .should('be.visible')
      .should('contain', 'オフライン');

    // 過去のセッション履歴は閲覧可能
    cy.visit('/history');
    cy.get('[data-testid="session-item"]')
      .should('exist');

    // 新しいセッションは開始できない
    cy.visit('/');
    cy.get('[data-testid="start-session"]').click();
    cy.get('[data-testid="offline-message"]')
      .should('contain', 'インターネット接続が必要');
  });
});
```

### PWA機能テスト
```typescript
// cypress/e2e/pwa.cy.ts
describe('PWA機能', () => {
  it('アプリをホーム画面に追加できる', () => {
    cy.visit('/');

    // Service Worker が登録される
    cy.window().then((win) => {
      expect(win.navigator.serviceWorker.controller).to.exist;
    });

    // インストールプロンプトが表示される
    cy.get('[data-testid="install-prompt"]')
      .should('be.visible')
      .click();

    // PWAとしてインストールされる（モック）
    cy.window().then((win) => {
      expect(win.matchMedia('(display-mode: standalone)').matches).to.be.true;
    });
  });

  it('プッシュ通知の許可を求める', () => {
    cy.visit('/settings');

    cy.get('[data-testid="notification-toggle"]').click();

    // 通知許可ダイアログが表示される
    cy.window().then((win) => {
      cy.stub(win.Notification, 'requestPermission').resolves('granted');
    });

    cy.get('[data-testid="notification-status"]')
      .should('contain', '有効');
  });
});
```

## AIテスト（特別観点）

### AI応答品質テスト
```typescript
// tests/ai/response-quality.test.ts
import { generateAIResponse } from '@/lib/ai';
import { evaluateResponse } from '@/tests/helpers/ai-evaluator';

describe('AI応答品質テスト', () => {
  const baseContext = {
    userName: '田中さん',
    experienceYears: 3,
    specialization: 'フロントエンド',
    timeRemaining: 25,
    currentTopic: 'React',
    comprehensionLevel: 5,
    recentMessages: [],
  };

  it('技術的質問に適切に応答する', async () => {
    const responses = [];
    
    // 同じ質問を5回実行
    for (let i = 0; i < 5; i++) {
      const response = await generateAIResponse(
        'useStateとuseReducerの違いを教えてください',
        baseContext
      );
      responses.push(response);
    }

    // 応答の品質評価
    responses.forEach(response => {
      expect(response).toContain('useState');
      expect(response).toContain('useReducer');
      expect(response.length).toBeGreaterThan(100);
      expect(response.length).toBeLessThan(1000);
      
      // キャラクター性の確認
      expect(response).toMatch(/(です|ます|だね|よ)/); // 適切な口調
      expect(response).toMatch(/(時間|急|早)/); // せっかちな性格
    });

    // 応答の一貫性確認（完全に同じではないが、主要ポイントは共通）
    const commonTerms = ['useState', 'useReducer', 'state', '状態'];
    commonTerms.forEach(term => {
      const containingCount = responses.filter(r => r.includes(term)).length;
      expect(containingCount).toBeGreaterThan(responses.length * 0.8);
    });
  });

  it('適切なレベルで説明する', async () => {
    const beginnerContext = { ...baseContext, comprehensionLevel: 2 };
    const advancedContext = { ...baseContext, comprehensionLevel: 9 };

    const beginnerResponse = await generateAIResponse(
      'クロージャについて教えて',
      beginnerContext
    );

    const advancedResponse = await generateAIResponse(
      'クロージャについて教えて',
      advancedContext
    );

    // 初心者向けはより基本的な説明
    expect(beginnerResponse).toMatch(/(基本|簡単|まず)/);
    expect(beginnerResponse.length).toBeGreaterThan(advancedResponse.length);

    // 上級者向けはより高度な内容
    expect(advancedResponse).toMatch(/(応用|詳細|実装)/);
  });

  it('時間を意識した応答をする', async () => {
    const shortTimeContext = { ...baseContext, timeRemaining: 5 };
    const longTimeContext = { ...baseContext, timeRemaining: 25 };

    const shortResponse = await generateAIResponse(
      'Reactについて詳しく教えて',
      shortTimeContext
    );

    const longResponse = await generateAIResponse(
      'Reactについて詳しく教えて',
      longTimeContext
    );

    // 時間が短い場合は簡潔な応答
    expect(shortResponse).toMatch(/(時間|急|短|要点)/);
    expect(shortResponse.length).toBeLessThan(longResponse.length);
  });
});
```

### AI一貫性テスト
```typescript
// tests/ai/consistency.test.ts
describe('AIキャラクター一貫性テスト', () => {
  it('複数セッションでキャラクター性が一貫している', async () => {
    const testQuestions = [
      'こんにちは',
      '今日は何を学びますか？',
      '難しくてわからない',
      '時間がかかりそう',
    ];

    const responses = [];

    for (const question of testQuestions) {
      const response = await generateAIResponse(question, baseContext);
      responses.push(response);
    }

    // キャラクター特性の確認
    responses.forEach(response => {
      // せっかちな性格
      const hasImpatience = /(急|時間|早|さっそく)/i.test(response);
      
      // 親しみやすさ
      const hasFriendliness = /(頑張|一緒|大丈夫)/i.test(response);
      
      // 適度な敬語
      const hasPoliteLanguage = /(です|ます|ください)/i.test(response);

      expect(hasImpatience || hasFriendliness || hasPoliteLanguage).toBe(true);
    });
  });
});
```

## 負荷テスト（Performance Tests）

### API負荷テスト
```typescript
// tests/load/api-load.test.ts
import { check } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '2m', target: 20 }, // ランプアップ
    { duration: '5m', target: 20 }, // 定常状態
    { duration: '2m', target: 50 }, // 負荷増加
    { duration: '5m', target: 50 }, // 高負荷状態
    { duration: '2m', target: 0 },  // ランプダウン
  ],
  thresholds: {
    http_req_duration: ['p(99)<5000'], // 99%のリクエストが5秒以内
    http_req_failed: ['rate<0.1'],     // エラー率10%未満
  },
};

export default function () {
  // ログイン
  const loginResponse = http.post('/auth/login', {
    email: 'loadtest@example.com',
    password: 'LoadTest123!',
  });

  check(loginResponse, {
    'ログイン成功': (r) => r.status === 200,
  });

  const authToken = loginResponse.json('token');

  // セッション開始
  const sessionResponse = http.post(
    '/chat/sessions',
    JSON.stringify({ duration: 30 }),
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  check(sessionResponse, {
    'セッション作成成功': (r) => r.status === 201,
  });

  const sessionId = sessionResponse.json('sessionId');

  // メッセージ送信
  const messageResponse = http.post(
    '/chat/messages',
    JSON.stringify({
      sessionId,
      content: 'useStateについて教えてください',
    }),
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  check(messageResponse, {
    'メッセージ送信成功': (r) => r.status === 200,
    'AI応答時間': (r) => r.timings.duration < 3000,
  });
}
```

## セキュリティテスト

### 脆弱性テスト
```typescript
// tests/security/vulnerabilities.test.ts
describe('セキュリティテスト', () => {
  it('SQLインジェクション攻撃を防ぐ', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .post('/chat/messages')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        sessionId: 'valid-session-id',
        content: maliciousInput,
      });

    // 正常に処理される（攻撃は無効化される）
    expect(response.status).toBe(200);
    
    // データベースは正常に動作
    const user = await userRepo.findById('test-user-id');
    expect(user).toBeTruthy();
  });

  it('XSS攻撃を防ぐ', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    
    const response = await request(app)
      .post('/chat/messages')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        sessionId: 'valid-session-id',
        content: xssPayload,
      });

    expect(response.status).toBe(200);
    
    // レスポンスにスクリプトタグが含まれていない
    expect(response.body.content).not.toContain('<script>');
    expect(response.body.content).toContain('&lt;script&gt;');
  });

  it('認証バイパス攻撃を防ぐ', async () => {
    const responses = await Promise.all([
      // 無効なトークン
      request(app)
        .post('/chat/messages')
        .set('Authorization', 'Bearer invalid-token')
        .send({ sessionId: 'test', content: 'test' }),
      
      // 期限切れトークン
      request(app)
        .post('/chat/messages')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({ sessionId: 'test', content: 'test' }),
      
      // トークンなし
      request(app)
        .post('/chat/messages')
        .send({ sessionId: 'test', content: 'test' }),
    ]);

    responses.forEach(response => {
      expect(response.status).toBe(401);
    });
  });
});
```

## テスト自動化・CI/CD

### GitHub Actions ワークフロー
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
      
      - name: Run unit tests
        run: |
          cd frontend && npm run test:unit
          cd ../backend && npm run test:unit
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      dynamodb-local:
        image: amazon/dynamodb-local
        ports:
          - 8000:8000
    
    steps:
      - uses: actions/checkout@v3
      - name: Run integration tests
        run: npm run test:integration
        env:
          DYNAMODB_ENDPOINT: http://localhost:8000

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          start: npm run dev
          wait-on: 'http://localhost:3000'
          
  load-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Run k6 load tests
        uses: grafana/k6-action@v0.1.1
        with:
          filename: tests/load/api-load.test.ts
```

## テスト品質指標

### カバレッジ目標
- **単体テスト**: 80%以上
- **統合テスト**: 主要APIパス100%
- **E2E テスト**: クリティカルユーザーフロー100%

### 品質ゲート
- すべてのテストがパス
- コードカバレッジが閾値以上
- セキュリティテストがパス
- 負荷テストが性能要件を満たす
- AI応答品質テストがパス

この包括的なテスト仕様により、Talk with AI の品質と信頼性を確保します。