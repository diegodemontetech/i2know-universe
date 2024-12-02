export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Termos de Uso</h1>
      
      <div className="prose prose-invert">
        <p className="text-lg">
          O i2know é uma plataforma de e-learning desenvolvida e mantida pela IVEN, 
          destinada exclusivamente ao uso corporativo pelas empresas do grupo VPJ.
        </p>

        <h2 className="text-2xl font-semibold mt-8">1. Uso da Plataforma</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Acesso restrito a colaboradores autorizados do grupo VPJ</li>
          <li>Credenciais de acesso são pessoais e intransferíveis</li>
          <li>Proibido compartilhar acessos ou conteúdos com terceiros</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">2. Propriedade Intelectual</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Todo conteúdo é propriedade exclusiva da IVEN/VPJ</li>
          <li>Proibida reprodução, distribuição ou modificação sem autorização</li>
          <li>Marcas, logos e nomes são protegidos por direitos autorais</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">3. Responsabilidades</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Usuários devem manter segurança das credenciais</li>
          <li>Uso inadequado resultará em suspensão do acesso</li>
          <li>Empresa reserva direito de modificar ou encerrar acesso</li>
        </ul>
      </div>
    </div>
  );
}