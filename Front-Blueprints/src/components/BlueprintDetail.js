import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BlueprintDetail.css';

const BlueprintDetail = ({ author, blueprintName }) => {
    const [blueprint, setBlueprint] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/blueprints/${author}/${blueprintName}`)
            .then(response => {
                setBlueprint(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the blueprint!", error);
            });
    }, [author, blueprintName]);

    return (
        <div>
            {blueprint ? (
                <div>
                    <h3>Current blueprint: {blueprintName}</h3>
                    {/* Display points, you might want to render them graphically */}
                    <ul>
                        {blueprint.points.map((point, index) => (
                            <li key={index}>Point {index + 1}: ({point.x}, {point.y})</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading blueprint...</p>
            )}
        </div>
    );
};

export default BlueprintDetail;

