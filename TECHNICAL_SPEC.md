# 技術仕様書・アーキテクチャ設計

## システム全体アーキテクチャ

### 高レベルアーキテクチャ図
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │   Chat UI       │  │  History UI     │  │  Settings UI    ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                  State Management (Zustand)                ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTPS
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS Infrastructure                      │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   CloudFront    │    │   Route 53      │                │
│  │     (CDN)       │    │    (DNS)        │                │
│  └─────────────────┘    └─────────────────┘                │
│                                  │                          │
│                                  ▼                          │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │       S3        │    │  API Gateway    │                │
│  │  (Static Site)  │    │  (REST/WebSocket│                │
│  └─────────────────┘    └─────────────────┘                │
│                                  │                          │
│                                  ▼                          │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │     Lambda      │    │   DynamoDB      │                │
│  │   Functions     │    │   (Database)    │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │    Cognito      │    │   CloudWatch    │                │
│  │     (Auth)      │    │   (Monitoring)  │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    External APIs                           │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   OpenAI API    │    │  Anthropic      │                │
│  │                 │    │   Claude API    │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## フロントエンド技術仕様

### 技術スタック
```typescript
// package.json 主要依存関係
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.4.0",
    "@ai-sdk/openai": "^0.0.50",
    "ai": "^3.0.0",
    "lucide-react": "^0.300.0",
    "framer-motion": "^10.16.0",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "cypress": "^13.0.0"
  }
}
```

### ディレクトリ構造
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx           # メイン画面
│   │   ├── chat/
│   │   │   └── page.tsx       # チャット画面
│   │   ├── history/
│   │   │   └── page.tsx       # 履歴画面
│   │   ├── settings/
│   │   │   └── page.tsx       # 設定画面
│   │   └── api/               # API Routes
│   │       ├── auth/
│   │       ├── chat/
│   │       └── user/
│   ├── components/            # 再利用可能コンポーネント
│   │   ├── ui/               # UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── chat/             # チャット関連
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── VoiceInput.tsx
│   │   ├── layout/           # レイアウト
│   │   │   ├── Header.tsx
│   │   │   └── Navigation.tsx
│   │   └── features/         # 機能別コンポーネント
│   │       ├── auth/
│   │       ├── history/
│   │       └── settings/
│   ├── lib/                  # ユーティリティ
│   │   ├── utils.ts
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── constants.ts
│   ├── store/                # 状態管理
│   │   ├── authStore.ts
│   │   ├── chatStore.ts
│   │   └── settingsStore.ts
│   ├── types/                # 型定義
│   │   ├── api.ts
│   │   ├── chat.ts
│   │   └── user.ts
│   └── hooks/                # カスタムフック
│       ├── useAuth.ts
│       ├── useChat.ts
│       └── useVoice.ts
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest.json         # PWA設定
├── tests/
│   ├── __mocks__/
│   ├── components/
│   └── pages/
└── cypress/
    ├── e2e/
    └── fixtures/
```

### 状態管理設計（Zustand）
```typescript
// store/chatStore.ts
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sessionId: string | null;
  timeRemaining: number;
  currentTopic: string;
  
  // Actions
  addMessage: (message: Message) => void;
  startSession: () => void;
  endSession: () => void;
  updateTimer: (seconds: number) => void;
  setCurrentTopic: (topic: string) => void;
}

// store/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

// store/settingsStore.ts
interface SettingsState {
  theme: 'light' | 'dark';
  language: 'ja' | 'en';
  voiceEnabled: boolean;
  voiceSpeed: number;
  sessionDuration: number;
  notifications: NotificationSettings;
  
  // Actions
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}
```

## バックエンド技術仕様

### AWS Lambda関数設計
```typescript
// backend/src/functions/
├── auth/
│   ├── login.ts              # ユーザーログイン
│   ├── register.ts           # ユーザー登録
│   └── refresh.ts            # トークンリフレッシュ
├── chat/
│   ├── startSession.ts       # セッション開始
│   ├── sendMessage.ts        # メッセージ送信
│   ├── getResponse.ts        # AI応答生成
│   └── endSession.ts         # セッション終了
├── user/
│   ├── getProfile.ts         # プロフィール取得
│   ├── updateProfile.ts      # プロフィール更新
│   └── deleteAccount.ts      # アカウント削除
└── analytics/
    ├── recordSession.ts      # セッション記録
    ├── updateProgress.ts     # 進捗更新
    └── generateReport.ts     # レポート生成
```

### DynamoDB テーブル設計
```typescript
// Users テーブル
interface UsersTable {
  PK: string;                 // USER#${userId}
  SK: string;                 // PROFILE
  userId: string;             // UUID
  email: string;              // ユニーク
  name: string;
  passwordHash: string;
  createdAt: string;          // ISO 8601
  updatedAt: string;
  profile: {
    experienceYears: number;
    specialization: string[];
    goals: string[];
    preferences: {
      sessionDuration: number;
      voiceEnabled: boolean;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
    };
  };
  GSI1PK: string;            // EMAIL#${email}
  GSI1SK: string;            // USER
}

// Sessions テーブル
interface SessionsTable {
  PK: string;                 // USER#${userId}
  SK: string;                 // SESSION#${sessionId}
  sessionId: string;          // UUID
  userId: string;
  startTime: string;          // ISO 8601
  endTime?: string;
  duration?: number;          // 秒
  status: 'active' | 'completed' | 'aborted';
  topics: string[];
  messagesCount: number;
  comprehensionScore?: number;
  satisfactionScore?: number;
  GSI1PK: string;            // SESSION#${date}
  GSI1SK: string;            // USER#${userId}
}

// Messages テーブル
interface MessagesTable {
  PK: string;                 // SESSION#${sessionId}
  SK: string;                 // MESSAGE#${timestamp}
  messageId: string;          // UUID
  sessionId: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;          // ISO 8601
  metadata?: {
    tokens?: number;
    confidence?: number;
    processingTime?: number;
  };
}

// Progress テーブル
interface ProgressTable {
  PK: string;                 // USER#${userId}
  SK: string;                 // PROGRESS#${topic}
  userId: string;
  topic: string;
  level: number;              // 1-10
  masteryScore: number;       // 0-100
  lastStudied: string;        // ISO 8601
  totalTime: number;          // 分
  sessionCount: number;
  streakDays: number;
  GSI1PK: string;            // TOPIC#${topic}
  GSI1SK: string;            // USER#${userId}
}
```

### API Gateway 設計
```yaml
# OpenAPI 3.0 仕様書（抜粋）
paths:
  /auth/login:
    post:
      summary: ユーザーログイン
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
      responses:
        200:
          description: ログイン成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/User'
        401:
          description: 認証失敗

  /chat/sessions:
    post:
      summary: 新しいセッション開始
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                duration:
                  type: integer
                  default: 30
                topic:
                  type: string
      responses:
        201:
          description: セッション作成成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Session'

  /chat/messages:
    post:
      summary: メッセージ送信
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                sessionId:
                  type: string
                  format: uuid
                content:
                  type: string
                  maxLength: 1000
      responses:
        200:
          description: AI応答
          content:
            text/plain:
              schema:
                type: string
```

## AI統合仕様

### プロンプト設計
```typescript
// lib/prompts.ts
export const SYSTEM_PROMPT = `
あなたは「アイ」という名前の、親しい部下のような25歳のエンジニアAIです。

【性格・口調】
- せっかち（時間を気にする）
- 親しみやすい（敬語ベースだが時々タメ口）
- 面倒見が良い（モチベーションを上げる）
- 技術に情熱的

【制約】
- 30分のセッション時間を意識してください
- プログラミング知識を持つ社会人向けの説明をしてください
- 効率的な学習を重視してください
- 親しみやすさと適度な敬語のバランスを保ってください

【現在のコンテキスト】
- ユーザー名: {userName}
- 経験年数: {experienceYears}年
- 専門分野: {specialization}
- 残り時間: {timeRemaining}分
- 現在のトピック: {currentTopic}
- 理解度: {comprehensionLevel}/10
`;

export const generatePrompt = (
  userMessage: string,
  context: ChatContext
): string => {
  return `${SYSTEM_PROMPT.replace(/{(\w+)}/g, (_, key) => context[key] || '')}

過去の会話:
${context.recentMessages.map(msg => `${msg.type}: ${msg.content}`).join('\n')}

ユーザーの最新メッセージ: ${userMessage}

上記のキャラクター設定に従って、適切に応答してください。`;
};
```

### AI応答処理
```typescript
// lib/ai.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function generateAIResponse(
  userMessage: string,
  context: ChatContext
): Promise<ReadableStream> {
  const prompt = generatePrompt(userMessage, context);
  
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    prompt,
    temperature: 0.7,
    maxTokens: 500,
    frequencyPenalty: 0.3,
    presencePenalty: 0.3,
  });

  return result.toAIStreamResponse({
    onStart: async () => {
      // セッション開始ログ
      await logAIInteraction('start', context.sessionId);
    },
    onCompletion: async (completion) => {
      // 応答完了処理
      await saveMessage({
        sessionId: context.sessionId,
        type: 'ai',
        content: completion,
        timestamp: new Date().toISOString(),
      });
    },
    onError: async (error) => {
      // エラーハンドリング
      console.error('AI応答エラー:', error);
      await logError(error, context.sessionId);
    },
  });
}
```

## インフラ構成（AWS CDK）

### CDK Stack 設計
```typescript
// infrastructure/lib/talk-with-ai-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class TalkWithAiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 バケット（静的サイト）
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `talk-with-ai-${this.account}-${this.region}`,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // CloudFront ディストリビューション
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: websiteBucket,
        },
        behaviors: [{
          isDefaultBehavior: true,
          compress: true,
          allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
        }],
      }],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // DynamoDB テーブル
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'TalkWithAI-Users',
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
    });

    // GSI for email lookup
    usersTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING },
    });

    // Lambda 関数
    const chatFunction = new lambda.Function(this, 'ChatFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        USERS_TABLE_NAME: usersTable.tableName,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
      },
    });

    // DynamoDB アクセス権限
    usersTable.grantReadWriteData(chatFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'TalkWithAiApi', {
      restApiName: 'Talk with AI API',
      description: 'API for Talk with AI application',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // API エンドポイント
    const chatResource = api.root.addResource('chat');
    chatResource.addMethod('POST', new apigateway.LambdaIntegration(chatFunction));

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'TalkWithAI-UserPool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: {
        sms: true,
        otp: true,
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: distribution.distributionDomainName,
      description: 'Website URL',
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });
  }
}
```

## セキュリティ仕様

### 認証・認可
```typescript
// JWT トークン設計
interface JWTPayload {
  sub: string;                // ユーザーID
  email: string;              // メールアドレス
  name: string;               // 表示名
  iat: number;                // 発行時刻
  exp: number;                // 有効期限
  aud: string;                // オーディエンス
  iss: string;                // 発行者
  roles: string[];            // ロール
}

// 認証ミドルウェア
export const authMiddleware = async (
  event: APIGatewayProxyEvent
): Promise<User | null> => {
  const token = event.headers.Authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('認証トークンが必要です');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // トークンの有効性チェック
    if (decoded.exp < Date.now() / 1000) {
      throw new Error('トークンの有効期限が切れています');
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      roles: decoded.roles,
    };
  } catch (error) {
    throw new Error('無効な認証トークンです');
  }
};
```

### データ暗号化
```typescript
// 機密データの暗号化
import * as crypto from 'crypto';

export class DataEncryption {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY = process.env.ENCRYPTION_KEY!;

  static encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.ALGORITHM, this.KEY);
    cipher.setAAD(Buffer.from('additional-data'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return JSON.stringify({
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    });
  }

  static decrypt(encryptedData: string): string {
    const { encrypted, iv, authTag } = JSON.parse(encryptedData);
    
    const decipher = crypto.createDecipher(this.ALGORITHM, this.KEY);
    decipher.setAAD(Buffer.from('additional-data'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

## 監視・ログ仕様

### CloudWatch 設定
```typescript
// 監視メトリクス
const customMetrics = {
  // API関連
  'API/RequestCount': { unit: 'Count' },
  'API/LatencyP99': { unit: 'Milliseconds' },
  'API/ErrorRate': { unit: 'Percent' },
  
  // AI関連
  'AI/ResponseTime': { unit: 'Milliseconds' },
  'AI/TokenUsage': { unit: 'Count' },
  'AI/ErrorRate': { unit: 'Percent' },
  
  // ユーザー関連
  'User/ActiveSessions': { unit: 'Count' },
  'User/SessionDuration': { unit: 'Seconds' },
  'User/ComprehensionScore': { unit: 'None' },
};

// アラート設定
const alerts = [
  {
    name: 'HighErrorRate',
    metric: 'API/ErrorRate',
    threshold: 5, // 5%
    comparisonOperator: 'GreaterThanThreshold',
  },
  {
    name: 'HighLatency',
    metric: 'API/LatencyP99',
    threshold: 5000, // 5秒
    comparisonOperator: 'GreaterThanThreshold',
  },
];
```

この技術仕様書により、開発チームは具体的な実装方針と技術的制約を理解し、一貫性のあるシステム構築を行うことができます。