
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
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
      onSignature("");
    }
  };

  return (
    <Card className="p-4 bg-white/5 border-white/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium">{label}</h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={clearSignature}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="border border-white/20 rounded-lg bg-black/20 cursor-crosshair w-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-500 text-sm">
            {!isDrawing && <span className="flex items-center gap-2"><Pen className="w-4 h-4" /> Click and drag to sign</span>}
          </div>
        </div>
      </div>
    </Card>
  );
};
