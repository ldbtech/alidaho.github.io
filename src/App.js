import './App.css';
import Navbar from './components/NavBar/navbar';
import Intro from './components/Intro/intro';
import Skills from './components/Skills/skills';
import Work from './components/Work/work';
import Contact from './components/Footer/Contact/contact';
import Footer from './components/Footer/footer';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <Intro />
        <Skills />
        <Work />
        <Contact />
        <Footer />
      </header>
    </div>
  );
}

export default App;
