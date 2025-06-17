# 開発ガイドライン・チーム協働ルール

## チーム構成と責務分担

### チーム構成
```
🏗️ Lead Engineer (Backend + Infrastructure)
├── AWS CDK インフラ管理
├── API設計・実装
├── AI統合・プロンプト設計
├── データベース設計
└── アーキテクチャ決定権限

🎨 Frontend Engineer (UI + UX Implementation)
├── React/Next.js 実装
├── UI コンポーネント開発
├── 状態管理実装
├── PWA機能実装
└── デザインシステム実装

🎯 UI/UX Designer
├── デザインシステム設計
├── ワイヤーフレーム・モックアップ
├── ユーザビリティテスト
├── ビジュアルデザイン
└── デザイン品質管理

🔍 QA Engineer
├── テスト戦略・設計
├── 自動化テスト実装
├── 品質管理・バグトラッキング
├── CI/CD テスト統合
└── リリース品質保証
```

### 責務境界・決定権限

#### アーキテクチャ決定
```
【Lead Engineer が決定】
- インフラ構成・AWS サービス選択
- API設計・データベーススキーマ
- セキュリティ要件・実装方針
- パフォーマンス要件・最適化方針

【Frontend Engineer が決定】
- フロントエンド技術選択・構成
- 状態管理パターン
- コンポーネント設計
- ビルド・デプロイメント戦略

【UI/UX Designer が決定】
- ユーザーフロー・画面遷移
- ビジュアルデザイン・ブランディング
- デザインシステム・コンポーネント仕様
- アクセシビリティ要件

【QA Engineer が決定】
- テスト戦略・テストケース設計
- 品質基準・受入条件
- リリース判定基準
- バグの優先度・重要度
```

#### 合議制決定事項
```
【全員で決定】
- 機能仕様の変更
- 技術的負債の対応方針
- リリーススケジュール調整
- 重大なリファクタリング

【Lead + Frontend で決定】
- API仕様の詳細
- データ型定義・インターフェース
- 認証・認可の実装方針

【Frontend + Designer で決定】
- UIコンポーネントの詳細仕様
- インタラクション・アニメーション
- レスポンシブ対応の実装方針

【Lead + QA で決定】
- CI/CD パイプライン設定
- テスト環境・データ管理
- パフォーマンステスト基準
```

## ブランチ戦略

### Git Flow 採用理由
- 複数人での並行開発に適している
- 機能開発・バグ修正・リリースが明確に分離
- コードレビューとマージのタイミングが制御しやすい

### ブランチ構成
```
main (production)
├── develop (integration)
│   ├── feature/auth-system (Lead Engineer)
│   ├── feature/chat-ui (Frontend Engineer)
│   ├── feature/voice-input (Frontend Engineer)
│   ├── feature/ai-integration (Lead Engineer)
│   └── feature/test-automation (QA Engineer)
├── release/v1.0.0 (release preparation)
└── hotfix/critical-bug-fix (emergency fixes)
```

### ブランチ命名規則
```
【機能開発】
feature/{担当者}/{機能名}
例: feature/frontend/chat-ui
   feature/backend/ai-integration
   feature/qa/e2e-tests

【バグ修正】
bugfix/{担当者}/{バグ概要}
例: bugfix/frontend/message-display
   bugfix/backend/auth-token

【チョア（小さな改善）】
chore/{担当者}/{作業内容}
例: chore/lead/update-dependencies
   chore/qa/improve-test-coverage

【ホットフィックス】
hotfix/{緊急度}/{問題概要}
例: hotfix/critical/security-vulnerability
   hotfix/high/data-loss-bug
```

### ブランチルール・制約
```yaml
Branch Protection Rules:
  main:
    - Require pull request reviews: 2 approvals
    - Require status checks: All CI tests pass
    - Restrict pushes: Lead Engineer only
    - Include administrators: false

  develop:
    - Require pull request reviews: 1 approval
    - Require status checks: Unit tests pass
    - Restrict pushes: No direct push
    - Include administrators: true

  feature/*:
    - No restrictions on force push
    - Automatic deletion after merge
    - Require up-to-date before merge
```

## 開発フロー・プロセス

### 日次開発フロー
```
🌅 朝 (9:00-9:30)
┌─────────────────────────────────────┐
│ Daily Standup (Slack or Meet)       │
├─────────────────────────────────────┤
│ ✅ 昨日の成果報告                   │
│ 🎯 今日の作業予定                   │
│ 🚫 ブロッカー・相談事項             │
│ 🔄 依存関係・調整必要事項           │
└─────────────────────────────────────┘

🔧 開発時間 (9:30-17:00)
┌─────────────────────────────────────┐
│ 同期的コミュニケーションタイム     │
├─────────────────────────────────────┤
│ 10:00-12:00: 集中開発時間           │
│ 13:00-15:00: コラボ可能時間         │
│ 15:00-17:00: 集中開発時間           │
└─────────────────────────────────────┘

🌅 夕方 (17:00-17:30)
┌─────────────────────────────────────┐
│ 進捗共有・明日の準備                │
├─────────────────────────────────────┤
│ 📊 今日の成果まとめ                 │
│ 🔗 PR作成・レビュー依頼             │
│ 📝 明日の作業準備                   │
└─────────────────────────────────────┘
```

### 機能開発フロー
```
1️⃣ 機能仕様確認・設計
┌─────────────────────────────────────┐
│ Responsible: 機能担当者              │
├─────────────────────────────────────┤
│ ✅ 仕様書確認・不明点解消           │
│ 📋 実装タスク分解                   │
│ 🏗️ 技術設計・API設計               │
│ 📅 開発スケジュール策定             │
└─────────────────────────────────────┘

2️⃣ ブランチ作成・開発開始
┌─────────────────────────────────────┐
│ git checkout develop                │
│ git pull origin develop             │
│ git checkout -b feature/xxx/xxx     │
└─────────────────────────────────────┘

3️⃣ 開発・テスト
┌─────────────────────────────────────┐
│ ✅ 機能実装                         │
│ ✅ 単体テスト作成                   │
│ ✅ ローカル動作確認                 │
│ ✅ コードフォーマット・Lint         │
└─────────────────────────────────────┘

4️⃣ プルリクエスト作成
┌─────────────────────────────────────┐
│ 📝 PR テンプレート記入              │
│ 🔗 関連Issue・仕様書リンク          │
│ 📸 動作確認スクリーンショット       │
│ 👥 適切なレビュワー指定             │
└─────────────────────────────────────┘

5️⃣ コードレビュー・修正
┌─────────────────────────────────────┐
│ 👀 コードレビュー実施               │
│ 💬 フィードバック対応               │
│ ✅ CI テスト通過確認                │
│ 🎯 品質基準クリア                   │
└─────────────────────────────────────┘

6️⃣ マージ・デプロイ
┌─────────────────────────────────────┐
│ 🔀 develop ブランチへマージ         │
│ 🚀 ステージング環境デプロイ         │
│ ✅ 統合テスト実施                   │
│ 📋 動作確認・受入テスト             │
└─────────────────────────────────────┘
```

## コードレビュー規則

### レビュー担当者決定ルール
```
【PR作成者が指定】
✅ 必須レビュワー (1名以上)
├── Backend PR → Lead Engineer
├── Frontend PR → Frontend Engineer + (Designer)
├── Infrastructure PR → Lead Engineer + QA Engineer
├── Design System PR → Frontend Engineer + Designer
└── Test PR → QA Engineer + 関連機能担当者

【自動指定（CODEOWNERS）】
├── /frontend/ → @frontend-engineer
├── /backend/ → @lead-engineer  
├── /infrastructure/ → @lead-engineer
├── /tests/ → @qa-engineer
└── *.md → @all-team-members
```

### レビュー観点・チェックリスト
```markdown
## コードレビューチェックリスト

### 🔍 機能面
- [ ] 仕様書通りに実装されているか
- [ ] エッジケースが考慮されているか
- [ ] エラーハンドリングが適切か
- [ ] パフォーマンスに問題がないか

### 🏗️ 設計面
- [ ] アーキテクチャに沿った実装か
- [ ] 適切な責務分離ができているか
- [ ] 再利用可能な設計になっているか
- [ ] 拡張性が考慮されているか

### 🧪 テスト面
- [ ] 適切なテストケースが含まれているか
- [ ] テストカバレッジが基準を満たすか
- [ ] テストが意味のある内容か
- [ ] モックが適切に使用されているか

### 🔒 セキュリティ面
- [ ] 入力値検証が適切か
- [ ] 認証・認可が適切に実装されているか
- [ ] 機密情報が漏洩していないか
- [ ] SQLインジェクション等の脆弱性がないか

### 📚 ドキュメント面
- [ ] コードが自己説明的か
- [ ] 必要なコメントが記載されているか
- [ ] API仕様書が更新されているか
- [ ] README等が必要に応じて更新されているか
```

### レビュー期限・ルール
```
【レビュー期限】
- 緊急 (hotfix): 2時間以内
- 通常 (feature): 1営業日以内
- 大型 (major): 2営業日以内

【レビュー品質基準】
- Approve: 2名以上の承認必須 (main への PR)
- Request Changes: 修正必須、再レビュー必要
- Comment: 軽微な提案、修正は任意

【レビュー時の心得】
- 建設的なフィードバック
- 理由を明確に説明
- 代替案の提示
- 褒めるべき点も指摘
```

## チーム間コミュニケーション

### 同期・非同期コミュニケーション
```
🟢 同期的コミュニケーション (即時応答期待)
├── Daily Standup: 毎朝9:00 (15分)
├── 緊急相談: Slack Call or Google Meet
├── コードレビュー: ペアレビュー・ペアプロ
└── 週次振り返り: 金曜17:00 (30分)

🔵 非同期コミュニケーション (24時間以内応答)
├── 仕様確認・質問: GitHub Discussions
├── 進捗報告: Slack + GitHub Projects
├── 技術議論: GitHub Issues
└── ドキュメント更新: GitHub Wiki
```

### Slack チャンネル設計
```
#general
├── チーム全体のアナウンス
├── 雑談・チームビルディング
└── 重要な決定事項の共有

#dev-backend
├── バックエンド・インフラ関連
├── AWS・データベース議論
└── API設計・セキュリティ

#dev-frontend  
├── フロントエンド・UI関連
├── React・Next.js 技術議論
└── デザインシステム連携

#qa-testing
├── テスト関連議論
├── バグレポート・品質問題
└── リリース品質管理

#design-ux
├── デザイン関連議論
├── ユーザビリティ・アクセシビリティ
└── ブランディング・ビジュアル

#ci-cd-alerts
├── GitHub Actions 通知
├── デプロイメント状況
└── 自動テスト結果

#pr-reviews
├── プルリクエスト通知
├── レビュー依頼・完了
└── マージ通知
```

### 技術的議論・決定プロセス
```
1️⃣ 課題・提案の投稿
┌─────────────────────────────────────┐
│ GitHub Issues でトピック作成        │
├─────────────────────────────────────┤
│ 📋 課題の背景・現状説明             │
│ 🎯 解決したい問題・目標             │
│ 💡 提案・アイデア                   │
│ ⚠️  制約・考慮事項                  │
└─────────────────────────────────────┘

2️⃣ チーム内議論
┌─────────────────────────────────────┐
│ 関係者がコメント・議論              │
├─────────────────────────────────────┤
│ 🔍 技術的な検証・調査               │
│ 📊 メリット・デメリット分析         │
│ 🎨 代替案・改善案の提示             │
│ 📅 実装スケジュール・影響範囲       │
└─────────────────────────────────────┘

3️⃣ 決定・承認
┌─────────────────────────────────────┐
│ 決定権者による最終判断              │
├─────────────────────────────────────┤
│ ✅ 採用する技術・手法の決定         │
│ 📋 実装担当者・期限の確定           │
│ 📚 ドキュメント更新の指示           │
│ 🎯 完了条件・検証方法の設定         │
└─────────────────────────────────────┘

4️⃣ 実装・振り返り
┌─────────────────────────────────────┐
│ 実装完了後の効果測定                │
├─────────────────────────────────────┤
│ 📈 期待効果の達成度評価             │
│ 🔄 改善点・学習事項の共有           │
│ 📝 今後の類似判断への参考資料       │
└─────────────────────────────────────┘
```

## 品質管理・ガードレール

### 必須ガードレール
```yaml
# GitHub Branch Protection
main_branch:
  required_status_checks:
    - "test/unit-tests"
    - "test/integration-tests"  
    - "test/e2e-tests"
    - "security/vulnerability-scan"
    - "quality/code-coverage"
    - "quality/code-smell"
  
  required_pull_request_reviews:
    required_approving_review_count: 2
    dismiss_stale_reviews: true
    require_code_owner_reviews: true
    
  restrictions:
    push_allowlist: ["lead-engineer"]
    
develop_branch:
  required_status_checks:
    - "test/unit-tests"
    - "quality/lint-check"
    
  required_pull_request_reviews:
    required_approving_review_count: 1
```

### CI/CD ゲートチェック
```yaml
# .github/workflows/quality-gates.yml
Quality_Gates:
  Code_Quality:
    - ESLint: エラー 0、警告 10以下
    - TypeScript: 型エラー 0
    - Prettier: フォーマット済み
    - SonarQube: Code Smell B評価以上
    
  Test_Coverage:
    - Unit Tests: 80%以上
    - Integration Tests: 主要API 100%
    - E2E Tests: クリティカルパス 100%
    
  Performance:
    - Bundle Size: 500KB以下
    - Lighthouse Score: 90以上
    - API Response: P99 < 2000ms
    
  Security:
    - Snyk Scan: 高・致命的脆弱性 0
    - OWASP ZAP: セキュリティテストパス
    - Secrets Detection: 機密情報漏洩なし
```

### コード品質基準
```typescript
// 必須実装パターン
interface QualityStandards {
  // 型安全性
  strictTypeChecking: true;
  noImplicitAny: true;
  noImplicitReturns: true;
  
  // エラーハンドリング
  errorBoundaries: "required_for_all_routes";
  apiErrorHandling: "standardized_error_format";
  userFacingErrorMessages: "localized_and_actionable";
  
  // パフォーマンス
  bundleSizeLimit: "500KB";
  componentLazyLoading: "above_route_level";
  imageOptimization: "next_image_component";
  
  // アクセシビリティ
  wcagCompliance: "AA";
  keyboardNavigation: "full_support";
  screenReaderSupport: "semantic_html_aria";
  
  // セキュリティ
  inputValidation: "zod_schema_validation";
  authenticationRequired: "protected_routes";
  csrfProtection: "enabled";
  
  // テスト
  unitTestCoverage: 80;
  integrationTests: "critical_paths";
  e2eTests: "user_workflows";
}
```

## 依存関係・インターフェース管理

### API契約管理
```typescript
// shared/types/api-contracts.ts
/**
 * 必須: すべてのAPI変更はこのファイルを更新
 * ルール: Backend変更→Frontend確認→Designer確認の順序
 */

interface APIContract {
  // 認証API
  "/auth/login": {
    method: "POST";
    request: LoginRequest;
    response: AuthResponse;
    errors: AuthError[];
    version: "v1";
    owner: "lead-engineer";
    consumers: ["frontend-engineer"];
  };
  
  // チャットAPI
  "/chat/messages": {
    method: "POST";
    request: MessageRequest;
    response: MessageResponse;
    errors: ChatError[];
    version: "v1";
    owner: "lead-engineer";
    consumers: ["frontend-engineer"];
    streaming: true; // ストリーミング応答
  };
}

/**
 * 破壊的変更の手順:
 * 1. GitHub Issue で変更提案
 * 2. 影響範囲分析・移行計画作成
 * 3. 関係者承認
 * 4. バージョニング戦略決定
 * 5. 段階的移行実施
 */
```

### デザインシステム契約
```typescript
// shared/design-system/contracts.ts
/**
 * Designer → Frontend Engineer の責務境界
 */

interface DesignSystemContract {
  // Designerの責務
  designTokens: {
    colors: "hex_values_and_semantic_naming";
    typography: "font_family_size_weight_line_height";
    spacing: "8px_grid_system";
    breakpoints: "mobile_tablet_desktop";
    owner: "ui-designer";
  };
  
  // Frontend Engineerの責務  
  implementation: {
    components: "react_typescript_storybook";
    stateManagement: "props_and_hooks";
    accessibility: "aria_labels_and_keyboard";
    responsive: "tailwind_breakpoints";
    owner: "frontend-engineer";
  };
  
  // 共同責務
  collaboration: {
    componentSpecs: "figma_handoff_with_dev_notes";
    interactionSpecs: "lottie_or_detailed_description";
    userFlowValidation: "prototype_review_sessions";
    owners: ["ui-designer", "frontend-engineer"];
  };
}
```

### 環境間データ管理
```yaml
# 環境管理・データ同期ルール
environments:
  development:
    database: "dynamodb-local"
    auth: "cognito-local"
    ai_api: "openai-dev-key"
    data_reset: "daily"
    owner: "lead-engineer"
    
  staging:
    database: "dynamodb-staging"
    auth: "cognito-staging" 
    ai_api: "openai-staging-key"
    data_management: "production-like-data"
    deploy_trigger: "develop_branch_merge"
    owner: "qa-engineer"
    
  production:
    database: "dynamodb-production"
    auth: "cognito-production"
    ai_api: "openai-production-key"
    deploy_trigger: "manual_release_approval"
    data_backup: "automated_daily"
    owner: "lead-engineer"

data_sync_rules:
  test_data:
    - "qa-engineer が test-data/ で管理"
    - "各環境で一貫したテストデータ使用"
    - "個人情報は仮データのみ使用"
    
  migration:
    - "lead-engineer が migration スクリプト作成"
    - "staging で動作確認後 production 適用"
    - "ロールバック手順の事前準備必須"
```

## エスカレーション・意思決定プロセス

### 意思決定フレームワーク
```
🟢 個人判断可能 (Individual Decision)
├── 実装手法の詳細選択
├── コードスタイル・命名
├── ローカル最適化
└── 担当領域内のリファクタリング

🟡 ペア相談推奨 (Pair Consultation)  
├── API設計の詳細
├── UIコンポーネント仕様
├── テストケース設計
└── パフォーマンス最適化手法

🟠 チーム議論必要 (Team Discussion)
├── アーキテクチャ変更
├── 新技術導入
├── 大規模リファクタリング
└── セキュリティポリシー変更

🔴 チーム合意必須 (Team Consensus)
├── 仕様変更・機能追加
├── リリーススケジュール変更
├── 技術的負債の対応方針
└── 品質基準の変更
```

### エスカレーション手順
```
Level 1: ペア相談 (30分以内)
┌─────────────────────────────────────┐
│ 関連分野の担当者に直接相談          │
├─────────────────────────────────────┤
│ Slack DMまたはペアプロで解決        │
│ 15分で解決しない場合は Level 2 へ   │
└─────────────────────────────────────┘

Level 2: チーム相談 (2時間以内)
┌─────────────────────────────────────┐
│ #general または関連チャンネルで相談 │
├─────────────────────────────────────┤
│ 30分で解決しない場合は緊急MTG召集   │
│ GitHub Issue作成・関係者メンション  │
└─────────────────────────────────────┘

Level 3: 緊急会議 (即時)
┌─────────────────────────────────────┐
│ Google Meet緊急会議・全員参加       │
├─────────────────────────────────────┤
│ 問題の整理・解決策の議論・決定      │
│ 議事録作成・フォローアップ担当決定  │
└─────────────────────────────────────┘
```

## ナレッジ共有・ドキュメント管理

### ドキュメント管理責務
```
📚 Architecture Decision Records (ADRs)
├── Owner: Lead Engineer
├── Location: /docs/adr/
├── Format: Markdown
└── Review: All team members

📋 API Documentation  
├── Owner: Lead Engineer
├── Location: /docs/api/
├── Tool: OpenAPI 3.0
└── Auto-generation: From code comments

🎨 Design System Documentation
├── Owner: UI Designer + Frontend Engineer
├── Location: Storybook + Figma
├── Format: Interactive components
└── Sync: Weekly design-dev sync

🧪 Testing Documentation
├── Owner: QA Engineer
├── Location: /docs/testing/
├── Content: Test plans, scenarios, reports
└── Update: After each sprint

📖 User Documentation
├── Owner: UI Designer (UX writing)
├── Location: /docs/user/
├── Format: Markdown + Screenshots
└── Review: Frontend Engineer
```

### 技術的知見の共有
```
🎯 Weekly Tech Share (金曜 16:00-16:30)
├── 技術的発見・学習事項の共有
├── 外部記事・トレンド情報
├── 失敗事例・教訓の共有
└── 次週の技術チャレンジ計画

📝 Individual Learning Log
├── 各自が週次で学習事項を記録
├── GitHub Wiki で管理
├── 他メンバーへの知識移転ソース
└── 振り返り・成長確認の材料

🔍 Code Review Learning
├── レビューコメントでの知識共有
├── 良いコード例・パターンの蓄積
├── セキュリティ・パフォーマンス観点
└── 継続的な品質向上
```

このガイドラインにより、異なる専門性を持つチームメンバーが効率的に協働し、高品質なプロダクトを開発できる体制を整備します。