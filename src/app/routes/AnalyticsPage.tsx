import {
  Activity,
  AlertTriangle,
  BarChart3,
  Boxes,
  Building2,
  CalendarCheck2,
  CreditCard,
  Eye,
  FileText,
  Gauge,
  Search,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Checkbox, EmptyState, FilterBar, Input, Select, StackedNicuBar, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui";
import {
  analyticsBranches,
  comparisonBranches,
  comparisonChildren,
  comparisonGroups,
  comparisonPeriods,
  dasturAgeGroups,
  dasturAnalysisRows,
  dasturAreaKeys,
  dasturIndicatorDetails,
  dasturSummaryStats,
  type DasturAnalysisRow,
  type DasturAreaKey,
  type DasturSource,
} from "../../data/mockAnalytics";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

type AnalyticsSection = "dashboard" | "dastur" | "comparison" | "finance" | "attendance" | "reports";

interface AnalyticsPageProps {
  section: AnalyticsSection;
  onNavigate?: (key: SidebarNavigationKey) => void;
}

const sectionNavigation: Record<AnalyticsSection, SidebarNavigationKey> = {
  dashboard: "analyticsDashboard",
  dastur: "analyticsDastur",
  comparison: "analyticsComparison",
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
      {section === "dashboard" ? <AnalyticsDashboard /> : null}
      {section === "dastur" ? <DasturAnalysisView /> : null}
      {section === "comparison" ? <ComparisonAnalysisView /> : null}
      {section !== "dashboard" && section !== "dastur" && section !== "comparison" ? <AnalyticsPlaceholder section={section} /> : null}
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

const dasturSourceVariant: Record<DasturSource, "neutral" | "info" | "success" | "warning"> = {
  none: "neutral",
  manual: "info",
  bilimtoy: "success",
  combined: "warning",
};

function DasturAnalysisView() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [aggregation, setAggregation] = useState("organization");
  const [branch, setBranch] = useState("all");
  const [ageGroup, setAgeGroup] = useState("5-6");
  const [source, setSource] = useState<DasturSource | "all">("all");
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return dasturAnalysisRows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        row.title.toLocaleLowerCase().includes(normalizedQuery) ||
        row.area.toLocaleLowerCase().includes(normalizedQuery) ||
        row.subarea?.toLocaleLowerCase().includes(normalizedQuery);
      const matchesSource = source === "all" || row.source === source || row.source === "none";
      return matchesQuery && matchesSource;
    });
  }, [query, source]);

  const selectedIndicator = selectedIndicatorId ? dasturIndicatorDetails[selectedIndicatorId] : null;

  return (
    <PageContainer>
      <PageHeader
        title={t("analytics.dastur.title")}
        description={t("analytics.dastur.description")}
        breadcrumbs={[{ label: t("navigation.analytics") }, { label: t("analytics.nav.dastur") }]}
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DasturStat title={t("analytics.dastur.stats.indicators")} value={String(dasturSummaryStats.indicators)} icon={<BarChart3 className="h-5 w-5" />} />
          <DasturStat title={t("analytics.dastur.stats.filled")} value={`${dasturSummaryStats.filledPercent}%`} icon={<FileText className="h-5 w-5" />} />
          <DasturStat title={t("analytics.dastur.stats.manual")} value={`${dasturSummaryStats.manualSourcePercent}%`} icon={<Eye className="h-5 w-5" />} />
          <DasturStat title={t("analytics.dastur.stats.bilimtoy")} value={`${dasturSummaryStats.bilimtoySourcePercent}%`} icon={<Activity className="h-5 w-5" />} />
        </div>

        <Card>
          <CardContent className="space-y-4">
            <div className="text-sm font-semibold text-text-primary">{t("analytics.dastur.filters.title")}</div>
            <div className="grid gap-4 lg:grid-cols-4">
              <Input
                label={t("analytics.dastur.filters.searchLabel")}
                placeholder={t("analytics.dastur.filters.searchPlaceholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
              <Select
                label={t("analytics.dastur.filters.aggregation")}
                value={aggregation}
                onChange={(event) => setAggregation(event.target.value)}
                options={[
                  { label: t("analytics.dastur.aggregation.organization"), value: "organization" },
                  { label: t("analytics.dastur.aggregation.branches"), value: "branches" },
                ]}
              />
              <Select label={t("analytics.dastur.filters.branch")} value={branch} onChange={(event) => setBranch(event.target.value)} options={analyticsBranches} />
              <Select label={t("analytics.dastur.filters.ageGroup")} value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)} options={dasturAgeGroups} />
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(220px,320px)_repeat(4,minmax(120px,1fr))]">
              <Select
                label={t("analytics.dastur.filters.source")}
                value={source}
                onChange={(event) => setSource(event.target.value as DasturSource | "all")}
                options={[
                  { label: t("analytics.dastur.source.all"), value: "all" },
                  { label: t("analytics.dastur.source.manual"), value: "manual" },
                  { label: t("analytics.dastur.source.bilimtoy"), value: "bilimtoy" },
                  { label: t("analytics.dastur.source.combined"), value: "combined" },
                ]}
              />
              <Input label={t("analytics.dastur.filters.fillFrom")} defaultValue="75" />
              <Input label={t("analytics.dastur.filters.fillTo")} defaultValue="100" />
              <Input label={t("analytics.dastur.filters.nFrom")} defaultValue="0" />
              <Input label={t("analytics.dastur.filters.uTo")} defaultValue="100" />
            </div>
          </CardContent>
        </Card>

        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("analytics.dastur.table.name")}</TableHead>
                <TableHead className="w-20 text-center">{t("analytics.nicu.n")}</TableHead>
                <TableHead className="w-20 text-center">{t("analytics.nicu.i")}</TableHead>
                <TableHead className="w-20 text-center">{t("analytics.nicu.ch")}</TableHead>
                <TableHead className="w-20 text-center">{t("analytics.nicu.u")}</TableHead>
                <TableHead className="w-28 text-center">{t("analytics.dastur.table.filled")}</TableHead>
                <TableHead className="w-36">{t("analytics.dastur.table.source")}</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((row) => (
                <DasturTableRow key={row.id} row={row} onSelect={() => row.type === "indicator" && setSelectedIndicatorId(row.id)} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {selectedIndicator ? <DasturIndicatorPanel indicator={selectedIndicator} onClose={() => setSelectedIndicatorId(null)} /> : null}
    </PageContainer>
  );
}

function DasturStat({ title, value, icon }: { title: string; value: string; icon: ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-input bg-primary-soft text-primary">{icon}</div>
        <div>
          <div className="text-sm text-text-secondary">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-text-primary">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function DasturTableRow({ row, onSelect }: { row: DasturAnalysisRow; onSelect: () => void }) {
  const { t } = useI18n();
  const isIndicator = row.type === "indicator";

  return (
    <TableRow className={cn(isIndicator && "cursor-pointer")} onClick={onSelect}>
      <TableCell>
        <div className={cn("flex items-center gap-2", row.type === "subarea" && "pl-5", row.type === "indicator" && "pl-10")}>
          <div>
            <div className={cn("font-medium text-text-primary", row.type === "area" && "font-semibold")}>{row.title}</div>
            {row.subarea && row.type === "indicator" ? <div className="mt-1 text-xs text-text-muted">{row.subarea}</div> : null}
          </div>
        </div>
      </TableCell>
      <NicuPercentCell tone="danger" value={row.nicu.n} />
      <NicuPercentCell tone="warning" value={row.nicu.i} />
      <NicuPercentCell tone="success" value={row.nicu.ch} />
      <NicuPercentCell tone="info" value={row.nicu.u} />
      <TableCell className="text-center font-semibold">{row.filledPercent}%</TableCell>
      <TableCell>
        <Badge variant={dasturSourceVariant[row.source]}>{t(`analytics.dastur.source.${row.source}`)}</Badge>
      </TableCell>
      <TableCell>
        {isIndicator ? (
          <Button variant="ghost" size="icon" aria-label={t("analytics.dastur.actions.openDetails")} onClick={onSelect}>
            <Eye className="h-4 w-4" />
          </Button>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

function NicuPercentCell({ tone, value }: { tone: "danger" | "warning" | "success" | "info"; value: number }) {
  const className = {
    danger: "bg-danger-bg text-danger-text",
    warning: "bg-warning-bg text-warning-text",
    success: "bg-success-bg text-success-text",
    info: "bg-info-bg text-info-text",
  }[tone];

  return (
    <TableCell className="text-center">
      <span className={cn("inline-flex min-w-12 justify-center rounded-[6px] px-2 py-1 text-xs font-semibold", className)}>{value}%</span>
    </TableCell>
  );
}

function DasturIndicatorPanel({ indicator, onClose }: { indicator: NonNullable<(typeof dasturIndicatorDetails)[string]>; onClose: () => void }) {
  const { t } = useI18n();
  const labels = {
    n: t("analytics.nicu.n"),
    i: t("analytics.nicu.i"),
    ch: t("analytics.nicu.ch"),
    u: t("analytics.nicu.u"),
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-text-primary/20">
      <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-border bg-surface shadow-dropdown">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-6 py-5">
          <div>
            <div className="text-sm font-medium text-primary">{t("analytics.dastur.detail.title")}</div>
            <h2 className="mt-1 text-xl font-semibold text-text-primary">{indicator.title}</h2>
          </div>
          <Button variant="ghost" size="icon" aria-label={t("common.actions.close")} onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-5 px-6 py-5">
          <Card>
            <CardContent className="space-y-3">
              <DetailLine label={t("analytics.dastur.detail.area")} value={indicator.area} />
              <DetailLine label={t("analytics.dastur.detail.subarea")} value={indicator.subarea} />
              <DetailLine label={t("analytics.dastur.detail.ageGroup")} value={indicator.ageGroup} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4">
              <div className="font-semibold text-text-primary">{t("analytics.dastur.detail.branchDistribution")}</div>
              {indicator.branches.map((branch) => (
                <div key={branch.name} className="space-y-2 rounded-input border border-border p-3">
                  <div className="text-sm font-medium text-text-primary">{branch.name}</div>
                  <StackedNicuBar value={branch.nicu} labels={labels} compact className="min-w-0" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <SourceMetric label={t("analytics.dastur.source.manual")} value={indicator.sources.manual} />
              <SourceMetric label={t("analytics.dastur.source.bilimtoy")} value={indicator.sources.bilimtoy} />
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 text-sm sm:grid-cols-[130px_minmax(0,1fr)]">
      <span className="text-text-muted">{label}</span>
      <span className="font-medium text-text-primary">{value}</span>
    </div>
  );
}

function SourceMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-input border border-border bg-page p-3">
      <div className="text-xs font-medium text-text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-text-primary">{value}%</div>
    </div>
  );
}

function ComparisonAnalysisView() {
  const { t } = useI18n();
  const [mode, setMode] = useState("branches");
  const [period, setPeriod] = useState("current");
  const [branchId, setBranchId] = useState("yunusobod");
  const [selectedBranchIds, setSelectedBranchIds] = useState(["yunusobod", "chilonzor", "mirzo-ulugbek"]);
  const [selectedGroupIds, setSelectedGroupIds] = useState(["jasmine", "yulduz"]);
  const [selectedChildIds, setSelectedChildIds] = useState(["child-1", "child-2", "child-3"]);

  const selectedBranches = comparisonBranches.filter((branch) => selectedBranchIds.includes(branch.id));
  const visibleGroups = comparisonGroups.filter((group) => group.branchId === branchId);
  const selectedGroups = comparisonGroups.filter((group) => selectedGroupIds.includes(group.id));
  const selectedChildren = comparisonChildren.filter((child) => selectedChildIds.includes(child.id));

  const toggleValue = (value: string, values: string[], setValues: (values: string[]) => void) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <PageContainer>
      <PageHeader
        title={t("analytics.comparison.title")}
        description={t("analytics.comparison.description")}
        breadcrumbs={[{ label: t("navigation.analytics") }, { label: t("analytics.nav.comparison") }]}
      />

      <div className="space-y-6">
        <Tabs defaultValue="branches" value={mode} onValueChange={setMode}>
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="branches">{t("analytics.comparison.modes.branches")}</TabsTrigger>
            <TabsTrigger value="groups">{t("analytics.comparison.modes.groups")}</TabsTrigger>
            <TabsTrigger value="children">{t("analytics.comparison.modes.children")}</TabsTrigger>
          </TabsList>

          <TabsContent value="branches" className="space-y-5 border-0 bg-transparent p-0 shadow-none">
            <Card>
              <CardContent className="space-y-4">
                <ComparisonFilterTitle />
                <div className="grid gap-4 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
                  <Select label={t("analytics.comparison.filters.ageGroup")} value="all" onChange={() => undefined} options={[{ label: t("analytics.comparison.filters.allAgeGroups"), value: "all" }, ...dasturAgeGroups]} />
                  <CheckboxGrid
                    title={t("analytics.comparison.filters.branches")}
                    items={comparisonBranches.map((branch) => ({ id: branch.id, label: branch.name, description: t("analytics.comparison.childrenCount", { count: branch.childrenCount }) }))}
                    selectedIds={selectedBranchIds}
                    onToggle={(id) => toggleValue(id, selectedBranchIds, setSelectedBranchIds)}
                  />
                </div>
              </CardContent>
            </Card>
            <BranchComparisonTable branches={selectedBranches} />
          </TabsContent>

          <TabsContent value="groups" className="space-y-5 border-0 bg-transparent p-0 shadow-none">
            <Card>
              <CardContent className="space-y-4">
                <ComparisonFilterTitle />
                <div className="grid gap-4 lg:grid-cols-[minmax(240px,320px)_minmax(240px,320px)_minmax(0,1fr)]">
                  <Select label={t("analytics.comparison.filters.branch")} value={branchId} onChange={(event) => setBranchId(event.target.value)} options={comparisonBranches.map((branch) => ({ label: branch.name, value: branch.id }))} />
                  <Select label={t("analytics.comparison.filters.period")} value={period} onChange={(event) => setPeriod(event.target.value)} options={comparisonPeriods} />
                  <CheckboxGrid
                    title={t("analytics.comparison.filters.groups")}
                    items={visibleGroups.map((group) => ({ id: group.id, label: group.name, description: `${group.ageGroup} · ${t("analytics.comparison.childrenCount", { count: group.childrenCount })}` }))}
                    selectedIds={selectedGroupIds}
                    onToggle={(id) => toggleValue(id, selectedGroupIds, setSelectedGroupIds)}
                  />
                </div>
              </CardContent>
            </Card>
            <ScoreComparisonTable rows={selectedGroups} kind="groups" />
          </TabsContent>

          <TabsContent value="children" className="space-y-5 border-0 bg-transparent p-0 shadow-none">
            <Card>
              <CardContent className="space-y-4">
                <ComparisonFilterTitle />
                <div className="grid gap-4 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
                  <Select label={t("analytics.comparison.filters.period")} value={period} onChange={(event) => setPeriod(event.target.value)} options={comparisonPeriods} />
                  <CheckboxGrid
                    title={t("analytics.comparison.filters.children")}
                    items={comparisonChildren.map((child) => ({ id: child.id, label: child.fullName, description: `${child.groupName} · ${child.age}` }))}
                    selectedIds={selectedChildIds}
                    onToggle={(id) => toggleValue(id, selectedChildIds, setSelectedChildIds)}
                  />
                </div>
              </CardContent>
            </Card>
            <ScoreComparisonTable rows={selectedChildren} kind="children" />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

function ComparisonFilterTitle() {
  const { t } = useI18n();

  return <div className="text-sm font-semibold text-text-primary">{t("analytics.comparison.filters.title")}</div>;
}

function CheckboxGrid({
  title,
  items,
  selectedIds,
  onToggle,
}: {
  title: string;
  items: Array<{ id: string; label: string; description?: string }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-text-primary">{title}</div>
      <div className="grid gap-3 rounded-input border border-border bg-page p-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Checkbox key={item.id} id={`comparison-${item.id}`} checked={selectedIds.includes(item.id)} onChange={() => onToggle(item.id)} label={item.label} description={item.description} />
        ))}
      </div>
    </div>
  );
}

function BranchComparisonTable({ branches: items }: { branches: typeof comparisonBranches }) {
  const { t } = useI18n();
  const labels = {
    n: t("analytics.nicu.n"),
    i: t("analytics.nicu.i"),
    ch: t("analytics.nicu.ch"),
    u: t("analytics.nicu.u"),
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("analytics.comparison.table.area")}</TableHead>
            {items.map((branch) => (
              <TableHead key={branch.id} className="min-w-[220px]">
                {branch.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dasturAreaKeys.map((area) => (
            <TableRow key={area}>
              <TableCell className="font-semibold">{t(`analytics.developmentAreas.${area}`)}</TableCell>
              {items.map((branch) => (
                <TableCell key={branch.id}>
                  <StackedNicuBar value={branch.areas[area]} labels={labels} compact className="min-w-0" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ScoreComparisonTable({
  rows,
  kind,
}: {
  rows: Array<{
    id: string;
    name?: string;
    fullName?: string;
    branchName?: string;
    groupName?: string;
    ageGroup?: string;
    age?: string;
    childrenCount?: number;
    completionPercent: number;
    areas: Record<DasturAreaKey, number>;
  }>;
  kind: "groups" | "children";
}) {
  const { t } = useI18n();

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{kind === "groups" ? t("analytics.comparison.table.group") : t("analytics.comparison.table.child")}</TableHead>
            {dasturAreaKeys.map((area) => (
              <TableHead key={area} className="min-w-32 text-center">
                {t(`analytics.comparison.areasShort.${area}`)}
              </TableHead>
            ))}
            <TableHead className="w-32 text-center">{t("analytics.comparison.table.completion")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className="font-semibold text-text-primary">{row.name ?? row.fullName}</div>
                <div className="mt-1 text-xs text-text-muted">
                  {kind === "groups"
                    ? `${row.branchName} · ${row.ageGroup} · ${t("analytics.comparison.childrenCount", { count: row.childrenCount ?? 0 })}`
                    : `${row.groupName} · ${row.age}`}
                </div>
              </TableCell>
              {dasturAreaKeys.map((area) => (
                <ScoreCell key={area} value={row.areas[area]} />
              ))}
              <TableCell className="text-center font-semibold">{row.completionPercent}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ScoreCell({ value }: { value: number }) {
  const tone = value >= 78 ? "success" : value >= 70 ? "info" : "warning";
  const className = {
    success: "bg-success-bg text-success-text",
    info: "bg-info-bg text-info-text",
    warning: "bg-warning-bg text-warning-text",
  }[tone];

  return (
    <TableCell className="text-center">
      <span className={cn("inline-flex min-w-14 justify-center rounded-[6px] px-2 py-1 text-xs font-semibold", className)}>{value}%</span>
    </TableCell>
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
