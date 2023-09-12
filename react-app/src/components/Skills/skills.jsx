import React from "react";
import './skills.css';
const Skills = () => {
    return (
        <section id="skills">
            <span className="skillTitle">What I do</span>
            <span className="skillDesc">I am skilled Software and AI engineer</span>
            <div className="skillBars">
                <div className="skillBar">
                    <img src="" alt="Web & App DEV" className="skillBarImg" />
                    <div className="skillBarText">
                        <h2>Web & App UI/UX | DEV</h2>
                        <p>This is a demo text</p>
                    </div>
                </div>
                <div className="skillBar">
                    <img src="" alt="Artificial Intelligence" className="skillBarImg" />
                    <div className="skillBarText">
                        <h2>Artificial Intelligence </h2>
                        <p>This is a demo text</p>
                    </div>
                </div>
                <div className="skillBar">
                    <img src="" alt="Data Engineering" className="skillBarImg" />
                    <div className="skillBarText">
                        <h2>Data Engineering</h2>
                        <p>This is a demo text</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Skills;