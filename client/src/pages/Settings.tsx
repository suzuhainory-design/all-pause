/*
 * 系统配置页面 - 占位
 * Design: Soft Industrial
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Settings, Users, Shield, Database, Bell, Palette } from "lucide-react";

const settingSections = [
  { icon: Users, label: "团队管理", desc: "管理团队成员和角色权限" },
  { icon: Shield, label: "审批规则", desc: "配置审批触发条件和审批链" },
  { icon: Database, label: "模板管理", desc: "管理诊断模板和方案模板" },
  { icon: Bell, label: "通知设置", desc: "配置系统通知和提醒规则" },
  { icon: Palette, label: "品牌定制", desc: "自定义系统外观和品牌元素" },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="System Settings"
        title="系统配置"
        subtitle="管理系统参数、团队和审批规则"
      />
      <div className="p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingSections.map((s) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.label}
                className="shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => toast("功能开发中", { description: `${s.label}模块即将上线` })}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
