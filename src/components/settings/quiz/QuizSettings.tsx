import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QuestionFilters } from "./QuestionFilters";
import { QuestionList } from "./QuestionList";
import { QuestionForm } from "./QuestionForm";
import { useToast } from "@/components/ui/use-toast";

export function QuizSettings() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleQuestionCreated = () => {
    setIsDialogOpen(false);
    toast({
      title: "Questão criada",
      description: "A questão foi adicionada com sucesso ao quiz.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center justify-between">
        <QuestionFilters
          selectedCategoryId={selectedCategoryId}
          selectedCourseId={selectedCourseId}
          onCategoryChange={setSelectedCategoryId}
          onCourseChange={setSelectedCourseId}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedCourseId}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Questão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Questão</DialogTitle>
            </DialogHeader>
            <QuestionForm
              quizId={selectedCourseId}
              onSuccess={handleQuestionCreated}
            />
          </DialogContent>
        </Dialog>
      </div>

      <QuestionList selectedCourseId={selectedCourseId} />
    </div>
  );
}