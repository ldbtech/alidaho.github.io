import React from "react";
import Contact from '../../assets/contact.png';
import './workcarte.css';
const WorkCarte = ({ project }) => {
    return (
        <div className="workCartes">
            <div id="workCarte">
                <h2 className="workTitle">{project.title}</h2>
                <img src={project.picture} alt="Work" className="worksImg" />
                <div className="workDesc">
                    <p>{project.description}
                    </p>
                    <div className="buttonContainer">
                        <button className="desktopMenuButton">
                            <div className="buttonContents">
                                <a href={project.GitHub} target="_blank" rel="noopener noreferrer">
                                    <img src={Contact} alt="desktop Menu" className="deskopMenuButtonImage" />
                                    <span className="contactMe">Github</span>
                                </a>
                            </div>
                        </button>

                        <button className="desktopMenuButton">
                            <div className="buttonContents">
                                <img src={Contact} alt="desktop Menu" className="deskopMenuButtonImage" />
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