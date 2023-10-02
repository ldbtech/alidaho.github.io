import React, { useEffect, useState } from "react";
import './work.css';
import WorkCarte from "../Workcarte/workcarte";
import { database } from "../../Firebase";
import { ref, onValue } from "firebase/database";
import { TailSpin } from "react-loader-spinner";
const Work = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const postRef = ref(database, 'Posts');

            try {
                const snapshot = await onValue(postRef, (snapshot) => {
                    const dataVal = snapshot.val();
                    if (dataVal) {
                        const dataArray = Object.keys(dataVal).map((key) => ({
                            id: key,
                            ...dataVal[key],
                        }));
                        setData(dataArray);
                    } else {
                        setData([]);
                    }
                    setLoading(false); // Set loading to false after fetching data

                });

                // Unsubscribe from the listener to prevent multiple executions
                return () => {
                    snapshot();
                };
            } catch (error) {
                console.error(`Error Fetching data ${error}`);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        fetchData();
    }, []); // Empty dependencies array to run once
    console.log("Data", data);
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
