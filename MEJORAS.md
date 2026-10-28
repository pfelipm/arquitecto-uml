# Mejoras propuestas

Ideas para próximas versiones de Arquitecto Simple UML, recogidas tras la versión 7.7 "Compartir" (28 de octubre de 2026). Todas son compatibles con la distribución en un único archivo `index.html` insertado en Google Sites, salvo que se indique lo contrario.

Esfuerzo orientativo: **bajo** (unas horas), **medio** (un día aproximadamente), **alto** (varios días).

## Prioritarias

### 1. Prueba automática diaria de carga
- **Problema:** la aplicación depende de bibliotecas cargadas desde CDN. En octubre de 2026 la URL sin versión de Babel pasó a servir Babel 8 y la aplicación quedó en blanco sin que nadie lo detectara. Ahora todas las versiones están fijadas, pero un CDN puede seguir fallando o retirar una versión.
- **Propuesta:** una tarea de GitHub Actions programada (diaria y en cada push) que abra `index.html` en un navegador sin interfaz (Playwright o Puppeteer) y compruebe que la aplicación arranca: que aparece la barra superior y que no hay errores en la consola. Si falla, GitHub avisa por correo.
- **Alcance:** un archivo en `.github/workflows/`; no toca la aplicación.
- **Esfuerzo:** bajo.

### 2. Soporte táctil (tabletas y Chromebooks)
- **Problema:** la interacción usa solo eventos de ratón (`onMouseDown`, `onMouseMove`, `onMouseUp`), así que en pantallas táctiles no se pueden seleccionar, mover ni redimensionar elementos, ni desplazar el lienzo.
- **Propuesta:** sustituirlos por eventos de puntero (`onPointerDown`, etc.), que cubren ratón, dedo y lápiz, y añadir el gesto de pellizcar para hacer zoom y el de arrastrar con dos dedos para desplazar el lienzo.
- **Esfuerzo:** medio.

### 3. «Revisar diagrama»: comprobaciones UML con fines didácticos
- **Propuesta:** un botón que analice el diagrama abierto y muestre una lista de avisos (sin bloquear nada). Al pulsar un aviso, se selecciona el elemento afectado.
- **Comprobaciones posibles:**
  - **DCU:** casos de uso sin ningún actor asociado; actores sin casos de uso; casos de uso fuera del límite del sistema.
  - **DC:** clases sin nombre o con nombres repetidos; herencias circulares; clases abstractas sin subclases.
  - **DA:** falta el nodo de inicio o de fin; decisiones con salidas sin condición (guarda); nodos inalcanzables desde el inicio; acciones a las que llegan varios flujos sin nodo de fusión (en UML 2 se interpretan como unión implícita).
- **Esfuerzo:** medio.

### 4. Exportar a SVG
- Además de PNG, exportar el diagrama como imagen vectorial, nítida a cualquier tamaño en documentos, presentaciones y LaTeX. El diagrama ya se dibuja en SVG; se puede reutilizar la lógica de la exportación a PNG (`exportPNGNow`).
- **Esfuerzo:** bajo.

### 5. Notas UML
- Nuevo elemento «Nota» (rectángulo con la esquina doblada) unido con una línea discontinua al elemento que comenta. Útil en enunciados y correcciones. Disponible en los tres tipos de diagrama.
- **Esfuerzo:** medio.

### 6. Notación de miembros estáticos y abstractos
- Subrayar atributos y métodos estáticos y poner en cursiva los métodos abstractos, siguiendo la notación UML. Por ejemplo, mediante un prefijo al escribirlos (`static`, `abstract`) que no se muestre en el diagrama.
- **Esfuerzo:** bajo.

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
