import { Clock, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  order_index: number;
  quizzes: Array<{
    id: string;
    title: string;
  }>;
}

interface Course {
  title: string;
  duration: number;
  difficulty: string;
}

interface LessonListProps {
  course: Course;
  lessons: Lesson[];
  selectedLesson: Lesson | null;
  progress?: { progress: number } | null;
  onSelectLesson: (lesson: Lesson) => void;
}

export function LessonList({ 
  course, 
  lessons, 
  selectedLesson, 
  progress, 
  onSelectLesson 
}: LessonListProps) {
  return (
    <div className="w-80 bg-card rounded-lg">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">{course.title}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Clock className="w-4 h-4" />
          <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
          <BarChart className="w-4 h-4 ml-2" />
          <span>{course.difficulty}</span>
        </div>
        {progress && (
          <div className="mt-4">
            <Progress value={progress.progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {progress.progress}% completo
            </p>
          </div>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="p-4 space-y-2">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedLesson?.id === lesson.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{lesson.title}</span>
                {lesson.quizzes.length > 0 && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    Quiz
                  </span>
                )}
              </div>
              {lesson.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {lesson.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}