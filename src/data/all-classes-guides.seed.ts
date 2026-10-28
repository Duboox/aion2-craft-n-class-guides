/**
 * Guías completas de las 8 Clases de Aion 2 (PvE & PvP) inspiradas en https://aion2-guides.info/
 * con iconos oficiales, especializaciones Lv 8 / 12 / 16 / 20, Estigmas, Pasivas, Prioridad de Estadísticas y Arcanas.
 */
import type { ClassGuideSheet } from '../domain/models/types';

export const ALL_CLASS_GUIDES_SEED: readonly [ClassGuideSheet, ...ClassGuideSheet[]] = [
  // ==========================================================================
  // 1. CHANTER (CANTOR)
  // ==========================================================================
  {
    classId: 'chanter',
    nameEs: 'Cantor (Chanter)',
    nameEn: 'Chanter',
    archetypeEs: 'Soporte Ofensivo / DPS Híbrido de Bastón',
    archetypeEn: 'Offensive Support / Staff Hybrid Bruiser',
    heroIconUrl: 'https://aion2-guides.info/assets/icons/chanter/dark-crush.webp',
    externalGuideUrlEn: 'https://aion2-guides.info/en/chanter/',
    externalGuideUrlEs: 'https://aion2-guides.info/es/chanter/',
    oneSentencePveEs:
      'Enfoca tu build en desbloquear Nivel 16–20 en Fractura sombría (Dark Crush) para eliminar su enfriamiento dentro de combos (0s CD) mientras mantienes Mantras ofensivos y Bendición del Viento para todo el grupo.',
    oneSentencePveEn:
      'Focus your build on unlocking Level 16–20 on Dark Crush to remove its cooldown inside combos (0s CD) while maintaining permanent offensive Mantras and Wind’s Promise for the party.',
    oneSentencePvpEs:
      'Combina iniciación a 20m con Trituración de acometida, encadenamiento de derribos, Escudo de Barrera y Golpe de choque para cazar objetivos prioritarios sin perder presión de curación.',
    oneSentencePvpEn:
      'Combine 20m gap-closing Onslaught, knockdown chains, Barrier Spell, and Assault Shock to lock down priority targets while sustaining high off-healing.',
    statPriorityPveEs: [
      '1. Fuerza (Might) ➔ +0.2% Golpe (Double Chance) y +0.1% Daño Físico por punto',
      '2. Velocidad de Combate (+20%+ en Alma, Guantes y Pergaminos)',
      '3. Nivel de Habilidad +3/+4 en Fractura sombría (Arcana Pergamino de Vigor + Joyería)',
      '4. Amplificación de Daño / Daño de Arma y Crítico (800–1.000+)',
    ],
    statPriorityPveEn: [
      '1. Might ➔ +0.2% Double Chance and +0.1% Physical Damage per point',
      '2. Combat Speed (+20%+ via Soul Binding, Gloves & Scrolls)',
      '3. Skill Level +3/+4 on Dark Crush (Parchment of Vigor Arcana + Jewelry)',
      '4. Damage Amplification / Weapon Damage & Critical Hit (800–1,000+)',
    ],
    statPriorityPvpEs: [
      '1. Daño PvP % y Defensa PvP % (Set de Abismo / Guardián)',
      '2. Velocidad de Combate y Precisión (evitar bloqueos/evasiones)',
      '3. Resistencia a Estado / Tenacidad y Vida Máxima',
    ],
    statPriorityPvpEn: [
      '1. PvP Damage % & PvP Defense % (Abyss / Guardian Set)',
      '2. Combat Speed & Accuracy (bypass block/evasion)',
      '3. Status Effect Resistance & Max HP',
    ],
    arcanaPriorityEs: [
      'Pergamino de vitalidad / vigor (Parchment of Vigor): Prioridad #1 para buscar +1/+2 a Fractura sombría (Dark Crush).',
      'Brújula (Compass) y Campana (Bell): Subir a +2/+3 buscando Fuerza (Might) o Golpe %.',
      'Cáliz (Chalice) y Espejo (Mirror): Activar bono de conjunto de 5 piezas de la misma familia.',
    ],
    arcanaPriorityEn: [
      'Parchment of Vigor: #1 Priority to roll +1/+2 Dark Crush skill levels.',
      'Compass & Bell: Upgrade to +2/+3 targeting Might or Double Chance %.',
      'Chalice & Mirror: Complete the 5-piece matching family set bonus.',
    ],
    hotbarAndMacroTipEs:
      'Coloca Golpe giratorio (Spinning Strike) seguido de Fractura sombría (Dark Crush) en Ranura en Línea. Nunca pongas Eliminación de impacto (Defiance) ni Círculo de protección dentro de macros automáticas.',
    hotbarAndMacroTipEn:
      'Place Spinning Strike followed by Dark Crush in an Inline Slot. Never place Defiance or Protection Circle inside automated macros.',
    skills: [
      {
        slug: 'dark-crush',
        nameEs: 'Fractura sombría',
        nameEn: 'Dark Crush',
        iconUrl: 'https://aion2-guides.info/assets/icons/chanter/dark-crush.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'CORE #1 (Lv 16–20)',
        summaryEs:
          'El motor de daño del Cantor. A Nivel 16 la especialidad roja elimina su enfriamiento al activarse en combo, permitiendo spamearla tras Golpe giratorio.',
        summaryEn:
          'The Chanter’s core damage engine. At Level 16 its specialty removes cooldown when triggered in a combo, allowing continuous spam after Spinning Strike.',
        specs: [
          {
            level: 'Lv 8',
            textEs: '+20% Daño base y reducción de animación',
            textEn: '+20% Base damage & faster animation',
          },
          {
            level: 'Lv 12',
            textEs: 'Ignora 15% de Defensa Física del objetivo',
            textEn: 'Ignores 15% target Physical Defense',
          },
          {
            level: 'Lv 16',
            textEs: '🔥 0s Enfriamiento en combo + Crítico garantizado',
            textEn: '🔥 0s Cooldown in combo + Guaranteed Crit',
          },
        ],
      },
      {
        slug: 'onslaught',
        nameEs: 'Trituración de acometida',
        nameEn: 'Onslaught',
        iconUrl: 'https://aion2-guides.info/assets/icons/chanter/onslaught.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Iniciador 20m',
        summaryEs:
          'Salto de aproximación a 20m con gran daño a la barra de aturdimiento (Stagger), derribo en objetivos aturdidos y recuperación de maná.',
        summaryEn:
          '20m gap-closer with heavy Stagger gauge damage, knockdown on staggered targets, and mana recovery.',
        specs: [
          {
            level: 'Lv 8',
            textEs: '+5m de alcance de carga',
            textEn: '+5m charge range',
          },
          {
            level: 'Lv 12',
            textEs: 'Recupera PM adicional al impactar',
            textEn: 'Restores bonus MP on hit',
          },
          {
            level: 'Lv 16',
            textEs: 'Aplica derribo instantáneo en ruptura',
            textEn: 'Applies instant knockdown on stagger break',
          },
        ],
      },
      {
        slug: 'spinning-strike',
        nameEs: 'Golpe giratorio',
        nameEn: 'Spinning Strike',
        iconUrl: 'https://aion2-guides.info/assets/icons/chanter/spinning-strike.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Activador Combo',
        summaryEs:
          'Habilidad detonante principal que habilita la cadena de Fractura sombría y aplica reducción de defensa.',
        summaryEn:
          'Primary combo starter that unlocks the Dark Crush chain and applies defense reduction.',
        specs: [
          {
            level: 'Lv 8',
            textEs: 'Aumenta probabilidad de encadenamiento',
            textEn: 'Increases combo chain proc rate',
          },
          {
            level: 'Lv 12',
            textEs: '-10% Defensa al enemigo por 5 s',
            textEn: '-10% enemy Defense for 5s',
          },
        ],
      },
      {
        slug: 'undefeated-mantra',
        nameEs: 'Mantra invicto & Promesa del viento',
        nameEn: 'Undefeated Mantra & Wind’s Promise',
        iconUrl: 'https://aion2-guides.info/assets/icons/chanter/undefeated-mantra.webp',
        category: 'PASSIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Aura de Grupo',
        summaryEs:
          'Aura permanente para todo el grupo que incrementa Ataque, Velocidad de Combate y proc de daño elemental de viento en cada golpe.',
        summaryEn:
          'Permanent party aura boosting Attack, Combat Speed, and wind bonus damage procs on every hit.',
        specs: [
          {
            level: 'Lv 8',
            textEs: '+Ataque para los 4 miembros del grupo',
            textEn: '+Attack for all 4 party members',
          },
          {
            level: 'Lv 16',
            textEs: '+Velocidad de Combate adicional en grupo',
            textEn: '+Bonus Party Combat Speed',
          },
        ],
      },
      {
        slug: 'raging-spell',
        nameEs: 'Conjuro de furia & Conjuro de inspiración',
        nameEn: 'Raging Spell & Inspiring Spell',
        iconUrl: 'https://aion2-guides.info/assets/icons/chanter/raging-spell.webp',
        category: 'STIGMA',
        modeTag: 'PVE',
        priorityBadge: 'Estigma Burst',
        summaryEs:
          'Estigmas obligatorios de DPS que disparan el Ataque, la Velocidad de Combate y la Amplificación de Daño durante las ventanas de burst.',
        summaryEn:
          'Mandatory DPS Stigmas that skyrocket Attack, Combat Speed, and Damage Amplification during burst windows.',
        specs: [
          {
            level: 'Lv 12',
            textEs: '+15% Amplificación de Daño por 12 s',
            textEn: '+15% Damage Amplification for 12s',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 2. GLADIATOR (GLADIADOR)
  // ==========================================================================
  {
    classId: 'gladiator',
    nameEs: 'Gladiador (Gladiator)',
    nameEn: 'Gladiator',
    archetypeEs: 'Berserker Cuerpo a Cuerpo / Rey del AoE y Derribos',
    archetypeEn: 'Melee Juggernaut / AoE Cleave & Knockdown King',
    heroIconUrl: 'https://aion2-guides.info/assets/icons/gladiator/overhead-slam.webp',
    externalGuideUrlEn: 'https://aion2-guides.info/en/gladiator/',
    externalGuideUrlEs: 'https://aion2-guides.info/es/gladiator/',
    oneSentencePveEs:
      'Maximiza Punzada descendente (Overhead Slam) a Nivel 16–20 y combínala con la ventana de 10 segundos de Explosión de furia (Rage Burst) y Bendición de Zikel para derretir jefes y oleadas.',
    oneSentencePveEn:
      'Max out Overhead Slam to Level 16–20 and pair it with the 10-second Rage Burst + Zikel’s Blessing window to melt bosses and packs.',
    oneSentencePvpEs:
      'Domina el ritmo con Espada devastadora (Mocking Blade Lv 16 ignora bloqueo/evasión) en Tecla E, seguido de Punzada descendente y Amarre Aéreo (Aerial Snare) mientras ciclas Postura de Supervivencia.',
    oneSentencePvpEn:
      'Control fights with Mocking Blade (Lv 16 bypasses block/evasion) on Key E, chaining into Overhead Slam and Aerial Snare while cycling Survival Stance.',
    statPriorityPveEs: [
      '1. Fuerza (Might) ➔ +0.2% Golpe (Double Chance) y +0.1% Daño Físico',
      '2. Velocidad de Combate y Ataque Físico / Daño de Arma',
      '3. Nivel de Habilidad en Punzada descendente (Overhead Slam Lv 16–20)',
      '4. Crítico y Robo de Vida (Sinergia con Absorción de Sangre)',
    ],
    statPriorityPveEn: [
      '1. Might ➔ +0.2% Double Chance & +0.1% Physical Damage',
      '2. Combat Speed & Physical Attack / Weapon Damage',
      '3. Skill Level on Overhead Slam (Lv 16–20)',
      '4. Critical Hit & Lifesteal (Synergy with Blood Absorption)',
    ],
    statPriorityPvpEs: [
      '1. Daño PvP % y Precisión (Asegurar derribo de Mocking Blade)',
      '2. Defensa PvP % y Reducción de Daño en Postura Defensiva',
      '3. Velocidad de Combate y Resistencia a CC',
    ],
    statPriorityPvpEn: [
      '1. PvP Damage % & Accuracy (Guarantee Mocking Blade knockdown)',
      '2. PvP Defense % & Damage Mitigation in Survival Stance',
      '3. Combat Speed & CC Resistance',
    ],
    arcanaPriorityEs: [
      'Cáliz / Pergamino con +Nivel a Punzada descendente (Overhead Slam) o Espada devastadora.',
      'Brújula y Campana con Fuerza (Might) y Daño Crítico.',
      'Bono de 5 cartas del mismo conjunto para activar +Ataque y +Golpe %.',
    ],
    arcanaPriorityEn: [
      'Chalice / Parchment with +Skill Level to Overhead Slam or Mocking Blade.',
      'Compass & Bell with Might and Critical Damage.',
      '5-card matching set bonus to activate +Attack and +Double Chance %.',
    ],
    hotbarAndMacroTipEs:
      'Tecla Q (Ranura en línea): Perforación con Salto + Estacazo de acometida (guarda el 2º dash). Tecla E (Ranura en línea): Espada devastadora + Punzada descendente. Espacio: Eliminación de impacto (Defiance) aislada.',
    hotbarAndMacroTipEn:
      'Key Q (Inline Slot): Leaping Slam + Rush Strike (hold 2nd dash). Key E (Inline Slot): Mocking Blade + Overhead Slam. Spacebar: Defiance isolated.',
    skills: [
      {
        slug: 'overhead-slam',
        nameEs: 'Punzada descendente',
        nameEn: 'Overhead Slam',
        iconUrl: 'https://aion2-guides.info/assets/icons/gladiator/overhead-slam.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'CORE #1 (Lv 16–20)',
        summaryEs:
          'Golpe aplastante principal del Gladiador. Inflige daño masivo a objetivos derribados y se reinicia constantemente durante la ventana de burst.',
        summaryEn:
          'The Gladiator’s #1 heavy hitter. Deals massive bonus damage to knocked-down targets and resets frequently during burst windows.',
        specs: [
          {
            level: 'Lv 8',
            textEs: '+25% Daño contra objetivos derribados o jefes',
            textEn: '+25% Damage vs knocked-down targets or bosses',
          },
          {
            level: 'Lv 12',
            textEs: 'Reduce enfriamiento al conectar golpe crítico',
            textEn: 'Reduces cooldown on critical hit',
          },
          {
            level: 'Lv 16',
            textEs: '🔥 Golpe adicional en área + Ignora 20% Defensa',
            textEn: '🔥 Bonus AoE shockwave + Ignores 20% Defense',
          },
        ],
      },
      {
        slug: 'mocking-blade',
        nameEs: 'Espada devastadora',
        nameEn: 'Mocking Blade',
        iconUrl: 'https://aion2-guides.info/assets/icons/gladiator/mocking-blade.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'CC Apertura (Tecla E)',
        summaryEs:
          'Derribo de apertura de 3 segundos. A Nivel 16 desbloquea la especialidad que ignora por completo el bloqueo y la evasión del rival.',
        summaryEn:
          '3-second opener knockdown. At Level 16 unlocks the specialty that completely bypasses target block and evasion.',
        specs: [
          {
            level: 'Lv 8',
            textEs: '+Velocidad de ejecución del tajo',
            textEn: '+Faster slash execution speed',
          },
          {
            level: 'Lv 16',
            textEs: '🔥 Ignora Bloqueo y Evasión + Derribo 3s',
            textEn: '🔥 Ignores Block & Evasion + 3s Knockdown',
          },
        ],
      },
      {
        slug: 'leaping-slam',
        nameEs: 'Perforación con Salto & Estacazo de acometida',
        nameEn: 'Leaping Slam & Rush Strike',
        iconUrl: 'https://aion2-guides.info/assets/icons/gladiator/leaping-slam.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Movilidad (Tecla Q)',
        summaryEs:
          'Doble herramienta de acercamiento. Configúralas en Ranura en Línea en la tecla Q para decidir manualmente cuándo gastar el segundo desplazamiento.',
        summaryEn:
          'Dual gap-closers. Bind them to an Inline Slot on Key Q so you manually decide when to spend the second dash.',
        specs: [
          {
            level: 'Lv 12',
            textEs: 'Otorga velocidad de movimiento tras aterrizar',
            textEn: 'Grants movement speed after landing',
          },
        ],
      },
      {
        slug: 'rage-burst',
        nameEs: 'Explosión de furia & Bendición de Zikel',
        nameEn: 'Rage Burst & Zikel’s Blessing',
        iconUrl: 'https://aion2-guides.info/assets/icons/gladiator/rage-burst.webp',
        category: 'STIGMA',
        modeTag: 'PVE',
        priorityBadge: 'Ventana Burst 10s',
        summaryEs:
          'Activa ambos estigmas juntos para abrir una ventana de 10 segundos de ataque, precisión y robo de vida extremos.',
        summaryEn:
          'Pop both Stigmas together to open a 10-second window of extreme attack, accuracy, and lifesteal.',
        specs: [
          {
            level: 'Lv 12',
            textEs: '+30% Ataque y robo de vida en cada tajo',
            textEn: '+30% Attack & lifesteal on every cleave',
          },
        ],
      },
      {
        slug: 'lunge-stance',
        nameEs: 'Postura de Asalto / Postura de Supervivencia',
        nameEn: 'Lunge Stance / Survival Stance',
        iconUrl: 'https://aion2-guides.info/assets/icons/gladiator/lunge-stance.webp',
        category: 'STIGMA',
        modeTag: 'BOTH',
        priorityBadge: 'Cambio de Postura',
        summaryEs:
          'Mantén Postura de Asalto siempre activa en PvE; en PvP alterna a Postura de Supervivencia cuando seas el foco enemigo.',
        summaryEn:
          'Keep Lunge Stance active 100% in PvE; in PvP swap to Survival Stance when focused by enemies.',
        specs: [
          {
            level: 'Lv 8',
            textEs: '+Velocidad de Combate y Daño plano',
            textEn: '+Combat Speed & flat Damage bonus',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 3. TEMPLAR (TEMPLARIO)
  // ==========================================================================
  {
    classId: 'templar',
    nameEs: 'Templario (Templar)',
    nameEn: 'Templar',
    archetypeEs: 'Tanque de Vanguardia / Control de Masas y Escudos',
    archetypeEn: 'Vanguard Tank / Crowd Control & Shield Juggernaut',
    heroIconUrl: 'https://aion2-guides.info/assets/icons/templar/doom-shield.webp',
    externalGuideUrlEn: 'https://aion2-guides.info/en/templar/',
    externalGuideUrlEs: 'https://aion2-guides.info/es/templar/',
    oneSentencePveEs:
      'Controla el posicionamiento del jefe con Provocación y Estandarte de Campo de Batalla (Battlefield Banner) mientras maximizas el daño de Castigo (Punishment) y Golpe de Escudo.',
    oneSentencePveEn:
      'Control boss positioning with Taunt and Battlefield Banner while maximizing Punishment and Shield Smite damage.',
    oneSentencePvpEs:
      'Atrapa objetivos clave con Captura (Poach), protege a tu grupo con Compañero de Armas (Comrade in Arms) y aplasta con Escudo de Perdición (Doom Shield).',
    oneSentencePvpEn:
      'Pull priority targets with Poach, shield allies with Comrade in Arms, and crush enemies with Doom Shield.',
    statPriorityPveEs: [
      '1. Fuerza (Might) y Bloqueo con Escudo',
      '2. Velocidad de Combate y Reducción de Enfriamiento',
      '3. Vida Máxima (HP) y Defensa Física/Mágica',
    ],
    statPriorityPveEn: [
      '1. Might & Shield Block',
      '2. Combat Speed & Cooldown Reduction',
      '3. Max HP & Physical/Magical Defense',
    ],
    statPriorityPvpEs: [
      '1. Precisión (Asegurar el tirón de Poach / Captura)',
      '2. Defensa PvP %, Bloqueo y Resistencia a Estado',
      '3. Daño PvP % en habilidades de Espadón',
    ],
    statPriorityPvpEn: [
      '1. Accuracy (Guarantee Poach pull lands)',
      '2. PvP Defense %, Block & Status Resistance',
      '3. PvP Damage % on Greatsword skills',
    ],
    arcanaPriorityEs: [
      'Cáliz y Pergamino con +Nivel a Castigo (Punishment) o Captura (Poach).',
      'Campana y Espejo con Bloqueo, Vida Máxima y Fuerza.',
    ],
    arcanaPriorityEn: [
      'Chalice & Parchment with +Skill Level to Punishment or Poach.',
      'Bell & Mirror with Block, Max HP, and Might.',
    ],
    hotbarAndMacroTipEs:
      'Mantén Captura (Poach) y Escudo de Nezekan en teclas directas sin macro para reaccionar al instante a mecánicas letales o fugas en PvP.',
    hotbarAndMacroTipEn:
      'Keep Poach and Nezekan’s Shield on dedicated single keys outside macros to react instantly to lethal mechanics or fleeing PvP targets.',
    skills: [
      {
        slug: 'punishment',
        nameEs: 'Castigo',
        nameEn: 'Punishment',
        iconUrl: 'https://aion2-guides.info/assets/icons/templar/punishment.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'DPS Principal (Lv 16)',
        summaryEs:
          'Golpe pesado de Espadón con multiplicador crítico altísimo y daño de ruptura a jefes.',
        summaryEn:
          'Heavy Greatsword strike with a massive critical multiplier and boss stagger damage.',
        specs: [
          {
            level: 'Lv 16',
            textEs: '🔥 +35% Daño Crítico y recarga al bloquear',
            textEn: '🔥 +35% Crit Damage & cooldown refund on block',
          },
        ],
      },
      {
        slug: 'poach',
        nameEs: 'Captura (Tirón de Cadena)',
        nameEn: 'Poach',
        iconUrl: 'https://aion2-guides.info/assets/icons/templar/poach.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Tirón 20m',
        summaryEs:
          'Arrastra al objetivo hacia ti desde 20 metros, interrumpiendo canalizaciones y aplicando aturdimiento.',
        summaryEn:
          'Pulls the target to your position from 20m away, interrupting casts and applying stun.',
        specs: [
          {
            level: 'Lv 16',
            textEs: 'Atrae hasta 3 objetivos cercanos en PvE/PvP',
            textEn: 'Pulls up to 3 nearby targets in PvE/PvP',
          },
        ],
      },
      {
        slug: 'battlefield-banner',
        nameEs: 'Estandarte del Campo de Batalla',
        nameEn: 'Battlefield Banner',
        iconUrl: 'https://aion2-guides.info/assets/icons/templar/battlefield-banner.webp',
        category: 'STIGMA',
        modeTag: 'BOTH',
        priorityBadge: 'Buff de Escuadrón',
        summaryEs:
          'Planta un estandarte que incrementa el daño y la mitigación de todos los aliados dentro del área.',
        summaryEn:
          'Plants a war banner that boosts damage and damage reduction for all allies in radius.',
        specs: [
          {
            level: 'Lv 12',
            textEs: '+15% Ataque y Defensa de grupo en el radio',
            textEn: '+15% Party Attack & Defense inside radius',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 4. ASSASSIN (ASESINO)
  // ==========================================================================
  {
    classId: 'assassin',
    nameEs: 'Asesino (Assassin)',
    nameEn: 'Assassin',
    archetypeEs: 'Burst de Sigilo / Detonación de Insignias por la Espalda',
    archetypeEn: 'Stealth Burst Assassin / Backstab Rune Detonator',
    heroIconUrl: 'https://aion2-guides.info/assets/icons/assassin/insignia-explosion.webp',
    externalGuideUrlEn: 'https://aion2-guides.info/en/assassin/',
    externalGuideUrlEs: 'https://aion2-guides.info/es/assassin/',
    oneSentencePveEs:
      'Mantente siempre en la espalda del jefe para aprovechar Golpe Trasero (Rear Smite), acumula 5 Insignias a velocidad relámpago con Tajo Rápido y detónalas con Explosión de Insignia (Insignia Explosion).',
    oneSentencePveEn:
      'Stay glued to the boss’s back to trigger Rear Smite, stack 5 Runes at lightning speed with Quick Slice, and detonate them with Insignia Explosion.',
    oneSentencePvpEs:
      'Inicia desde Caminar en las Sombras (Shadow Walk) con Emboscada (Ambush), encadena Atadura Aérea (Aerial Bind) y elimina objetivos de tela/cuero en un solo ciclo de runas.',
    oneSentencePvpEn:
      'Open from Shadow Walk with Ambush, chain into Aerial Bind, and delete cloth/leather targets in a single rune detonation cycle.',
    statPriorityPveEs: [
      '1. Velocidad de Combate (Crítico para apilar 5 Insignias rápido)',
      '2. Fuerza (Might) ➔ Golpe % (Double Chance) duplica acumulaciones',
      '3. Daño por la Espalda (Back Attack %) y Crítico Físico',
    ],
    statPriorityPveEn: [
      '1. Combat Speed (Critical to stack 5 Runes rapidly)',
      '2. Might ➔ Double Chance % accelerates burst cycles',
      '3. Back Attack Damage % & Physical Critical Hit',
    ],
    statPriorityPvpEs: [
      '1. Daño PvP % y Precisión (Evitar que fallen las detonaciones de runa)',
      '2. Velocidad de Movimiento y Evasión',
    ],
    statPriorityPvpEn: [
      '1. PvP Damage % & Accuracy (Prevent rune detonations from missing)',
      '2. Movement Speed & Evasion',
    ],
    arcanaPriorityEs: [
      'Pergamino y Brújula con +Nivel a Explosión de Insignia (Insignia Explosion) y Colmillo Salvaje.',
      'Conjunto de 5 Arcanas enfocado en Velocidad de Combate y Golpe %.',
    ],
    arcanaPriorityEn: [
      'Parchment & Compass with +Skill Level to Insignia Explosion and Savage Fang.',
      '5-piece Arcana set focused on Combat Speed and Double Chance %.',
    ],
    hotbarAndMacroTipEs:
      'Agrupa tu cadena de tallado de insignias (Quick Slice ➔ Savage Fang) en una Ranura en Línea, pero deja tus detonadores (Insignia Explosion y Heart Gore) en teclas separadas para detonar solo con 5 cargas.',
    hotbarAndMacroTipEn:
      'Group your rune-carving skills (Quick Slice ➔ Savage Fang) in an Inline Slot, but keep your detonators (Insignia Explosion & Heart Gore) on separate keys to detonate strictly at 5 stacks.',
    skills: [
      {
        slug: 'insignia-explosion',
        nameEs: 'Explosión de Insignia',
        nameEn: 'Insignia Explosion',
        iconUrl: 'https://aion2-guides.info/assets/icons/assassin/insignia-explosion.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Detonador #1 (Lv 16–20)',
        summaryEs:
          'Detona hasta 5 insignias grabadas en el objetivo para infligir daño explosivo y aturdimiento.',
        summaryEn:
          'Detonates up to 5 carved runes on the target for massive burst damage and stun.',
        specs: [
          {
            level: 'Lv 16',
            textEs: '🔥 +40% Daño con 5 cargas y devuelve 2 insignias',
            textEn: '🔥 +40% Damage at 5 stacks & refunds 2 runes',
          },
        ],
      },
      {
        slug: 'ambush',
        nameEs: 'Emboscada',
        nameEn: 'Ambush',
        iconUrl: 'https://aion2-guides.info/assets/icons/assassin/ambush.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Teletransporte Espalda',
        summaryEs:
          'Te teletransporta instantáneamente detrás del enemigo, lo aturde y graba insignias iniciales.',
        summaryEn:
          'Instantly teleports behind the enemy, stuns them, and carves initial runes.',
        specs: [
          {
            level: 'Lv 12',
            textEs: 'Graba 2 insignias instantáneas al aparecer detrás',
            textEn: 'Carves 2 instant runes upon teleporting behind',
          },
        ],
      },
      {
        slug: 'triniels-dagger',
        nameEs: 'Daga de Triniel & Contrato Veloz',
        nameEn: 'Triniel’s Dagger & Swift Contract',
        iconUrl: 'https://aion2-guides.info/assets/icons/assassin/triniels-dagger.webp',
        category: 'STIGMA',
        modeTag: 'BOTH',
        priorityBadge: 'Estigmas Burst',
        summaryEs:
          'Incrementa drásticamente la velocidad de ataque, el crítico y los impactos adicionales durante el burst.',
        summaryEn:
          'Drastically boosts attack speed, crit rate, and bonus hits during burst windows.',
        specs: [
          {
            level: 'Lv 12',
            textEs: '+25% Velocidad de Combate y Daño por la espalda',
            textEn: '+25% Combat Speed & Back Attack damage',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 5. RANGER (EXPLORADOR / CAZADOR)
  // ==========================================================================
  {
    classId: 'ranger',
    nameEs: 'Explorador (Ranger)',
    nameEn: 'Ranger',
    archetypeEs: 'Artillero de Arco a Distancia / Burst Móvil y Trampas',
    archetypeEn: 'Ranged Bow Marksman / Mobile Burst & Trap Specialist',
    heroIconUrl: 'https://aion2-guides.info/assets/icons/ranger/deadshot.webp',
    externalGuideUrlEn: 'https://aion2-guides.info/en/ranger/',
    externalGuideUrlEs: 'https://aion2-guides.info/es/ranger/',
    oneSentencePveEs:
      'Mantén Disparo de Marca (Marking Shot) activo el 100% del tiempo sobre el jefe y descarga Tiro Mortal (Deadshot), Flecha de Grifo y Flecha Explosiva dentro de Ojo Concentrado.',
    oneSentencePveEn:
      'Keep Marking Shot active 100% of the time on the boss and unload Deadshot, Griffon Arrow, and Burst Arrow inside Focused Eye.',
    oneSentencePvpEs:
      'Kitea constantemente con Vigor del Viento, silencia/inmoviliza con Flecha Supresora y Tiro de Trampa, y ejecuta a distancia con Francotirador (Snipe).',
    oneSentencePvpEn:
      'Kite relentlessly with Wind Vigor, silence/root with Suppressing Arrow and Snare Shot, and execute from afar with Snipe.',
    statPriorityPveEs: [
      '1. Fuerza (Might) ➔ Golpe % (Double Chance) en flechas pesadas',
      '2. Crítico Físico y Daño Crítico (Sinergia con Ojo Concentrado)',
      '3. Velocidad de Combate y Ataque a Distancia',
    ],
    statPriorityPveEn: [
      '1. Might ➔ Double Chance % on heavy bow shots',
      '2. Physical Crit & Crit Damage (Synergy with Focused Eye)',
      '3. Combat Speed & Ranged Attack',
    ],
    statPriorityPvpEs: [
      '1. Daño PvP % y Velocidad de Movimiento',
      '2. Precisión (Evitar bloqueo de escudos y evasión)',
    ],
    statPriorityPvpEn: [
      '1. PvP Damage % & Movement Speed',
      '2. Accuracy (Bypass shield block & evasion)',
    ],
    arcanaPriorityEs: [
      'Arcanas con +Nivel a Tiro Mortal (Deadshot) y Disparo de Marca (Marking Shot).',
      'Sub-estadísticas de Golpe %, Daño Crítico y Fuerza.',
    ],
    arcanaPriorityEn: [
      'Arcanas with +Skill Level to Deadshot and Marking Shot.',
      'Sub-stats focused on Double Chance %, Crit Damage, and Might.',
    ],
    hotbarAndMacroTipEs:
      'Coloca Disparo de Marca (Marking Shot) al inicio de tu línea de apertura para no disparar nunca Tiro Mortal sin el debuff de vulnerabilidad activo.',
    hotbarAndMacroTipEn:
      'Place Marking Shot at the start of your opener line so you never fire Deadshot without the vulnerability debuff active.',
    skills: [
      {
        slug: 'deadshot',
        nameEs: 'Tiro Mortal',
        nameEn: 'Deadshot',
        iconUrl: 'https://aion2-guides.info/assets/icons/ranger/deadshot.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'CORE #1 (Lv 16–20)',
        summaryEs:
          'El disparo de mayor multiplicador del Explorador. Causa daño devastador sobre objetivos marcados.',
        summaryEn:
          'The Ranger’s highest-multiplier bow shot. Deals devastating damage against marked targets.',
        specs: [
          {
            level: 'Lv 16',
            textEs: '🔥 Ignora 25% Defensa y garantiza Crítico en objetivos marcados',
            textEn: '🔥 Ignores 25% Defense & guaranteed Crit on marked targets',
          },
        ],
      },
      {
        slug: 'marking-shot',
        nameEs: 'Disparo de Marca',
        nameEn: 'Marking Shot',
        iconUrl: 'https://aion2-guides.info/assets/icons/ranger/marking-shot.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Debuff Obligatorio',
        summaryEs:
          'Marca al objetivo, reduciendo su defensa y evasión y aumentando el daño recibido de todo el grupo.',
        summaryEn:
          'Marks the target, reducing defense and evasion while increasing damage taken from the party.',
        specs: [
          {
            level: 'Lv 12',
            textEs: '+12% Daño recibido por el objetivo marcado',
            textEn: '+12% Damage taken by the marked target',
          },
        ],
      },
      {
        slug: 'vaizels-authority',
        nameEs: 'Autoridad de Vaizel & Arco de Bendición',
        nameEn: 'Vaizel’s Authority & Bow of Blessing',
        iconUrl: 'https://aion2-guides.info/assets/icons/ranger/vaizels-authority.webp',
        category: 'STIGMA',
        modeTag: 'BOTH',
        priorityBadge: 'Estigmas Burst',
        summaryEs:
          'Aumenta el alcance, la velocidad de disparo y añade flechas fantasma adicionales en cada ataque.',
        summaryEn:
          'Increases range, firing speed, and adds phantom bonus arrows to every attack.',
        specs: [
          {
            level: 'Lv 12',
            textEs: 'Dispara ráfagas dobles durante 12 segundos',
            textEn: 'Fires double volleys for 12 seconds',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 6. SORCERER (HECHICERO)
  // ==========================================================================
  {
    classId: 'sorcerer',
    nameEs: 'Hechicero (Sorcerer)',
    nameEn: 'Sorcerer',
    archetypeEs: 'Artillería Mágica / Nuke de Fuego y Control de Hielo',
    archetypeEn: 'Arcane Artillery / Fire Nuker & Frost Crowd Control',
    heroIconUrl: 'https://aion2-guides.info/assets/icons/sorcerer/hellfire.webp',
    externalGuideUrlEn: 'https://aion2-guides.info/en/sorcerer/',
    externalGuideUrlEs: 'https://aion2-guides.info/es/sorcerer/',
    oneSentencePveEs:
      'Aplica Marca de Fuego (Fire Mark), mantén Túnica de Llamas activa y encadena Fuego Infernal (Hellfire), Tormenta de Fuego (Firestorm) y Explosión Retardada (Delayed Explosion) dentro de Deseo de Concentración.',
    oneSentencePveEn:
      'Apply Fire Mark, keep Robe of Flame active, and chain Hellfire, Firestorm, and Delayed Explosion inside Wish of Concentration.',
    oneSentencePvpEs:
      'Congela y ralentiza con Cadena de Hielo y Grilletes de Invierno, protégete con Barrera de Acero (Steel Barrier) y ejecuta con Golpe Glacial y Fuego Infernal.',
    oneSentencePvpEn:
      'Freeze and slow with Ice Chain and Winter’s Shackles, shield up with Steel Barrier, and execute with Glacial Smite and Hellfire.',
    statPriorityPveEs: [
      '1. Inteligencia / Poder Mágico y Golpe % (Double Chance)',
      '2. Velocidad de Combate / Lanzamiento (Reduce tiempo de canalización)',
      '3. Crítico Mágico y Amplificación de Daño Elemental',
    ],
    statPriorityPveEn: [
      '1. Magic Power / Intelligence & Double Chance %',
      '2. Combat / Cast Speed (Reduces long cast animations)',
      '3. Magical Critical Hit & Elemental Damage Amplification',
    ],
    statPriorityPvpEs: [
      '1. Daño PvP % y Precisión Mágica',
      '2. Velocidad de Lanzamiento y Absorción en Barrera de Acero',
    ],
    statPriorityPvpEn: [
      '1. PvP Damage % & Magical Accuracy',
      '2. Cast Speed & Steel Barrier Shield Absorption',
    ],
    arcanaPriorityEs: [
      'Arcanas con +Nivel a Fuego Infernal (Hellfire) y Tormenta de Fuego (Firestorm).',
      'Sub-estadísticas de Golpe %, Velocidad de Combate y Crítico Mágico.',
    ],
    arcanaPriorityEn: [
      'Arcanas with +Skill Level to Hellfire and Firestorm.',
      'Sub-stats focused on Double Chance %, Combat Speed, and Magical Crit.',
    ],
    hotbarAndMacroTipEs:
      'Combina Explosión Retardada (Delayed Explosion) + Fuego Infernal (Hellfire) para que ambos impacten en el mismo segundo sobre la Marca de Fuego.',
    hotbarAndMacroTipEn:
      'Sync Delayed Explosion + Hellfire so both detonate simultaneously while Fire Mark is active.',
    skills: [
      {
        slug: 'hellfire',
        nameEs: 'Fuego Infernal',
        nameEn: 'Hellfire',
        iconUrl: 'https://aion2-guides.info/assets/icons/sorcerer/hellfire.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Nuke #1 (Lv 16–20)',
        summaryEs:
          'El hechizo de mayor daño explosivo del Hechicero. A Nivel 16 reduce su tiempo de lanzamiento y deja quemadura crítica.',
        summaryEn:
          'The Sorcerer’s highest burst nuke. At Level 16 reduces cast time and applies a critical burn DoT.',
        specs: [
          {
            level: 'Lv 16',
            textEs: '🔥 Lanzamiento instantáneo tras crítico de Fuego + +30% Daño',
            textEn: '🔥 Instant cast proc after Fire crit + +30% Damage',
          },
        ],
      },
      {
        slug: 'firestorm',
        nameEs: 'Tormenta de Fuego',
        nameEn: 'Firestorm',
        iconUrl: 'https://aion2-guides.info/assets/icons/sorcerer/firestorm.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'AoE Masivo',
        summaryEs:
          'Invoca un torbellino ígneo que destruye grupos de enemigos en Bio-Research y mazmorras de Conquista.',
        summaryEn:
          'Summons a fiery vortex that obliterates mob packs in Bio-Research and Conquest dungeons.',
        specs: [
          {
            level: 'Lv 12',
            textEs: '+Radio de impacto y acumulación de Marca de Fuego',
            textEn: '+Radius & applies Fire Mark stacks',
          },
        ],
      },
      {
        slug: 'steel-barrier',
        nameEs: 'Barrera de Acero & Explosión Divina',
        nameEn: 'Steel Barrier & Divine Burst',
        iconUrl: 'https://aion2-guides.info/assets/icons/sorcerer/steel-barrier.webp',
        category: 'STIGMA',
        modeTag: 'BOTH',
        priorityBadge: 'Escudo & Burst',
        summaryEs:
          'Barrera de Acero absorbe daño letal e impide interrupciones; Explosión Divina maximiza tu ventana ofensiva.',
        summaryEn:
          'Steel Barrier absorbs lethal damage and prevents pushback; Divine Burst maximizes your offensive window.',
        specs: [
          {
            level: 'Lv 12',
            textEs: 'Inmunidad a interrupciones mientras dure el escudo',
            textEn: 'Cast-interruption immunity while shield holds',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 7. ELEMENTALIST (INVOCADOR / ELEMENTALISTA)
  // ==========================================================================
  {
    classId: 'elementalist',
    nameEs: 'Elementalista (Elementalist)',
    nameEn: 'Elementalist',
    archetypeEs: 'Maestro de Espíritus / DoTs, Corrosión y Sinergia de Grupo',
    archetypeEn: 'Spirit Summoner / DoT Corrosion, Dispel & Party Synergy',
    heroIconUrl: 'https://aion2-guides.info/assets/icons/elementalist/elemental-fusion.webp',
    externalGuideUrlEn: 'https://aion2-guides.info/en/elementalist/',
    externalGuideUrlEs: 'https://aion2-guides.info/es/elementalist/',
    oneSentencePveEs:
      'Mantén tus Espíritus evolucionados con Fusión Elemental (Elemental Fusion), apila Corrosión y Nube Maldita sobre el jefe y detónalos con Combustión (Combustion) mientras das Bendición de Llama al grupo.',
    oneSentencePveEn:
      'Keep your Spirits empowered via Elemental Fusion, stack Corrode and Cursed Cloud on the boss, and detonate them with Combustion while buffing the party with Flame Blessing.',
    oneSentencePvpEs:
      'Disipa escudos enemigos con Arrebatar Magia (Seize Magic), transfiere el daño recibido a tu espíritu con Comando Proxy y aterroriza en área con Grito de Terror (Cry of Terror).',
    oneSentencePvpEn:
      'Strip enemy buffs/shields with Seize Magic, redirect incoming damage to your spirit via Command Proxy, and AoE fear with Cry of Terror.',
    statPriorityPveEs: [
      '1. Golpe % (Double Chance) y Poder Mágico',
      '2. Velocidad de Combate y Reducción de Enfriamiento (Ciclo de Espíritus)',
      '3. Daño Continuo (DoT) y Crítico Mágico',
    ],
    statPriorityPveEn: [
      '1. Double Chance % & Magic Power',
      '2. Combat Speed & Cooldown Reduction (Spirit command cycle)',
      '3. Damage over Time (DoT) & Magical Crit',
    ],
    statPriorityPvpEs: [
      '1. Precisión Mágica (Asegurar Grito de Terror y Arrebatar Magia)',
      '2. Defensa PvP % y Vínculo con Espíritu (Command Proxy)',
    ],
    statPriorityPvpEn: [
      '1. Magical Accuracy (Land Cry of Terror & Seize Magic reliably)',
      '2. PvP Defense % & Spirit Bond mitigation (Command Proxy)',
    ],
    arcanaPriorityEs: [
      'Arcanas con +Nivel a Combustión (Combustion), Fusión Elemental y Descenso de Espíritus.',
      'Sub-estadísticas de Golpe % y Velocidad de Combate.',
    ],
    arcanaPriorityEn: [
      'Arcanas with +Skill Level to Combustion, Elemental Fusion, and Spirit’s Descent.',
      'Sub-stats focused on Double Chance % and Combat Speed.',
    ],
    hotbarAndMacroTipEs:
      'Agrupa tus órdenes de Ataque Conjunto (Jointstrike: Corrode + Jointstrike: Curse) en Ranura en Línea para que tu espíritu aplique debuffs automáticamente mientras tú canalizas.',
    hotbarAndMacroTipEn:
      'Group your Spirit Jointstrikes (Jointstrike: Corrode + Jointstrike: Curse) in an Inline Slot so your pet applies debuffs seamlessly while you cast.',
    skills: [
      {
        slug: 'elemental-fusion',
        nameEs: 'Fusión Elemental & Descenso de Espíritus',
        nameEn: 'Elemental Fusion & Spirit’s Descent',
        iconUrl: 'https://aion2-guides.info/assets/icons/elementalist/elemental-fusion.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'CORE #1 (Lv 16–20)',
        summaryEs:
          'Fusiona y potencia a tus espíritus elementales para desatar ataques coordinados en área con multiplicadores masivos.',
        summaryEn:
          'Fuses and empowers your elemental spirits to unleash coordinated AoE strikes with massive multipliers.',
        specs: [
          {
            level: 'Lv 16',
            textEs: '🔥 Invoca Espíritu Ancestral + Reinicia órdenes de espíritu',
            textEn: '🔥 Summons Ancient Spirit + Resets spirit command cooldowns',
          },
        ],
      },
      {
        slug: 'combustion',
        nameEs: 'Combustión',
        nameEn: 'Combustion',
        iconUrl: 'https://aion2-guides.info/assets/icons/elementalist/combustion.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Detonador DoTs & Dispel',
        summaryEs:
          'Hace estallar los efectos de daño continuo sobre el enemigo e inflige daño adicional por cada efecto activo.',
        summaryEn:
          'Detonates active DoT effects on the target, dealing bonus burst damage per active debuff.',
        specs: [
          {
            level: 'Lv 12',
            textEs: '+20% Daño por cada DoT activo sin consumirlos',
            textEn: '+20% Damage per active DoT without consuming them',
          },
        ],
      },
      {
        slug: 'cry-of-terror',
        nameEs: 'Grito de Terror & Poder de Kaisinel',
        nameEn: 'Cry of Terror & Kaisinel’s Power',
        iconUrl: 'https://aion2-guides.info/assets/icons/elementalist/cry-of-terror.webp',
        category: 'STIGMA',
        modeTag: 'BOTH',
        priorityBadge: 'CC Miedo & Burst',
        summaryEs:
          'El control de masas más temido en PvP (Miedo en área) combinado con el estigma de amplificación mágica de Kaisinel.',
        summaryEn:
          'The most feared AoE Fear CC in PvP paired with Kaisinel’s magical amplification Stigma.',
        specs: [
          {
            level: 'Lv 12',
            textEs: 'Ignora resistencia parcial y reduce velocidad al terminar el miedo',
            textEn: 'Pierces partial resistance & slows targets after Fear ends',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 8. CLERIC (CLÉRIGO)
  // ==========================================================================
  {
    classId: 'cleric',
    nameEs: 'Clérigo (Cleric)',
    nameEn: 'Cleric',
    archetypeEs: 'Sanador Principal / Purificación, Escudos y Castigo de Trueno',
    archetypeEn: 'Primary Healer / Cleanse, Immortal Shields & Thunder Smite',
    heroIconUrl: 'https://aion2-guides.info/assets/icons/cleric/radiant-recovery.webp',
    externalGuideUrlEn: 'https://aion2-guides.info/en/cleric/',
    externalGuideUrlEs: 'https://aion2-guides.info/es/cleric/',
    oneSentencePveEs:
      'Mantén Marca Debilitante (Debilitating Mark) sobre el jefe para aumentar el daño de todo el grupo, cicla Luz de Regeneración y Recuperación Radiante, y aporta DPS constante con Trueno del Juicio (Judgment Thunder).',
    oneSentencePveEn:
      'Keep Debilitating Mark on the boss to amplify party damage, cycle Light of Regeneration and Radiant Recovery, and contribute steady DPS with Judgment Thunder.',
    oneSentencePvpEs:
      'Limpia estados alterados al instante con Absolución (Absolution), salva aliados al borde de la muerte con Velo Inmortal (Immortal Veil) y corta curaciones enemigas con Bloqueo de Curación (Heal Block).',
    oneSentencePvpEn:
      'Cleanse CC/debuffs instantly with Absolution, save dying allies with Immortal Veil, and shut down enemy healers with Heal Block.',
    statPriorityPveEs: [
      '1. Velocidad de Combate (+20%+ acelera tanto curaciones como ataques)',
      '2. Poder de Curación / Inteligencia y Golpe % (Las curas también hacen doble proc)',
      '3. Vida Máxima (HP) y Regeneración de Maná',
    ],
    statPriorityPveEn: [
      '1. Combat Speed (+20%+ speeds up both heals and smites)',
      '2. Healing Boost / Magic Power & Double Chance % (Heals can double-proc!)',
      '3. Max HP & Mana Sustain',
    ],
    statPriorityPvpEs: [
      '1. Resistencia a Estado (Si el Clérigo está aturdido no puede usar Absolución)',
      '2. Defensa PvP %, Bloqueo con Escudo y Vida Máxima',
    ],
    statPriorityPvpEn: [
      '1. Status Effect Resistance (A stunned Cleric cannot cast Absolution)',
      '2. PvP Defense %, Shield Block & Max HP',
    ],
    arcanaPriorityEs: [
      'Arcanas con +Nivel a Recuperación Radiante (Radiant Recovery) y Trueno del Juicio (Judgment Thunder).',
      'Sub-estadísticas de Velocidad de Combate, Golpe % y Vida Máxima.',
    ],
    arcanaPriorityEn: [
      'Arcanas with +Skill Level to Radiant Recovery and Judgment Thunder.',
      'Sub-stats focused on Combat Speed, Double Chance %, and Max HP.',
    ],
    hotbarAndMacroTipEs:
      'NUNCA metas Absolución (Purificar) ni Velo Inmortal en macros: tenlos en teclas de acceso rápido inmediato. Usa la cadena ofensiva Retribución de la Tierra ➔ Trueno del Juicio en Ranura en Línea para farmear rápido.',
    hotbarAndMacroTipEn:
      'NEVER put Absolution (Cleanse) or Immortal Veil inside macros: bind them to instant reaction keys. Put Earth’s Retribution ➔ Judgment Thunder in an Inline Slot for fast solo farming.',
    skills: [
      {
        slug: 'radiant-recovery',
        nameEs: 'Recuperación Radiante & Luz de Curación',
        nameEn: 'Radiant Recovery & Healing Light',
        iconUrl: 'https://aion2-guides.info/assets/icons/cleric/radiant-recovery.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'Curación Núcleo (Lv 16)',
        summaryEs:
          'Curación grupal e individual de emergencia que además aplica escudo protector y regeneración continua a Nivel 16.',
        summaryEn:
          'Emergency party and single-target heal that also applies a protective barrier and HoT at Level 16.',
        specs: [
          {
            level: 'Lv 16',
            textEs: '🔥 Otorga escudo equivalente al 20% de la curación + Limpia 1 debuff',
            textEn: '🔥 Grants barrier equal to 20% healed + Cleanses 1 debuff',
          },
        ],
      },
      {
        slug: 'judgment-thunder',
        nameEs: 'Trueno del Juicio & Cadena de Tormento',
        nameEn: 'Judgment Thunder & Chain of Torment',
        iconUrl: 'https://aion2-guides.info/assets/icons/cleric/judgment-thunder.webp',
        category: 'ACTIVE',
        modeTag: 'BOTH',
        priorityBadge: 'DPS Clérigo (Lv 16)',
        summaryEs:
          'Descarga eléctrica de alto daño para limpiar Bio-Research en menos de 90s y presionar en PvP.',
        summaryEn:
          'High-damage lightning strike to clear Bio-Research under 90s and pressure targets in PvP.',
        specs: [
          {
            level: 'Lv 16',
            textEs: 'Rebota hasta a 4 objetivos y reduce su Resistencia Mágica',
            textEn: 'Chains up to 4 targets and reduces their Magic Resistance',
          },
        ],
      },
      {
        slug: 'immortal-veil',
        nameEs: 'Velo Inmortal & Salvación',
        nameEn: 'Immortal Veil & Salvation',
        iconUrl: 'https://aion2-guides.info/assets/icons/cleric/immortal-veil.webp',
        category: 'STIGMA',
        modeTag: 'BOTH',
        priorityBadge: 'Salvavidas Definitivo',
        summaryEs:
          'Envuelve al grupo en una barrera inmortal que evita muertes por mecánicas de jefe o burst enemigo en PvP.',
        summaryEn:
          'Envelops the party in an immortal barrier that prevents wipes from boss mechanics or PvP burst.',
        specs: [
          {
            level: 'Lv 12',
            textEs: '+25% Curación recibida mientras el Velo está activo',
            textEn: '+25% Healing received while the Veil is active',
          },
        ],
      },
    ],
  },
];
