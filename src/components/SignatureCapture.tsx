
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eraser, Pen } from "lucide-react";

interface SignatureCaptureProps {
  onSignature: (signature: string) => void;
  label: string;
}

export const SignatureCapture = ({ onSignature, label }: SignatureCaptureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000000"; // Black color
        ctx.lineWidth = 2; // Thin marker
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        setContext(ctx);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas && context) {
      const rect = canvas.getBoundingClientRect();
      context.beginPath();
      context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      context.stroke();
      setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    if (isDrawing && context) {
      setIsDrawing(false);
      context.closePath();
      // Convert canvas to base64 and send to parent
      const canvas = canvasRef.current;
      if (canvas) {
        const signatureData = canvas.toDataURL();
        onSignature(signatureData);
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      onSignature("");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-6 bg-white/5 border-white/20 dark:bg-gray-800/50 dark:border-gray-600">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white dark:text-gray-200 font-medium text-lg">{label}</h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={clearSignature}
                className="border-white/20 text-white hover:bg-white/10 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Eraser className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
          
          <div className="relative bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className="w-full h-auto cursor-crosshair bg-white rounded"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm">
                <span className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded">
                  <Pen className="w-4 h-4" /> 
                  Click and drag to sign
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
