# Room Editor

<div align="center">

![Room Editor](https://img.shields.io/badge/Room%20Editor-2.5D%20Room%20Editor-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF)
![Pixi.js](https://img.shields.io/badge/Pixi.js-8.14-F05A22)

**An interactive isometric room editor with drag-and-drop cube placement, customizable colors, and multi-room management**

</div>

---

## Overview

**Room Editor** is a modern, browser-based isometric room editor that combines simplicity with powerful editing capabilities. Create and customize isometric rooms with an intuitive drag-and-drop interface, real-time color customization, and comprehensive room management. Built with performance in mind using Pixi.js for rendering and Preact for a responsive UI.

### Key Highlights

- 🎨 **Visual Editor**: Intuitive drag-and-drop interface for placing and moving cubes
- 🖌️ **Color Customization**: Customize colors for tiles, walls, cubes, and avatar with a right-click color picker
- 🏠 **Multi-Room System**: Create, save, and manage multiple rooms with persistent storage
- 🎯 **Isometric Rendering**: Clean 2.5D isometric projection with depth sorting
- 🚶 **Avatar Navigation**: Click-to-move avatar with pathfinding
- 📐 **Room Layout Editor**: Grid-based room editor with customizable dimensions
- 🔍 **Camera Controls**: Zoom and pan controls for better navigation
- 💾 **Local Storage**: All rooms are saved locally in your browser

---

## Features

### Core Features

- **Isometric Rendering**: Clean 2.5D representation with proper depth sorting for rooms, walls, tiles, and objects
- **Drag-and-Drop Cubes**: Intuitively drag cubes around the room and stack them to create platforms
- **Avatar Movement**: Click anywhere on the screen to move your avatar with automatic pathfinding
- **Color Customization**: Right-click any face to open a color picker and customize:
  - Cube faces (top, left, right)
  - Tile surfaces and borders
  - Wall faces
  - Avatar faces
- **Room Management**: Create, rename, delete, and organize multiple rooms
- **Grid Editor**: Customize room dimensions, wall height, thickness, and visibility
- **Blueprint System**: Preview cube placement before dropping
- **Inventory System**: Manage cube sizes and placement options
- **Door Placement**: Set door positions for room connections

### Technical Features

- **Performance**: Optimized rendering with Pixi.js for smooth 60fps gameplay
- **Type Safety**: Full TypeScript support for better developer experience
- **Modern Stack**: Built with Vite, Preact, and Tailwind CSS
- **Responsive UI**: Clean, modern interface with Tailwind CSS styling
- **Local Storage**: Persistent data storage using browser localStorage

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (for local development)
- **npm** or **yarn** (package manager)
- A modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/room-editor.git
   cd room-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:8080`
   - The application will automatically open in your default browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

### Preview Production Build

```bash
npm run preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

This will build the project and deploy it to the `gh-pages` branch automatically.

---

## Usage

### Basic Controls

#### Avatar Movement
- **Click** anywhere on the screen to move your avatar to that position
- The avatar will automatically navigate around obstacles using pathfinding

#### Cube Placement
- **Drag** cubes to move them around the room
- **Stack** cubes on top of each other to create platforms
- **Right-click** a cube face to open the color picker
- Use the **Inventory** widget to select different cube sizes

#### Color Customization
- **Right-click** any face (cube, tile, wall, or avatar) to open the color menu
- Use the color picker to customize individual faces
- Tile and wall colors apply globally to all tiles/walls in the room

#### Room Editing
- Use the **Layout** widget to:
  - Edit room dimensions (grid size)
  - Adjust wall height and thickness
  - Toggle wall visibility
  - Set tile thickness
  - Place doors

#### Room Management
- Use the **Navigator** widget to:
  - Create new rooms
  - Rename existing rooms
  - Delete rooms
  - Switch between rooms

#### Camera Controls
- Use the **Zoom Controls** widget to zoom in/out
- **Pan** by dragging the canvas (if implemented)

### Widgets

The application includes several widgets accessible from the widget bar:

- **Navigator**: Room management and navigation
- **Inventory**: Cube size selection and placement
- **Layout**: Room grid and layout editing
- **Settings**: Application settings
- **Zoom Controls**: Camera zoom controls

---

## Project Structure

```
room-editor/
├── src/
│   ├── core/                 # Core game engine
│   │   ├── engine/          # Game engine and client
│   │   │   ├── game/        # Game client and scene management
│   │   │   └── pathfinding/ # Pathfinding algorithms
│   │   └── modules/         # Game modules
│   │       ├── avatar/      # Avatar movement and rendering
│   │       ├── cube/        # Cube entities and management
│   │       ├── tile/        # Tile system
│   │       └── wall/        # Wall system
│   ├── ui/                   # User interface
│   │   ├── components/      # Preact components
│   │   ├── hooks/           # Custom React hooks
│   │   └── store/           # State management
│   └── index.ts             # Application entry point
├── dist/                    # Build output
├── vite.config.ts          # Vite configuration
└── package.json            # Project dependencies
```

---

## Technology Stack

### Core Technologies

- **[Pixi.js](https://pixijs.com/)** - High-performance 2D WebGL renderer
- **[Preact](https://preactjs.com/)** - Fast, lightweight React alternative
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Key Libraries

- **@preact/signals** - Reactive state management
- **pixi-viewport** - Camera and viewport management
- **heap-js** - Pathfinding algorithm support
- **gh-pages** - GitHub Pages deployment

---

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Build and deploy to GitHub Pages
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Code Style

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking

---

## Deployment

### GitHub Pages

The project is configured for deployment to GitHub Pages using the `gh-pages` package. Simply run:

```bash
npm run deploy
```

This will:
1. Build the project for production
2. Deploy the `dist` directory to the `gh-pages` branch
3. Make the site available at `https://[username].github.io/room-editor/`

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting service


---


<div align="center">

**Made with ❤️**

⭐ Star this repo( if you find it helpful!

</div>
