import React from "react";
import Navbar from './components/NavBar/navbar';
import Intro from './components/Intro/intro';
import Skills from './components/Skills/skills';
import Work from './components/Work/work';

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Intro />
      <Skills />
      <Work />
    </div>
  );
}

export default App;
