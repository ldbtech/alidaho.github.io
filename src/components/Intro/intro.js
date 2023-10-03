import React from "react";
import './intro.css';
import LinkedIn from '../../assets/LinkedIn.png';

const Intro = () => {
    return (
        <section id="intro">
            <div className="introContent">
                <span className="hello">Hello,</span>
                <span className="introText">I am <span className="introName">Ali Daho</span><br /> An Engineer</span>
                <p className="introParagraph">I am a skilled Software Engineer/AI engineer who is passionate  <br /> about contributing to solve a real world problems.</p>
                <button className="buttonWorkCarte">
                    <div className="buttonContents">
                        <a href="https://www.linkedin.com/in/alidaho/" target="_blank" rel="noopener noreferrer">
                            <img src={LinkedIn} alt="desktop Menu" className="deskopMenuButtonImage" />
                            <span className="LinkedIn">LinkedIn</span>
                        </a>
                    </div>
                </button>
            </div>
            <img src="" alt="Profile" className="bg" />
        </section>
    );
}

export default Intro;