import React from "react";
import './work.css';
import WorkCarte from "../Workcarte/workcarte";
import { TailSpin } from "react-loader-spinner";

import { useData } from '../../DataContext'; // Update the path to match the location of your DataContext file

const Work = () => {
    // const [data, setData] = useState([]);
    const loading = false;
    const data = useData()
    return (
        <section id="works">
            <h2 className="workTitle">Projects</h2>
            <span className="workDesc">I take pride in making the most challenging projects in various areas.</span>
            {loading ? (// Conditional Rendering 
                <div className="loading-spinner">
                    <TailSpin type="TailSpin" color="#00BFFF" height={80} width={80} />
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="workCarteContainer">
                    {data.map((project) => (
                        <WorkCarte key={project.id} project={project} />
                    ))}
                </div>
            )}

            <button className="workBtn">See More</button>
        </section>
    );
}

export default Work;
