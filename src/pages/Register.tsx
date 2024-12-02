import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Register = () => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <img 
            src="https://i.ibb.co/yRKDrV7/i2know.png" 
            alt="i2Know" 
            className="h-16 object-contain"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          view="sign_up"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#E50914",
                  brandAccent: "#B81D24",
                },
              },
            },
          }}
          localization={{
            variables: {
              sign_up: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Cadastrar",
                loading_button_label: "Cadastrando...",
                link_text: "Já tem uma conta? Entre",
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default Register;