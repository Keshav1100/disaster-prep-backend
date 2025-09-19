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
        scenario: "You're at school when suddenly the ground starts shaking. The earthquake alarm goes off!",
        choices: [
          {
            id: 1,
            text: "Duck under your desk immediately",
            points: 10,
            outcome: "Great choice! You followed the 'Drop, Cover, and Hold On' rule."
          },
          {
            id: 2,
            text: "Run outside quickly",
            points: -5,
            outcome: "Be careful! Running during shaking can be dangerous. Stay under cover first."
          },
          {
            id: 3,
            text: "Stand in the doorway",
            points: 5,
            outcome: "Doorways aren't as safe as we once thought. Under a sturdy desk is better!"
          }
        ],
        nextScenario: "The shaking has stopped. What do you do next?",
        tips: [
          "Always Drop, Cover, and Hold On during an earthquake",
          "Stay away from windows and heavy objects that might fall",
          "Count to 60 after shaking stops before moving"
        ]
      },
      flood: {
        title: "Rising Waters: A Flood Survival Story",
        scenario: "Heavy rains have been falling for days. You notice water rising in your neighborhood.",
        choices: [
          {
            id: 1,
            text: "Move to higher ground immediately",
            points: 10,
            outcome: "Excellent! Higher ground is always safer during floods."
          },
          {
            id: 2,
            text: "Wait to see if water gets higher",
            points: -5,
            outcome: "Waiting can be dangerous. It's better to move early when you have time."
          },
          {
            id: 3,
            text: "Try to drive through the water",
            points: -10,
            outcome: "Never drive through flood water! Just 6 inches can carry away a car."
          }
        ],
        nextScenario: "You're now on higher ground. How do you stay safe?",
        tips: [
          "Turn Around, Don't Drown - avoid walking/driving in flood water",
          "Stay on higher ground until authorities say it's safe",
          "Have an emergency kit ready with water, food, and flashlight"
        ]
      },
      fire: {
        title: "Flames and Safety: A Fire Emergency",
        scenario: "You smell smoke in your house and hear the fire alarm beeping loudly.",
        choices: [
          {
            id: 1,
            text: "Get low and crawl to the exit",
            points: 10,
            outcome: "Perfect! Smoke rises, so staying low helps you breathe cleaner air."
          },
          {
            id: 2,
            text: "Stand up and run to the exit",
            points: 5,
            outcome: "Quick thinking, but remember to stay low to avoid inhaling smoke."
          },
          {
            id: 3,
            text: "Look for the source of fire first",
            points: -8,
            outcome: "Your safety is most important! Get out first, then call for help."
          }
        ],
        nextScenario: "You're outside safely. What should you do now?",
        tips: [
          "Get out fast and stay out - don't go back for belongings",
          "Crawl low under smoke to breathe cleaner air",
          "Have a family meeting place outside your home"
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
          { id: 2, name: "Batteries", category: "essential", points: 8 },
          { id: 3, name: "Water bottles", category: "essential", points: 10 },
          { id: 4, name: "First aid kit", category: "essential", points: 9 },
          { id: 5, name: "Non-perishable food", category: "essential", points: 8 },
          { id: 6, name: "Candy bars", category: "optional", points: 2 },
          { id: 7, name: "Gaming console", category: "incorrect", points: -5 },
          { id: 8, name: "Whistle", category: "essential", points: 7 },
          { id: 9, name: "Cash", category: "useful", points: 5 },
          { id: 10, name: "Important documents", category: "essential", points: 8 }
        ],
        targetItems: 6,
        timeLimit: 300, // 5 minutes
        difficulty: "medium"
      },
      flood: {
        title: "Flood Safety Actions",
        description: "Choose the right actions to take when flood warning is issued",
        availableItems: [
          { id: 1, name: "Move to higher ground", category: "essential", points: 10 },
          { id: 2, name: "Fill bathtub with water", category: "essential", points: 8 },
          { id: 3, name: "Charge electronic devices", category: "useful", points: 6 },
          { id: 4, name: "Drive through flooded road", category: "incorrect", points: -10 },
          { id: 5, name: "Turn off utilities", category: "essential", points: 9 },
          { id: 6, name: "Pack emergency bag", category: "essential", points: 8 },
          { id: 7, name: "Stay near windows", category: "incorrect", points: -5 },
          { id: 8, name: "Monitor weather alerts", category: "essential", points: 7 }
        ],
        targetItems: 5,
        timeLimit: 240,
        difficulty: "medium"
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
    const { budget = 100, familySize = 4 } = req.body;

    // Stub implementation for kit building
    const kitItems = {
      water: [
        { id: 1, name: "Water bottles (24-pack)", cost: 15, days: 3, essential: true },
        { id: 2, name: "Water purification tablets", cost: 8, days: 30, essential: true },
        { id: 3, name: "Portable water filter", cost: 25, days: 365, essential: false }
      ],
      food: [
        { id: 4, name: "Canned food (variety pack)", cost: 20, days: 7, essential: true },
        { id: 5, name: "Energy bars (12-pack)", cost: 12, days: 3, essential: true },
        { id: 6, name: "MREs (Meals Ready to Eat)", cost: 35, days: 5, essential: false },
        { id: 7, name: "Dried fruits and nuts", cost: 10, days: 2, essential: false }
      ],
      tools: [
        { id: 8, name: "Flashlight", cost: 15, essential: true },
        { id: 9, name: "Battery-powered radio", cost: 20, essential: true },
        { id: 10, name: "First aid kit", cost: 25, essential: true },
        { id: 11, name: "Multi-tool", cost: 18, essential: false },
        { id: 12, name: "Duct tape", cost: 5, essential: false }
      ],
      safety: [
        { id: 13, name: "Emergency blankets", cost: 8, essential: true },
        { id: 14, name: "Whistle", cost: 3, essential: true },
        { id: 15, name: "Fire extinguisher", cost: 30, essential: false },
        { id: 16, name: "Smoke detector", cost: 12, essential: false }
      ]
    };

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

    res.json({
      success: true,
      data: {
        gameType: "kit",
        budget,
        familySize,
        items: kitItems,
        gameId: `kit_${Date.now()}`,
        objective: "Build the best emergency kit within your budget to keep your family safe for at least 72 hours.",
        userLevel: gameProgress.level,
        tips: [
          "Focus on essential items first",
          "Consider cost per day of survival",
          "Don't forget water - you need 1 gallon per person per day"
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