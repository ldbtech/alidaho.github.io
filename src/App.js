import './App.css';
import Navbar from './components/NavBar/navbar';
import Intro from './components/Intro/intro';
import Skills from './components/Skills/skills';
import Work from './components/Work/work';
import WorkCarte from './components/Workcarte/workcarte';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <Intro />
        <Skills />
        <Work />
      </header>
    </div>
  );
}

export default App;
