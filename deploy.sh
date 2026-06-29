#!/bin/bash
echo "=== Starting Vercel Deployment ===" >> /tmp/deploy-log.txt
date >> /tmp/deploy-log.txt
cd /home/team/shared/sparkstream
npx --yes vercel --version >> /tmp/deploy-log.txt 2>&1
echo "---" >> /tmp/deploy-log.txt
npx --yes vercel deploy --prod --yes --cwd /home/team/shared/sparkstream/frontend >> /tmp/deploy-log.txt 2>&1
echo "=== Done ===" >> /tmp/deploy-log.txt