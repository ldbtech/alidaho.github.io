import React from "react";
import './work.css';
import WorkCarte from "../Workcarte/workcarte";
const Work = () => {
    return (
        <section id="works">
            <h2 className="workTitle">Projects</h2>
            <span className="workDesc">I take a pride in making most challenging projects in various areas.</span>
            <div className="workCarteContainer">
                <WorkCarte />
                <WorkCarte />
                <WorkCarte />
                <WorkCarte />
            </div>
        </section>
    )
}

export default Work;