export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Política de Privacidade</h1>
      
      <div className="prose prose-invert">
        <h2 className="text-2xl font-semibold">1. Coleta de Dados</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Informações de perfil profissional</li>
          <li>Dados de uso e progresso educacional</li>
          <li>Registros de acesso e interações</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">2. Uso dos Dados</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Análise de desempenho e progresso</li>
          <li>Personalização da experiência de aprendizado</li>
          <li>Relatórios gerenciais internos</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">3. Proteção</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Dados armazenados em ambiente seguro</li>
          <li>Acesso restrito a pessoal autorizado</li>
          <li>Conformidade com LGPD</li>
        </ul>
      </div>
    </div>
  );
}