import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/hooks/useChatStore";
import { toast } from "sonner";
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const sendMessage = useChatStore(state => state.sendMessage);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Файлът е твърде голям (макс. 10MB)");
        return;
      }
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
      toast.success(`Файлът "${file.name}" е готов за изпращане`);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if (message.trim() || selectedFile) {
      let attachment;
      if (selectedFile) {
        attachment = {
          name: selectedFile.name,
          url: previewUrl || "#",
          type: selectedFile.type,
          size: selectedFile.size
        };
      }

      sendMessage(message, attachment);
      setMessage("");
      removeFile();
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  return (
    <div className="p-6 bg-background border-t border-border/60 relative">
      {/* File Preview */}
      {selectedFile && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="inline-flex items-center gap-3 p-2 pr-3 bg-muted/60 rounded-xl border border-border/50 group">
            <div className="relative">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate max-w-[200px]">{selectedFile.name}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">
                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type.split('/')[1] || 'file'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all"
              onClick={removeFile}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-24 left-6 z-50 shadow-floating rounded-2xl">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme={Theme.AUTO}
            width={350}
            height={400}
            searchPlaceHolder="Търси емотикон..."
          />
        </div>
      )}

      {/* Input Area */}
      <div className="relative flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative bg-card rounded-2xl border border-border/50 focus-within:border-primary/50 focus-within:shadow-lifted transition-all duration-200">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Left Actions */}
          <div className="absolute left-2 bottom-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl h-9 w-9 transition-colors",
                selectedFile && "text-primary bg-primary/10"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl h-9 w-9 transition-colors",
                showEmojiPicker && "text-accent bg-accent/10"
              )}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedFile ? "Добавете описание..." : "Напишете съобщение..."}
            className="w-full pl-24 pr-4 py-3 bg-transparent border-0 focus-visible:ring-0 text-[15px] placeholder:text-muted-foreground/50 h-auto min-h-[52px] rounded-2xl"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() && !selectedFile}
          size="icon"
          className="h-[52px] w-[52px] rounded-2xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 shrink-0 disabled:opacity-50"
        >
          <Send className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  );
}
