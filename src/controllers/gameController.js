import User from "../models/User.js";

// @desc    Generate story-based disaster scenario
// @route   POST /api/games/story
// @access  Private
export const getStoryGame = async (req, res) => {
  try {
    const { disasterType = "earthquake", userAge = 12 } = req.body;

    // Stub implementation - later replace with Gemini API
    const storyScenarios = {
      earthquake: {
        title: "The Great Shake: An Earthquake Adventure",
        scenario: "You're at school when suddenly the ground starts shaking violently. The earthquake alarm goes off and everyone starts panicking!",
        choices: [
          {
            id: 1,
            text: "Duck under your desk immediately and hold on",
            points: 10,
            outcome: "Excellent! You followed the 'Drop, Cover, and Hold On' rule perfectly. This is the safest action during an earthquake."
          },
          {
            id: 2,
            text: "Run outside quickly through the doorway",
            points: -5,
            outcome: "Be careful! Running during shaking can be dangerous. You could fall or be hit by falling objects. Stay under cover first."
          },
          {
            id: 3,
            text: "Stand in the doorway and wait",
            points: 3,
            outcome: "Doorways aren't as safe as we once thought. Modern buildings are stronger, so under a sturdy desk is much better!"
          }
        ],
        nextScenario: "The shaking has stopped. You're under your desk and safe. What should you do next?",
        nextChoices: [
          {
            id: 4,
            text: "Count to 60, then carefully evacuate following your teacher",
            points: 10,
            outcome: "Perfect! Waiting ensures aftershocks don't catch you while moving, and following evacuation procedures keeps everyone safe."
          },
          {
            id: 5,
            text: "Immediately run outside as fast as possible",
            points: -3,
            outcome: "Slow down! Aftershocks might happen. It's better to wait a moment and evacuate calmly."
          },
          {
            id: 6,
            text: "Stay under the desk until someone tells you to move",
            points: 5,
            outcome: "Good thinking about waiting, but you should follow evacuation procedures after the main shaking stops."
          }
        ],
        tips: [
          "Drop, Cover, and Hold On is the international earthquake safety method",
          "Stay away from windows and heavy objects that might fall",
          "Count to 60 after shaking stops before moving to avoid aftershocks",
          "Have an earthquake plan with your family and practice it regularly",
          "Keep emergency supplies: water, food, flashlight, and first aid kit"
        ],
        facts: [
          "Earthquakes can't be predicted, but we can prepare for them",
          "Most injuries happen from falling objects, not building collapse",
          "The 'Triangle of Life' theory is not recommended by safety experts",
          "Aftershocks can continue for days or weeks after the main earthquake"
        ]
      },
      tsunami: {
        title: "Wave of Survival: A Tsunami Emergency",
        scenario: "You're at the beach with your family when suddenly the ocean water starts pulling back very far, exposing the sea floor. You notice fish flopping on the sand where water used to be.",
        choices: [
          {
            id: 1,
            text: "Immediately run to higher ground as fast as possible",
            points: 15,
            outcome: "Excellent! Ocean water pulling back is a major tsunami warning sign. Getting to high ground quickly can save your life!"
          },
          {
            id: 2,
            text: "Stay and watch this strange phenomenon",
            points: -10,
            outcome: "This is very dangerous! When the ocean pulls back like this, a massive wave is coming. You must evacuate immediately!"
          },
          {
            id: 3,
            text: "Go collect the fish on the exposed seafloor",
            points: -15,
            outcome: "Never do this! This is one of the most dangerous things you could do. The tsunami wave could arrive any moment!"
          }
        ],
        nextScenario: "You're running inland and uphill. Behind you, people are screaming and you hear a loud roaring sound like a freight train. What do you do?",
        nextChoices: [
          {
            id: 4,
            text: "Keep running uphill without looking back",
            points: 10,
            outcome: "Smart! Every second counts. Don't stop until you're at least 100 feet above sea level or 2 miles inland."
          },
          {
            id: 5,
            text: "Climb the nearest tall, strong building",
            points: 8,
            outcome: "Good thinking! If you can't get to high ground, a strong concrete building can save you. Avoid wooden buildings!"
          },
          {
            id: 6,
            text: "Stop to help someone who fell behind",
            points: 5,
            outcome: "Your heart is in the right place, but make sure you're safe first. Alert authorities to help once you reach safety."
          }
        ],
        tips: [
          "If you see the ocean pull back dramatically, evacuate immediately",
          "Get to high ground: 100+ feet above sea level or 2+ miles inland",
          "Tsunamis can travel 500+ mph in deep ocean, slowing to 30-50 mph near shore",
          "The first wave isn't always the biggest - stay away for hours",
          "If you feel a strong earthquake near the coast, move to high ground immediately"
        ],
        facts: [
          "Tsunamis are caused by underwater earthquakes, landslides, or volcanic eruptions",
          "They can cross entire oceans in less than a day",
          "Tsunami waves can be 100+ feet tall and travel miles inland",
          "Animals often sense tsunamis before humans and head to higher ground",
          "Tsunami warning systems can give 3+ hours notice for distant tsunamis"
        ]
      },
      flood: {
        title: "Rising Waters: A Flood Survival Story",
        scenario: "Heavy rains have been falling for days. You notice water rising rapidly in your neighborhood and it's starting to reach your front door.",
        choices: [
          {
            id: 1,
            text: "Move to higher ground immediately with emergency supplies",
            points: 10,
            outcome: "Excellent! Higher ground is always safer during floods. Getting there early while you can move safely is crucial."
          },
          {
            id: 2,
            text: "Wait to see if water gets higher before deciding",
            points: -5,
            outcome: "Waiting can be dangerous. Flood water rises fast and can become too deep to walk through safely."
          },
          {
            id: 3,
            text: "Try to drive through the water to get to safety",
            points: -10,
            outcome: "Never drive through flood water! Just 6 inches can make you lose control, and 2 feet can carry away a car."
          }
        ],
        nextScenario: "You're now on higher ground watching the flood from a safe distance. A neighbor calls for help from their roof. What do you do?",
        nextChoices: [
          {
            id: 4,
            text: "Call 911 and emergency services to report the location",
            points: 10,
            outcome: "Perfect! Emergency responders have proper equipment and training for water rescues. Don't become a victim yourself."
          },
          {
            id: 5,
            text: "Try to wade through the water to help them",
            points: -8,
            outcome: "Your heart is in the right place, but this is very dangerous. You could drown and need rescue yourself."
          },
          {
            id: 6,
            text: "Look for a boat or flotation device to help safely",
            points: 6,
            outcome: "Good thinking about safety, but leave water rescues to trained professionals with proper equipment."
          }
        ],
        tips: [
          "Turn Around, Don't Drown - avoid walking/driving in flood water",
          "Just 6 inches of flowing water can knock you down",
          "12 inches of water can carry away a vehicle",
          "Stay on higher ground until authorities say it's safe",
          "Have an emergency kit ready: water, food, flashlight, radio, first aid"
        ],
        facts: [
          "Floods are the most common natural disaster worldwide",
          "Flash floods can occur in minutes with little warning",
          "Most flood deaths happen in vehicles",
          "Flood water can hide dangerous debris and electrical hazards",
          "It only takes 2 feet of water to float most vehicles"
        ]
      },
      fire: {
        title: "Flames and Safety: A Fire Emergency",
        scenario: "You wake up in the middle of the night to the smell of smoke and the sound of your fire alarm beeping loudly. Your bedroom door feels warm to the touch.",
        choices: [
          {
            id: 1,
            text: "Stay low, crawl to window, and escape through it",
            points: 10,
            outcome: "Smart! A warm door means fire is on the other side. Using the window and staying low to avoid smoke inhalation is perfect."
          },
          {
            id: 2,
            text: "Open the door and run through quickly",
            points: -8,
            outcome: "Dangerous! A warm door means fire is behind it. Opening it could cause a backdraft or let fire into your room."
          },
          {
            id: 3,
            text: "Get low and crawl to the door, check if it's safe",
            points: 7,
            outcome: "Good technique staying low, but since the door is already warm, you should use your alternate escape route."
          }
        ],
        nextScenario: "You're outside safely, but you realize your family cat is still inside. What should you do?",
        nextChoices: [
          {
            id: 4,
            text: "Tell the firefighters about your cat when they arrive",
            points: 10,
            outcome: "Absolutely right! Never go back into a burning building. Firefighters have equipment and training to rescue pets safely."
          },
          {
            id: 5,
            text: "Quickly run back in to get your cat",
            points: -10,
            outcome: "Never go back into a burning building! Fire spreads incredibly fast and you could get trapped or overcome by smoke."
          },
          {
            id: 6,
            text: "Wait and see if the cat comes out on its own",
            points: 3,
            outcome: "Pets sometimes hide during fires. It's better to inform emergency responders so they can search safely."
          }
        ],
        tips: [
          "Get out fast and stay out - don't go back for belongings or pets",
          "Crawl low under smoke to breathe cleaner air",
          "Have a family meeting place outside your home",
          "If your door is warm, use your alternate escape route",
          "Test smoke alarms monthly and change batteries twice a year"
        ],
        facts: [
          "You have as little as 2 minutes to escape a house fire",
          "Smoke inhalation causes more deaths than burns",
          "House fires spread faster than most people realize",
          "Fire doubles in size every 30 seconds",
          "Most fire deaths occur at night when people are sleeping"
        ]
      }
    };

    const selectedStory = storyScenarios[disasterType] || storyScenarios.earthquake;

    // Simulate game progress tracking
    const user = await User.findById(req.user._id);
    const gameProgress = user.gameProgress.find(gp => gp.gameType === 'story');
    
    if (gameProgress) {
      gameProgress.level = Math.min(gameProgress.level + 1, 10);
      gameProgress.score += 5; // Base points for playing
    } else {
      user.gameProgress.push({
        gameType: 'story',
        level: 1,
        score: 5,
        completedAt: new Date()
      });
    }
    
    await user.save();

    res.json({
      success: true,
      data: {
        gameType: "story",
        disasterType,
        userLevel: gameProgress?.level || 1,
        story: selectedStory,
        gameId: `story_${disasterType}_${Date.now()}`,
        estimatedDuration: 10, // minutes
        maxPoints: 50
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process story game choice
// @route   POST /api/games/story/choice
// @access  Private
export const processStoryChoice = async (req, res) => {
  try {
    const { gameId, choiceId, disasterType } = req.body;

    // Update user score based on choice
    const user = await User.findById(req.user._id);
    const gameProgress = user.gameProgress.find(gp => gp.gameType === 'story');
    
    // Simulate scoring based on choice (in real implementation, validate against story data)
    const pointsEarned = choiceId === 1 ? 10 : choiceId === 2 ? 5 : -5;
    
    if (gameProgress) {
      gameProgress.score += Math.max(pointsEarned, 0);
      user.totalScore += Math.max(pointsEarned, 0);
    }
    
    await user.save();

    res.json({
      success: true,
      data: {
        pointsEarned,
        totalScore: gameProgress?.score || 0,
        feedback: pointsEarned > 5 ? "Excellent choice!" : pointsEarned > 0 ? "Good thinking!" : "Let's learn from this choice!",
        continueGame: true
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate drag-drop disaster scenario
// @route   POST /api/games/scenario
// @access  Private
export const getScenarioGame = async (req, res) => {
  try {
    const { disasterType = "earthquake" } = req.body;

    // Stub implementation for drag-drop scenarios
    const scenarios = {
      earthquake: {
        title: "Earthquake Preparedness Challenge",
        description: "Drag the correct items to create your earthquake emergency kit",
        availableItems: [
          { id: 1, name: "Flashlight", category: "essential", points: 10 },
          { id: 2, name: "Extra batteries", category: "essential", points: 8 },
          { id: 3, name: "Water bottles (1 gallon per person per day)", category: "essential", points: 10 },
          { id: 4, name: "First aid kit", category: "essential", points: 9 },
          { id: 5, name: "Non-perishable food", category: "essential", points: 8 },
          { id: 6, name: "Emergency whistle", category: "essential", points: 7 },
          { id: 7, name: "Dust masks", category: "essential", points: 6 },
          { id: 8, name: "Plastic sheeting and duct tape", category: "useful", points: 5 },
          { id: 9, name: "Wrench to turn off gas", category: "essential", points: 8 },
          { id: 10, name: "Manual can opener", category: "essential", points: 6 },
          { id: 11, name: "Local maps", category: "useful", points: 4 },
          { id: 12, name: "Cell phone chargers", category: "useful", points: 5 },
          { id: 13, name: "Cash in small bills", category: "useful", points: 5 },
          { id: 14, name: "Emergency blankets", category: "essential", points: 7 },
          { id: 15, name: "Candy bars", category: "optional", points: 2 },
          { id: 16, name: "Gaming console", category: "incorrect", points: -5 },
          { id: 17, name: "Heavy furniture", category: "incorrect", points: -5 },
          { id: 18, name: "Glass containers", category: "incorrect", points: -3 }
        ],
        targetItems: 8,
        timeLimit: 300, // 5 minutes
        difficulty: "medium",
        educationalContent: {
          tips: [
            "Store at least 3 days worth of supplies for each person",
            "Keep emergency kits in multiple locations: home, car, work",
            "Check and update your kit every 6 months",
            "Include special needs items for babies, elderly, or pets"
          ]
        }
      },
      tsunami: {
        title: "Tsunami Survival Kit Challenge",
        description: "You live in a coastal area. Build an emergency kit for tsunami preparedness",
        availableItems: [
          { id: 1, name: "Waterproof flashlight", category: "essential", points: 10 },
          { id: 2, name: "NOAA Weather Radio", category: "essential", points: 10 },
          { id: 3, name: "Waterproof container for documents", category: "essential", points: 9 },
          { id: 4, name: "Life jackets", category: "essential", points: 10 },
          { id: 5, name: "Emergency whistle", category: "essential", points: 8 },
          { id: 6, name: "Waterproof matches", category: "essential", points: 7 },
          { id: 7, name: "Water purification tablets", category: "essential", points: 8 },
          { id: 8, name: "Emergency food bars", category: "essential", points: 8 },
          { id: 9, name: "Rope or paracord", category: "useful", points: 6 },
          { id: 10, name: "Waterproof backpack", category: "essential", points: 7 },
          { id: 11, name: "Emergency contact list", category: "essential", points: 9 },
          { id: 12, name: "Medications in waterproof bag", category: "essential", points: 9 },
          { id: 13, name: "Signal mirror", category: "useful", points: 5 },
          { id: 14, name: "Duct tape", category: "useful", points: 4 },
          { id: 15, name: "Snorkeling gear", category: "incorrect", points: -5 },
          { id: 16, name: "Surfboard", category: "incorrect", points: -5 },
          { id: 17, name: "Heavy books", category: "incorrect", points: -3 },
          { id: 18, name: "Beach chair", category: "incorrect", points: -3 }
        ],
        targetItems: 10,
        timeLimit: 360,
        difficulty: "hard",
        educationalContent: {
          tips: [
            "Know your evacuation routes to high ground",
            "Practice evacuation drills with your family",
            "Keep emergency kits in waterproof containers",
            "Sign up for local tsunami warning alerts",
            "Learn the natural warning signs: ground shaking, ocean recession"
          ]
        }
      },
      flood: {
        title: "Flood Safety Actions",
        description: "A flood warning has been issued for your area. Choose the right actions to take",
        availableItems: [
          { id: 1, name: "Move to higher ground", category: "essential", points: 10 },
          { id: 2, name: "Fill bathtub with clean water", category: "essential", points: 8 },
          { id: 3, name: "Charge all electronic devices", category: "useful", points: 6 },
          { id: 4, name: "Turn off utilities (gas, electricity)", category: "essential", points: 9 },
          { id: 5, name: "Pack emergency bag", category: "essential", points: 8 },
          { id: 6, name: "Monitor weather alerts", category: "essential", points: 7 },
          { id: 7, name: "Secure outdoor furniture", category: "useful", points: 5 },
          { id: 8, name: "Fill car with gas", category: "useful", points: 6 },
          { id: 9, name: "Take photos of property", category: "useful", points: 4 },
          { id: 10, name: "Contact family members", category: "essential", points: 7 },
          { id: 11, name: "Drive through flooded roads", category: "incorrect", points: -10 },
          { id: 12, name: "Stay near windows to watch", category: "incorrect", points: -5 },
          { id: 13, name: "Walk through flood water", category: "incorrect", points: -8 },
          { id: 14, name: "Ignore evacuation orders", category: "incorrect", points: -10 }
        ],
        targetItems: 7,
        timeLimit: 240,
        difficulty: "medium",
        educationalContent: {
          tips: [
            "Never drive or walk through flood water",
            "6 inches of water can knock you down",
            "12 inches can carry away a vehicle",
            "Have multiple evacuation routes planned"
          ]
        }
      },
      fire: {
        title: "House Fire Emergency Response",
        description: "Your smoke alarm goes off at night. Select the correct escape actions",
        availableItems: [
          { id: 1, name: "Check door temperature with back of hand", category: "essential", points: 9 },
          { id: 2, name: "Crawl low under smoke", category: "essential", points: 10 },
          { id: 3, name: "Call 911 once outside", category: "essential", points: 10 },
          { id: 4, name: "Go to family meeting place", category: "essential", points: 8 },
          { id: 5, name: "Close doors behind you", category: "essential", points: 7 },
          { id: 6, name: "Alert other family members", category: "essential", points: 9 },
          { id: 7, name: "Use stairs, not elevator", category: "essential", points: 8 },
          { id: 8, name: "Feel walls for heat", category: "useful", points: 5 },
          { id: 9, name: "Cover nose with cloth", category: "useful", points: 6 },
          { id: 10, name: "Stop, drop, and roll if on fire", category: "essential", points: 10 },
          { id: 11, name: "Go back for pets or belongings", category: "incorrect", points: -10 },
          { id: 12, name: "Open windows to let smoke out", category: "incorrect", points: -5 },
          { id: 13, name: "Stand up and run through smoke", category: "incorrect", points: -8 },
          { id: 14, name: "Use elevator to escape faster", category: "incorrect", points: -10 }
        ],
        targetItems: 8,
        timeLimit: 180,
        difficulty: "hard",
        educationalContent: {
          tips: [
            "You have as little as 2 minutes to escape",
            "Smoke is more dangerous than flames",
            "Never go back into a burning building",
            "Practice escape plans twice a year"
          ]
        }
      }
    };

    const selectedScenario = scenarios[disasterType] || scenarios.earthquake;

    // Update user progress
    const user = await User.findById(req.user._id);
    let gameProgress = user.gameProgress.find(gp => gp.gameType === 'scenario');
    
    if (!gameProgress) {
      gameProgress = {
        gameType: 'scenario',
        level: 1,
        score: 0,
        completedAt: new Date()
      };
      user.gameProgress.push(gameProgress);
    }
    
    await user.save();

    res.json({
      success: true,
      data: {
        gameType: "scenario",
        scenario: selectedScenario,
        gameId: `scenario_${disasterType}_${Date.now()}`,
        userLevel: gameProgress.level,
        instructions: "Drag the correct items to the emergency kit area. Avoid incorrect items!"
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit scenario game response
// @route   POST /api/games/scenario/submit
// @access  Private
export const submitScenarioResponse = async (req, res) => {
  try {
    const { gameId, selectedItems, timeTaken } = req.body;

    // Simulate scoring logic
    let totalScore = 0;
    let correctItems = 0;
    let incorrectItems = 0;

    selectedItems.forEach(item => {
      if (item.category === "essential") {
        totalScore += item.points;
        correctItems++;
      } else if (item.category === "useful") {
        totalScore += item.points;
      } else if (item.category === "incorrect") {
        totalScore += item.points; // negative points
        incorrectItems++;
      }
    });

    // Time bonus/penalty
    const timeBonus = timeTaken < 180 ? 10 : timeTaken < 240 ? 5 : 0;
    totalScore += timeBonus;

    // Update user progress
    const user = await User.findById(req.user._id);
    const gameProgress = user.gameProgress.find(gp => gp.gameType === 'scenario');
    
    if (gameProgress) {
      gameProgress.score += Math.max(totalScore, 0);
      user.totalScore += Math.max(totalScore, 0);
      gameProgress.completedAt = new Date();
    }
    
    await user.save();

    res.json({
      success: true,
      data: {
        score: totalScore,
        correctItems,
        incorrectItems,
        timeBonus,
        feedback: {
          overall: totalScore > 40 ? "Excellent!" : totalScore > 20 ? "Good job!" : "Keep learning!",
          details: `You selected ${correctItems} essential items correctly.`
        },
        totalScore: gameProgress?.score || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get emergency kit building game
// @route   POST /api/games/kit
// @access  Private
export const getKitGame = async (req, res) => {
  try {
    const { budget = 150, familySize = 4, disasterType = "general" } = req.body;

    // Enhanced kit items based on disaster type
    const kitSets = {
      general: {
        title: "General Emergency Kit Builder",
        description: "Build a comprehensive emergency kit for any disaster",
        water: [
          { id: 1, name: "Water bottles (24-pack)", cost: 15, days: 3, essential: true, category: "water" },
          { id: 2, name: "Water purification tablets", cost: 8, days: 30, essential: true, category: "water" },
          { id: 3, name: "Portable water filter", cost: 25, days: 365, essential: false, category: "water" },
          { id: 4, name: "5-gallon water container", cost: 12, days: 5, essential: false, category: "water" }
        ],
        food: [
          { id: 5, name: "Canned food variety pack", cost: 20, days: 7, essential: true, category: "food" },
          { id: 6, name: "Energy bars (12-pack)", cost: 12, days: 3, essential: true, category: "food" },
          { id: 7, name: "MREs (5 meals)", cost: 35, days: 5, essential: false, category: "food" },
          { id: 8, name: "Dried fruits and nuts", cost: 10, days: 2, essential: false, category: "food" },
          { id: 9, name: "Manual can opener", cost: 3, essential: true, category: "food" }
        ],
        tools: [
          { id: 10, name: "LED flashlight", cost: 15, essential: true, category: "tools" },
          { id: 11, name: "Battery-powered radio", cost: 20, essential: true, category: "tools" },
          { id: 12, name: "First aid kit", cost: 25, essential: true, category: "tools" },
          { id: 13, name: "Multi-tool with knife", cost: 18, essential: false, category: "tools" },
          { id: 14, name: "Duct tape", cost: 5, essential: false, category: "tools" },
          { id: 15, name: "Extra batteries", cost: 8, essential: true, category: "tools" }
        ],
        safety: [
          { id: 16, name: "Emergency blankets", cost: 8, essential: true, category: "safety" },
          { id: 17, name: "Emergency whistle", cost: 3, essential: true, category: "safety" },
          { id: 18, name: "N95 dust masks", cost: 12, essential: false, category: "safety" },
          { id: 19, name: "Work gloves", cost: 6, essential: false, category: "safety" },
          { id: 20, name: "Cash in small bills", cost: 50, essential: false, category: "safety" }
        ]
      },
      earthquake: {
        title: "Earthquake Emergency Kit Builder",
        description: "Build a specialized kit for earthquake preparedness and aftermath survival",
        water: [
          { id: 1, name: "Water bottles (48-pack)", cost: 25, days: 6, essential: true, category: "water" },
          { id: 2, name: "Water purification tablets", cost: 8, days: 30, essential: true, category: "water" },
          { id: 3, name: "Collapsible water containers", cost: 15, days: 10, essential: true, category: "water" }
        ],
        food: [
          { id: 4, name: "Earthquake emergency food kit", cost: 40, days: 10, essential: true, category: "food" },
          { id: 5, name: "High-energy protein bars", cost: 15, days: 5, essential: true, category: "food" },
          { id: 6, name: "Manual can opener", cost: 3, essential: true, category: "food" },
          { id: 7, name: "Comfort foods (chocolate, etc.)", cost: 8, essential: false, category: "food" }
        ],
        tools: [
          { id: 8, name: "Heavy-duty flashlight", cost: 20, essential: true, category: "tools" },
          { id: 9, name: "NOAA Weather Radio", cost: 25, essential: true, category: "tools" },
          { id: 10, name: "Crowbar/pry bar", cost: 15, essential: true, category: "tools" },
          { id: 11, name: "Gas shut-off wrench", cost: 12, essential: true, category: "tools" },
          { id: 12, name: "Comprehensive first aid kit", cost: 35, essential: true, category: "tools" },
          { id: 13, name: "Fire extinguisher", cost: 30, essential: false, category: "tools" }
        ],
        safety: [
          { id: 14, name: "Hard hat/helmet", cost: 18, essential: true, category: "safety" },
          { id: 15, name: "Heavy-duty work gloves", cost: 10, essential: true, category: "safety" },
          { id: 16, name: "Emergency whistle", cost: 3, essential: true, category: "safety" },
          { id: 17, name: "Dust masks N95", cost: 12, essential: true, category: "safety" },
          { id: 18, name: "Emergency blankets", cost: 8, essential: true, category: "safety" },
          { id: 19, name: "Plastic sheeting & duct tape", cost: 10, essential: false, category: "safety" },
          { id: 20, name: "Portable generator", cost: 200, essential: false, category: "safety" }
        ]
      },
      tsunami: {
        title: "Tsunami Emergency Kit Builder",
        description: "Build a waterproof evacuation kit for coastal tsunami threats",
        water: [
          { id: 1, name: "Waterproof water bottles", cost: 20, days: 3, essential: true, category: "water" },
          { id: 2, name: "Water purification tablets", cost: 8, days: 30, essential: true, category: "water" },
          { id: 3, name: "Life Straw personal filter", cost: 15, days: 100, essential: true, category: "water" }
        ],
        food: [
          { id: 4, name: "Waterproof emergency food bars", cost: 25, days: 5, essential: true, category: "food" },
          { id: 5, name: "Sealed energy packets", cost: 12, days: 3, essential: true, category: "food" },
          { id: 6, name: "Waterproof matches", cost: 5, essential: true, category: "food" }
        ],
        tools: [
          { id: 7, name: "Waterproof flashlight", cost: 25, essential: true, category: "tools" },
          { id: 8, name: "Waterproof emergency radio", cost: 35, essential: true, category: "tools" },
          { id: 9, name: "Waterproof first aid kit", cost: 30, essential: true, category: "tools" },
          { id: 10, name: "Marine signal mirror", cost: 8, essential: true, category: "tools" },
          { id: 11, name: "Waterproof rope (50ft)", cost: 20, essential: true, category: "tools" },
          { id: 12, name: "Emergency flares", cost: 15, essential: false, category: "tools" }
        ],
        safety: [
          { id: 13, name: "Life jackets (family pack)", cost: 60, essential: true, category: "safety" },
          { id: 14, name: "Emergency whistle", cost: 3, essential: true, category: "safety" },
          { id: 15, name: "Waterproof document case", cost: 12, essential: true, category: "safety" },
          { id: 16, name: "Emergency cash", cost: 100, essential: false, category: "safety" },
          { id: 17, name: "Waterproof backpack", cost: 25, essential: true, category: "safety" },
          { id: 18, name: "Emergency contact list (laminated)", cost: 2, essential: true, category: "safety" },
          { id: 19, name: "Inflatable life raft", cost: 300, essential: false, category: "safety" },
          { id: 20, name: "Personal locator beacon", cost: 150, essential: false, category: "safety" }
        ]
      }
    };

    const selectedKit = kitSets[disasterType] || kitSets.general;

    const user = await User.findById(req.user._id);
    let gameProgress = user.gameProgress.find(gp => gp.gameType === 'kit');
    
    if (!gameProgress) {
      gameProgress = {
        gameType: 'kit',
        level: 1,
        score: 0,
        completedAt: new Date()
      };
      user.gameProgress.push(gameProgress);
    }
    
    await user.save();

    // Calculate recommendations based on disaster type
    const recommendations = {
      general: "Focus on the basic survival needs: water, food, shelter, and communication for 72 hours minimum.",
      earthquake: "Prioritize items for post-earthquake survival: gas shut-off tools, protective gear, and supplies for extended power outages.",
      tsunami: "Everything must be waterproof and portable. Focus on evacuation speed and water survival gear."
    };

    res.json({
      success: true,
      data: {
        gameType: "kit",
        disasterType,
        budget,
        familySize,
        kitData: selectedKit,
        gameId: `kit_${disasterType}_${Date.now()}`,
        objective: `Build the best ${disasterType} emergency kit within your $${budget} budget to keep your family of ${familySize} safe for at least 72 hours.`,
        userLevel: gameProgress.level,
        recommendation: recommendations[disasterType],
        tips: [
          "Essential items should be prioritized over optional ones",
          "Consider cost-effectiveness: days of survival per dollar spent",
          `For ${disasterType} disasters: ${recommendations[disasterType]}`,
          "Don't forget about special needs (babies, elderly, pets, medications)"
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Evaluate emergency kit choices
// @route   POST /api/games/kit/evaluate
// @access  Private
export const evaluateKit = async (req, res) => {
  try {
    const { gameId, selectedItems, totalCost, familySize } = req.body;

    let score = 0;
    let feedback = [];
    let essentialsCovered = 0;
    const essentialCategories = ['water', 'food', 'flashlight', 'first_aid', 'radio'];

    // Evaluate selected items
    const evaluation = {
      waterDays: 0,
      foodDays: 0,
      hasFlashlight: false,
      hasFirstAid: false,
      hasRadio: false,
      budgetEfficiency: 0
    };

    selectedItems.forEach(item => {
      if (item.essential) {
        score += 10;
        essentialsCovered++;
      }
      
      if (item.name.toLowerCase().includes('water')) {
        evaluation.waterDays += item.days || 0;
      }
      if (item.name.toLowerCase().includes('food') || item.name.toLowerCase().includes('meal')) {
        evaluation.foodDays += item.days || 0;
      }
      if (item.name.toLowerCase().includes('flashlight')) {
        evaluation.hasFlashlight = true;
      }
      if (item.name.toLowerCase().includes('first aid')) {
        evaluation.hasFirstAid = true;
      }
      if (item.name.toLowerCase().includes('radio')) {
        evaluation.hasRadio = true;
      }
    });

    // Calculate survival days
    const survivalDays = Math.min(evaluation.waterDays, evaluation.foodDays);
    
    // Scoring logic
    if (survivalDays >= 3) score += 20;
    else if (survivalDays >= 1) score += 10;
    
    if (evaluation.hasFlashlight) score += 10;
    if (evaluation.hasFirstAid) score += 10;
    if (evaluation.hasRadio) score += 10;
    
    // Budget efficiency
    const budgetUsed = (totalCost / 100) * 100;
    if (budgetUsed <= 100 && budgetUsed >= 80) score += 15; // Good budget usage
    else if (budgetUsed > 100) score -= 10; // Over budget penalty

    // Generate feedback
    if (survivalDays >= 3) {
      feedback.push("✅ Great! Your kit can sustain your family for 3+ days");
    } else {
      feedback.push("⚠️ Your kit may not last 72 hours - consider more water/food");
    }

    if (essentialsCovered >= 4) {
      feedback.push("✅ You covered most essential categories");
    } else {
      feedback.push("⚠️ You're missing some essential items");
    }

    if (totalCost <= 100) {
      feedback.push("✅ You stayed within budget");
    } else {
      feedback.push("❌ You went over budget");
    }

    // Update user progress
    const user = await User.findById(req.user._id);
    const gameProgress = user.gameProgress.find(gp => gp.gameType === 'kit');
    
    if (gameProgress) {
      gameProgress.score += score;
      user.totalScore += score;
      gameProgress.completedAt = new Date();
    }
    
    await user.save();

    res.json({
      success: true,
      data: {
        score,
        evaluation,
        survivalDays,
        feedback,
        grade: score >= 70 ? "A" : score >= 50 ? "B" : score >= 30 ? "C" : "D",
        totalScore: gameProgress?.score || 0,
        recommendations: [
          "Remember: 1 gallon of water per person per day",
          "Non-perishable food for at least 3 days",
          "Battery-powered or hand crank radio for emergency information",
          "Flashlight and extra batteries",
          "First aid kit and medications"
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's game statistics
// @route   GET /api/games/stats
// @access  Private
export const getGameStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const stats = {
      totalScore: user.totalScore,
      gamesPlayed: user.gameProgress.length,
      gameProgress: user.gameProgress,
      achievements: [],
      rank: "Beginner" // Can be calculated based on total score
    };

    // Calculate rank based on total score
    if (stats.totalScore >= 1000) stats.rank = "Expert";
    else if (stats.totalScore >= 500) stats.rank = "Advanced";
    else if (stats.totalScore >= 200) stats.rank = "Intermediate";

    // Calculate achievements
    const storyGames = user.gameProgress.filter(gp => gp.gameType === 'story');
    const scenarioGames = user.gameProgress.filter(gp => gp.gameType === 'scenario');
    const kitGames = user.gameProgress.filter(gp => gp.gameType === 'kit');

    if (storyGames.length >= 5) stats.achievements.push("Story Master");
    if (scenarioGames.length >= 3) stats.achievements.push("Scenario Expert");
    if (kitGames.length >= 1) stats.achievements.push("Kit Builder");
    if (stats.totalScore >= 100) stats.achievements.push("Century Club");

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};