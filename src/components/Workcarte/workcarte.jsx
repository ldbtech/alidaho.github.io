import React from "react";
import Contact from '../../assets/contact.png';
import './workcarte.css';
const WorkCarte = () => {
    return (
        <div className="workCartes">
            <div className="workCarte">
                <h2>Cluster Images</h2>
                <img src="" alt="Worl Image" className="worksImg" />
                <div className="workTextBtn">
                    <p>I've delved into intriguing machine learning projects. My work includes an emotion
                        recognizer from faces, another from spoken words, an English to French translator,
                        and a tool that checks
                        receipt authenticity through text analysis. Explore more details by clicking below.
                    </p>
                    <div className="buttonContainer">
                        <button className="desktopMenuButton">
                            <div className="buttonContents">
                                <img src={Contact} alt="desktop Image Menu Button" className="deskopMenuButtonImage" />
                                <span className="contactMe">Github</span>
                            </div>
                        </button>
                        <button className="desktopMenuButton">
                            <div className="buttonContents">
                                <img src={Contact} alt="desktop Image Menu Button" className="deskopMenuButtonImage" />
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