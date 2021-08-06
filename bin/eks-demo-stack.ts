#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { JamStack } from '../lib/JamStack';

const app = new cdk.App();
new JamStack(app, 'JamStack', {});
