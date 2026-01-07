# Copilot Instructions - Controle Financeiro Pessoal

## Project Overview

**Controle Financeiro Pessoal** is a personal finance management web application built with vanilla JavaScript and Firebase authentication. The app tracks income (receita), expenses (despesa), and balance (saldo) with month filtering and data visualization.

### Architecture

- **Frontend**: HTML + CSS + Vanilla ES6 JavaScript (no frameworks)
- **Backend**: Firebase Authentication (email/password)
- **Module System**: ES6 modules with `type="module"`
- **Language**: Portuguese (pt-br)

## Key Components & Data Flow

### Authentication Flow (js/auth.js → js/app.js)

1. **index.html** - Login/Register entry point
2. **auth.js** - Handles sign-in/register via Firebase, redirects to app.html on success
3. **app.js** - Checks auth state on load; redirects to index.html if not authenticated
4. **firebase.js** - Centralized Firebase config and auth instance export

**Key Pattern**: Auth state changes trigger redirects. Use `onAuthStateChanged()` to guard page access.

### Firebase Configuration (js/firebase.js)

- **Note**: Config has duplicate `apiKey` field (line 5-6) - likely a setup error
- API keys are hardcoded (placeholder pattern: `"API_KEY_NOVA_AQUI"`)
- Project ID: `controle-financeiro-e7c6e`

## Code Conventions

### Imports
- Always use ES6 module syntax: `import { func } from "./firebase.js"`
- Firebase imports use full CDN paths: `https://www.gstatic.com/firebasejs/10.7.1/firebase-*.js`
- Version pinned to 10.7.1

### DOM Element Access
- Use `document.getElementById()` for element selection
- Assign to const variables: `const btnLogin = document.getElementById("btnLogin")`
- Attach handlers directly to `.onclick` properties (not `addEventListener`)

### Error Handling
- Firebase errors: `.catch(err => alert(err.message))` - basic alert pattern
- No try/catch blocks currently in use

### HTML Structure
- Single-language Portuguese (lang="pt-br")
- Minimal HTML - form inputs and buttons in index.html, simple logged-in state in app.html
- CSS custom properties for theming (see style.css `:root`)

## File Organization

```
js/
  firebase.js    - Firebase init + auth instance
  auth.js        - Login/register logic & auth guards
  app.js         - Post-login app logic & logout
css/
  style.css      - Styling with CSS variables (colors, layouts)
index.html       - Login page
app.html         - Main app page
```

## Styling & Colors

CSS variables defined (style.css `:root`):
- `--bg`: Dark background (#1e1e26)
- `--primary`: Accent color (#2c3e50)
- `--despesa`: Red for expenses (#eb4d4b)
- `--receita`: Green for income (#6ab04c)
- `--saldo`: Teal for balance (#22a6b3)

**Grid Layout**: Cards use CSS Grid (3-column for top cards, 1.5fr/1fr split for charts section)

## Development Notes

### Next Steps (Incomplete Features)
- Form section exists in CSS but likely incomplete functionality
- Chart rendering not yet implemented (CSS prepared)
- Expense/income data persistence not visible (likely needs backend)

### Testing Strategy
- Manual testing via browser navigation
- No automated tests in codebase
- Auth state transitions: login → app.html, logout/unauth → index.html

### Common Edits
- Adding transaction logic: Reference `js/app.js` pattern (import, query DOM, attach handlers)
- Styling changes: Update CSS variables for theme, or add selectors in `css/style.css`
- New Firebase features: Import from CDN URL matching version 10.7.1, export from `firebase.js`
