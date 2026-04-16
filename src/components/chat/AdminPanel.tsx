import { Shield, Ban, Volume2, EyeOff, Activity, X } from "lucide-react";
import { useChatStore } from "@/hooks/useChatStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export function AdminPanel() {
  const { reports, logs, muteReport, ignoreReport, blockUser, currentUser, registeredUsers, messages } = useChatStore();

  if (currentUser.role !== 'admin') {
    return null;
  }

  const handleMute = (reportId: string) => {
    muteReport(reportId);
    toast.success("Потребителят е заглушен");
  };

  const handleIgnore = (reportId: string) => {
    ignoreReport(reportId);
    toast.info("Докладът е игнориран");
  };

  const handleBlock = (reportId: string) => {
    blockUser(reportId);
    toast.success("Потребителят е блокиран");
  };

  const activityData = [
    { name: "Пон", value: 45 },
    { name: "Вто", value: 52 },
    { name: "Сря", value: 38 },
    { name: "Чет", value: 65 },
    { name: "Пет", value: 48 },
    { name: "Съб", value: 12 },
    { name: "Нед", value: 8 },
  ];

  return (
    <aside className="w-80 border-l border-border/60 bg-background flex flex-col h-full shadow-soft">
      {/* Header */}
      <div className="h-16 border-b border-border/60 flex items-center px-6 justify-between bg-background">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <h2 className="font-black text-lg">Админ панел</h2>
        </div>

        <button
          onClick={() => useChatStore.getState().toggleAdminPanel()}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          title="Затвори"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-muted/50 p-1 h-11 rounded-xl mb-4">
            <TabsTrigger
              value="reports"
              className="text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Доклади
              {reports.length > 0 && (
                <span className="ml-2 bg-destructive text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem]">
                  {reports.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Логове
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Статистика
            </TabsTrigger>
          </TabsList>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-3 mt-0">
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground font-medium">Няма доклади</p>
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-xl bg-card border border-border/50 space-y-3 shadow-soft hover:shadow-md transition-shadow"
                >
                  {/* Report Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                      <Ban className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-destructive uppercase tracking-wide">{report.type}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {report.channel} • {report.time}
                      </p>
                    </div>
                  </div>

                  {/* Report Content */}
                  <div className="pl-11">
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-semibold text-foreground">Докладчик:</span> {report.reporter}
                    </p>
                    <p className="text-sm bg-muted/40 p-3 rounded-lg border border-border/30">
                      {report.content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pl-11">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMute(report.id)}
                      className="flex-1 h-9 rounded-xl border-warning/30 text-warning hover:bg-warning/10 hover:text-warning hover:border-warning/50 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5 mr-1.5" />
                      Заглуши
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBlock(report.id)}
                      className="flex-1 h-9 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 font-semibold"
                    >
                      <Ban className="w-3.5 h-3.5 mr-1.5" />
                      Блокирай
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleIgnore(report.id)}
                      className="h-9 rounded-xl text-muted-foreground hover:text-foreground font-semibold"
                    >
                      <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                      Игнорирай
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Logs */}
          <TabsContent value="logs" className="space-y-2 mt-0">
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground font-medium">Няма логове</p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                    log.type === 'login' && "bg-success/10 text-success",
                    log.type === 'logout' && "bg-muted text-muted-foreground",
                    log.type === 'join' && "bg-primary/10 text-primary"
                  )}>
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold truncate">{log.user}</p>
                      <p className="text-xs text-muted-foreground font-medium">{log.time}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{log.action}</p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats" className="space-y-6 mt-0">
            <div className="p-4 rounded-xl bg-card border border-border/50 shadow-soft">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Седмична активност
              </h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      fontSize={11}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis hide />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.4)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 shadow-sm transition-all hover:bg-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase mb-1 tracking-wider">Съобщения</p>
                <p className="text-2xl font-black">{messages.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 shadow-sm transition-all hover:bg-accent/10">
                <p className="text-[10px] font-bold text-accent uppercase mb-1 tracking-wider">Потребители</p>
                <p className="text-2xl font-black">{registeredUsers.length}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
