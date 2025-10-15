# Language Configuration

This application supports dynamic language selection with automatic dropdown display based on the number of available languages.

## How It Works

### Single Language (No Dropdown)
When only one language is configured in `demo-config.ts`, the language selector dropdown is automatically hidden.

```typescript
export const availableLanguages = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    code: 'en'
  }
};
```

### Multiple Languages (Dropdown Shown)
When multiple languages are configured, a dropdown selector appears in the top-right corner of all pages.

```typescript
export const availableLanguages = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    code: 'en'
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    code: 'es'
  },
  fr: {
    name: 'Français',
    flag: '🇫🇷',
    code: 'fr'
  }
};
```

## Adding New Languages

1. **Add to `availableLanguages` object:**
   ```typescript
   de: {
     name: 'Deutsch',
     flag: '🇩🇪',
     code: 'de'
   }
   ```

2. **Update the `SupportedLanguage` type:**
   ```typescript
   export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de';
   ```

3. **Add language-specific system prompts (optional):**
   ```typescript
   export function getSystemPromptForLanguage(language: SupportedLanguage, useCase: string): string {
     switch (useCase) {
       case 'airline':
         return language === 'de' ? getGermanAirlinePrompt() : getAirlineSystemPrompt();
       // ... other cases
     }
   }
   ```

## Language Selector Component

The `LanguageSelector` component automatically:
- Hides when only one language is available
- Shows a dropdown with flag emojis and language names
- Updates the application language when changed
- Is positioned in the top-right corner of all pages

## Current Implementation

- **Home Page**: Language selector in top-right corner
- **Use Case Pages**: Language selector in top-right corner
- **Automatic Detection**: Dropdown only appears when multiple languages are configured
- **State Management**: Language selection is maintained per page session

## Future Enhancements

- Persist language selection across sessions
- Add language-specific system prompts
- Support for RTL languages
- Language-specific voice configurations
