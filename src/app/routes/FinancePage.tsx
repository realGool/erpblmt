import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertCircle, Banknote, CalendarDays, CheckCircle2, CreditCard, Edit3, Info, Lock, Plus, ReceiptText, Search, Tag, WalletCards } from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import { Badge, Button, Card, CardContent, CrudSelect, EmptyState, Input, Modal, Pagination, Select, StatusBadge, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from "../../components/ui";
import { financeBranches, payments, tariffs, type Payment, type PaymentStatus, type Tariff, type TariffStatus, type TariffType } from "../../data/mockFinance";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

type FinanceSection = "tariffs" | "payments" | "debts";

interface FinancePageProps {
  section?: FinanceSection;
  onNavigate?: (key: SidebarNavigationKey) => void;
}

const sectionNavigation: Record<FinanceSection, SidebarNavigationKey> = {
  tariffs: "financeTariffs",
  payments: "financePayments",
  debts: "financeDebts",
};

const tariffTypeVariant: Record<TariffType, "info" | "warning"> = {
  state: "info",
  commercial: "warning",
};

const tariffStatusVariant: Record<TariffStatus, "success" | "neutral"> = {
  active: "success",
  archived: "neutral",
};

const paymentStatusVariant: Record<PaymentStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  overdue: "danger",
};

export function FinancePage({ section = "tariffs", onNavigate }: FinancePageProps) {
  const { t } = useI18n();

  return (
    <AppShell activeNavigation={sectionNavigation[section]} onNavigate={onNavigate}>
      <PageContainer>
        {section === "tariffs" ? <TariffsView /> : null}
        {section === "payments" ? <PaymentsView /> : null}
        {section === "debts" ? <DebtsView /> : null}
      </PageContainer>
    </AppShell>
  );
}

function TariffsView() {
  const { t } = useI18n();
  const [branch, setBranch] = useState("bolajon");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);

  const filteredTariffs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return tariffs.filter((tariff) => {
      const matchesTab = tab === "all" || tariff.status === tab;
      const matchesQuery = !normalizedQuery || tariff.name.toLocaleLowerCase().includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
  }, [query, tab]);

  return (
    <>
      <PageHeader
        title={t("finance.tariffs.title")}
        description={t("finance.tariffs.description")}
        breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.finance") }, { label: t("finance.nav.tariffs") }]}
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelectedTariff(null);
              setModalOpen(true);
            }}
          >
            {t("finance.tariffs.actions.add")}
          </Button>
        }
      />

      <div className="space-y-5">
        <Card>
          <CardContent className="grid gap-4 lg:grid-cols-[minmax(260px,380px)_minmax(240px,1fr)]">
            <Select
              label={t("finance.tariffs.filters.branch")}
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              options={financeBranches}
            />
            <div>
              <Input
                label={t("finance.tariffs.filters.searchLabel")}
                placeholder={t("finance.tariffs.filters.search")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <FinanceMetric icon={<Tag className="h-5 w-5" />} label={t("finance.tariffs.stats.total")} value="14" tone="info" />
          <FinanceMetric icon={<CheckCircle2 className="h-5 w-5" />} label={t("finance.tariffs.stats.active")} value="11" tone="success" />
          <FinanceMetric icon={<WalletCards className="h-5 w-5" />} label={t("finance.tariffs.stats.average")} value={formatSom(1325000)} tone="warning" />
        </div>

        <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <TabsList>
              <TabsTrigger value="all">{t("finance.tariffs.tabs.all")}</TabsTrigger>
              <TabsTrigger value="archived">{t("finance.tariffs.tabs.archive")}</TabsTrigger>
            </TabsList>
            <div className="text-sm text-text-muted">{t("finance.tariffs.total", { shown: filteredTariffs.length, total: 14 })}</div>
          </div>

          <TabsContent value="all" className="border-0 bg-transparent p-0 shadow-none">
            <TariffGrid
              tariffs={filteredTariffs}
              onEdit={(tariff) => {
                setSelectedTariff(tariff);
                setModalOpen(true);
              }}
            />
          </TabsContent>
          <TabsContent value="archived" className="border-0 bg-transparent p-0 shadow-none">
            <TariffGrid
              tariffs={filteredTariffs}
              onEdit={(tariff) => {
                setSelectedTariff(tariff);
                setModalOpen(true);
              }}
            />
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-text-secondary">{t("finance.tariffs.total", { shown: filteredTariffs.length, total: 14 })}</div>
          <div className="flex flex-wrap items-center gap-4">
            <Pagination page={1} pageCount={5} />
            <Select className="w-28" value="6" onChange={() => undefined} options={[{ label: "6", value: "6" }, { label: "12", value: "12" }]} />
          </div>
        </div>
      </div>

      <TariffFormModal key={selectedTariff?.id ?? "new"} open={modalOpen} tariff={selectedTariff} onClose={() => setModalOpen(false)} />
    </>
  );
}

function TariffGrid({ tariffs: items, onEdit }: { tariffs: Tariff[]; onEdit: (tariff: Tariff) => void }) {
  const { t } = useI18n();

  if (!items.length) {
    return <EmptyState title={t("finance.tariffs.empty.title")} description={t("finance.tariffs.empty.description")} />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {items.map((tariff) => (
        <TariffCard key={tariff.id} tariff={tariff} onEdit={onEdit} />
      ))}
    </div>
  );
}

function TariffCard({ tariff, onEdit }: { tariff: Tariff; onEdit: (tariff: Tariff) => void }) {
  const { t } = useI18n();

  return (
    <Card className="transition hover:shadow-dropdown">
      <CardContent>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{tariff.name}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant={tariffTypeVariant[tariff.type]}>{t(`finance.tariffs.type.${tariff.type}`)}</Badge>
              <StatusBadge status={tariffStatusVariant[tariff.status]}>{t(`finance.tariffs.status.${tariff.status}`)}</StatusBadge>
            </div>
          </div>
          <Button variant="outline" size="icon" aria-label={t("common.actions.edit")} onClick={() => onEdit(tariff)}>
            <Edit3 className="h-4 w-4 text-primary" />
          </Button>
        </div>

        <div className="space-y-3">
          <TariffLine label={t("finance.tariffs.fields.price")} value={formatSom(tariff.price)} strong />
          <TariffLine label={t("finance.tariffs.fields.period")} value={t(`finance.tariffs.period.${tariff.period}`)} />
          <TariffLine label={t("finance.tariffs.fields.conditions")} value={tariff.conditions} multiline />
          <TariffLine label={t("finance.tariffs.fields.createdAt")} value={tariff.createdAt} />
          <TariffLine label={t("finance.tariffs.fields.createdBy")} value={tariff.createdBy} />
        </div>
      </CardContent>
    </Card>
  );
}

function TariffLine({ label, value, strong, multiline }: { label: string; value: string; strong?: boolean; multiline?: boolean }) {
  return (
    <div className={cn("grid gap-3 text-sm sm:grid-cols-[170px_minmax(0,1fr)]", multiline && "items-start")}>
      <span className="text-text-muted">{label}</span>
      <span className={cn("text-text-primary", strong ? "font-semibold" : "font-medium")}>{value}</span>
    </div>
  );
}

function FinanceMetric({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: "info" | "success" | "warning" }) {
  const toneClass = {
    info: "bg-info-bg text-info-text",
    success: "bg-success-bg text-success-text",
    warning: "bg-warning-bg text-warning-text",
  }[tone];

  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-input", toneClass)}>{icon}</div>
        <div>
          <div className="text-2xl font-semibold text-text-primary">{value}</div>
          <div className="text-sm text-text-secondary">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentsView() {
  const { t } = useI18n();
  const [branch, setBranch] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);
  const [paymentForm, setPaymentForm] = useState<Payment | null>(null);
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false);

  const filteredPayments = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return payments.filter((payment) => {
      const matchesBranch = branch === "all" || payment.branch === financeBranches.find((item) => item.value === branch)?.label;
      const matchesStatus = status === "all" || payment.status === status;
      const matchesQuery =
        !normalizedQuery ||
        payment.childName.toLocaleLowerCase().includes(normalizedQuery) ||
        payment.parentName.toLocaleLowerCase().includes(normalizedQuery) ||
        payment.invoiceNumber.toLocaleLowerCase().includes(normalizedQuery);
      return matchesBranch && matchesStatus && matchesQuery;
    });
  }, [branch, query, status]);

  const paidTotal = payments.reduce((sum, payment) => sum + payment.paidAmount, 0);
  const expectedTotal = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const overdueTotal = payments.filter((payment) => payment.status === "overdue").reduce((sum, payment) => sum + payment.amount - payment.paidAmount, 0);

  return (
    <>
      <PageHeader
        title={t("finance.payments.title")}
        description={t("finance.payments.description")}
        breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.finance") }, { label: t("finance.nav.payments") }]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreatePaymentOpen(true)}>
            {t("finance.payments.actions.add")}
          </Button>
        }
      />

      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <FinanceMetric icon={<WalletCards className="h-5 w-5" />} label={t("finance.payments.stats.paid")} value={formatSom(paidTotal)} tone="success" />
          <FinanceMetric icon={<ReceiptText className="h-5 w-5" />} label={t("finance.payments.stats.expected")} value={formatSom(expectedTotal)} tone="info" />
          <FinanceMetric icon={<AlertCircle className="h-5 w-5" />} label={t("finance.payments.stats.overdue")} value={formatSom(overdueTotal)} tone="warning" />
        </div>

        <Card>
          <CardContent className="grid gap-4 xl:grid-cols-[minmax(260px,1fr)_220px_220px]">
            <Input
              label={t("finance.payments.filters.searchLabel")}
              placeholder={t("finance.payments.filters.search")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
            <Select
              label={t("finance.payments.filters.branch")}
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              options={[{ label: t("finance.payments.filters.allBranches"), value: "all" }, ...financeBranches]}
            />
            <Select
              label={t("finance.payments.filters.status")}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              options={[
                { label: t("finance.payments.filters.allStatuses"), value: "all" },
                { label: t("finance.payments.status.paid"), value: "paid" },
                { label: t("finance.payments.status.pending"), value: "pending" },
                { label: t("finance.payments.status.overdue"), value: "overdue" },
              ]}
            />
          </CardContent>
        </Card>

        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("finance.payments.table.child")}</TableHead>
                <TableHead>{t("finance.payments.table.parent")}</TableHead>
                <TableHead>{t("finance.payments.table.tariff")}</TableHead>
                <TableHead>{t("finance.payments.table.amount")}</TableHead>
                <TableHead>{t("finance.payments.table.paidAmount")}</TableHead>
                <TableHead>{t("finance.payments.table.status")}</TableHead>
                <TableHead>{t("finance.payments.table.dueDate")}</TableHead>
                <TableHead className="text-right">{t("finance.payments.table.document")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-semibold">{payment.childName}</div>
                    <div className="text-xs text-text-muted">{payment.group}</div>
                  </TableCell>
                  <TableCell>{payment.parentName}</TableCell>
                  <TableCell>
                    <div className="font-medium">{payment.tariffName}</div>
                    <div className="text-xs text-text-muted">{payment.period}</div>
                  </TableCell>
                  <TableCell className="font-semibold">{formatSom(payment.amount)}</TableCell>
                  <TableCell>{formatSom(payment.paidAmount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={paymentStatusVariant[payment.status]}>{t(`finance.payments.status.${payment.status}`)}</StatusBadge>
                  </TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={payment.status === "paid" ? "outline" : "primary"}
                      size="sm"
                      leftIcon={payment.status === "paid" ? <ReceiptText className="h-4 w-4" /> : undefined}
                      onClick={() => {
                        if (payment.status === "paid") {
                          setReceiptPayment(payment);
                          return;
                        }

                        setPaymentForm(payment);
                      }}
                    >
                      {payment.status === "paid" ? t("finance.payments.actions.receipt") : t("finance.payments.actions.pay")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-text-secondary">{t("finance.payments.total", { shown: filteredPayments.length, total: payments.length })}</div>
          <Pagination page={1} pageCount={3} />
        </div>
      </div>

      <PaymentFormModal
        key={paymentForm?.id ?? (createPaymentOpen ? "new-payment" : "closed-payment")}
        open={Boolean(paymentForm) || createPaymentOpen}
        payment={paymentForm}
        onClose={() => {
          setPaymentForm(null);
          setCreatePaymentOpen(false);
        }}
      />
      <PaymentReadModal payment={receiptPayment} onClose={() => setReceiptPayment(null)} />
    </>
  );
}

function PaymentFormModal({ open, payment, onClose }: { open: boolean; payment: Payment | null; onClose: () => void }) {
  const { t } = useI18n();
  const [method, setMethod] = useState<Payment["method"]>(payment?.method ?? "card");
  const outstanding = payment ? Math.max(payment.amount - payment.paidAmount, 0) : 850000;
  const selectedChild = payment?.childName ?? payments[0].childName;
  const selectedTariff = payment?.tariffName ?? payments[0].tariffName;

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={payment ? t("finance.payments.form.payTitle") : t("finance.payments.form.addTitle")}
      size="md"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <Button variant="outline" onClick={onClose}>{t("common.actions.cancel")}</Button>
          <Button onClick={onClose}>{t("common.actions.save")}</Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="space-y-4">
          <Select
            label={t("finance.payments.form.selectChild")}
            defaultValue={selectedChild}
            options={payments.map((item) => ({ label: item.childName, value: item.childName }))}
          />
          <Input
            label={t("finance.payments.table.tariff")}
            defaultValue={selectedTariff}
            disabled
            rightIcon={<Lock className="h-4 w-4" />}
          />
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-text-primary">{t("finance.payments.form.selectPeriod")}</div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label={t("finance.payments.form.dateFrom")} type="date" defaultValue="2026-05-01" />
            <Input label={t("finance.payments.form.dateTo")} type="date" defaultValue="2026-05-31" />
          </div>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-text-primary">{t("finance.payments.form.paymentType")}</div>
          <div className="grid gap-4 md:grid-cols-2">
            <PaymentMethodCard
              active={method === "card"}
              icon={<CreditCard className="h-5 w-5" />}
              label={t("finance.payments.method.card")}
              onClick={() => setMethod("card")}
            />
            <PaymentMethodCard
              active={method === "cash"}
              icon={<Banknote className="h-5 w-5" />}
              label={t("finance.payments.method.cash")}
              onClick={() => setMethod("cash")}
            />
          </div>
        </div>

        <div>
          <Input
            label={t("finance.payments.form.amountToPay")}
            defaultValue={new Intl.NumberFormat("ru-RU").format(outstanding)}
            rightIcon={<span className="text-sm font-medium text-text-muted">{t("finance.tariffs.currency")}</span>}
          />
          <p className="mt-2 text-xs leading-5 text-text-muted">{t("finance.payments.form.amountHint")}</p>
        </div>

        <div className="flex items-center gap-3 rounded-input bg-primary-soft px-4 py-3 text-sm font-medium text-primary">
          <Info className="h-4 w-4 shrink-0" />
          {t("finance.payments.form.afterSaveHint")}
        </div>
      </div>
    </Modal>
  );
}

function DebtsView() {
  const { t } = useI18n();
  const [branch, setBranch] = useState("all");
  const [query, setQuery] = useState("");
  const [paymentForm, setPaymentForm] = useState<Payment | null>(null);

  const debtPayments = useMemo(() => payments.filter((payment) => payment.status === "overdue"), []);
  const filteredDebts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return debtPayments.filter((payment) => {
      const matchesBranch = branch === "all" || payment.branch === financeBranches.find((item) => item.value === branch)?.label;
      const matchesQuery =
        !normalizedQuery ||
        payment.childName.toLocaleLowerCase().includes(normalizedQuery) ||
        payment.parentName.toLocaleLowerCase().includes(normalizedQuery) ||
        payment.invoiceNumber.toLocaleLowerCase().includes(normalizedQuery);
      return matchesBranch && matchesQuery;
    });
  }, [branch, debtPayments, query]);

  const debtTotal = debtPayments.reduce((sum, payment) => sum + Math.max(payment.amount - payment.paidAmount, 0), 0);
  const accruedTotal = debtPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <>
      <PageHeader
        title={t("finance.debts.title")}
        description={t("finance.debts.description")}
        breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.finance") }, { label: t("finance.nav.debts") }]}
      />

      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <FinanceMetric icon={<AlertCircle className="h-5 w-5" />} label={t("finance.debts.stats.totalDebt")} value={formatSom(debtTotal)} tone="warning" />
          <FinanceMetric icon={<ReceiptText className="h-5 w-5" />} label={t("finance.debts.stats.accrued")} value={formatSom(accruedTotal)} tone="info" />
          <FinanceMetric icon={<WalletCards className="h-5 w-5" />} label={t("finance.debts.stats.accounts")} value={String(debtPayments.length)} tone="warning" />
        </div>

        <Card>
          <CardContent className="grid gap-4 lg:grid-cols-[minmax(260px,1fr)_260px]">
            <Input
              label={t("finance.debts.filters.searchLabel")}
              placeholder={t("finance.debts.filters.search")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
            <Select
              label={t("finance.debts.filters.branch")}
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              options={[{ label: t("finance.payments.filters.allBranches"), value: "all" }, ...financeBranches]}
            />
          </CardContent>
        </Card>

        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("finance.payments.table.child")}</TableHead>
                <TableHead>{t("finance.payments.table.parent")}</TableHead>
                <TableHead>{t("finance.payments.table.tariff")}</TableHead>
                <TableHead>{t("finance.payments.table.amount")}</TableHead>
                <TableHead>{t("finance.payments.table.paidAmount")}</TableHead>
                <TableHead>{t("finance.debts.table.debt")}</TableHead>
                <TableHead>{t("finance.payments.table.dueDate")}</TableHead>
                <TableHead className="text-right">{t("finance.payments.actions.pay")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDebts.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-semibold">{payment.childName}</div>
                    <div className="text-xs text-text-muted">{payment.group}</div>
                  </TableCell>
                  <TableCell>{payment.parentName}</TableCell>
                  <TableCell>
                    <div className="font-medium">{payment.tariffName}</div>
                    <div className="text-xs text-text-muted">{payment.period}</div>
                  </TableCell>
                  <TableCell>{formatSom(payment.amount)}</TableCell>
                  <TableCell>{formatSom(payment.paidAmount)}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-danger-text">{formatSom(Math.max(payment.amount - payment.paidAmount, 0))}</div>
                  </TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => setPaymentForm(payment)}>
                      {t("finance.payments.actions.pay")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-text-secondary">{t("finance.debts.total", { shown: filteredDebts.length, total: debtPayments.length })}</div>
          <Pagination page={1} pageCount={2} />
        </div>
      </div>

      <PaymentFormModal
        key={paymentForm?.id ?? "closed-debt-payment"}
        open={Boolean(paymentForm)}
        payment={paymentForm}
        onClose={() => setPaymentForm(null)}
      />
    </>
  );
}

function PaymentMethodCard({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-14 items-center gap-3 rounded-input border px-4 text-left text-sm font-semibold transition-colors",
        active ? "border-primary bg-primary-soft text-primary ring-1 ring-inset ring-primary" : "border-border bg-surface text-text-primary hover:bg-page",
      )}
      onClick={onClick}
    >
      <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border", active ? "border-primary" : "border-border")}>
        <span className={cn("h-2.5 w-2.5 rounded-full", active ? "bg-primary" : "bg-transparent")} />
      </span>
      <span className="text-primary">{icon}</span>
      {label}
    </button>
  );
}

function PaymentReadModal({ payment, onClose }: { payment: Payment | null; onClose: () => void }) {
  const { t } = useI18n();

  return (
    <Modal
      open={Boolean(payment)}
      onOpenChange={(open) => !open && onClose()}
      title={payment?.invoiceNumber ?? t("finance.payments.read.title")}
      description={payment ? `${payment.childName} · ${payment.period}` : undefined}
      size="md"
    >
      {payment ? (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-card border border-border bg-page/40 p-4 sm:grid-cols-3">
            <PaymentSummary label={t("finance.payments.table.amount")} value={formatSom(payment.amount)} />
            <PaymentSummary label={t("finance.payments.table.paidAmount")} value={formatSom(payment.paidAmount)} />
            <PaymentSummary label={t("finance.payments.table.status")} value={t(`finance.payments.status.${payment.status}`)} badge={payment.status} />
          </div>

          <Card>
            <CardContent className="space-y-3">
              <ReadLine label={t("finance.payments.table.child")} value={payment.childName} />
              <ReadLine label={t("finance.payments.table.parent")} value={payment.parentName} />
              <ReadLine label={t("finance.payments.fields.branch")} value={payment.branch} />
              <ReadLine label={t("finance.payments.table.tariff")} value={payment.tariffName} />
              <ReadLine label={t("finance.payments.fields.method")} value={t(`finance.payments.method.${payment.method}`)} />
              <ReadLine label={t("finance.payments.table.dueDate")} value={payment.dueDate} />
              <ReadLine label={t("finance.payments.fields.paidAt")} value={payment.paidAt ?? t("finance.payments.fields.notPaid")} />
            </CardContent>
          </Card>

          <div className="rounded-card border border-border p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <CalendarDays className="h-4 w-4 text-primary" />
              {t("common.labels.comment")}
            </div>
            <p className="text-sm leading-6 text-text-secondary">{payment.comment}</p>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function PaymentSummary({ label, value, badge }: { label: string; value: string; badge?: PaymentStatus }) {
  return (
    <div>
      <div className="text-xs font-medium text-text-muted">{label}</div>
      {badge ? <StatusBadge status={paymentStatusVariant[badge]} className="mt-2">{value}</StatusBadge> : <div className="mt-2 font-semibold text-text-primary">{value}</div>}
    </div>
  );
}

function ReadLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-right text-sm font-semibold text-text-primary">{value}</span>
    </div>
  );
}

function TariffFormModal({ open, tariff, onClose }: { open: boolean; tariff: Tariff | null; onClose: () => void }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<TariffStatus>(tariff?.status ?? "active");
  const [tariffType, setTariffType] = useState<string>(tariff?.type ?? "state");

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={tariff ? t("finance.tariffs.modal.editTitle") : t("finance.tariffs.modal.title")}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>{t("common.actions.cancel")}</Button>
          <Button onClick={onClose}>{t("finance.tariffs.modal.save")}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label={t("finance.tariffs.fields.name")} defaultValue={tariff?.name ?? "Полный день"} />
        <CrudSelect
          label={t("finance.tariffs.fields.type")}
          value={tariffType}
          onValueChange={setTariffType}
          options={[
            { label: t("finance.tariffs.type.state"), value: "state" },
            { label: t("finance.tariffs.type.commercial"), value: "commercial" },
          ]}
          addLabel={t("finance.tariffs.typeCrud.add")}
          newItemLabel={t("finance.tariffs.typeCrud.newLabel")}
          newItemPlaceholder={t("finance.tariffs.typeCrud.placeholder")}
          saveLabel={t("common.actions.save")}
          cancelLabel={t("common.actions.cancel")}
        />
        <div>
          <div className="mb-1.5 text-sm font-medium text-text-secondary">{t("finance.tariffs.fields.status")}</div>
          <div className="grid grid-cols-2 overflow-hidden rounded-input border border-border">
            {(["active", "archived"] as TariffStatus[]).map((item) => (
              <button
                key={item}
                type="button"
                className={cn("h-10 text-sm font-semibold transition-colors", status === item ? "bg-primary-soft text-primary ring-1 ring-inset ring-primary" : "bg-surface text-text-secondary hover:bg-page")}
                onClick={() => setStatus(item)}
              >
                {t(`finance.tariffs.status.${item}`)}
              </button>
            ))}
          </div>
        </div>
        <Input label={t("finance.tariffs.fields.price")} defaultValue={tariff ? new Intl.NumberFormat("ru-RU").format(tariff.price) : "800 000"} rightIcon={<span className="text-sm font-medium text-text-muted">{t("finance.tariffs.currency")}</span>} />
        <Select
          label={t("finance.tariffs.fields.period")}
          defaultValue="month"
          options={[
            { label: t("finance.tariffs.period.month"), value: "month" },
            { label: t("finance.tariffs.period.year"), value: "year" },
          ]}
        />
        <Textarea label={t("finance.tariffs.fields.conditions")} defaultValue={tariff?.conditions ?? "Полный день пребывания с питанием, включены все развивающие занятия согласно расписанию."} />
      </div>
    </Modal>
  );
}

function FinancePlaceholder({ section }: { section: Exclude<FinanceSection, "tariffs"> }) {
  const { t } = useI18n();

  return (
    <>
      <PageHeader
        title={t(`finance.${section}.title`)}
        description={t(`finance.${section}.description`)}
        breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.finance") }, { label: t(`finance.nav.${section}`) }]}
      />
      <EmptyState title={t("finance.placeholder.title")} description={t("finance.placeholder.description")} />
    </>
  );
}

function formatSom(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} сум`;
}
