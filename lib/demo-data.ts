import type { VoiceNote } from "@/types/speakback"

export const demoNotes: VoiceNote[] = [
  {
    id: "1",
    title: "Photosynthesis Process",
    transcript:
      "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This process occurs in the chloroplasts of plant cells, specifically in the thylakoids where chlorophyll captures light energy. The process has two main stages: the light-dependent reactions and the Calvin cycle.",
    duration: 45,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    completenessScore: 85,
    feedback:
      "Great explanation of the basic process! Consider adding more detail about the specific molecules involved.",
    tags: ["biology", "plants", "energy"],
    subject: "Biology",
    difficulty: "intermediate",
    keyPoints: [
      "Light-dependent reactions occur in thylakoids",
      "Calvin cycle produces glucose",
      "Chlorophyll captures light energy",
      "Produces oxygen as byproduct",
    ],
    questions: [
      "What are the two main stages of photosynthesis?",
      "Where does photosynthesis occur in plant cells?",
      "What molecules are needed for photosynthesis?",
    ],
  },
  {
    id: "2",
    title: "Newton's Laws of Motion",
    transcript:
      "Newton's three laws of motion form the foundation of classical mechanics. The first law states that an object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force. The second law relates force, mass, and acceleration with F=ma. The third law states that for every action, there is an equal and opposite reaction.",
    duration: 52,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    completenessScore: 92,
    feedback: "Excellent coverage of all three laws with clear examples!",
    tags: ["physics", "mechanics", "laws"],
    subject: "Physics",
    difficulty: "intermediate",
    keyPoints: [
      "First law: inertia",
      "Second law: F=ma",
      "Third law: action-reaction pairs",
      "Foundation of classical mechanics",
    ],
    questions: [
      "What is Newton's first law of motion?",
      "How do you calculate force using Newton's second law?",
      "Give an example of Newton's third law",
    ],
  },
  {
    id: "3",
    title: "The Water Cycle",
    transcript:
      "The water cycle is the continuous movement of water through the Earth's atmosphere, land, and oceans. It involves several key processes: evaporation from water bodies, transpiration from plants, condensation in the atmosphere forming clouds, precipitation as rain or snow, and collection in rivers, lakes, and groundwater. This cycle is driven by solar energy and gravity.",
    duration: 38,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    completenessScore: 78,
    feedback: "Good overview! Try to explain the role of temperature in each process.",
    tags: ["earth science", "weather", "environment"],
    subject: "Earth Science",
    difficulty: "beginner",
    keyPoints: [
      "Evaporation from water bodies",
      "Transpiration from plants",
      "Condensation forms clouds",
      "Precipitation returns water to Earth",
    ],
    questions: [
      "What drives the water cycle?",
      "What is the difference between evaporation and transpiration?",
      "How do clouds form?",
    ],
  },
  {
    id: "4",
    title: "Cellular Respiration",
    transcript:
      "Cellular respiration is the process by which cells break down glucose to produce ATP, the energy currency of cells. It occurs in three main stages: glycolysis in the cytoplasm, the Krebs cycle in the mitochondrial matrix, and the electron transport chain in the inner mitochondrial membrane. This process requires oxygen and produces carbon dioxide and water as waste products.",
    duration: 67,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    completenessScore: 88,
    feedback: "Comprehensive explanation! Great detail on the three stages.",
    tags: ["biology", "cellular", "energy", "metabolism"],
    subject: "Biology",
    difficulty: "advanced",
    keyPoints: [
      "Three stages: glycolysis, Krebs cycle, electron transport",
      "Produces ATP energy",
      "Requires oxygen",
      "Occurs in mitochondria",
    ],
    questions: [
      "Where does glycolysis occur?",
      "What is the main product of cellular respiration?",
      "Why is oxygen necessary for cellular respiration?",
    ],
  },
  {
    id: "5",
    title: "Chemical Bonding Types",
    transcript:
      "There are three main types of chemical bonds: ionic, covalent, and metallic. Ionic bonds form between metals and non-metals through electron transfer, creating charged ions. Covalent bonds form between non-metals through electron sharing. Metallic bonds occur in metals where electrons form a 'sea' around metal cations. Each type has different properties affecting melting point, conductivity, and solubility.",
    duration: 55,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
    completenessScore: 82,
    feedback: "Good explanation of bond types! Consider adding examples of compounds for each type.",
    tags: ["chemistry", "bonding", "molecules"],
    subject: "Chemistry",
    difficulty: "intermediate",
    keyPoints: [
      "Ionic: electron transfer between metals and non-metals",
      "Covalent: electron sharing between non-metals",
      "Metallic: electron sea in metals",
      "Different properties for each type",
    ],
    questions: [
      "How do ionic bonds form?",
      "What is the difference between ionic and covalent bonds?",
      "What are the properties of metallic bonds?",
    ],
  },
]
