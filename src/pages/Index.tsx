
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Briefcase, Gavel, FileInvoice, File } from "lucide-react";
import { useNavigate } from "react-router-dom";

const documentTypes = [
  {
    id: "rent-agreement",
    title: "Rent Agreement",
    description: "Professional rental agreement for landlords and tenants",
    price: "₹99",
    category: "Legal",
    icon: Gavel,
    color: "from-blue-500 to-purple-600"
  },
  {
    id: "job-offer",
    title: "Job Offer Letter",
    description: "Professional job offer letter for new employees",
    price: "₹149",
    category: "Employment",
    icon: Users,
    color: "from-green-500 to-blue-500"
  },
  {
    id: "nda",
    title: "Non-Disclosure Agreement",
    description: "Confidentiality agreement for business partnerships",
    price: "₹199",
    category: "Legal",
    icon: Gavel,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "founders-agreement",
    title: "Founders' Agreement",
    description: "Agreement between startup co-founders",
    price: "₹299",
    category: "Business",
    icon: Briefcase,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "employment-contract",
    title: "Employment Contract",
    description: "Comprehensive employment agreement",
    price: "₹199",
    category: "Employment",
    icon: Users,
    color: "from-teal-500 to-green-500"
  },
  {
    id: "freelance-invoice",
    title: "Freelance Invoice",
    description: "Professional invoice for freelance services",
    price: "₹79",
    category: "Financial",
    icon: FileInvoice,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "gst-registration",
    title: "GST Registration Support",
    description: "Documentation support for GST registration",
    price: "₹249",
    category: "Business",
    icon: FileText,
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: "pitch-deck",
    title: "Pitch Deck Outline",
    description: "Basic structure for startup pitch presentations",
    price: "₹399",
    category: "Business",
    icon: File,
    color: "from-pink-500 to-rose-500"
  }
];

const Index = () => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDocumentSelect = (docId: string) => {
    setSelectedDoc(docId);
    navigate(`/generate/${docId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            DocuForge AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Answer 5 questions. Download your ready-to-sign document.
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            AI-powered professional document generation for startups, freelancers, and businesses. 
            No legal expertise required.
          </p>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {documentTypes.map((doc, index) => {
            const IconComponent = doc.icon;
            return (
              <Card 
                key={doc.id}
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-md border-white/20 animate-fade-in hover-scale`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleDocumentSelect(doc.id)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${doc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg mb-2">{doc.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-sm leading-relaxed">
                    {doc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-400">{doc.price}</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
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
          <h2 className="text-3xl font-bold text-white mb-8">Why Choose DocuForge AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300">Generate professional documents in under 2 minutes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-300">Smart templates that adapt to your specific needs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-white mb-2">Legal Ready</h3>
              <p className="text-gray-300">Professional-grade documents ready for signing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
