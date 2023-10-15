import React from "react";
import './intro.css';
import Working from '../../assets/working.png';
import { Link } from "react-router-dom"; // Import Link from React Router
import Profile from "../../assets/profile_.png";

const Intro = () => {
    return (
        <section id="intro">
            <div className="introContent">
                <span className="hello">Hello,</span>
                <span className="introText">I am <span className="introName">Ali Daho</span><br /> An Engineer</span>
                <p className="introParagraph">I am a skilled Software Engineer/AI engineer who is passionate  <br /> about contributing to solve a real world problems.</p>
                <button className="buttonWorkCarte">
                    <div className="buttonContents">
                        <Link to="/workingon/">
                            <img src={Working} alt="desktop Menu" className="deskopMenuButtonImage" />
                            <span className="LinkedIn">Working on</span>
                        </Link>
                    </div>
                </button>
            </div>
            <img src={Profile} alt="Profile" className="bg" />
        </section>
    );
}

export default Intro;