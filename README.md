# Shopping List App

Eine Fullstack-App zum Erstellen und Verwalten von Einkaufslisten. Nutzer melden sich mit Clerk an, legen mehrere Listen an und pflegen darin Produkte mit Menge, Einheit, Kategorie, Status, Priorität, Laden und Preis.

## Was die App macht

Die App hilft dabei, Einkäufe strukturiert zu planen:

- Einkaufslisten erstellen, anzeigen und löschen
- Produkte innerhalb einer Liste erstellen, bearbeiten und löschen
- Produkte nach Kategorie gruppiert in einer großen Einkaufsliste anzeigen
- Produkte nach Suche, Status, Kategorie und Priorität filtern
- Status direkt per Badge umschalten: `offen` -> `im Warenkorb` -> `gekauft`
- Preise als Preis pro Einheit erfassen und automatisch mit der Menge verrechnen
- Gesamtpreis der angezeigten Liste berechnen
- Responsive Navigation mit mobilem Dropdown
- Theme-Wechsel zwischen hellem und dunklem DaisyUI-Theme

## Projektstruktur

```txt
Gruppenarbeit2/
|-- Backend/
|   |-- src/
|   |   |-- config/
|   |   |-- features/
|   |   |   |-- shopping-items/
|   |   |   `-- shopping-lists/
|   |   |-- lib/
|   |   |-- middlewares/
|   |   |-- db.ts
|   |   `-- index.ts
|   `-- package.json
|-- Frontend/
|   `-- shopping-list/
|       |-- src/
|       |   |-- context/
|       |   |-- features/
|       |   |   |-- auth/
|       |   |   |-- dashboard/
|       |   |   |-- home/
|       |   |   `-- shopping-list/
|       |   |-- routes/
|       |   |-- shared/
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

Backend starten:

```bash
cd Backend
npm install
npm run dev
```

Frontend starten:

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

Wichtig: Clerk Secret Keys und andere echte Zugangsdaten nicht committen oder teilen.

## Frontend

Das Frontend ist featurebasiert aufgebaut.

Wichtige Bereiche:

- `features/home`: Startseite und Hero-Bereich
- `features/auth`: Clerk Sign-in und Sign-up
- `features/dashboard`: Übersicht über Listen
- `features/shopping-list`: Listen, Produkte, Formulare, Hooks, Services, Schemas und Utilities
- `routes`: TanStack Router File Routes
- `shared`: Layout und wiederverwendbare Komponenten wie Navbar, Footer und Dialoge
- `context`: Theme und Listenpräferenzen

Wichtige Funktionen:

- Authentifizierte Bereiche liegen unter `_authenticated`
- Listenübersicht: `/lists`
- Einzelne Liste: `/lists/$listId`
- Produkt erstellen: `/lists/$listId/items/new`
- Produktdetails: `/lists/$listId/items/$itemId`
- Produkt bearbeiten: `/lists/$listId/items/$itemId/edit`
- Mobile Ansicht nutzt die Detailseite für Produkte
- Desktop Ansicht zeigt Bearbeiten- und Löschen-Buttons direkt in der Produktzeile
- Löschen nutzt einen DaisyUI/Tailwind-Dialog statt `window.confirm`

## Backend

Der Backend-Einstiegspunkt ist `Backend/src/index.ts`.

Routen:

```txt
GET    /

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

Backend-Eigenschaften:

- Clerk Auth wird serverseitig validiert.
- Controller speichern und prüfen `userId`, damit Nutzer nur eigene Daten sehen.
- Items sind immer listenbasiert und gehören zu einer `listId`.
- Request-Bodies werden mit Zod validiert.
- Mongoose-Models nutzen Enums für Kategorie, Status, Einheit, Priorität und Laden.
- Beim Löschen einer Liste werden die zugehörigen Produkte mit entfernt.
- Update-Endpunkte verwenden moderne Mongoose-Optionen wie `returnDocument: "after"`.

## Datenmodell Kurzüberblick

Eine Einkaufsliste besteht aus:

- `title`
- `description`
- `userId`
- `createdAt`
- `updatedAt`

Ein Produkt besteht aus:

- `title`
- `description`
- `category`
- `status`
- `quantity`
- `unit`
- `priority`
- `store`
- `price`
- `listId`
- `userId`

Unterstützte Einheiten:

- `Stück`
- `kg`
- `Liter`
- `Packung`

Der gespeicherte `price` ist der Preis pro Einheit. In der UI wird der Positionspreis als `price * quantity` angezeigt und für den Gesamtpreis verwendet.

## Validierung und Tests

Frontend:

```bash
cd Frontend/shopping-list
npm run lint
npm run build
npm test
```

Backend:

```bash
cd Backend
npm run build
```

## Typischer Testablauf im Browser

1. Frontend und Backend starten.
2. Mit Clerk anmelden.
3. Eine Einkaufsliste erstellen.
4. Ein Produkt hinzufügen.
5. Weitere Produkte direkt über den Plus-Button anlegen.
6. Status per Badge durchschalten.
7. Preis und Menge prüfen.
8. Produkt bearbeiten und über `Zurück zur Übersicht` zur Liste wechseln.
9. Produkt über den Dialog löschen.
10. Liste löschen und prüfen, dass zugehörige Produkte entfernt wurden.
