import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { 
  ArrowLeft, 
  Brain, 
  Trophy, 
  Clock, 
  Star, 
  Zap, 
  Target, 
  Gamepad2,
  CheckCircle,
  XCircle,
  RotateCcw,
  Award,
  TrendingUp,
  Puzzle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface IQGamesProps {
  onBack: () => void;
}

interface Game {
  id: string;
  name: string;
  nameHi: string;
  namePa: string;
  description: string;
  descriptionHi: string;
  descriptionPa: string;
  icon: React.ComponentType<{ className?: string }>;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'memory' | 'logic' | 'math' | 'pattern';
  estimatedTime: number; 
  medCoinsReward: number;
}

const games: Game[] = [
  {
    id: 'memory-cards',
    name: 'Memory Cards',
    nameHi: 'मेमोरी कार्ड',
    namePa: 'ਮੈਮੋਰੀ ਕਾਰਡ',
    description: 'Match pairs of cards to improve memory',
    descriptionHi: 'स्मृति सुधारने के लिए कार्डों के जोड़े मिलाएं',
    descriptionPa: 'ਯਾਦਦਾਸ਼ਤ ਸੁਧਾਰਨ ਲਈ ਕਾਰਡਾਂ ਦੇ ਜੋੜੇ ਮਿਲਾਓ',
    icon: Brain,
    difficulty: 'easy',
    category: 'memory',
    estimatedTime: 5,
    medCoinsReward: 10
  },
  {
    id: 'number-sequence',
    name: 'Number Sequence',
    nameHi: 'संख्या क्रम',
    namePa: 'ਸੰਖਿਆ ਕ੍ਰਮ',
    description: 'Find the missing number in sequence',
    descriptionHi: 'क्रम में लापता संख्या खोजें',
    descriptionPa: 'ਕ੍ਰਮ ਵਿੱਚ ਗੁੰਮ ਸੰਖਿਆ ਲੱਭੋ',
    icon: Target,
    difficulty: 'medium',
    category: 'math',
    estimatedTime: 3,
    medCoinsReward: 15
  },
  {
    id: 'pattern-match',
    name: 'Pattern Match',
    nameHi: 'पैटर्न मैच',
    namePa: 'ਪੈਟਰਨ ਮੈਚ',
    description: 'Identify and complete patterns',
    descriptionHi: 'पैटर्न की पहचान करें और पूरा करें',
    descriptionPa: 'ਪੈਟਰਨ ਦੀ ਪਛਾਣ ਕਰੋ ਅਤੇ ਪੂਰਾ ਕਰੋ',
    icon: Puzzle,
    difficulty: 'hard',
    category: 'pattern',
    estimatedTime: 7,
    medCoinsReward: 25
  },
  {
    id: 'logic-puzzle',
    name: 'Logic Puzzle',
    nameHi: 'तर्क पहेली',
    namePa: 'ਤਰਕ ਬੁਝਾਰਤ',
    description: 'Solve logical reasoning problems',
    descriptionHi: 'तार्किक तर्क समस्याओं को हल करें',
    descriptionPa: 'ਤਰਕਸ਼ੀਲ ਤਰਕ ਸਮੱਸਿਆਵਾਂ ਹੱਲ ਕਰੋ',
    icon: Zap,
    difficulty: 'medium',
    category: 'logic',
    estimatedTime: 6,
    medCoinsReward: 20
  }
];


const MemoryCardGame = ({ onComplete, language }: { onComplete: (score: number) => void; language: string }) => {
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const symbols = ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒'];

  useEffect(() => {
    
    const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    const initialCards = shuffledSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      flipped: false,
      matched: false
    }));
    setCards(initialCards);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete(score);
    }
  }, [timeLeft, score, onComplete]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (cards[cardId].flipped || cards[cardId].matched) return;

    const newCards = [...cards];
    newCards[cardId].flipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      setTimeout(() => {
        const [first, second] = newFlippedCards;
        const updatedCards = [...newCards];
        
        if (updatedCards[first].symbol === updatedCards[second].symbol) {
          updatedCards[first].matched = true;
          updatedCards[second].matched = true;
          setScore(score + 10);
          
          
          if (updatedCards.every(card => card.matched)) {
            onComplete(score + 10 + (timeLeft * 2)); 
          }
        } else {
          updatedCards[first].flipped = false;
          updatedCards[second].flipped = false;
        }
        
        setCards(updatedCards);
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span>{moves} {language === 'en' ? 'moves' : language === 'hi' ? 'चालें' : 'ਚਾਲਾਂ'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-red-500" />
          <span className="font-bold">{timeLeft}s</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`aspect-square rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 flex items-center justify-center text-2xl ${
              card.flipped || card.matched
                ? card.matched
                  ? 'bg-green-100 border-green-300'
                  : 'bg-blue-100 border-blue-300'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.flipped || card.matched ? card.symbol : '?'}
          </div>
        ))}
      </div>
    </div>
  );
};

export function IQGames({ onBack }: IQGamesProps) {
  const { t, language } = useLanguage();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [userStats, setUserStats] = useState({
    gamesPlayed: 12,
    totalScore: 1250,
    streak: 5,
    medCoinsEarned: 180
  });

  const getName = (game: Game) => {
    return language === 'hi' ? game.nameHi : language === 'pa' ? game.namePa : game.name;
  };

  const getDescription = (game: Game) => {
    return language === 'hi' ? game.descriptionHi : language === 'pa' ? game.descriptionPa : game.description;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'memory': return '🧠';
      case 'logic': return '🔍';
      case 'math': return '🔢';
      case 'pattern': return '🧩';
      default: return '🎮';
    }
  };

  const handleGameComplete = (score: number) => {
    setFinalScore(score);
    setGameCompleted(true);
    
    
    setUserStats(prev => ({
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + score,
      streak: prev.streak + 1,
      medCoinsEarned: prev.medCoinsEarned + (selectedGame?.medCoinsReward || 0)
    }));

    toast.success(
      `🎉 ${language === 'en' ? 'Game completed! Score:' : language === 'hi' ? 'खेल पूरा! स्कोर:' : 'ਖੇਡ ਪੂਰੀ! ਸਕੋਰ:'} ${score}`
    );
  };

  const resetGame = () => {
    setSelectedGame(null);
    setGameCompleted(false);
    setFinalScore(0);
  };

  
  if (gameCompleted && selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'en' ? 'Congratulations!' : language === 'hi' ? 'बधाई हो!' : 'ਵਧਾਈਆਂ!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {language === 'en' ? 'You completed' : language === 'hi' ? 'आपने पूरा किया' : 'ਤੁਸੀਂ ਪੂਰਾ ਕੀਤਾ'} {getName(selectedGame)}
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>{language === 'en' ? 'Score' : language === 'hi' ? 'स्कोर' : 'ਸਕੋਰ'}</span>
              </span>
              <span className="font-bold text-yellow-600">{finalScore}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="flex items-center space-x-2">
                <span>🪙</span>
                <span>Med Coins</span>
              </span>
              <span className="font-bold text-orange-600">+{selectedGame.medCoinsReward}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Play Again' : language === 'hi' ? 'फिर से खेलें' : 'ਫਿਰ ਖੇਡੋ'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={onBack}
              className="w-full"
            >
              {language === 'en' ? 'Back to Games' : language === 'hi' ? 'खेलों पर वापस' : 'ਖੇਡਾਂ ਤੇ ਵਾਪਸ'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  
  if (selectedGame && !gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={resetGame}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <selectedGame.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{getName(selectedGame)}</h1>
                <p className="text-sm text-gray-600">{getDescription(selectedGame)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <Card className="p-6">
            {selectedGame.id === 'memory-cards' && (
              <MemoryCardGame onComplete={handleGameComplete} language={language} />
            )}
            
            {selectedGame.id !== 'memory-cards' && (
              <div className="text-center py-12">
                <selectedGame.icon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
                  {language === 'en' ? 'This game is coming soon!' : language === 'hi' ? 'यह खेल जल्द आ रहा है!' : 'ਇਹ ਖੇਡ ਜਲਦੀ ਆ ਰਹੀ ਹੈ!'}
                </p>
                <Button onClick={resetGame} variant="outline">
                  {language === 'en' ? 'Back to Games' : language === 'hi' ? 'खेलों पर वापस' : 'ਖੇਡਾਂ ਤੇ ਵਾਪਸ'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {language === 'en' ? 'IQ Games' : language === 'hi' ? 'IQ खेल' : 'IQ ਖੇਡਾਂ'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Exercise your brain with fun games' : language === 'hi' ? 'मजेदार खेलों के साथ अपने दिमाग का व्यायाम करें' : 'ਮਜ਼ੇਦਾਰ ਖੇਡਾਂ ਨਾਲ ਆਪਣੇ ਦਿਮਾਗ ਦਾ ਕਸਰਤ ਕਰੋ'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {}
        <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {language === 'en' ? 'Your Progress' : language === 'hi' ? 'आपकी प्रगति' : 'ਤੁਹਾਡੀ ਤਰੱਕੀ'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.gamesPlayed}</div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Games Played' : language === 'hi' ? 'खेल खेले गए' : 'ਖੇਡੀਆਂ ਗਈਆਂ ਖੇਡਾਂ'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.totalScore}</div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Total Score' : language === 'hi' ? 'कुल स्कोर' : 'ਕੁੱਲ ਸਕੋਰ'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Win Streak' : language === 'hi' ? 'जीत की लकीर' : 'ਜਿੱਤ ਦੀ ਲਕੀਰ'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.medCoinsEarned}</div>
              <div className="text-sm text-gray-600">Med Coins</div>
            </div>
          </div>
        </Card>

        {}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setSelectedGame(game)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <game.icon className="w-6 h-6 text-white" />
                </div>
                <Badge className={`${getDifficultyColor(game.difficulty)} border`}>
                  {language === 'en' 
                    ? game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)
                    : language === 'hi'
                    ? game.difficulty === 'easy' ? 'आसान' : game.difficulty === 'medium' ? 'मध्यम' : 'कठिन'
                    : game.difficulty === 'easy' ? 'ਆਸਾਨ' : game.difficulty === 'medium' ? 'ਮੱਧਮ' : 'ਮੁਸ਼ਕਿਲ'
                  }
                </Badge>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{getName(game)}</h3>
                <p className="text-gray-600 text-sm mb-3">{getDescription(game)}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <span>{getCategoryIcon(game.category)}</span>
                    <span className="capitalize">{game.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{game.estimatedTime} min</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-orange-600">
                  <span>🪙</span>
                  <span className="font-medium">+{game.medCoinsReward}</span>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  <Gamepad2 className="w-4 h-4 mr-1" />
                  {language === 'en' ? 'Play' : language === 'hi' ? 'खेलें' : 'ਖੇਡੋ'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {}
        <Card className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            {language === 'en' ? 'Why Play IQ Games?' : language === 'hi' ? 'IQ गेम्स क्यों खेलें?' : 'IQ ਗੇਮਜ਼ ਕਿਉਂ ਖੇਡੋ?'}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">
                {language === 'en' ? 'Improve Memory' : language === 'hi' ? 'स्मृति सुधारें' : 'ਯਾਦਦਾਸ਼ਤ ਸੁਧਾਰੋ'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Regular brain exercise helps maintain cognitive health'
                  : language === 'hi'
                  ? 'नियमित मानसिक व्यायाम संज्ञानात्मक स्वास्थ्य बनाए रखने में मदद करता है'
                  : 'ਨਿਯਮਤ ਮਾਨਸਿਕ ਕਸਰਤ ਬੋਧਾਤਮਕ ਸਿਹਤ ਬਣਾਈ ਰੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">
                {language === 'en' ? 'Mental Agility' : language === 'hi' ? 'मानसिक चपलता' : 'ਮਾਨਸਿਕ ਚੁਸਤੀ'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Enhance problem-solving and critical thinking skills'
                  : language === 'hi'
                  ? 'समस्या समाधान और आलोचनात्मक सोच कौशल बढ़ाएं'
                  : 'ਸਮੱਸਿਆ-ਹੱਲ ਅਤੇ ਆਲੋਚਨਾਤਮਕ ਸੋਚ ਦੇ ਹੁਨਰ ਵਧਾਓ'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">
                {language === 'en' ? 'Earn Rewards' : language === 'hi' ? 'पुरस्कार जीतें' : 'ਇਨਾਮ ਜਿੱਤੋ'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Get Med Coins for playing games and achieving high scores'
                  : language === 'hi'
                  ? 'खेल खेलने और उच्च स्कोर प्राप्त करने के लिए मेड कॉइन प्राप्त करें'
                  : 'ਖੇਡਾਂ ܸਲਣ ਅਤੇ ਉੱਚ ਸਕੋਰ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਮੇਡ ਕਾਇਨ ਪ੍ਰਾਪਤ ਕਰੋ'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}