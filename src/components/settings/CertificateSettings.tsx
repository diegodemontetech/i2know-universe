import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CertificateUploader } from "./certificates/CertificateUploader";
import { CertificateEditor } from "./certificates/CertificateEditor";
import { Position } from "./certificates/types";

export function CertificateSettings() {
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, Position>>({});

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!previewImage) return;
      
      console.log('Saving certificate template positions:', positions);
      const { error } = await supabase
        .from('certificates')
        .upsert({
          template_image_url: previewImage,
          ...positions,
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Template do Certificado</h2>
        <p className="text-muted-foreground">
          Configure o layout do certificado arrastando os elementos para a posição desejada.
        </p>
      </div>

      {!previewImage ? (
        <CertificateUploader onUploadSuccess={setPreviewImage} />
      ) : (
        <CertificateEditor
          imageUrl={previewImage}
          positions={positions}
          onPositionChange={setPositions}
          onCancel={() => {
            setPreviewImage(null);
            setPositions({});
          }}
          onSave={() => saveMutation.mutate()}
        />
      )}
    </div>
  );
}