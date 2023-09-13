import React from "react";
import './intro.css';
import { Link } from "react-scroll";

const Intro = () => {
    return (
        <section id="intro">
            <div className="introContent">
                <span className="hello">Hello,</span>
                <span className="introText">I am <span className="introName">Ali Daho</span><br /> An Engineer</span>
                <p className="introParagraph">I am a skilled Software Engineer/AI engineer who is passionate  <br /> about contributing to solve a real world problems.</p>
                <Link to="/hire-me"><button id="btn"><img src="" alt="icon_hire_me" className="btnImage" />Hire me</button></Link>
            </div>
            <img src="" alt="An Profile Image" className="bg" />
        </section>
    );
}

export default Intro;