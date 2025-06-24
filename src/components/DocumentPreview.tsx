
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    content: string;
    downloadUrl: string;
    createdAt: string;
  } | null;
  onDownload: () => void;
  isAuthenticated: boolean;
}

export const DocumentPreview = ({ 
  isOpen, 
  onClose, 
  document, 
  onDownload, 
  isAuthenticated 
}: DocumentPreviewProps) => {
  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-gray-900 dark:text-white">
            Document Preview
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Review your generated document before downloading
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          {/* Document Content Preview */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-h-96 overflow-y-auto">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                {document.content}
              </pre>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Document ID: {document.id}
            </div>
            <Button 
              onClick={onDownload}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              {isAuthenticated ? 'Download Document' : 'Login to Download'}
            </Button>
          </div>
          
          {!isAuthenticated && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                Please sign in or create an account to download your document.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
