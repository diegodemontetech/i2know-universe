import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Draggable from "react-draggable";
import { Upload, ZoomIn, ZoomOut, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Position = {
  x: number;
  y: number;
};

type CertificateTemplate = {
  id: string;
  template_image_url: string;
  logo_position: Position;
  certificate_number_position: Position;
  signature_position: Position;
  date_position: Position;
  course_name_position: Position;
  category_position: Position;
  duration_position: Position;
};

const variables = [
  { id: "logo", label: "Logo da Empresa", key: "logo_position" },
  { id: "number", label: "Número do Certificado", key: "certificate_number_position" },
  { id: "signature", label: "Assinatura", key: "signature_position" },
  { id: "date", label: "Data", key: "date_position" },
  { id: "course", label: "Nome do Curso", key: "course_name_position" },
  { id: "category", label: "Categoria", key: "category_position" },
  { id: "duration", label: "Duração", key: "duration_position" },
];

export function CertificateSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [zoom, setZoom] = useState(1);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 5242880, // 5MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Create object URL for preview
        setPreviewImage(URL.createObjectURL(file));
        
        try {
          const { data, error } = await supabase.storage
            .from('certificates')
            .upload(`template-${Date.now()}`, file);
            
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('certificates')
            .getPublicUrl(data.path);
            
          console.log('Uploaded template:', publicUrl);
          
          // Save template URL and reset positions
          setPositions({});
          toast({
            title: "Template carregado",
            description: "Agora você pode posicionar as variáveis no certificado.",
          });
        } catch (error) {
          console.error('Upload error:', error);
          toast({
            title: "Erro ao fazer upload",
            description: "Ocorreu um erro ao enviar o template. Tente novamente.",
            variant: "destructive",
          });
        }
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<CertificateTemplate>) => {
      const { error } = await supabase
        .from('certificates')
        .upsert({
          ...data,
          template_image_url: previewImage || '', // Add required field
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificate-template'] });
      toast({
        title: "Configurações salvas",
        description: "O template do certificado foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!previewImage) return;
    
    saveMutation.mutate({
      template_image_url: previewImage,
      ...positions,
    });
  };

  const handleDrag = (key: string, e: any, data: { x: number; y: number }) => {
    setPositions(prev => ({
      ...prev,
      [key]: { x: data.x, y: data.y },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Template do Certificado</h2>
        <p className="text-muted-foreground">
          Configure o layout do certificado arrastando os elementos para a posição desejada.
        </p>
      </div>

      {!previewImage ? (
        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Arraste e solte um arquivo de imagem aqui, ou clique para selecionar
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            PNG ou JPG (max. 5MB)
          </p>
        </div>
      ) : (
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
              <Button
                variant="outline"
                onClick={() => {
                  setPreviewImage(null);
                  setPositions({});
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>

          <div className="relative border rounded-lg overflow-hidden" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
            <AspectRatio ratio={1.5}>
              <img
                src={previewImage}
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
                  <div
                    className="absolute cursor-move bg-black/80 text-white text-xs px-2 py-1 rounded-md shadow-lg hover:bg-black/90 transition-colors"
                  >
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
      )}
    </div>
  );
}
