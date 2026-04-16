import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, Video, FileText, Plus } from 'lucide-react';
import { useChatStore } from '@/hooks/useChatStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
    const { addEvent, subjects, channels } = useChatStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState<'meeting' | 'test' | 'homework'>('meeting');
    const [subjectId, setSubjectId] = useState('');
    const [classId, setClassId] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Combine date and time
        const eventDate = new Date(`${date}T${time}`);

        addEvent({
            title,
            description,
            date: eventDate.toISOString(),
            type,
            subjectId: subjectId || undefined,
            classId: classId || undefined
        });

        // Reset form and close
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setType('meeting');
        setSubjectId('');
        setClassId('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Ново събитие</h2>
                            <p className="text-xs text-slate-500 font-medium">Добавете задача към календара</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Заглавие</label>
                        <Input
                            required
                            placeholder="напр. Класна работа по Математика"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-xl border-slate-200 focus:ring-primary/20"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Описание</label>
                        <textarea
                            placeholder="Кратко описание на събитието..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[100px] px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        />
                    </div>

                    {/* Type Selection */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Тип събитие</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['meeting', 'test', 'homework'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                                        type === t
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                                    )}
                                >
                                    {t === 'meeting' && <Video className="w-5 h-5" />}
                                    {t === 'test' && <FileText className="w-5 h-5" />}
                                    {t === 'homework' && <BookOpen className="w-5 h-5" />}
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                        {t === 'meeting' ? 'Среща' : t === 'test' ? 'Тест' : 'Домашно'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Дата
                            </label>
                            <Input
                                required
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="rounded-xl border-slate-200 h-11"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Час
                            </label>
                            <Input
                                required
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="rounded-xl border-slate-200 h-11"
                            />
                        </div>
                    </div>

                    {/* Class & Subject */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Клас (незадължително)</label>
                            <select
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                                className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            >
                                <option value="">Всички класове</option>
                                {channels.map((channel) => (
                                    <option key={channel.id} value={channel.id}>
                                        {channel.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Предмет (незадължително)</label>
                            <select
                                value={subjectId}
                                onChange={(e) => setSubjectId(e.target.value)}
                                className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            >
                                <option value="">Изберете предмет...</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border-slate-200 font-bold hover:bg-slate-50"
                        >
                            Отказ
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                        >
                            Запази
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
