// ─────────────────────────────────────────────────────────────
// GymFlow – Catálogo estático de ejercicios (todo en español)
// Convertido de backend/exercises_data.py
// Sin dependencia de servidor: búsqueda y filtrado en cliente.
// ─────────────────────────────────────────────────────────────

export interface Exercise {
  exercise_id: string;
  name: string;
  body_part: string;
  target: string;
  equipment: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  instructions: string[];
  category: string;
}

export const EXERCISES: Exercise[] = [
  // ==================== PECHO ====================
  {
    exercise_id: 'barbell-bench-press',
    name: 'Press de Banca con Barra',
    body_part: 'chest', target: 'pectorals', equipment: 'barbell', category: 'strength',
    primary_muscles: ['pectoral mayor'],
    secondary_muscles: ['deltoides anterior', 'tríceps braquial'],
    instructions: [
      'Túmbate en un banco plano con los pies apoyados en el suelo. Agarra la barra algo más ancha que el ancho de hombros.',
      'Saca la barra del soporte y sostenla justo encima del pecho con los brazos completamente extendidos.',
      'Baja la barra lentamente hasta el centro del pecho, manteniendo los codos a unos 45 grados.',
      'Empuja la barra hacia arriba hasta la posición inicial, extendiendo completamente los brazos.',
    ],
  },
  {
    exercise_id: 'incline-barbell-bench-press',
    name: 'Press Inclinado con Barra',
    body_part: 'chest', target: 'pectorals', equipment: 'barbell', category: 'strength',
    primary_muscles: ['pectoral mayor (superior)'],
    secondary_muscles: ['deltoides anterior', 'tríceps braquial'],
    instructions: [
      'Ajusta el banco a una inclinación de 30-45 grados. Túmbate y agarra la barra algo más ancha que el ancho de hombros.',
      'Saca la barra del soporte y bájala hasta la parte superior del pecho.',
      'Empuja la barra hasta la extensión completa, concentrándote en apretar el pecho superior.',
    ],
  },
  {
    exercise_id: 'decline-barbell-bench-press',
    name: 'Press Declinado con Barra',
    body_part: 'chest', target: 'pectorals', equipment: 'barbell', category: 'strength',
    primary_muscles: ['pectoral mayor (inferior)'],
    secondary_muscles: ['deltoides anterior', 'tríceps braquial'],
    instructions: [
      'Coloca el banco en posición declinada. Asegura las piernas y túmbate agarrando la barra con un agarre más ancho que el hombro.',
      'Saca la barra y bájala hasta la parte inferior del pecho.',
      'Empuja la barra hasta la extensión completa de brazos.',
    ],
  },
  {
    exercise_id: 'dumbbell-bench-press',
    name: 'Press de Banca con Mancuernas',
    body_part: 'chest', target: 'pectorals', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['pectoral mayor'],
    secondary_muscles: ['deltoides anterior', 'tríceps braquial'],
    instructions: [
      'Túmbate en un banco plano sosteniendo una mancuerna en cada mano a la altura del pecho.',
      'Empuja las mancuernas hacia arriba hasta que los brazos queden completamente extendidos.',
      'Baja las mancuernas de vuelta a la altura del pecho con control.',
    ],
  },
  {
    exercise_id: 'incline-dumbbell-press',
    name: 'Press Inclinado con Mancuernas',
    body_part: 'chest', target: 'pectorals', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['pectoral mayor (superior)'],
    secondary_muscles: ['deltoides anterior', 'tríceps braquial'],
    instructions: [
      'Ajusta un banco a 30-45 grados. Sostén una mancuerna en cada mano a la altura de los hombros.',
      'Empuja las mancuernas hacia arriba hasta que los brazos queden completamente extendidos.',
      'Baja lentamente de vuelta a la posición inicial.',
    ],
  },
  {
    exercise_id: 'dumbbell-fly',
    name: 'Apertura con Mancuernas',
    body_part: 'chest', target: 'pectorals', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['pectoral mayor'],
    secondary_muscles: ['deltoides anterior', 'bíceps braquial'],
    instructions: [
      'Túmbate en un banco plano sosteniendo las mancuernas sobre el pecho con las palmas enfrentadas.',
      'Con una ligera flexión en los codos, baja las mancuernas hacia los lados describiendo un arco amplio.',
      'Contrae el pecho para reunir las mancuernas de nuevo sobre el pecho.',
    ],
  },
  {
    exercise_id: 'incline-dumbbell-fly',
    name: 'Apertura Inclinada con Mancuernas',
    body_part: 'chest', target: 'pectorals', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['pectoral mayor (superior)'],
    secondary_muscles: ['deltoides anterior', 'bíceps braquial'],
    instructions: [
      'Ajusta el banco a 30-45 grados. Sostén las mancuernas sobre el pecho con las palmas hacia dentro.',
      'Baja las mancuernas hacia los lados con los codos ligeramente flexionados.',
      'Reúne las mancuernas apretando el pecho superior.',
    ],
  },
  {
    exercise_id: 'cable-crossover',
    name: 'Cruce de Poleas',
    body_part: 'chest', target: 'pectorals', equipment: 'cable', category: 'strength',
    primary_muscles: ['pectoral mayor'],
    secondary_muscles: ['deltoides anterior', 'bíceps braquial'],
    instructions: [
      'Coloca ambas poleas en la posición más alta. Sitúate en el centro y agarra un mango en cada mano.',
      'Da un paso al frente e inclina ligeramente el torso. Mantén una ligera flexión en los codos.',
      'Tira de los mangos hacia abajo y hacia el centro frente al pecho, como si dieras un abrazo.',
      'Regresa lentamente a la posición inicial con control.',
    ],
  },
  {
    exercise_id: 'chest-dip',
    name: 'Fondos para Pecho',
    body_part: 'chest', target: 'pectorals', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['pectoral mayor'],
    secondary_muscles: ['deltoides anterior', 'tríceps braquial'],
    instructions: [
      'Agarra las barras paralelas y elévate con los brazos completamente extendidos.',
      'Inclina el torso hacia delante unos 30 grados. Baja el cuerpo flexionando los codos.',
      'Desciende hasta notar el estiramiento en el pecho y luego empuja hasta la posición inicial.',
    ],
  },
  {
    exercise_id: 'push-up',
    name: 'Flexiones',
    body_part: 'chest', target: 'pectorals', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['pectoral mayor'],
    secondary_muscles: ['deltoides anterior', 'tríceps braquial', 'core'],
    instructions: [
      'Colócate en posición de plancha con las manos ligeramente más anchas que el ancho de hombros.',
      'Baja el cuerpo hasta que el pecho casi toque el suelo, manteniendo el core tenso.',
      'Empuja hacia arriba hasta la posición inicial.',
    ],
  },
  {
    exercise_id: 'machine-chest-press',
    name: 'Press de Pecho en Máquina',
    body_part: 'chest', target: 'pectorals', equipment: 'machine', category: 'strength',
    primary_muscles: ['pectoral mayor'],
    secondary_muscles: ['deltoides anterior', 'tríceps braquial'],
    instructions: [
      'Siéntate en la máquina y ajusta el asiento para que los mangos queden a la altura del pecho.',
      'Agarra los mangos y empújalos hacia delante hasta que los brazos queden completamente extendidos.',
      'Regresa lentamente a la posición inicial con control.',
    ],
  },
  {
    exercise_id: 'pec-deck-fly',
    name: 'Apertura en Pec Deck',
    body_part: 'chest', target: 'pectorals', equipment: 'machine', category: 'strength',
    primary_muscles: ['pectoral mayor'],
    secondary_muscles: ['deltoides anterior'],
    instructions: [
      'Siéntate en la máquina pec deck y ajusta los brazos para que los codos queden a la altura del pecho.',
      'Apoya los antebrazos en los apoyos y junta los brazos frente al pecho.',
      'Regresa lentamente a la posición inicial, notando el estiramiento en el pecho.',
    ],
  },
  {
    exercise_id: 'dumbbell-pullover',
    name: 'Pullover con Mancuerna',
    body_part: 'chest', target: 'pectorals', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['pectoral mayor', 'dorsal ancho'],
    secondary_muscles: ['tríceps braquial', 'redondo mayor'],
    instructions: [
      'Túmbate en un banco sosteniendo una mancuerna con ambas manos sobre el pecho.',
      'Baja la mancuerna por detrás de la cabeza describiendo un arco, notando el estiramiento en el pecho y el dorsal.',
      'Devuelve la mancuerna a la posición inicial sobre el pecho.',
    ],
  },
  // ==================== ESPALDA ====================
  {
    exercise_id: 'barbell-bent-over-row',
    name: 'Remo con Barra Inclinado',
    body_part: 'back', target: 'lats', equipment: 'barbell', category: 'strength',
    primary_muscles: ['dorsal ancho'],
    secondary_muscles: ['romboides', 'bíceps braquial', 'deltoides posterior'],
    instructions: [
      'De pie con los pies al ancho de hombros, dobla la cadera hasta que el torso quede casi paralelo al suelo.',
      'Agarra la barra con las manos algo más anchas que el ancho de hombros.',
      'Tira de la barra hacia la parte inferior del pecho, apretando los omóplatos.',
      'Baja la barra de vuelta con control.',
    ],
  },
  {
    exercise_id: 'lat-pulldown',
    name: 'Jalón al Pecho',
    body_part: 'back', target: 'lats', equipment: 'cable', category: 'strength',
    primary_muscles: ['dorsal ancho'],
    secondary_muscles: ['bíceps braquial', 'romboides', 'redondo mayor'],
    instructions: [
      'Siéntate en la máquina de jalón y agarra la barra con un agarre ancho en pronación.',
      'Tira de la barra hacia el pecho superior inclinándote ligeramente hacia atrás.',
      'Aprieta el dorsal en la parte inferior y regresa lentamente la barra a la posición inicial.',
    ],
  },
  {
    exercise_id: 'seated-cable-row',
    name: 'Remo en Polea Sentado',
    body_part: 'back', target: 'upper back', equipment: 'cable', category: 'strength',
    primary_muscles: ['romboides', 'dorsal ancho'],
    secondary_muscles: ['bíceps braquial', 'deltoides posterior', 'trapecio'],
    instructions: [
      'Siéntate en la estación de remo en polea con los pies en la plataforma. Agarra el mango con ambas manos.',
      'Tira del mango hacia el abdomen, manteniendo la espalda recta y apretando los omóplatos.',
      'Regresa lentamente a la posición inicial, permitiendo un ligero estiramiento del dorsal.',
    ],
  },
  {
    exercise_id: 'pull-up',
    name: 'Dominadas',
    body_part: 'back', target: 'lats', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['dorsal ancho'],
    secondary_muscles: ['bíceps braquial', 'redondo mayor', 'romboides'],
    instructions: [
      'Cuélgate de una barra de dominadas con agarre en pronación, manos algo más anchas que el ancho de hombros.',
      'Tira de tu cuerpo hacia arriba hasta que la barbilla supere la barra.',
      'Baja con control hasta la extensión completa de brazos.',
    ],
  },
  {
    exercise_id: 'chin-up',
    name: 'Dominadas en Supino',
    body_part: 'back', target: 'lats', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['dorsal ancho', 'bíceps braquial'],
    secondary_muscles: ['redondo mayor', 'romboides'],
    instructions: [
      'Cuélgate de una barra con agarre en supinación (palmas hacia ti), manos al ancho de hombros.',
      'Tira del cuerpo hacia arriba hasta que la barbilla supere la barra.',
      'Baja con control hasta la posición inicial.',
    ],
  },
  {
    exercise_id: 't-bar-row',
    name: 'Remo en T',
    body_part: 'back', target: 'upper back', equipment: 'barbell', category: 'strength',
    primary_muscles: ['dorsal ancho', 'romboides'],
    secondary_muscles: ['bíceps braquial', 'deltoides posterior', 'trapecio'],
    instructions: [
      'Posiciónate sobre el aparato de remo en T. Dobla la cadera y agarra los mangos.',
      'Tira del peso hacia el pecho llevando los codos hacia atrás.',
      'Baja el peso con control, manteniendo la espalda recta en todo momento.',
    ],
  },
  {
    exercise_id: 'single-arm-dumbbell-row',
    name: 'Remo con Mancuerna a Una Mano',
    body_part: 'back', target: 'lats', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['dorsal ancho'],
    secondary_muscles: ['romboides', 'bíceps braquial', 'deltoides posterior'],
    instructions: [
      'Apoya una rodilla y una mano en un banco para equilibrarte. Sostén una mancuerna con la mano contraria.',
      'Tira de la mancuerna hacia la cadera, apretando el dorsal en la parte superior.',
      'Baja la mancuerna con control y repite. Cambia de lado.',
    ],
  },
  {
    exercise_id: 'deadlift',
    name: 'Peso Muerto',
    body_part: 'back', target: 'spine', equipment: 'barbell', category: 'strength',
    primary_muscles: ['erectores espinales', 'glúteo mayor'],
    secondary_muscles: ['isquiotibiales', 'trapecio', 'antebrazos'],
    instructions: [
      'De pie con los pies al ancho de caderas, barra sobre el empeine. Dobla caderas y rodillas para agarrar la barra.',
      'Empuja con los talones, extendiendo caderas y rodillas simultáneamente hasta ponerte de pie.',
      'Mantén la barra cerca del cuerpo durante todo el movimiento.',
      'Baja la barra al suelo inclinando las caderas.',
    ],
  },
  {
    exercise_id: 'machine-row',
    name: 'Remo en Máquina',
    body_part: 'back', target: 'upper back', equipment: 'machine', category: 'strength',
    primary_muscles: ['romboides', 'dorsal ancho'],
    secondary_muscles: ['bíceps braquial', 'deltoides posterior'],
    instructions: [
      'Siéntate en la máquina de remo y ajusta el apoyo pectoral. Agarra los mangos.',
      'Tira de los mangos hacia el torso, apretando los omóplatos.',
      'Regresa lentamente a la posición inicial.',
    ],
  },
  {
    exercise_id: 'face-pull',
    name: 'Face Pull',
    body_part: 'back', target: 'upper back', equipment: 'cable', category: 'strength',
    primary_muscles: ['deltoides posterior', 'romboides'],
    secondary_muscles: ['trapecio', 'infraespinoso'],
    instructions: [
      'Ajusta una polea a la altura del pecho superior con un accesorio de cuerda.',
      'Tira de la cuerda hacia la cara, separando los extremos y apretando los deltoides posteriores.',
      'Regresa lentamente a la posición inicial.',
    ],
  },
  {
    exercise_id: 'straight-arm-pulldown',
    name: 'Jalón con Brazos Extendidos',
    body_part: 'back', target: 'lats', equipment: 'cable', category: 'strength',
    primary_muscles: ['dorsal ancho'],
    secondary_muscles: ['redondo mayor', 'deltoides posterior'],
    instructions: [
      'De pie frente a una polea alta con una barra recta.',
      'Con los brazos casi extendidos, tira de la barra hacia abajo en arco hasta los muslos.',
      'Aprieta el dorsal en la parte inferior y devuelve la barra lentamente hacia arriba.',
    ],
  },
  {
    exercise_id: 'hyperextension',
    name: 'Hiperextensión de Espalda',
    body_part: 'back', target: 'spine', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['erectores espinales'],
    secondary_muscles: ['glúteo mayor', 'isquiotibiales'],
    instructions: [
      'Colócate en el banco de hiperextensiones con las caderas sobre el apoyo.',
      'Cruza los brazos sobre el pecho y baja el torso hacia el suelo.',
      'Sube el torso hasta que el cuerpo forme una línea recta.',
    ],
  },
  {
    exercise_id: 'wide-grip-lat-pulldown',
    name: 'Jalón al Pecho Agarre Ancho',
    body_part: 'back', target: 'lats', equipment: 'cable', category: 'strength',
    primary_muscles: ['dorsal ancho'],
    secondary_muscles: ['redondo mayor', 'bíceps braquial', 'romboides'],
    instructions: [
      'Siéntate en el jalón al pecho y agarra la barra con un agarre ancho en pronación.',
      'Tira de la barra hacia el pecho superior, concentrándote en llevar los codos hacia abajo.',
      'Controla la barra de vuelta a la posición superior.',
    ],
  },
  {
    exercise_id: 'close-grip-lat-pulldown',
    name: 'Jalón al Pecho Agarre Cerrado',
    body_part: 'back', target: 'lats', equipment: 'cable', category: 'strength',
    primary_muscles: ['dorsal ancho'],
    secondary_muscles: ['bíceps braquial', 'romboides', 'redondo mayor'],
    instructions: [
      'Acopla un mango en V a la máquina de jalón al pecho.',
      'Tira del mango hasta el pecho apretando el dorsal.',
      'Regresa lentamente a la posición inicial.',
    ],
  },
  // ==================== HOMBROS ====================
  {
    exercise_id: 'overhead-press',
    name: 'Press Militar',
    body_part: 'shoulders', target: 'delts', equipment: 'barbell', category: 'strength',
    primary_muscles: ['deltoides anterior', 'deltoides medial'],
    secondary_muscles: ['tríceps braquial', 'trapecio', 'core'],
    instructions: [
      'De pie con los pies al ancho de hombros, sostén la barra a la altura de los hombros con agarre en pronación.',
      'Empuja la barra recto hacia arriba hasta que los brazos estén completamente extendidos.',
      'Baja la barra a la altura de los hombros con control.',
    ],
  },
  {
    exercise_id: 'dumbbell-shoulder-press',
    name: 'Press de Hombros con Mancuernas',
    body_part: 'shoulders', target: 'delts', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['deltoides anterior', 'deltoides medial'],
    secondary_muscles: ['tríceps braquial', 'trapecio'],
    instructions: [
      'Sentado o de pie, sostén las mancuernas a la altura de los hombros con las palmas hacia delante.',
      'Empuja ambas mancuernas hacia arriba hasta que los brazos estén completamente extendidos.',
      'Baja de vuelta a la altura de los hombros con control.',
    ],
  },
  {
    exercise_id: 'lateral-raise',
    name: 'Elevaciones Laterales',
    body_part: 'shoulders', target: 'delts', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['deltoides medial'],
    secondary_muscles: ['deltoides anterior', 'trapecio'],
    instructions: [
      'De pie con las mancuernas a los lados, palmas hacia el cuerpo.',
      'Eleva ambos brazos hacia los lados hasta que queden paralelos al suelo.',
      'Baja lentamente con control.',
    ],
  },
  {
    exercise_id: 'front-raise',
    name: 'Elevaciones Frontales',
    body_part: 'shoulders', target: 'delts', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['deltoides anterior'],
    secondary_muscles: ['deltoides medial', 'pectoral mayor (superior)'],
    instructions: [
      'De pie con las mancuernas delante de los muslos, palmas hacia el cuerpo.',
      'Eleva una o ambas mancuernas al frente hasta la altura de los hombros.',
      'Baja con control.',
    ],
  },
  {
    exercise_id: 'rear-delt-fly',
    name: 'Apertura para Deltoides Posterior',
    body_part: 'shoulders', target: 'delts', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['deltoides posterior'],
    secondary_muscles: ['romboides', 'trapecio'],
    instructions: [
      'Dobla las caderas con una ligera flexión de rodillas, sostén las mancuernas bajo el pecho.',
      'Eleva ambas mancuernas hacia los lados, apretando los deltoides posteriores en la parte superior.',
      'Baja con control.',
    ],
  },
  {
    exercise_id: 'arnold-press',
    name: 'Press Arnold',
    body_part: 'shoulders', target: 'delts', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['deltoides anterior', 'deltoides medial'],
    secondary_muscles: ['tríceps braquial', 'trapecio'],
    instructions: [
      'Sentado, sostén las mancuernas a la altura del pecho con las palmas hacia ti (como el final de un curl).',
      'A medida que empujas las mancuernas hacia arriba, gira las palmas hacia delante.',
      'Invierte el movimiento al bajar de vuelta a la posición inicial.',
    ],
  },
  {
    exercise_id: 'upright-row',
    name: 'Remo al Mentón',
    body_part: 'shoulders', target: 'delts', equipment: 'barbell', category: 'strength',
    primary_muscles: ['deltoides medial', 'trapecio'],
    secondary_muscles: ['deltoides anterior', 'bíceps braquial'],
    instructions: [
      'De pie, sostén una barra con agarre estrecho en pronación frente a los muslos.',
      'Tira de la barra recto hacia arriba por el cuerpo hasta la altura de la barbilla, liderando con los codos.',
      'Baja la barra de vuelta con control.',
    ],
  },
  {
    exercise_id: 'cable-lateral-raise',
    name: 'Elevación Lateral en Polea',
    body_part: 'shoulders', target: 'delts', equipment: 'cable', category: 'strength',
    primary_muscles: ['deltoides medial'],
    secondary_muscles: ['deltoides anterior', 'trapecio'],
    instructions: [
      'Colócate de lado a una polea baja y agarra el mango con la mano más alejada.',
      'Eleva el brazo hacia el lado hasta que quede paralelo al suelo.',
      'Baja lentamente a la posición inicial.',
    ],
  },
  {
    exercise_id: 'machine-shoulder-press',
    name: 'Press de Hombros en Máquina',
    body_part: 'shoulders', target: 'delts', equipment: 'machine', category: 'strength',
    primary_muscles: ['deltoides anterior', 'deltoides medial'],
    secondary_muscles: ['tríceps braquial', 'trapecio'],
    instructions: [
      'Siéntate en la máquina de press de hombros y ajusta el asiento para que los mangos queden a la altura de los hombros.',
      'Empuja los mangos hacia arriba hasta que los brazos estén completamente extendidos.',
      'Baja a la posición inicial con control.',
    ],
  },
  {
    exercise_id: 'barbell-shrug',
    name: 'Encogimiento de Hombros con Barra',
    body_part: 'shoulders', target: 'traps', equipment: 'barbell', category: 'strength',
    primary_muscles: ['trapecio'],
    secondary_muscles: ['elevador de la escápula'],
    instructions: [
      'De pie, sostén una barra con agarre en pronación con los brazos extendidos.',
      'Encoge los hombros recto hacia las orejas lo más alto posible.',
      'Mantén brevemente en lo alto y baja de vuelta.',
    ],
  },
  {
    exercise_id: 'reverse-fly-machine',
    name: 'Apertura Posterior en Máquina',
    body_part: 'shoulders', target: 'delts', equipment: 'machine', category: 'strength',
    primary_muscles: ['deltoides posterior'],
    secondary_muscles: ['romboides', 'trapecio'],
    instructions: [
      'Siéntate frente a la máquina pec deck (al revés). Agarra los mangos con los brazos extendidos.',
      'Tira de los mangos hacia atrás, apretando los deltoides posteriores y la parte superior de la espalda.',
      'Regresa a la posición inicial con control.',
    ],
  },
  {
    exercise_id: 'cable-face-pull',
    name: 'Face Pull en Polea',
    body_part: 'shoulders', target: 'delts', equipment: 'cable', category: 'strength',
    primary_muscles: ['deltoides posterior', 'romboides'],
    secondary_muscles: ['trapecio', 'infraespinoso'],
    instructions: [
      'Ajusta una polea a la altura de la cara con un accesorio de cuerda.',
      'Tira de la cuerda hacia la cara, separando los extremos y rotando los hombros hacia fuera.',
      'Aprieta en la posición final y regresa con control.',
    ],
  },
  {
    exercise_id: 'dumbbell-shrug',
    name: 'Encogimiento de Hombros con Mancuernas',
    body_part: 'shoulders', target: 'traps', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['trapecio'],
    secondary_muscles: ['elevador de la escápula'],
    instructions: [
      'De pie, sostén mancuernas pesadas a los lados.',
      'Encoge los hombros hacia las orejas lo más alto posible.',
      'Mantén brevemente y baja con control.',
    ],
  },
  // ==================== BRAZOS ====================
  {
    exercise_id: 'barbell-curl',
    name: 'Curl con Barra',
    body_part: 'upper arms', target: 'biceps', equipment: 'barbell', category: 'strength',
    primary_muscles: ['bíceps braquial'],
    secondary_muscles: ['braquial', 'antebrazos'],
    instructions: [
      'De pie, sostén una barra con agarre en supinación y los brazos completamente extendidos.',
      'Sube la barra hacia los hombros manteniendo los codos pegados a los costados.',
      'Baja la barra con control hasta la extensión completa de brazos.',
    ],
  },
  {
    exercise_id: 'dumbbell-curl',
    name: 'Curl con Mancuernas',
    body_part: 'upper arms', target: 'biceps', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['bíceps braquial'],
    secondary_muscles: ['braquial', 'antebrazos'],
    instructions: [
      'De pie con una mancuerna en cada mano a los costados, palmas hacia delante.',
      'Sube ambas mancuernas hacia los hombros.',
      'Baja lentamente con control.',
    ],
  },
  {
    exercise_id: 'hammer-curl',
    name: 'Curl Martillo',
    body_part: 'upper arms', target: 'biceps', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['braquial', 'braquiorradial'],
    secondary_muscles: ['bíceps braquial'],
    instructions: [
      'De pie con las mancuernas en agarre neutro (palmas enfrentadas).',
      'Sube las mancuernas hacia los hombros sin rotar las muñecas.',
      'Baja con control.',
    ],
  },
  {
    exercise_id: 'preacher-curl',
    name: 'Curl en Banco Scott',
    body_part: 'upper arms', target: 'biceps', equipment: 'barbell', category: 'strength',
    primary_muscles: ['bíceps braquial'],
    secondary_muscles: ['braquial'],
    instructions: [
      'Siéntate en el banco Scott y apoya la parte superior de los brazos en el soporte.',
      'Sube la barra hacia los hombros.',
      'Baja lentamente manteniendo la tensión en el bíceps.',
    ],
  },
  {
    exercise_id: 'cable-curl',
    name: 'Curl en Polea',
    body_part: 'upper arms', target: 'biceps', equipment: 'cable', category: 'strength',
    primary_muscles: ['bíceps braquial'],
    secondary_muscles: ['braquial', 'antebrazos'],
    instructions: [
      'De pie frente a una polea baja con accesorio de barra recta o barra EZ.',
      'Sube la barra hacia los hombros manteniendo los codos fijos a los costados.',
      'Baja con control.',
    ],
  },
  {
    exercise_id: 'tricep-pushdown',
    name: 'Extensión de Tríceps en Polea',
    body_part: 'upper arms', target: 'triceps', equipment: 'cable', category: 'strength',
    primary_muscles: ['tríceps braquial'],
    secondary_muscles: ['ancóneo'],
    instructions: [
      'De pie en una polea alta con accesorio de barra recta o cuerda.',
      'Baja el accesorio extendiendo los codos, manteniendo la parte superior del brazo estática.',
      'Regresa lentamente a la posición inicial.',
    ],
  },
  {
    exercise_id: 'skull-crusher',
    name: 'Press Francés',
    body_part: 'upper arms', target: 'triceps', equipment: 'barbell', category: 'strength',
    primary_muscles: ['tríceps braquial'],
    secondary_muscles: ['ancóneo'],
    instructions: [
      'Túmbate en un banco plano sosteniendo una barra EZ o barra con los brazos extendidos sobre el pecho.',
      'Baja la barra hacia la frente flexionando solo los codos.',
      'Extiende los brazos de vuelta a la posición inicial.',
    ],
  },
  {
    exercise_id: 'overhead-tricep-extension',
    name: 'Extensión de Tríceps sobre la Cabeza',
    body_part: 'upper arms', target: 'triceps', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['tríceps braquial (cabeza larga)'],
    secondary_muscles: ['ancóneo'],
    instructions: [
      'De pie o sentado, sostén una mancuerna con ambas manos sobre la cabeza con los brazos extendidos.',
      'Baja la mancuerna por detrás de la cabeza flexionando los codos.',
      'Extiende los brazos de vuelta a la posición inicial sobre la cabeza.',
    ],
  },
  {
    exercise_id: 'tricep-dip',
    name: 'Fondos para Tríceps',
    body_part: 'upper arms', target: 'triceps', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['tríceps braquial'],
    secondary_muscles: ['deltoides anterior', 'pectoral mayor'],
    instructions: [
      'Agarra las barras paralelas y elévate con los brazos extendidos. Mantén el torso erguido.',
      'Baja el cuerpo flexionando los codos hasta que lleguen a 90 grados.',
      'Empuja de vuelta a la posición inicial.',
    ],
  },
  {
    exercise_id: 'concentration-curl',
    name: 'Curl Concentrado',
    body_part: 'upper arms', target: 'biceps', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['bíceps braquial'],
    secondary_muscles: ['braquial'],
    instructions: [
      'Siéntate en un banco con las piernas abiertas. Apoya el codo en la cara interna del muslo, sosteniendo una mancuerna.',
      'Sube la mancuerna hacia el hombro, apretando en la parte superior.',
      'Baja con control.',
    ],
  },
  {
    exercise_id: 'close-grip-bench-press',
    name: 'Press de Banca Agarre Cerrado',
    body_part: 'upper arms', target: 'triceps', equipment: 'barbell', category: 'strength',
    primary_muscles: ['tríceps braquial'],
    secondary_muscles: ['pectoral mayor', 'deltoides anterior'],
    instructions: [
      'Túmbate en un banco plano y agarra la barra con las manos al ancho de hombros o más estrecho.',
      'Baja la barra hasta la parte inferior del pecho, manteniendo los codos cerca del cuerpo.',
      'Empuja la barra hacia arriba, concentrándote en el tríceps.',
    ],
  },
  {
    exercise_id: 'ez-bar-curl',
    name: 'Curl con Barra EZ',
    body_part: 'upper arms', target: 'biceps', equipment: 'barbell', category: 'strength',
    primary_muscles: ['bíceps braquial'],
    secondary_muscles: ['braquial', 'antebrazos'],
    instructions: [
      'De pie, sostén la barra EZ con agarre en supinación en las partes anguladas.',
      'Sube la barra hacia los hombros manteniendo los codos estacionarios.',
      'Baja con control.',
    ],
  },
  {
    exercise_id: 'cable-tricep-overhead',
    name: 'Extensión de Tríceps sobre la Cabeza en Polea',
    body_part: 'upper arms', target: 'triceps', equipment: 'cable', category: 'strength',
    primary_muscles: ['tríceps braquial (cabeza larga)'],
    secondary_muscles: ['ancóneo'],
    instructions: [
      'De pie de espaldas a una polea alta con accesorio de cuerda.',
      'Sostén la cuerda sobre la cabeza y extiende los brazos hacia delante estirando los codos.',
      'Regresa a la posición inicial con control.',
    ],
  },
  {
    exercise_id: 'incline-hammer-curl',
    name: 'Curl Martillo Inclinado',
    body_part: 'upper arms', target: 'biceps', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['braquial', 'bíceps braquial'],
    secondary_muscles: ['braquiorradial'],
    instructions: [
      'Siéntate en un banco inclinado con las mancuernas en agarre neutro a los lados.',
      'Sube las mancuernas hacia los hombros sin rotar las muñecas.',
      'Baja con control, notando el estiramiento en la parte inferior.',
    ],
  },
  // ==================== PIERNAS ====================
  {
    exercise_id: 'barbell-squat',
    name: 'Sentadilla con Barra',
    body_part: 'upper legs', target: 'quads', equipment: 'barbell', category: 'strength',
    primary_muscles: ['cuádriceps', 'glúteo mayor'],
    secondary_muscles: ['isquiotibiales', 'erectores espinales', 'core'],
    instructions: [
      'Coloca la barra sobre la parte superior de la espalda (trapecios). Sitúate con los pies al ancho de hombros.',
      'Dobla rodillas y caderas para bajar el cuerpo como si fueras a sentarte.',
      'Baja hasta que los muslos estén al menos paralelos al suelo.',
      'Empuja con los talones para volver a ponerte de pie.',
    ],
  },
  {
    exercise_id: 'front-squat',
    name: 'Sentadilla Frontal',
    body_part: 'upper legs', target: 'quads', equipment: 'barbell', category: 'strength',
    primary_muscles: ['cuádriceps'],
    secondary_muscles: ['glúteo mayor', 'core', 'espalda superior'],
    instructions: [
      'Sostén la barra sobre la parte delantera de los hombros con los codos en alto.',
      'Baja manteniendo el torso lo más erguido posible.',
      'Empuja con los talones hacia la posición inicial.',
    ],
  },
  {
    exercise_id: 'leg-press',
    name: 'Prensa de Piernas',
    body_part: 'upper legs', target: 'quads', equipment: 'machine', category: 'strength',
    primary_muscles: ['cuádriceps', 'glúteo mayor'],
    secondary_muscles: ['isquiotibiales', 'gemelos'],
    instructions: [
      'Siéntate en la prensa de piernas y coloca los pies al ancho de hombros en la plataforma.',
      'Suelta el seguro y baja la plataforma flexionando las rodillas hasta 90 grados.',
      'Empuja la plataforma hacia arriba sin bloquear las rodillas.',
    ],
  },
  {
    exercise_id: 'hack-squat',
    name: 'Sentadilla Hack',
    body_part: 'upper legs', target: 'quads', equipment: 'machine', category: 'strength',
    primary_muscles: ['cuádriceps'],
    secondary_muscles: ['glúteo mayor', 'isquiotibiales'],
    instructions: [
      'Posiciónate en la máquina hack squat con los hombros bajo los apoyos.',
      'Baja el cuerpo flexionando las rodillas hasta que los muslos queden paralelos a la plataforma.',
      'Empuja de vuelta a la posición inicial.',
    ],
  },
  {
    exercise_id: 'leg-extension',
    name: 'Extensión de Cuádriceps',
    body_part: 'upper legs', target: 'quads', equipment: 'machine', category: 'strength',
    primary_muscles: ['cuádriceps'],
    secondary_muscles: [],
    instructions: [
      'Siéntate en la máquina de extensiones con las piernas bajo el apoyo.',
      'Extiende las piernas hasta que queden rectas, apretando los cuádriceps en la parte superior.',
      'Baja con control.',
    ],
  },
  {
    exercise_id: 'leg-curl',
    name: 'Curl de Isquiotibiales',
    body_part: 'upper legs', target: 'hamstrings', equipment: 'machine', category: 'strength',
    primary_muscles: ['isquiotibiales'],
    secondary_muscles: ['gemelos'],
    instructions: [
      'Túmbate boca abajo en la máquina de curl con los tobillos bajo el apoyo.',
      'Dobla las piernas hacia los glúteos.',
      'Baja con control.',
    ],
  },
  {
    exercise_id: 'romanian-deadlift',
    name: 'Peso Muerto Rumano',
    body_part: 'upper legs', target: 'hamstrings', equipment: 'barbell', category: 'strength',
    primary_muscles: ['isquiotibiales', 'glúteo mayor'],
    secondary_muscles: ['erectores espinales', 'antebrazos'],
    instructions: [
      'De pie, sostén una barra a la altura de las caderas con agarre en pronación.',
      'Inclínate desde las caderas empujándolas hacia atrás mientras bajas la barra a lo largo de las piernas.',
      'Siente el estiramiento en los isquiotibiales, luego impulsa las caderas hacia delante para ponerte de pie.',
    ],
  },
  {
    exercise_id: 'bulgarian-split-squat',
    name: 'Sentadilla Búlgara',
    body_part: 'upper legs', target: 'quads', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['cuádriceps', 'glúteo mayor'],
    secondary_muscles: ['isquiotibiales', 'core'],
    instructions: [
      'De pie frente a un banco, apoya un pie detrás sobre el banco.',
      'Con mancuernas, baja el cuerpo flexionando la rodilla delantera.',
      'Empuja hacia arriba a través del talón delantero. Completa todas las repeticiones y cambia de pierna.',
    ],
  },
  {
    exercise_id: 'walking-lunge',
    name: 'Zancadas Caminando',
    body_part: 'upper legs', target: 'quads', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['cuádriceps', 'glúteo mayor'],
    secondary_muscles: ['isquiotibiales', 'core'],
    instructions: [
      'De pie con mancuernas a los lados.',
      'Da un paso al frente con una pierna y baja el cuerpo hasta que ambas rodillas estén a 90 grados.',
      'Impulsa con el pie delantero y avanza con la otra pierna. Continúa alternando.',
    ],
  },
  {
    exercise_id: 'goblet-squat',
    name: 'Sentadilla Goblet',
    body_part: 'upper legs', target: 'quads', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['cuádriceps', 'glúteo mayor'],
    secondary_muscles: ['core', 'espalda superior'],
    instructions: [
      'Sostén una mancuerna o kettlebell a la altura del pecho con ambas manos.',
      'Baja manteniendo el pecho erguido y los codos entre las rodillas.',
      'Empuja con los talones para volverte a poner de pie.',
    ],
  },
  {
    exercise_id: 'hip-thrust',
    name: 'Empuje de Cadera',
    body_part: 'upper legs', target: 'glutes', equipment: 'barbell', category: 'strength',
    primary_muscles: ['glúteo mayor'],
    secondary_muscles: ['isquiotibiales', 'cuádriceps'],
    instructions: [
      'Siéntate en el suelo con la parte superior de la espalda contra un banco. Coloca una barra sobre las caderas.',
      'Empuja con los talones e impulsa las caderas hacia arriba hasta que los muslos queden paralelos al suelo.',
      'Aprieta los glúteos en la parte superior y baja de vuelta.',
    ],
  },
  {
    exercise_id: 'sumo-deadlift',
    name: 'Peso Muerto Sumo',
    body_part: 'upper legs', target: 'glutes', equipment: 'barbell', category: 'strength',
    primary_muscles: ['glúteo mayor', 'cuádriceps'],
    secondary_muscles: ['isquiotibiales', 'aductores', 'erectores espinales'],
    instructions: [
      'De pie con una postura amplia y los pies apuntando hacia fuera. Agarra la barra con las manos dentro de las rodillas.',
      'Empuja con los talones, extendiendo caderas y rodillas para ponerte de pie.',
      'Baja la barra al suelo con control.',
    ],
  },
  {
    exercise_id: 'smith-machine-squat',
    name: 'Sentadilla en Máquina Smith',
    body_part: 'upper legs', target: 'quads', equipment: 'machine', category: 'strength',
    primary_muscles: ['cuádriceps', 'glúteo mayor'],
    secondary_muscles: ['isquiotibiales', 'core'],
    instructions: [
      'Colócate bajo la barra de la máquina Smith sobre la parte superior de la espalda.',
      'Desbloquea la barra y baja hasta que los muslos queden paralelos al suelo.',
      'Empuja de vuelta a la posición inicial.',
    ],
  },
  {
    exercise_id: 'leg-press-narrow',
    name: 'Prensa de Piernas Pies Juntos',
    body_part: 'upper legs', target: 'quads', equipment: 'machine', category: 'strength',
    primary_muscles: ['cuádriceps'],
    secondary_muscles: ['glúteo mayor'],
    instructions: [
      'Siéntate en la prensa de piernas y coloca los pies juntos y bajos en la plataforma.',
      'Baja la plataforma flexionando las rodillas hasta 90 grados.',
      'Empuja de vuelta concentrándote en los cuádriceps.',
    ],
  },
  {
    exercise_id: 'dumbbell-lateral-lunge',
    name: 'Zancada Lateral con Mancuernas',
    body_part: 'upper legs', target: 'glutes', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['glúteo mayor', 'aductores'],
    secondary_muscles: ['cuádriceps', 'isquiotibiales'],
    instructions: [
      'De pie con mancuernas a los lados.',
      'Da un paso amplio hacia un lado, flexiona esa rodilla y empuja las caderas hacia atrás.',
      'Vuelve a la posición inicial y repite en el otro lado.',
    ],
  },
  // ==================== GEMELOS ====================
  {
    exercise_id: 'standing-calf-raise',
    name: 'Elevación de Talones de Pie',
    body_part: 'lower legs', target: 'calves', equipment: 'machine', category: 'strength',
    primary_muscles: ['gastrocnemio'],
    secondary_muscles: ['sóleo'],
    instructions: [
      'Colócate en la máquina de elevaciones de talones con la parte delantera de los pies en la plataforma.',
      'Baja los talones por debajo de la plataforma para un estiramiento completo.',
      'Sube de puntillas lo más alto posible, apretando los gemelos en la parte superior.',
    ],
  },
  {
    exercise_id: 'seated-calf-raise',
    name: 'Elevación de Talones Sentado',
    body_part: 'lower legs', target: 'calves', equipment: 'machine', category: 'strength',
    primary_muscles: ['sóleo'],
    secondary_muscles: ['gastrocnemio'],
    instructions: [
      'Siéntate en la máquina de elevaciones de talones sentado con las rodillas bajo el apoyo.',
      'Baja los talones lo más posible para el estiramiento.',
      'Sube de puntillas apretando en la parte superior.',
    ],
  },
  {
    exercise_id: 'leg-press-calf-raise',
    name: 'Elevación de Talones en Prensa',
    body_part: 'lower legs', target: 'calves', equipment: 'machine', category: 'strength',
    primary_muscles: ['gastrocnemio', 'sóleo'],
    secondary_muscles: [],
    instructions: [
      'Siéntate en la prensa de piernas y coloca solo la parte delantera del pie en el borde inferior de la plataforma.',
      'Empuja la plataforma extendiendo los tobillos (puntillas hacia abajo).',
      'Flexiona lentamente los tobillos de vuelta a la posición inicial.',
    ],
  },
  {
    exercise_id: 'dumbbell-calf-raise',
    name: 'Elevación de Talones con Mancuernas',
    body_part: 'lower legs', target: 'calves', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['gastrocnemio'],
    secondary_muscles: ['sóleo'],
    instructions: [
      'De pie en el borde de un escalón con mancuernas a los lados.',
      'Baja los talones por debajo del escalón para el estiramiento.',
      'Sube de puntillas lo más alto posible.',
    ],
  },
  // ==================== CORE / ABDOMEN ====================
  {
    exercise_id: 'crunch',
    name: 'Crunch Abdominal',
    body_part: 'waist', target: 'abs', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['recto abdominal'],
    secondary_muscles: ['oblicuos'],
    instructions: [
      'Túmbate boca arriba con las rodillas dobladas y los pies planos en el suelo.',
      'Coloca las manos detrás de la cabeza o cruzadas sobre el pecho.',
      'Eleva el torso hacia las rodillas y baja de vuelta con control.',
    ],
  },
  {
    exercise_id: 'plank',
    name: 'Plancha',
    body_part: 'waist', target: 'abs', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['recto abdominal', 'transverso abdominal'],
    secondary_muscles: ['oblicuos', 'erectores espinales', 'hombros'],
    instructions: [
      'Colócate en posición de plancha con los antebrazos en el suelo y los codos bajo los hombros.',
      'Mantén el cuerpo en línea recta desde la cabeza hasta los talones.',
      'Mantén la posición con el core activado.',
    ],
  },
  {
    exercise_id: 'russian-twist',
    name: 'Giro Ruso',
    body_part: 'waist', target: 'abs', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['oblicuos'],
    secondary_muscles: ['recto abdominal', 'flexores de cadera'],
    instructions: [
      'Siéntate en el suelo con las rodillas dobladas e inclínate ligeramente hacia atrás.',
      'Junta las manos o sostén un peso frente al pecho.',
      'Gira el torso hacia la izquierda y luego hacia la derecha. Eso es una repetición.',
    ],
  },
  {
    exercise_id: 'hanging-leg-raise',
    name: 'Elevación de Piernas en Suspensión',
    body_part: 'waist', target: 'abs', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['recto abdominal (inferior)'],
    secondary_muscles: ['flexores de cadera', 'oblicuos'],
    instructions: [
      'Cuélgate de una barra de dominadas con los brazos completamente extendidos.',
      'Eleva las piernas hacia delante hasta que queden paralelas al suelo (o más arriba).',
      'Baja las piernas con control.',
    ],
  },
  {
    exercise_id: 'cable-crunch',
    name: 'Crunch en Polea',
    body_part: 'waist', target: 'abs', equipment: 'cable', category: 'strength',
    primary_muscles: ['recto abdominal'],
    secondary_muscles: ['oblicuos'],
    instructions: [
      'Arrodíllate frente a una polea alta con accesorio de cuerda.',
      'Sostén la cuerda detrás de la cabeza y dobla el torso hacia abajo llevando los codos hacia las rodillas.',
      'Regresa lentamente a la posición inicial.',
    ],
  },
  {
    exercise_id: 'ab-wheel-rollout',
    name: 'Rueda Abdominal',
    body_part: 'waist', target: 'abs', equipment: 'other', category: 'strength',
    primary_muscles: ['recto abdominal', 'transverso abdominal'],
    secondary_muscles: ['oblicuos', 'dorsal ancho', 'hombros'],
    instructions: [
      'Arrodíllate en el suelo y agarra la rueda abdominal con ambas manos.',
      'Rueda hacia delante, extendiendo el cuerpo lo más posible con el core tenso.',
      'Vuélvete a la posición inicial usando los abdominales.',
    ],
  },
  {
    exercise_id: 'bicycle-crunch',
    name: 'Crunch de Bicicleta',
    body_part: 'waist', target: 'abs', equipment: 'bodyweight', category: 'strength',
    primary_muscles: ['oblicuos', 'recto abdominal'],
    secondary_muscles: ['flexores de cadera'],
    instructions: [
      'Túmbate boca arriba con las manos detrás de la cabeza. Levanta los hombros del suelo.',
      'Lleva el codo derecho hacia la rodilla izquierda mientras extiendes la pierna derecha.',
      'Alterna los lados con un movimiento de pedaleo.',
    ],
  },
  {
    exercise_id: 'mountain-climber',
    name: 'Escaladores',
    body_part: 'waist', target: 'abs', equipment: 'bodyweight', category: 'cardio',
    primary_muscles: ['recto abdominal', 'flexores de cadera'],
    secondary_muscles: ['oblicuos', 'hombros', 'cuádriceps'],
    instructions: [
      'Comienza en posición de fondos con los brazos extendidos.',
      'Lleva una rodilla hacia el pecho y cambia rápidamente de pierna.',
      'Continúa alternando a ritmo rápido manteniendo el core activado.',
    ],
  },
  // ==================== ANTEBRAZOS ====================
  {
    exercise_id: 'wrist-curl',
    name: 'Curl de Muñeca',
    body_part: 'lower arms', target: 'forearms', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['flexores del antebrazo'],
    secondary_muscles: [],
    instructions: [
      'Siéntate en un banco con los antebrazos apoyados en los muslos, palmas hacia arriba y mancuernas en las manos.',
      'Baja las mancuernas extendiendo las muñecas.',
      'Sube las mancuernas flexionando las muñecas.',
    ],
  },
  {
    exercise_id: 'reverse-wrist-curl',
    name: 'Curl de Muñeca Invertido',
    body_part: 'lower arms', target: 'forearms', equipment: 'dumbbell', category: 'strength',
    primary_muscles: ['extensores del antebrazo'],
    secondary_muscles: [],
    instructions: [
      'Siéntate en un banco con los antebrazos sobre los muslos, palmas hacia abajo y mancuernas en las manos.',
      'Extiende las muñecas para subir las mancuernas.',
      'Baja con control.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Utilidades de búsqueda y filtrado (sin red)
// ─────────────────────────────────────────────────────────────

/** Lista de body_parts únicos, ordenada */
export const BODY_PARTS: string[] = [...new Set(EXERCISES.map(e => e.body_part))].sort();

/** Busca un ejercicio por ID */
export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find(e => e.exercise_id === id);
}

/** Filtra ejercicios por body_part y/o texto de búsqueda (nombre, músculo o grupo) */
export function filterExercises(
  opts: { bodyPart?: string; search?: string } = {}
): Exercise[] {
  const q = opts.search?.toLowerCase().trim() ?? '';
  return EXERCISES.filter(e => {
    if (opts.bodyPart && e.body_part !== opts.bodyPart) return false;
    if (q) {
      const haystack = [
        e.name,
        ...e.primary_muscles,
        ...e.secondary_muscles,
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Replicación de la lógica "similar" del backend */
export function getSimilarExercises(exerciseId: string, limit = 6): Exercise[] {
  const ex = getExerciseById(exerciseId);
  if (!ex) return [];

  // Prioridad 1: mismo target, diferente equipment
  const p1 = EXERCISES.filter(
    e => e.exercise_id !== exerciseId &&
         e.target === ex.target &&
         e.equipment !== ex.equipment
  );

  if (p1.length >= limit) return p1.slice(0, limit);

  // Prioridad 2: mismo body_part
  const usedIds = new Set([exerciseId, ...p1.map(e => e.exercise_id)]);
  const p2 = EXERCISES.filter(
    e => !usedIds.has(e.exercise_id) && e.body_part === ex.body_part
  );

  return [...p1, ...p2].slice(0, limit);
}
