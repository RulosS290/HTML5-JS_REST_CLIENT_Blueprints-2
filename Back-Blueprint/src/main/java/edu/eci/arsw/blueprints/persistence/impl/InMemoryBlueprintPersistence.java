/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

/**
 *
 * @author hcadavid
 */
@Component
public class InMemoryBlueprintPersistence implements BlueprintsPersistence {

    private final Map<Tuple<String, String>, Blueprint> blueprints = new ConcurrentHashMap<>();

    public InMemoryBlueprintPersistence() {

        Point[] pts0 = new Point[] { new Point(340, 340), new Point(135, 135) };
        Blueprint bp = new Blueprint("Diego", "BPDiego2", pts0);

        Point[] pts = new Point[] {
            // Base de la casa (rectángulo)
            new Point(100, 300), // esquina inferior izquierda
            new Point(300, 300), // esquina inferior derecha
            new Point(300, 200), // esquina superior derecha
            new Point(100, 200), // esquina superior izquierda
            new Point(100, 300), // volver a la esquina inferior izquierda para cerrar la base
        
            // Techo (triángulo)
            new Point(100, 200), // esquina superior izquierda
            new Point(200, 100), // punto superior del triángulo (techo)
            new Point(300, 200), // esquina superior derecha
            new Point(100, 200)  // volver a la esquina superior izquierda para cerrar el techo
        };
        
        Blueprint bp1 = new Blueprint("Diego", "CasaDiego", pts);
        
        

        Point[] pts1 = new Point[] {
            // Puntos para una estrella de 5 puntas
            new Point(200, 100),  // Punta superior
            new Point(220, 180),  // Abajo a la derecha
            new Point(300, 180),  // Extremo derecho
            new Point(240, 220),  // Abajo derecha del centro
            new Point(260, 300),  // Punta inferior
            new Point(200, 250),  // Abajo en el centro
            new Point(140, 300),  // Extremo inferior izquierdo
            new Point(160, 220),  // Abajo izquierda del centro
            new Point(100, 180),  // Extremo izquierdo
            new Point(180, 180),  // Abajo a la izquierda
            new Point(200, 100)   // Volver a la punta superior para cerrar la estrella
        };
        
        Blueprint bp2 = new Blueprint("Cristian", "EstrellaCristian", pts1);


        Blueprint bp3 = new Blueprint("Cristian", "BPCristian2", pts0);



        Point[] pts2 = new Point[] {
            // Parte superior de la sombrilla (curva)
            new Point(200, 100),  // Punto superior central de la sombrilla
            new Point(150, 150),  // Punto superior izquierdo
            new Point(100, 200),  // Punto izquierdo
            new Point(150, 200),  // Punto inferior izquierdo de la tela
            new Point(200, 180),  // Punto inferior central de la tela
            new Point(250, 200),  // Punto inferior derecho de la tela
            new Point(300, 200),  // Punto derecho
            new Point(250, 150),  // Punto superior derecho
            new Point(200, 100),   // Volver al punto superior central

            // Palo de la sombrilla
            new Point(200, 100),  // Punto donde inicia el palo en el centro de la sombrilla
            new Point(200, 300)   // Punto inferior del palo
        };
        
    
        // Combina ambos puntos en un objeto Blueprint
        Blueprint bp4 = new Blueprint("Daniel", "DanielSombrilla", pts2);

        Blueprint bp5 = new Blueprint("Daniel", "BPDaniel2", pts0);

        blueprints.put(new Tuple<>(bp.getAuthor(), bp.getName()), bp);
        blueprints.put(new Tuple<>(bp1.getAuthor(), bp1.getName()), bp1);
        blueprints.put(new Tuple<>(bp2.getAuthor(), bp2.getName()), bp2);
        blueprints.put(new Tuple<>(bp3.getAuthor(), bp3.getName()), bp3);
        blueprints.put(new Tuple<>(bp4.getAuthor(), bp4.getName()), bp4);
        blueprints.put(new Tuple<>(bp5.getAuthor(), bp5.getName()), bp5);

    }

    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        if (blueprints.containsKey(new Tuple<>(bp.getAuthor(), bp.getName()))) {
            throw new BlueprintPersistenceException(BlueprintPersistenceException.ALREADY_EXISTS + bp);
        } else {
            blueprints.putIfAbsent(new Tuple<>(bp.getAuthor(), bp.getName()), bp);
        }
    }

    @Override
    public void updateBlueprint(Blueprint newBp, String author, String bprintname) throws BlueprintNotFoundException {
        Blueprint actualBp = getBlueprint(author, bprintname);
        if (actualBp != null) {
            actualBp.setPoints(newBp.getPoints());
        } else {
            throw new BlueprintNotFoundException(BlueprintNotFoundException.NOT_EXIST + author + bprintname);
        }
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        Blueprint blueprint = blueprints.get(new Tuple<>(author, bprintname));
        if (blueprint == null) {
            throw new BlueprintNotFoundException(BlueprintNotFoundException.NOT_EXIST + author + bprintname);
        }
        return blueprint;
    }

    @Override
    public Set<Blueprint> getAllBlueprints() throws BlueprintNotFoundException {
        Set<Blueprint> allBlueprints = new HashSet<Blueprint>();
        blueprints.forEach((key, value) -> allBlueprints.add(value));
        if (allBlueprints.isEmpty()) {
            throw new BlueprintNotFoundException(BlueprintNotFoundException.NO_BLUEPRINTS);
        }
        return allBlueprints;
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> blueprintsByAuthor = new HashSet<Blueprint>();
        blueprints.forEach((key, value) -> {
            if (key.getElem1().equals(author)) {
                blueprintsByAuthor.add(value);
            }
        });
        if (blueprintsByAuthor.isEmpty()) {
            throw new BlueprintNotFoundException(BlueprintNotFoundException.NO_BLUEPRINTS_BY_AUTHOR);
        }
        return blueprintsByAuthor;
    }

}
