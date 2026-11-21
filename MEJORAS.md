# Mejoras propuestas

Ideas para próximas versiones de Arquitecto Simple UML, recogidas a partir de la versión 7.7 "Compartir" y actualizadas tras la versión 9.0 "Notación" (21 de noviembre de 2026). Todas son compatibles con la distribución en un único archivo `index.html` insertado en Google Sites, salvo que se indique lo contrario. Los números identifican cada mejora y no cambian aunque cambie el orden.

Esfuerzo orientativo: **bajo** (unas horas), **medio** (un día aproximadamente), **alto** (varios días).

## Próximas mejoras (versión 9.1)

### 14. ✅ Alinear, distribuir e igualar tamaño (hecho en la rama `v9.1`, pendiente de publicar)
- **Solución:** con varios elementos seleccionados, el panel de propiedades muestra tres grupos de botones: **Alinear** (izquierda, centro, derecha, arriba, medio, abajo, respecto al recuadro de la selección), **Repartir** (en horizontal o vertical, con la misma separación entre elementos; con 3 o más) e **Igualar tamaño** (ancho o alto, al del mayor, sin mover los centros). Cada operación es un único paso de deshacer. Al alinear o repartir, los carriles y límites seleccionados arrastran su contenido, y los puntos de paso se mueven cuando sus dos extremos se desplazan lo mismo.

### 15. ✅ Duplicar diagrama (hecho en la rama `v9.1`, pendiente de publicar)
- **Solución:** botón **Duplicar diagrama** en la barra lateral (junto a renombrar y eliminar). La copia aparece justo debajo del original como «Nombre (copia)», con identificadores nuevos y sin selección, y se abre. Sirve para guardar versiones y para repartir un diagrama de partida.

## Posibles (no para este curso)

### 16. Comparar con una solución
- El profesorado comparte la solución con un enlace y el alumno la compara con su diagrama: la aplicación lista lo que falta, lo que sobra y lo que difiere (clases, atributos, relaciones, multiplicidades), comparando por nombre. Complementaría «Revisar diagrama», que comprueba la forma, con una comprobación del contenido frente a un enunciado concreto.
- **Esfuerzo:** medio-alto.

### 17. Exportar a PlantUML o Mermaid
- Generar el código de texto del diagrama, para pegarlo en documentación, Markdown, wikis o LaTeX y mostrar la notación textual que se usa en la industria. Importar desde PlantUML sería bastante más costoso.
- **Esfuerzo:** medio.

### 18. Revisión configurable
- Las ampliaciones anotadas en la mejora 3: comprobar multiplicidades y nombres de asociaciones, y que el profesorado active o desactive reglas concretas según el tema.
- **Esfuerzo:** medio.

## Descartadas

### 9. Diagramas de secuencia
- Un cuarto tipo de diagrama: líneas de vida, mensajes síncronos y asíncronos, respuestas y fragmentos combinados (`alt`, `loop`). Es la mejora más costosa, porque su disposición es temporal y distinta de la de los otros tres tipos.
- **Motivo:** los contenidos oficiales de la asignatura no incluyen diagramas de secuencia. Solo se retomaría si cambia el temario.
- **Esfuerzo:** alto.

### 13. Carriles horizontales (DA)
- Botón «Girar» en el panel del carril, como en las barras de bifurcación y unión, para usar carriles horizontales (cabecera a la izquierda y nombre en vertical) en procesos que avanzan de izquierda a derecha.
- **Motivo:** los diagramas de actividad de la asignatura fluyen de arriba abajo, con carriles verticales.
- **Esfuerzo:** medio.

## Hechas

### 1. ✅ Prueba automática diaria de carga (hecho)
- **Problema:** la aplicación depende de bibliotecas cargadas desde CDN. En octubre de 2026 la URL sin versión de Babel pasó a servir Babel 8 y la aplicación quedó en blanco sin que nadie lo detectara. Ahora todas las versiones están fijadas, pero un CDN puede seguir fallando o retirar una versión.
- **Solución:** la tarea de GitHub Actions [`prueba-carga.yml`](.github/workflows/prueba-carga.yml) se ejecuta cada día, en cada push a `main` y en cada pull request (también a mano desde la pestaña *Actions*). Abre `index.html` en Chromium sin interfaz con Playwright ([`prueba-carga.mjs`](.github/pruebas/prueba-carga.mjs)) y comprueba que aparecen la barra superior y la pantalla de bienvenida, que Tailwind aplica los estilos y que se puede crear un diagrama, sin errores en la consola ni recursos que fallen. Si falla, GitHub avisa por correo.
- **Para probar en local:** `npm install --no-save playwright && npx playwright install chromium && node .github/pruebas/prueba-carga.mjs`.
- **A tener en cuenta:** GitHub desactiva las tareas programadas de los repositorios sin actividad durante 60 días; si ocurre, basta con reactivarla en *Actions*.

### 2. ✅ Soporte táctil (tabletas) (hecho, versión 9.0)
- **Solución:** el lienzo, los elementos y los tiradores usan eventos de puntero, que cubren ratón, dedo y lápiz con el mismo código; con ratón todo funciona igual que antes. Con el dedo: tocar selecciona, el doble toque edita el texto y arrastrar con un dedo mueve elementos o, sobre el fondo, dibuja el recuadro de selección (como con el ratón). Con dos dedos se pellizca para el zoom y se desplaza el lienzo; al apoyar el segundo dedo se cancela lo que hacía el primero. Tras un toque, los tiradores de redimensionar y la zona sensible de las relaciones se agrandan.
- **Limitaciones:** reordenar diagramas arrastrándolos en la barra lateral sigue siendo solo con ratón; la selección múltiple con el dedo se hace con el recuadro (no hay Mayús).
- **Pruebas:** la prueba automática comprueba el gesto de pellizcar.

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

### 5. ✅ Notas UML (hecho, versión 9.0)
- **Solución:** herramienta **Nota** en los tres tipos de diagrama: rectángulo con la esquina doblada y fondo amarillo suave, con texto de varias líneas ajustado al ancho (se edita en un área de texto del panel o con doble clic: Intro, nueva línea; Ctrl/⌘+Intro, guardar). Se une a cualquier elemento con «Conectar con...» mediante un **enlace de nota** (línea discontinua sin flecha, recta por defecto). Una nota no se une a otra nota.
- **Revisión:** las notas y sus enlaces no cuentan (no son nodos del flujo de un DA ni relaciones que eviten el aviso de clase aislada).
- **Pruebas:** la prueba automática comprueba que un DA correcto con una nota sigue sin problemas; el kit de demostración incluye una nota en el diagrama de clases.

### 6. ✅ Notación de miembros estáticos y abstractos (hecho)
- Los atributos y métodos que empiezan por `static` se subrayan y los que empiezan por `abstract` van en cursiva, como en UML. El prefijo no se muestra en el diagrama y puede ir antes o después del símbolo de visibilidad (`+ static total: int` o `static + total: int`). El panel de propiedades lo recuerda bajo los campos de atributos y métodos.

### 7. ✅ Nombres de rol en los extremos de las asociaciones (DC) (hecho, versión 9.0)
- **Solución:** campos «Rol origen» y «Rol destino» en el panel de propiedades de las asociaciones (simples, dirigidas, agregaciones y composiciones). Cada rol se dibuja junto a su extremo, al lado contrario de la multiplicidad, como en UML, y el texto crece alejándose de la clase para no taparla. En asociaciones paralelas, donde el lado interior es estrecho, el rol va en el exterior a continuación de la multiplicidad. También se dibujan bien en relaciones con puntos de paso.
- **Asociaciones repetidas:** el aviso del panel solo salta si dos asociaciones entre las mismas clases coinciden en etiqueta y roles; con roles distintos (por ejemplo, *origen* y *destino*) ya se distinguen.
- **Kit y pruebas:** el kit de demostración usa roles en «Cliente realiza Orden», y la prueba automática comprueba que se dibujan.

### 8. ✅ Puntos de paso en las relaciones (hecho, versión 9.0)
- **Problema:** el trazado ortogonal siempre sale en horizontal, gira en el punto medio y entra en horizontal (o lo mismo en vertical). Un flujo de vuelta en un DA (por ejemplo, el retorno de un bucle de reintento) unía dos elementos de la misma columna, atravesaba los intermedios o se superponía con el flujo de ida; en diagramas de clases con muchas relaciones aparecían cruces que el alumno no podía deshacer.
- **Solución:**
  - **Puntos de paso:** doble clic (o doble toque) sobre la relación seleccionada añade un punto en el tramo más cercano, listo para arrastrar; se ajusta a la alineación de los puntos vecinos. Doble clic sobre un punto lo quita, y el botón **Enderezar** del panel de propiedades los quita todos. En trazado recto, la línea pasa por los puntos en orden; en ortogonal, cada punto es un codo y los codos intermedios se calculan solos.
  - **Flujos de vuelta automáticos (DA):** un flujo ortogonal sin puntos de paso que sube por la misma columna rodea los elementos intermedios por un lado y entra por el lateral del destino. Va por la derecha, salvo que a esa altura haya más elementos a la derecha (por ejemplo, la otra rama de una decisión).
  - **Coherencia:** los puntos se mueven con la relación cuando se mueven sus dos extremos (arrastre y flechas), se desplazan al duplicar y pegar, cuentan en deshacer y rehacer, en «Ajustar a pantalla», en las exportaciones y en los enlaces compartidos (que los validan). La versión 8.0 los ignora y dibuja la línea automática.
- **Código:** `routeWithWaypoints`, `routeReturnFlow` y `renderWaypointHandles` en `index.html`. La prueba automática comprueba ambos trazados con los diagramas «Bucle de reintento» y «Puntos de paso» de [`diagramas-revision.json`](.github/pruebas/diagramas-revision.json).

### 10. ✅ Condición de las relaciones `<<extend>>` (DCU) (hecho, versión 9.0)
- **Necesidad:** en UML 2 una extensión puede indicar la situación en la que el caso de uso extendido se ejecuta (por ejemplo, «el cliente pulsa Ayuda»), y en clase conviene anotarla.
- **Solución (primera parte):** campo «Condición de la extensión» en el panel de propiedades de las relaciones `<<extend>>`. Se dibuja en cursiva bajo la línea, entre llaves (`{el cliente pulsa Ayuda}`), porque en UML la condición es una restricción; los corchetes quedan para las guardas de los diagramas de actividad. Si el usuario escribe las llaves o corchetes, no se duplican. La revisión sugiere añadir la condición cuando falta.
- **Segunda parte (hecha):** la casilla «Mostrar en una nota (notación oficial de UML)» dibuja la condición en una nota unida con línea discontinua al punto medio de la relación, con `Condition: {…}` y, si se rellena el campo «Punto de extensión», `extension point: …`. La nota aparece por defecto en perpendicular a la relación y se puede arrastrar (cuenta en deshacer). Usa el mismo campo de condición, así que pasar de una notación a otra no exige rehacer nada.

### 11. ✅ Barras de bifurcación y unión más usables (DA) (hecho, versión 9.0)
- **Problema:** la barra se creaba vertical, aunque los DA del editor fluyen de arriba abajo; cambiarla obligaba a rehacerla con los tiradores, y todos los flujos apuntaban al centro de la barra, en abanico.
- **Solución:** la barra se crea horizontal (100 × 8 px); el botón **Girar** del panel de propiedades la pasa a vertical u horizontal sin moverla de sitio; solo tiene los dos tiradores de los extremos (se cambia la longitud, no el grosor) y una zona de clic más ancha que la barra. Cada flujo llega a la barra en perpendicular, en su propia posición: si el otro elemento queda dentro de la longitud de la barra, con un tramo recto. Las barras de los diagramas existentes no cambian.
- **Pruebas:** la prueba automática comprueba los flujos perpendiculares con el diagrama «Concurrencia» de [`diagramas-revision.json`](.github/pruebas/diagramas-revision.json).

### 12. ✅ Carriles más usables (DA) (hecho, versión 9.0)
- **Contenedores:** al mover un carril (o el límite del sistema en un DCU), con el ratón o con las flechas, se mueven también los elementos cuyo centro está dentro, con los puntos de paso de sus relaciones.
- **Carriles contiguos:** un carril que se acerca a menos de 15 px de otro se encaja a su lado, alineado arriba y con su altura, para formar la tabla de responsables; si se aleja, recupera su altura.
- **Cabecera:** el nombre va centrado; la casilla «Es una clase u objeto» lo subraya (notación de objeto, p. ej. «:Pedido»). El panel explica que hay que añadir un carril por responsable y acercarlos.
- **Revisión:** si hay carriles, avisa de las acciones que quedan fuera de todos. La prueba automática lo comprueba con el diagrama «Carriles».
- **Pendiente:** carriles horizontales (botón «Girar», con la cabecera a la izquierda y el nombre en vertical).

## Publicación en GitHub Pages (hecho)

- **Situación:** desde el 5 de noviembre de 2026 la aplicación se publica en GitHub Pages (`https://pfelipm.github.io/arquitecto-uml/`), desde la rama `main` y su raíz; cada push a `main` la actualiza. La versión que usan los alumnos es la de Google Sites (`umlsimple.pablofelip.online`), con el mismo código; Pages queda para probar las versiones en desarrollo.
- **Diferencias:** en Sites el código se ejecuta en un subdominio aleatorio (`…-atari-embeds.googleusercontent.com`), así que el navegador no conserva los diagramas entre visitas y los enlaces compartidos hay que pegarlos en «Abrir diagrama compartido». En Pages los diagramas se conservan y los enlaces se abren con un clic. La aplicación detecta dónde se ejecuta (`SHARE_OPENS_DIRECTLY` en `index.html`) y genera el enlace y el texto del modal de compartir que corresponden.
- **A tener en cuenta:** los diagramas guardados en cada dirección son independientes (para pasar de una a otra, exportar e importar una copia JSON). El almacenamiento del navegador es por dominio, no por ruta: se comparte con cualquier otro proyecto que se publique en `pfelipm.github.io`.
- **Versiones en desarrollo:** mientras los alumnos usen Sites, Pages puede publicar la rama de desarrollo (con `IS_DEV_BUILD = true` en `index.html`, que muestra un aviso), como se hizo con la 9.0. Al publicar la versión se fusiona en `main`, se pone `IS_DEV_BUILD` a `false` y Pages vuelve a publicar `main`. Para que una versión en desarrollo nunca modifique diagramas guardados con la estable en la misma dirección, conviene que guarde con otra clave de almacenamiento. Si algún día los alumnos usan Pages, la versión de desarrollo tendrá que ir en `/desarrollo/` mediante GitHub Actions.
- **Pendiente, sin fecha: llevar el subdominio `umlsimple.pablofelip.online` a Pages** (dominio propio en los ajustes de Pages, registro CNAME de `umlsimple` apuntando a `pfelipm.github.io` y verificación del dominio con un registro TXT). El código no cambia: los enlaces con ese dominio se abrirán con un clic. Pero el origen pasaría a ser otro y GitHub redirigiría `pfelipm.github.io/arquitecto-uml` al dominio nuevo, así que quien haya guardado diagramas en `pfelipm.github.io` perdería el acceso a ellos. Mientras los alumnos usen Sites (donde no se guardan) el riesgo es pequeño; si llegaran a usar Pages, las opciones son:
  1. Hacerlo entre cursos, cuando no haya diagramas vivos (recomendado).
  2. En una fecha anunciada, con los alumnos exportando su copia JSON antes e importándola después («Añadir»).
  3. Con una página de migración en otra ruta de `pfelipm.github.io` (que GitHub no redirige y que comparte almacenamiento con la aplicación) que lleve los diagramas al dominio nuevo, donde la aplicación ofrecería importarlos.
