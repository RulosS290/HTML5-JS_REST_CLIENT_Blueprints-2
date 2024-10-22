import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BlueprintList.css';

const BlueprintList = () => {
    const [author, setAuthor] = useState('');
    const [blueprints, setBlueprints] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [selectedBlueprint, setSelectedBlueprint] = useState(null); // Nuevo estado para el blueprint seleccionado

    const getBlueprints = () => {
        axios.get(`http://localhost:8080/blueprints/${author}`)
            .then(response => {
                const blueprintData = response.data.map(bp => ({
                    name: bp.name,
                    points: bp.points.length,
                    pointsArray: bp.points // Asegúrate de tener el array de puntos para graficar
                }));
                setBlueprints(blueprintData);

                // Calcular el total de puntos
                const total = blueprintData.reduce((sum, bp) => sum + bp.points, 0);
                setTotalPoints(total);
            })
            .catch(error => {
                console.error("There was an error fetching the blueprints!", error);
            });
    };

    // Función para manejar la selección de un blueprint
    const openBlueprint = (blueprint) => {
        setSelectedBlueprint(blueprint); // Asigna el blueprint seleccionado
    };

    // Usar un efecto para dibujar el blueprint cada vez que cambie el seleccionado
    useEffect(() => {
        const drawBlueprint = () => {
            if (selectedBlueprint) {
                const canvas = document.getElementById('blueprintCanvas');
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

                // Dibujar cada segmento basado en los puntos del blueprint
                ctx.beginPath();
                const points = selectedBlueprint.pointsArray;
                if (points.length > 0) {
                    ctx.moveTo(points[0].x, points[0].y); // Moverse al primer punto

                    points.forEach(point => {
                        ctx.lineTo(point.x, point.y); // Dibujar línea hacia el siguiente punto
                    });

                    ctx.closePath();
                    ctx.stroke(); // Realizar el dibujo
                }
            }
        };

        drawBlueprint(); // Llamar a la función cuando cambie el blueprint seleccionado
    }, [selectedBlueprint]); // El efecto se ejecuta cuando 'selectedBlueprint' cambie

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
                        <th>Open</th> {/* Nueva columna */}
                    </tr>
                </thead>
                <tbody>
                    {blueprints.map((bp, index) => (
                        <tr key={index}>
                            <td>{bp.name}</td>
                            <td>{bp.points}</td>
                            <td>
                                <button onClick={() => openBlueprint(bp)}>Open</button> {/* Botón para abrir el blueprint */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4>Total user points: {totalPoints}</h4>

            {/* Canvas para dibujar el blueprint */}
            {selectedBlueprint && (
                <div>
                    <h3>Current blueprint: {selectedBlueprint.name}</h3>
                    <canvas id="blueprintCanvas" width="500" height="500"></canvas> {/* Canvas para el dibujo */}
                </div>
            )}
        </div>
    );
};

export default BlueprintList;

