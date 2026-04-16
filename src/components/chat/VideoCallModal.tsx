import { X, Video, Mic, MicOff, VideoOff, PhoneOff, Maximize, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface VideoCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

export function VideoCallModal({ isOpen, onClose, title }: VideoCallModalProps) {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isOpen) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [isOpen]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 mx-4">
                {/* Main Video Area (Simulator) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {isVideoOff ? (
                        <div className="flex flex-col items-center gap-4 text-white/50">
                            <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center">
                                <User className="w-12 h-12" />
                            </div>
                            <span className="text-sm font-medium">Камерата е изключена</span>
                        </div>
                    ) : (
                        <div className="relative w-full h-full overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                                alt="Video Placeholder"
                                className="w-full h-full object-cover opacity-50 contrast-125 blur-[2px]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-white text-center">
                                <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md border border-primary/50 flex items-center justify-center mb-4 animate-pulse">
                                    <Video className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black mb-1">Видео връзка</h3>
                                <p className="text-white/70 font-medium">{title}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Small Self View */}
                <div className="absolute top-6 right-6 w-48 aspect-video bg-neutral-800 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&q=80"
                        alt="Self View"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Header/Info */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-white text-xs font-bold tracking-wider">{formatTime(timer)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-4 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsMuted(!isMuted)}
                        className={cn(
                            "w-12 h-12 rounded-2xl transition-all duration-200",
                            isMuted ? "bg-red-500 text-white hover:bg-red-600" : "bg-neutral-800 text-white hover:bg-neutral-700"
                        )}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={cn(
                            "w-12 h-12 rounded-2xl transition-all duration-200",
                            isVideoOff ? "bg-red-500 text-white hover:bg-red-600" : "bg-neutral-800 text-white hover:bg-neutral-700"
                        )}
                    >
                        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </Button>

                    <Button
                        size="icon"
                        className="w-14 h-14 rounded-2xl bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/40 transition-transform active:scale-95"
                        onClick={onClose}
                    >
                        <PhoneOff className="w-6 h-6" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        className="w-12 h-12 rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700"
                    >
                        <Maximize className="w-5 h-5" />
                    </Button>
                </div>

                {/* Exit Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 lg:hidden p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
