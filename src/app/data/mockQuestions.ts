import { Question } from '../types';

// Questions mockées pour le MVP
export const mockQuestions: Question[] = [
  {
    id: '1',
    context: "Vous jouez ADC, votre équipe vient de tuer le dragon et l'ennemi est en train de faire le Baron. Vous avez 70% de HP, votre support est à 40%, mais votre jungler et toplaner sont vivants près du Baron.",
    question: "Quelle est la meilleure décision ?",
    answers: [
      { id: '1a', text: "Recall pour acheter des items et push bot", score: 0 },
      { id: '1b', text: "Aller contester le Baron avec votre équipe", score: 100 },
      { id: '1c', text: "Prendre la tour bot pendant qu'ils font Baron", score: 50 },
      { id: '1d', text: "Farm la jungle adverse", score: 25 }
    ],
    explanation: "Contester le Baron est prioritaire car il donne un avantage considérable à l'équipe ennemie. Même avec peu de HP, votre présence et vos dégâts peuvent forcer l'ennemi à reculer ou gagner le teamfight. Prendre la tour bot (50 points) est une option de secours si le Baron est déjà trop avancé, mais moins impactante.",
    category: 'macro',
    role: 'adc',
    gamePhase: 'mid',
    createdAt: new Date().toISOString(),
    imageUrl: "https://example.com/images/baron-situation.jpg"
  },
  {
    id: '2',
    context: "Lors de la phase de draft, votre équipe a pick Malphite top et Yasuo mid. L'équipe adverse a déjà choisi Ezreal ADC et Yuumi support.",
    question: "Quel champion jungler serait le plus synergique ?",
    answers: [
      { id: '2a', text: "Jarvan IV", score: 100 },
      { id: '2b', text: "Master Yi", score: 25 },
      { id: '2c', text: "Wukong", score: 75 },
      { id: '2d', text: "Evelynn", score: 0 }
    ],
    explanation: "Jarvan IV est le choix optimal car son ultime (Cataclysm) crée un excellent setup pour Malphite et Yasuo. Wukong (75 points) offre aussi du CC et des knockups mais avec moins de fiabilité. Master Yi n'apporte pas de synergie CC malgré ses dégâts, et Evelynn ne bénéficie pas de la composition knockup.",
    category: 'draft',
    role: 'jungle',
    gamePhase: 'général',
    createdAt: new Date().toISOString(),
    videoUrl: "https://example.com/videos/jarvan-synergy.mp4"
  },
  {
    id: '3',
    context: "Vous êtes support tank à 20 minutes. Vous avez 1200 gold. Votre ADC se fait souvent poke et votre équipe manque de vision.",
    question: "Quel achat prioriser ?",
    answers: [
      { id: '3a', text: "Terminer vos bottes et acheter des wards de contrôle", score: 100 },
      { id: '3b', text: "Acheter un composant de votre prochain item mythique", score: 50 },
      { id: '3c', text: "Acheter uniquement des wards de contrôle", score: 75 },
      { id: '3d', text: "Sauvegarder pour le gros item", score: 0 }
    ],
    explanation: "Les bottes + wards de contrôle offrent le meilleur rapport qualité-prix à ce moment. La mobilité aide au warding et au roaming, et la vision est critique en mid game. Acheter seulement des wards (75 points) est bon mais les bottes sont aussi importantes. Un composant d'item (50 points) est moins impactant sans mobilité.",
    category: 'items',
    role: 'support',
    gamePhase: 'mid',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    context: "Vous êtes toplaner niveau 6 avec téléportation disponible. Votre midlaner spam ping pour de l'aide car il est ganké par le jungler ennemi.",
    question: "Que faites-vous ?",
    answers: [
      { id: '4a', text: "TP immédiatement pour aider", score: 50 },
      { id: '4b', text: "Vérifier si le TP est worth (état de la lane mid, position ennemie) avant de décider", score: 100 },
      { id: '4c', text: "Ignorer et pusher la lane top", score: 25 },
      { id: '4d', text: "TP et engager sans attendre votre midlaner", score: 0 }
    ],
    explanation: "Analyser la situation avant d'utiliser le TP est crucial car c'est un cooldown long et précieux. Si votre midlaner est déjà mort ou trop loin, le TP est gaspillé. TP immédiatement (50 points) peut sauver le mid mais risque d'être un waste. Pusher top (25 points) peut être correct si le TP n'est clairement pas worth.",
    category: 'macro',
    role: 'top',
    gamePhase: 'early',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    context: "Minute 35, vous venez de gagner un teamfight 4v5 près du mid. L'ADC ennemi est vivant mais respawn dans 40 secondes. Le Baron et l'Elder Drake sont disponibles.",
    question: "Quel objectif prioriser ?",
    answers: [
      { id: '5a', text: "Baron", score: 75 },
      { id: '5b', text: "Elder Drake", score: 100 },
      { id: '5c', text: "Pusher et finir la partie", score: 50 },
      { id: '5d', text: "Retour base et regroup", score: 0 }
    ],
    explanation: "À 35 minutes avec Elder disponible, c'est l'objectif le plus important du jeu. Elder Drake donne un avantage massif qui peut permettre de finish immédiatement. Baron (75 points) est aussi bon mais moins décisif que Elder à ce stade. Push direct (50 points) est risqué sans buff majeur.",
    category: 'macro',
    role: 'général',
    gamePhase: 'late',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    context: "Vous jouez jungle et venez de finir votre clear. Votre toplaner spam ping car il est sous sa tour à 30% HP face à un Darius full vie.",
    question: "Que faites-vous ?",
    answers: [
      { id: '6a', text: "Ganker top immédiatement", score: 0 },
      { id: '6b', text: "Farm un autre camp puis évaluer", score: 25 },
      { id: '6c', text: "Dire à votre top de play safe et aller ganker bot ou mid", score: 100 },
      { id: '6d', text: "Faire un contre-jungle", score: 50 }
    ],
    explanation: "Ganker un Darius full vie avec votre toplaner low HP est extrêmement risqué et peut résulter en un double kill pour Darius. Il vaut mieux dire à votre top de play safe et créer un avantage ailleurs sur la map où les conditions sont meilleures. Le contre-jungle (50 points) est OK mais moins impactant qu'un gank réussi ailleurs.",
    category: 'macro',
    role: 'jungle',
    gamePhase: 'early',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    context: "Phase de draft : votre équipe a besoin d'un midlaner. L'ennemi a pick Zed et Nocturne. Votre équipe a un toplaner tank et un support enchanteuse.",
    question: "Quel type de champion mid serait le plus adapté ?",
    answers: [
      { id: '7a', text: "Un mage avec CC (Lux, Syndra)", score: 100 },
      { id: '7b', text: "Un assassin mobile (Katarina, Akali)", score: 25 },
      { id: '7c', text: "Un contrôle mage avec wave clear (Anivia, Viktor)", score: 75 },
      { id: '7d', text: "Un champion AD (Zed, Talon)", score: 0 }
    ],
    explanation: "Face à une composition de dive ennemie (Zed + Nocturne), un mage avec CC aide à peel votre carry et à contrôler les teamfights. Votre équipe a déjà un tank mais manque de CC offensif. Les control mages (75 points) sont aussi bons avec leur wave clear et zone control. Les assassins rendent votre équipe trop fragile.",
    category: 'draft',
    role: 'mid',
    gamePhase: 'général',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    context: "Vous êtes ADC et avez terminé votre premier item mythique (Kraken Slayer). Vous avez 1300 gold. L'équipe ennemie a 2 tanks qui stack armor.",
    question: "Quel devrait être votre prochain achat ?",
    answers: [
      { id: '8a', text: "Commencer Lord Dominik's Regards", score: 100 },
      { id: '8b', text: "Acheter des bottes Berserker si pas encore fait", score: 75 },
      { id: '8c', text: "Continuer votre build DPS standard (Phantom Dancer)", score: 50 },
      { id: '8d', text: "Acheter Guardian Angel pour survivre", score: 25 }
    ],
    explanation: "Lord Dominik's est crucial contre les tanks qui stackent armor. Plus vous l'achetez tôt, plus vous serez efficace dans les teamfights. Les bottes (75 points) sont aussi prioritaires si pas encore achetées. Le DPS standard (50 points) est moins efficace sans pénétration armor. GA (25 points) est un item de late game.",
    category: 'items',
    role: 'adc',
    gamePhase: 'mid',
    createdAt: new Date().toISOString()
  }
];
