
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, FileText, Download, Settings, LogOut, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

interface GeneratedDocument {
  id: string;
  title: string;
  type: string;
  status: 'generated' | 'downloaded';
  createdAt: string;
  downloadUrl?: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);

  useEffect(() => {
    // Load user's generated documents from localStorage (in real app, from backend)
    const savedDocs = localStorage.getItem(`user_documents_${user?.id}`);
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    } else {
      // Demo data
      setDocuments([
        {
          id: 'doc_001',
          title: 'Rent Agreement - John & Jane',
          type: 'rent-agreement',
          status: 'downloaded',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'doc_002',
          title: 'Job Offer - Software Engineer',
          type: 'job-offer',
          status: 'generated',
          createdAt: '2024-01-10T14:20:00Z'
        }
      ]);
    }
  }, [user?.id]);

  const isAdmin = user?.email === 'admin@docuforge.com';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSubscriptionColor = (status: string) => {
    switch (status) {
      case 'premium': return 'text-yellow-400';
      case 'enterprise': return 'text-purple-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-100 mb-2">Dashboard</h1>
            <p className="text-gray-300 dark:text-gray-400">Welcome back, {user?.first_name || user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="border-white/20 text-white hover:bg-white/10 dark:border-gray-600 dark:text-gray-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-white/20 text-white hover:bg-white/10 dark:border-gray-600 dark:text-gray-300"
            >
              Generate Documents
            </Button>
            <Button 
              variant="outline" 
              onClick={logout}
              className="border-white/20 text-white hover:bg-white/10 dark:border-gray-600 dark:text-gray-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600 mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-white dark:text-gray-100 text-xl">
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email}
                </CardTitle>
                <CardDescription className="text-gray-300 dark:text-gray-400">
                  {user?.email}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Crown className={`w-4 h-4 ${getSubscriptionColor(user?.subscription_status || 'free')}`} />
                  <Badge 
                    variant="secondary" 
                    className={`${getSubscriptionColor(user?.subscription_status || 'free')} bg-white/20 border-white/30 dark:bg-gray-700`}
                  >
                    {user?.subscription_status?.toUpperCase() || 'FREE'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-white dark:text-gray-100 text-sm">Total Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-400">{documents.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-white dark:text-gray-100 text-sm">Downloaded</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">
                {documents.filter(d => d.status === 'downloaded').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-white dark:text-gray-100 text-sm">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-400">
                {documents.filter(d => d.status === 'generated').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-white dark:text-gray-100 text-sm">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-400">
                {documents.filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth()).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Progress */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600 mb-8">
          <CardHeader>
            <CardTitle className="text-white dark:text-gray-100">Monthly Usage</CardTitle>
            <CardDescription className="text-gray-300 dark:text-gray-400">
              {documents.length} of 10 documents used this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(documents.length / 10) * 100} className="h-3" />
            <p className="text-sm text-gray-300 dark:text-gray-400 mt-2">
              {10 - documents.length} documents remaining
            </p>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-white dark:text-gray-100">Recent Documents</CardTitle>
            <CardDescription className="text-gray-300 dark:text-gray-400">
              Your recently generated documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 dark:text-gray-400 mb-4">No documents generated yet</p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Generate Your First Document
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 dark:bg-gray-700/30 dark:border-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white dark:text-gray-100 font-medium">{doc.title}</h3>
                        <p className="text-gray-300 dark:text-gray-400 text-sm">
                          Created on {formatDate(doc.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="secondary" 
                        className={`${doc.status === 'downloaded' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}`}
                      >
                        {doc.status}
                      </Badge>
                      {doc.status === 'generated' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
