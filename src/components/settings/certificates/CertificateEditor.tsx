import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Save } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Draggable from "react-draggable";
import { variables } from "./certificate-variables";
import { Position } from "./types";

interface CertificateEditorProps {
  imageUrl: string;
  positions: Record<string, Position>;
  onPositionChange: (positions: Record<string, Position>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function CertificateEditor({
  imageUrl,
  positions,
  onPositionChange,
  onCancel,
  onSave,
}: CertificateEditorProps) {
  const [zoom, setZoom] = useState(1);

  const handleDrag = (key: string, e: any, data: Position) => {
    onPositionChange({
      ...positions,
      [key]: { x: data.x, y: data.y },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(z => Math.min(2, z + 0.1))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div 
        className="relative border rounded-lg overflow-hidden" 
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      >
        <AspectRatio ratio={1.5}>
          <img
            src={imageUrl}
            alt="Template do certificado"
            className="w-full h-full object-contain"
          />
          {variables.map(({ id, label, key }) => (
            <Draggable
              key={id}
              position={positions[key] || { x: 0, y: 0 }}
              onDrag={(e, data) => handleDrag(key, e, data)}
              bounds="parent"
            >
              <div className="absolute cursor-move bg-black/80 text-white text-xs px-2 py-1 rounded-md shadow-lg hover:bg-black/90 transition-colors">
                {label}
              </div>
            </Draggable>
          ))}
        </AspectRatio>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {variables.map(({ id, label }) => (
          <Card key={id} className="p-3 text-sm text-center bg-muted">
            {label}
          </Card>
        ))}
      </div>
    </div>
  );
}