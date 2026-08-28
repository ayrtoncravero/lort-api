# LORT API

The Lord of the Rings API — a REST API to query information about the LOTR universe: characters, movies, books, quotes, places, races, and the Ainur (Valar/Maiar).

A developer-friendly, fan-built API concept for exploring characters, places and stories from Middle-earth. Not affiliated with the Tolkien Estate or any studio.

## Status

V1 — frozen. All resources below are implemented against static, versioned JSON datasets with entity-level provenance tracking. No database yet, no write endpoints, no map/coordinates data, no sorting.

## Stack

- NestJS + TypeScript
- pnpm
- class-validator / class-transformer
- Swagger / OpenAPI
- Jest
- ESLint / Prettier

Data source: static JSON files under `data/` (no database yet). The architecture is designed so JSON repositories can be swapped for database repositories later without touching controllers or services.

## Architecture

Three layers per domain module:

```
Presentation (controllers, DTOs)
        ↓
Application (services, business logic)
        ↓
Data (repository interfaces, JSON/DB implementations)
```

Services depend on repository interfaces, never on concrete implementations — NestJS DI resolves the binding. Every domain module (`characters`, `movies`, `books`, `quotes`, `places`, `races`, `ainur`) follows this same Controller → Service → Repository interface → JSON repository → `JsonDataLoader` layering.

## Project structure

```
src/
├── main.ts                # bootstrap only, no business logic
├── app.module.ts
├── common/                 # filters, interceptors, pipes, decorators, shared DTOs
├── config/                 # environment configuration
├── infrastructure/json/    # reusable JSON data loader
├── tools/dataset-validation/ # pure-function dataset validator (see below)
└── modules/
    ├── health/       # GET /api/health
    ├── characters/   # GET /api/characters, GET /api/characters/:id
    ├── movies/       # GET /api/movies, GET /api/movies/:id
    ├── books/        # GET /api/books, GET /api/books/:id
    ├── quotes/       # GET /api/quotes, GET /api/quotes/:id
    ├── places/       # GET /api/places, GET /api/places/:id
    ├── races/        # GET /api/races, GET /api/races/:id
    └── ainur/        # GET /api/ainur, GET /api/ainur/:id
```

## Requirements

- Node.js (LTS)
- pnpm

## Install

All commands below run from this directory (`lort-api/`).

```bash
cd lort-api
pnpm install
```

## Environment variables

Copy `.env.example` to `.env` (optional — defaults work for local development):

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port the server listens on |
| `NODE_ENV` | `development` | Standard Node environment flag |
| `CORS_ORIGIN` | `*` | CORS allowed origin. Wildcard is fine for local dev; set to the real frontend origin in production |

## Development

```bash
pnpm run start:dev   # watch mode
pnpm run start       # normal
```

## Build

```bash
pnpm run build
pnpm run start:prod
```

## Scripts

```bash
pnpm run lint          # eslint check only (no mutation)
pnpm run lint:fix      # eslint --fix
pnpm run format        # prettier --write
pnpm run test          # unit tests (jest)
pnpm run test:e2e      # end-to-end tests (jest, real HTTP requests)
pnpm run test:cov      # unit tests with coverage
pnpm run validate:data # validate every dataset in data/ against schema rules
```

## Resources (current, V1)

| Resource | Count | Example |
|---|---|---|
| Characters | 50 | `GET /api/characters`, `GET /api/characters/1` |
| Movies | 6 | `GET /api/movies`, `GET /api/movies/1` |
| Books | 5 | `GET /api/books`, `GET /api/books/1` |
| Quotes | 8 | `GET /api/quotes`, `GET /api/quotes/1` |
| Places | 41 | `GET /api/places`, `GET /api/places/1` |
| Races | 19 | `GET /api/races`, `GET /api/races/1` |
| Ainur | 23 | `GET /api/ainur`, `GET /api/ainur/1` |
| Health | — | `GET /api/health` |

All list endpoints share the same pagination envelope:

```json
{ "data": [], "page": 1, "limit": 20, "total": 0 }
```

Filters vary per resource (see Swagger for the authoritative, current list) — e.g. `characters` supports `name`/`race`/`gender`, `places`/`races` support `name`/`type`, `ainur` supports `name`/`type`/`characterId`, `quotes` supports `movieId`/`characterId`.

Detail endpoints (`GET /:id`) accept a positive integer id only; a non-numeric or non-positive id returns `400`, a missing id returns `404`.

Relational fields (`Place.parentId`, `Race.parentId`, `Ainur.characterId`, `Quote.characterId`/`movieId`) are returned as plain scalars (`number | null`) — never resolved into nested objects — except where a resource's own contract explicitly documents nested summaries (see Swagger for `quotes`).

`Ainur.characterId` links an Ainur row (e.g. Gandalf) to its existing Character record with zero duplicated fields; it is `null` when no Character exists for that Ainur (e.g. Manwë).

Error responses always have the shape:

```json
{ "statusCode": 404, "message": ["..."], "error": "Not Found", "path": "/api/...", "timestamp": "..." }
```

`message` is always a `string[]`, even for a single error.

## Swagger

Available at `/api/docs` while the server is running (`/api/docs-json` for the raw OpenAPI document).

## Dataset & provenance

Each dataset lives in `data/*.json` as a flat array of records with sequential positive-integer ids. Datasets were built in stages (research → schema review → provenance → final insertion), documented under `docs/*-DATASET-001.md` per resource.

Internal, non-public sourcing metadata for each entity is tracked in `provenance/*.sources.json` (source name, URL, confidence level, `entityIdStatus`). This is repository-internal bookkeeping — it is never exposed via the API, Swagger, or DTOs.

## Validation

`src/tools/dataset-validation/validate-dataset.ts` is a pure-function validator (id uniqueness/positivity, required fields, nullable-field shape, URL structure, parent-hierarchy self-reference/cycle/orphan checks, cross-resource reference checks such as `Ainur.characterId` → `Characters`, duplicate-name warnings) wrapped by a CLI (`scripts/validate-dataset.ts`). Run it with:

```bash
pnpm run validate:data
```

## Data & legal notes

- All datasets are structured/factual (names, classifications, numeric ids, relations) — no copied narrative prose or descriptions are stored.
- `data/quotes.json` contains a small set (8) of verbatim in-universe quotes. Expanding this dataset requires legal review before more verbatim text is added; this is a factual note about the dataset, not legal advice.
- Dataset sources/provenance are documented under `provenance/*.sources.json` per resource.
- The MIT license below covers this project's original source code only — it does not transfer any rights over the Tolkien-related material (names, characters, places, quotes, books, movies) referenced in the datasets.

## Disclaimer

LORT is an **unofficial, non-commercial fan project**. It is not affiliated with, endorsed by, or sponsored by the Tolkien Estate, Middle-earth Enterprises, Warner Bros., or any other rights holder connected to The Lord of the Rings. All Tolkien-related names, characters, places, quotations, books, and films remain the property of their respective rights holders. This project does not claim any legal authorization from those rights holders, and nothing here should be read as a fair-use determination or legal advice.

## License

The original source code of this project is licensed under the [MIT License](./LICENSE) — see `LICENSE`. `package.json`'s `license` field has been updated to `MIT` to match.

The MIT License applies to LORT's original code, configuration, and documentation only. It does not license or grant rights to any third-party intellectual property (Tolkien-related characters, names, places, quotations, books, or movies) referenced in this project's datasets — see "Data & legal notes" and "Disclaimer" above.

## Related project

`lort-app` — a Vue 3 / Vuetify frontend that consumes this API (separate repository/directory, not covered by this README).
