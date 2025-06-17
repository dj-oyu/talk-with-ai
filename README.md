# Talk with AI - プロジェクト概要

AIとともに日常を楽しむための、親しい部下のようなAIキャラクターとの学習アプリ

## 📋 プロジェクトドキュメント

### 🎯 企画・コンセプト
- [**PROJECT_CONCEPT.md**](./PROJECT_CONCEPT.md) - プロジェクト企画書・全体コンセプト
- [**AI_CHARACTER_SPEC.md**](./AI_CHARACTER_SPEC.md) - AIキャラクター「アイ」の詳細仕様

### 🎨 設計・仕様
- [**UI_UX_DESIGN.md**](./UI_UX_DESIGN.md) - UI/UX設計・ワイヤーフレーム
- [**FUNCTIONAL_SPEC.md**](./FUNCTIONAL_SPEC.md) - 機能仕様書・各機能の詳細動作
- [**TECHNICAL_SPEC.md**](./TECHNICAL_SPEC.md) - 技術仕様書・AWS CDK構成

### 🧪 品質・テスト
- [**TEST_SPEC.md**](./TEST_SPEC.md) - テスト仕様書・品質保証観点

### 📅 開発・チーム
- [**DEVELOPMENT_ROADMAP.md**](./DEVELOPMENT_ROADMAP.md) - 開発ロードマップ・7ヶ月計画
- [**DEVELOPMENT_GUIDELINES.md**](./DEVELOPMENT_GUIDELINES.md) - チーム協働・ブランチ戦略・品質ガードレール

## 🏗️ アーキテクチャ概要

```
Frontend (Next.js)     Backend (AWS Lambda)     AI Services
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ React + TypeScript │  │ Node.js + TypeScript │  │ OpenAI API      │
│ Tailwind CSS       │  │ DynamoDB           │  │ Anthropic Claude │
│ Zustand           │◄──┤ API Gateway        │  │ Web Speech API  │
│ PWA               │  │ Cognito Auth       │  │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │
         └──────── CloudFront + S3 ──────────┘
```

## 👥 チーム構成・責務

| 役割 | 主な責務 |
|------|----------|
| 🏗️ **Lead Engineer** | AWS CDK、API設計、AI統合、アーキテクチャ決定 |
| 🎨 **Frontend Engineer** | React/Next.js、UI実装、PWA、状態管理 |
| 🎯 **UI/UX Designer** | デザインシステム、ユーザーフロー、ビジュアルデザイン |
| 🔍 **QA Engineer** | テスト戦略、自動化、品質管理、リリース判定 |

## 🚀 開発フェーズ

### Phase 1: MVP開発 (3ヶ月)
- 基本的なAI対話機能
- 30分セッション管理
- ユーザー認証・プロフィール
- 学習履歴基本機能

### Phase 2: 機能拡張 (2ヶ月)  
- 音声入出力機能
- PWA対応（オフライン利用）
- パーソナライズ機能
- 高度な学習管理

### Phase 3: 品質向上・リリース (2ヶ月)
- 品質・パフォーマンス最適化
- 包括的テスト完了
- 運用体制確立
- 本番リリース

## 🎯 成功指標

### プロダクトKPI
- **ユーザー継続率**: 7日60%以上、30日40%以上
- **セッション完了率**: 80%以上
- **ユーザー満足度**: NPS 4.0/5.0以上

### 技術KPI
- **システム稼働率**: 99.9%以上
- **応答時間**: P99で5秒以内
- **テストカバレッジ**: 80%以上

## 🔄 開発プロセス

### ブランチ戦略
```
main (production)
├── develop (integration)
│   ├── feature/backend/ai-integration
│   ├── feature/frontend/chat-ui
│   ├── feature/qa/e2e-tests
│   └── feature/design/component-system
```

### 並行開発ルール
- **API契約管理**: Lead Engineer が仕様策定、変更時は全員合意
- **デザインシステム**: Designer + Frontend Engineer で共同管理
- **品質ガードレール**: CI/CDで自動チェック、QA Engineer が基準管理
- **同期ポイント**: 週次進捗共有、機能完成時の統合テスト

## 🛡️ 品質ガードレール

### 必須通過条件
- ✅ 単体テスト 80%以上
- ✅ セキュリティスキャンクリア
- ✅ コードレビュー 2名以上承認
- ✅ 型チェック・Lintエラー 0

### 継続的品質改善
- 週次: 自動テスト結果レビュー
- 隔週: コードレビュー・リファクタリング
- 月次: パフォーマンス・セキュリティ監査

---

**詳細な開発ルール・ガイドラインは [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) を参照してください。**