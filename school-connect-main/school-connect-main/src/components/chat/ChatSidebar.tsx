
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, MessageCircle, Users, LogOut, Search as SearchIcon, BookOpen, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/hooks/useChatStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo/logo.png";

export function ChatSidebar() {
  const navigate = useNavigate();
  const {
    channels,
    privateChats,
    selectedChat,
    setSelectedChat,
    currentUser,
    currentView,
    setCurrentView,
    logout,
    subjects
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPrivateChats = privateChats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-72 bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-sidebar-border shadow-soft">
      {/* Header - Compact & Modern */}
      <div className="px-6 py-4 border-b border-sidebar-border/60 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/20 p-1.5 overflow-hidden">
            <img src={logo} alt="School Connect" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-sm truncate leading-tight">ПГКНМА</h1>
            <p className="text-[10px] text-muted-foreground truncate font-medium">Проф. Минко Балкански</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="px-4 py-2 border-b border-sidebar-border/40 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView('chat')}
          className={cn(
            "flex-1 shrink-0 min-w-fit px-3 gap-2 rounded-lg h-9 text-xs font-bold transition-all",
            currentView === 'chat'
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:bg-sidebar-accent"
          )}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Чатове
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView('materials')}
          className={cn(
            "flex-1 shrink-0 min-w-fit px-3 gap-2 rounded-lg h-9 text-xs font-bold transition-all",
            currentView === 'materials'
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:bg-sidebar-accent"
          )}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Материали
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView('calendar')}
          className={cn(
            "flex-1 shrink-0 min-w-fit px-3 gap-2 rounded-lg h-9 text-xs font-bold transition-all",
            currentView === 'calendar'
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:bg-sidebar-accent"
          )}
        >
          <Calendar className="w-3.5 h-3.5" />
          Календар
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-sidebar-border/40">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <Input
            placeholder="Търсене..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-muted/40 border-0 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-sm rounded-xl"
          />
        </div>
      </div>

      {/* Channels & Chats */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Subjects Section */}
        <div className="mb-6">
          <div className="px-5 py-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Предмети</span>
          </div>
          <div className="px-2 space-y-0.5">
            {subjects.filter(s =>
              s.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((subject) => (
              <button
                key={subject.id}
                onClick={() => {
                  setSelectedChat(subject.id);
                  setCurrentView('chat');
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                  selectedChat === subject.id && currentView === 'chat'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <span className="shrink-0">{subject.icon}</span>
                <span className="flex-1 truncate">{subject.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Channels Section */}
        <div className="mb-6">
          <div className="px-5 py-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Класове</span>
          </div>
          <div className="px-2 space-y-0.5">
            {filteredChannels.length > 0 ? filteredChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => {
                  setSelectedChat(channel.id);
                  setCurrentView('chat');
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  selectedChat === channel.id && currentView === 'chat'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Hash className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left truncate">{channel.name}</span>
                {channel.unread > 0 && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold min-w-[1.25rem] text-center",
                    selectedChat === channel.id && currentView === 'chat'
                      ? "bg-white text-primary"
                      : "bg-primary text-white"
                  )}>
                    {channel.unread}
                  </span>
                )}
              </button>
            )) : (
              <p className="text-xs text-muted-foreground px-3 py-2">Няма намерени канали</p>
            )}
          </div>
        </div>

        {/* Private Chats Section */}
        <div>
          <div className="px-5 py-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Лични съобщения</span>
          </div>
          <div className="px-2 space-y-0.5">
            {filteredPrivateChats.length > 0 ? filteredPrivateChats.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setSelectedChat(user.id);
                  setCurrentView('chat');
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  selectedChat === user.id && currentView === 'chat'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <div className="relative shrink-0">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                    selectedChat === user.id && currentView === 'chat'
                      ? "bg-white/20 text-white"
                      : "bg-muted text-foreground"
                  )}>
                    {user.avatar}
                  </div>
                  {user.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-online rounded-full border-2 border-sidebar" />
                  )}
                </div>
                <span className="flex-1 text-left truncate">{user.name}</span>
              </button>
            )) : (
              <p className="text-xs text-muted-foreground px-3 py-2">Няма намерени съобщения</p>
            )}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border/60 bg-sidebar-accent/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 mb-3 group cursor-default">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md">
              {currentUser.avatar}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-online rounded-full border-2 border-background" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{currentUser.name}</p>
            <p className="text-[10px] text-muted-foreground truncate font-semibold uppercase tracking-wider">
              {currentUser.role === 'student' ? '12А клас' : currentUser.role === 'teacher' ? 'Учител' : 'Администратор'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-10 font-semibold transition-all"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Изход</span>
        </Button>
      </div>
    </aside>
  );
}
