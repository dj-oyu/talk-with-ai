#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TalkWithAiStack } from '../lib/talk-with-ai-stack';

const app = new cdk.App();
new TalkWithAiStack(app, 'TalkWithAiStack');
