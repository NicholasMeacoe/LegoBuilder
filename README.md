# LegoBuilder AI

LegoBuilder AI is a web application that helps LEGO enthusiasts identify their loose bricks from a photo and discover what they can build with their existing inventory. It uses a hybrid architecture combining a local SQLite database for ultra-fast official set matching and the Rebrickable API for fan-made MOC suggestions.

## Features

- **Lego Recognition**: Uses the Brickognize API to identify parts from photos.
- **Fast Build Suggestions**: Query over 1.4 million part relationships locally in milliseconds.
- **Hybrid Search**: Blends local results (official sets) with API results (MOCs).
- **Inventory Management**: Track and adjust your identified pieces.

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A Rebrickable API Key (Get one at [rebrickable.com/api/](https://rebrickable.com/api/))

### 2. Setup Environment

Create a `web/.env.local` file and add your API keys:

```text
REBRICKABLE_API_KEY=your_api_key_here
BRICKOGNIZE_API_URL=https://api.brickognize.com/predict/
```

### 3. Initialize/Update Local Database

The app relies on a local SQLite database for fast matching. To download the latest LEGO catalog and populate your database, run:

```bash
cd web
npx tsx scripts/import_rebrickable.ts
```

*Note: This script downloads ~200MB of compressed CSV data and expands it into a ~180MB SQLite database.*

### 4. Run the Application

Start the development server:

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `web/src/app`: Main pages and layouts (Next.js App Router).
- `web/src/components`: Reusable UI components.
- `web/src/lib/api.ts`: Server Actions for Brickognize and Rebrickable API calls.
- `web/src/lib/db.ts`: Local SQLite database query logic.
- `web/scripts/import_rebrickable.ts`: Data sync script for downloading Rebrickable catalog.
- `web/data`: (Git Ignored) Stores the local SQLite database.

## Learn More

To learn more about the project context and development conventions, see [GEMINI.md](./GEMINI.md).

## Disclaimer

LegoBuilder AI is a fan project and is not affiliated with the LEGO Group.
