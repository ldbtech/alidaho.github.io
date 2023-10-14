import { createContext, useContext, useEffect, useState } from "react";
import { database } from "./Firebase";
import { ref, onValue, update } from "firebase/database";

// DataContext.js
const DataContext = createContext();
const DataCurrentWork = createContext();

export function DataProvider({ children }) {
    const [data, setData] = useState([]);

    // Fetch data from Firebase and store it in the state
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

                });

                const unsubscribe = onValue(postRef, dataCallback);

                // Unsubscribe from the listener to prevent multiple executions
                return () => {
                    unsubscribe();
                };
            } catch (error) {
                console.error(`Error Fetching data ${error}`);
            }
        };

        fetchData();
    }, []); // Empty dependencies array to run once

    return (
        <DataContext.Provider value={data}>{children}</DataContext.Provider>
    );
}

// Function to update the like count in the Firebase Realtime Database
const updateLikes = (projectId, newLikes) => {
    console.log("Updating likes for project with ID: ", projectId);
    console.log("New likes count: ", newLikes);
    const projectRef = ref(database, `Posts/${projectId}`);

    // Use set to update the likes
    update(projectRef, { likes: newLikes })
        .then(() => {
            console.log('Likes updated successfully.');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

export function CurrentWorkDB({ children }) {
    const [data, setData] = useState([]);

    // Fetch data from Firebase and store it in the state
    useEffect(() => {
        const fetchData = async () => {
            const postRef = ref(database, 'CurrentWork');

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

                const unsubscribe = onValue(postRef, dataCallback);

                // Unsubscribe from the listener to prevent multiple executions
                return () => {
                    unsubscribe();
                };
            } catch (error) {
                console.error(`Error Fetching data ${error}`);
            }
        };

        fetchData();
    }, []); // Empty dependencies array to run once

    return (
        <DataCurrentWork.Provider value={data}>{children}</DataCurrentWork.Provider>
    );

};

export function useData() {
    return useContext(DataContext);
}

export { updateLikes };

export function currentWork() {
    return useContext(DataCurrentWork);
}
