# LA ÚLTIMA LUZ - DOCUMENTACIÓN DE ENTREGA

### Nombre del juego
La Última Luz

### Nombre y apellido del estudiante
Jesús Jose Romeo Claus

---

### Descripción breve del juego
"La Última Luz" es un videojuego de plataformas 2D con un diseño estético lúgubre y sombrío. El mundo ha sido completamente corrompido, perdiendo su vitalidad y sumergiéndose en una escala de grises absoluta debido a una invasión de tinta oscura. El jugador toma el control de Gorgori, el último ser vivo que conserva su color y energía. El objetivo es recorrer escenarios plataformeros evadiendo las trampas de tinta para proyectar su energía, devolverle la vida y el color a los ciudadanos atrapados (NPCs) y guiarlos a salvo hacia la salida.

### Explicación del concepto “Está mal, pero no tan mal”
El concepto de la consigna se integra directamente a la jugabilidad y la narrativa visual: el mundo devastado en escala de grises y los NPCs apagados representan el estado de que "está mal" (la corrupción total del entorno). Sin embargo, la presencia de Gorgori y su aura luminosa demuestran que "no está tan mal", ya que siempre existe una mecánica residual de esperanza y restauración para revertir la oscuridad y salvar el escenario, un ciudadano a la vez.

### Controles
El esquema de controles está diseñado para teclado en entorno web de PC:
- Tecla A / Flecha Izquierda: Desplazar al personaje hacia la izquierda.
- Tecla D / Flecha Derecha: Desplazar al personaje hacia la derecha.
- Tecla W / Flecha Arriba: Realizar un salto para evadir enemigos terrestres y alcanzar plataformas superiores.

### Objetivo del juego
El objetivo principal es superar los 3 niveles del juego con vida, localizando y rescatando a la mayor cantidad posible de NPCs atrapados para escoltarlos de manera segura hacia la puerta de salida de cada escenario, acumulando el máximo puntaje posible antes de que las vidas se agoten.

### Mecánicas principales
1. Movimiento y Físicas de Plataformas: Desplazamiento fluido en entornos bidimensionales con colisiones físicas precisas (Phaser Arcade Physics) sobre plataformas fijas y flotantes.
2. El Aura de Color (Mecánica de Rescate): Gorgori posee un aura amarilla permanente que actúa como un área de interacción dinámica (trigger). Al aproximarse a un NPC gris, el aura lo activa automáticamente y le devuelve su color.
3. Sistema de Escolta: Al ser rescatados, los NPCs reaccionan y siguen al jugador o avanzan de forma autónoma hacia la puerta de salida, requiriendo protección constante frente a los peligros ambientales.
4. Progreso por Umbral: Para habilitar la transición de nivel, el jugador debe interactuar con la puerta de salida tras cumplir los requisitos mínimos de rescate.

### Descripción breve de los tres niveles
- Nivel 1: El Despertar de los Grises: Un escenario introductorio con plataformas simples y pocos enemigos estáticos. Ideal para aprender el control de salto y la interacción del aura amarilla con los primeros NPCs.
- Nivel 2: Las Calles de Tinta: La dificultad aumenta de forma progresiva. El mapa introduce elevaciones complejas, plataformas estrechas y la presencia activa de enemigos móviles terrestres que patrullan los caminos.
- Nivel 3: El Diluvio Oscuro: El nivel final y de máxima dificultad. El entorno combina plataformas complejas de alta precisión con amenazas simultáneas: enemigos móviles en el suelo y una lluvia constante de proyectiles desde el cielo.

### Objetos o acciones que suman puntos
- Activar y devolver el color a un NPC mediante el aura amarilla (+10 puntos).

### Objetos o acciones que restan puntos
- Permitir que una gota de tinta golpee a un NPC ya rescatado (-5 puntos).

### Elementos que restan vidas
- Charcos de Tinta: Obstáculos estáticos en el suelo que dañan al jugador si los pisa (-1 vida).
- Manchas Negras: Enemigos móviles terrestres que patrullan y atacan al contacto directo (-1 vida).
- Gotas de Tinta: Proyectiles que caen verticalmente desde la parte superior de la pantalla e impactan al personaje (-1 vida).

### Funcionamiento de los NPCs
Inicialmente, los NPCs se encuentran distribuidos por el mapa en un estado estático ("apagados") y con un sprite en escala de grises, inmunes a los enemigos pero incapaces de avanzar. Cuando el jugador se acerca y los toca con su aura amarilla, cambian su sprite al modo coloreado, se activan en el sistema de físicas y comienzan su comportamiento de seguimiento o avance hacia la puerta de salida del mapa. A partir de su activación, se vuelven vulnerables a las amenazas ambientales.

### Funcionamiento del NPC del último nivel
En el tercer nivel, el comportamiento de los NPCs se vuelve más complejo para incrementar el desafío final. Estos NPCs finales requieren un rescate estratégico debido a que se encuentran posicionados en zonas de alta exposición a la caída de gotas de tinta, moviéndose de manera más errática o lenta, lo que obliga al jugador a sincronizar perfectamente sus movimientos para protegerlos con su propio cuerpo o limpiar el camino de enemigos antes de activarlos.

### Link al juego publicado y al documento 
(https://jesusromeoclaus123-ui.github.io/ProyectoColor/)
https://docs.google.com/document/d/1z-LenSIAdVw6ASgT2KVm2juHbJ_tV3SKnP2F434eHpo/edit?tab=t.0#heading=h.cyqls6zdxapc 

### Instrucciones para ejecutar el juego localmente
Instrucciones para ejecutar el juego localmente
Para ejecutar el proyecto en un entorno de desarrollo local, siga estos pasos:
Descargar o clonar el repositorio del proyecto desde GitHub.
Abrir la carpeta raíz del proyecto utilizando el editor de código Visual Studio Code.
Abrir una terminal integrada en Visual Studio Code e instalar las dependencias necesarias ejecutando el comando:
Bash
npm install
Levantar el servidor de desarrollo local (Localhost) basado en Vite ejecutando el comando:
Bash
npm run dev
El servidor compilará los archivos y proporcionará una dirección local en la terminal (por ejemplo, http://localhost:5173). Abra dicho enlace en su navegador web para ejecutar y probar el juego de forma interactiva.

### Tecnologías utilizadas
- Lenguaje de Programación: JavaScript (ES6+).
- Framework de Videojuegos: Phaser (Motor HTML5 para renderizado 2D y físicas arcade).
- Entorno de Desarrollo (IDE): Visual Studio Code.
- Herramientas adicionales: Git y GitHub para control de versiones y despliegue.