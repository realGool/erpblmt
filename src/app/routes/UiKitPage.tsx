import { useState, type ReactNode } from "react";
import { Bell, CheckCircle2, ChevronRight, Download, Plus, Search, Settings } from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  CrudSelect,
  EmptyState,
  Input,
  Modal,
  Pagination,
  Radio,
  Select,
  Skeleton,
  StatusBadge,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
} from "../../components/ui";
import { designTokens } from "../../design-tokens";
import { useI18n } from "../../i18n";

const colorTokens = [
  { nameKey: "uiKit.colors.primary", value: designTokens.colors.primary },
  { nameKey: "uiKit.colors.primaryHover", value: designTokens.colors.primaryHover },
  { nameKey: "uiKit.colors.primarySoft", value: designTokens.colors.primarySoft },
  { nameKey: "uiKit.colors.page", value: designTokens.colors.page },
  { nameKey: "uiKit.colors.surface", value: designTokens.colors.surface },
  { nameKey: "uiKit.colors.border", value: designTokens.colors.border },
  { nameKey: "uiKit.colors.textPrimary", value: designTokens.colors.textPrimary },
  { nameKey: "uiKit.colors.textSecondary", value: designTokens.colors.textSecondary },
  { nameKey: "uiKit.colors.textMuted", value: designTokens.colors.textMuted },
];

const statusTokens = [
  { labelKey: "status.active", status: "success" as const },
  { labelKey: "status.pending", status: "warning" as const },
  { labelKey: "status.danger", status: "danger" as const },
  { labelKey: "status.info", status: "info" as const },
  { labelKey: "status.category", status: "purple" as const },
  { labelKey: "status.draft", status: "neutral" as const },
];

const tableRows = [
  {
    id: "UI-001",
    componentKey: "uiKit.sections.table.rows.buttonComponent",
    ownerKey: "uiKit.sections.table.rows.buttonOwner",
    status: "success" as const,
  },
  {
    id: "UI-002",
    componentKey: "uiKit.sections.table.rows.modalComponent",
    ownerKey: "uiKit.sections.table.rows.modalOwner",
    status: "info" as const,
  },
  {
    id: "UI-003",
    componentKey: "uiKit.sections.table.rows.tableComponent",
    ownerKey: "uiKit.sections.table.rows.tableOwner",
    status: "warning" as const,
  },
];

export function UiKitPage() {
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);
  const [page, setPage] = useState(1);
  const [dictionaryValue, setDictionaryValue] = useState("private");

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title={t("uiKit.pageTitle")}
          description={t("uiKit.pageDescription")}
          breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("uiKit.pageTitle") }]}
          actions={
            <>
              <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                {t("common.actions.export")}
              </Button>
              <Button leftIcon={<Plus className="h-4 w-4" />}>{t("uiKit.primaryAction")}</Button>
            </>
          }
        />

        <div className="space-y-6">
          <Section title={t("uiKit.sections.colors.title")} description={t("uiKit.sections.colors.description")}>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
              {colorTokens.map((token) => (
                <Card key={token.nameKey}>
                  <CardContent className="space-y-3">
                    <div className="h-14 rounded-input border border-border" style={{ backgroundColor: token.value }} />
                    <div>
                      <div className="font-medium text-text-primary">{t(token.nameKey)}</div>
                      <div className="text-xs text-text-muted">{token.value}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {statusTokens.map((item) => (
                <StatusBadge key={item.labelKey} status={item.status}>
                  {t(item.labelKey)}
                </StatusBadge>
              ))}
            </div>
          </Section>

          <Section title={t("uiKit.sections.typography.title")} description={t("uiKit.sections.typography.description")}>
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-page-title">{t("uiKit.sections.typography.pageTitle")}</div>
                  <p className="text-sm text-text-muted">{t("uiKit.sections.typography.pageDescription")}</p>
                </div>
                <div>
                  <div className="text-card-title">{t("uiKit.sections.typography.cardTitle")}</div>
                  <p className="text-sm text-text-muted">{t("uiKit.sections.typography.cardDescription")}</p>
                </div>
                <p className="text-base text-text-primary">{t("uiKit.sections.typography.baseText")}</p>
              </CardContent>
            </Card>
          </Section>

          <Section title={t("uiKit.sections.spacing.title")} description={t("uiKit.sections.spacing.description")}>
            <Card>
              <CardContent className="flex flex-wrap items-end gap-4">
                {[4, 8, 12, 16, 20, 24, 32].map((space) => (
                  <div key={space} className="flex flex-col items-center gap-2">
                    <div className="w-12 rounded-input bg-primary-soft" style={{ height: space }} />
                    <span className="text-xs text-text-muted">{space}px</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Section>

          <Section title={t("uiKit.sections.buttons.title")} description={t("uiKit.sections.buttons.description")}>
            <Card>
              <CardContent className="flex flex-wrap items-center gap-3">
                <Button leftIcon={<Plus className="h-4 w-4" />}>{t("uiKit.sections.buttons.primary")}</Button>
                <Button variant="secondary">{t("uiKit.sections.buttons.secondary")}</Button>
                <Button variant="outline">{t("uiKit.sections.buttons.outline")}</Button>
                <Button variant="ghost">{t("uiKit.sections.buttons.ghost")}</Button>
                <Button variant="danger">{t("uiKit.sections.buttons.danger")}</Button>
                <Button size="icon" aria-label={t("common.actions.settings")}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button isLoading>{t("common.actions.save")}</Button>
              </CardContent>
            </Card>
          </Section>

          <Section title={t("uiKit.sections.fields.title")} description={t("uiKit.sections.fields.description")}>
            <Card>
              <CardContent className="grid gap-5 lg:grid-cols-2">
                <Input
                  label={t("common.labels.name")}
                  placeholder={t("common.placeholders.enterName")}
                  leftIcon={<Search className="h-4 w-4" />}
                />
                <Select
                  label={t("common.labels.status")}
                  defaultValue="active"
                  options={[
                    { label: t("status.activeMasculine"), value: "active" },
                    { label: t("status.pending"), value: "pending" },
                    { label: t("status.closed"), value: "closed" },
                  ]}
                />
                <CrudSelect
                  label={t("uiKit.sections.fields.dictionarySelect")}
                  value={dictionaryValue}
                  onValueChange={setDictionaryValue}
                  options={[
                    { label: t("organizations.options.private"), value: "private" },
                    { label: t("organizations.options.state"), value: "state" },
                    { label: t("organizations.options.publicPrivate"), value: "publicPrivate" },
                  ]}
                  addLabel={t("common.actions.addNew")}
                  newItemLabel={t("common.labels.newValueName")}
                  newItemPlaceholder={t("common.placeholders.enterName")}
                  saveLabel={t("common.actions.save")}
                  cancelLabel={t("common.actions.cancel")}
                />
                <Textarea label={t("common.labels.comment")} placeholder={t("common.placeholders.enterShortDescription")} />
                <div className="space-y-4">
                  <Checkbox
                    label={t("uiKit.sections.fields.enableNotifications")}
                    description={t("uiKit.sections.fields.enableNotificationsDescription")}
                    defaultChecked
                  />
                  <Radio name="density" label={t("uiKit.sections.fields.comfortableDensity")} defaultChecked />
                  <Radio name="density" label={t("uiKit.sections.fields.compactDensity")} />
                  <Switch checked={switchOn} onCheckedChange={setSwitchOn} label={t("uiKit.sections.fields.activeState")} />
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section title={t("uiKit.sections.badgesCards.title")} description={t("uiKit.sections.badgesCards.description")}>
            <div className="grid gap-4 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>{t("uiKit.sections.badgesCards.statusesTitle")}</CardTitle>
                  <CardDescription>{t("uiKit.sections.badgesCards.statusesDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {statusTokens.map((item) => (
                    <StatusBadge key={item.labelKey} status={item.status}>
                      {t(item.labelKey)}
                    </StatusBadge>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("uiKit.sections.badgesCards.statsTitle")}</CardTitle>
                  <CardDescription>{t("uiKit.sections.badgesCards.statsDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-text-primary">486</div>
                    <div className="text-sm text-text-muted">{t("uiKit.sections.badgesCards.recordsInSystem")}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("uiKit.sections.badgesCards.tooltipAvatarTitle")}</CardTitle>
                  <CardDescription>{t("uiKit.sections.badgesCards.tooltipAvatarDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{t("uiKit.sections.badgesCards.avatarFallback")}</AvatarFallback>
                  </Avatar>
                  <Tooltip content={t("uiKit.sections.badgesCards.tooltipContent")}>
                    <Button variant="outline" size="icon" aria-label={t("layout.tooltips.notifications")}>
                      <Bell className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Badge>{t("uiKit.sections.badgesCards.neutral")}</Badge>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section title={t("uiKit.sections.table.title")} description={t("uiKit.sections.table.description")}>
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("uiKit.sections.table.headers.id")}</TableHead>
                    <TableHead>{t("uiKit.sections.table.headers.component")}</TableHead>
                    <TableHead>{t("uiKit.sections.table.headers.group")}</TableHead>
                    <TableHead>{t("uiKit.sections.table.headers.status")}</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.id}</TableCell>
                      <TableCell>{t(row.componentKey)}</TableCell>
                      <TableCell className="text-text-secondary">{t(row.ownerKey)}</TableCell>
                      <TableCell>
                        <StatusBadge status={row.status}>{t("status.done")}</StatusBadge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" aria-label={t("common.actions.open")}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="mt-4 flex justify-end">
              <Pagination page={page} pageCount={3} onPageChange={setPage} />
            </div>
          </Section>

          <Section title={t("uiKit.sections.modalTabs.title")} description={t("uiKit.sections.modalTabs.description")}>
            <Card>
              <CardContent className="space-y-4">
                <Button onClick={() => setModalOpen(true)}>{t("uiKit.sections.modalTabs.openModal")}</Button>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">{t("uiKit.sections.modalTabs.overview")}</TabsTrigger>
                    <TabsTrigger value="details">{t("uiKit.sections.modalTabs.details")}</TabsTrigger>
                    <TabsTrigger value="history">{t("uiKit.sections.modalTabs.history")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">{t("uiKit.sections.modalTabs.overviewContent")}</TabsContent>
                  <TabsContent value="details">{t("uiKit.sections.modalTabs.detailsContent")}</TabsContent>
                  <TabsContent value="history">{t("uiKit.sections.modalTabs.historyContent")}</TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </Section>

          <Section title={t("uiKit.sections.states.title")} description={t("uiKit.sections.states.description")}>
            <div className="grid gap-4 lg:grid-cols-2">
              <EmptyState
                title={t("common.states.emptyTitle")}
                description={t("common.states.emptyDescription")}
                actionLabel={t("uiKit.sections.states.addRecord")}
              />
              <Card>
                <CardContent className="space-y-4">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-2/3" />
                </CardContent>
              </Card>
            </div>
          </Section>
        </div>
      </PageContainer>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={t("uiKit.modal.title")}
        description={t("uiKit.modal.description")}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              {t("common.actions.cancel")}
            </Button>
            <Button onClick={() => setModalOpen(false)}>{t("common.actions.save")}</Button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input label={t("common.labels.name")} placeholder={t("common.placeholders.enterName")} />
          <Select
            label={t("common.labels.category")}
            placeholder={t("common.placeholders.selectCategory")}
            defaultValue=""
            options={[
              { label: t("uiKit.modal.optionMain"), value: "main" },
              { label: t("uiKit.modal.optionSecondary"), value: "secondary" },
            ]}
          />
          <Textarea
            className="md:col-span-2"
            label={t("common.labels.description")}
            placeholder={t("common.placeholders.enterDescription")}
          />
        </div>
      </Modal>
    </AppShell>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-card-title text-text-primary">{title}</h2>
        {description ? <p className="mt-1 text-sm text-text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
