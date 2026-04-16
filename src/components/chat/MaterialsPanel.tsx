
import { useState } from "react";
import { useChatStore, Subject, Material } from "@/hooks/useChatStore";
import { Download, FileText, Plus, BookOpen, Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MaterialsPanel() {
    const { subjects, materials, currentUser, addMaterial } = useChatStore();
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setSelectedFile(null);
    };

    const subjectMaterials = selectedSubject
        ? materials.filter(m => m.subjectId === selectedSubject.id)
        : [];

    const getFileIcon = (fileType: string) => {
        const type = fileType.toLowerCase();
        if (type === 'pdf') return '📄';
        if (type === 'docx' || type === 'doc') return '📝';
        if (type === 'pptx' || type === 'ppt') return '📊';
        if (type === 'xlsx' || type === 'xls') return '📈';
        return '📎';
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const handleUpload = () => {
        if (!selectedSubject || !title || !selectedFile) {
            toast.error("Моля попълнете всички задължителни полета");
            return;
        }

        const newMaterial: Omit<Material, "id"> = {
            subjectId: selectedSubject.id,
            title,
            description,
            fileName: selectedFile.name,
            fileType: selectedFile.name.split('.').pop() || 'file',
            fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadedBy: currentUser.name,
            uploadDate: new Date().toISOString().split('T')[0],
            url: URL.createObjectURL(selectedFile) // In a real app, this would be a server URL
        };

        addMaterial(newMaterial);
        toast.success("Материалът е качен успешно!");
        setIsUploadOpen(false);
        resetForm();
    };



    const handleDownload = (material: Material) => {
        // Simple download logic
        const link = document.createElement('a');
        link.href = material.url;
        link.download = material.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.info(`Изтегляне на ${material.fileName}...`);
    };

    const canUpload = currentUser.role === 'teacher' || currentUser.role === 'admin';

    return (
        <div className="flex h-full bg-background">
            {/* Subjects Sidebar */}
            <div className="w-80 border-r border-border bg-card">
                <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold">Учебни материали</h2>
                    </div>

                    <div className="space-y-2">
                        {subjects.map((subject) => {
                            const count = materials.filter(m => m.subjectId === subject.id).length;
                            return (
                                <button
                                    key={subject.id}
                                    onClick={() => setSelectedSubject(subject)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg transition-all duration-200",
                                        "hover:bg-sidebar-accent hover:shadow-soft",
                                        selectedSubject?.id === subject.id
                                            ? "bg-primary text-white shadow-md"
                                            : "bg-muted"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{subject.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold truncate">{subject.name}</div>
                                            <div className={cn(
                                                "text-xs truncate",
                                                selectedSubject?.id === subject.id
                                                    ? "text-white/80"
                                                    : "text-muted-foreground"
                                            )}>
                                                {subject.description}
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "text-xs px-2 py-1 rounded-full font-medium",
                                            selectedSubject?.id === subject.id
                                                ? "bg-white/20 text-white"
                                                : "bg-primary/10 text-primary"
                                        )}>
                                            {count}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Materials Content */}
            <div className="flex-1 flex flex-col">
                {selectedSubject ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-border bg-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{selectedSubject.icon}</span>
                                    <div>
                                        <h3 className="text-2xl font-bold">{selectedSubject.name}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedSubject.description}</p>
                                    </div>
                                </div>
                                {canUpload && (
                                    <Button
                                        onClick={() => setIsUploadOpen(true)}
                                        className="gap-2 shadow-md"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Качи материал
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Materials List */}
                        <div className="flex-1 overflow-auto p-6">
                            {subjectMaterials.length > 0 ? (
                                <div className="grid gap-4">
                                    {subjectMaterials.map((material) => (
                                        <div
                                            key={material.id}
                                            className="bg-card border border-border rounded-xl p-4 hover:shadow-soft transition-all duration-200 hover:border-primary/30"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* File Icon */}
                                                <div className="text-4xl mt-1">
                                                    {getFileIcon(material.fileType)}
                                                </div>

                                                {/* Material Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-lg mb-1">{material.title}</h4>
                                                    {material.description && (
                                                        <p className="text-sm text-muted-foreground mb-3">
                                                            {material.description}
                                                        </p>
                                                    )}
                                                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <FileText className="h-3 w-3" />
                                                            <span>{material.fileName}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">{material.fileSize}</span>
                                                        </div>
                                                        <div>
                                                            Качено от <span className="font-medium">{material.uploadedBy}</span>
                                                        </div>
                                                        <div>
                                                            {formatDate(material.uploadDate)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Download Button */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDownload(material)}
                                                    className="gap-2 hover:bg-primary hover:text-white transition-colors"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Изтегли
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                                    <p className="text-lg font-medium text-muted-foreground">
                                        Няма качени материали
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {canUpload && "Качете първия материал за този предмет"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <BookOpen className="h-24 w-24 text-muted-foreground/30 mb-6" />
                        <h3 className="text-2xl font-bold mb-2">Изберете предмет</h3>
                        <p className="text-muted-foreground max-w-md">
                            Изберете предмет от списъка, за да видите наличните учебни материали
                        </p>
                    </div>
                )}
            </div>

            {/* Upload Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Upload className="h-5 w-5 text-primary" />
                            Качи учебен материал
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="font-semibold">Заглавие</Label>
                            <Input
                                id="title"
                                placeholder="напр. Решаване на квадратични уравнения"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="font-semibold">Описание (незадължително)</Label>
                            <Textarea
                                id="description"
                                placeholder="Кратко описание на съдържанието..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="font-semibold">Файл</Label>
                            <div
                                className={cn(
                                    "border-2 border-dashed border-border rounded-xl p-8 text-center transition-all",
                                    selectedFile ? "bg-primary/5 border-primary/30" : "hover:border-primary/20 hover:bg-muted/50"
                                )}
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                />
                                <Label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    {selectedFile ? (
                                        <>
                                            <FileText className="h-10 w-10 text-primary" />
                                            <span className="font-medium text-sm">{selectedFile.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {(selectedFile.size / 1024).toFixed(1)} KB
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedFile(null);
                                                }}
                                            >
                                                Премахни
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-10 w-10 text-muted-foreground/30" />
                                            <span className="font-medium">Кликнете, за да изберете файл</span>
                                            <span className="text-xs text-muted-foreground">Поддържат се PDF, DOCX, PPTX и др.</span>
                                        </>
                                    )}
                                </Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsUploadOpen(false);
                            resetForm();
                        }}>
                            Отказ
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!title || !selectedFile}
                        >
                            Качи файла
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
