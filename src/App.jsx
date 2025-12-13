import { TimeProvider } from './context/TimeContext';
import EntryForm from './components/EntryForm';
import Dashboard from './components/Dashboard';
import UserSelector from './components/UserSelector';

function App() {
  return (
    <TimeProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>TA Tracker</h1>
          <p>Team Activity & Time Logger</p>
        </header>
        
        <main className="main-content">
          <div className="left-panel">
            <UserSelector />
            <EntryForm />
          </div>
          <div className="right-panel">
            <Dashboard />
          </div>
        </main>
      </div>
    </TimeProvider>
  );
}

export default App;
