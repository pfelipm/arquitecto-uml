# Mejoras propuestas

Ideas para próximas versiones de Arquitecto Simple UML, recogidas tras la versión 7.7 "Compartir" (28 de octubre de 2026). Todas son compatibles con la distribución en un único archivo `index.html` insertado en Google Sites, salvo que se indique lo contrario.

Esfuerzo orientativo: **bajo** (unas horas), **medio** (un día aproximadamente), **alto** (varios días).

## Prioritarias

### 1. ✅ Prueba automática diaria de carga (hecho)
- **Problema:** la aplicación depende de bibliotecas cargadas desde CDN. En octubre de 2026 la URL sin versión de Babel pasó a servir Babel 8 y la aplicación quedó en blanco sin que nadie lo detectara. Ahora todas las versiones están fijadas, pero un CDN puede seguir fallando o retirar una versión.
- **Solución:** la tarea de GitHub Actions [`prueba-carga.yml`](.github/workflows/prueba-carga.yml) se ejecuta cada día, en cada push a `main` y en cada pull request (también a mano desde la pestaña *Actions*). Abre `index.html` en Chromium sin interfaz con Playwright ([`prueba-carga.mjs`](.github/pruebas/prueba-carga.mjs)) y comprueba que aparecen la barra superior y la pantalla de bienvenida, que Tailwind aplica los estilos y que se puede crear un diagrama, sin errores en la consola ni recursos que fallen. Si falla, GitHub avisa por correo.
- **Para probar en local:** `npm install --no-save playwright && npx playwright install chromium && node .github/pruebas/prueba-carga.mjs`.
- **A tener en cuenta:** GitHub desactiva las tareas programadas de los repositorios sin actividad durante 60 días; si ocurre, basta con reactivarla en *Actions*.

### 2. Soporte táctil (tabletas y Chromebooks)
- **Problema:** la interacción usa solo eventos de ratón (`onMouseDown`, `onMouseMove`, `onMouseUp`), así que en pantallas táctiles no se pueden seleccionar, mover ni redimensionar elementos, ni desplazar el lienzo.
- **Propuesta:** sustituirlos por eventos de puntero (`onPointerDown`, etc.), que cubren ratón, dedo y lápiz, y añadir el gesto de pellizcar para hacer zoom y el de arrastrar con dos dedos para desplazar el lienzo.
- **Esfuerzo:** medio.

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

### 5. Notas UML
- Nuevo elemento «Nota» (rectángulo con la esquina doblada) unido con una línea discontinua al elemento que comenta. Útil en enunciados y correcciones. Disponible en los tres tipos de diagrama.
- **Esfuerzo:** medio.

### 6. ✅ Notación de miembros estáticos y abstractos (hecho)
- Los atributos y métodos que empiezan por `static` se subrayan y los que empiezan por `abstract` van en cursiva, como en UML. El prefijo no se muestra en el diagrama y puede ir antes o después del símbolo de visibilidad (`+ static total: int` o `static + total: int`). El panel de propiedades lo recuerda bajo los campos de atributos y métodos.

## Otras mejoras

### 7. Nombres de rol en los extremos de las asociaciones (DC)
- Ahora cada asociación tiene multiplicidades y una etiqueta central. UML sitúa además el nombre del rol en cada extremo (por ejemplo, *origen* y *destino* junto a Aeropuerto). Se añadirían dos campos al panel de propiedades y se dibujarían junto a las multiplicidades.
- **Esfuerzo:** bajo-medio.

### 8. Puntos de paso en las relaciones
- Permitir añadir y arrastrar puntos intermedios en las relaciones para trazarlas a mano y evitar cruces. El modelo de datos ya incluye un campo `waypoints` en `EdgeData` que no se usa todavía.
- **Esfuerzo:** medio-alto.

### 9. Diagramas de secuencia
- Un cuarto tipo de diagrama, muy habitual en Ingeniería del Software: líneas de vida, mensajes síncronos y asíncronos, respuestas y fragmentos combinados (`alt`, `loop`). Es la mejora más costosa, porque su disposición es temporal y distinta de la de los otros tres tipos.
- **Esfuerzo:** alto.

## Decisión pendiente: publicación en GitHub Pages

No es una función nueva, pero condiciona varias de las anteriores.

- **Situación actual:** la versión oficial está insertada como código en Google Sites (`umlsimple.pablofelip.online`). Sites ejecuta ese código en un subdominio aleatorio que cambia en cada carga (`…-atari-embeds.googleusercontent.com`), por lo que el navegador no conserva los diagramas entre visitas. La aplicación lo avisa y recuerda exportar una copia JSON. Además, los enlaces compartidos no se abren con un clic: hay que pegarlos en «Abrir diagrama compartido».
- **Propuesta:** publicar `index.html` en GitHub Pages (`pfelipm.github.io/arquitecto-uml`) e insertarlo en Sites por URL en lugar de por código. Sites seguiría siendo la dirección oficial, pero la aplicación tendría un origen estable.
- **Ventajas:**
  - Los diagramas se conservarían entre visitas.
  - Los enlaces compartidos se abrirían con un clic.
  - Cada push a `main` actualizaría la aplicación sin tener que pegar código en Sites.
- **A tener en cuenta:**
  - Los diagramas guardados en cada dirección son independientes; para pasar de una a otra hay que exportar e importar una copia JSON.
  - Hay que comprobar en la práctica que la inserción por URL en Sites conserva los datos.
- **Pasos:**
  1. Activar Pages en GitHub: Settings → Pages → *Deploy from a branch* → `main` / *(root)*.
  2. Cambiar la base de los enlaces compartidos (`APP_URL` y `getShareBaseUrl` en `index.html`).
  3. Sustituir en Sites el bloque de código por una inserción de URL.
