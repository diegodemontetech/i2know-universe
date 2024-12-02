import { Book } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Ebooks = () => {
  const ebooks = [
    {
      id: 1,
      title: "Guia Completo de React",
      author: "John Doe",
      cover: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      summary: "Um guia abrangente sobre React e suas melhores práticas",
      pages: 250,
      readingTime: "4 horas",
      publishedAt: "2024-01-15",
      categories: ["Programação", "Frontend"],
    },
    // Add more ebooks here
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">E-books</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ebooks.map((ebook) => (
          <Card key={ebook.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <img
                src={ebook.cover}
                alt={ebook.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardTitle className="mt-4">{ebook.title}</CardTitle>
              <CardDescription>por {ebook.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{ebook.summary}</p>
              <div className="flex flex-wrap gap-2">
                {ebook.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex justify-between w-full text-sm text-gray-500">
                <span>{ebook.pages} páginas</span>
                <span>{ebook.readingTime} de leitura</span>
              </div>
              <Button className="w-full">
                <Book className="w-4 h-4 mr-2" />
                Ler Agora
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Ebooks;