import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QuestionFilters } from "./quiz/QuestionFilters";
import { QuestionList } from "./quiz/QuestionList";
import { QuestionForm } from "./quiz/QuestionForm";

export function QuizSettings() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <QuestionList selectedCourseId={selectedCourseId} />
    </div>
  );
}