import React, { useEffect, useState } from "react";
import './workDetails.css';
//import TestIt from '../../assets/testit.png';
import { useData, updateLikes } from '../../DataContext'; // Update the path to match the location of your DataContext file
import { useParams } from "react-router-dom";
import { FaGithub, FaHeart } from 'react-icons/fa'; // Import icons from react-icons library

const WorkDetail = () => {
    const data = useData();
    console.log("Working Details: ", data)
    const { id } = useParams();
    const selectedItem = data.find(item => item.id === id);

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(selectedItem.likes);

    useEffect(() => {
        const hasLiked = localStorage.getItem(`liked_${id}`);
        if (hasLiked) {
            setLiked(true);
        }
    }, [id]);

    const handleLikeClick = () => {
        if (!liked) {
            const newLikes = likes + 1;
            updateLikes(id, newLikes);
            setLikes(newLikes);

            localStorage.setItem(`liked_${id}`, 'true');
        } else {
            const newLikes = Math.max(0, likes - 1);

            updateLikes(id, newLikes);
            setLikes(newLikes);

            localStorage.removeItem(`liked_${id}`);
        }

        setLiked(!liked);
    }

    // State to manage overall project progress
    const [overallProgress, setOverallProgress] = useState(100); // Change to your project's overall progress percentage


    // Convert tasks object into an array using Object.values()
    const taskArray = selectedItem && selectedItem.tasks ? Object.values(selectedItem.tasks) : [];

    const projectSteps = taskArray.map((task, taskKey) => (
        <div key={taskKey}>
            <h2 className="steps-title">{task.task_name}</h2>
            <ul className="steps-list">
                {task.steps.map((step, stepKey) => (
                    <li key={stepKey}>Step {stepKey + 1}: {step}</li>
                ))}
            </ul>

        </div>
    ));


    return (
        <div className="project-progress-container">

            <header className="article-header">
                <h1 className="article-title">{selectedItem.title}</h1>
                <div className="author-info">
                    <div className="author-avatar">
                        <img src={selectedItem.picture} alt="Postpic" />
                    </div>
                    <div className="author-details">
                        <p className="author-name">Ali Daho</p>
                        <p className="article-date">{selectedItem.date}</p>
                    </div>
                </div>
            </header>
            <div className="article-content">
                <div className="likes-and-progress">
                    <div className="likes">
                        <span
                            className={`like-count ${liked ? 'liked' : ''}`}
                            onClick={handleLikeClick}
                        >
                            <FaHeart className="link-icon" />
                            {likes}
                        </span>
                    </div>
                    <div className="progress-section">
                        {/** overallProgress variable has to be changing everytime i finished something.  */}
                        <div id="progress-bar">
                            <div id="progress" style={{ width: `${overallProgress}%` }}>
                                {overallProgress}%
                            </div>
                        </div>
                    </div>
                </div>
                <p className="article-introduction">
                    {selectedItem.description}
                </p>
                <div className="project-image">
                    <img src={selectedItem.picture} alt="Project" />
                </div>
                <div className="project-steps">
                    <h2 className="steps-title">Steps Taken</h2>
                    {projectSteps}
                </div>
            </div>
            {/* Links to external websites */}
            <div className="links-container">
                <a
                    href={selectedItem.GitHub}
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

export default WorkDetail;