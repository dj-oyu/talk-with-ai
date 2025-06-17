# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Talk with AI is a Japanese AI-powered learning application for technical professionals. The app features an AI character named "Ai" (アイ) who acts as a friendly, impatient junior colleague helping users learn programming concepts during commute time through 30-minute focused sessions.

**Current Status**: This repository contains comprehensive planning documentation but no implementation code yet. The project is in the pre-development documentation phase.

## Architecture & Technology Stack

### Planned Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **PWA**: Offline learning capabilities
- **Voice**: Web Speech API for input/output

### Planned Backend
- **Runtime**: AWS Lambda (Node.js 18+)
- **API**: API Gateway with REST and WebSocket
- **Database**: DynamoDB with GSI for email lookups
- **Authentication**: AWS Cognito with JWT tokens

### Planned Infrastructure
- **IaC**: AWS CDK with TypeScript
- **Hosting**: CloudFront + S3 for static assets
- **Monitoring**: CloudWatch with custom metrics
- **Domain**: Route 53 for DNS

### AI Integration
- **Primary**: OpenAI API (GPT-4 Turbo)
- **Secondary**: Anthropic Claude API
- **Features**: Streaming responses, character personality prompts, learning context

## Team Structure & Responsibilities

When this project moves to implementation, the team roles will be:

- **Lead Engineer**: AWS CDK, API design, AI integration, architecture decisions
- **Frontend Engineer**: React/Next.js, UI components, state management, PWA
- **UI/UX Designer**: Design system, wireframes, user flows, visual design  
- **QA Engineer**: Test strategy, automation, quality gates, release criteria

## Branch Strategy

The project will use Git Flow:
```
main (production)
├── develop (integration)
│   ├── feature/{role}/{feature-name}
│   ├── bugfix/{role}/{bug-description}
│   └── chore/{role}/{task-description}
├── release/v{version}
└── hotfix/{priority}/{issue-description}
```

## Quality Gates

Before any code can be merged to main:
- Unit test coverage ≥80%
- TypeScript strict mode with 0 errors
- ESLint with 0 errors, ≤10 warnings
- Security scan clear (Snyk)
- 2+ code review approvals

## Development Commands

*Note: No implementation exists yet. When code is added, this section should include:*
- Build commands (likely `npm run build`)
- Test commands (`npm test`, `npm run test:e2e`) 
- Lint commands (`npm run lint`, `npm run typecheck`)
- Development server (`npm run dev`)
- Deployment commands for CDK stacks

## Character Design Requirements

The AI character "Ai" has specific personality traits that must be maintained:
- **Relationship**: Friendly junior colleague
- **Speech**: Polite Japanese with occasional casual slip-ups
- **Personality**: Impatient about time, motivational, technically passionate
- **Context Awareness**: 30-minute session limits, user's experience level, current topic

## API Design Principles

All APIs should follow these contracts defined in TECHNICAL_SPEC.md:
- RESTful design with clear resource naming
- JWT authentication for protected endpoints
- Streaming support for AI chat responses
- Error responses in standardized format
- OpenAPI 3.0 documentation

## Data Model Key Points

- **DynamoDB Single Table Design**: PK/SK pattern with GSI for secondary access
- **User Data**: Profile, learning progress, session history
- **Sessions**: 30-minute learning sessions with completion tracking
- **Messages**: Chat history with AI response metadata
- **Progress**: Topic-based learning advancement with spaced repetition

## Security Requirements

- Input validation using Zod schemas
- Authentication required for all user-specific endpoints
- Data encryption for sensitive information
- No API keys or secrets in code/commits
- CORS configuration for frontend origins

## Monitoring & Observability

The system should track:
- API response times (P99 < 5 seconds)
- AI token usage and costs
- User session completion rates
- Error rates and types
- Learning comprehension scores

## File Organization

When implementation begins, follow this structure from TECHNICAL_SPEC.md:
```
frontend/src/
├── app/          # Next.js App Router pages
├── components/   # Reusable UI components
├── lib/          # Utilities and helpers
├── store/        # Zustand state management
├── types/        # TypeScript definitions
└── hooks/        # Custom React hooks

backend/src/
├── functions/    # Lambda function handlers
├── lib/          # Shared utilities
├── types/        # Shared type definitions
└── schemas/      # Validation schemas

infrastructure/
├── lib/          # CDK stack definitions
└── bin/          # CDK app entry points
```

## Learning Session Design

Each 30-minute session should:
1. Start with user context (previous learning, current goals)
2. Provide structured learning content
3. Include comprehension checks
4. End with summary and next session preview
5. Track progress and satisfaction metrics