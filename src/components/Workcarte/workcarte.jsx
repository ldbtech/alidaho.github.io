import React from "react";
import GitHub from '../../assets/github.png';
import TestIt from '../../assets/testit.png';
import { Link } from "react-router-dom"; // Import Link from React Router

import './workcarte.css';
const WorkCarte = ({ project }) => {
    return (
        <div className="workCartes">
            <div id="workCarte">
                <h2 className="workTitle">
                    <Link to={`/work/${project.id}`}>{project.title}</Link>
                </h2>
                <img src={project.picture} alt="Work" className="worksImg" />
                <div className="workDesc">
                    <p>{project.description}
                    </p>
                    <div className="buttonContainer">
                        <button className="buttonWorkCarte">
                            <div className="buttonContents">
                                <a href={project.GitHub} target="_blank" rel="noopener noreferrer">
                                    <img src={GitHub} alt="desktop Menu" className="deskopMenuButtonImage" />
                                    <span className="contactMe">Github</span>
                                </a>
                            </div>
                        </button>

                        <button className="buttonWorkCarte">
                            <div className="buttonContents">
                                <img src={TestIt} alt="desktop Menu" className="deskopMenuButtonImage" />
                                <span className="contactMe">Try it yourself</span>
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default WorkCarte;