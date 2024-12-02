import { Github } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-sidebar mt-auto py-6 px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img 
            src="https://i.ibb.co/qW3jGcW/i2know-1.png" 
            alt="i2Know Logo" 
            className="h-8 w-8"
          />
          <span className="text-sm text-gray-400">
            © {currentYear} i2Know. Todos os direitos reservados.
          </span>
        </div>
        
        <nav className="flex gap-6">
          <Link to="/sobre" className="text-sm text-gray-400 hover:text-white transition-colors">
            Sobre
          </Link>
          <Link to="/privacidade" className="text-sm text-gray-400 hover:text-white transition-colors">
            Privacidade
          </Link>
          <Link to="/termos" className="text-sm text-gray-400 hover:text-white transition-colors">
            Termos
          </Link>
          <a 
            href="https://github.com/your-repo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}