import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
    id: string;
    author: string;
    avatar: string;
    content: string;
    time: string;
    isOwn?: boolean;
    role?: string;
    channelId: string;
    attachment?: {
        name: string;
        url: string;
        type: string;
        size: number;
    };
}

export interface Channel {
    id: string;
    name: string;
    unread: number;
}

export interface User {
    id: string;
    name: string;
    online: boolean;
    avatar: string;
}

export interface Report {
    id: string;
    type: string;
    channel: string;
    reporter: string;
    content: string;
    time: string;
}

export interface Log {
    id: string;
    action: string;
    user: string;
    time: string;
    type: 'login' | 'logout' | 'join';
}

export interface Subject {
    id: string;
    name: string;
    icon: string;
    description: string;
    color: string;
}

export interface Material {
    id: string;
    subjectId: string;
    title: string;
    fileName: string;
    fileType: string;
    fileSize: string;
    uploadedBy: string;
    uploadDate: string;
    url: string;
    description?: string;
}

export interface RegisteredUser {
    username: string;
    password: string;
    name: string;
    role: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    date: string; // ISO format
    type: 'meeting' | 'test' | 'homework';
    subjectId?: string;
    classId?: string;
}

interface ChatState {
    currentUser: {
        name: string;
        avatar: string;
        role: string;
        username?: string;
    };
    selectedChat: string;
    currentView: 'chat' | 'materials' | 'calendar';
    channels: Channel[];
    privateChats: User[];
    messages: Message[];
    reports: Report[];
    logs: Log[];
    registeredUsers: RegisteredUser[];
    subjects: Subject[];
    materials: Material[];
    events: CalendarEvent[];
    userReminders: Record<string, string[]>; // username -> eventIds[]

    setUser: (name: string, role: string, username: string) => void;
    logout: () => void;
    setCurrentView: (view: 'chat' | 'materials' | 'calendar') => void;
    setSelectedChat: (chatId: string) => void;
    sendMessage: (content: string, attachment?: Message["attachment"]) => void;
    addLog: (log: Omit<Log, "id">) => void;
    muteReport: (reportId: string) => void;
    ignoreReport: (reportId: string) => void;
    blockUser: (reportId: string) => void;
    markChannelAsRead: (channelId: string) => void;
    register: (userData: RegisteredUser) => boolean;
    login: (username: string, password: string) => boolean;
    addMaterial: (material: Omit<Material, "id">) => void;
    addReport: (report: Omit<Report, "id">) => void;
    addEvent: (event: Omit<CalendarEvent, "id">) => void;
    deleteEvent: (eventId: string) => void;
    toggleReminder: (eventId: string) => void;
    showAdminPanel: boolean;
    toggleAdminPanel: () => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            currentUser: {
                name: "",
                avatar: "",
                role: ""
            },
            selectedChat: "12A",
            currentView: 'chat',
            channels: [],
            privateChats: [],
            messages: [],
            events: [],
            userReminders: {},
            reports: [
                {
                    id: "1",
                    type: "spam",
                    channel: "12A",
                    reporter: "Мария К.",
                    content: "Спам съобщение от потребител",
                    time: "преди 5 мин"
                },
                {
                    id: "2",
                    type: "inappropriate",
                    channel: "Роботика",
                    reporter: "Иван П.",
                    content: "Неподходящ език",
                    time: "преди 15 мин"
                }
            ],
            logs: [
                { id: "1", action: "Вход", user: "Иван Димитров", time: "08:30", type: "login" },
                { id: "2", action: "Изход", user: "Петър Георгиев", time: "08:25", type: "logout" },
                { id: "3", action: "Присъединяване към #12A", user: "Мария Костова", time: "08:20", type: "join" },
                { id: "4", action: "Вход", user: "Г-жа Петрова", time: "08:15", type: "login" },
            ],
            registeredUsers: [
                { username: "todor", password: "123", name: "Тодор Иванов", role: "student" },
                { username: "petrova", password: "123", name: "Г-жа Петрова", role: "teacher" },
                { username: "admin", password: "123", name: "Директор Стоянов", role: "admin" }
            ],

            subjects: [
                {
                    id: "math",
                    name: "Математика",
                    icon: "📐",
                    description: "Алгебра, Геометрия, Анализ (12 клас)",
                    color: "bg-blue-500"
                },
                {
                    id: "soft_eng",
                    name: "Софтуерно инженерство",
                    icon: "🏗️",
                    description: "Agile, SCRUM, Design Patterns",
                    color: "bg-slate-700"
                },
                {
                    id: "internet_prog",
                    name: "Интернет програмиране",
                    icon: "🌐",
                    description: "React, Node.js, REST API",
                    color: "bg-sky-500"
                },
                {
                    id: "func_prog",
                    name: "Функционално програмиране",
                    icon: "λ",
                    description: "Haskell, Lambda Calculus",
                    color: "bg-indigo-600"
                },
                {
                    id: "algo_struct",
                    name: "Алгоритми и структури от данни",
                    icon: "🌳",
                    description: "Графи, Дървета, Big O",
                    color: "bg-emerald-600"
                },
                {
                    id: "bulgarian",
                    name: "Български език",
                    icon: "📚",
                    description: "Литература и ДЗИ подготовка",
                    color: "bg-red-500"
                },
                {
                    id: "english",
                    name: "Английски език",
                    icon: "🌍",
                    description: "C1/C2 Level, IELTS Preparation",
                    color: "bg-indigo-500"
                }
            ],
            materials: [],

            register: (userData) => {
                const users = get().registeredUsers;
                if (users.find(u => u.username === userData.username)) return false;

                get().addLog({
                    action: "Нова регистрация",
                    user: userData.name,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'join'
                });

                set((state) => ({ registeredUsers: [...state.registeredUsers, userData] }));
                return true;
            },

            login: (username, password) => {
                const user = get().registeredUsers.find(u => u.username === username && u.password === password);
                if (user) {
                    get().setUser(user.name, user.role, user.username);
                    get().addLog({
                        action: "Вход в системата",
                        user: user.name,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: 'login'
                    });
                    return true;
                }
                return false;
            },

            setUser: (name, role, username) => set((state) => {
                let roleChannels = [];
                let rolePrivateChats: User[] = [];
                let roleMessages: Message[] = [];

                // Base 12A Messages (Shared)
                const class12AMessages = [
                    {
                        id: "1",
                        author: "Г-жа Петрова",
                        avatar: "ГП",
                        content: "Добро утро на всички! Напомням, че днес имаме класна работа по математика. Подгответе се добре! 📚",
                        time: "08:30",
                        role: "Учител",
                        channelId: "12A"
                    },
                    {
                        id: "2",
                        author: "Иван Димитров",
                        avatar: "ИД",
                        content: "Благодаря за напомнянето! Колко време ще имаме за решаване?",
                        time: "08:35",
                        channelId: "12A"
                    },
                    {
                        id: "3",
                        author: "Г-жа Петрова",
                        avatar: "ГП",
                        content: "45 минути, както обикновено. Ще бъде върху функции и производни.",
                        time: "08:36",
                        role: "Учител",
                        channelId: "12A"
                    },
                    {
                        id: "4",
                        author: "Мария Костова",
                        avatar: "МК",
                        content: "А можем ли да използваме калкулатор?",
                        time: "08:40",
                        channelId: "12A"
                    },
                    {
                        id: "5",
                        author: "Г-жа Петрова",
                        avatar: "ГП",
                        content: "Да, разбира се. Калкулаторите са разрешени.",
                        time: "08:41",
                        role: "Учител",
                        channelId: "12A"
                    },
                    {
                        id: "6",
                        author: "Георги Стоянов",
                        avatar: "ГС",
                        content: "Благодаря! Ще се подготвя усърдно.",
                        time: "08:45",
                        channelId: "12A"
                    },
                ];

                // 11A Class Messages
                const class11AMessages = [
                    {
                        id: "11a_1",
                        author: "Г-н Иванов",
                        avatar: "ГИ",
                        content: "Здравейте! Днес ще обсъдим алгоритми за сортиране. Подгответе се с примери.",
                        time: "09:00",
                        role: "Учител",
                        channelId: "11A"
                    },
                    {
                        id: "11a_2",
                        author: "Петър Атанасов",
                        avatar: "ПА",
                        content: "Ще има ли практически задачи?",
                        time: "09:10",
                        channelId: "11A"
                    },
                    {
                        id: "11a_3",
                        author: "Г-н Иванов",
                        avatar: "ГИ",
                        content: "Да, ще имаме упражнения с QuickSort и MergeSort.",
                        time: "09:12",
                        role: "Учител",
                        channelId: "11A"
                    },
                ];

                // 12B Class Messages
                const class12BMessages = [
                    {
                        id: "12b_1",
                        author: "Г-жа Димитрова",
                        avatar: "ГД",
                        content: "Вчера обсъдихме бази данни. Днес продължаваме с SQL заявки.",
                        time: "10:00",
                        role: "Учител",
                        channelId: "12B"
                    },
                    {
                        id: "12b_2",
                        author: "Николай Петров",
                        avatar: "НП",
                        content: "Ще има ли практика с MySQL?",
                        time: "10:05",
                        channelId: "12B"
                    },
                ];

                // 10A Class Messages
                const class10AMessages = [
                    {
                        id: "10a_1",
                        author: "Г-жа Василева",
                        avatar: "ГВ",
                        content: "Здравейте, класе! Днес започваме HTML и CSS основи.",
                        time: "11:00",
                        role: "Учител",
                        channelId: "10A"
                    },
                    {
                        id: "10a_2",
                        author: "Елена Маринова",
                        avatar: "ЕМ",
                        content: "Това много ме интересува! 🎨",
                        time: "11:05",
                        channelId: "10A"
                    },
                ];

                // Robotics Messages
                const roboticsMessages = [
                    {
                        id: "r1",
                        author: "Александър Симеонов",
                        avatar: "АС",
                        content: "Здравейте, отбор! Имаме ли всичко необходимо за състезанието в събота?",
                        time: "14:00",
                        channelId: "robotics"
                    },
                    {
                        id: "r2",
                        author: "Елена Василева",
                        avatar: "ЕВ",
                        content: "Трябва да проверим батериите и сензорите още веднъж.",
                        time: "14:15",
                        channelId: "robotics"
                    },
                    {
                        id: "r3",
                        author: "Г-н Георгиев",
                        avatar: "ГГ",
                        content: "Добра идея! Ще направим финален тест в четвъртък.",
                        time: "14:20",
                        role: "Учител",
                        channelId: "robotics"
                    },
                ];

                // Web Development Messages
                const webDevMessages = [
                    {
                        id: "wd1",
                        author: "Г-н Стефанов",
                        avatar: "ГСТ",
                        content: "Днес ще започнем с React hooks - useState и useEffect.",
                        time: "13:00",
                        role: "Учител",
                        channelId: "webdev"
                    },
                    {
                        id: "wd2",
                        author: "Виктор Петков",
                        avatar: "ВП",
                        content: "Най-после! Чакахме този момент! 💻",
                        time: "13:05",
                        channelId: "webdev"
                    },
                ];

                // Teachers Channel Messages
                const teachersMessages = [
                    {
                        id: "t1",
                        author: "Директор Стоянов",
                        avatar: "ДС",
                        content: "Колеги, моля попълнете дневниците до края на седмицата.",
                        time: "10:00",
                        role: "Админ",
                        channelId: "teachers"
                    },
                    {
                        id: "t2",
                        author: "Г-ца Димитрова",
                        avatar: "ГД",
                        content: "Разбрано, ще го направя днес.",
                        time: "10:05",
                        role: "Учител",
                        channelId: "teachers"
                    },
                    {
                        id: "t3",
                        author: "Г-н Иванов",
                        avatar: "ГИ",
                        content: "Има ли нови указания за изпитите?",
                        time: "10:10",
                        role: "Учител",
                        channelId: "teachers"
                    },
                ];

                // Private Chat Messages
                const ivanMessages = [
                    {
                        id: "p1",
                        author: "Иван Петров",
                        avatar: "ИП",
                        content: "Здрасти, свободен ли си довечера?",
                        time: "09:00",
                        channelId: "ivan"
                    },
                    {
                        id: "p2",
                        author: "Иван Петров",
                        avatar: "ИП",
                        content: "Искам да те питам нещо за проекта.",
                        time: "09:01",
                        channelId: "ivan"
                    }
                ];

                const mariaMessages = [
                    {
                        id: "pm1",
                        author: "Мария Костова",
                        avatar: "МК",
                        content: "Изпратих ти материалите за урока.",
                        time: "12:00",
                        channelId: "maria"
                    },
                ];

                const dimitarMessages = [
                    {
                        id: "pd1",
                        author: "Димитър Георгиев",
                        avatar: "ДГ",
                        content: "Виждам те в библиотеката след 4-ти час?",
                        time: "10:30",
                        channelId: "dimitar"
                    },
                ];

                const annaMessages = [
                    {
                        id: "pa1",
                        author: "Анна Николова",
                        avatar: "АН",
                        content: "Благодаря за помощта вчера! 🙏",
                        time: "08:00",
                        channelId: "anna"
                    },
                ];

                const petkoMessages = [
                    {
                        id: "pp1",
                        author: "Петко Тодоров",
                        avatar: "ПТ",
                        content: "Готов ли си за проекта утре?",
                        time: "15:00",
                        channelId: "petko"
                    },
                ];

                const teacherPetrovaMessages = [
                    {
                        id: "tp1",
                        author: "Г-жа Петрова",
                        avatar: "ГП",
                        content: "Здравейте! Кога можете да минете за консултация?",
                        time: "11:30",
                        role: "Учител",
                        channelId: "teacher_petrova"
                    },
                ];

                const teacherIvanovMessages = [
                    {
                        id: "ti1",
                        author: "Г-н Иванов",
                        avatar: "ГИ",
                        content: "Изпратих ви задачите на имейла.",
                        time: "09:30",
                        role: "Учител",
                        channelId: "teacher_ivanov"
                    },
                ];

                if (role === 'student') {
                    roleChannels = [
                        { id: "12A", name: "12А клас", unread: 3 },
                        { id: "robotics", name: "Роботика", unread: 2 },
                        { id: "webdev", name: "Web Development", unread: 1 },
                    ];
                    rolePrivateChats = [
                        { id: "ivan", name: "Иван Петров", online: true, avatar: "ИП" },
                        { id: "maria", name: "Мария Костова", online: false, avatar: "МК" },
                        { id: "dimitar", name: "Димитър Георгиев", online: true, avatar: "ДГ" },
                        { id: "anna", name: "Анна Николова", online: true, avatar: "АН" },
                        { id: "petko", name: "Петко Тодоров", online: false, avatar: "ПТ" },
                        { id: "teacher_petrova", name: "Г-жа Петрова", online: true, avatar: "ГП" },
                        { id: "teacher_ivanov", name: "Г-н Иванов", online: false, avatar: "ГИ" },
                    ];
                    roleMessages = [
                        ...class12AMessages,
                        ...roboticsMessages,
                        ...webDevMessages,
                        ...ivanMessages,
                        ...mariaMessages,
                        ...dimitarMessages,
                        ...annaMessages,
                        ...petkoMessages,
                        ...teacherPetrovaMessages,
                        ...teacherIvanovMessages,
                    ];
                } else if (role === 'teacher') {
                    roleChannels = [
                        { id: "12A", name: "12А клас", unread: 0 },
                        { id: "11A", name: "11А клас", unread: 1 },
                        { id: "12B", name: "12Б клас", unread: 0 },
                        { id: "10A", name: "10А клас", unread: 0 },
                        { id: "robotics", name: "Роботика", unread: 0 },
                        { id: "webdev", name: "Web Development", unread: 0 },
                        { id: "teachers", name: "Учители", unread: 2 },
                    ];
                    rolePrivateChats = [
                        { id: "student_ivan", name: "Иван Димитров", online: true, avatar: "ИД" },
                        { id: "student_maria", name: "Мария Костова", online: false, avatar: "МК" },
                        { id: "student_todor", name: "Тодор Иванов", online: true, avatar: "ТИ" },
                        { id: "teacher_ivanov", name: "Г-н Иванов", online: true, avatar: "ГИ" },
                        { id: "teacher_dimitrova", name: "Г-жа Димитрова", online: false, avatar: "ГД" },
                    ];
                    roleMessages = [
                        ...class12AMessages,
                        ...class11AMessages,
                        ...class12BMessages,
                        ...class10AMessages,
                        ...roboticsMessages,
                        ...webDevMessages,
                        ...teachersMessages,
                        // Student Ivan chat
                        {
                            id: "ts1",
                            author: "Иван Димитров",
                            avatar: "ИД",
                            content: "Добър ден, г-жо! Имам въпрос относно домашното.",
                            time: "14:00",
                            channelId: "student_ivan"
                        },
                        {
                            id: "ts2",
                            author: "Иван Димитров",
                            avatar: "ИД",
                            content: "Второто упражнение не мога да го разбера.",
                            time: "14:01",
                            channelId: "student_ivan"
                        },
                        {
                            id: "ts3",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Здравей, Иване! Кое точно е неясно?",
                            time: "14:15",
                            isOwn: true,
                            role: "Учител",
                            channelId: "student_ivan"
                        },
                        {
                            id: "ts4",
                            author: "Иван Димитров",
                            avatar: "ИД",
                            content: "Как да намеря производната на логаритмична функция?",
                            time: "14:17",
                            channelId: "student_ivan"
                        },
                        {
                            id: "ts5",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Използваш формулата (ln x)' = 1/x. Погледни примери от урока.",
                            time: "14:20",
                            isOwn: true,
                            role: "Учител",
                            channelId: "student_ivan"
                        },
                        // Student Maria chat
                        {
                            id: "tm1",
                            author: "Мария Костова",
                            avatar: "МК",
                            content: "Благодаря за допълнителните материали!",
                            time: "11:00",
                            channelId: "student_maria"
                        },
                        {
                            id: "tm2",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Няма защо! Успех с подготовката.",
                            time: "11:05",
                            isOwn: true,
                            role: "Учител",
                            channelId: "student_maria"
                        },
                        {
                            id: "tm3",
                            author: "Мария Костова",
                            avatar: "МК",
                            content: "Мога ли да дойда за консултация утре след 3-ти час?",
                            time: "11:10",
                            channelId: "student_maria"
                        },
                        {
                            id: "tm4",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Разбира се! Ще те очаквам в кабинет 205.",
                            time: "11:12",
                            isOwn: true,
                            role: "Учител",
                            channelId: "student_maria"
                        },
                        // Student Todor chat
                        {
                            id: "tt1",
                            author: "Тодор Василев",
                            avatar: "ТВ",
                            content: "Днес ще дойда за консултация.",
                            time: "08:30",
                            channelId: "student_todor"
                        },
                        {
                            id: "tt2",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Добре, Тодоре. След колко часа ще си свободен?",
                            time: "08:35",
                            isOwn: true,
                            role: "Учител",
                            channelId: "student_todor"
                        },
                        {
                            id: "tt3",
                            author: "Тодор Василев",
                            avatar: "ТВ",
                            content: "След 5-ти час съм свободен.",
                            time: "08:40",
                            channelId: "student_todor"
                        },
                        {
                            id: "tt4",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Перфектно! До тогава.",
                            time: "08:42",
                            isOwn: true,
                            role: "Учител",
                            channelId: "student_todor"
                        },
                        // Teacher Ivanov chat
                        {
                            id: "ti1",
                            author: "Г-н Иванов",
                            avatar: "ГИ",
                            content: "Добър ден! Кога може да се видим за методическата среща?",
                            time: "10:00",
                            role: "Учител",
                            channelId: "teacher_ivanov"
                        },
                        {
                            id: "ti2",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Здравейте! Утре след 14:00 часа съм свободна.",
                            time: "10:15",
                            isOwn: true,
                            role: "Учител",
                            channelId: "teacher_ivanov"
                        },
                        {
                            id: "ti3",
                            author: "Г-н Иванов",
                            avatar: "ГИ",
                            content: "Чудесно! Ще подготвя материалите.",
                            time: "10:20",
                            role: "Учител",
                            channelId: "teacher_ivanov"
                        },
                        {
                            id: "ti4",
                            author: "Г-н Иванов",
                            avatar: "ГИ",
                            content: "Има ли нещо специфично, което искате да обсъдим?",
                            time: "10:22",
                            role: "Учител",
                            channelId: "teacher_ivanov"
                        },
                        {
                            id: "ti5",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Да, бих искала да обсъдим новата програма за 12 клас.",
                            time: "10:25",
                            isOwn: true,
                            role: "Учител",
                            channelId: "teacher_ivanov"
                        },
                        // Teacher Dimitrova chat
                        {
                            id: "td1",
                            author: "Г-жа Димитрова",
                            avatar: "ГД",
                            content: "Здравей! Можеш ли да ме замениш утре 2-ри час?",
                            time: "16:00",
                            role: "Учител",
                            channelId: "teacher_dimitrova"
                        },
                        {
                            id: "td2",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Добър ден! За кой клас е часът?",
                            time: "16:10",
                            isOwn: true,
                            role: "Учител",
                            channelId: "teacher_dimitrova"
                        },
                        {
                            id: "td3",
                            author: "Г-жа Димитрова",
                            avatar: "ГД",
                            content: "За 11Б клас, математика.",
                            time: "16:12",
                            role: "Учител",
                            channelId: "teacher_dimitrova"
                        },
                        {
                            id: "td4",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Да, разбира се. Какво трябва да преподавам?",
                            time: "16:15",
                            isOwn: true,
                            role: "Учител",
                            channelId: "teacher_dimitrova"
                        },
                        {
                            id: "td5",
                            author: "Г-жа Димитрова",
                            avatar: "ГД",
                            content: "Упражнения по тригонометрия. Благодаря предварително! 🙏",
                            time: "16:18",
                            role: "Учител",
                            channelId: "teacher_dimitrova"
                        }
                    ];
                } else if (role === 'admin') {
                    roleChannels = [
                        { id: "12A", name: "12А клас", unread: 0 },
                        { id: "11A", name: "11А клас", unread: 0 },
                        { id: "12B", name: "12Б клас", unread: 0 },
                        { id: "10A", name: "10А клас", unread: 0 },
                        { id: "robotics", name: "Роботика", unread: 0 },
                        { id: "webdev", name: "Web Development", unread: 0 },
                        { id: "teachers", name: "Учители", unread: 0 },
                    ];
                    rolePrivateChats = [
                        { id: "teacher_petrova", name: "Г-жа Петрова", online: true, avatar: "ГП" },
                        { id: "teacher_ivanov", name: "Г-н Иванов", online: true, avatar: "ГИ" },
                        { id: "teacher_dimitrova", name: "Г-жа Димитрова", online: false, avatar: "ГД" },
                        { id: "teacher_vasileva", name: "Г-жа Василева", online: true, avatar: "ГВ" },
                    ];
                    roleMessages = [
                        ...class12AMessages,
                        ...class11AMessages,
                        ...class12BMessages,
                        ...class10AMessages,
                        ...roboticsMessages,
                        ...webDevMessages,
                        ...teachersMessages,
                        // Teacher Petrova chat
                        {
                            id: "ap1",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Добър ден! Изпратих месечния отчет на имейла Ви.",
                            time: "09:00",
                            role: "Учител",
                            channelId: "teacher_petrova"
                        },
                        {
                            id: "ap2",
                            author: "Директор Стоянов",
                            avatar: "ДС",
                            content: "Благодаря! Получих го. Всичко е наред.",
                            time: "09:15",
                            isOwn: true,
                            role: "Админ",
                            channelId: "teacher_petrova"
                        },
                        {
                            id: "ap3",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Бих искала да обсъдим нови учебни материали за следващата година.",
                            time: "09:20",
                            role: "Учител",
                            channelId: "teacher_petrova"
                        },
                        {
                            id: "ap4",
                            author: "Директор Стоянов",
                            avatar: "ДС",
                            content: "Разбира се. Каква е вашата препоръка?",
                            time: "09:25",
                            isOwn: true,
                            role: "Админ",
                            channelId: "teacher_petrova"
                        },
                        {
                            id: "ap5",
                            author: "Г-жа Петрова",
                            avatar: "ГП",
                            content: "Смятам, че трябва да инвестираме в дигитални табла за всички класни стаи.",
                            time: "09:30",
                            role: "Учител",
                            channelId: "teacher_petrova"
                        },
                        {
                            id: "ap6",
                            author: "Директор Стоянов",
                            avatar: "ДС",
                            content: "Добра идея! Ще подготвя бюджет и ще ви информирам.",
                            time: "09:35",
                            isOwn: true,
                            role: "Админ",
                            channelId: "teacher_petrova"
                        },
                        // Teacher Ivanov chat
                        {
                            id: "ai1",
                            author: "Г-н Иванов",
                            avatar: "ГИ",
                            content: "Здравейте! Имам въпрос относно новата програма по информатика.",
                            time: "10:00",
                            role: "Учител",
                            channelId: "teacher_ivanov"
                        },
                        {
                            id: "ai2",
                            author: "Директор Стоянов",
                            avatar: "ДС",
                            content: "Добър ден! Слушам ви.",
                            time: "10:10",
                            isOwn: true,
                            role: "Админ",
                            channelId: "teacher_ivanov"
                        },
                        {
                            id: "ai3",
                            author: "Г-н Иванов",
                            avatar: "ГИ",
                            content: "Ще получим ли допълнителни часове за практически упражнения?",
                            time: "10:12",
                            role: "Учител",
                            channelId: "teacher_ivanov"
                        },
                        {
                            id: "ai4",
                            author: "Директор Стоянов",
                            avatar: "ДС",
                            content: "Да, планираме да добавим два часа седмично за всеки клас.",
                            time: "10:15",
                            isOwn: true,
                            role: "Админ",
                            channelId: "teacher_ivanov"
                        },
                        {
                            id: "ai5",
                            author: "Г-н Иванов",
                            avatar: "ГИ",
                            content: "Чудесно! Благодаря за подкрепата!",
                            time: "10:18",
                            role: "Учител",
                            channelId: "teacher_ivanov"
                        },
                        // Teacher Dimitrova chat
                        {
                            id: "ad1",
                            author: "Г-жа Димитрова",
                            avatar: "ГД",
                            content: "Моля да одобрите моята отпуска за следващата седмица.",
                            time: "11:00",
                            role: "Учител",
                            channelId: "teacher_dimitrova"
                        },
                        {
                            id: "ad2",
                            author: "Директор Стоянов",
                            avatar: "ДС",
                            content: "От кога до кога точно?",
                            time: "11:10",
                            isOwn: true,
                            role: "Админ",
                            channelId: "teacher_dimitrova"
                        },
                        {
                            id: "ad3",
                            author: "Г-жа Димитрова",
                            avatar: "ГД",
                            content: "От понеделник до сряда - 3 дни.",
                            time: "11:12",
                            role: "Учител",
                            channelId: "teacher_dimitrova"
                        },
                        {
                            id: "ad4",
                            author: "Директор Стоянов",
                            avatar: "ДС",
                            content: "Одобрено. Намерих заместник за вашите часове.",
                            time: "11:20",
                            isOwn: true,
                            role: "Админ",
                            channelId: "teacher_dimitrova"
                        },
                        {
                            id: "ad5",
                            author: "Г-жа Димитрова",
                            avatar: "ГД",
                            content: "Благодаря много! Изпратих учебните материали на заместника.",
                            time: "11:25",
                            role: "Учител",
                            channelId: "teacher_dimitrova"
                        },
                        // Teacher Vasileva chat
                        {
                            id: "av1",
                            author: "Г-жа Василева",
                            avatar: "ГВ",
                            content: "Здравейте! Искам да обсъдим новия проект за 10А клас.",
                            time: "14:00",
                            role: "Учител",
                            channelId: "teacher_vasileva"
                        },
                        {
                            id: "av2",
                            author: "Директор Стоянов",
                            avatar: "ДС",
                            content: "Разбира се! Каква е вашата идея?",
                            time: "14:10",
                            isOwn: true,
                            role: "Админ",
                            channelId: "teacher_vasileva"
                        },
                        {
                            id: "av3",
                            author: "Г-жа Василева",
                            avatar: "ГВ",
                            content: "Бих искала да организираме уеб дизайн състезание между класовете.",
                            time: "14:12",
                            role: "Учител",
                            channelId: "teacher_vasileva"
                        },
                        {
                            id: "av4",
                            author: "Директор Стоянов",
                            avatar: "ДС",
                            content: "Страхотна инициатива! Имате пълната ми подкрепа.",
                            time: "14:15",
                            isOwn: true,
                            role: "Админ",
                            channelId: "teacher_vasileva"
                        },
                        {
                            id: "av5",
                            author: "Г-жа Василева",
                            avatar: "ГВ",
                            content: "Чудесно! Ще подготвя детайлен план и ще ви го изпратя.",
                            time: "14:18",
                            role: "Учител",
                            channelId: "teacher_vasileva"
                        }
                    ];
                }

                const subjectMessages = [
                    // Mathematics
                    {
                        id: "math_1",
                        author: "Г-жа Петрова",
                        avatar: "ГП",
                        content: "Здравейте! Не забравяйте, че утре имаме тест върху производни на функции. Преговорете правилата за диференциране.",
                        time: "10:15",
                        role: "Учител",
                        channelId: "math"
                    },
                    {
                        id: "math_s1",
                        author: "Иван Димитров",
                        avatar: "ИД",
                        content: "Ще има ли задачи за допирателна към графика на функция?",
                        time: "10:20",
                        role: "student",
                        channelId: "math"
                    },
                    {
                        id: "math_t1",
                        author: "Г-жа Петрова",
                        avatar: "ГП",
                        content: "Да, Иван. Поне една задача ще бъде свързана с геометричното тълкуване на производната.",
                        time: "10:22",
                        role: "Учител",
                        channelId: "math"
                    },
                    {
                        id: "math_2",
                        author: "Системата",
                        avatar: "SC",
                        content: "Насрочена видео среща: Консултация за теста. Начало: Днес, 16:30 ч.",
                        time: "11:00",
                        role: "Система",
                        channelId: "math"
                    },
                    {
                        id: "math_s2",
                        author: "Мария Костова",
                        avatar: "МК",
                        content: "Може ли линк към сборника с допълнителни задачи?",
                        time: "11:05",
                        role: "student",
                        channelId: "math"
                    },

                    // Software Engineering
                    {
                        id: "soft_1",
                        author: "Г-н Иванов",
                        avatar: "ГИ",
                        content: "Проектите по Софтуерно инженерство трябва да бъдат качени в GitHub до петък. Използвайте Feature-based branching стратегия.",
                        time: "09:45",
                        role: "Учител",
                        channelId: "soft_eng"
                    },
                    {
                        id: "soft_s1",
                        author: "Петър Георгиев",
                        avatar: "ПГ",
                        content: "Колко unit теста са необходими за добро покритие?",
                        time: "09:50",
                        role: "student",
                        channelId: "soft_eng"
                    },
                    {
                        id: "soft_t1",
                        author: "Г-н Иванов",
                        avatar: "ГИ",
                        content: "Целете се към поне 70% покритие на бизнес логиката.",
                        time: "09:55",
                        role: "Учител",
                        channelId: "soft_eng"
                    },
                    {
                        id: "soft_s2",
                        author: "Елена Драганова",
                        avatar: "ЕД",
                        content: "Трябва ли да включим и README файл с инструкции?",
                        time: "10:00",
                        role: "student",
                        channelId: "soft_eng"
                    },

                    // Internet Programming
                    {
                        id: "ip_1",
                        author: "Г-н Иванов",
                        avatar: "ГИ",
                        content: "Днес ще разгледаме useContext и useReducer в React. Подгответе си редакторите.",
                        time: "11:20",
                        role: "Учител",
                        channelId: "internet_prog"
                    },
                    {
                        id: "ip_s1",
                        author: "Алекс Христов",
                        avatar: "АХ",
                        content: "Ще използваме ли TypeScript за днешните примери?",
                        time: "11:25",
                        role: "student",
                        channelId: "internet_prog"
                    },
                    {
                        id: "ip_t1",
                        author: "Г-н Иванов",
                        avatar: "ГИ",
                        content: "Да, всички нови проекти ще бъдат на TypeScript.",
                        time: "11:28",
                        role: "Учител",
                        channelId: "internet_prog"
                    },

                    // Functional Programming
                    {
                        id: "fp_1",
                        author: "Г-н Стефанов",
                        avatar: "ГС",
                        content: "Разгледайте концепцията за Recursion vs Iteration в Haskell за следващия път.",
                        time: "12:15",
                        role: "Учител",
                        channelId: "func_prog"
                    },
                    {
                        id: "fp_s1",
                        author: "Никола Петров",
                        avatar: "НП",
                        content: "Tail recursion optimization прави ли се автоматично в GHC?",
                        time: "12:20",
                        role: "student",
                        channelId: "func_prog"
                    },

                    // Algorithms and Data Structures
                    {
                        id: "algo_1",
                        author: "Г-жа Димитрова",
                        avatar: "ГД",
                        content: "Материалите за обхождане на графи (DFS/BFS) са качени в панела с ресурси.",
                        time: "13:30",
                        role: "Учител",
                        channelId: "algo_struct"
                    },
                    {
                        id: "algo_s1",
                        author: "Стоян Иванов",
                        avatar: "СИ",
                        content: "Кога ще имаме практическо упражнение върху Най-кратък път (Dijkstra)?",
                        time: "13:35",
                        role: "student",
                        channelId: "algo_struct"
                    },

                    // English
                    {
                        id: "eng_1",
                        author: "Г-жа Василева",
                        avatar: "ГВ",
                        content: "Focus on your essay structure for the mock IELTS test next Tuesday. Use advanced linkers.",
                        time: "13:00",
                        role: "Учител",
                        channelId: "english"
                    },
                    {
                        id: "eng_s1",
                        author: "Victoria Boneva",
                        avatar: "VB",
                        content: "Should we follow the Academic or General training module for the task 1 essay?",
                        time: "13:10",
                        role: "student",
                        channelId: "english"
                    },
                    {
                        id: "eng_t1",
                        author: "Г-жа Василева",
                        avatar: "ГВ",
                        content: "We are focusing on the Academic module, Victoria.",
                        time: "13:15",
                        role: "Учител",
                        channelId: "english"
                    },

                    // Bulgarian
                    {
                        id: "bul_1",
                        author: "Г-жа Николова",
                        avatar: "ГН",
                        content: "Моля, прочетете 'Да се завърнеш в бащината къща' за утрешния час.",
                        time: "14:10",
                        role: "Учител",
                        channelId: "bulgarian"
                    },
                    {
                        id: "bul_s1",
                        author: "Калоян Узунов",
                        avatar: "КУ",
                        content: "Ще правим ли интерпретативно съчинение върху елегията?",
                        time: "14:15",
                        role: "student",
                        channelId: "bulgarian"
                    },
                    {
                        id: "bul_t1",
                        author: "Г-жа Николова",
                        avatar: "ГН",
                        content: "Да, Калоян. Започваме с план-тезис в края на часа.",
                        time: "14:20",
                        role: "Учител",
                        channelId: "bulgarian"
                    }
                ];

                const mockEvents: CalendarEvent[] = [
                    {
                        id: "ev1",
                        title: "Тест по Математика",
                        description: "Тест върху производни на функции",
                        date: new Date(Date.now() + 86400000).toISOString(),
                        type: "test",
                        subjectId: "math",
                        classId: "12A"
                    },
                    {
                        id: "ev2",
                        title: "Видео среща - Консултация",
                        description: "Консултация за предстоящия тест по Математика",
                        date: new Date(Date.now() + 18000000).toISOString(),
                        type: "meeting",
                        subjectId: "math",
                        classId: "12A"
                    },
                    {
                        id: "ev3",
                        title: "Домашно по Софтуерно инж.",
                        description: "Качване на проекта в GitHub",
                        date: new Date(Date.now() + 172800000).toISOString(),
                        type: "homework",
                        subjectId: "soft_eng",
                        classId: "12A"
                    },
                    {
                        id: "ev4",
                        title: "IELTS Mock Test",
                        description: "Full simulation of the IELTS exam",
                        date: new Date(Date.now() + 432000000).toISOString(),
                        type: "test",
                        subjectId: "english",
                        classId: "12A"
                    }
                ];

                return {
                    currentUser: {
                        name,
                        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
                        role,
                        username
                    },
                    channels: roleChannels,
                    privateChats: rolePrivateChats,
                    messages: [...roleMessages, ...subjectMessages],
                    events: state.events.length === 0 ? mockEvents : state.events,
                    selectedChat: roleChannels.length > 0 ? roleChannels[0].id : "",
                    currentView: 'chat'
                };
            }),

            logout: () => {
                const user = get().currentUser;
                if (user.name) {
                    get().addLog({
                        action: "Изход от системата",
                        user: user.name,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: 'logout'
                    });
                }
                set({
                    currentUser: { name: "", avatar: "", role: "" },
                    selectedChat: "",
                    currentView: "chat"
                });
            },

            addLog: (logData) => set((state) => ({
                logs: [{ id: Date.now().toString(), ...logData }, ...state.logs]
            })),

            addReport: (reportData) => set((state) => ({
                reports: [{ id: Date.now().toString(), ...reportData }, ...state.reports]
            })),

            setCurrentView: (view) => set({ currentView: view }),

            setSelectedChat: (chatId) => set((state) => {
                // Also mark as read when selected
                const updatedChannels = state.channels.map(c =>
                    c.id === chatId ? { ...c, unread: 0 } : c
                );
                return { selectedChat: chatId, channels: updatedChannels };
            }),

            sendMessage: (content, attachment) => set((state) => {
                const newMessage: Message = {
                    id: Date.now().toString(),
                    author: state.currentUser.name,
                    avatar: state.currentUser.avatar,
                    content,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: true,
                    role: state.currentUser.role === 'teacher' ? 'Учител' : (state.currentUser.role === 'admin' ? 'Админ' : undefined),
                    channelId: state.selectedChat,
                    attachment
                };
                return { messages: [...state.messages, newMessage] };
            }),

            muteReport: (reportId) => set((state) => ({
                reports: state.reports.filter(r => r.id !== reportId)
            })),

            ignoreReport: (reportId) => set((state) => ({
                reports: state.reports.filter(r => r.id !== reportId)
            })),

            blockUser: (reportId) => set((state) => ({
                reports: state.reports.filter(r => r.id !== reportId)
            })),

            markChannelAsRead: (channelId) => set((state) => ({
                channels: state.channels.map(c =>
                    c.id === channelId ? { ...c, unread: 0 } : c
                )
            })),

            addMaterial: (materialData) => set((state) => ({
                materials: [
                    ...state.materials,
                    {
                        ...materialData,
                        id: `m${Date.now()}`
                    }
                ]
            })),

            addEvent: (eventData) => set((state) => ({
                events: [
                    ...state.events,
                    {
                        ...eventData,
                        id: `ev${Date.now()}`
                    }
                ]
            })),

            toggleReminder: (eventId) => set((state) => {
                const username = state.currentUser.username;
                if (!username) return state;

                const currentReminders = state.userReminders[username] || [];
                const isReminderSet = currentReminders.includes(eventId);

                const newUserReminders = {
                    ...state.userReminders,
                    [username]: isReminderSet
                        ? currentReminders.filter(id => id !== eventId)
                        : [...currentReminders, eventId]
                };

                return { userReminders: newUserReminders };
            }),

            deleteEvent: (eventId) => set((state) => ({
                events: state.events.filter(e => e.id !== eventId)
            })),

            showAdminPanel: false,
            toggleAdminPanel: () => set((state) => ({ showAdminPanel: !state.showAdminPanel }))
        }),
        {
            name: 'school-connect-storage',
            version: 1,
            migrate: (persistedState: any, version: number) => {
                if (version === 0 && persistedState) {
                    persistedState.materials = [];
                }
                return persistedState;
            },
        }
    )
);
