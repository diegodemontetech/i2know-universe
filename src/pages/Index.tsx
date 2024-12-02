import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturedCourse = () => (
  <div className="relative h-[70vh] w-full rounded-xl overflow-hidden mb-12">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
    <img
      src="/placeholder.svg"
      alt="Featured Course"
      className="w-full h-full object-cover"
    />
    <div className="absolute bottom-0 left-0 p-8 space-y-4">
      <div className="space-y-2">
        <span className="px-2 py-1 bg-primary/90 text-white text-sm rounded-md">
          Featured
        </span>
        <h1 className="text-4xl font-bold">Master Modern Web Development</h1>
        <p className="text-lg text-gray-300 max-w-2xl">
          Learn the latest technologies and best practices in web development
          through hands-on projects and real-world examples.
        </p>
      </div>
      <div className="flex gap-4">
        <Button className="bg-primary hover:bg-primary/90">
          <Play className="w-4 h-4 mr-2" /> Start Learning
        </Button>
        <Button variant="outline">
          Learn More <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  </div>
);

const CourseCard = ({ title, description }: { title: string; description: string }) => (
  <div className="glass-card p-6 space-y-4 animate-scale-in">
    <div className="aspect-video rounded-lg overflow-hidden bg-card-hover">
      <img
        src="/placeholder.svg"
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
    <div className="h-1 w-full bg-gray-800 rounded">
      <div className="h-full w-1/3 bg-success rounded" />
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <FeaturedCourse />
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">Continue Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <CourseCard
              key={i}
              title={`Course ${i}`}
              description="Learn essential skills and advance your career with our comprehensive courses."
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;