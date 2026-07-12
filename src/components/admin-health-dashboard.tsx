import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useLanguage } from './language-context';
import { ArrowLeft, AlertTriangle, TrendingUp, Users, MapPin, Calendar, Search, Plus, Send, Eye, BarChart3, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { environmentalService } from '../utils/supabase/client';

interface SurveyResponse {
  id: string;
  userId: string;
  userName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  wasteDisposal: 'yes' | 'no';
  stagnantWater: 'yes' | 'no';
  sanitationFrequency: 'daily' | 'weekly' | 'rarely' | 'never';
  pestInfestation: 'yes' | 'no';
  diseaseReports: 'yes' | 'no';
  diseaseDetails?: string;
  additionalComments?: string;
  photos: string[];
  submittedAt: string;
  riskScore: number;
}

interface HealthAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  targetArea: string;
  diseaseName?: string;
  actionableAdvice: string;
  createdAt: string;
  sentTo: number;
  status: 'draft' | 'sent' | 'scheduled';
}

interface AdminHealthDashboardProps {
  onBack: () => void;
}

export function AdminHealthDashboard({ onBack }: AdminHealthDashboardProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([]);

  
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    severity: 'medium' as const,
    targetArea: '',
    diseaseName: '',
    actionableAdvice: ''
  });

  useEffect(() => {
    // Mock survey responses
    const mockSurveys: SurveyResponse[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Ram Singh',
        location: 'Nabha Central',
        coordinates: { lat: 30.1644, lng: 76.1436 },
        wasteDisposal: 'no',
        stagnantWater: 'yes',
        sanitationFrequency: 'rarely',
        pestInfestation: 'yes',
        diseaseReports: 'yes',
        diseaseDetails: 'Dengue fever cases reported in neighborhood',
        additionalComments: 'Urgent cleanup needed near main road',
        photos: ['photo1.jpg', 'photo2.jpg'],
        submittedAt: '2024-01-15T10:30:00Z',
        riskScore: 85
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Preet Kaur',
        location: 'Nabha East',
        coordinates: { lat: 30.1650, lng: 76.1450 },
        wasteDisposal: 'yes',
        stagnantWater: 'no',
        sanitationFrequency: 'weekly',
        pestInfestation: 'no',
        diseaseReports: 'no',
        additionalComments: 'Good sanitation in our area',
        photos: [],
        submittedAt: '2024-01-15T14:20:00Z',
        riskScore: 25
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Gurpreet Singh',
        location: 'Nabha West',
        coordinates: { lat: 30.1630, lng: 76.1420 },
        wasteDisposal: 'no',
        stagnantWater: 'yes',
        sanitationFrequency: 'never',
        pestInfestation: 'yes',
        diseaseReports: 'yes',
        diseaseDetails: 'Typhoid cases in nearby houses',
        additionalComments: 'Water logging issue during monsoon',
        photos: ['photo3.jpg'],
        submittedAt: '2024-01-14T09:15:00Z',
        riskScore: 90
      }
    ];

    const mockAlerts: HealthAlert[] = [
      {
        id: '1',
        title: 'Dengue Alert - Nabha Central',
        message: 'Multiple dengue cases reported in central area. Take preventive measures.',
        severity: 'high',
        targetArea: 'Nabha Central',
        diseaseName: 'Dengue Fever',
        actionableAdvice: 'Remove stagnant water, use mosquito nets, apply repellent',
        createdAt: '2024-01-15T11:00:00Z',
        sentTo: 1250,
        status: 'sent'
      },
      {
        id: '2',
        title: 'Water Quality Alert',
        message: 'Contaminated water source detected. Boil water before drinking.',
        severity: 'critical',
        targetArea: 'All Areas',
        actionableAdvice: 'Boil drinking water for 5 minutes, use bottled water if possible',
        createdAt: '2024-01-14T16:30:00Z',
        sentTo: 3200,
        status: 'sent'
      }
    ];

    setTimeout(() => {
      setSurveyResponses(mockSurveys);
      setHealthAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Recently';
  };

  const filteredSurveys = surveyResponses.filter(survey => {
    const matchesSearch = searchTerm === '' || 
      survey.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || survey.location.includes(locationFilter);
    
    const matchesRisk = riskFilter === 'all' ||
      (riskFilter === 'high' && survey.riskScore >= 70) ||
      (riskFilter === 'medium' && survey.riskScore >= 40 && survey.riskScore < 70) ||
      (riskFilter === 'low' && survey.riskScore < 40);
    
    return matchesSearch && matchesLocation && matchesRisk;
  });

  const sendAlert = async () => {
    if (!newAlert.title || !newAlert.message || !newAlert.actionableAdvice) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      
      const alert: HealthAlert = {
        id: Date.now().toString(),
        ...newAlert,
        createdAt: new Date().toISOString(),
        sentTo: Math.floor(Math.random() * 2000) + 500,
        status: 'sent'
      };

      setHealthAlerts(prev => [alert, ...prev]);
      setNewAlert({
        title: '',
        message: '',
        severity: 'medium',
        targetArea: '',
        diseaseName: '',
        actionableAdvice: ''
      });

      toast.success(`Health alert sent to ${alert.sentTo} users`);
    } catch (error) {
      toast.error('Failed to send alert');
    }
  };

  
  const stats = {
    totalSurveys: surveyResponses.length,
    highRiskAreas: surveyResponses.filter(s => s.riskScore >= 70).length,
    alertsSent: healthAlerts.filter(a => a.status === 'sent').length,
    avgRiskScore: Math.round(surveyResponses.reduce((acc, s) => acc + s.riskScore, 0) / surveyResponses.length)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {}
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-green-600">Environmental Health Dashboard</h1>
          <p className="text-gray-600">Monitor community health risks and send alerts</p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Surveys</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalSurveys}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Risk Areas</p>
              <p className="text-2xl font-bold text-red-600">{stats.highRiskAreas}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Send className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Alerts Sent</p>
              <p className="text-2xl font-bold text-green-600">{stats.alertsSent}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Risk Score</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgRiskScore}%</p>
            </div>
          </div>
        </Card>
      </div>

      {}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Survey Responses</TabsTrigger>
          <TabsTrigger value="alerts">Health Alerts</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacy Wallet</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {}
        <TabsContent value="overview" className="space-y-4">
          {}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Central">Nabha Central</SelectItem>
                  <SelectItem value="East">Nabha East</SelectItem>
                  <SelectItem value="West">Nabha West</SelectItem>
                  <SelectItem value="North">Nabha North</SelectItem>
                </SelectContent>
              </Select>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk (70+)</SelectItem>
                  <SelectItem value="medium">Medium Risk (40-69)</SelectItem>
                  <SelectItem value="low">Low Risk (0-39)</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </Card>

          {}
          <div className="space-y-4">
            {filteredSurveys.map((survey) => (
              <Card key={survey.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{survey.userName}</span>
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{survey.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{getTimeAgo(survey.submittedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={`px-3 py-1 ${getRiskColor(survey.riskScore)}`}>
                      Risk: {survey.riskScore}%
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-3 rounded border">
                    <div className="text-2xl mb-1">
                      {survey.wasteDisposal === 'yes' ? '✅' : '❌'}
                    </div>
                    <p className="text-xs text-gray-600">Waste Disposal</p>
                  </div>
                  <div className="text-center p-3 rounded border">
                    <div className="text-2xl mb-1">
                      {survey.stagnantWater === 'yes' ? '💧' : '🚫'}
                    </div>
                    <p className="text-xs text-gray-600">Stagnant Water</p>
                  </div>
                  <div className="text-center p-3 rounded border">
                    <div className="text-2xl mb-1">
                      {survey.sanitationFrequency === 'daily' ? '🟢' : 
                       survey.sanitationFrequency === 'weekly' ? '🟡' : 
                       survey.sanitationFrequency === 'rarely' ? '🟠' : '🔴'}
                    </div>
                    <p className="text-xs text-gray-600">Sanitation</p>
                  </div>
                  <div className="text-center p-3 rounded border">
                    <div className="text-2xl mb-1">
                      {survey.pestInfestation === 'yes' ? '🐀' : '🚫'}
                    </div>
                    <p className="text-xs text-gray-600">Pests</p>
                  </div>
                  <div className="text-center p-3 rounded border">
                    <div className="text-2xl mb-1">
                      {survey.diseaseReports === 'yes' ? '🦠' : '✅'}
                    </div>
                    <p className="text-xs text-gray-600">Disease Reports</p>
                  </div>
                </div>

                {}
                {(survey.diseaseDetails || survey.additionalComments) && (
                  <div className="space-y-2">
                    {survey.diseaseDetails && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-red-800 font-medium text-sm">Disease Details:</p>
                        <p className="text-red-700 text-sm">{survey.diseaseDetails}</p>
                      </div>
                    )}
                    {survey.additionalComments && (
                      <div className="bg-gray-50 border border-gray-200 rounded p-3">
                        <p className="text-gray-800 font-medium text-sm">Additional Comments:</p>
                        <p className="text-gray-700 text-sm">{survey.additionalComments}</p>
                      </div>
                    )}
                  </div>
                )}

                {}
                {survey.photos.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Photos uploaded: {survey.photos.length}</p>
                    <div className="flex space-x-2">
                      {survey.photos.map((photo, index) => (
                        <div key={index} className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {}
        <TabsContent value="alerts" className="space-y-4">
          {}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create New Health Alert</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="alert-title">Alert Title *</Label>
                <Input
                  id="alert-title"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Dengue Alert - Nabha Central"
                />
              </div>
              
              <div>
                <Label htmlFor="alert-severity">Severity Level</Label>
                <Select value={newAlert.severity} onValueChange={(value: any) => setNewAlert(prev => ({ ...prev, severity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target-area">Target Area</Label>
                <Input
                  id="target-area"
                  value={newAlert.targetArea}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, targetArea: e.target.value }))}
                  placeholder="e.g., Nabha Central, All Areas"
                />
              </div>

              <div>
                <Label htmlFor="disease-name">Disease Name (if applicable)</Label>
                <Input
                  id="disease-name"
                  value={newAlert.diseaseName}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, diseaseName: e.target.value }))}
                  placeholder="e.g., Dengue, Typhoid"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="alert-message">Alert Message *</Label>
                <Textarea
                  id="alert-message"
                  value={newAlert.message}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe the health risk or situation..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="actionable-advice">Actionable Advice *</Label>
                <Textarea
                  id="actionable-advice"
                  value={newAlert.actionableAdvice}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, actionableAdvice: e.target.value }))}
                  placeholder="What should people do? (e.g., Boil water, use mosquito nets, avoid certain areas)"
                  rows={2}
                />
              </div>
            </div>

            <Button onClick={sendAlert} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
              <Send className="w-4 h-4 mr-2" />
              Send Health Alert
            </Button>
          </Card>

          {}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Health Alerts</h3>
            {healthAlerts.map((alert) => (
              <Card key={alert.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>{alert.title}</span>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </h4>
                    <div className="text-sm text-gray-600 mt-1">
                      Sent to {alert.sentTo} users • {getTimeAgo(alert.createdAt)}
                    </div>
                  </div>
                  <Badge variant={alert.status === 'sent' ? 'default' : 'secondary'}>
                    {alert.status}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-3">{alert.message}</p>

                {alert.diseaseName && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                    <span className="text-red-800 font-medium">Disease: {alert.diseaseName}</span>
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-green-800 font-medium text-sm mb-1">Recommended Actions:</p>
                  <p className="text-green-700 text-sm">{alert.actionableAdvice}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {}
        <TabsContent value="pharmacy" className="space-y-4">
          <PharmacyWalletContent />
        </TabsContent>

        {}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Environmental Health Analytics</h3>
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4" />
              <p>Advanced analytics and charts will be displayed here</p>
              <p className="text-sm">Risk trends, disease mapping, and predictive insights</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}