import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CertificateUploaderProps {
  onUploadSuccess: (imageUrl: string) => void;
}

export function CertificateUploader({ onUploadSuccess }: CertificateUploaderProps) {
  const { toast } = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 5242880,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        try {
          console.log('Uploading certificate template:', file.name);
          const { data, error } = await supabase.storage
            .from('certificates')
            .upload(`template-${Date.now()}`, file);
            
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('certificates')
            .getPublicUrl(data.path);
            
          console.log('Template uploaded successfully:', publicUrl);
          onUploadSuccess(publicUrl);
          
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

  return (
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
  );
}