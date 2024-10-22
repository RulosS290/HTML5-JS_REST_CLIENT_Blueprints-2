import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './BlueprintList.css';

const BlueprintList = () => {
    const [author, setAuthor] = useState('');
    const [blueprints, setBlueprints] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [selectedBlueprint, setSelectedBlueprint] = useState(null);
    const [updatedPoints, setUpdatedPoints] = useState([]);
    const canvasRef = useRef(null); // Referencia para el canvas

    const getBlueprints = () => {
        axios.get(`http://localhost:8080/blueprints/${author}`)
            .then(response => {
                const blueprintData = response.data.map(bp => ({
                    name: bp.name,
                    points: bp.points.length,
                    pointsArray: bp.points
                }));
                setBlueprints(blueprintData);
                const total = blueprintData.reduce((sum, bp) => sum + bp.points, 0);
                setTotalPoints(total);
            })
            .catch(error => {
                console.error("There was an error fetching the blueprints!", error);
            });
    };

    const openBlueprint = (blueprint) => {
        setSelectedBlueprint(blueprint);
        setUpdatedPoints(blueprint.pointsArray);
    };

    useEffect(() => {
        const drawBlueprint = () => {
            const canvas = canvasRef.current;
            if (selectedBlueprint && canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                if (updatedPoints.length > 0) {
                    ctx.moveTo(updatedPoints[0].x, updatedPoints[0].y);

                    updatedPoints.forEach(point => {
                        ctx.lineTo(point.x, point.y);
                    });

                    ctx.closePath();
                    ctx.stroke();
                }
            }
        };
        drawBlueprint();
    }, [updatedPoints, selectedBlueprint]);

    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newPoint = { x, y };
        setUpdatedPoints([...updatedPoints, newPoint]);
    };

    const handleSaveBlueprint = () => {
        const blueprintToSave = {
            name: selectedBlueprint.name,
            points: updatedPoints
        };
    
        // Verifica si es un nuevo blueprint (sin puntos)
        if (updatedPoints.length === 0) {
            alert('No points to save for this blueprint.');
            return;
        }
    
        // Hacer PUT si ya existe
        axios.put(`http://localhost:8080/blueprints/${author}/${selectedBlueprint.name}`, blueprintToSave)
            .then(response => {
                alert('Blueprint saved successfully!');
                getBlueprints(); // Actualiza la lista de blueprints
            })
            .catch(error => {
                console.error("There was an error saving the blueprint!", error);
                alert('Failed to save blueprint.');
            });
    };
    

    const handleCreateNewBlueprint = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
        }
    
        const blueprintName = prompt('Enter the name of the new blueprint:');
        if (blueprintName) {
            const newBlueprint = {
                author: author, // Asegúrate de incluir el autor
                name: blueprintName,
                points: [] // Inicialmente, no hay puntos
            };
    
            // Hacer POST para crear el nuevo blueprint
            axios.post('http://localhost:8080/blueprints', newBlueprint)
                .then(response => {
                    alert('Blueprint created successfully!');
                    getBlueprints(); // Hacer GET para actualizar la lista
                })
                .catch(error => {
                    console.error("There was an error creating the blueprint!", error);
                    alert('Failed to create blueprint.');
                });
        }
    };

    return (
        <div className="container">
            <h1>Blueprints</h1>
            <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={e => setAuthor(e.target.value)}
            />
            <button onClick={getBlueprints}>Get Blueprints</button>

            <h3>{author}'s blueprints:</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Blueprint name</th>
                        <th>Number of points</th>
                        <th>Open</th>
                    </tr>
                </thead>
                <tbody>
                    {blueprints.map((bp, index) => (
                        <tr key={index}>
                            <td>{bp.name}</td>
                            <td>{bp.points}</td>
                            <td>
                                <button onClick={() => openBlueprint(bp)}>Open</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4>Total user points: {totalPoints}</h4>

            {author && (
                <div>
                    <button onClick={handleCreateNewBlueprint}>Create New Blueprint</button>
                </div>
            )}

            {selectedBlueprint && (
                <div>
                    <h3>Current blueprint: {selectedBlueprint.name}</h3>
                    <canvas
                        ref={canvasRef} // Referencia del canvas
                        id="blueprintCanvas"
                        width="500"
                        height="500"
                        onClick={handleCanvasClick}
                    ></canvas>
                    <button className="botonSaven" onClick={handleSaveBlueprint}>Save Blueprint</button>
                </div>
            )}
        </div>
    );
};

export default BlueprintList;





