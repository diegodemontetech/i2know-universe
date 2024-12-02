import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProgressFooter } from "@/components/ui/progress-footer";

interface BookReaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ebook: {
    id: string;
    title: string;
    pdf_url: string | null;
    pages: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function BookReader({ 
  open, 
  onOpenChange, 
  ebook, 
  currentPage, 
  onPageChange 
}: BookReaderProps) {
  const [page, setPage] = useState(currentPage);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!open) {
      onPageChange(page);
    }
  }, [open, page, onPageChange]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < ebook.pages) {
      setPage(page + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{ebook.title}</h2>
          </div>

          <div className="flex-1 relative">
            {ebook.pdf_url && isVisible && (
              <iframe
                src={`${ebook.pdf_url}#page=${page}`}
                className="w-full h-full"
                title={ebook.title}
              />
            )}
          </div>

          <ProgressFooter
            metrics={{
              totalPages: ebook.pages,
              currentPage: page,
              progressPercentage: (page / ebook.pages) * 100,
            }}
            isVisible={isVisible}
            onToggleVisibility={() => setIsVisible(!isVisible)}
          />

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={page >= ebook.pages}
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}