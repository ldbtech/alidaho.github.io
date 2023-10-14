import React, { useEffect, useState } from "react";
import './skills.css';
import { database } from "../../Firebase";
import { ref, onValue } from "firebase/database";

const Skills = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const postRef = ref(database, 'website/Skills');

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

                });

                // Unsubscribe from the listener to prevent multiple executions
                return () => {
                    snapshot();
                };
            } catch (error) {
                console.error(`Error Fetching data ${error}`);
            }
        };

        fetchData();
    }, []); // Empty dependencies array to run once
    console.log("Data Skills", data);
    return (
        <section id="skills">
            <span className="skillTitle">What I do</span>
            <span className="skillDesc">I am skilled Software and AI engineer</span>
            <div className="skillBars">
                {data.map((skillful) => (
                    <div className="skillBar">
                        <div className="skillBarImgContainer">
                            <img src={skillful.Picture} alt="Web & App DEV" className="skillBarImg" />
                        </div>
                        <div className="skillBarContent">
                            <div className="skillBarText">
                                <h2>{skillful.Title}</h2>
                                <p>{skillful.Description}</p>
                            </div>
                            <div className="skillTags">
                                {skillful.Tags.split(',').map((tag, index) => (
                                    <span key={index} className="skillTag">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}

export default Skills;