
import React, { createContext, useContext, useState } from 'react';

export interface DocumentType {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  price: string;
  questions: Question[];
  requiresSignature: boolean;
  dualPartySignature?: boolean;
}

export interface Question {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  required: boolean;
}

interface AdminContextType {
  documentTypes: DocumentType[];
  addDocumentType: (docType: Omit<DocumentType, 'id'>) => void;
  updateDocumentType: (id: string, docType: Partial<DocumentType>) => void;
  deleteDocumentType: (id: string) => void;
  removeDocumentType: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([
    {
      id: "rent-agreement",
      title: "Rent Agreement",
      description: "Professional rental agreement for landlords and tenants",
      icon: "FileText",
      color: "from-blue-500 to-purple-600",
      category: "Legal",
      price: "Free",
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
    {
      id: "job-offer",
      title: "Job Offer Letter",
      description: "Professional job offer letter for new employees",
      icon: "Briefcase",
      color: "from-green-500 to-blue-600",
      category: "HR",
      price: "Free",
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
    {
      id: "nda",
      title: "Non-Disclosure Agreement",
      description: "Confidentiality agreement for business partnerships",
      icon: "Gavel",
      color: "from-red-500 to-pink-600",
      category: "Legal",
      price: "Free",
      questions: [
        { id: "disclosing_party", question: "Disclosing Party Name", type: "text", required: true },
        { id: "receiving_party", question: "Receiving Party Name", type: "text", required: true },
        { id: "purpose", question: "Purpose of Information Sharing", type: "textarea", required: true },
        { id: "duration", question: "Duration of Agreement (years)", type: "text", required: true },
        { id: "specific_info", question: "Specific Information to be Protected", type: "textarea", required: false }
      ],
      requiresSignature: true,
      dualPartySignature: true
    },
    {
      id: "invoice",
      title: "Professional Invoice",
      description: "Create professional invoices for your business",
      icon: "Receipt",
      color: "from-yellow-500 to-orange-600",
      category: "Business",
      price: "Free",
      questions: [
        { id: "company_name", question: "Your Company Name", type: "text", required: true },
        { id: "client_name", question: "Client Name/Company", type: "text", required: true },
        { id: "invoice_number", question: "Invoice Number", type: "text", required: true },
        { id: "services", question: "Services/Products Description", type: "textarea", required: true },
        { id: "amount", question: "Total Amount", type: "text", required: true },
        { id: "due_date", question: "Payment Due Date", type: "text", required: true }
      ],
      requiresSignature: false
    },
    {
      id: "employee-handbook",
      title: "Employee Handbook",
      description: "Comprehensive employee handbook template",
      icon: "Users",
      color: "from-indigo-500 to-purple-600",
      category: "HR",
      price: "Free",
      questions: [
        { id: "company_name", question: "Company Name", type: "text", required: true },
        { id: "company_mission", question: "Company Mission Statement", type: "textarea", required: true },
        { id: "work_hours", question: "Standard Work Hours", type: "text", required: true },
        { id: "dress_code", question: "Dress Code Policy", type: "textarea", required: false },
        { id: "vacation_policy", question: "Vacation Policy", type: "textarea", required: true }
      ],
      requiresSignature: false
    },
    {
      id: "business-proposal",
      title: "Business Proposal",
      description: "Professional business proposal template",
      icon: "Presentation",
      color: "from-teal-500 to-cyan-600",
      category: "Business",
      price: "Free",
      questions: [
        { id: "company_name", question: "Your Company Name", type: "text", required: true },
        { id: "client_name", question: "Client/Prospect Name", type: "text", required: true },
        { id: "project_overview", question: "Project Overview", type: "textarea", required: true },
        { id: "timeline", question: "Project Timeline", type: "text", required: true },
        { id: "budget", question: "Proposed Budget", type: "text", required: true },
        { id: "deliverables", question: "Key Deliverables", type: "textarea", required: true }
      ],
      requiresSignature: false
    }
  ]);

  const addDocumentType = (docType: Omit<DocumentType, 'id'>) => {
    const newDocType = {
      ...docType,
      id: `doc-${Date.now()}`
    };
    setDocumentTypes(prev => [...prev, newDocType]);
  };

  const updateDocumentType = (id: string, updates: Partial<DocumentType>) => {
    setDocumentTypes(prev => 
      prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc)
    );
  };

  const deleteDocumentType = (id: string) => {
    setDocumentTypes(prev => prev.filter(doc => doc.id !== id));
  };

  const removeDocumentType = (id: string) => {
    setDocumentTypes(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      documentTypes,
      addDocumentType,
      updateDocumentType,
      deleteDocumentType,
      removeDocumentType
    }}>
      {children}
    </AdminContext.Provider>
  );
};
