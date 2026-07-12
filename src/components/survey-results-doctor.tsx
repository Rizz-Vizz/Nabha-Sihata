import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { useDemo } from './demo-context';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Camera,
  Filter,
  Search,
  Download,
  Bell,
  Activity,
  Droplets,
  Trash2,
  Bug,
  Thermometer
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SurveyResponse {
  id: string;
  patientName: string;
  patientId: string;
  location: string;
  submissionDate: string;
  wasteDisposal: 'yes' | 'no';
  stagnantWater: 'yes' | 'no';
  sanitationFrequency: 'daily' | 'weekly' | 'rarely' | 'never';
  pestInfestation: 'yes' | 'no';
  diseaseReports: 'yes' | 'no';
  diseaseDetails?: string;
  additionalComments?: string;
  photos?: string[];
  riskScore: number;
  priority: 'low' | 'medium' | 'high';
}

interface SurveyResultsDoctorProps {
  onBack: () => void;
}

export function SurveyResultsDoctor({ onBack }: SurveyResultsDoctorProps) {
  const { isDemoMode } = useDemo();
  const [selectedView, setSelectedView] = useState<'all' | 'high-risk' | 'recent'>('all');
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyResponse | null>(null);
  const [filterLocation, setFilterLocation] = useState('');

  // Load surveys from localStorage for demo mode, fallback to static data
  const [surveys, setSurveys] = useState<SurveyResponse[]>(() => {
    if (isDemoMode) {
      // Load demo surveys from localStorage
      const demoSurveys = JSON.parse(localStorage.getItem('demoSurveys') || '[]');
      
      
      const staticSurveys = [
        {
          id: 'static-1',
          patientName: 'Simran Kaur',
          patientId: 'demo-wife',
          location: '30.7520, 76.7830',
          submissionDate: '2024-01-14T14:20:00Z',
          wasteDisposal: 'yes' as const,
          stagnantWater: 'no' as const,
          sanitationFrequency: 'weekly' as const,
          pestInfestation: 'no' as const,
          diseaseReports: 'no' as const,
          additionalComments: 'Area is generally clean but sanitation could be more frequent.',
          photos: [],
          riskScore: 35,
          priority: 'low' as const
        },
        {
          id: 'static-2',
          patientName: 'Arjun Singh',
          patientId: 'demo-child',
          location: '30.7525, 76.7835',
          submissionDate: '2024-01-12T09:15:00Z',
          wasteDisposal: 'no' as const,
          stagnantWater: 'yes' as const,
          sanitationFrequency: 'never' as const,
          pestInfestation: 'yes' as const,
          diseaseReports: 'no' as const,
          additionalComments: 'Garbage pile near school. Children complaining of bad smell.',
          photos: [],
          riskScore: 70,
          priority: 'high' as const
        }
      ];
      
      return [...demoSurveys, ...staticSurveys];
    } else {
      
      return [
        {
          id: '1',
          patientName: 'Rajinder Singh',
          patientId: '1',
          location: '30.7514, 76.7826', 
          submissionDate: '2024-01-15T10:30:00Z',
          wasteDisposal: 'no' as const,
          stagnantWater: 'yes' as const,
          sanitationFrequency: 'rarely' as const,
          pestInfestation: 'yes' as const,
          diseaseReports: 'yes' as const,
          diseaseDetails: 'Two cases of dengue fever reported in neighborhood last week. Families affected have been advised to seek medical attention.',
          additionalComments: 'Water logging near the community well. Mosquito breeding suspected.',
          photos: [],
          riskScore: 85,
          priority: 'high' as const
        },
        {
          id: '2',
          patientName: 'Simran Kaur',
          patientId: '2',
          location: '30.7520, 76.7830',
          submissionDate: '2024-01-14T14:20:00Z',
          wasteDisposal: 'yes' as const,
          stagnantWater: 'no' as const,
          sanitationFrequency: 'weekly' as const,
          pestInfestation: 'no' as const,
          diseaseReports: 'no' as const,
          additionalComments: 'Area is generally clean but sanitation could be more frequent.',
          photos: [],
          riskScore: 35,
          priority: 'low' as const
        },
        {
          id: '3',
          patientName: 'Arjun Singh',
          patientId: '3',
          location: '30.7525, 76.7835',
          submissionDate: '2024-01-12T09:15:00Z',
          wasteDisposal: 'no' as const,
          stagnantWater: 'yes' as const,
          sanitationFrequency: 'never' as const,
          pestInfestation: 'yes' as const,
          diseaseReports: 'no' as const,
          additionalComments: 'Garbage pile near school. Children complaining of bad smell.',
          photos: [],
          riskScore: 70,
          priority: 'high' as const
        },
        {
          id: '4',
          patientName: 'Gurpreet Kaur',
          patientId: '4',
          location: '30.7518, 76.7822',
          submissionDate: '2024-01-10T16:45:00Z',
          wasteDisposal: 'yes' as const,
          stagnantWater: 'no' as const,
          sanitationFrequency: 'daily' as const,
          pestInfestation: 'no' as const,
          diseaseReports: 'no' as const,
          additionalComments: 'Well maintained area, no major concerns.',
          photos: [],
          riskScore: 20,
          priority: 'low' as const
        }
      ];
    }
  });
  
  
  React.useEffect(() => {
    if (isDemoMode) {
      const interval = setInterval(() => {
        const demoSurveys = JSON.parse(localStorage.getItem('demoSurveys') || '[]');
        const staticSurveys = surveys.filter(s => s.id.startsWith('static-'));
        setSurveys([...demoSurveys, ...staticSurveys]);
      }, 2000); 
      
      return () => clearInterval(interval);
    }
  }, [isDemoMode]);

  const filteredSurveys = surveys.filter(survey => {
    if (selectedView === 'high-risk' && survey.priority !== 'high') return false;
    if (selectedView === 'recent') {
      const submissionDate = new Date(survey.submissionDate);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      if (submissionDate < threeDaysAgo) return false;
    }
    if (filterLocation && !survey.patientName.toLowerCase().includes(filterLocation.toLowerCase())) return false;
    return true;
  });

  const getRiskColor = (riskScore: number, priority: string) => {
    if (priority === 'high' || riskScore >= 70) return 'text-red-600 bg-red-50 border-red-200';
    if (priority === 'medium' || riskScore >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getRiskIcon = (riskScore: number) => {
    if (riskScore >= 70) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (riskScore >= 40) return <Activity className="w-5 h-5 text-orange-500" />;
    return <Activity className="w-5 h-5 text-green-500" />;
  };

  const getResponseIcon = (question: string, answer: string) => {
    switch (question) {
      case 'waste':
        return answer === 'yes' ? '✅' : '❌';
      case 'water':
        return answer === 'yes' ? '💧' : '🚫';
      case 'pest':
        return answer === 'yes' ? '🐀' : '🚫';
      case 'disease':
        return answer === 'yes' ? '🦠' : '✅';
      case 'sanitation':
        switch (answer) {
          case 'daily': return '🟢';
          case 'weekly': return '🟡';
          case 'rarely': return '🟠';
          case 'never': return '🔴';
          default: return '❓';
        }
      default:
        return '📋';
    }
  };

  const generateHealthAlert = (survey: SurveyResponse) => {
    const alertMessage = `Health Alert for ${survey.patientName}: High environmental risk detected (${survey.riskScore}%). Immediate attention needed in area ${survey.location}.`;
    
    toast.success('Health alert generated and sent to relevant authorities');
    console.log('Health Alert Generated:', alertMessage);
  };

  const exportSurveyData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Patient Name,Location,Date,Waste Disposal,Stagnant Water,Sanitation Freq,Pest Infestation,Disease Reports,Risk Score,Priority\n"
      + surveys.map(s => 
          `${s.patientName},${s.location},${s.submissionDate},${s.wasteDisposal},${s.stagnantWater},${s.sanitationFrequency},${s.pestInfestation},${s.diseaseReports},${s.riskScore},${s.priority}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "environmental_health_surveys.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Survey data exported successfully');
  };

  const summary = {
    totalSurveys: surveys.length,
    highRiskAreas: surveys.filter(s => s.priority === 'high').length,
    recentSubmissions: surveys.filter(s => {
      const submissionDate = new Date(s.submissionDate);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return submissionDate >= threeDaysAgo;
    }).length,
    averageRiskScore: Math.round(surveys.reduce((acc, s) => acc + s.riskScore, 0) / surveys.length)
  };

  if (selectedSurvey) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedSurvey(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Survey Details</h1>
              <p className="text-gray-600">Environmental health survey by {selectedSurvey.patientName}</p>
            </div>
          </div>
          {selectedSurvey.priority === 'high' && (
            <Button onClick={() => generateHealthAlert(selectedSurvey)} className="bg-red-600 hover:bg-red-700">
              <Bell className="w-4 h-4 mr-2" />
              Generate Health Alert
            </Button>
          )}
        </div>

        {}
        <div className="max-w-4xl mx-auto space-y-6">
          {}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Patient Information</h3>
                <p className="text-lg font-medium">{selectedSurvey.patientName}</p>
                <p className="text-sm text-gray-600">Patient ID: {selectedSurvey.patientId}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <p className="text-sm">{selectedSurvey.location}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Submission</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <p className="text-sm">{new Date(selectedSurvey.submissionDate).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>

          {}
          <Card className={`p-6 border-2 ${getRiskColor(selectedSurvey.riskScore, selectedSurvey.priority)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getRiskIcon(selectedSurvey.riskScore)}
                <div>
                  <h3 className="text-xl font-bold">Risk Score: {selectedSurvey.riskScore}%</h3>
                  <p className="capitalize text-sm font-medium">Priority: {selectedSurvey.priority}</p>
                </div>
              </div>
              <Badge variant={selectedSurvey.priority === 'high' ? 'destructive' : selectedSurvey.priority === 'medium' ? 'secondary' : 'default'}>
                {selectedSurvey.priority.toUpperCase()} RISK
              </Badge>
            </div>
          </Card>

          {}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Survey Responses</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Proper waste disposal nearby</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getResponseIcon('waste', selectedSurvey.wasteDisposal)}</span>
                    <span className="capitalize font-medium">{selectedSurvey.wasteDisposal}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Stagnant water sources around</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getResponseIcon('water', selectedSurvey.stagnantWater)}</span>
                    <span className="capitalize font-medium">{selectedSurvey.stagnantWater}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Local sanitation frequency</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getResponseIcon('sanitation', selectedSurvey.sanitationFrequency)}</span>
                    <span className="capitalize font-medium">{selectedSurvey.sanitationFrequency}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Pest or rodent infestations</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getResponseIcon('pest', selectedSurvey.pestInfestation)}</span>
                    <span className="capitalize font-medium">{selectedSurvey.pestInfestation}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg md:col-span-2">
                  <span>Recent disease cases in locality</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getResponseIcon('disease', selectedSurvey.diseaseReports)}</span>
                    <span className="capitalize font-medium">{selectedSurvey.diseaseReports}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {}
          {selectedSurvey.diseaseReports === 'yes' && selectedSurvey.diseaseDetails && (
            <Card className="p-6 border-orange-200 bg-orange-50">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-orange-600" />
                Disease Case Details
              </h3>
              <p className="text-gray-700">{selectedSurvey.diseaseDetails}</p>
            </Card>
          )}

          {}
          {selectedSurvey.additionalComments && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Additional Comments</h3>
              <p className="text-gray-700">{selectedSurvey.additionalComments}</p>
            </Card>
          )}

          {}
          {selectedSurvey.photos && selectedSurvey.photos.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Submitted Photos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedSurvey.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Survey photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {}
          <Card className="p-6">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
              {selectedSurvey.priority === 'high' && (
                <Button className="bg-red-600 hover:bg-red-700">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Health Alert
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Environmental Health Surveys</h1>
            <p className="text-gray-600">Monitor community health risks and survey responses</p>
          </div>
        </div>
        <Button variant="outline" onClick={exportSurveyData}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{summary.totalSurveys}</div>
          <div className="text-sm text-gray-600">Total Surveys</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{summary.highRiskAreas}</div>
          <div className="text-sm text-gray-600">High Risk Areas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{summary.recentSubmissions}</div>
          <div className="text-sm text-gray-600">Recent Submissions</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{summary.averageRiskScore}%</div>
          <div className="text-sm text-gray-600">Average Risk Score</div>
        </Card>
      </div>

      {}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Tabs value={selectedView} onValueChange={(value: any) => setSelectedView(value)} className="flex-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Surveys</TabsTrigger>
              <TabsTrigger value="high-risk">High Risk</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by patient name..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {}
      <div className="space-y-4">
        {filteredSurveys.map((survey) => (
          <Card 
            key={survey.id} 
            className={`p-6 cursor-pointer hover:shadow-lg transition-all border-l-4 ${
              survey.priority === 'high' ? 'border-l-red-500' :
              survey.priority === 'medium' ? 'border-l-orange-500' : 
              'border-l-green-500'
            }`}
            onClick={() => setSelectedSurvey(survey)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{survey.patientName}</h3>
                    <p className="text-sm text-gray-600">Patient ID: {survey.patientId}</p>
                  </div>
                  <Badge variant={
                    survey.priority === 'high' ? 'destructive' :
                    survey.priority === 'medium' ? 'secondary' : 
                    'default'
                  }>
                    {survey.priority.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{survey.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span>{new Date(survey.submissionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {survey.diseaseReports === 'yes' ? (
                      <>
                        <Thermometer className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Disease reported</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">No diseases</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span>Risk: {survey.riskScore}%</span>
                  </div>
                </div>
                
                {}
                <div className="flex items-center space-x-4 mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <Trash2 className="w-4 h-4 text-gray-500" />
                    <span className="text-xs">Waste: {getResponseIcon('waste', survey.wasteDisposal)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Droplets className="w-4 h-4 text-gray-500" />
                    <span className="text-xs">Water: {getResponseIcon('water', survey.stagnantWater)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bug className="w-4 h-4 text-gray-500" />
                    <span className="text-xs">Pests: {getResponseIcon('pest', survey.pestInfestation)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <span className="text-xs">Sanitation: {getResponseIcon('sanitation', survey.sanitationFrequency)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {getRiskIcon(survey.riskScore)}
                  <span className="text-lg font-bold">{survey.riskScore}%</span>
                </div>
                <Button variant="ghost" size="sm" className="mt-2">
                  View Details →
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <Card className="p-12 text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No surveys found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later for new submissions</p>
        </Card>
      )}
    </div>
  );
}