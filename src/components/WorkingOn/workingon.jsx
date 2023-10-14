import React, { useState, useEffect } from 'react';
import './workingon.css'; // Import your CSS file
import { FaGithub, FaHeart } from 'react-icons/fa'; // Import icons from react-icons library
import { ref, onValue } from "firebase/database";
import { database } from "../../Firebase";

function WorkingOn() {

    const [data, setData] = useState({
        GitHub: '',
        StartDate: '',
        description: '',
        likes: 0,
        picture: '',
        progress: 0,
        steps: [],
        title: '',
    });

    // Fetch data from Firebase and store it in the state
    useEffect(() => {
        const fetchData = async () => {
            const postRef = ref(database, 'CurrentWork');

            try {
                const snapshot = await onValue(postRef, (snapshot) => {
                    const dataVal = snapshot.val();
                    if (dataVal) {
                        setData(dataVal);
                    } else {
                        setData({
                            GitHub: '',
                            StartDate: '',
                            description: '',
                            likes: 0,
                            picture: '',
                            progress: 0,
                            steps: [],
                            title: '',
                        });
                    }
                });
            } catch (error) {
                console.error(`Error Fetching data ${error}`);
            }
        };

        fetchData();
    }, []); // Empty dependencies array to run once
    return (
        <div className="project-progress-container">

            <header className="article-header">
                <h1 className="article-title">{data.title}</h1>
                <div className="author-info">
                    <div className="author-avatar">
                        <img src="your-avatar.jpg" alt="Your Name" />
                    </div>
                    <div className="author-details">
                        <p className="author-name">Ali Daho</p>
                        <p className="article-date">{data.StartDate}</p>
                    </div>
                </div>
            </header>
            <div className="article-content">
                <div className="likes-and-progress">
                    <div className="likes">
                        <span className="like-count"><FaHeart className="link-icon" />{data.likes}</span>
                    </div>
                    <div className="progress-section">
                        {/** overallProgress variable has to be changing everytime i finished something.  */}
                        <div id="progress-bar">
                            <div id="progress" style={{ width: `${data.progress}%` }}>
                                {data.progress}%
                            </div>
                        </div>
                    </div>
                </div>
                <p className="article-introduction">
                    {data.description}
                </p>
                <div className="project-image">
                    <img src={data.picture} alt="Project" />
                </div>
                <div className="project-steps">
                    <h2 className="steps-title">Steps Taken</h2>
                    <ul className="steps-list">
                        <li>Step 1: Description of step 1.</li>
                        <li>Step 2: Description of step 2.</li>
                        <li>Step 3: Description of step 3.</li>
                        {/* Add more steps as needed */}
                    </ul>
                    <p className="current-step">
                        Currently at Step 2
                    </p>
                </div>
                <div className="articles-read">
                    <h2 className="articles-read-title">Articles Read</h2>
                    <ul className="articles-read-list">
                        <li>Article 1: Description of article 1.</li>
                        <li>Article 2: Description of article 2.</li>
                        <li>Article 3: Description of article 3.</li>
                        {/* Add more articles as needed */}
                    </ul>
                </div>
            </div>
            {/* Links to external websites */}
            <div className="links-container">
                <a
                    href={data.GitHub}
                    className="start-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaGithub className="link-icon" /> Github
                </a>
            </div>

        </div>
    );
}

export default WorkingOn;
