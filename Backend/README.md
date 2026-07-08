# Shopping List Backend Context

Dieses Backend gehoert zur Gruppenarbeit2 Shopping-List-App. Es soll mit
Express, TypeScript, MongoDB/Mongoose und Clerk aufgebaut werden.

Diese Datei dient auch als Kontext fuer neue Codex-Chats: Bitte zuerst diese
README lesen, bevor am Backend weitergearbeitet wird.

## Aktueller Stand

Das Backend ist bereits grundlegend vorbereitet:

- Express 5
- TypeScript
- tsx fuer Development
- dotenv fuer Environment Variables
- cors
- mongoose
- @clerk/express
- zentrale Settings in `src/config/settings.ts`
- MongoDB-Verbindung in `src/db.ts`
- zentraler Server-Einstieg in `src/index.ts`
- eigenes Error-Handling unter `src/lib/error-handling`

Wichtige Dateien:

```txt
Backend/
|-- .env
|-- package.json
|-- tsconfig.json
`-- src/
    |-- index.ts
    |-- db.ts
    |-- config/
    |   `-- settings.ts
    `-- lib/
        `-- error-handling/
            |-- createAnswer.ts
            |-- createError.ts
            `-- types/
                `-- error.types.ts
```

## Environment

Lokale MongoDB-Datenbank:

```env
PORT=3000
BASE_URL=/api
MONGODB_URL=mongodb://localhost:27017/shopping-list-db
CLERK_SECRET_KEY=...
```

Die Datenbank heisst aktuell `shopping-list-db`.

## Scripts

```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

Start im Development:

```bash
cd Backend
npm run dev
```

## Architektur-Ziel

Das Backend soll feature-basiert wachsen. Bewaehrtes Pattern aus den frueheren
Backend-Projekten:

```txt
src/
|-- config/
|   `-- settings.ts
|-- features/
|   `-- shopping-lists/
|       |-- shoppingList.model.ts
|       |-- shoppingList.controller.ts
|       |-- shoppingList.routes.ts
|       `-- shoppingList.zodSchema.ts
|-- lib/
|   `-- error-handling/
|-- middlewares/
|   `-- requireAuth.ts
|-- db.ts
`-- index.ts
```

Routes bleiben schlank. Controller enthalten die Request-Logik. Models enthalten
Mongoose-Schemas. Validierung kann spaeter mit Zod in eigene Schema-Dateien
ausgelagert werden.

## Bestes Referenzprojekt

Aus der Analyse frueherer Projekte ist das beste Vorbild:

```txt
C:\Web Dev\Backend_API_Codex\backend-api-codex\backend
```

Besonders gute Patterns daraus:

- eigene Route-Datei pro Feature
- `requireAuth` Middleware fuer Clerk
- User-ID einmal aus Clerk lesen und an `req` haengen
- alle privaten MongoDB-Queries mit `userId` filtern
- Mongoose-Schemas mit `timestamps`, `index`, `default`, `enum` und Validatoren
- zentrale Fehlerantworten ueber `createError` und `createAnswer`

Das YuGiOhDex-Backend ist ein gutes einfaches Vorbild fuer:

- `connectMongoDB()`
- Feature-Ordner
- Controller mit `RequestHandler`
- `createAnswer(status, message, data)`
- `next(createError(...))`

## API-Ziel fuer Shopping Lists

Geplante Endpunkte:

```txt
GET    /api/lists
POST   /api/lists
GET    /api/lists/:listId
PATCH  /api/lists/:listId
DELETE /api/lists/:listId

POST   /api/lists/:listId/items
PATCH  /api/lists/:listId/items/:itemId
DELETE /api/lists/:listId/items/:itemId
```

Alle diese Endpunkte sollen geschuetzt sein, sobald Clerk eingebunden ist.

## Clerk-Regel

Das Frontend darf niemals selbst entscheiden, wem eine Liste gehoert.

Richtig:

- Backend liest die User-ID aus Clerk.
- Backend speichert diese User-ID als `userId`.
- Backend filtert jede private Query mit dieser `userId`.

Falsch:

- `userId` aus `req.body` akzeptieren
- Listen nur anhand von `_id` aktualisieren oder loeschen
- Daten anderer User ohne User-Filter suchen

Gutes Pattern:

```ts
const list = await ShoppingListModel.findOne({
  _id: listId,
  userId: authUserId,
});
```

Nicht so:

```ts
const list = await ShoppingListModel.findById(listId);
```

## Empfohlene Auth-Middleware

Aus dem Habit-Backend uebernehmen:

```ts
import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { createError } from "../lib/error-handling/createError";

export type TAuthenticatedRequest = Request & {
  authUserId: string;
};

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(createError(401, "Unauthorized"));
  }

  (req as TAuthenticatedRequest).authUserId = userId;
  return next();
};
```

Danach koennen Controller die User-ID so lesen:

```ts
const authUserId = (req as TAuthenticatedRequest).authUserId;
```

## Empfohlenes Mongoose-Model

Startpunkt fuer `shoppingList.model.ts`:

```ts
import { HydratedDocument, model, Schema } from "mongoose";

export type TShoppingListItem = {
  name: string;
  quantity: number;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TShoppingList = {
  userId: string;
  title: string;
  items: TShoppingListItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type TShoppingListDocument = HydratedDocument<TShoppingList>;

const shoppingListItemSchema = new Schema<TShoppingListItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    checked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const shoppingListSchema = new Schema<TShoppingList>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    items: {
      type: [shoppingListItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

shoppingListSchema.index({ userId: 1, createdAt: -1 });

export const ShoppingListModel = model<TShoppingList>(
  "ShoppingList",
  shoppingListSchema,
);
```

## Controller-Regeln

Controller sollen:

- `try/catch` verwenden
- Fehler mit `next(createError(...))` weitergeben
- erfolgreiche Antworten mit `createAnswer(...)` senden
- private Daten immer mit `userId` filtern
- bei IDs zuerst `isValidObjectId` pruefen
- bei Updates `{ returnDocument: "after", runValidators: true }` setzen

Beispiel:

```ts
const updatedList = await ShoppingListModel.findOneAndUpdate(
  { _id: listId, userId: authUserId },
  updateData,
  { returnDocument: "after", runValidators: true },
);
```

## MongoDB-Regeln

Aktuelles Pattern ist gut fuer den Start:

```ts
await mongoose.connect(settings.MONGODB_URL);
```

Wichtig:

- Server startet erst nach erfolgreicher DB-Verbindung.
- Fehlende `MONGODB_URL` soll einen klaren Fehler werfen.
- Fuer dieses Lernprojekt reicht die einfache Verbindung erstmal aus.
- Reconnect-Logik kann spaeter ergaenzt werden.

## Response-Format

Das vorhandene Error-Handling soll weiterverwendet werden:

```ts
createAnswer(status, message, data)
createError(status, message)
```

Damit bleiben erfolgreiche und fehlerhafte Antworten im Backend einheitlich.

## Naechste sinnvolle Schritte

1. `middlewares/requireAuth.ts` anlegen.
2. `features/shopping-lists/` anlegen.
3. `shoppingList.model.ts` erstellen.
4. `shoppingList.routes.ts` mit geschuetzten CRUD-Routen erstellen.
5. `shoppingList.controller.ts` mit User-Scoped Queries erstellen.
6. Router in `index.ts` unter `${BASE_URL}/lists` registrieren.
7. Build pruefen mit `npm run build`.

## Wichtig fuer Codex

Bitte in diesem Projekt lernfreundlich arbeiten:

- Erst bestehende Struktur lesen.
- Keine unnoetigen Refactors.
- Bestehende Patterns verwenden.
- Kleine, nachvollziehbare Schritte.
- Bei Backend-Features nach Moeglichkeit Build ausfuehren.
- Clerk-geschuetzte Daten immer ueber `authUserId` absichern.
