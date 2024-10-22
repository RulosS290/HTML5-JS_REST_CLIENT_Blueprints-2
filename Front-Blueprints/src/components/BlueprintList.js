import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BlueprintList.css';

const BlueprintList = () => {
    const [author, setAuthor] = useState('');
    const [blueprints, setBlueprints] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [selectedBlueprint, setSelectedBlueprint] = useState(null);
    const [updatedPoints, setUpdatedPoints] = useState([]); // Estado para los puntos actualizados

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
        setSelectedBlueprint(blueprint);
        setUpdatedPoints(blueprint.pointsArray); // Inicializar los puntos con los existentes
    };

    // Usar un efecto para dibujar el blueprint cada vez que cambien los puntos
    useEffect(() => {
        const drawBlueprint = () => {
            if (selectedBlueprint) {
                const canvas = document.getElementById('blueprintCanvas');
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

                // Dibujar cada segmento basado en los puntos actualizados del blueprint
                ctx.beginPath();
                if (updatedPoints.length > 0) {
                    ctx.moveTo(updatedPoints[0].x, updatedPoints[0].y); // Moverse al primer punto

                    updatedPoints.forEach(point => {
                        ctx.lineTo(point.x, point.y); // Dibujar línea hacia el siguiente punto
                    });

                    ctx.closePath();
                    ctx.stroke(); // Realizar el dibujo
                }
            }
        };

        drawBlueprint(); // Llamar a la función cuando cambien los puntos actualizados
    }, [updatedPoints, selectedBlueprint]); // Se ejecuta cuando 'updatedPoints' o 'selectedBlueprint' cambian

    // Función para agregar un nuevo punto al hacer clic en el canvas
    const handleCanvasClick = (event) => {
        const canvas = document.getElementById('blueprintCanvas');
        const rect = canvas.getBoundingClientRect(); // Obtener la posición del canvas en la pantalla

        // Calcular las coordenadas del clic dentro del canvas
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Crear un nuevo punto con las coordenadas calculadas
        const newPoint = { x, y };

        // Actualizar los puntos del blueprint seleccionado
        setUpdatedPoints([...updatedPoints, newPoint]);
    };

    // Función para guardar el blueprint actualizado en el servidor
    const handleSaveBlueprint = () => {
        if (selectedBlueprint) {
            const blueprintToSave = {
                name: selectedBlueprint.name,
                points: updatedPoints // Enviar los puntos actualizados
            };

            // Realizar la solicitud PUT para actualizar el blueprint
            axios.put(`http://localhost:8080/blueprints/${author}/${selectedBlueprint.name}`, blueprintToSave)
                .then(response => {
                    alert('Blueprint saved successfully!');
                })
                .catch(error => {
                    console.error("There was an error saving the blueprint!", error);
                    alert('Failed to save blueprint.');
                });
        }
        getBlueprints();
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

            {/* Canvas para dibujar el blueprint */}
            {selectedBlueprint && (
                <div>
                    <h3>Current blueprint: {selectedBlueprint.name}</h3>
                    <canvas 
                        id="blueprintCanvas" 
                        width="500" 
                        height="500" 
                        onClick={handleCanvasClick} // Asignar el manejador de clics
                    ></canvas>
                    <button className="botonSaven" onClick={handleSaveBlueprint}>Save Blueprint</button> {/* Llamar a la función de guardar */}
                </div>
            )}
        </div>
    );
};

export default BlueprintList;
