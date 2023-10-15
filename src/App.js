import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar/navbar';
import Intro from './components/Intro/intro';
import Skills from './components/Skills/skills';
import Work from './components/Work/work';
import Contact from './components/Footer/Contact/contact';
import Footer from './components/Footer/footer';
import WorkingOn from './components/WorkingOn/workingon';
import { DataProvider } from './DataContext';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <Navbar />
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Intro />} />
            </Routes>
            <Routes>
              <Route path="/" element={<Skills />} exact />

            </Routes>
            <Routes>
              <Route path="/" element={<Work />} exact />

            </Routes>
          </main>
          <Routes>
            <Route path="/workingon" element={<WorkingOn />} exact /> {/* New route for detailed work post */}
          </Routes>

          <Contact />
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
