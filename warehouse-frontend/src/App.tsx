import LayoutDesigner from './components/LayoutDesigner';
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Warehouse Management System</h1>
        <span className="version">v1.0.0</span>
      </header>
      <main>
        <LayoutDesigner />
      </main>
    </div>
  )
}

export default App
