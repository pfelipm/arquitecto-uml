# Mejoras propuestas

Ideas para próximas versiones de Arquitecto Simple UML, recogidas a partir de la versión 7.7 "Compartir" y actualizadas tras la versión 8.0 "Revisión" (28 de octubre de 2026). Todas son compatibles con la distribución en un único archivo `index.html` insertado en Google Sites, salvo que se indique lo contrario. Los números identifican cada mejora y no cambian aunque cambie el orden.

Esfuerzo orientativo: **bajo** (unas horas), **medio** (un día aproximadamente), **alto** (varios días).

## Próximas mejoras, por orden

Contexto que fija el orden: el alumnado usa sobre todo portátiles (algunos, tabletas), y la herramienta se centra en los tres tipos de diagrama de la asignatura.

### 2. ✅ Soporte táctil (tabletas) (hecho en la rama `v9`, pendiente de publicar en la versión 9.0)
- **Solución:** el lienzo, los elementos y los tiradores usan eventos de puntero, que cubren ratón, dedo y lápiz con el mismo código; con ratón todo funciona igual que antes. Con el dedo: tocar selecciona, el doble toque edita el texto y arrastrar con un dedo mueve elementos o, sobre el fondo, dibuja el recuadro de selección (como con el ratón). Con dos dedos se pellizca para el zoom y se desplaza el lienzo; al apoyar el segundo dedo se cancela lo que hacía el primero. Tras un toque, los tiradores de redimensionar y la zona sensible de las relaciones se agrandan.
- **Limitaciones:** reordenar diagramas arrastrándolos en la barra lateral sigue siendo solo con ratón; la selección múltiple con el dedo se hace con el recuadro (no hay Mayús).
- **Pruebas:** la prueba automática comprueba el gesto de pellizcar.

### 10. ✅ Condición de las relaciones `<<extend>>` (DCU) (hecho en la rama `v9`, pendiente de publicar en la versión 9.0)
- **Necesidad:** en UML 2 una extensión puede indicar la situación en la que el caso de uso extendido se ejecuta (por ejemplo, «el cliente pulsa Ayuda»), y en clase conviene anotarla.
- **Solución (primera parte):** campo «Condición de la extensión» en el panel de propiedades de las relaciones `<<extend>>`. Se dibuja en cursiva bajo la línea, entre llaves (`{el cliente pulsa Ayuda}`), porque en UML la condición es una restricción; los corchetes quedan para las guardas de los diagramas de actividad. Si el usuario escribe las llaves o corchetes, no se duplican. La revisión sugiere añadir la condición cuando falta.
- **Segunda parte (con las notas UML, mejora 5):** opción de mostrar la condición con la notación oficial, en una nota unida a la flecha (`Condition: {…}` y, si se quiere, `extension point: …`). Usará el mismo campo, así que no habrá que rehacer los diagramas.

### 8. ✅ Puntos de paso en las relaciones (hecho en la rama `v9`, pendiente de publicar en la versión 9.0)
- **Problema:** el trazado ortogonal siempre sale en horizontal, gira en el punto medio y entra en horizontal (o lo mismo en vertical). Un flujo de vuelta en un DA (por ejemplo, el retorno de un bucle de reintento) unía dos elementos de la misma columna, atravesaba los intermedios o se superponía con el flujo de ida; en diagramas de clases con muchas relaciones aparecían cruces que el alumno no podía deshacer.
- **Solución:**
  - **Puntos de paso:** doble clic (o doble toque) sobre la relación seleccionada añade un punto en el tramo más cercano, listo para arrastrar; se ajusta a la alineación de los puntos vecinos. Doble clic sobre un punto lo quita, y el botón **Enderezar** del panel de propiedades los quita todos. En trazado recto, la línea pasa por los puntos en orden; en ortogonal, cada punto es un codo y los codos intermedios se calculan solos.
  - **Flujos de vuelta automáticos (DA):** un flujo ortogonal sin puntos de paso que sube por la misma columna rodea los elementos intermedios por un lado y entra por el lateral del destino. Va por la derecha, salvo que a esa altura haya más elementos a la derecha (por ejemplo, la otra rama de una decisión).
  - **Coherencia:** los puntos se mueven con la relación cuando se mueven sus dos extremos (arrastre y flechas), se desplazan al duplicar y pegar, cuentan en deshacer y rehacer, en «Ajustar a pantalla», en las exportaciones y en los enlaces compartidos (que los validan). La versión 8.0 los ignora y dibuja la línea automática.
- **Código:** `routeWithWaypoints`, `routeReturnFlow` y `renderWaypointHandles` en `index.html`. La prueba automática comprueba ambos trazados con los diagramas «Bucle de reintento» y «Puntos de paso» de [`diagramas-revision.json`](.github/pruebas/diagramas-revision.json).

### 5. Notas UML
- Nuevo elemento «Nota» (rectángulo con la esquina doblada) unido con una línea discontinua al elemento que comenta. Útil en enunciados y correcciones. Disponible en los tres tipos de diagrama.
- **Motivo del orden:** útil sobre todo para el profesorado al preparar enunciados y corregir, pero no limita lo que el alumnado puede modelar.
- **Esfuerzo:** medio.

### 7. Nombres de rol en los extremos de las asociaciones (DC)
- Ahora cada asociación tiene multiplicidades y una etiqueta central. UML sitúa además el nombre del rol en cada extremo (por ejemplo, *origen* y *destino* junto a Aeropuerto). Se añadirían dos campos al panel de propiedades y se dibujarían junto a las multiplicidades.
- **Motivo del orden:** completa la notación del diagrama de clases; mientras tanto, la etiqueta central de la asociación permite distinguir varias asociaciones entre las mismas clases.
- **Esfuerzo:** bajo-medio.

## Descartadas

### 9. Diagramas de secuencia
- Un cuarto tipo de diagrama: líneas de vida, mensajes síncronos y asíncronos, respuestas y fragmentos combinados (`alt`, `loop`). Es la mejora más costosa, porque su disposición es temporal y distinta de la de los otros tres tipos.
- **Motivo:** los contenidos oficiales de la asignatura no incluyen diagramas de secuencia. Solo se retomaría si cambia el temario.
- **Esfuerzo:** alto.

## Hechas

### 1. ✅ Prueba automática diaria de carga (hecho)
- **Problema:** la aplicación depende de bibliotecas cargadas desde CDN. En octubre de 2026 la URL sin versión de Babel pasó a servir Babel 8 y la aplicación quedó en blanco sin que nadie lo detectara. Ahora todas las versiones están fijadas, pero un CDN puede seguir fallando o retirar una versión.
- **Solución:** la tarea de GitHub Actions [`prueba-carga.yml`](.github/workflows/prueba-carga.yml) se ejecuta cada día, en cada push a `main` y en cada pull request (también a mano desde la pestaña *Actions*). Abre `index.html` en Chromium sin interfaz con Playwright ([`prueba-carga.mjs`](.github/pruebas/prueba-carga.mjs)) y comprueba que aparecen la barra superior y la pantalla de bienvenida, que Tailwind aplica los estilos y que se puede crear un diagrama, sin errores en la consola ni recursos que fallen. Si falla, GitHub avisa por correo.
- **Para probar en local:** `npm install --no-save playwright && npx playwright install chromium && node .github/pruebas/prueba-carga.mjs`.
- **A tener en cuenta:** GitHub desactiva las tareas programadas de los repositorios sin actividad durante 60 días; si ocurre, basta con reactivarla en *Actions*.

### 3. ✅ «Revisar diagrama»: comprobaciones UML con fines didácticos (hecho, versión 8.0)
- **Funcionamiento:** el botón **Revisar** de la barra superior (o **F7**) abre un panel lateral con los problemas del diagrama abierto, clasificados en errores, avisos y sugerencias de estilo (estas se pueden ocultar). Al pulsar un problema se seleccionan los elementos afectados y la vista se centra en ellos. La revisión se actualiza mientras se edita y nunca modifica el diagrama.
- **Comprobaciones:**
  - **Comunes:** elementos sin nombre o con el nombre por defecto; nombres repetidos (DCU y DC).
  - **DCU:** casos de uso sin actor (directo o heredado por inclusión, extensión o generalización); actores sin casos de uso; casos de uso fuera del límite y actores dentro; inclusiones y generalizaciones circulares; falta de límite del sistema y nombres de casos de uso que no empiezan por un verbo en infinitivo (sugerencias).
  - **DC:** herencia circular; métodos abstractos en clases no abstractas; clases abstractas sin subclases; interfaces sin implementar o implementadas sin declarar todos sus métodos; herencia múltiple de clases; miembros sin visibilidad; partes compuestas en varios todos; clases aisladas; convenciones de mayúsculas (sugerencias).
  - **DA:** falta de nodo inicial o final; varios nodos iniciales; flujos que entran en el inicial o salen del final; nodos inalcanzables y callejones sin salida; decisiones sin guardas, con guardas repetidas o con una sola salida; guardas sin corchetes (sugerencia); actividades con varias entradas o salidas sin nodo de fusión o barra; bifurcaciones y uniones desparejadas.
- **Código:** la función pura `reviewDiagram` y el panel `renderReviewPanel` en `index.html`. La prueba automática comprueba las reglas con los diagramas de [`diagramas-revision.json`](.github/pruebas/diagramas-revision.json).
- **Posibles ampliaciones:** comprobar multiplicidades y nombres de asociaciones, y permitir que el profesorado active o desactive reglas concretas.

### 4. ✅ Exportar a SVG (hecho)
- Nuevo botón en la barra superior, junto al de PNG. Reutiliza la preparación de la exportación a PNG (encuadre del contenido, sin selección ni pan/zoom, fondo según el modo claro u oscuro) y descarga el SVG sin rasterizar, nítido a cualquier tamaño en documentos, presentaciones y LaTeX.

### 6. ✅ Notación de miembros estáticos y abstractos (hecho)
- Los atributos y métodos que empiezan por `static` se subrayan y los que empiezan por `abstract` van en cursiva, como en UML. El prefijo no se muestra en el diagrama y puede ir antes o después del símbolo de visibilidad (`+ static total: int` o `static + total: int`). El panel de propiedades lo recuerda bajo los campos de atributos y métodos.

## Publicación en GitHub Pages (hecho)

- **Situación:** desde el 5 de noviembre de 2026 la aplicación se publica también en GitHub Pages (`https://pfelipm.github.io/arquitecto-uml/`), desde la rama `main` y su raíz; cada push a `main` la actualiza. La versión oficial sigue insertada como código en Google Sites (`umlsimple.pablofelip.online`).
- **Diferencias:** en Sites el código se ejecuta en un subdominio aleatorio (`…-atari-embeds.googleusercontent.com`), así que el navegador no conserva los diagramas entre visitas y los enlaces compartidos hay que pegarlos en «Abrir diagrama compartido». En Pages los diagramas se conservan y los enlaces se abren con un clic. La aplicación detecta dónde se ejecuta (`SHARE_OPENS_DIRECTLY` en `index.html`) y genera el enlace y el texto del modal de compartir que corresponden.
- **A tener en cuenta:** los diagramas guardados en cada dirección son independientes (para pasar de una a otra, exportar e importar una copia JSON). El almacenamiento del navegador se comparte con cualquier otro proyecto que se publique en `pfelipm.github.io`.
- **Durante el desarrollo de la 9.0:** Pages publica la rama `v9` (versión en desarrollo, con un aviso visible), porque los alumnos usan la versión de Sites. Al publicar la 9.0 se fusiona en `main` y Pages vuelve a publicar `main`.
- **Cuando Pages sea la versión que usan los alumnos:** publicar mediante GitHub Actions la versión estable (`main`) en la raíz y la de desarrollo en `/desarrollo/`, con una clave de almacenamiento distinta para que la versión en desarrollo no pueda modificar los diagramas guardados en la estable.
- **Pendiente a medio plazo:** llevar el subdominio `umlsimple.pablofelip.online` a GitHub Pages (dominio propio en los ajustes de Pages y registro DNS apuntando a GitHub). No hará falta cambiar el código: al no ejecutarse en `googleusercontent.com`, los enlaces con ese dominio se abrirán con un clic.
