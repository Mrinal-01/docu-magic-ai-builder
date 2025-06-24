
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Settings } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

const Admin = () => {
  const { documentTypes, addDocumentType, removeDocumentType } = useAdmin();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    icon: 'FileText',
    color: 'from-blue-500 to-purple-600'
  });

  // Check if user is admin (in real app, this would be a proper role check)
  const isAdmin = user?.email === 'admin@docuforge.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-white dark:text-gray-100">Access Denied</CardTitle>
            <CardDescription className="text-gray-300 dark:text-gray-400">
              You don't have admin privileges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-purple-600 to-blue-600">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddDocument = () => {
    if (!newDoc.title || !newDoc.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const docType = {
      id: newDoc.title.toLowerCase().replace(/\s+/g, '-'),
      ...newDoc,
      questions: [
        { id: 'basic_info', question: 'Basic Information', type: 'text' as const, required: true }
      ],
      requiresSignature: true
    };

    addDocumentType(docType);
    setNewDoc({ title: '', description: '', price: '', category: '', icon: 'FileText', color: 'from-blue-500 to-purple-600' });
    setShowAddForm(false);
    
    toast({
      title: "Document Type Added",
      description: "New document type has been created successfully."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-100 mb-2">Admin Dashboard</h1>
            <p className="text-gray-300 dark:text-gray-400">Manage document types and system settings</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="border-white/20 text-white hover:bg-white/10 dark:border-gray-600 dark:text-gray-300">
              User Dashboard
            </Button>
            <Button variant="outline" onClick={logout} className="border-white/20 text-white hover:bg-white/10 dark:border-gray-600 dark:text-gray-300">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-white dark:text-gray-100">Total Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">{documentTypes.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-white dark:text-gray-100">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-400">1,234</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-white dark:text-gray-100">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-400">₹45,678</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Document Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Document Type
          </Button>
        </div>

        {/* Add Document Form */}
        {showAddForm && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600 mb-8">
            <CardHeader>
              <CardTitle className="text-white dark:text-gray-100">Add New Document Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white dark:text-gray-200">Title</Label>
                  <Input 
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                    className="bg-white/10 border-white/20 text-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label className="text-white dark:text-gray-200">Price</Label>
                  <Input 
                    value={newDoc.price}
                    onChange={(e) => setNewDoc({...newDoc, price: e.target.value})}
                    className="bg-white/10 border-white/20 text-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="₹99"
                  />
                </div>
              </div>
              <div>
                <Label className="text-white dark:text-gray-200">Description</Label>
                <Textarea 
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({...newDoc, description: e.target.value})}
                  className="bg-white/10 border-white/20 text-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white dark:text-gray-200">Category</Label>
                  <Select value={newDoc.category} onValueChange={(value) => setNewDoc({...newDoc, category: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Employment">Employment</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white dark:text-gray-200">Color Theme</Label>
                  <Select value={newDoc.color} onValueChange={(value) => setNewDoc({...newDoc, color: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="from-blue-500 to-purple-600">Blue to Purple</SelectItem>
                      <SelectItem value="from-green-500 to-blue-500">Green to Blue</SelectItem>
                      <SelectItem value="from-purple-500 to-pink-500">Purple to Pink</SelectItem>
                      <SelectItem value="from-orange-500 to-red-500">Orange to Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddDocument} className="bg-green-600 hover:bg-green-700">
                  Add Document
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-white/20 text-white hover:bg-white/10 dark:border-gray-600 dark:text-gray-300">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Types List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentTypes.map((doc) => (
            <Card key={doc.id} className="bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white dark:text-gray-100 text-lg">{doc.title}</CardTitle>
                    <CardDescription className="text-gray-300 dark:text-gray-400 text-sm">
                      {doc.description}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeDocumentType(doc.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-green-400">{doc.price}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 dark:bg-gray-700 dark:text-gray-200">
                    {doc.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
