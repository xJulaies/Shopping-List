# Shopping List App - Projektkontext

Diese Datei dient als kurzer Uebergabekontext fuer einen neuen Chat.

## Ziel

Die App ist eine Fullstack-Shopping-List-Anwendung mit Authentifizierung. Nutzer melden sich ueber Clerk an, erstellen Einkaufslisten und verwalten darin einzelne Eintraege.

## Projektstruktur

```txt
Gruppenarbeit2/
|-- Backend/
|   |-- src/
|   |   |-- config/settings.ts
|   |   |-- db.ts
|   |   |-- index.ts
|   |   |-- middlewares/
|   |   |-- lib/error-handling/
|   |   `-- features/
|   |       |-- shopping-lists/
|   |       `-- shopping-items/
|   `-- package.json
|-- Frontend/
|   `-- shopping-list/
|       |-- src/
|       |   |-- features/
|       |   |-- routes/
|       |   |-- shared/
|       |   |-- context/
|       |   |-- App.tsx
|       |   `-- main.tsx
`-- readme.md
```

## Tech Stack

Frontend:

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- DaisyUI
- Clerk React
- TanStack Router
- TanStack Query
- TanStack Form
- Zod
- Vitest

Backend:

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- Clerk Express
- Zod
- tsx

## Lokales Setup

Backend:

```bash
cd Backend
npm install
npm run dev
```

Frontend:

```bash
cd Frontend/shopping-list
npm install
npm run dev
```

Standard-Ports:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- API-Basis: `http://localhost:3000/api`

## Environment

Backend `.env`:

```env
PORT=3000
BASE_URL=/api
MONGODB_URL=mongodb://localhost:27017/shopping-list-db
CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=...
```

Wichtig: Clerk Secret Keys nie in Chats oder Commits posten.

## Backend-Architektur

Der Einstiegspunkt ist `Backend/src/index.ts`.

Aktuelle Routen:

- `GET /` Healthcheck
- `/api/lists`
- `/api/lists/:listId/items`

Die API ist listenbasiert. Items haengen immer an einer Liste:

```txt
GET    /api/lists
POST   /api/lists
GET    /api/lists/:listId
PATCH  /api/lists/:listId
DELETE /api/lists/:listId

GET    /api/lists/:listId/items
POST   /api/lists/:listId/items
GET    /api/lists/:listId/items/:itemId
PATCH  /api/lists/:listId/items/:itemId
DELETE /api/lists/:listId/items/:itemId
```

Auth:

- Clerk wird ueber `clerkMiddleware` eingebunden.
- `requireAuth.ts` nutzt modern `getAuth(req)`.
- Controller speichern und pruefen `userId`, damit Nutzer nur ihre eigenen Listen und Items sehen.

MongoDB:

- Verbindung in `Backend/src/db.ts`.
- Datenbank: `shopping-list-db`.
- Mongoose-Models liegen featurebasiert in `shopping-lists` und `shopping-items`.
- `shoppingItem.routes.ts` braucht `Router({ mergeParams: true })`, weil `listId` aus `/api/lists/:listId/items` kommt.

Error Handling:

- Fehler werden ueber `createError` erzeugt.
- Antworten laufen ueber `createAnswer`.
- Zentraler Error Handler sitzt in `index.ts`.

## Frontend-Architektur

Das Frontend ist featurebasiert aufgebaut.

Wichtige Bereiche:

- `features/auth`: Clerk Sign-in und Sign-up Pages.
- `features/dashboard`: Dashboard.
- `features/shopping-list`: Listen, Items, Services, Hooks, Schemas und Komponenten.
- `routes`: TanStack Router File Routes.
- `shared`: Wiederverwendbare UI-Komponenten.
- `context`: Theme und Listenpraeferenzen.

Routing:

- Oeffentliche Seiten: `/`, `/about`, `/sign-in`, `/sign-up`
- Geschuetzte Seiten liegen unter `_authenticated`
- Listenuebersicht: `/lists`
- Einzelne Liste: `/lists/$listId`
- Beispiel: `http://localhost:5173/lists/6a4e14a0666273139b012b61`

Clerk:

- `main.tsx` wrapped die App mit `ClerkProvider`.
- `App.tsx` wartet auf `auth.isLoaded`.
- Sign-in und Sign-up nutzen Clerk Components mit `routing="path"`.
- Splat-Routes fuer Clerk-Unterpfade existieren:
  - `routes/sign-in.$.tsx`
  - `routes/sign-up.$.tsx`

API-Anbindung:

- `listService.ts` ruft `/lists` auf.
- `itemService.ts` ruft `/lists/:listId/items` auf.
- Hooks holen Clerk Tokens ueber `getToken()` und senden `Authorization: Bearer <token>`.
- In Tests faellt der Item-Service auf `localStorage` und Mockdaten zurueck.

## Zuletzt wichtige Fixes

- Backend wurde auf die Frontend-API angepasst: Items sind jetzt list-scoped.
- Alte direkte `/api/items`-Nutzung wurde im Frontend durch `/api/lists/:listId/items` ersetzt.
- Clerk wurde von deprecated Varianten auf moderne Route-/Middleware-Nutzung umgestellt.
- 404 bei `/lists/:listId` war TanStack-Router/Dev-Server-Kontext; Route existiert dynamisch.
- Backend-404 bei Items lag an fehlendem `mergeParams: true` im Child Router.
- Umlaute im Frontend wurden korrigiert, statt `ae/oe/ue` werden echte Umlaute angezeigt.

## Pruefung

Frontend wurde zuletzt erfolgreich geprueft mit:

```bash
npm run test
npm run build
```

Fuer Backend nach Aenderungen nutzen:

```bash
cd Backend
npm run build
```

## Naechste sinnvolle Checks

- Backend mit `npm run build` pruefen.
- Frontend und Backend parallel starten.
- In MongoDB pruefen, ob Listen mit der richtigen Clerk `userId` gespeichert werden.
- Im Browser mit angemeldetem Clerk-User testen:
  - Liste erstellen
  - Liste oeffnen
  - Item erstellen
  - Item bearbeiten
  - Item loeschen
