export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Sobre o i2know</h1>
      
      <div className="prose prose-invert">
        <p className="text-lg">
          O i2know é um sistema de aprendizado corporativo desenvolvido pela equipe de tecnologia da IVEN 
          para atender às necessidades específicas de capacitação e desenvolvimento profissional das 
          empresas do grupo VPJ.
        </p>

        <h2 className="text-2xl font-semibold mt-8">Nossa Missão</h2>
        <p>
          Fornecer uma plataforma de aprendizado eficiente e personalizada, promovendo o 
          desenvolvimento contínuo dos colaboradores do grupo VPJ.
        </p>

        <h2 className="text-2xl font-semibold mt-8">Características</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Conteúdo personalizado para nosso negócio</li>
          <li>Sistema de gamificação exclusivo</li>
          <li>Integração com processos internos</li>
          <li>Suporte técnico dedicado</li>
        </ul>
      </div>
    </div>
  );
}