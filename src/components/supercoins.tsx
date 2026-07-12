

export {};
  const { t, language } = useLanguage();
  const [balance, setBalance] = useState(150);
  const [streak, setStreak] = useState(7);
  const [totalEarned, setTotalEarned] = useState(425);

  
  const rewards: Reward[] = [
    {
      id: '1',
      title: language === 'en' ? 'Free Health Checkup' : language === 'hi' ? 'मुफ्त स्वास्थ्य जांच' : 'ਮੁਫਤ ਸਿਹਤ ਜਾਂਚ',
      description: language === 'en' ? 'Complete health checkup at partner clinic' : language === 'hi' ? 'साझीदार क्लिनिक में पूर्ण स्वास्थ्य जांच' : 'ਸਾਝੀਦਾਰ ਕਲੀਨਿਕ ਵਿੱਚ ਪੂਰੀ ਸਿਹਤ ਜਾਂਚ',
      cost: 200,
      unlocked: false,
      claimed: false,
      icon: '🏥',
      category: 'health'
    },
    {
      id: '2',
      title: language === 'en' ? 'Medicine Discount' : language === 'hi' ? 'दवा पर छूट' : 'ਦਵਾਈ ਤੇ ਛੋਟ',
      description: language === 'en' ? '25% off on all medicines' : language === 'hi' ? 'सभी दवाओं पर 25% छूट' : 'ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਤੇ 25% ਛੋਟ',
      cost: 100,
      unlocked: true,
      claimed: false,
      icon: '💊',
      category: 'discount'
    },
    {
      id: '3',
      title: language === 'en' ? 'Priority Consultation' : language === 'hi' ? 'प्राथमिकता परामर्श' : 'ਪਹਿਲ ਸਲਾਹ',
      description: language === 'en' ? 'Skip waiting queue for doctor calls' : language === 'hi' ? 'डॉक्टर कॉल के लिए प्रतीक्षा कतार छोड़ें' : 'ਡਾਕਟਰ ਕਾਲ ਲਈ ਇੰਤਜ਼ਾਰ ਕਤਾਰ ਛੱਡੋ',
      cost: 75,
      unlocked: true,
      claimed: true,
      icon: '⚡',
      category: 'premium'
    },
    {
      id: '4',
      title: language === 'en' ? 'Health Insurance Info' : language === 'hi' ? 'स्वास्थ्य बीमा जानकारी' : 'ਸਿਹਤ ਬੀਮਾ ਜਾਣਕਾਰੀ',
      description: language === 'en' ? 'Free consultation about government health schemes' : language === 'hi' ? 'सरकारी स्वास्थ्य योजनाओं के बारे में मुफ्त सलाह' : 'ਸਰਕਾਰੀ ਸਿਹਤ ਯੋਜਨਾਵਾਂ ਬਾਰੇ ਮੁਫਤ ਸਲਾਹ',
      cost: 50,
      unlocked: true,
      claimed: false,
      icon: '🛡️',
      category: 'health'
    },
    {
      id: '5',
      title: language === 'en' ? 'Family Plan Access' : language === 'hi' ? 'पारिवारिक योजना पहुंच' : 'ਪਰਿਵਾਰਕ ਯੋਜਨਾ ਪਹੁੰਚ',
      description: language === 'en' ? 'Add up to 6 family members' : language === 'hi' ? '6 परिवारी सदस्यों तक जोड़ें' : '6 ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਤੱਕ ਜੋੜੋ',
      cost: 300,
      unlocked: false,
      claimed: false,
      icon: '👨‍👩‍👧‍👦',
      category: 'premium'
    },
    {
      id: '6',
      title: language === 'en' ? 'Community Badge' : language === 'hi' ? 'समुदायिक बैज' : 'ਕਮਿਊਨਿਟੀ ਬੈਜ',
      description: language === 'en' ? 'Special recognition in community health' : language === 'hi' ? 'सामुदायिक स्वास्थ्य में विशेष पहचान' : 'ਕਮਿਊਨਿਟੀ ਸਿਹਤ ਵਿੱਚ ਵਿਸ਼ੇਸ ਪਛਾਣ',
      cost: 150,
      unlocked: true,
      claimed: false,
      icon: '🏆',
      category: 'community'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-green-100 text-green-700 border-green-200';
      case 'discount': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'community': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStreakMessage = () => {
    if (language === 'hi') {
      return streak >= 7 ? `बहुत बढ़िया! ${streak} दिनों की लगातार स्वास्थ्य गतिविधि` : `${streak} दिनों की लगातार गतिविधि जारी रखें!`;
    } else if (language === 'pa') {
      return streak >= 7 ? `ਬਹੁਤ ਵਧੀਆ! ${streak} ਦਿਨਾਂ ਦੀ ਲਗਾਤਾਰ ਸਿਹਤ ਗਤੀਵਿਧੀ` : `${streak} ਦਿਨਾਂ ਦੀ ਲਗਾਤਾਰ ਗਤੀਵਿਧੀ ਜਾਰੀ ਰੱਖੋ!`;
    }
    return streak >= 7 ? `Excellent! ${streak} days of consistent health activity` : `Keep up your ${streak}-day streak!`;
  };

  const claimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && reward.unlocked && !reward.claimed && balance >= reward.cost) {
      setBalance(prev => prev - reward.cost);
      
      reward.claimed = true;
      alert(language === 'en' ? `Reward "${reward.title}" claimed successfully!` : 
            language === 'hi' ? `पुरस्कार "${reward.title}" सफलतापूर्वक दावा किया गया!` :
            `ਇਨਾਮ "${reward.title}" ਸਫਲਤਾਪੂਰਵਕ ਦਾਅਵਾ ਕੀਤਾ ਗਿਆ!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {language === 'en' ? 'Supercoins' : language === 'hi' ? 'सुपरकॉइन्स' : 'ਸੁਪਰਕੋਇਨਸ'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {}
        <Card className="p-8 text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold">C</span>
            </div>
            <div>
              <div className="text-4xl font-bold">{balance}</div>
              <div className="text-lg opacity-90">
                {language === 'en' ? 'Supercoins' : language === 'hi' ? 'सुपरकॉइन्स' : 'ਸੁਪਰਕੋਇਨਸ'}
              </div>
            </div>
          </div>
          <div className="text-sm opacity-80">
            {language === 'en' ? `Total Earned: ${totalEarned}` : 
             language === 'hi' ? `कुल अर्जित: ${totalEarned}` :
             `ਕੁੱਲ ਕਮਾਏ: ${totalEarned}`}
          </div>
        </Card>

        {}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <span>
                {language === 'en' ? 'Activity Streak' : language === 'hi' ? 'गतिविधि स्ट्रीक' : 'ਗਤੀਵਿਧੀ ਸਟ੍ਰੀਕ'}
              </span>
            </h3>
            <Badge className="bg-orange-100 text-orange-700">
              {streak} {language === 'en' ? 'days' : language === 'hi' ? 'दिन' : 'ਦਿਨ'}
            </Badge>
          </div>
          
          <p className="text-gray-600 mb-4">{getStreakMessage()}</p>
          
          {}
          <div className="flex space-x-2 mb-4">
            {[...Array(14)].map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full ${
                  index < streak ? 'bg-orange-500' : 'bg-gray-200'
                }`}
                title={`Day ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-green-800 font-medium">
                {language === 'en' ? 'Keep it up!' : language === 'hi' ? 'इसे जारी रखें!' : 'ਇਸਨੂੰ ਜਾਰੀ ਰੱਖੋ!'}
              </span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              {language === 'en' ? 'Complete daily health activities to earn more Supercoins' : 
               language === 'hi' ? 'अधिक सुपरकॉइन्स कमाने के लिए दैनिक स्वास्थ्य गतिविधियां पूरी करें' :
               'ਹੋਰ ਸੁਪਰਕੋਇਨਸ ਕਮਾਉਣ ਲਈ ਰੋਜ਼ਾਨਾ ਸਿਹਤ ਗਤੀਵਿਧੀਆਂ ਪੂਰੀਆਂ ਕਰੋ'}
            </p>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Gift className="w-5 h-5 text-purple-500" />
            <span>
              {language === 'en' ? 'Available Rewards' : language === 'hi' ? 'उपलब्ध पुरस्कार' : 'ਉਪਲਬਧ ਇਨਾਮ'}
            </span>
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <Card 
                key={reward.id} 
                className={`p-4 border-2 transition-all ${
                  reward.claimed ? 'bg-gray-50 border-gray-200' :
                  reward.unlocked ? 'border-green-200 hover:border-green-300' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{reward.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{reward.title}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(reward.category)}>
                    {reward.category.charAt(0).toUpperCase() + reward.category.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">C</span>
                    </div>
                    <span className="font-bold text-gray-800">{reward.cost}</span>
                  </div>

                  {reward.claimed ? (
                    <Badge className="bg-gray-100 text-gray-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {language === 'en' ? 'Claimed' : language === 'hi' ? 'दावा किया गया' : 'ਦਾਅਵਾ ਕੀਤਾ ਗਿਆ'}
                    </Badge>
                  ) : reward.unlocked ? (
                    <Button 
                      size="sm"
                      onClick={() => claimReward(reward.id)}
                      disabled={balance < reward.cost}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                    >
                      {language === 'en' ? 'Claim' : language === 'hi' ? 'दावा करें' : 'ਦਾਅਵਾ ਕਰੋ'}
                    </Button>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-600">
                      <Lock className="w-3 h-3 mr-1" />
                      {language === 'en' ? 'Locked' : language === 'hi' ? 'बंद' : 'ਬੰਦ'}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>
              {language === 'en' ? 'How to Earn Supercoins' : language === 'hi' ? 'सुपरकॉइन्स कैसे कमाएं' : 'ਸੁਪਰਕੋਇਨਸ ਕਿਵੇਂ ਕਮਾਓ'}
            </span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">📱</span>
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {language === 'en' ? 'Daily App Login' : language === 'hi' ? 'दैनिक ऐप लॉगिन' : 'ਰੋਜ਼ਾਨਾ ਐਪ ਲਾਗਇਨ'}
                </div>
                <div className="text-sm text-gray-600">+5 {language === 'en' ? 'coins' : language === 'hi' ? 'कॉइन्स' : 'ਕੋਇਨਸ'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">👨‍⚕️</span>
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {language === 'en' ? 'Doctor Consultation' : language === 'hi' ? 'डॉक्टर परामर्श' : 'ਡਾਕਟਰ ਸਲਾਹ'}
                </div>
                <div className="text-sm text-gray-600">+15 {language === 'en' ? 'coins' : language === 'hi' ? 'कॉइन्स' : 'ਕੋਇਨਸ'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">🤖</span>
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {language === 'en' ? 'AI Health Check' : language === 'hi' ? 'एआई स्वास्थ्य जांच' : 'ਏਆਈ ਸਿਹਤ ਜਾਂਚ'}
                </div>
                <div className="text-sm text-gray-600">+10 {language === 'en' ? 'coins' : language === 'hi' ? 'कॉइन्स' : 'ਕੋਇਨਸ'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">📋</span>
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {language === 'en' ? 'Complete Health Survey' : language === 'hi' ? 'स्वास्थ्य सर्वेक्षण पूरा करें' : 'ਸਿਹਤ ਸਰਵੇ ਪੂਰਾ ਕਰੋ'}
                </div>
                <div className="text-sm text-gray-600">+20 {language === 'en' ? 'coins' : language === 'hi' ? 'कॉइन्स' : 'ਕੋਇਨਸ'}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}