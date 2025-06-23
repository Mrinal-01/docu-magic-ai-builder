
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

export const generateDocumentWithBackend = async (params: DocumentGenerationParams): Promise<GeneratedDocument> => {
  const { documentType, answers, modifications, signatures } = params;

  try {
    // Call backend API for document generation
    const response = await fetch('/api/documents/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentType,
        answers,
        modifications,
        signatures
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error generating document:", error);
    throw new Error("Failed to generate document");
  }
};

// Dummy function for development - replace with actual backend call
export const generateDocumentDummy = async (params: DocumentGenerationParams): Promise<GeneratedDocument> => {
  const { documentType, answers } = params;
  
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
