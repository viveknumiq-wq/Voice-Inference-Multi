# Voice AI Demo - Use Cases

This application now supports multiple AI voice assistant use cases through a dynamic routing system. Each use case has its own configuration, system prompt, and voice settings.

## Available Use Cases

### 1. Airline (Default)
- **Route:** `/airline`
- **Title:** SKYCONNECT AIRLINES DEMO
- **Voice:** Maansvi
- **Description:** Flight booking and customer support for airline services
- **Features:** Flight search, booking confirmation, baggage information, meal preferences

### 2. Finance
- **Route:** `/finance`
- **Title:** WEALTHWISE FINANCIAL SERVICES DEMO
- **Voice:** Alex
- **Description:** Financial advisory and investment planning
- **Features:** Investment advice, retirement planning, portfolio recommendations

### 3. Education
- **Route:** `/education`
- **Title:** EDUCONNECT EDUCATIONAL CONSULTANT DEMO
- **Voice:** Dr. Sarah
- **Description:** Educational guidance and career counseling
- **Features:** Course selection, admission guidance, career counseling

## How to Add New Use Cases

1. **Add System Prompt Function**
   ```typescript
   function getNewUseCaseSystemPrompt() {
     // Your system prompt here
   }
   ```

2. **Update the Switch Statement**
   ```typescript
   export function getSystemPromptForLanguage(language: SupportedLanguage, useCase: string): string {
     switch (useCase) {
       case 'airline':
         return getAirlineSystemPrompt();
       case 'finance':
         return getFinanceSystemPrompt();
       case 'education':
         return getEducationSystemPrompt();
       case 'newusecase': // Add your new case
         return getNewUseCaseSystemPrompt();
       default:
         return getAirlineSystemPrompt();
     }
   }
   ```

3. **Add to Use Cases Dictionary**
   ```typescript
   export const useCases = {
     // ... existing use cases
     newusecase: {
       title: "NEW USE CASE DEMO",
       overview: "Description of your new use case",
       route: "/newusecase",
       callConfig: {
         systemPrompt: getNewUseCaseSystemPrompt(),
         model: "fixie-ai/ultravox-70B",
         languageHint: "en",
         selectedTools: selectedTools,
         voice: "YourVoice",
         temperature: 0.4
       }
     }
   };
   ```

## File Structure

```
app/
├── page.tsx                    # Home page with use case selection
├── [useCase]/
│   └── page.tsx               # Dynamic page for each use case
├── components/
│   ├── Navigation.tsx         # Navigation component
│   └── ...                   # Other components
├── demo-config.ts            # Configuration for all use cases
└── layout.tsx               # Root layout with navigation
```

## Configuration

Each use case is configured in `demo-config.ts` with:
- **title:** Display name for the use case
- **overview:** Description shown on the home page
- **route:** URL path for the use case
- **callConfig:** Voice AI configuration including:
  - **systemPrompt:** The AI's behavior and knowledge
  - **voice:** Voice to use for the AI
  - **temperature:** AI response creativity (0.0-1.0)
  - **model:** AI model to use
  - **selectedTools:** Available tools for the AI

## Navigation

- **Home Page:** Shows all available use cases as cards
- **Navigation Bar:** Quick access to all use cases
- **Back Button:** Return to home from any use case page
- **Dynamic Routing:** Each use case has its own URL path

## Customization

You can easily customize:
- System prompts for different AI behaviors
- Voice settings for different personalities
- UI styling and branding
- Available tools and parameters
- Call flow and conversation patterns
