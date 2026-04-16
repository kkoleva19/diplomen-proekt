import React, { useState } from 'react';
import { useChatStore } from '@/hooks/useChatStore';
import { Calendar, Clock, BookOpen, Video, FileText, ChevronRight, Filter, Plus, Bell, BellOff, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { AddEventModal } from './AddEventModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function CalendarView() {
    const { events, subjects, currentUser, userReminders, toggleReminder, deleteEvent, channels } = useChatStore();
    const { toast } = useToast();
    const [filter, setFilter] = React.useState<'all' | 'meeting' | 'test' | 'homework'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredEvents = events
        .filter(event => {
            // Basic filter (Meeting, Test, Homework)
            const matchesBasicFilter = filter === 'all' || event.type === filter;
            if (!matchesBasicFilter) return false;

            // Role-based filtering:
            // Students only see events with no classId (general) or events for their specific class.
            // Teachers and Admins see all events.
            if (currentUser.role === 'student') {
                const userClasses = channels.map(c => c.id);
                // Show if event has no class (general) OR if it matches student's classes
                return !event.classId || userClasses.includes(event.classId);
            }

            return true;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const isAuthorized = currentUser.role === 'admin' || currentUser.role === 'teacher';

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'meeting': return <Video className="w-4 h-4" />;
            case 'test': return <FileText className="w-4 h-4" />;
            case 'homework': return <BookOpen className="w-4 h-4" />;
            default: return <Calendar className="w-4 h-4" />;
        }
    };

    const getEventColors = (type: string) => {
        switch (type) {
            case 'meeting': return "bg-blue-100 text-blue-700 border-blue-200";
            case 'test': return "bg-red-100 text-red-700 border-red-200";
            case 'homework': return "bg-emerald-100 text-emerald-700 border-emerald-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getSubjectInfo = (subjectId?: string) => {
        if (!subjectId) return null;
        return subjects.find(s => s.id === subjectId);
    };

    const getChannelInfo = (classId?: string) => {
        if (!classId) return null;
        return channels.find(c => c.id === classId);
    };


    return (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight">Училищен Календар</h1>
                        <p className="text-sm text-slate-500">Вашите предстоящи събития и задачи</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                        {(['all', 'meeting', 'test', 'homework'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all uppercase tracking-wider",
                                    filter === t
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {t === 'all' ? 'Всички' : t === 'meeting' ? 'Срещи' : t === 'test' ? 'Тестове' : 'Домашни'}
                            </button>
                        ))}
                    </div>

                    {isAuthorized && (
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-primary text-white hover:bg-primary/90 rounded-xl h-10 px-4 font-bold flex items-center gap-2 shadow-lg shadow-primary/20 "
                        >
                            <Plus className="w-4 h-4" />
                            Добави събитие
                        </Button>
                    )}
                </div>
            </header>

            <AddEventModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    {filteredEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                                <Filter className="w-10 h-10" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Няма намерени събития</h3>
                            <p className="text-slate-500">Опитайте да промените филтъра</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredEvents.map((event) => {
                                const subject = getSubjectInfo(event.subjectId);
                                const channel = getChannelInfo(event.classId);
                                const eventDate = new Date(event.date);

                                return (
                                    <div
                                        key={event.id}
                                        className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
                                    >
                                        <div className="flex gap-5">
                                            {/* Date Badge */}
                                            <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(eventDate, 'MMM', { locale: bg })}</span>
                                                <span className="text-2xl font-black text-slate-900">{format(eventDate, 'dd')}</span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                            getEventColors(event.type)
                                                        )}>
                                                            <span className="flex items-center gap-1">
                                                                {getEventIcon(event.type)}
                                                                {event.type === 'meeting' ? 'Видео среща' : event.type === 'test' ? 'Тест' : 'Домашно'}
                                                            </span>
                                                        </span>
                                                        {channel && (
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-indigo-50 text-indigo-700 border-indigo-200">
                                                                Клас {channel.name}
                                                            </span>
                                                        )}
                                                        {subject && (
                                                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                {subject.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium shrink-0">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {format(eventDate, 'HH:mm')} ч.
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-1 truncate">
                                                    {event.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 line-clamp-2">
                                                    {event.description}
                                                </p>
                                            </div>

                                            <div className="shrink-0 flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleReminder(event.id);
                                                    }}
                                                    className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                                        (userReminders[currentUser.username || ''] || []).includes(event.id)
                                                            ? "bg-amber-100 text-amber-600 shadow-sm"
                                                            : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                                    )}
                                                    title={(userReminders[currentUser.username || ''] || []).includes(event.id) ? "Напомнянето е активно" : "Включи напомняне"}
                                                >
                                                    {(userReminders[currentUser.username || ''] || []).includes(event.id) ? (
                                                        <Bell className="w-4 h-4 fill-current" />
                                                    ) : (
                                                        <BellOff className="w-4 h-4" />
                                                    )}
                                                </button>

                                                {isAuthorized && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm('Сигурни ли сте, че искате да изтриете това събитие?')) {
                                                                deleteEvent(event.id);
                                                            }
                                                        }}
                                                        className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                                        title="Изтрий събитие"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        if (event.type === 'meeting') {
                                                            toast({
                                                                title: "Стартиране на среща",
                                                                description: `Присъединявате се към: ${event.title}`,
                                                            });
                                                        } else {
                                                            toast({
                                                                title: "Детайли за събитие",
                                                                description: event.description,
                                                            });
                                                        }
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
