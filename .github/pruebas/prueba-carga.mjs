// Prueba de carga de Arquitecto Simple UML.
// Sirve index.html en un servidor local, lo abre en Chromium sin interfaz y
// comprueba que la aplicación arranca: que aparecen la barra superior y la
// pantalla de bienvenida, que se puede crear un diagrama, que «Revisar diagrama»
// detecta los errores de diagramas-revision.json, que el gesto de pellizcar
// amplía el zoom y que no hay errores en la consola ni recursos de CDN que
// fallen.
// Uso: node .github/pruebas/prueba-carga.mjs (desde la raíz del repositorio).

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const RAIZ = resolve(process.cwd());
const TIPOS = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
const TIEMPO_MAX = 60_000;

const servidor = createServer(async (req, res) => {
    const ruta = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const archivo = join(RAIZ, ruta === '/' ? 'index.html' : ruta);
    if (!archivo.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
    try {
        const datos = await readFile(archivo);
        res.writeHead(200, { 'Content-Type': TIPOS[extname(archivo)] || 'application/octet-stream' }).end(datos);
    } catch {
        res.writeHead(404).end();
    }
});
await new Promise(ok => servidor.listen(0, '127.0.0.1', ok));
const url = `http://127.0.0.1:${servidor.address().port}/`;

const errores = [];
const navegador = await chromium.launch();
try {
    const pagina = await navegador.newPage();
    pagina.on('pageerror', e => errores.push(`Excepción: ${e.message}`));
    pagina.on('console', m => { if (m.type() === 'error') errores.push(`Consola: ${m.text()}`); });
    pagina.on('requestfailed', r => errores.push(`Recurso no cargado: ${r.url()} (${r.failure()?.errorText})`));
    pagina.on('response', r => { if (r.status() >= 400) errores.push(`Recurso con error ${r.status()}: ${r.url()}`); });

    console.log(`Abriendo ${url}`);
    await pagina.goto(url, { waitUntil: 'load', timeout: TIEMPO_MAX });

    // 1. La aplicación React se ha montado: barra superior y pantalla de bienvenida.
    await pagina.locator('#root span', { hasText: 'Arquitecto Simple UML' }).first().waitFor({ timeout: TIEMPO_MAX });
    console.log('✓ Barra superior visible');
    await pagina.getByText('Bienvenido a Arquitecto Simple UML').waitFor({ timeout: TIEMPO_MAX });
    console.log('✓ Pantalla de bienvenida visible');

    // 2. Tailwind ha aplicado estilos (si el CDN falla, la barra no tiene fondo).
    const conEstilos = await pagina.evaluate(() => {
        const span = [...document.querySelectorAll('#root span')].find(s => s.textContent === 'Arquitecto Simple UML');
        return getComputedStyle(span).fontWeight === '700';
    });
    if (!conEstilos) errores.push('Tailwind no ha aplicado los estilos');
    else console.log('✓ Estilos de Tailwind aplicados');

    // 3. Se puede crear un diagrama y aparece en el lienzo.
    await pagina.locator('button[title="Nuevo diagrama (Raíz)"]').click();
    await pagina.getByText('Crear nuevo diagrama').waitFor({ timeout: 10_000 });
    await pagina.getByRole('button', { name: /Clases/ }).click();
    await pagina.getByText('Bienvenido a Arquitecto Simple UML').waitFor({ state: 'detached', timeout: 10_000 });
    console.log('✓ Diagrama creado');

    // 4. «Revisar diagrama» detecta los errores de los diagramas de prueba y no protesta ante uno correcto.
    const datos = JSON.parse(await readFile(join(RAIZ, '.github/pruebas/diagramas-revision.json'), 'utf8'));
    await pagina.evaluate(d => localStorage.setItem('arquitecto_data', JSON.stringify({ folders: d.folders, darkMode: false, activeDiagramId: null })), datos);
    await pagina.reload({ waitUntil: 'load' });
    await pagina.getByText('Pruebas de revisión').waitFor({ timeout: TIEMPO_MAX });
    const esperado = {
        'Revisión DC (con errores)': ['Herencia circular', 'no está marcada como abstracta', 'no declara: Cobrar', 'hereda de varias clases', 'parte, por composición, de varios todos'],
        'Revisión DCU (con errores)': ['Inclusión circular', 'dentro del límite del sistema', 'no está asociado a ningún actor', 'está fuera del límite'],
        'Revisión DA (con errores)': ['Falta el nodo inicial', 'De un nodo final no puede salir', 'sin condición de guarda', 'llegan 2 flujos', '1 bifurcación y 0 uniones'],
        'Revisión DA (correcto)': ['No se han encontrado problemas'],
    };
    let panelAbierto = false;
    for (const [diagrama, mensajes] of Object.entries(esperado)) {
        await pagina.getByText(diagrama, { exact: true }).click();
        if (!panelAbierto) { await pagina.keyboard.press('F7'); panelAbierto = true; }
        const panel = pagina.locator('aside[aria-label="Revisión del diagrama"]');
        await panel.waitFor({ timeout: 10_000 });
        await pagina.waitForTimeout(300);
        const texto = await panel.innerText();
        const faltan = mensajes.filter(m => !texto.includes(m));
        if (faltan.length) errores.push(`Revisión de «${diagrama}»: no aparece ${faltan.map(m => `«${m}»`).join(', ')}`);
    }
    console.log('✓ Revisión del diagrama comprobada');

    // 5. Pantalla táctil: pellizcar con dos dedos amplía el zoom.
    const zoomTactil = await pagina.evaluate(async () => {
        const esperar = ms => new Promise(r => setTimeout(r, ms));
        const zoom = () => [...document.querySelectorAll('span')].find(s => /^\d+%$/.test(s.textContent))?.textContent;
        const svg = document.querySelector('svg.touch-none'), r = svg.getBoundingClientRect();
        const evento = (tipo, x, y, id) => svg.dispatchEvent(new PointerEvent(tipo, { bubbles: true, cancelable: true, pointerId: id, pointerType: 'touch', clientX: x, clientY: y, button: 0, buttons: tipo === 'pointerup' ? 0 : 1 }));
        const cx = r.x + r.width / 2, cy = r.y + r.height / 2, antes = zoom();
        evento('pointerdown', cx - 50, cy, 1); await esperar(50);
        evento('pointerdown', cx + 50, cy, 2); await esperar(50);
        for (let i = 1; i <= 5; i++) { evento('pointermove', cx - 50 - 10 * i, cy, 1); evento('pointermove', cx + 50 + 10 * i, cy, 2); await esperar(30); }
        evento('pointerup', cx - 100, cy, 1); evento('pointerup', cx + 100, cy, 2); await esperar(100);
        return { antes, despues: zoom() };
    });
    if (zoomTactil.antes !== '100%' || zoomTactil.despues !== '200%') errores.push(`Pellizcar no amplía el zoom como se espera (de ${zoomTactil.antes} a ${zoomTactil.despues}; se esperaba de 100% a 200%)`);
    else console.log('✓ Gesto de pellizcar comprobado');

    // Margen para errores asíncronos tardíos.
    await pagina.waitForTimeout(1000);
} catch (e) {
    errores.push(`Fallo en la prueba: ${e.message}`);
} finally {
    await navegador.close();
    servidor.close();
}

if (errores.length) {
    console.error(`\n✗ La aplicación no arranca correctamente (${errores.length} problema(s)):`);
    for (const e of errores) console.error(`  - ${e}`);
    process.exit(1);
}
console.log('\n✓ La aplicación arranca correctamente');
