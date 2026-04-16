import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { AdminPanel } from "@/components/chat/AdminPanel";
import { MaterialsPanel } from "@/components/chat/MaterialsPanel";
import { CalendarView } from "@/components/calendar/CalendarView";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/hooks/useChatStore";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { currentView, currentUser, showAdminPanel, events, userReminders } = useChatStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const notifiedEventsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!currentUser.name) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Background reminder checker
  useEffect(() => {
    if (!currentUser.username) return;

    const checkReminders = () => {
      const now = new Date();
      const currentReminders = userReminders[currentUser.username!] || [];

      events.forEach(event => {
        if (currentReminders.includes(event.id)) {
          const eventDate = new Date(event.date);
          const timeDiff = eventDate.getTime() - now.getTime();
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));

          // Notify if event is in the next 30 minutes and hasn't started yet
          if (minutesDiff > 0 && minutesDiff <= 30) {
            if (!notifiedEventsRef.current.has(event.id)) {
              toast({
                title: "Наближаващо събитие!",
                description: `${event.title} започва след ${minutesDiff} минути.`,
                duration: 5000,
              });
              notifiedEventsRef.current.add(event.id);
            }
          } else if (minutesDiff > 30 || minutesDiff < 0) {
            // Reset if event is no longer in the immediate notification window
            notifiedEventsRef.current.delete(event.id);
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [events, userReminders, currentUser.username, toast]);

  if (!currentUser.name) return null;

  return (
    <div className="h-screen flex bg-background overflow-hidden relative">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        showAdminPanel && currentUser.role === 'admin' ? "mr-80" : ""
      )}>
        {currentView === 'chat' ? (
          <>
            <ChatMessages />
            <ChatInput />
          </>
        ) : currentView === 'materials' ? (
          <MaterialsPanel />
        ) : (
          <CalendarView />
        )}
      </div>

      {/* Admin Panel */}
      {currentUser.role === 'admin' && showAdminPanel && (
        <div className="fixed right-0 top-0 bottom-0 z-50 animate-slide-in-right">
          <AdminPanel />
        </div>
      )}
    </div>
  );
};

export default Index;
