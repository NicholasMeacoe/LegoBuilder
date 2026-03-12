# LegoBuilder AI - Project Context

## Project Overview
LegoBuilder AI is a web application designed to help LEGO enthusiasts identify their loose bricks from a photo and discover what they can build with their existing inventory. It leverages computer vision (intended via Brickognize) and a comprehensive LEGO database (Rebrickable) to provide build suggestions and step-by-step instructions.

### Core Technologies
*   **Framework:** Next.js 16 (App Router)
*   **Library:** React 19
*   **Styling:** Tailwind CSS 4
*   **Language:** TypeScript
*   **APIs (Planned/Mocked):** Brickognize (Piece Recognition), Rebrickable (Sets & MOC Database)

## Directory Structure
The project is organized into a `web` directory containing the Next.js application.

```text
/home/pi/source/LegoBuilder/
└── web/                   # Next.js Application
    ├── src/
    │   ├── app/           # App Router pages and layouts
    │   ├── components/    # Reusable UI components
    │   ├── types/         # TypeScript interfaces and types
    │   └── ...
    ├── public/            # Static assets
    ├── package.json       # Dependencies and scripts
    └── ...
```

## Building and Running
All commands should be run from the `web` directory.

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server at `http://localhost:3000` |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code quality issues |

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
