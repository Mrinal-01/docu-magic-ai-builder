
interface DocumentGenerationParams {
  documentType: string;
  answers: Record<string, string>;
  modifications: string;
  signatures: Record<string, string>;
}

interface GeneratedDocument {
  id: string;
  content: string;
  downloadUrl: string;
  createdAt: string;
}

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const generateDocumentWithBackend = async (params: DocumentGenerationParams): Promise<GeneratedDocument> => {
  const { documentType, answers, modifications, signatures } = params;
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    // TODO: Replace '/api/documents/generate' with your actual backend API URL
    const response = await fetch('/api/documents/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        documentType,
        answers,
        modifications,
        signatures
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error generating document:", error);
    throw new Error("Failed to generate document");
  }
};

// Enhanced dummy function for development - replace with actual backend call
export const generateDocumentDummy = async (params: DocumentGenerationParams): Promise<GeneratedDocument> => {
  const { documentType, answers } = params;
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  console.log("Document generation request:", params);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return dummy response that mimics backend structure
  return {
    id: `doc_${Date.now()}`,
    content: `This is a dummy ${documentType} document generated with the provided answers.`,
    downloadUrl: `https://api.example.com/documents/download/doc_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
};

// Function to download document (requires authentication)
export const downloadDocument = async (documentId: string): Promise<void> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    // TODO: Replace '/api/documents/download' with your actual backend API URL
    const response = await fetch(`/api/documents/download/${documentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle file download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `document_${documentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading document:", error);
    throw new Error("Failed to download document");
  }
};
