![Arquitecto Simple UML Banner](readme-archivos/banner.svg)

# Arquitecto Simple UML

[![Prueba de carga](https://github.com/pfelipm/arquitecto-uml/actions/workflows/prueba-carga.yml/badge.svg)](https://github.com/pfelipm/arquitecto-uml/actions/workflows/prueba-carga.yml)

**Arquitecto Simple UML (AS-UML)** es un editor de UML ligero, experimental y diseñado con fines didácticos para crear diagramas de manera sencilla. Es una Single Page Application (SPA) contenida en un único archivo HTML, lo que facilita su distribución y uso sin instalaciones complejas.

## Demo Online

Puedes utilizar el editor sin limitaciones y directamente en tu navegador accediendo a:

👉 **[https://umlsimple.pablofelip.online](https://umlsimple.pablofelip.online)**

## Características Principales

*   **Tipos de Diagramas Soportados:**
    *   **DCU:** Diagramas de Casos de Uso (Actores, Casos de uso, Límites).
        
        ![Ejemplo DCU](readme-archivos/DCU.png)
    *   **DC:** Diagramas de Clases (Clases, Interfaces, Relaciones). Admite varias asociaciones entre las mismas clases (por ejemplo, *origen* y *destino*), que se dibujan separadas. Los miembros que empiezan por `static` se muestran subrayados y los que empiezan por `abstract`, en cursiva, siguiendo la notación UML (por ejemplo, `+ static total: int`).
        
        ![Ejemplo DC](readme-archivos/DC.png)
    *   **DA:** Diagramas de Actividad (Inicio, Fin, Actividades, Decisión / Fusión, Bifurcación / Unión, Carriles).
        
        ![Ejemplo DA](readme-archivos/DA.png)
*   **Revisar diagrama:** El botón **Revisar** (o **F7**) abre un panel que analiza el diagrama abierto y señala errores UML habituales, con fines didácticos: casos de uso sin actor o fuera del límite del sistema, herencias circulares, clases con métodos abstractos que no están marcadas como abstractas, interfaces sin implementar, diagramas de actividad sin nodo inicial, decisiones sin guardas, nodos inalcanzables, etc. Los problemas se clasifican en errores, avisos y sugerencias de estilo (que se pueden ocultar); al pulsar uno, se seleccionan en el lienzo los elementos afectados. La revisión se actualiza mientras editas y nunca modifica el diagrama.
*   **Gestión de Proyectos:** Organización mediante carpetas y múltiples diagramas.
*   **Persistencia Local:** Guardado automático en el navegador (`localStorage`); al volver, se reabre el último diagrama abierto. En la versión insertada en Google Sites el navegador no conserva los datos entre visitas, así que la aplicación lo avisa y recuerda exportar una copia JSON antes de salir.
*   **Compartir por enlace:** El botón **Compartir** genera un enlace que contiene el diagrama abierto (comprimido y sin pasar por ningún servidor). Quien lo recibe lo pega en **Abrir diagrama compartido** y obtiene una copia en la carpeta «Diagramas compartidos», sin que se modifiquen sus otros diagramas. Si la aplicación se abre directamente (no insertada en Google Sites), basta con abrir el enlace.
*   **Importar/Exportar:** Copias de seguridad completas en formato JSON (incluye un [kit de demostración](readme-archivos/kit-demo.json) para pruebas). Al importar una copia, puedes **añadir** sus carpetas a las tuyas o **reemplazar** todo tu contenido. También permite exportar diagramas como imagen PNG en alta resolución o como imagen vectorial SVG, nítida a cualquier tamaño en documentos, presentaciones y LaTeX.
*   **Interfaz Moderna:** Diseño limpio con soporte para **modo oscuro**, zoom hacia el cursor, guías de alineación inteligentes y atajos de teclado y ratón (consulta la tabla siguiente o pulsa **?** en la aplicación).

## Atajos de Teclado y Ratón

En macOS, usa ⌘ en lugar de Ctrl.

| Atajo | Acción |
|---|---|
| **Ctrl+Z** | Deshacer |
| **Ctrl+Mayús+Z** · **Ctrl+Y** | Rehacer |
| **Ctrl+C** · **Ctrl+X** · **Ctrl+V** | Copiar, cortar y pegar elementos (también entre diagramas del mismo tipo) |
| **Ctrl+D** | Duplicar la selección |
| **Supr** · **Retroceso** | Eliminar la selección |
| **Ctrl+A** | Seleccionar todos los elementos |
| **Esc** | Cancelar la conexión o la herramienta activa; si no hay ninguna, deseleccionar |
| **Flechas** / **Mayús+flechas** | Mover la selección 1 px / 10 px |
| **Mayús+clic** | Añadir o quitar un elemento de la selección |
| **Arrastrar en el fondo** | Seleccionar con un recuadro (con **Mayús**, añadir a la selección) |
| **Doble clic** | Editar el texto de un elemento |
| **Rueda** / **Mayús+rueda** | Desplazar el lienzo (en vertical / en horizontal) |
| **Ctrl+rueda** | Zoom hacia el cursor |
| **Ctrl+0** | Zoom al 100 % |
| **F7** | Mostrar u ocultar el panel de revisión del diagrama |
| **Botón central** · **Alt+arrastrar** | Mover el lienzo (en algunos escritorios Linux, Alt+arrastrar mueve la ventana) |
| **?** | Mostrar u ocultar la ayuda de atajos |

En tabletas y pantallas táctiles: **toca** para seleccionar, haz **doble toque** para editar el texto, **arrastra con un dedo** para mover elementos (o, sobre el fondo, seleccionar con un recuadro), **pellizca** para el zoom y **arrastra con dos dedos** para desplazar el lienzo. Las acciones que en el ordenador se hacen con el teclado (eliminar, duplicar, conectar) tienen su botón en el panel de propiedades.

## Tecnologías Utilizadas

Esta herramienta funciona directamente en el navegador sin backend ("serverless") gracias a:
*   **React 18:** Cargado vía CDN.
*   **Tailwind CSS:** Para el estilizado de la interfaz.
*   **Babel Standalone:** Transpilación de JSX/TypeScript en tiempo de ejecución.
*   **Lucide React:** Iconografía moderna.

## Uso

Simplemente abre el archivo `index.html` en cualquier navegador web moderno. Aunque no se requiere instalar dependencias locales (Node.js, npm, etc.), **se necesita conexión a Internet** para descargar las bibliotecas y estilos a través de CDN. Una [prueba automática](.github/workflows/prueba-carga.yml) comprueba cada día que la aplicación sigue arrancando con las versiones que sirven los CDN.

## Autor

Desarrollado por [Pablo Felip Monferrer](https://www.linkedin.com/in/pfelipm) como herramienta de apoyo para la asignatura de Ingeniería del Software en el grado de Diseño y Desarrollo de Videojuegos de la Universitat Jaume I (UJI).

## Licencia

Este proyecto se distribuye bajo los términos del archivo [LICENSE](LICENSE).
