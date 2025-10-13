# nextjs-ts
Web demo using Next.js and TypeScript. Deploys to Vercel.

This was bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Set-up
1. Create a new file called `.env.local` and add your API key:
```bash
API_KEY=your_api_key_here
```

2. Configure settings, system prompt, etc in demo-config.ts
3. Install dependencies:
```bash
pnpm install
```
4. Run
```bash
pnpm dev
```
5. Navigate your browser to `http://localhost:3000` to use the application

## Deployment
To deploy to Vercel you will need to set an env var for the API_KEY

## Query Params
You can use some query parameters (e.g. `http://localhost:3000?showSpeakerMute=true` to enable different capabilities in the demo.

| What | Parameter | Notes |
|--------|--------|---------|
|**Debug Logging**|`showDebugMessages=true`| Turns on some additional console logging.|
|**Speaker Mute Toggle**|`showSpeakerMute=true`| Shows the speaker mute button.|
|**Change Model**|`model=70B`|Changes the model to what is specified. Note: the app will prepend `fixie-ai/` to the value.|
|**Enable User Transcripts**|`showUserTranscripts=true`|Displays user transcripts. Otherwise, only agent transcripts are shown.|
