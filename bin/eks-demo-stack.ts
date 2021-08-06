#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { EksDemoStackStack } from '../lib/eks-demo-stack-stack';
import { JamStack } from '../lib/JamStack';

const app = new cdk.App();
new JamStack(app, 'JamStack', {});
