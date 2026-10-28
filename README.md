# ⚔️ Aion 2 Craft & Class Guides (Azphel 12106)

Plataforma interactiva bilingüe (**Español ⇄ Inglés**) desarrollada en **Next.js 15 + TypeScript Estricto + Tailwind CSS + IndexedDB (`Dexie.js`)** para el servidor **NA East - Azphel (Asmodian — ID: `12106`)**.

## 🚀 Características Principales
- **🗄️ Base de Datos IndexedDB en el Navegador:** Indexa localmente los **6.637 ítems (EN/ES)**, **440 recetas del cliente (`Client 2.0.8.0`)**, **33 precios fijos de PNJ**, **163 conversiones de Substance Morph** y los **732 precios del Broker de Azphel**.
- **🔄 Gestión de Caché e IndexedDB en un Clic:** Botones integrados para refrescar precios en vivo desde la API, recargar la semilla base o vaciar/eliminar por completo la base de datos IndexedDB.
- **🧱 Arquitectura Limpia con Patrón Repository + Adapters:** Desacoplamiento total entre las APIs externas (`aion2.exchange`, `aion2.gg`) y el dominio de la aplicación mediante interfaces estrictamente tipadas (`IMarketRepository`, `IRecipeRepository`, `IItemCatalogRepository`).
- **📊 Auditoría Matemática en 3 Escenarios:**
  - **Escenario A:** Compra del 100% de materiales en Broker + PNJ.
  - **Escenario B (Coste de Oportunidad):** Valor Añadido real con materiales propios frente a venderlos crudos en el Broker.
  - **Escenario C (Conversión de Vinculados / *Bound*):** Calculadora del método del 20% Proc en Piedras de Maná y Alma.
- **🛡️ Guards de Versión de Node.js y NVM:** Configurados en `.nvmrc` (`22.14.0`), `.node-version`, `.npmrc` (`engine-strict=true`) y `scripts/check-node-version.mjs`.

## 🛠️ Requisitos y Ejecución Local

```bash
nvm install 22.14.0
nvm use 22.14.0
npm install
npm run dev
```
