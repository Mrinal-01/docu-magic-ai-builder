import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Briefcase, Gavel, Receipt, User, LogOut, Presentation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { ThemeToggle } from "@/components/ThemeToggle";

const iconMap = {
  FileText,
  Users,
  Briefcase,
  Gavel,
  Receipt,
  Presentation
};

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { documentTypes } = useAdmin();

  const handleDocumentSelect = (docId: string) => {
    navigate(`/generate/${docId}`);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header with Auth */}
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white dark:text-gray-200">
                  <User className="w-4 h-4" />
                  <span className="text-sm">
                    {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100 bg-white dark:bg-gray-800 transition-colors"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100 bg-white dark:bg-gray-800 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100 bg-white dark:bg-gray-800 transition-colors"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white dark:text-gray-100 mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            DocuForge AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-400 mb-4">
            Answer 5 questions. Download your ready-to-sign document.
          </p>
          <p className="text-lg text-gray-400 dark:text-gray-500 max-w-2xl mx-auto">
            AI-powered professional document generation for startups, freelancers, and businesses. 
            No legal expertise required. Generate for free, login only to download.
          </p>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {documentTypes.map((doc, index) => {
            const IconComponent = iconMap[doc.icon as keyof typeof iconMap] || FileText;
            return (
              <Card 
                key={doc.id}
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600 animate-fade-in hover-scale`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleDocumentSelect(doc.id)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${doc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white dark:text-gray-100 text-lg mb-2">{doc.title}</CardTitle>
                  <CardDescription className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed">
                    {doc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-400">{doc.price}</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 dark:bg-gray-700 dark:text-gray-200">
                      {doc.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-white dark:text-gray-100 mb-8">Why Choose DocuForge AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">Lightning Fast</h3>
              <p className="text-gray-300 dark:text-gray-400">Generate professional documents in under 2 minutes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">AI-Powered</h3>
              <p className="text-gray-300 dark:text-gray-400">Smart templates that adapt to your specific needs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">Legal Ready</h3>
              <p className="text-gray-300 dark:text-gray-400">Professional-grade documents ready for signing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
