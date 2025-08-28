# Warehouse Management System - Layout Designer

A comprehensive warehouse management system with an interactive layout designer built with React, TypeScript, and modern UI components.

## 🏗️ Features

### Layout Designer Page
- **Interactive Design Tools**: Drag-and-drop interface for placing warehouse elements
- **Warehouse Canvas**: 15m × 10m warehouse with numbered zones (1-4) and grid system
- **Element Types**: Racks, Aisles, Conveyors, Workstations, Loading Docks, Offices

### Rack Configuration
- **Dynamic Parameters**: Configure bays, levels, slots per level
- **Physical Dimensions**: Set bay width, depth, and orientation
- **Real-time Calculations**: Automatic position calculation (total racks: 26, pallet positions: 390)
- **Visual Feedback**: Live preview of changes

### Design Validation
- **Safety Compliance**: Fork clearance requirements checking
- **Constraint Validation**: Automatic safety and operational constraint verification
- **Warning System**: Clear warnings for potential issues

### Simulation Handoff
- **Configuration Interface**: "⚙ Configure Simulation" button for seamless transition
- **Data Transfer**: Passes complete layout data to simulation engine
- **Digital Twin Ready**: Foundation for advanced simulation and optimization

## 🎨 Design System

- **Modern UI**: Clean, professional light theme with subtle shadows and gradients
- **Professional Typography**: Inter font family for optimal readability
- **Color Palette**: Blue-based primary colors (#3b82f6) with semantic color coding
- **Responsive**: Fully responsive design for desktop and tablet usage
- **Accessibility**: WCAG compliant with proper contrast ratios and keyboard navigation

## 🚀 Technology Stack

- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Lucide React** for modern, consistent iconography
- **CSS3** with custom properties and modern layout techniques
- **Node.js** for development tooling

## 📦 Installation & Setup

1. Navigate to the project directory:
   ```bash
   cd warehouse-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🏃‍♂️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
warehouse-frontend/
├── src/
│   ├── components/
│   │   ├── LayoutDesigner.tsx      # Main layout designer component
│   │   ├── Sidebar.tsx             # Design tools sidebar
│   │   ├── WarehouseCanvas.tsx     # Interactive canvas
│   │   ├── WarehouseGrid.tsx       # Grid system
│   │   ├── WarehouseElements.tsx   # Element rendering
│   │   ├── RackConfiguration.tsx   # Configuration panel
│   │   └── SimulationConfig.tsx    # Simulation setup
│   ├── types/
│   │   └── warehouse.ts            # TypeScript type definitions
│   ├── App.tsx                     # Main application component
│   ├── App.css                     # Application styles
│   ├── index.css                   # Global styles
│   └── main.tsx                    # Application entry point
├── public/                         # Static assets
├── package.json                    # Project configuration
└── README.md                       # Project documentation
```

## 🎯 Usage Guide

### 1. Design Tools
- Select tools from the left sidebar (Rack, Aisle, Conveyor, etc.)
- Click on the canvas to place elements
- Use the "Select" tool to move and configure existing elements

### 2. Element Configuration
- Click any placed element to open the configuration panel
- Adjust parameters like dimensions, position, and rotation
- View real-time summary calculations

### 3. Layout Validation
- Automatic validation runs as you design
- Warnings appear for clearance and safety issues
- Errors must be resolved before simulation

### 4. Simulation Transition
- Click "⚙ Configure Simulation" when layout is complete
- Configure simulation parameters
- Review layout summary and validation results
- Start simulation or generate blueprints

## 🔧 Customization

The system is built with extensibility in mind:

- **Element Types**: Add new warehouse element types in `types/warehouse.ts`
- **Validation Rules**: Extend validation logic in `SimulationConfig.tsx`
- **Styling**: Customize themes through CSS custom properties
- **Tools**: Add new design tools to the sidebar configuration

## 🎪 Demo Features

This is a demonstration interface showcasing:
- Modern React development patterns
- TypeScript type safety
- Professional UI design
- Interactive design workflows
- Validation and error handling

## 📝 License

This project is for demonstration purposes and showcases modern frontend development practices for warehouse management systems.
