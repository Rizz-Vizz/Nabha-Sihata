import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { useAuth } from './auth-context';
import { ArrowLeft, Bell, AlertTriangle, Info, CheckCircle, Shield, Clock, MapPin, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { environmentalService } from '../utils/supabase/client';

interface Notification {
  id: string;
  type: 'outbreak' | 'reminder' | 'alert' | 'info';
  title: string;
  message: string;
  actionableAdvice?: string;
  diseaseName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  isRead: boolean;
  expiresAt?: string;
  health_notifications?: {
    id: string;
    title: string;
    message: string;
    type: string;
    severity: string;
    disease_name?: string;
    actionable_advice: string;
    created_at: string;
  };
}

interface NotificationCenterProps {
  onBack: () => void;
}

export function NotificationCenter({ onBack }: NotificationCenterProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts'>('all');
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) {
        console.log('No user authenticated - showing demo notifications');
        
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'outbreak',
            title: 'Dengue Alert in Your Area',
            message: 'Health officials have reported 5 cases of dengue fever within 2km of your location.',
            actionableAdvice: 'Remove stagnant water around your home. Use mosquito nets and repellents.',
            diseaseName: 'Dengue Fever',
            severity: 'high',
            location: 'Nabha, Punjab',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            isRead: false
          },
          {
            id: '2',
            type: 'reminder',
            title: 'Weekly Health Check Reminder',
            message: 'Remember to clean water storage containers and check for mosquito breeding sites.',
            actionableAdvice: 'Clean water tanks, check drains, and maintain proper waste disposal.',
            severity: 'medium',
            location: 'Your Area',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            isRead: true
          },
          {
            id: '3',
            type: 'alert',
            title: 'Water Quality Alert',
            message: 'Contaminated water source detected near your locality. Boil water before drinking.',
            actionableAdvice: 'Boil drinking water for at least 5 minutes. Use bottled water if possible.',
            severity: 'critical',
            location: 'Nabha Water Supply',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            isRead: false,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setNotifications(mockNotifications);
        setLoading(false);
        return;
      }

      try {
        const data = await environmentalService.getHealthNotifications();
        
        
        const transformedNotifications: Notification[] = data.map((item: any) => ({
          id: item.notification_id || item.id,
          type: item.health_notifications?.type || 'info',
          title: item.health_notifications?.title || 'Health Notification',
          message: item.health_notifications?.message || '',
          actionableAdvice: item.health_notifications?.actionable_advice,
          diseaseName: item.health_notifications?.disease_name,
          severity: item.health_notifications?.severity || 'low',
          location: 'Your Area', 
          timestamp: item.delivered_at || item.health_notifications?.created_at,
          isRead: item.is_read || false,
          health_notifications: item.health_notifications
        }));

        setNotifications(transformedNotifications);
      } catch (error: any) {
        
        if (error.message && error.message.includes('not authenticated')) {
          console.log('User not authenticated - using demo notifications (this is normal in demo mode)');
        } else {
          console.error('Get notifications failed:', error);
        }
        
        
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'outbreak',
            title: 'Dengue Alert in Your Area',
            message: 'Health officials have reported 5 cases of dengue fever within 2km of your location.',
            actionableAdvice: 'Remove stagnant water around your home. Use mosquito nets and repellents.',
            diseaseName: 'Dengue Fever',
            severity: 'high',
            location: 'Nabha, Punjab',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            isRead: false
          },
          {
            id: '2',
            type: 'reminder',
            title: 'Weekly Health Check Reminder',
            message: 'Remember to clean water storage containers and check for mosquito breeding sites.',
            actionableAdvice: 'Clean water tanks, check drains, and maintain proper waste disposal.',
            severity: 'medium',
            location: 'Your Area',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            isRead: true
          },
          {
            id: '3',
            type: 'alert',
            title: 'Water Quality Alert',
            message: 'Contaminated water source detected near your locality. Boil water before drinking.',
            actionableAdvice: 'Boil drinking water for at least 5 minutes. Use bottled water if possible.',
            severity: 'critical',
            location: 'Nabha Water Supply',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            isRead: false,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setNotifications(mockNotifications);
        
        if (error.message && !error.message.includes('authenticated') && user) {
          toast.info('Using demo notifications. Database connection issue.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  const getNotificationIcon = (type: string, severity: string) => {
    switch (type) {
      case 'outbreak':
        return <AlertTriangle className={`w-5 h-5 ${severity === 'critical' ? 'text-red-600' : 'text-orange-500'}`} />;
      case 'alert':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
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
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const markAsRead = async (notificationId: string) => {
    
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );

    
    try {
      await environmentalService.markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      
    }
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast.success('Notification dismissed');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread': return !notif.isRead;
      case 'alerts': return notif.type === 'outbreak' || notif.type === 'alert';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      {}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-blue-600 flex items-center space-x-2">
              <Bell className="w-6 h-6" />
              <span>Health Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
              )}
            </h1>
            <p className="text-gray-600">Stay informed about health risks in your area</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            Mark All Read
          </Button>
        )}
      </div>

      {}
      <div className="flex space-x-2 mb-6 max-w-4xl mx-auto">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="flex items-center space-x-2"
        >
          <span>All</span>
          <Badge variant="secondary">{notifications.length}</Badge>
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          className="flex items-center space-x-2"
        >
          <span>Unread</span>
          {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
        </Button>
        <Button
          variant={filter === 'alerts' ? 'default' : 'outline'}
          onClick={() => setFilter('alerts')}
          className="flex items-center space-x-2"
        >
          <span>Health Alerts</span>
          <Badge variant="secondary">
            {notifications.filter(n => n.type === 'outbreak' || n.type === 'alert').length}
          </Badge>
        </Button>
      </div>

      {}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread' ? 'All caught up! No unread notifications.' : 
               filter === 'alerts' ? 'No health alerts at this time.' :
               'You have no notifications yet.'}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type, notification.severity)}
                  </div>

                  {}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <Badge className={getSeverityColor(notification.severity)}>
                        {notification.severity.toUpperCase()}
                      </Badge>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3">{notification.message}</p>

                    {notification.diseaseName && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600 font-medium">Disease:</span>
                          <span className="text-red-800">{notification.diseaseName}</span>
                        </div>
                      </div>
                    )}

                    {notification.actionableAdvice && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-green-800 font-medium mb-1">What to do:</p>
                            <p className="text-green-700 text-sm">{notification.actionableAdvice}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{notification.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{getTimeAgo(notification.timestamp)}</span>
                        </div>
                      </div>

                      {notification.expiresAt && (
                        <div className="text-xs text-orange-600">
                          Expires: {new Date(notification.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notification.id);
                  }}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {}
      <Card className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="text-center">
          <h3 className="font-medium text-green-800 mb-2">💡 Daily Health Tip</h3>
          <p className="text-green-700 text-sm">
            Wash your hands regularly, drink clean water, and maintain cleanliness around your home to prevent diseases.
          </p>
        </div>
      </Card>
    </div>
  );
}