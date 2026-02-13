import PhysicsCanvas from "@/components/PhysicsCanvas";
import ScrollStory from "@/components/ScrollStory";
import BackgroundFloatingElements from "@/components/BackgroundFloatingElements";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent relative overflow-x-hidden">
      {/* Background Physics Layer */}
      <PhysicsCanvas>
        <BackgroundFloatingElements />
      </PhysicsCanvas>

      {/* Foreground Scroll Content */}
      <ScrollStory />
    </main>
  );
}
