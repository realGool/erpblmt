import {
  Activity,
  AlertTriangle,
  BarChart3,
  Boxes,
  Building2,
  CalendarCheck2,
  CreditCard,
  FileText,
  Gauge,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, FilterBar, Select } from "../../components/ui";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

type AnalyticsSection = "dashboard" | "dastur" | "finance" | "attendance" | "reports";

interface AnalyticsPageProps {
  section: AnalyticsSection;
  onNavigate?: (key: SidebarNavigationKey) => void;
}

const sectionNavigation: Record<AnalyticsSection, SidebarNavigationKey> = {
  dashboard: "analyticsDashboard",
  dastur: "analyticsDastur",
  finance: "analyticsFinance",
  attendance: "analyticsAttendance",
  reports: "analyticsReports",
};

const dashboardMetrics = [
  { icon: Users, labelKey: "children", value: "1 248", delta: "+42", tone: "primary" },
  { icon: Building2, labelKey: "groups", value: "64", delta: "+3", tone: "success" },
  { icon: CalendarCheck2, labelKey: "attendance", value: "87%", delta: "+4%", tone: "success" },
  { icon: CreditCard, labelKey: "debts", value: "186 млн", delta: "-8%", tone: "danger" },
  { icon: WalletCards, labelKey: "payroll", value: "742 млн", delta: "май", tone: "warning" },
  { icon: BarChart3, labelKey: "branchExpenses", value: "312 млн", delta: "+12%", tone: "purple" },
  { icon: Boxes, labelKey: "warehouse", value: "96 млн", delta: "остаток", tone: "info" },
  { icon: Activity, labelKey: "aiEvents", value: "128", delta: "24 новых", tone: "primary" },
  { icon: Gauge, labelKey: "staffLoad", value: "76%", delta: "норма", tone: "success" },
  { icon: TrendingUp, labelKey: "branchScore", value: "82/100", delta: "+5", tone: "info" },
] as const;

const developmentRows = [
  { name: "physical", values: { n: 12, i: 24, ch: 48, u: 16 } },
  { name: "social", values: { n: 9, i: 22, ch: 51, u: 18 } },
  { name: "cognitive", values: { n: 7, i: 20, ch: 49, u: 24 } },
  { name: "creative", values: { n: 11, i: 26, ch: 44, u: 19 } },
  { name: "speech", values: { n: 14, i: 25, ch: 43, u: 18 } },
] as const;

const branches = [
  { name: "Bilimtoy Kids Yunusobod", children: 426, attendance: 91, debt: "54 млн", load: 82 },
  { name: "Детский сад №12 «Болажон»", children: 384, attendance: 86, debt: "73 млн", load: 74 },
  { name: "Bilimtoy Kids Chilonzor", children: 438, attendance: 84, debt: "59 млн", load: 71 },
] as const;

const alerts = [
  { title: "Рост задолженности", description: "В филиале «Болажон» долг выше среднего на 14%.", tone: "danger" },
  { title: "AI-события требуют проверки", description: "24 новых гипотезы по речевому развитию ждут подтверждения.", tone: "warning" },
  { title: "Посещаемость улучшилась", description: "Yunusobod держит 91% посещаемости вторую неделю.", tone: "success" },
] as const;

export function AnalyticsPage({ section, onNavigate }: AnalyticsPageProps) {
  return (
    <AppShell activeNavigation={sectionNavigation[section]} onNavigate={onNavigate}>
      {section === "dashboard" ? <AnalyticsDashboard /> : <AnalyticsPlaceholder section={section} />}
    </AppShell>
  );
}

function AnalyticsDashboard() {
  const { t } = useI18n();

  return (
    <PageContainer>
      <PageHeader
        title={t("analytics.dashboard.title")}
        description={t("analytics.dashboard.description")}
        breadcrumbs={[{ label: t("navigation.analytics") }, { label: t("analytics.nav.dashboard") }]}
      />

      <div className="space-y-6">
        <FilterBar
          left={
            <div className="flex flex-wrap gap-3">
              <Select aria-label={t("analytics.filters.period")} defaultValue="current" options={[{ label: t("analytics.filters.currentCycle"), value: "current" }, { label: t("analytics.filters.month"), value: "month" }]} />
              <Select aria-label={t("analytics.filters.branch")} defaultValue="all" options={[{ label: t("analytics.filters.allBranches"), value: "all" }, { label: "Bilimtoy Kids Yunusobod", value: "yunusobod" }, { label: "Детский сад №12 «Болажон»", value: "bolajon" }]} />
            </div>
          }
          right={<Badge variant="success">{t("analytics.dashboard.realtime")}</Badge>}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {dashboardMetrics.map((metric) => (
            <MetricCard key={metric.labelKey} metric={metric} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]">
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.dashboard.developmentSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {developmentRows.map((row) => (
                <DevelopmentRow key={row.name} name={t(`analytics.developmentAreas.${row.name}`)} values={row.values} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.dashboard.operationalSignals")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.title} className="rounded-card border border-border bg-page p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-input", alert.tone === "danger" ? "bg-danger-bg text-danger-text" : alert.tone === "warning" ? "bg-warning-bg text-warning-text" : "bg-success-bg text-success-text")}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{alert.title}</div>
                      <div className="mt-1 text-sm leading-5 text-text-secondary">{alert.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.dashboard.branchIndicators")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 xl:grid-cols-3">
              {branches.map((branch) => (
                <BranchCard key={branch.name} branch={branch} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function MetricCard({ metric }: { metric: (typeof dashboardMetrics)[number] }) {
  const { t } = useI18n();
  const Icon = metric.icon;
  const toneClass = metric.tone === "success" ? "bg-success-bg text-success-text" : metric.tone === "danger" ? "bg-danger-bg text-danger-text" : metric.tone === "warning" ? "bg-warning-bg text-warning-text" : metric.tone === "purple" ? "bg-purple-bg text-purple-text" : metric.tone === "info" ? "bg-info-bg text-info-text" : "bg-primary-soft text-primary";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-input", toneClass)}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="neutral">{metric.delta}</Badge>
        </div>
        <div className="mt-4 text-2xl font-semibold text-text-primary">{metric.value}</div>
        <div className="mt-1 text-sm text-text-secondary">{t(`analytics.dashboard.metrics.${metric.labelKey}`)}</div>
      </CardContent>
    </Card>
  );
}

function DevelopmentRow({ name, values }: { name: string; values: { n: number; i: number; ch: number; u: number } }) {
  const { t } = useI18n();
  const segments = [
    { key: "n", value: values.n, className: "bg-danger-text" },
    { key: "i", value: values.i, className: "bg-warning-text" },
    { key: "ch", value: values.ch, className: "bg-success-text" },
    { key: "u", value: values.u, className: "bg-primary" },
  ] as const;

  return (
    <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)_240px] lg:items-center">
      <div className="font-medium text-text-primary">{name}</div>
      <div className="flex h-4 overflow-hidden rounded-full bg-page">
        {segments.map((segment) => (
          <div key={segment.key} className={segment.className} style={{ width: `${segment.value}%` }} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs font-medium">
        {segments.map((segment) => (
          <div key={segment.key} className="rounded-input bg-page px-2 py-1 text-center text-text-secondary">
            {t(`analytics.nicu.${segment.key}`)} {segment.value}%
          </div>
        ))}
      </div>
    </div>
  );
}

function BranchCard({ branch }: { branch: (typeof branches)[number] }) {
  const { t } = useI18n();

  return (
    <div className="rounded-card border border-border bg-page p-4">
      <div className="font-semibold text-text-primary">{branch.name}</div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <BranchMetric label={t("analytics.dashboard.metrics.children")} value={String(branch.children)} />
        <BranchMetric label={t("analytics.dashboard.metrics.attendance")} value={`${branch.attendance}%`} />
        <BranchMetric label={t("analytics.dashboard.metrics.debts")} value={branch.debt} />
        <BranchMetric label={t("analytics.dashboard.metrics.staffLoad")} value={`${branch.load}%`} />
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-primary" style={{ width: `${branch.load}%` }} />
      </div>
    </div>
  );
}

function BranchMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input bg-surface p-3">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 font-semibold text-text-primary">{value}</div>
    </div>
  );
}

function AnalyticsPlaceholder({ section }: { section: Exclude<AnalyticsSection, "dashboard"> }) {
  const { t } = useI18n();

  return (
    <PageContainer>
      <PageHeader
        title={t(`analytics.nav.${section}`)}
        breadcrumbs={[{ label: t("navigation.analytics") }, { label: t(`analytics.nav.${section}`) }]}
      />
      <EmptyState icon={<FileText className="h-10 w-10" />} title={t("analytics.placeholder.title")} description={t("analytics.placeholder.description")} />
    </PageContainer>
  );
}
