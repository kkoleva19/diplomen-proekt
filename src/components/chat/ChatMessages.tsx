import { useRef, useEffect, useState } from "react";
import { Hash, MessageCircle, Search, FileIcon, Download, Flag, Kanban, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore, Message } from "@/hooks/useChatStore";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { VideoCallModal } from "./VideoCallModal";

export function ChatMessages() {
  const { channels, privateChats, messages, selectedChat, addReport, currentUser, subjects } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  const handleReport = (message: Message) => {
    addReport({
      type: "Подозрително съобщение",
      channel: channelName,
      reporter: currentUser.name,
      content: `Докладвано съобщение от ${message.author}: "${message.content}"`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    toast.success("Съобщението е докладвано на администратор");
  };

  const channel = channels.find(c => c.id === selectedChat);
  const userChat = privateChats.find(c => c.id === selectedChat);
  const subjectChat = subjects.find(s => s.id === selectedChat);
  const channelName = channel?.name || userChat?.name || subjectChat?.name || "Изберете канал";

  const chatMessages = messages.filter(msg => msg.channelId === selectedChat);

  const filteredMessages = chatMessages.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header - Clean & Professional */}
      <div className="h-16 border-b border-border/60 flex items-center px-6 gap-4 bg-background shadow-soft sticky top-0 z-10">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          {channel ? <Hash className="w-5 h-5 text-primary" /> :
            subjectChat ? <span className="text-primary font-bold text-lg">{subjectChat.icon}</span> :
              <MessageCircle className="w-5 h-5 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-lg leading-tight">{channelName}</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            {channel && (
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {channel.id === '12A' ? '28' : '15'} участника
              </span>
            )}
            {userChat && (
              <span className={cn(
                "flex items-center gap-1.5 font-semibold",
                userChat.online ? "text-online" : "text-muted-foreground"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", userChat.online ? "bg-online" : "bg-muted-foreground")} />
                {userChat.online ? 'На линия' : 'Извън линия'}
              </span>
            )}
            {subjectChat && (
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Канал на предмета
              </span>
            )}
          </div>
        </div>

        {/* Search & Video Call & Admin Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <Input
              placeholder="Търсене в чата..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/40 border-0 h-9 text-sm focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
            />
          </div>

          <button
            onClick={() => setIsVideoCallOpen(true)}
            className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-all duration-200 active:scale-95 flex items-center gap-2 px-3 border border-primary/10"
            title="Видео връзка"
          >
            <Video className="w-4 h-4" />
            <span className="text-xs font-bold">Видео</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => useChatStore.getState().toggleAdminPanel()}
              className={cn(
                "p-2 rounded-xl transition-all duration-200 active:scale-95",
                useChatStore.getState().showAdminPanel
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              )}
              title="Админ панел"
            >
              <Kanban className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 group",
              message.isOwn && "flex-row-reverse"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-md",
              (message.role === "Учител" || message.role === "Админ")
                ? "bg-primary text-white"
                : "bg-muted text-foreground"
            )}>
              {message.avatar}
            </div>

            {/* Message Content */}
            <div className={cn("flex-1 max-w-[70%]", message.isOwn && "flex flex-col items-end")}>
              {/* Author & Time */}
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className="font-bold text-sm">{message.author}</span>
                {message.role && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wide">
                    {message.role}
                  </span>
                )}
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {message.time}
                </span>
                {!message.isOwn && (
                  <button
                    onClick={() => handleReport(message)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive text-muted-foreground"
                    title="Докладвай"
                  >
                    <Flag className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Message Bubble */}
              <div className={cn(
                "px-4 py-3 rounded-2xl shadow-soft transition-all duration-200 hover:shadow-md",
                message.isOwn
                  ? "bg-primary text-white rounded-tr-md"
                  : "bg-card border border-border/50 rounded-tl-md"
              )}>
                <p className="leading-relaxed text-[15px]">
                  {message.content.split(' ').map((word, i) => {
                    const isUrl = word.match(/^(https?:\/\/[^\s]+)/g);
                    if (isUrl) {
                      return <a key={i} href={word} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 break-all">{word} </a>;
                    }
                    return word + ' ';
                  })}
                </p>

                {/* File Attachment */}
                {message.attachment && (
                  <div className={cn(
                    "mt-2 p-2 rounded-xl border backdrop-blur-sm transition-all",
                    message.isOwn
                      ? "bg-white/10 border-white/20 hover:bg-white/15"
                      : "bg-secondary/30 border-border/50 hover:bg-secondary/50"
                  )}>
                    {message.attachment.type.startsWith('image/') ? (
                      <div className="space-y-1.5">
                        <img
                          src={message.attachment.url}
                          alt={message.attachment.name}
                          className="max-w-full rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                        />
                        <p className="text-[10px] font-medium opacity-60 px-1 truncate">
                          {message.attachment.name}
                        </p>
                      </div>
                    ) : (
                      <a
                        href={message.attachment.url}
                        download={message.attachment.name}
                        className="flex items-center gap-3 group/file"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover/file:bg-primary group-hover/file:text-white transition-colors">
                          <FileIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate group-hover/file:underline">
                            {message.attachment.name}
                          </p>
                          <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">
                            {(message.attachment.size / 1024).toFixed(1)} KB • {message.attachment.type.split('/')[1] || 'file'}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover/file:opacity-100 transition-opacity">
                          <Download className="w-4 h-4" />
                        </div>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} className="h-4" />
      </div>

      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        title={channelName}
      />
    </div>
  );
}
