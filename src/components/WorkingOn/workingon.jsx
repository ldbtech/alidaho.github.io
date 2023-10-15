import React, { useState, useEffect } from 'react';
import './workingon.css'; // Import your CSS file
import { FaGithub, FaHeart } from 'react-icons/fa'; // Import icons from react-icons library
import { ref, onValue } from "firebase/database";
import { database } from "../../Firebase";
import Profile from '../../assets/profile.jpg';
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
        resources: [],
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
                            resources: []
                        });
                    }
                });
            } catch (error) {
                console.error(`Error Fetching data ${error}`);
            }
        };

        fetchData();
    }, []); // Empty dependencies array to run once

    const projectSteps = data.steps.map((tasks, taskKey) => (
        <li key={taskKey}>Step {taskKey + 1}: {tasks}</li>
    ));

    let resource = null; // Initialize as null

    if (typeof data.resources === 'object' && Object.keys(data.resources).length > 0) {
        resource = (
            <ul className='res-links'>
                {Object.keys(data.resources).map((resKey) => (
                    <li key={resKey}>
                        <a href={data.resources[resKey]} className="" target="_blank"
                            rel="noopener noreferrer">{resKey}</a>
                    </li>
                ))}
            </ul>
        );
    } else {
        // Handle the case when data.resources is empty or not an object
        resource = <p>No Resources</p>;
    }


    return (
        <div className="project-progress-container">
            <header className="article-header">
                <h1 className="article-title">{data.title}</h1>
                <div className="author-info">
                    <div className="author-avatar">
                        <img src={Profile} alt="Your Name" />
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
                    <ul className='steps-list'>
                        {projectSteps}
                    </ul>
                    <p className="current-step">
                        Currently at Step 2
                    </p>
                </div>
                <div className="articles-read">
                    <h2 className="articles-read-title">Articles Read</h2>
                    {resource}
                </div>
            </div>
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
