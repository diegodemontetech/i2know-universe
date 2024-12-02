import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuestionEdit } from "./QuestionEdit";

interface QuestionItemProps {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export function QuestionItem({ 
  id, 
  question, 
  options, 
  correctAnswer, 
  onDelete,
  onUpdate 
}: QuestionItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
      <div className="flex-1">
        <h4 className="font-medium">{question}</h4>
        <div className="mt-2 space-y-1">
          {options.map((option: string, index: number) => (
            <p
              key={index}
              className={`text-sm ${
                option === correctAnswer
                  ? "text-green-500 font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {option}
            </p>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Questão</DialogTitle>
            </DialogHeader>
            <QuestionEdit
              questionId={id}
              initialData={{
                question,
                options,
                correct_answer: correctAnswer,
              }}
              onSuccess={onUpdate}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir questão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(id)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}