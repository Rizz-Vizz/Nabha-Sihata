


const renderWellnessCircle = () => {
  const cycleDates = cycleDataEntered ? calculateCycleDates() : null;
  
  
  const handleReminderTimeUpdate = (type: string, value: string) => {
    const updatedTimes = { ...reminderTimes, [type]: value };
    setReminderTimes(updatedTimes);
    localStorage.setItem('reminderTimes', JSON.stringify(updatedTimes));
  };

  const handleReminderSave = () => {
    localStorage.setItem('reminderTimes', JSON.stringify(reminderTimes));
    toast.success(getTranslation('remindersSaved'));
  };
  
  return (
    <div className="space-y-6">
      {}
      <Card className="p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-500" />
          {getTranslation('fertilityTracking')}
        </h3>
        
        {cycleDates ? (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="font-medium text-gray-800">{getTranslation('fertilityWindow')}</h4>
              </div>
              <p className="font-bold text-green-600">
                {cycleDates.fertileStart} - {cycleDates.fertileEnd}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {cycleDates.daysSinceLastPeriod >= (cycleDates.cycleLength - 19) && 
                 cycleDates.daysSinceLastPeriod <= (cycleDates.cycleLength - 13) 
                  ? getTranslation('highFertility') 
                  : getTranslation('lowFertility')}
              </p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h4 className="font-medium text-gray-800">{getTranslation('ovulation')}</h4>
              </div>
              <p className="font-bold text-purple-600">{cycleDates.ovulationDate}</p>
              <p className="text-sm text-gray-600 mt-1">
                Expected ovulation
              </p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h4 className="font-medium text-gray-800">{getTranslation('nextPeriod')}</h4>
              </div>
              <p className="font-bold text-blue-600">{cycleDates.nextPeriodDate}</p>
              <p className="text-sm text-gray-600 mt-1">
                {cycleDates.daysUntilNext > 0 ? `${cycleDates.daysUntilNext} ${getTranslation('daysLeft')}` : 'Due now'}
              </p>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Please complete your cycle information in Track Your Cycle to see fertility data.
            </p>
            <Button 
              onClick={() => setActivePanel('track-cycle')}
              className="mt-4 bg-pink-500 hover:bg-pink-600"
            >
              Go to Track Your Cycle
            </Button>
          </div>
        )}
      </Card>

      {}
      <Card className="p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-500" />
          {getTranslation('setReminders')}
        </h3>
        
        <div className="space-y-4">
          {}
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💊</span>
                <h4 className="font-medium text-gray-800">{getTranslation('pillReminder')}</h4>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="time"
                value={reminderTimes.pill}
                onChange={(e) => handleReminderTimeUpdate('pill', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={getTranslation('enterTime')}
              />
              <span className="text-sm text-gray-600">
                {reminderTimes.pill || 'Not set'}
              </span>
            </div>
          </Card>

          {}
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏃‍♀️</span>
                <h4 className="font-medium text-gray-800">{getTranslation('gymReminder')}</h4>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="time"
                value={reminderTimes.exercise}
                onChange={(e) => handleReminderTimeUpdate('exercise', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={getTranslation('enterTime')}
              />
              <span className="text-sm text-gray-600">
                {reminderTimes.exercise || 'Not set'}
              </span>
            </div>
          </Card>

          {}
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💧</span>
                <h4 className="font-medium text-gray-800">{getTranslation('waterReminder')}</h4>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={reminderTimes.water}
                onChange={(e) => handleReminderTimeUpdate('water', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={getTranslation('enterFrequency')}
              />
              <span className="text-sm text-gray-600">
                {reminderTimes.water || 'Not set'}
              </span>
            </div>
          </Card>

          {}
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📅</span>
                <h4 className="font-medium text-gray-800">Period Prediction</h4>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="7"
                value={reminderTimes.period}
                onChange={(e) => handleReminderTimeUpdate('period', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-20"
                placeholder="3"
              />
              <span className="text-sm text-gray-600">{getTranslation('enterDaysBefore')}</span>
              <span className="text-sm text-gray-600">
                ({reminderTimes.period || '3'} days before)
              </span>
            </div>
          </Card>

          {}
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌸</span>
                <h4 className="font-medium text-gray-800">Ovulation Alert</h4>
              </div>
            </div>
            {cycleDates ? (
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={reminderTimes.ovulation}
                  onChange={(e) => handleReminderTimeUpdate('ovulation', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-20"
                  placeholder="1"
                />
                <span className="text-sm text-gray-600">{getTranslation('enterDaysBefore')}</span>
                <span className="text-sm text-gray-600">
                  (Alert on {cycleDates.ovulationDate})
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Complete cycle info to set ovulation alerts
              </p>
            )}
          </Card>
        </div>

        <Button
          onClick={handleReminderSave}
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
        >
          {getTranslation('saveReminders')}
        </Button>
      </Card>

      {}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 text-center hover:shadow-md transition-all cursor-pointer"
              onClick={() => setActivePanel('temp-tracker')}>
          <Thermometer className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <h4 className="font-medium text-gray-800 mb-2">{getTranslation('basalBodyTemp')}</h4>
          <p className="text-sm text-gray-600">{getTranslation('recordTemperature')}</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-all cursor-pointer"
              onClick={() => setActivePanel('mucus-tracker')}>
          <Droplets className="w-8 h-8 mx-auto mb-3 text-blue-500" />
          <h4 className="font-medium text-gray-800 mb-2">{getTranslation('cervicalMucus')}</h4>
          <p className="text-sm text-gray-600">{getTranslation('recordMucus')}</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-all cursor-pointer"
              onClick={() => setActivePanel('ovulation-calendar')}>
          <CalendarCheck className="w-8 h-8 mx-auto mb-3 text-purple-500" />
          <h4 className="font-medium text-gray-800 mb-2">{getTranslation('ovulationCalendar')}</h4>
          <p className="text-sm text-gray-600">View calendar</p>
        </Card>
      </div>
    </div>
  );
};