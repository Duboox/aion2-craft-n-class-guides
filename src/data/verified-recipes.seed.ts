/**
 * Catálogo curado de recetas reales extraídas del cliente 2.0.8.0 (aion2.gg).
 * Todas las recetas están estrictamente tipadas con sus tasas de éxito reales, precios fijos de PNJ y procs.
 */
import type { VerifiedRecipe } from '../domain/models/types';

export const VERIFIED_RECIPES_SEED: readonly VerifiedRecipe[] = [
  // ============================================================================
  // 1. MOLIENDA Y PROCESAMIENTO EN ALQUIMIA (100% ÉXITO BASE, 0 KINAH PNJ)
  // ============================================================================
  {
    recipeId: '315021005_30',
    productId: 630532005,
    nameEn: 'Spiritstone Powder',
    nameEs: 'Polvo de piedra espiritual (x30)',
    category: 'Molienda',
    professionEs: 'Alquimia Lv. 25',
    professionEn: 'Alchemy Lv. 25',
    levelReq: 25,
    productQuantity: 30,
    baseSuccessRate: 1.0,
    ingredients: [
      {
        itemId: 610400001,
        nameEn: 'Spiritstone',
        nameEs: 'Piedra espiritual',
        quantity: 10,
        sourceType: 'BROKER',
      },
    ],
    notesEs:
      '100% de éxito base y 0 Kinah de coste PNJ. Multiplica x3.7 el valor de tus piedras espirituales sin riesgo de fallo.',
    notesEn:
      '100% base success rate and 0 NPC Kinah cost. Multiplies your Spiritstones value by 3.7x with zero failure risk.',
  },
  {
    recipeId: '315021006_30',
    productId: 630544002,
    nameEn: 'Asvata Paper',
    nameEs: 'Hoja de papel de asvata (x30)',
    category: 'Molienda',
    professionEs: 'Alquimia Lv. 25',
    professionEn: 'Alchemy Lv. 25',
    levelReq: 25,
    productQuantity: 30,
    baseSuccessRate: 1.0,
    ingredients: [
      {
        itemId: 610560004,
        nameEn: 'Asvata Log',
        nameEs: 'Tronco de asvata',
        quantity: 10,
        sourceType: 'BROKER',
      },
    ],
    notesEs:
      '100% de éxito base y 0 coste PNJ. Convierte 10 troncos en 30 hojas de papel de alta demanda para pergaminos.',
    notesEn:
      '100% base success rate and 0 NPC cost. Converts 10 logs into 30 high-demand paper sheets for scrolls.',
  },
  {
    recipeId: '315021002_30',
    productId: 630532002,
    nameEn: 'Ruby Powder',
    nameEs: 'Polvo de rubí (x30)',
    category: 'Molienda',
    professionEs: 'Alquimia Lv. 45',
    professionEn: 'Alchemy Lv. 45',
    levelReq: 45,
    productQuantity: 30,
    baseSuccessRate: 1.0,
    ingredients: [
      {
        itemId: 610300010,
        nameEn: 'Ruby Gemstone',
        nameEs: 'Rubí en bruto',
        quantity: 10,
        sourceType: 'BROKER',
      },
    ],
    notesEs:
      '100% de éxito base. Rentable tanto comprando el rubí en bruto como moliendo los rubíes recolectados por ti.',
    notesEn:
      '100% base success rate. Profitable both buying raw Ruby on the Broker or grinding your own gathered rubies.',
  },
  {
    recipeId: '315021003_30',
    productId: 630532003,
    nameEn: 'Sapphire Powder',
    nameEs: 'Polvo de zafiro (x30) [TRAMPA]',
    category: 'Molienda',
    professionEs: 'Alquimia Lv. 45',
    professionEn: 'Alchemy Lv. 45',
    levelReq: 45,
    productQuantity: 30,
    baseSuccessRate: 1.0,
    ingredients: [
      {
        itemId: 610300013,
        nameEn: 'Sapphire Gemstone',
        nameEs: 'Zafiro en bruto',
        quantity: 10,
        sourceType: 'BROKER',
      },
    ],
    notesEs:
      '⚠️ TRAMPA DE VALOR: El Zafiro en bruto vale mucho más entero (~5.500 Kinah) para Joyería que molido en polvo (850 Kinah). ¡Nunca muelas Zafiros!',
    notesEn:
      '⚠️ VALUE TRAP: Raw Sapphire Gemstone is worth far more whole (~5,500 Kinah) for Jewelcrafting than ground into powder (850 Kinah). Never grind Sapphires!',
  },

  // ============================================================================
  // 2. MATERIALES DRACÓNICOS / BALAUR (95.2% A 100% ÉXITO BASE)
  // ============================================================================
  {
    recipeId: '315024003',
    productId: 630510018,
    nameEn: 'Enhanced Durable Balaur Scale',
    nameEs: 'Escama firme de Balaur mejorada',
    category: 'Balaur',
    professionEs: 'Alquimia Lv. 80 (100%) / Orfebrería (95.2%)',
    professionEn: 'Alchemy Lv. 80 (100%) / Handicrafting (95.2%)',
    levelReq: 80,
    productQuantity: 1,
    baseSuccessRate: 1.0,
    ingredients: [
      {
        itemId: 620100001,
        nameEn: "Balaur's Essence",
        nameEs: 'Esencia de Balaur',
        quantity: 2,
        sourceType: 'BROKER',
      },
      {
        itemId: 630520009,
        nameEn: 'Superior Dragon Scale Hardener (Bound)',
        nameEs: 'Endurecedor de escamas de dragón superior (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 6550,
      },
    ],
    notesEs:
      '👑 Top 1 Balaur. En Alquimia (ID 315024003) tiene 100% de éxito base; en Orfebrería tiene 95.2%. Añade +32k Kinah de valor sobre vender las 2 esencias crudas.',
    notesEn:
      '👑 Top 1 Balaur refinement. In Alchemy (ID 315024003) it has 100% base success; in Handicrafting 95.2%. Adds +32k Kinah over selling raw Essences.',
  },
  {
    recipeId: '315024002',
    productId: 630510017,
    nameEn: 'Enhanced Hard Balaur Scale',
    nameEs: 'Escama dura de Balaur mejorada',
    category: 'Balaur',
    professionEs: 'Alquimia Lv. 65 (100%) / Orfebrería (95.2%)',
    professionEn: 'Alchemy Lv. 65 (100%) / Handicrafting (95.2%)',
    levelReq: 65,
    productQuantity: 1,
    baseSuccessRate: 1.0,
    ingredients: [
      {
        itemId: 620100001,
        nameEn: "Balaur's Essence",
        nameEs: 'Esencia de Balaur',
        quantity: 2,
        sourceType: 'BROKER',
      },
      {
        itemId: 630520008,
        nameEn: 'Intermediate Dragon Scale Hardener (Bound)',
        nameEs: 'Endurecedor de escamas de dragón intermedio (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 5600,
      },
    ],
    notesEs:
      'El material dracónico de mayor rotación diaria en Azphel. Rentable tanto comprando esencias como procesando las tuyas.',
    notesEn:
      'Highest daily volume draconic material in Azphel. Profitable both buying Essences or refining your own.',
  },
  {
    recipeId: '315024001',
    productId: 630510016,
    nameEn: 'Enhanced Thick Balaur Scale',
    nameEs: 'Escama gruesa de Balaur mejorada',
    category: 'Balaur',
    professionEs: 'Alquimia Lv. 51 (100%) / Orfebrería (95.2%)',
    professionEn: 'Alchemy Lv. 51 (100%) / Handicrafting (95.2%)',
    levelReq: 51,
    productQuantity: 1,
    baseSuccessRate: 1.0,
    ingredients: [
      {
        itemId: 620100001,
        nameEn: "Balaur's Essence",
        nameEs: 'Esencia de Balaur',
        quantity: 2,
        sourceType: 'BROKER',
      },
      {
        itemId: 630520007,
        nameEn: 'Lesser Dragon Scale Hardener (Bound)',
        nameEs: 'Endurecedor de escamas de dragón inferior (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 4650,
      },
    ],
    notesEs:
      'Escama de entrada (Lv. 51). Siempre verifica que su precio en Broker supere los 60.000 Kinah antes de fabricar.',
    notesEn:
      'Entry-level scale (Lv. 51). Always verify its Broker price is above 60,000 Kinah before crafting.',
  },
  {
    recipeId: '313024001',
    productId: 630510010,
    nameEn: 'Tanned Thick Balaur Leather',
    nameEs: 'Cuero grueso de Balaur curtido',
    category: 'Balaur',
    professionEs: 'Sastrería Lv. 51 (95.2%)',
    professionEn: 'Tailoring Lv. 51 (95.2%)',
    levelReq: 51,
    productQuantity: 1,
    baseSuccessRate: 0.952,
    ingredients: [
      {
        itemId: 620100001,
        nameEn: "Balaur's Essence",
        nameEs: 'Esencia de Balaur',
        quantity: 2,
        sourceType: 'BROKER',
      },
      {
        itemId: 630520004,
        nameEn: 'Lesser Dragon Leather Softener (Bound)',
        nameEs: 'Suavizante de cuero de dragón inferior (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 4650,
      },
    ],
    notesEs:
      'Excelente margen neto en Sastrería con bajo número de competidores en el Broker.',
    notesEn:
      'Excellent net margin in Tailoring with very few competing listings on the Broker.',
  },
  {
    recipeId: '311024002',
    productId: 630510005,
    nameEn: 'Fine Hard Balaur Horn',
    nameEs: 'Cuerno duro de Balaur refinado [TRAMPA]',
    category: 'Balaur',
    professionEs: 'Herrería Lv. 65 (95.2%)',
    professionEn: 'Blacksmithing Lv. 65 (95.2%)',
    levelReq: 65,
    productQuantity: 1,
    baseSuccessRate: 0.952,
    ingredients: [
      {
        itemId: 620100001,
        nameEn: "Balaur's Essence",
        nameEs: 'Esencia de Balaur',
        quantity: 2,
        sourceType: 'BROKER',
      },
      {
        itemId: 630520002,
        nameEn: 'Lazuli Hammer (Bound)',
        nameEs: 'Martillo de lapislázuli (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 5600,
      },
    ],
    notesEs:
      '⚠️ TRAMPA: Cotiza por debajo del breakeven. Usa siempre tus Esencias de Balaur para Escamas o Cueros, nunca para Cuernos.',
    notesEn:
      '⚠️ TRAP: Trades below breakeven. Always use your Balaur Essences for Scales or Leathers, never Horns.',
  },

  // ============================================================================
  // 3. ALQUIMIA: PERGAMINOS Y ELIXIRES (72.9% ÉXITO BASE)
  // ============================================================================
  {
    recipeId: '315012004',
    productId: 531060029,
    nameEn: 'Superior Benediction Scroll',
    nameEs: 'Pergamino de favor superior',
    category: 'Alchemy',
    professionEs: 'Alquimia Lv. 75 (72.9%)',
    professionEn: 'Alchemy Lv. 75 (72.9%)',
    levelReq: 75,
    productQuantity: 1,
    baseSuccessRate: 0.729,
    ingredients: [
      {
        itemId: 610300016,
        nameEn: 'Diamond Gemstone',
        nameEs: 'Diamante en bruto (1x -> 3x Polvo)',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 630544002,
        nameEn: 'Asvata Paper',
        nameEs: 'Hoja de papel de asvata',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 531060027,
        nameEn: 'Benediction Scroll (Bound)',
        nameEs: 'Pergamino de favor (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 1000,
      },
      {
        itemId: 630543008,
        nameEn: 'Professional Ink (Bound)',
        nameEs: 'Tinta avanzada (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 1200,
      },
    ],
    notesEs:
      'Tasa de éxito base del 72.9% (27.1% de fallo). Margen ajustado tras descontar fallos.',
    notesEn:
      '72.9% base success rate (27.1% failure rate). Tight margin after accounting for failures.',
  },
  {
    recipeId: '315012002',
    productId: 531060002,
    nameEn: 'Superior Courage Scroll',
    nameEs: 'Pergamino de valentía superior',
    category: 'Alchemy',
    professionEs: 'Alquimia Lv. 70 (72.9%)',
    professionEn: 'Alchemy Lv. 70 (72.9%)',
    levelReq: 70,
    productQuantity: 1,
    baseSuccessRate: 0.729,
    ingredients: [
      {
        itemId: 630532003,
        nameEn: 'Sapphire Powder',
        nameEs: 'Polvo de zafiro',
        quantity: 3,
        sourceType: 'BROKER',
      },
      {
        itemId: 630544002,
        nameEn: 'Asvata Paper',
        nameEs: 'Hoja de papel de asvata',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 531060004,
        nameEn: 'Courage Scroll (Bound)',
        nameEs: 'Pergamino de valentía (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 1000,
      },
      {
        itemId: 630543008,
        nameEn: 'Professional Ink (Bound)',
        nameEs: 'Tinta avanzada (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 1200,
      },
    ],
    notesEs:
      'Receta real: usa 3x Polvo de zafiro + 1x Papel de asvata + 2.200 Kinah de PNJ con 72.9% de éxito.',
    notesEn:
      'Real client recipe: uses 3x Sapphire Powder + 1x Asvata Paper + 2,200 NPC Kinah at 72.9% success.',
  },
  {
    recipeId: '315012001',
    productId: 531060001,
    nameEn: 'Superior Speed Scroll',
    nameEs: 'Pergamino de esprint superior [TRAMPA]',
    category: 'Alchemy',
    professionEs: 'Alquimia Lv. 65 (72.9%)',
    professionEn: 'Alchemy Lv. 65 (72.9%)',
    levelReq: 65,
    productQuantity: 1,
    baseSuccessRate: 0.729,
    ingredients: [
      {
        itemId: 630532002,
        nameEn: 'Ruby Powder',
        nameEs: 'Polvo de rubí',
        quantity: 3,
        sourceType: 'BROKER',
      },
      {
        itemId: 630544002,
        nameEn: 'Asvata Paper',
        nameEs: 'Hoja de papel de asvata',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 531060003,
        nameEn: 'Speed Scroll (Bound)',
        nameEs: 'Pergamino de esprint (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 1000,
      },
      {
        itemId: 630543008,
        nameEn: 'Professional Ink (Bound)',
        nameEs: 'Tinta avanzada (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 1200,
      },
    ],
    notesEs:
      '⚠️ TRAMPA: Con el Polvo de rubí a 2.000 Kinah y el 27.1% de fallo base, ganas más vendiendo el Polvo de rubí y el Papel de asvata sueltos.',
    notesEn:
      '⚠️ TRAP: With Ruby Powder at 2,000 Kinah and 27.1% base failure rate, selling Ruby Powder and Asvata Paper raw yields more Kinah.',
  },
  {
    recipeId: '315012006',
    productId: 531060006,
    nameEn: 'Status Effect Resist Scroll',
    nameEs: 'Pergamino de Resistencia a Efectos de Estado [TRAMPA MORTAL]',
    category: 'Alchemy',
    professionEs: 'Alquimia Lv. 95 (72.9%)',
    professionEn: 'Alchemy Lv. 95 (72.9%)',
    levelReq: 95,
    productQuantity: 1,
    baseSuccessRate: 0.729,
    ingredients: [
      {
        itemId: 610300016,
        nameEn: 'Diamond Gemstone',
        nameEs: 'Diamante en bruto (1x -> 3x Polvo)',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 630532005,
        nameEn: 'Spiritstone Powder',
        nameEs: 'Polvo de piedra espiritual',
        quantity: 5,
        sourceType: 'BROKER',
      },
      {
        itemId: 630544002,
        nameEn: 'Asvata Paper',
        nameEs: 'Hoja de papel de asvata',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 630543013,
        nameEn: 'Exceptional Ink (Bound)',
        nameEs: 'Tinta lujosa (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 10000,
      },
    ],
    notesEs:
      '🛑 TRAMPA MORTAL: Solo la Tinta lujosa del PNJ cuesta 10.000 Kinah y el pergamino se desplomó a ~4.490 Kinah en Azphel. Pierdes casi -20.000 Kinah por intento incluso con materiales propios.',
    notesEn:
      '🛑 DEADLY TRAP: Just the NPC Exceptional Ink costs 10,000 Kinah while the scroll crashed to ~4,490 Kinah on Azphel. Destroys ~20k Kinah per attempt even with own mats.',
  },
  {
    recipeId: '315011004',
    productId: 530136004,
    nameEn: 'Superior Wind Serum',
    nameEs: 'Elixir de viento superior [TRAMPA]',
    category: 'Alchemy',
    professionEs: 'Alquimia Lv. 55 (72.9%)',
    professionEn: 'Alchemy Lv. 55 (72.9%)',
    levelReq: 55,
    productQuantity: 1,
    baseSuccessRate: 0.729,
    ingredients: [
      {
        itemId: 530136002,
        nameEn: 'Wind Serum',
        nameEs: 'Elixir de viento',
        quantity: 2,
        sourceType: 'BROKER',
      },
      {
        itemId: 610670046,
        nameEn: 'Fresh Azpha',
        nameEs: 'Azpha fresco',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 610670048,
        nameEn: 'Fresh Calendula',
        nameEs: 'Caléndula fresca',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 630543002,
        nameEn: 'Professional Glass Bottle (Bound)',
        nameEs: 'Frasco de vidrio avanzado (PNJ)',
        quantity: 1,
        sourceType: 'NPC',
        fixedNpcPrice: 1200,
      },
    ],
    notesEs:
      '⚠️ TRAMPA DE COSTE DE OPORTUNIDAD: Si recolectas Azpha fresco, véndelo crudo en el Broker (~18.000 Kinah). Meterlo en este elixir con 27.1% de fallo destruye valor.',
    notesEn:
      '⚠️ OPPORTUNITY COST TRAP: If you gather Fresh Azpha, sell it raw on the Broker (~18,000 Kinah). Crafting this serum at 72.9% success destroys value.',
  },

  // ============================================================================
  // 4. COCINA (72.9% ÉXITO BASE)
  // ============================================================================
  {
    recipeId: '316012002',
    productId: 514085002,
    nameEn: "Artisan's Fruit Salad",
    nameEs: 'Macedonia de artesano',
    category: 'Cooking',
    professionEs: 'Cocina Lv. 30 (72.9%)',
    professionEn: 'Cooking Lv. 30 (72.9%)',
    levelReq: 30,
    productQuantity: 1,
    baseSuccessRate: 0.729,
    ingredients: [
      {
        itemId: 610870049,
        nameEn: 'Fresh Fruit',
        nameEs: 'Fruto fresco',
        quantity: 5,
        sourceType: 'BROKER',
      },
      {
        itemId: 630554011,
        nameEn: 'Altgard Pepper (Bound)',
        nameEs: 'Pimienta de Altgard (PNJ)',
        quantity: 2,
        sourceType: 'NPC',
        fixedNpcPrice: 880,
      },
    ],
    notesEs:
      '⭐ Única comida de artesano altamente rentable hoy en Azphel (~20.000 Kinah frente a 9.535 Kinah de coste directo).',
    notesEn:
      '⭐ The only Artisan food currently profitable on Azphel (~20,000 Kinah vs 9,535 Kinah direct cost).',
  },
  {
    recipeId: '316013001',
    productId: 524084001,
    nameEn: "Dark Dragon's Chopped Steak",
    nameEs: 'Filete en cubos de dragón oscuro',
    category: 'Cooking',
    professionEs: 'Cocina Lv. 60 (72.9%)',
    professionEn: 'Cooking Lv. 60 (72.9%)',
    levelReq: 60,
    productQuantity: 1,
    baseSuccessRate: 0.729,
    ingredients: [
      {
        itemId: 620200010,
        nameEn: 'Smooth Balaur Meat',
        nameEs: 'Carne suave de Balaur',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 610770052,
        nameEn: 'Raydam',
        nameEs: 'Raydam',
        quantity: 3,
        sourceType: 'BROKER',
      },
      {
        itemId: 610770053,
        nameEn: 'Morpha',
        nameEs: 'Morfa',
        quantity: 3,
        sourceType: 'BROKER',
      },
      {
        itemId: 610100001,
        nameEn: 'Odyle',
        nameEs: 'Od (Odyle)',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 630554011,
        nameEn: 'Altgard Pepper (Bound)',
        nameEs: 'Pimienta de Altgard (PNJ)',
        quantity: 5,
        sourceType: 'NPC',
        fixedNpcPrice: 880,
      },
    ],
    notesEs:
      'Comida de Dragón Oscuro rentable principalmente para dar salida a tus propios drops de Carne suave de Balaur y Raydam/Morfa.',
    notesEn:
      'Dark Dragon food profitable mainly to monetize your own Smooth Balaur Meat and Raydam/Morpha drops.',
  },
  {
    recipeId: '316012006',
    productId: 524085006,
    nameEn: "Artisan's Grilled Pujery",
    nameEs: 'Pujery asado de artesano [TRAMPA]',
    category: 'Cooking',
    professionEs: 'Cocina Lv. 45 (72.9%)',
    professionEn: 'Cooking Lv. 45 (72.9%)',
    levelReq: 45,
    productQuantity: 1,
    baseSuccessRate: 0.729,
    ingredients: [
      {
        itemId: 610990066,
        nameEn: 'Pujery',
        nameEs: 'Pujery (Pescado crudo)',
        quantity: 3,
        sourceType: 'BROKER',
      },
      {
        itemId: 610870049,
        nameEn: 'Fresh Fruit',
        nameEs: 'Fruto fresco',
        quantity: 3,
        sourceType: 'BROKER',
      },
      {
        itemId: 630554007,
        nameEn: 'Abex Butter (Bound)',
        nameEs: 'Mantequilla de abex (PNJ)',
        quantity: 5,
        sourceType: 'NPC',
        fixedNpcPrice: 880,
      },
    ],
    notesEs:
      '⚠️ TRAMPA EN AZPHEL: El Pujery crudo subió a 7.000 Kinah por los Encargos de Suministro. Vender los 3 Pujery crudos te da +15.695 Kinah más que cocinarlos.',
    notesEn:
      '⚠️ TRAP ON AZPHEL: Raw Pujery rose to 7,000 Kinah due to Supply Requests. Selling the 3 raw Pujery yields +15,695 Kinah more than cooking them.',
  },

  // ============================================================================
  // 5. CONVERSIÓN DE VINCULADOS (BOUND -> TRADEABLE CON 20% PROC EN ALQUIMIA)
  // ============================================================================
  {
    recipeId: '315022002',
    productId: 640100016,
    nameEn: 'Intermediate Manastone',
    nameEs: 'Piedra de maná intermedia (+20% Proc Superior)',
    category: 'Vinculados',
    professionEs: 'Alquimia Lv. 20 (72.9% éxito | 20% Proc)',
    professionEn: 'Alchemy Lv. 20 (72.9% success | 20% Proc)',
    levelReq: 20,
    productQuantity: 1,
    baseSuccessRate: 0.729,
    comboProductId: 640100017,
    comboNameEn: 'Superior Manastone',
    comboNameEs: 'Piedra de maná superior',
    comboRate: 0.2,
    ingredients: [
      {
        itemId: 640100015,
        nameEn: 'Lesser Manastone',
        nameEs: 'Piedra de maná inferior (Vinculada / Bound)',
        quantity: 5,
        sourceType: 'BOUND',
      },
      {
        itemId: 630532005,
        nameEn: 'Spiritstone Powder',
        nameEs: 'Polvo de piedra espiritual',
        quantity: 3,
        sourceType: 'BROKER',
      },
      {
        itemId: 630543008,
        nameEn: 'Professional Ink (Bound)',
        nameEs: 'Tinta avanzada (PNJ)',
        quantity: 2,
        sourceType: 'NPC',
        fixedNpcPrice: 1200,
      },
    ],
    notesEs:
      '💎 MINA DE ORO CON VINCULADOS: Usa EXCLUSIVAMENTE tus Piedras de maná inferiores (Vinculadas) de Pruebas de Ascensión y Trascendencia (Coste de oportunidad = 0 Kinah). NUNCA las compres en el Broker.',
    notesEn:
      '💎 BOUND GOLDMINE: Use EXCLUSIVELY your Bound Lesser Manastones from Ascension Trials and Transcendence (Opportunity cost = 0 Kinah). NEVER buy Lesser Manastones on the Broker.',
  },
  {
    recipeId: '315023002',
    productId: 640200016,
    nameEn: 'Intermediate Soulstone',
    nameEs: 'Piedra de alma intermedia (+20% Proc Superior)',
    category: 'Vinculados',
    professionEs: 'Alquimia Lv. 25 (72.9% éxito | 20% Proc)',
    professionEn: 'Alchemy Lv. 25 (72.9% success | 20% Proc)',
    levelReq: 25,
    productQuantity: 1,
    baseSuccessRate: 0.729,
    comboProductId: 640200017,
    comboNameEn: 'Superior Soulstone',
    comboNameEs: 'Piedra de alma superior',
    comboRate: 0.2,
    ingredients: [
      {
        itemId: 640200015,
        nameEn: 'Lesser Soulstone',
        nameEs: 'Piedra de alma inferior (Vinculada / Bound)',
        quantity: 5,
        sourceType: 'BOUND',
      },
      {
        itemId: 630532005,
        nameEn: 'Spiritstone Powder',
        nameEs: 'Polvo de piedra espiritual',
        quantity: 3,
        sourceType: 'BROKER',
      },
      {
        itemId: 630543008,
        nameEn: 'Professional Ink (Bound)',
        nameEs: 'Tinta avanzada (PNJ)',
        quantity: 2,
        sourceType: 'NPC',
        fixedNpcPrice: 1200,
      },
    ],
    notesEs:
      '💎 Convierte 5 Piedras de alma inferiores (Vinculadas) sin valor de mercado en Piedras Intermedias (~44k) o Superiores (~500k) 100% transferibles.',
    notesEn:
      '💎 Converts 5 untradeable Bound Lesser Soulstones into 100% tradeable Intermediate (~44k) or Superior (~500k) Soulstones.',
  },

  // ============================================================================
  // 6. ORFEBRERÍA: CADENA DE ANILLO DE ZAFIRO (CON ADVERTENCIA DE VARIANZA)
  // ============================================================================
  {
    recipeId: '314011002_step2',
    productId: 220330008,
    nameEn: "Expert's Sapphire Ring",
    nameEs: 'Anillo de zafiro de experto (+25% Proc Brillante)',
    category: 'Jewelcrafting',
    professionEs: 'Orfebrería Especialista (95% éxito | 25% Proc)',
    professionEn: 'Handicrafting Expert (95% success | 25% Proc)',
    levelReq: 41,
    productQuantity: 1,
    baseSuccessRate: 0.95,
    comboProductId: 220340008,
    comboNameEn: "Expert's Splendent Sapphire Ring",
    comboNameEs: 'Anillo de zafiro brillante de experto',
    comboRate: 0.25,
    ingredients: [
      {
        itemId: 220320008,
        nameEn: 'Splendent Sapphire Ring',
        nameEs: 'Anillo de zafiro brillante (Paso 1)',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 630531002,
        nameEn: "Expert's Refining Stone",
        nameEs: 'Piedra de refinado de experto',
        quantity: 2,
        sourceType: 'BROKER',
      },
      {
        itemId: 610100002,
        nameEn: 'Fine Odyle',
        nameEs: 'Od fino (Fine Odyle)',
        quantity: 1,
        sourceType: 'BROKER',
      },
      {
        itemId: 610300014,
        nameEn: 'Fine Sapphire Gemstone',
        nameEs: 'Zafiro fino en bruto',
        quantity: 2,
        sourceType: 'BROKER',
      },
    ],
    notesEs:
      '🛑 RIESGO DE RUINA POR VARIANZA (25% x 25% = 6.25%): PROHIBIDO reinvertir Kinah líquida comprando materiales en el Broker (una racha fría quema millones). Fabrica SOLO con materiales farmeados gratis por ti.',
    notesEn:
      '🛑 GAMBLER’S RUIN RISK (25% x 25% = 6.25%): NEVER reinvest liquid Kinah buying mats on the Broker (a cold streak drains millions). Craft ONLY with your own self-farmed materials.',
  },
];
