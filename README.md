# ⚔️ Aion 2 — SangreLatina Community Hub: Crafting, 8 Class Guides, Shugo.gg Inspector & Tools

Plataforma interactiva bilingüe (**Español ⇄ Inglés**) desarrollada en **Next.js 15 + TypeScript Estricto (`Zero-Any`) + Tailwind CSS + IndexedDB (`Dexie.js`)** para la legión **SangreLatina** y toda la comunidad de **Aion 2** (configurada por defecto en **NA East - Azphel Asmodian `#12106`**, con selector de servidor en vivo).

🌐 **Demo en Vivo (GitHub Pages):** [https://duboox.github.io/aion2-craft-n-class-guides/](https://duboox.github.io/aion2-craft-n-class-guides/)

## 🚀 Características Principales (v2.0)

1. **📊 Auditor de Crafteo & Mercado (242 Recetas Reales del Cliente 2.0.8.0):**
   - Incluye las **22 Recetas Meta Auditadas** y **todas las 242 recetas del cliente** en todas las profesiones (**Herrería, Orfebrería, Sastrería, Alquimia, Cocina, Molienda x30, Materiales Balaur y Conversión de Vinculados**).
   - **Columna única dinámica de Nombre** que alterna automáticamente entre Español (`es`) e Inglés (`en`).
   - Evalúa los 3 escenarios reales: **Escenario A** (Compra 100% en Broker), **Escenario B** (Valor Añadido con materiales propios vs. vender crudo) y **Escenario C** (Conversión de materiales *Bound*).
2. **⚔️ Guías Maestras de las 8 Clases (`PvE` & `PvP`):**
   - Diseño oscuro y dorado inspirado en `aion2-guides.info` para **Cantor (`Chanter`), Gladiador (`Gladiator`), Templario (`Templar`), Asesino (`Assassin`), Explorador (`Ranger`), Hechicero (`Sorcerer`), Elementalista (`Elementalist`) y Clérigo (`Cleric`)**.
   - Iconos oficiales, chips de especialización (`Lv 8`, `Lv 12`, `Lv 16`), Estigmas, Prioridad de Estadísticas, Cartas de Arcana y configuración de **Ranuras en Línea vs. Macros**.
3. **🏆 Inspector de Personajes en Vivo (`Shugo.gg`) & Leaderboard (Privacidad 100% Local):**
   - Guarda tus personajes (`Main` y `Alt`) y su estado de **Membresía Activa (2 Cubos vs 1 Cubo)** de forma privada en tu navegador (`IndexedDB`).
   - Consulta en tiempo real el perfil en `shugo.gg`, mostrando **CP**, **GS**, **Posición en el Leaderboard por CP y por GS**, Equipo equipado (`+N`, `◆`) y **Recomendaciones Inteligentes de Progresión**.
4. **🛠️ Centro de Herramientas, Mazmorras (`Trascendencia Tier 1–4`) y Conversión `Kinah ➔ Quna`:**
   - **Calculadora `Kinah ➔ Quna`** con el peaje del +10% de *Substance Morph*.
   - **Tabla y Simulador de Conquista y Trascendencia (`Tier 1` a `Tier 4`)**, incluyendo los **960.000 Kinah** exactos de **Trascendencia Tier 4** al abrir 2 cubos (`80 Odyle`).
   - Accesos directos integrados a `questlog.gg/skill-builder`, `questlog.gg/server-status` y `shugo.gg/database`.
5. **📚 Glosario para Jugadores Nuevos & Checklist Interactivo:**
   - Explicación clara de `GS vs CP`, `Golpe % (Double Chance)`, `Ruptura ◆`, `Pity (+5%)`, `Impresión de Alma` y `Pet Insight`.

## 🛠️ Requisitos y Ejecución Local

```bash
nvm install 22.14.0
nvm use 22.14.0
npm install
npm run dev
```
