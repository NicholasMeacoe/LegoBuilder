# LegoBuilder AI - Project Context

## Project Overview
LegoBuilder AI is a web application designed to help LEGO enthusiasts identify their loose bricks from a photo and discover what they can build with their existing inventory. It uses a **Hybrid Architecture**:
*   **Local SQLite Database:** Contains a mirrored copy of the official LEGO catalog (Sets, Parts, Themes, Inventories) for ultra-fast matching.
*   **External APIs:** 
    *   **Brickognize:** Used for piece recognition from images.
    *   **Rebrickable API:** Used for real-time MOC (My Own Creations) suggestions and high-resolution images.

### Core Technologies
*   **Framework:** Next.js 16 (App Router)
*   **Database:** SQLite 3 (with `sqlite` wrapper)
*   **Styling:** Tailwind CSS 4
*   **Recognition:** Brickognize API

## Directory Structure
The project is organized into a `web` directory containing the Next.js application.

```text
/home/pi/source/LegoBuilder/
└── web/                   # Next.js Application
    ├── data/              # Local SQLite database and raw data
    ├── scripts/           # Maintenance scripts (e.g., database sync)
    ├── src/
    │   ├── app/           # App Router pages and layouts
    │   ├── components/    # Reusable UI components
    │   ├── lib/           # API and Database logic
    │   ├── types/         # TypeScript interfaces and types
    │   └── ...
    └── ...
```

## Building and Running
All commands should be run from the `web` directory.

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server |
| `npx tsx scripts/import_rebrickable.ts` | Downloads and syncs the local SQLite database from Rebrickable |

## Database Maintenance
The local database (`web/data/rebrickable.db`) should be refreshed periodically to include new official LEGO sets. Run `npx tsx scripts/import_rebrickable.ts` to perform a full sync.

## Development Conventions
*   **State Management:** Currently managed via React `useState` in the main `Home` component for simplicity in this prototype phase.
*   **Components:** Modular UI components are located in `src/components`. Prefer functional components and Tailwind CSS for styling.
*   **Types:** Shared TypeScript interfaces are defined in `src/types/index.ts`.
*   **API Integration:** Recognition and build suggestion logic is currently mocked with `setTimeout` in `src/app/page.tsx`. Future development should migrate these to dedicated service files or Server Actions.
*   **Responsiveness:** The UI is designed to be mobile-first and responsive using Tailwind's grid and flexbox utilities.

## Usage
1.  **Add Pieces:** Use the `ImageUploader` to capture or upload a photo.
2.  **Inventory:** Review and adjust the detected pieces in the `InventoryList`.
3.  **Build:** Click "Find What to Build" to generate suggestions in the `BuildSuggestions` panel.
