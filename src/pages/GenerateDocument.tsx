import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Download, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SignatureCapture } from "@/components/SignatureCapture";
import { generateDocumentDummy } from "@/utils/documentGenerator";

interface Question {
  id: string;
  question: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required: boolean;
}

interface DocumentConfig {
  title: string;
  description: string;
  questions: Question[];
  requiresSignature: boolean;
  dualPartySignature?: boolean;
}

const documentConfigs: Record<string, DocumentConfig> = {
  "rent-agreement": {
    title: "Rent Agreement",
    description: "Professional rental agreement for landlords and tenants",
    questions: [
      { id: "landlord_name", question: "Landlord's Full Name", type: "text", required: true },
      { id: "tenant_name", question: "Tenant's Full Name", type: "text", required: true },
      { id: "property_address", question: "Property Address", type: "textarea", required: true },
      { id: "monthly_rent", question: "Monthly Rent Amount", type: "text", required: true },
      { id: "lease_duration", question: "Lease Duration (in months)", type: "text", required: true },
      { id: "security_deposit", question: "Security Deposit Amount", type: "text", required: true }
    ],
    requiresSignature: true,
    dualPartySignature: true
  },
  "job-offer": {
    title: "Job Offer Letter",
    description: "Professional job offer letter for new employees",
    questions: [
      { id: "company_name", question: "Company Name", type: "text", required: true },
      { id: "candidate_name", question: "Candidate's Full Name", type: "text", required: true },
      { id: "position", question: "Job Position/Title", type: "text", required: true },
      { id: "salary", question: "Annual Salary", type: "text", required: true },
      { id: "start_date", question: "Start Date", type: "text", required: true },
      { id: "benefits", question: "Benefits and Perks", type: "textarea", required: false }
    ],
    requiresSignature: true,
    dualPartySignature: false
  },
  "nda": {
    title: "Non-Disclosure Agreement",
    description: "Confidentiality agreement for business partnerships",
    questions: [
      { id: "disclosing_party", question: "Disclosing Party Name", type: "text", required: true },
      { id: "receiving_party", question: "Receiving Party Name", type: "text", required: true },
      { id: "purpose", question: "Purpose of Information Sharing", type: "textarea", required: true },
      { id: "duration", question: "Duration of Agreement (years)", type: "text", required: true },
      { id: "specific_info", question: "Specific Information to be Protected", type: "textarea", required: false }
    ],
    requiresSignature: true,
    dualPartySignature: true
  }
};

const GenerateDocument = () => {
  const { docType } = useParams<{ docType: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [modifications, setModifications] = useState("");
  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<{
    id: string;
    content: string;
    downloadUrl: string;
    createdAt: string;
  } | null>(null);

  const config = docType ? documentConfigs[docType] : null;

  useEffect(() => {
    if (!config) {
      toast({
        title: "Document type not found",
        description: "The requested document type is not available.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [config, navigate]);

  if (!config) return null;

  const totalSteps = config.questions.length + (modifications ? 1 : 0) + (config.requiresSignature ? 1 : 0) + 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSignature = (signatureType: string, signatureData: string) => {
    setSignatures(prev => ({ ...prev, [signatureType]: signatureData }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Using dummy function - replace with actual backend call
      const document = await generateDocumentDummy({
        documentType: config.title,
        answers,
        modifications,
        signatures
      });
      
      setGeneratedDocument(document);
      
      toast({
        title: "Document Generated Successfully!",
        description: "Your professional document is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedDocument) {
      // In production, this would download from the backend URL
      window.open(generatedDocument.downloadUrl, '_blank');
      
      toast({
        title: "Opening Download",
        description: "Your document download is being processed.",
      });
    }
  };

  const renderCurrentStep = () => {
    if (currentStep < config.questions.length) {
      const question = config.questions[currentStep];
      return (
        <div className="space-y-4">
          <Label htmlFor={question.id} className="text-lg text-white">
            {question.question} {question.required && <span className="text-red-400">*</span>}
          </Label>
          {question.type === "textarea" ? (
            <Textarea
              id={question.id}
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              rows={4}
            />
          ) : (
            <Input
              id={question.id}
              type="text"
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          )}
        </div>
      );
    }

    if (currentStep === config.questions.length) {
      return (
        <div className="space-y-4">
          <Label htmlFor="modifications" className="text-lg text-white">
            Any Additional Modifications or Special Requirements?
          </Label>
          <Textarea
            id="modifications"
            value={modifications}
            onChange={(e) => setModifications(e.target.value)}
            placeholder="Add any specific clauses, modifications, or requirements you'd like to include..."
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            rows={6}
          />
        </div>
      );
    }

    if (config.requiresSignature && currentStep === config.questions.length + 1) {
      return (
        <div className="space-y-6">
          <h3 className="text-lg text-white mb-4">Digital Signatures</h3>
          <SignatureCapture 
            onSignature={(sig) => handleSignature("party1", sig)}
            label="Primary Party Signature"
          />
          {config.dualPartySignature && (
            <SignatureCapture 
              onSignature={(sig) => handleSignature("party2", sig)}
              label="Second Party Signature"
            />
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6 text-center">
        <h3 className="text-2xl font-bold text-white">Ready to Generate Your Document</h3>
        <p className="text-gray-300">
          Review your information and click generate to create your professional document.
        </p>
        {generatedDocument ? (
          <div className="space-y-4">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 font-medium">Document Generated Successfully!</p>
              <p className="text-green-200 text-sm mt-1">Document ID: {generatedDocument.id}</p>
            </div>
            <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Download Link
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? "Generating..." : "Generate Document"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documents
            </Button>
            <h1 className="text-3xl font-bold text-white mb-2">{config.title}</h1>
            <p className="text-gray-300">{config.description}</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Main Content */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {currentStep < config.questions.length 
                  ? `Question ${currentStep + 1}`
                  : currentStep === config.questions.length
                  ? "Modifications"
                  : config.requiresSignature && currentStep === config.questions.length + 1
                  ? "Signatures"
                  : "Generate Document"
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderCurrentStep()}
              
              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < totalSteps - 1 && (
                  <Button 
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateDocument;
