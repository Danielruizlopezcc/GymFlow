EXERCISES = [
    # ==================== CHEST ====================
    {
        "exercise_id": "barbell-bench-press",
        "name": "Barbell Bench Press",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "barbell",
        "primary_muscles": ["pectoralis major"],
        "secondary_muscles": ["anterior deltoid", "triceps brachii"],
        "instructions": [
            "Lie on a flat bench with your feet flat on the floor. Grip the barbell slightly wider than shoulder width.",
            "Unrack the bar and hold it directly above your chest with arms fully extended.",
            "Lower the bar slowly to your mid-chest, keeping elbows at about 45 degrees.",
            "Press the bar back up to the starting position, fully extending your arms."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "incline-barbell-bench-press",
        "name": "Incline Barbell Bench Press",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "barbell",
        "primary_muscles": ["pectoralis major (upper)"],
        "secondary_muscles": ["anterior deltoid", "triceps brachii"],
        "instructions": [
            "Set the bench to a 30-45 degree incline. Lie back and grip the bar slightly wider than shoulder width.",
            "Unrack the bar and lower it to your upper chest.",
            "Press the bar back up to full extension, focusing on squeezing the upper chest."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "decline-barbell-bench-press",
        "name": "Decline Barbell Bench Press",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "barbell",
        "primary_muscles": ["pectoralis major (lower)"],
        "secondary_muscles": ["anterior deltoid", "triceps brachii"],
        "instructions": [
            "Set the bench to a decline position. Secure your legs and lie back, gripping the bar wider than shoulder width.",
            "Unrack the bar and lower it to your lower chest.",
            "Press the bar back up to full arm extension."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "dumbbell-bench-press",
        "name": "Dumbbell Bench Press",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "dumbbell",
        "primary_muscles": ["pectoralis major"],
        "secondary_muscles": ["anterior deltoid", "triceps brachii"],
        "instructions": [
            "Lie on a flat bench holding a dumbbell in each hand at chest level.",
            "Press the dumbbells up until your arms are fully extended.",
            "Lower the dumbbells back to chest level with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "incline-dumbbell-press",
        "name": "Incline Dumbbell Press",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "dumbbell",
        "primary_muscles": ["pectoralis major (upper)"],
        "secondary_muscles": ["anterior deltoid", "triceps brachii"],
        "instructions": [
            "Set an adjustable bench to 30-45 degrees. Hold a dumbbell in each hand at shoulder level.",
            "Press the dumbbells upward until arms are fully extended.",
            "Lower back down slowly to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "dumbbell-fly",
        "name": "Dumbbell Fly",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "dumbbell",
        "primary_muscles": ["pectoralis major"],
        "secondary_muscles": ["anterior deltoid", "biceps brachii"],
        "instructions": [
            "Lie on a flat bench holding dumbbells above your chest with palms facing each other.",
            "With a slight bend in your elbows, lower the dumbbells out to the sides in a wide arc.",
            "Squeeze your chest to bring the dumbbells back together above your chest."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "incline-dumbbell-fly",
        "name": "Incline Dumbbell Fly",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "dumbbell",
        "primary_muscles": ["pectoralis major (upper)"],
        "secondary_muscles": ["anterior deltoid", "biceps brachii"],
        "instructions": [
            "Set bench to 30-45 degree incline. Hold dumbbells above chest with palms facing in.",
            "Lower dumbbells to the sides with slightly bent elbows.",
            "Bring dumbbells back together, squeezing the upper chest."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "cable-crossover",
        "name": "Cable Crossover",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "cable",
        "primary_muscles": ["pectoralis major"],
        "secondary_muscles": ["anterior deltoid", "biceps brachii"],
        "instructions": [
            "Set both pulleys to the highest position. Stand in the center and grab a handle in each hand.",
            "Step forward slightly and lean your torso forward. Keep a slight bend in the elbows.",
            "Pull the handles down and together in front of your chest in a hugging motion.",
            "Slowly return to the starting position with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "chest-dip",
        "name": "Chest Dip",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "bodyweight",
        "primary_muscles": ["pectoralis major"],
        "secondary_muscles": ["anterior deltoid", "triceps brachii"],
        "instructions": [
            "Grip the parallel bars and lift yourself up with arms fully extended.",
            "Lean your torso forward about 30 degrees. Lower your body by bending your elbows.",
            "Go down until you feel a stretch in your chest, then push back up to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "push-up",
        "name": "Push-Up",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "bodyweight",
        "primary_muscles": ["pectoralis major"],
        "secondary_muscles": ["anterior deltoid", "triceps brachii", "core"],
        "instructions": [
            "Start in a plank position with hands slightly wider than shoulder width.",
            "Lower your body until your chest nearly touches the floor, keeping your core tight.",
            "Push back up to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "machine-chest-press",
        "name": "Machine Chest Press",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "machine",
        "primary_muscles": ["pectoralis major"],
        "secondary_muscles": ["anterior deltoid", "triceps brachii"],
        "instructions": [
            "Sit on the machine and adjust the seat so handles are at chest level.",
            "Grip the handles and press forward until your arms are fully extended.",
            "Slowly return to the starting position with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "pec-deck-fly",
        "name": "Pec Deck Fly",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "machine",
        "primary_muscles": ["pectoralis major"],
        "secondary_muscles": ["anterior deltoid"],
        "instructions": [
            "Sit on the pec deck machine and adjust the arms so your elbows are at chest height.",
            "Place your forearms against the pads and bring them together in front of your chest.",
            "Slowly return to the starting position, feeling the stretch in your chest."
        ],
        "category": "strength"
    },
    # ==================== BACK ====================
    {
        "exercise_id": "barbell-bent-over-row",
        "name": "Barbell Bent Over Row",
        "body_part": "back",
        "target": "lats",
        "equipment": "barbell",
        "primary_muscles": ["latissimus dorsi"],
        "secondary_muscles": ["rhomboids", "biceps brachii", "rear deltoid"],
        "instructions": [
            "Stand with feet shoulder-width apart, bend at the hips until your torso is nearly parallel to the floor.",
            "Grip the barbell with hands slightly wider than shoulder width.",
            "Pull the bar to your lower chest, squeezing your shoulder blades together.",
            "Lower the bar back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "lat-pulldown",
        "name": "Lat Pulldown",
        "body_part": "back",
        "target": "lats",
        "equipment": "cable",
        "primary_muscles": ["latissimus dorsi"],
        "secondary_muscles": ["biceps brachii", "rhomboids", "teres major"],
        "instructions": [
            "Sit at the lat pulldown machine and grab the bar with a wide overhand grip.",
            "Pull the bar down to your upper chest while leaning slightly back.",
            "Squeeze your lats at the bottom, then slowly return the bar to the top."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "seated-cable-row",
        "name": "Seated Cable Row",
        "body_part": "back",
        "target": "upper back",
        "equipment": "cable",
        "primary_muscles": ["rhomboids", "latissimus dorsi"],
        "secondary_muscles": ["biceps brachii", "rear deltoid", "trapezius"],
        "instructions": [
            "Sit at the cable row station with feet on the platform. Grab the handle with both hands.",
            "Pull the handle toward your abdomen, keeping your back straight and squeezing your shoulder blades.",
            "Slowly return to the starting position, allowing a slight stretch in your lats."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "pull-up",
        "name": "Pull-Up",
        "body_part": "back",
        "target": "lats",
        "equipment": "bodyweight",
        "primary_muscles": ["latissimus dorsi"],
        "secondary_muscles": ["biceps brachii", "teres major", "rhomboids"],
        "instructions": [
            "Hang from a pull-up bar with an overhand grip, hands slightly wider than shoulder width.",
            "Pull yourself up until your chin is above the bar.",
            "Lower yourself back down with control to full arm extension."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "chin-up",
        "name": "Chin-Up",
        "body_part": "back",
        "target": "lats",
        "equipment": "bodyweight",
        "primary_muscles": ["latissimus dorsi", "biceps brachii"],
        "secondary_muscles": ["teres major", "rhomboids"],
        "instructions": [
            "Hang from a pull-up bar with an underhand (supinated) grip, hands shoulder-width apart.",
            "Pull yourself up until your chin passes the bar.",
            "Lower yourself with control to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "t-bar-row",
        "name": "T-Bar Row",
        "body_part": "back",
        "target": "upper back",
        "equipment": "barbell",
        "primary_muscles": ["latissimus dorsi", "rhomboids"],
        "secondary_muscles": ["biceps brachii", "rear deltoid", "trapezius"],
        "instructions": [
            "Straddle the T-bar row or landmine setup. Bend at the hips and grip the handles.",
            "Pull the weight toward your chest, driving your elbows back.",
            "Lower the weight with control, maintaining a flat back throughout."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "single-arm-dumbbell-row",
        "name": "Single Arm Dumbbell Row",
        "body_part": "back",
        "target": "lats",
        "equipment": "dumbbell",
        "primary_muscles": ["latissimus dorsi"],
        "secondary_muscles": ["rhomboids", "biceps brachii", "rear deltoid"],
        "instructions": [
            "Place one knee and hand on a bench for support. Hold a dumbbell in the opposite hand.",
            "Pull the dumbbell up to your hip, squeezing your lat at the top.",
            "Lower the dumbbell with control and repeat. Switch sides."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "deadlift",
        "name": "Deadlift",
        "body_part": "back",
        "target": "spine",
        "equipment": "barbell",
        "primary_muscles": ["erector spinae", "gluteus maximus"],
        "secondary_muscles": ["hamstrings", "trapezius", "forearms"],
        "instructions": [
            "Stand with feet hip-width apart, barbell over mid-foot. Bend at hips and knees to grip the bar.",
            "Drive through your heels, extending hips and knees simultaneously to stand up.",
            "Keep the bar close to your body throughout the movement.",
            "Lower the bar back to the ground by hinging at the hips."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "machine-row",
        "name": "Machine Row",
        "body_part": "back",
        "target": "upper back",
        "equipment": "machine",
        "primary_muscles": ["rhomboids", "latissimus dorsi"],
        "secondary_muscles": ["biceps brachii", "rear deltoid"],
        "instructions": [
            "Sit at the row machine and adjust the chest pad. Grip the handles.",
            "Pull the handles toward your torso, squeezing your shoulder blades together.",
            "Slowly return to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "face-pull",
        "name": "Face Pull",
        "body_part": "back",
        "target": "upper back",
        "equipment": "cable",
        "primary_muscles": ["rear deltoid", "rhomboids"],
        "secondary_muscles": ["trapezius", "infraspinatus"],
        "instructions": [
            "Set a cable pulley to upper chest height with a rope attachment.",
            "Pull the rope toward your face, separating the ends and squeezing your rear delts.",
            "Return slowly to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "straight-arm-pulldown",
        "name": "Straight Arm Pulldown",
        "body_part": "back",
        "target": "lats",
        "equipment": "cable",
        "primary_muscles": ["latissimus dorsi"],
        "secondary_muscles": ["teres major", "rear deltoid"],
        "instructions": [
            "Stand facing a high cable pulley with a straight bar attachment.",
            "With arms nearly straight, pull the bar down in an arc to your thighs.",
            "Squeeze your lats at the bottom, then slowly return the bar overhead."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "hyperextension",
        "name": "Hyperextension",
        "body_part": "back",
        "target": "spine",
        "equipment": "bodyweight",
        "primary_muscles": ["erector spinae"],
        "secondary_muscles": ["gluteus maximus", "hamstrings"],
        "instructions": [
            "Position yourself on a hyperextension bench with your hips on the pad.",
            "Cross your arms over your chest and lower your upper body toward the floor.",
            "Raise your torso back up until your body forms a straight line."
        ],
        "category": "strength"
    },
    # ==================== SHOULDERS ====================
    {
        "exercise_id": "overhead-press",
        "name": "Overhead Press",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "barbell",
        "primary_muscles": ["anterior deltoid", "medial deltoid"],
        "secondary_muscles": ["triceps brachii", "trapezius", "core"],
        "instructions": [
            "Stand with feet shoulder-width apart, holding the barbell at shoulder height with an overhand grip.",
            "Press the bar straight overhead until your arms are fully extended.",
            "Lower the bar back to shoulder height with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "dumbbell-shoulder-press",
        "name": "Dumbbell Shoulder Press",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "dumbbell",
        "primary_muscles": ["anterior deltoid", "medial deltoid"],
        "secondary_muscles": ["triceps brachii", "trapezius"],
        "instructions": [
            "Sit or stand holding dumbbells at shoulder height with palms facing forward.",
            "Press both dumbbells overhead until arms are fully extended.",
            "Lower back to shoulder level with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "lateral-raise",
        "name": "Lateral Raise",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "dumbbell",
        "primary_muscles": ["medial deltoid"],
        "secondary_muscles": ["anterior deltoid", "trapezius"],
        "instructions": [
            "Stand with dumbbells at your sides, palms facing your body.",
            "Raise both arms out to the sides until they are parallel to the floor.",
            "Lower back down slowly with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "front-raise",
        "name": "Front Raise",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "dumbbell",
        "primary_muscles": ["anterior deltoid"],
        "secondary_muscles": ["medial deltoid", "pectoralis major (upper)"],
        "instructions": [
            "Stand holding dumbbells in front of your thighs with palms facing your body.",
            "Raise one or both dumbbells in front of you to shoulder height.",
            "Lower back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "rear-delt-fly",
        "name": "Rear Delt Fly",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "dumbbell",
        "primary_muscles": ["posterior deltoid"],
        "secondary_muscles": ["rhomboids", "trapezius"],
        "instructions": [
            "Bend at the hips with a slight knee bend, holding dumbbells below your chest.",
            "Raise both dumbbells out to the sides, squeezing your rear delts at the top.",
            "Lower back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "arnold-press",
        "name": "Arnold Press",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "dumbbell",
        "primary_muscles": ["anterior deltoid", "medial deltoid"],
        "secondary_muscles": ["triceps brachii", "trapezius"],
        "instructions": [
            "Sit holding dumbbells at chest height with palms facing you (like the top of a curl).",
            "As you press the dumbbells overhead, rotate your palms to face forward.",
            "Reverse the motion as you lower back to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "upright-row",
        "name": "Upright Row",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "barbell",
        "primary_muscles": ["medial deltoid", "trapezius"],
        "secondary_muscles": ["anterior deltoid", "biceps brachii"],
        "instructions": [
            "Stand holding a barbell with a narrow overhand grip in front of your thighs.",
            "Pull the bar straight up along your body to chin height, leading with your elbows.",
            "Lower the bar back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "cable-lateral-raise",
        "name": "Cable Lateral Raise",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "cable",
        "primary_muscles": ["medial deltoid"],
        "secondary_muscles": ["anterior deltoid", "trapezius"],
        "instructions": [
            "Stand sideways to a low cable pulley and grab the handle with your far hand.",
            "Raise your arm out to the side until it is parallel to the floor.",
            "Slowly lower back to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "machine-shoulder-press",
        "name": "Machine Shoulder Press",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "machine",
        "primary_muscles": ["anterior deltoid", "medial deltoid"],
        "secondary_muscles": ["triceps brachii", "trapezius"],
        "instructions": [
            "Sit at the shoulder press machine and adjust the seat so handles are at shoulder level.",
            "Press the handles overhead until your arms are fully extended.",
            "Lower back to the starting position with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "barbell-shrug",
        "name": "Barbell Shrug",
        "body_part": "shoulders",
        "target": "traps",
        "equipment": "barbell",
        "primary_muscles": ["trapezius"],
        "secondary_muscles": ["levator scapulae"],
        "instructions": [
            "Stand holding a barbell with an overhand grip at arm's length.",
            "Shrug your shoulders straight up toward your ears as high as possible.",
            "Hold briefly at the top, then lower back down."
        ],
        "category": "strength"
    },
    # ==================== UPPER ARMS ====================
    {
        "exercise_id": "barbell-curl",
        "name": "Barbell Curl",
        "body_part": "upper arms",
        "target": "biceps",
        "equipment": "barbell",
        "primary_muscles": ["biceps brachii"],
        "secondary_muscles": ["brachialis", "forearms"],
        "instructions": [
            "Stand holding a barbell with an underhand grip, arms fully extended.",
            "Curl the bar up toward your shoulders, keeping your elbows close to your sides.",
            "Lower the bar back down with control to full arm extension."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "dumbbell-curl",
        "name": "Dumbbell Curl",
        "body_part": "upper arms",
        "target": "biceps",
        "equipment": "dumbbell",
        "primary_muscles": ["biceps brachii"],
        "secondary_muscles": ["brachialis", "forearms"],
        "instructions": [
            "Stand holding a dumbbell in each hand with arms at your sides, palms facing forward.",
            "Curl both dumbbells up toward your shoulders.",
            "Lower back down slowly with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "hammer-curl",
        "name": "Hammer Curl",
        "body_part": "upper arms",
        "target": "biceps",
        "equipment": "dumbbell",
        "primary_muscles": ["brachialis", "brachioradialis"],
        "secondary_muscles": ["biceps brachii"],
        "instructions": [
            "Stand holding dumbbells with palms facing each other (neutral grip).",
            "Curl the dumbbells up toward your shoulders without rotating your wrists.",
            "Lower back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "preacher-curl",
        "name": "Preacher Curl",
        "body_part": "upper arms",
        "target": "biceps",
        "equipment": "barbell",
        "primary_muscles": ["biceps brachii"],
        "secondary_muscles": ["brachialis"],
        "instructions": [
            "Sit at a preacher bench and rest your upper arms on the pad.",
            "Curl the barbell up toward your shoulders.",
            "Lower back down slowly, maintaining tension on the biceps."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "cable-curl",
        "name": "Cable Curl",
        "body_part": "upper arms",
        "target": "biceps",
        "equipment": "cable",
        "primary_muscles": ["biceps brachii"],
        "secondary_muscles": ["brachialis", "forearms"],
        "instructions": [
            "Stand facing a low cable pulley with a straight bar or EZ bar attachment.",
            "Curl the bar up toward your shoulders, keeping elbows pinned to your sides.",
            "Lower back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "tricep-pushdown",
        "name": "Tricep Pushdown",
        "body_part": "upper arms",
        "target": "triceps",
        "equipment": "cable",
        "primary_muscles": ["triceps brachii"],
        "secondary_muscles": ["anconeus"],
        "instructions": [
            "Stand at a high cable pulley with a straight bar or rope attachment.",
            "Push the bar down by extending your elbows, keeping upper arms stationary.",
            "Slowly return to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "skull-crusher",
        "name": "Skull Crusher",
        "body_part": "upper arms",
        "target": "triceps",
        "equipment": "barbell",
        "primary_muscles": ["triceps brachii"],
        "secondary_muscles": ["anconeus"],
        "instructions": [
            "Lie on a flat bench holding an EZ bar or barbell with arms extended above your chest.",
            "Lower the bar toward your forehead by bending only at the elbows.",
            "Extend your arms back to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "overhead-tricep-extension",
        "name": "Overhead Tricep Extension",
        "body_part": "upper arms",
        "target": "triceps",
        "equipment": "dumbbell",
        "primary_muscles": ["triceps brachii (long head)"],
        "secondary_muscles": ["anconeus"],
        "instructions": [
            "Stand or sit holding a dumbbell with both hands overhead, arms fully extended.",
            "Lower the dumbbell behind your head by bending at the elbows.",
            "Extend your arms back overhead to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "tricep-dip",
        "name": "Tricep Dip",
        "body_part": "upper arms",
        "target": "triceps",
        "equipment": "bodyweight",
        "primary_muscles": ["triceps brachii"],
        "secondary_muscles": ["anterior deltoid", "pectoralis major"],
        "instructions": [
            "Grip parallel bars and lift yourself up with arms extended. Keep torso upright.",
            "Lower your body by bending your elbows until they reach 90 degrees.",
            "Push back up to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "concentration-curl",
        "name": "Concentration Curl",
        "body_part": "upper arms",
        "target": "biceps",
        "equipment": "dumbbell",
        "primary_muscles": ["biceps brachii"],
        "secondary_muscles": ["brachialis"],
        "instructions": [
            "Sit on a bench with legs spread. Rest your elbow on your inner thigh, holding a dumbbell.",
            "Curl the dumbbell up toward your shoulder, squeezing at the top.",
            "Lower back down with control."
        ],
        "category": "strength"
    },
    # ==================== UPPER LEGS ====================
    {
        "exercise_id": "barbell-squat",
        "name": "Barbell Squat",
        "body_part": "upper legs",
        "target": "quads",
        "equipment": "barbell",
        "primary_muscles": ["quadriceps", "gluteus maximus"],
        "secondary_muscles": ["hamstrings", "erector spinae", "core"],
        "instructions": [
            "Position the barbell on your upper back (traps). Stand with feet shoulder-width apart.",
            "Bend your knees and hips to lower your body as if sitting in a chair.",
            "Go down until your thighs are at least parallel to the floor.",
            "Drive through your heels to stand back up."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "front-squat",
        "name": "Front Squat",
        "body_part": "upper legs",
        "target": "quads",
        "equipment": "barbell",
        "primary_muscles": ["quadriceps"],
        "secondary_muscles": ["gluteus maximus", "core", "upper back"],
        "instructions": [
            "Hold the barbell across the front of your shoulders with elbows high.",
            "Squat down keeping your torso as upright as possible.",
            "Drive up through your heels to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "leg-press",
        "name": "Leg Press",
        "body_part": "upper legs",
        "target": "quads",
        "equipment": "machine",
        "primary_muscles": ["quadriceps", "gluteus maximus"],
        "secondary_muscles": ["hamstrings", "calves"],
        "instructions": [
            "Sit on the leg press machine and place your feet shoulder-width apart on the platform.",
            "Release the safety and lower the platform by bending your knees to 90 degrees.",
            "Press the platform back up without locking your knees."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "hack-squat",
        "name": "Hack Squat",
        "body_part": "upper legs",
        "target": "quads",
        "equipment": "machine",
        "primary_muscles": ["quadriceps"],
        "secondary_muscles": ["gluteus maximus", "hamstrings"],
        "instructions": [
            "Position yourself on the hack squat machine with shoulders under the pads.",
            "Lower your body by bending your knees until thighs are parallel to the platform.",
            "Push back up to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "leg-extension",
        "name": "Leg Extension",
        "body_part": "upper legs",
        "target": "quads",
        "equipment": "machine",
        "primary_muscles": ["quadriceps"],
        "secondary_muscles": [],
        "instructions": [
            "Sit on the leg extension machine with your legs under the pad.",
            "Extend your legs until they are straight, squeezing your quads at the top.",
            "Lower back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "leg-curl",
        "name": "Leg Curl",
        "body_part": "upper legs",
        "target": "hamstrings",
        "equipment": "machine",
        "primary_muscles": ["hamstrings"],
        "secondary_muscles": ["calves"],
        "instructions": [
            "Lie face down on the leg curl machine with ankles under the pad.",
            "Curl your legs up toward your glutes.",
            "Lower back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "romanian-deadlift",
        "name": "Romanian Deadlift",
        "body_part": "upper legs",
        "target": "hamstrings",
        "equipment": "barbell",
        "primary_muscles": ["hamstrings", "gluteus maximus"],
        "secondary_muscles": ["erector spinae", "forearms"],
        "instructions": [
            "Stand holding a barbell at hip height with an overhand grip.",
            "Hinge at the hips, pushing them back while lowering the bar along your legs.",
            "Feel the stretch in your hamstrings, then drive your hips forward to stand up."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "bulgarian-split-squat",
        "name": "Bulgarian Split Squat",
        "body_part": "upper legs",
        "target": "quads",
        "equipment": "dumbbell",
        "primary_muscles": ["quadriceps", "gluteus maximus"],
        "secondary_muscles": ["hamstrings", "core"],
        "instructions": [
            "Stand in front of a bench and place one foot behind you on the bench.",
            "Holding dumbbells, lower your body by bending your front knee.",
            "Push back up through your front heel. Complete all reps, then switch legs."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "walking-lunge",
        "name": "Walking Lunge",
        "body_part": "upper legs",
        "target": "quads",
        "equipment": "dumbbell",
        "primary_muscles": ["quadriceps", "gluteus maximus"],
        "secondary_muscles": ["hamstrings", "core"],
        "instructions": [
            "Stand holding dumbbells at your sides.",
            "Step forward with one leg and lower your body until both knees are at 90 degrees.",
            "Push off your front foot and step forward with the other leg. Continue alternating."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "goblet-squat",
        "name": "Goblet Squat",
        "body_part": "upper legs",
        "target": "quads",
        "equipment": "dumbbell",
        "primary_muscles": ["quadriceps", "gluteus maximus"],
        "secondary_muscles": ["core", "upper back"],
        "instructions": [
            "Hold a dumbbell or kettlebell at chest level with both hands.",
            "Squat down keeping your chest up and elbows between your knees.",
            "Push through your heels to stand back up."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "hip-thrust",
        "name": "Hip Thrust",
        "body_part": "upper legs",
        "target": "glutes",
        "equipment": "barbell",
        "primary_muscles": ["gluteus maximus"],
        "secondary_muscles": ["hamstrings", "quadriceps"],
        "instructions": [
            "Sit on the ground with your upper back against a bench. Roll a barbell over your hips.",
            "Drive through your heels and thrust your hips upward until your thighs are parallel to the ground.",
            "Squeeze your glutes at the top, then lower back down."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "sumo-deadlift",
        "name": "Sumo Deadlift",
        "body_part": "upper legs",
        "target": "glutes",
        "equipment": "barbell",
        "primary_muscles": ["gluteus maximus", "quadriceps"],
        "secondary_muscles": ["hamstrings", "adductors", "erector spinae"],
        "instructions": [
            "Stand with a wide stance, toes pointed out. Grip the barbell with hands inside your knees.",
            "Drive through your heels, extending hips and knees to stand up.",
            "Lower the bar back to the ground with control."
        ],
        "category": "strength"
    },
    # ==================== LOWER LEGS ====================
    {
        "exercise_id": "standing-calf-raise",
        "name": "Standing Calf Raise",
        "body_part": "lower legs",
        "target": "calves",
        "equipment": "machine",
        "primary_muscles": ["gastrocnemius"],
        "secondary_muscles": ["soleus"],
        "instructions": [
            "Stand on the calf raise machine with the balls of your feet on the platform.",
            "Lower your heels below the platform for a full stretch.",
            "Rise up on your toes as high as possible, squeezing your calves at the top."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "seated-calf-raise",
        "name": "Seated Calf Raise",
        "body_part": "lower legs",
        "target": "calves",
        "equipment": "machine",
        "primary_muscles": ["soleus"],
        "secondary_muscles": ["gastrocnemius"],
        "instructions": [
            "Sit at the seated calf raise machine with your knees under the pad.",
            "Lower your heels as far as possible for a stretch.",
            "Raise up on your toes, squeezing at the top."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "leg-press-calf-raise",
        "name": "Leg Press Calf Raise",
        "body_part": "lower legs",
        "target": "calves",
        "equipment": "machine",
        "primary_muscles": ["gastrocnemius", "soleus"],
        "secondary_muscles": [],
        "instructions": [
            "Sit on the leg press machine and place just the balls of your feet on the lower edge of the platform.",
            "Press the platform away by extending your ankles (pointing toes).",
            "Slowly flex your ankles back to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "dumbbell-calf-raise",
        "name": "Dumbbell Calf Raise",
        "body_part": "lower legs",
        "target": "calves",
        "equipment": "dumbbell",
        "primary_muscles": ["gastrocnemius"],
        "secondary_muscles": ["soleus"],
        "instructions": [
            "Stand on the edge of a step holding dumbbells at your sides.",
            "Lower your heels below the step for a stretch.",
            "Rise up on your toes as high as possible."
        ],
        "category": "strength"
    },
    # ==================== CORE ====================
    {
        "exercise_id": "crunch",
        "name": "Crunch",
        "body_part": "waist",
        "target": "abs",
        "equipment": "bodyweight",
        "primary_muscles": ["rectus abdominis"],
        "secondary_muscles": ["obliques"],
        "instructions": [
            "Lie on your back with knees bent and feet flat on the floor.",
            "Place your hands behind your head or across your chest.",
            "Curl your upper body toward your knees, then lower back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "plank",
        "name": "Plank",
        "body_part": "waist",
        "target": "abs",
        "equipment": "bodyweight",
        "primary_muscles": ["rectus abdominis", "transverse abdominis"],
        "secondary_muscles": ["obliques", "erector spinae", "shoulders"],
        "instructions": [
            "Start in a forearm position with elbows under your shoulders.",
            "Keep your body in a straight line from head to heels.",
            "Hold the position, engaging your core throughout."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "russian-twist",
        "name": "Russian Twist",
        "body_part": "waist",
        "target": "abs",
        "equipment": "bodyweight",
        "primary_muscles": ["obliques"],
        "secondary_muscles": ["rectus abdominis", "hip flexors"],
        "instructions": [
            "Sit on the floor with knees bent and lean back slightly.",
            "Hold your hands together or hold a weight in front of your chest.",
            "Rotate your torso to the left, then to the right. That is one rep."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "hanging-leg-raise",
        "name": "Hanging Leg Raise",
        "body_part": "waist",
        "target": "abs",
        "equipment": "bodyweight",
        "primary_muscles": ["rectus abdominis (lower)"],
        "secondary_muscles": ["hip flexors", "obliques"],
        "instructions": [
            "Hang from a pull-up bar with arms fully extended.",
            "Raise your legs in front of you until they are parallel to the floor (or higher).",
            "Lower your legs back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "cable-crunch",
        "name": "Cable Crunch",
        "body_part": "waist",
        "target": "abs",
        "equipment": "cable",
        "primary_muscles": ["rectus abdominis"],
        "secondary_muscles": ["obliques"],
        "instructions": [
            "Kneel in front of a high cable pulley with a rope attachment.",
            "Hold the rope behind your head and crunch downward, bringing your elbows toward your knees.",
            "Slowly return to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "ab-wheel-rollout",
        "name": "Ab Wheel Rollout",
        "body_part": "waist",
        "target": "abs",
        "equipment": "other",
        "primary_muscles": ["rectus abdominis", "transverse abdominis"],
        "secondary_muscles": ["obliques", "latissimus dorsi", "shoulders"],
        "instructions": [
            "Kneel on the floor and grip the ab wheel with both hands.",
            "Roll the wheel forward, extending your body as far as possible while keeping your core tight.",
            "Pull yourself back to the starting position using your abs."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "bicycle-crunch",
        "name": "Bicycle Crunch",
        "body_part": "waist",
        "target": "abs",
        "equipment": "bodyweight",
        "primary_muscles": ["obliques", "rectus abdominis"],
        "secondary_muscles": ["hip flexors"],
        "instructions": [
            "Lie on your back with hands behind your head. Lift your shoulders off the ground.",
            "Bring your right elbow to your left knee while extending your right leg.",
            "Alternate sides in a pedaling motion."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "mountain-climber",
        "name": "Mountain Climber",
        "body_part": "waist",
        "target": "abs",
        "equipment": "bodyweight",
        "primary_muscles": ["rectus abdominis", "hip flexors"],
        "secondary_muscles": ["obliques", "shoulders", "quadriceps"],
        "instructions": [
            "Start in a push-up position with arms extended.",
            "Drive one knee toward your chest, then quickly switch legs.",
            "Continue alternating at a fast pace while keeping your core engaged."
        ],
        "category": "cardio"
    },
    # ==================== ADDITIONAL EXERCISES ====================
    {
        "exercise_id": "dumbbell-pullover",
        "name": "Dumbbell Pullover",
        "body_part": "chest",
        "target": "pectorals",
        "equipment": "dumbbell",
        "primary_muscles": ["pectoralis major", "latissimus dorsi"],
        "secondary_muscles": ["triceps brachii", "teres major"],
        "instructions": [
            "Lie on a bench holding one dumbbell with both hands above your chest.",
            "Lower the dumbbell behind your head in an arc, feeling the stretch in your chest and lats.",
            "Pull the dumbbell back to the starting position above your chest."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "close-grip-bench-press",
        "name": "Close Grip Bench Press",
        "body_part": "upper arms",
        "target": "triceps",
        "equipment": "barbell",
        "primary_muscles": ["triceps brachii"],
        "secondary_muscles": ["pectoralis major", "anterior deltoid"],
        "instructions": [
            "Lie on a flat bench and grip the barbell with hands shoulder-width apart or narrower.",
            "Lower the bar to your lower chest, keeping elbows close to your body.",
            "Press the bar back up, focusing on the triceps."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "ez-bar-curl",
        "name": "EZ Bar Curl",
        "body_part": "upper arms",
        "target": "biceps",
        "equipment": "barbell",
        "primary_muscles": ["biceps brachii"],
        "secondary_muscles": ["brachialis", "forearms"],
        "instructions": [
            "Stand holding an EZ bar with an underhand grip on the angled portions.",
            "Curl the bar up toward your shoulders, keeping elbows stationary.",
            "Lower back down with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "reverse-fly-machine",
        "name": "Reverse Fly Machine",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "machine",
        "primary_muscles": ["posterior deltoid"],
        "secondary_muscles": ["rhomboids", "trapezius"],
        "instructions": [
            "Sit facing the pec deck machine (reversed). Grip the handles with arms extended.",
            "Pull the handles back, squeezing your rear delts and upper back.",
            "Return to the starting position with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "smith-machine-squat",
        "name": "Smith Machine Squat",
        "body_part": "upper legs",
        "target": "quads",
        "equipment": "machine",
        "primary_muscles": ["quadriceps", "gluteus maximus"],
        "secondary_muscles": ["hamstrings", "core"],
        "instructions": [
            "Position yourself under the Smith machine bar across your upper back.",
            "Unrack the bar and squat down until your thighs are parallel to the floor.",
            "Push back up to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "cable-tricep-overhead",
        "name": "Cable Overhead Tricep Extension",
        "body_part": "upper arms",
        "target": "triceps",
        "equipment": "cable",
        "primary_muscles": ["triceps brachii (long head)"],
        "secondary_muscles": ["anconeus"],
        "instructions": [
            "Stand facing away from a high cable pulley with a rope attachment.",
            "Hold the rope overhead and extend your arms forward by straightening your elbows.",
            "Return to the starting position with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "wide-grip-lat-pulldown",
        "name": "Wide Grip Lat Pulldown",
        "body_part": "back",
        "target": "lats",
        "equipment": "cable",
        "primary_muscles": ["latissimus dorsi"],
        "secondary_muscles": ["teres major", "biceps brachii", "rhomboids"],
        "instructions": [
            "Sit at the lat pulldown and grip the bar with a wide overhand grip.",
            "Pull the bar to your upper chest, focusing on driving your elbows down.",
            "Control the bar back to the top position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "close-grip-lat-pulldown",
        "name": "Close Grip Lat Pulldown",
        "body_part": "back",
        "target": "lats",
        "equipment": "cable",
        "primary_muscles": ["latissimus dorsi"],
        "secondary_muscles": ["biceps brachii", "rhomboids", "teres major"],
        "instructions": [
            "Attach a V-bar handle to the lat pulldown machine.",
            "Pull the handle to your chest, squeezing your lats.",
            "Slowly return to the starting position."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "incline-hammer-curl",
        "name": "Incline Hammer Curl",
        "body_part": "upper arms",
        "target": "biceps",
        "equipment": "dumbbell",
        "primary_muscles": ["brachialis", "biceps brachii"],
        "secondary_muscles": ["brachioradialis"],
        "instructions": [
            "Sit on an incline bench holding dumbbells at your sides with neutral grip.",
            "Curl the dumbbells toward your shoulders without rotating your wrists.",
            "Lower with control, feeling the stretch at the bottom."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "leg-press-narrow",
        "name": "Narrow Stance Leg Press",
        "body_part": "upper legs",
        "target": "quads",
        "equipment": "machine",
        "primary_muscles": ["quadriceps"],
        "secondary_muscles": ["gluteus maximus"],
        "instructions": [
            "Sit on the leg press and place feet close together and low on the platform.",
            "Lower the platform by bending your knees to 90 degrees.",
            "Press back up focusing on the quadriceps."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "dumbbell-lateral-lunge",
        "name": "Dumbbell Lateral Lunge",
        "body_part": "upper legs",
        "target": "glutes",
        "equipment": "dumbbell",
        "primary_muscles": ["gluteus maximus", "adductors"],
        "secondary_muscles": ["quadriceps", "hamstrings"],
        "instructions": [
            "Stand holding dumbbells at your sides.",
            "Step wide to one side, bending that knee and pushing your hips back.",
            "Push back to the starting position and repeat on the other side."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "cable-face-pull",
        "name": "Cable Face Pull",
        "body_part": "shoulders",
        "target": "delts",
        "equipment": "cable",
        "primary_muscles": ["posterior deltoid", "rhomboids"],
        "secondary_muscles": ["trapezius", "infraspinatus"],
        "instructions": [
            "Set a cable to face height with a rope attachment.",
            "Pull the rope toward your face, separating the ends and externally rotating your shoulders.",
            "Squeeze at the end position, then return with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "dumbbell-shrug",
        "name": "Dumbbell Shrug",
        "body_part": "shoulders",
        "target": "traps",
        "equipment": "dumbbell",
        "primary_muscles": ["trapezius"],
        "secondary_muscles": ["levator scapulae"],
        "instructions": [
            "Stand holding heavy dumbbells at your sides.",
            "Shrug your shoulders up toward your ears as high as possible.",
            "Hold briefly, then lower with control."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "wrist-curl",
        "name": "Wrist Curl",
        "body_part": "lower arms",
        "target": "forearms",
        "equipment": "dumbbell",
        "primary_muscles": ["forearm flexors"],
        "secondary_muscles": [],
        "instructions": [
            "Sit on a bench with forearms resting on your thighs, palms up, holding dumbbells.",
            "Lower the dumbbells by extending your wrists.",
            "Curl the dumbbells back up by flexing your wrists."
        ],
        "category": "strength"
    },
    {
        "exercise_id": "reverse-wrist-curl",
        "name": "Reverse Wrist Curl",
        "body_part": "lower arms",
        "target": "forearms",
        "equipment": "dumbbell",
        "primary_muscles": ["forearm extensors"],
        "secondary_muscles": [],
        "instructions": [
            "Sit on a bench with forearms on your thighs, palms facing down, holding dumbbells.",
            "Extend your wrists to raise the dumbbells.",
            "Lower back down with control."
        ],
        "category": "strength"
    },
]

BODY_PART_ICONS = {
    "chest": "body",
    "back": "body",
    "shoulders": "body",
    "upper arms": "fitness",
    "lower arms": "fitness",
    "upper legs": "walk",
    "lower legs": "walk",
    "waist": "body",
    "cardio": "heart",
    "neck": "body",
    "lower arms": "hand-left",
}

BODY_PART_COLORS = {
    "chest": "#EF4444",
    "back": "#3B82F6",
    "shoulders": "#F59E0B",
    "upper arms": "#8B5CF6",
    "lower arms": "#EC4899",
    "upper legs": "#10B981",
    "lower legs": "#06B6D4",
    "waist": "#F97316",
    "cardio": "#EF4444",
    "neck": "#6366F1",
}
