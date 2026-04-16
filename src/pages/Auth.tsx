import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { School, Mail, Lock, User, UserCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useChatStore } from "@/hooks/useChatStore";
import { toast } from "sonner";
import logo from "@/assets/logo/logo.png";

export default function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        role: "student"
    });

    const { login, register } = useChatStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isLogin) {
            // Login
            const success = login(formData.username, formData.password);
            if (success) {
                toast.success("Вход успешен!");
                navigate("/chat");
            } else {
                toast.error("Грешно потребителско име или парола");
            }
        } else {
            // Register
            if (!formData.name || !formData.username || !formData.password) {
                toast.error("Моля попълнете всички полета");
                return;
            }
            const success = register(formData);
            if (success) {
                toast.success("Регистрацията е успешна! Влезте с вашия акаунт.");
                setIsLogin(true);
                setFormData({ ...formData, password: "" });
            } else {
                toast.error("Потребителското име вече съществува");
            }
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* LEFT SIDE - Visual/Branding */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-primary to-accent text-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-2 overflow-hidden border border-white/20">
                            <img src={logo} alt="School Connect Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">School Connect</h1>
                            <p className="text-sm text-white/70 font-medium">ПГКНМА "Проф. Минко Балкански"</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <div>
                        <h2 className="text-4xl font-black mb-4 leading-tight">
                            Модерна платформа<br />за комуникация
                        </h2>
                        <p className="text-lg text-white/80">
                            Свържете се с учители, класни ръководители и администрация. Бързо, сигурно и лесно.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-6">
                        {[
                            { icon: User, label: "Лични съобщения" },
                            { icon: GraduationCap, label: "Класни канали" },
                            { icon: School, label: "Администрация" }
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/10 backdrop-blur-sm text-center">
                                <item.icon className="w-6 h-6 mx-auto mb-2" />
                                <p className="text-xs font-semibold">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-sm text-white/50">
                    © 2024 ПГКНМА "Проф. Минко Балкански" • School Connect
                </p>
            </div>

            {/* RIGHT SIDE - Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center p-1.5 overflow-hidden">
                            <img src={logo} alt="School Connect Logo" className="w-full h-full object-contain brightness-0 invert" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black">School Connect</h1>
                            <p className="text-xs text-muted-foreground">ПГКНМА Варна</p>
                        </div>
                    </div>

                    {/* Form Header */}
                    <div>
                        <h2 className="text-3xl font-black tracking-tight mb-2">
                            {isLogin ? "Добре дошли отново" : "Създайте акаунт"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isLogin
                                ? "Влезте, за да продължите към платформата"
                                : "Попълнете информацията за регистрация"}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold">Име и фамилия</Label>
                                <div className="relative">
                                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Иван Петров"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-11 h-12 bg-muted/50 border-border/50 focus-visible:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-semibold">Потребителско име</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder={isLogin ? "ученик1" : "ivan.petrov"}
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="pl-11 h-12 bg-muted/50 border-border/50 focus-visible:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold">Парола</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-11 h-12 bg-muted/50 border-border/50 focus-visible:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-sm font-semibold">Роля</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                >
                                    <SelectTrigger className="h-12 bg-muted/50 border-border/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Ученик</SelectItem>
                                        <SelectItem value="teacher">Учител</SelectItem>
                                        <SelectItem value="admin">Администратор</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                            {isLogin ? "Вход" : "Регистрация"}
                        </Button>
                    </form>

                    {/* Toggle */}
                    <div className="text-center pt-4">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                        >
                            {isLogin ? (
                                <>Нямате акаунт? <span className="text-primary font-semibold">Регистрирайте се</span></>
                            ) : (
                                <>Вече имате акаунт? <span className="text-primary font-semibold">Влезте</span></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
