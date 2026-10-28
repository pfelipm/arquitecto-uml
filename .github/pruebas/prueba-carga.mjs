// Prueba de carga de Arquitecto Simple UML.
// Sirve index.html en un servidor local, lo abre en Chromium sin interfaz y
// comprueba que la aplicación arranca: que aparecen la barra superior y la
// pantalla de bienvenida, que se puede crear un diagrama y que no hay errores
// en la consola ni recursos de CDN que fallen.
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
