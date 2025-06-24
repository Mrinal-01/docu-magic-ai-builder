
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DocumentType {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  icon: string;
  color: string;
  questions: Array<{
    id: string;
    question: string;
    type: "text" | "textarea" | "select";
    options?: string[];
    required: boolean;
  }>;
  requiresSignature: boolean;
  dualPartySignature?: boolean;
}

interface AdminContextType {
  documentTypes: DocumentType[];
  addDocumentType: (docType: DocumentType) => void;
  removeDocumentType: (id: string) => void;
  updateDocumentType: (id: string, docType: DocumentType) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const defaultDocumentTypes: DocumentType[] = [
  {
    id: "rent-agreement",
    title: "Rent Agreement",
    description: "Professional rental agreement for landlords and tenants",
    price: "₹99",
    category: "Legal",
    icon: "Gavel",
    color: "from-blue-500 to-purple-600",
    questions: [
      { id: "landlord_name", question: "Landlord's Full Name", type: "text", required: true },
      { id: "tenant_name", question: "Tenant's Full Name", type: "text", required: true },
      { id: "property_address", question: "Property Address", type: "textarea", required: true },
      { id: "monthly_rent", question: "Monthly Rent Amount", type: "text", required: true },
      { id: "lease_duration", question: "Lease Duration (in months)", type: "text", required: true }
    ],
    requiresSignature: true,
    dualPartySignature: true
  }
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(() => {
    const saved = localStorage.getItem('admin_document_types');
    return saved ? JSON.parse(saved) : defaultDocumentTypes;
  });

  useEffect(() => {
    localStorage.setItem('admin_document_types', JSON.stringify(documentTypes));
  }, [documentTypes]);

  const addDocumentType = (docType: DocumentType) => {
    setDocumentTypes(prev => [...prev, docType]);
  };

  const removeDocumentType = (id: string) => {
    setDocumentTypes(prev => prev.filter(doc => doc.id !== id));
  };

  const updateDocumentType = (id: string, docType: DocumentType) => {
    setDocumentTypes(prev => prev.map(doc => doc.id === id ? docType : doc));
  };

  return (
    <AdminContext.Provider value={{ documentTypes, addDocumentType, removeDocumentType, updateDocumentType }}>
      {children}
    </AdminContext.Provider>
  );
};
