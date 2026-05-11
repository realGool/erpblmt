import { useMemo, useState } from "react";
import { Banknote, Building2, ChevronRight, FileText, ListFilter, Users, UserRoundCheck, WalletCards } from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import {
  ActionMenu,
  Badge,
  Button,
  Card,
  CardContent,
  ConfirmDialog,
  DetailInfoGrid,
  displayDictionaryValue,
  EmptyState,
  MockMapCard,
  Pagination,
  SearchField,
  Select,
  StatsCard,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui";
import { BranchFormModal } from "../../features/organizations/BranchFormModal";
import { initialBranches, mainOrganization, type BranchRecord, type OrganizationRecord } from "../../data/mockOrganizations";
import { useI18n } from "../../i18n";

type ModalState =
  | { type: "add" }
  | { type: "edit"; branch: BranchRecord }
  | { type: "delete"; branch: BranchRecord; scenario: "allowed" | "blocked" }
  | null;

interface OrganizationPageProps {
  onNavigate?: (key: SidebarNavigationKey) => void;
}

export function OrganizationPage({ onNavigate }: OrganizationPageProps) {
  const { t } = useI18n();
  const [branches, setBranches] = useState(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState<BranchRecord | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [page, setPage] = useState(1);
  const [branchSearch, setBranchSearch] = useState("");
  const [branchSort, setBranchSort] = useState("newest");
  const [branchType, setBranchType] = useState("all");
  const [branchFiltersOpen, setBranchFiltersOpen] = useState(false);

  const currentRecord = selectedBranch ?? mainOrganization;
  const isBranchView = Boolean(selectedBranch);

  const detailItems = useMemo(() => createDetailItems(currentRecord, t), [currentRecord, t]);

  const visibleBranches = useMemo(() => {
    const query = branchSearch.trim().toLowerCase();

    return branches
      .filter((branch) => {
        const matchesSearch =
          !query ||
          [branch.shortName, branch.legalName, branch.cityDistrict, branch.street, branch.taxId, branch.registrationNumber]
            .join(" ")
            .toLowerCase()
            .includes(query);
        const matchesType = branchType === "all" || branch.organizationType === branchType;
        return matchesSearch && matchesType;
      })
      .sort((first, second) => {
        const firstNumber = Number(first.rowNumber);
        const secondNumber = Number(second.rowNumber);
        return branchSort === "oldest" ? firstNumber - secondNumber : secondNumber - firstNumber;
      });
  }, [branchSearch, branchSort, branchType, branches]);

  const saveBranch = (branch: BranchRecord) => {
    setBranches((current) => {
      const existing = current.some((item) => item.id === branch.id);
      if (existing) return current.map((item) => (item.id === branch.id ? branch : item));
      return [{ ...branch, id: `branch-${Date.now()}` }, ...current];
    });
  };

  const deleteBranch = (branch: BranchRecord) => {
    setBranches((current) => current.filter((item) => item.id !== branch.id));
    if (selectedBranch?.id === branch.id) setSelectedBranch(null);
  };

  return (
    <AppShell
      activeNavigation="organization"
      onNavigate={(key) => {
        if (key === "organization") setSelectedBranch(null);
        else onNavigate?.(key);
      }}
    >
      <PageContainer>
        <PageHeader
          title={isBranchView ? t("organizations.page.branchTitle") : t("organizations.page.title")}
          description={isBranchView ? t("organizations.page.branchDescription") : t("organizations.page.description")}
          breadcrumbs={[
            { label: t("navigation.home"), href: "#" },
            { label: t("navigation.organization"), href: "#" },
            ...(isBranchView ? [{ label: currentRecord.shortName }] : []),
          ]}
        />

        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-page-title text-text-primary">{currentRecord.shortName}</h2>
                <p className="mt-1 text-sm text-text-muted">
                  {t(`organizations.options.${currentRecord.organizationForm}`)} · {currentRecord.legalName}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">{organizationOptionLabel(currentRecord.organizationType, t)}</Badge>
                <StatusBadge status="success">{organizationOptionLabel(currentRecord.ownership, t)}</StatusBadge>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
            <Card>
              <CardContent>
                <DetailInfoGrid items={detailItems} />
              </CardContent>
            </Card>
            <MockMapCard
              title={t("organizations.map.title")}
              placeholder={t("organizations.map.placeholder")}
              locationLabel={t("organizations.map.locationLabel")}
              cityDistrict={currentRecord.cityDistrict}
              street={currentRecord.street}
              coordinates={currentRecord.coordinates}
              labels={[
                t("organizations.map.labels.yunusobod"),
                t("organizations.map.labels.chilonzor"),
                t("organizations.map.labels.mirzoUlugbek"),
                t("organizations.map.labels.sergeli"),
              ]}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title={t("organizations.stats.children")}
              value={currentRecord.stats.children}
              icon={<Users className="h-6 w-6" />}
              onClick={() => onNavigate?.("children")}
            />
            <StatsCard
              title={t("organizations.stats.groups")}
              value={currentRecord.stats.groups}
              icon={<Building2 className="h-6 w-6" />}
              onClick={() => onNavigate?.("groups")}
            />
            <StatsCard
              title={t("organizations.stats.employees")}
              value={currentRecord.stats.employees}
              icon={<UserRoundCheck className="h-6 w-6" />}
              onClick={() => onNavigate?.("employees")}
            />
            <StatsCard
              title={t("organizations.stats.finance")}
              value={currentRecord.stats.finance}
              icon={<WalletCards className="h-6 w-6" />}
              onClick={() => onNavigate?.("finance")}
            />
          </div>

          {!isBranchView ? (
            <Card>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                    <h2 className="text-card-title text-text-primary">{t("organizations.page.branchesTitle")}</h2>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end xl:justify-end">
                      <SearchField
                        className="sm:w-80"
                        value={branchSearch}
                        onChange={(event) => setBranchSearch(event.target.value)}
                        placeholder={t("organizations.filters.search")}
                      />
                      <Select
                        className="sm:w-44"
                        aria-label={t("organizations.filters.sort")}
                        value={branchSort}
                        options={[
                          { label: t("organizations.actions.newestFirst"), value: "newest" },
                          { label: t("organizations.actions.oldestFirst"), value: "oldest" },
                        ]}
                        onChange={(event) => setBranchSort(event.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        leftIcon={<ListFilter className="h-4 w-4" />}
                        onClick={() => setBranchFiltersOpen((open) => !open)}
                        aria-expanded={branchFiltersOpen}
                      >
                        {t("common.actions.filters")}
                      </Button>
                      <Button onClick={() => setModalState({ type: "add" })}>
                        {t("organizations.actions.addBranch")}
                      </Button>
                    </div>
                  </div>

                  {branchFiltersOpen ? (
                    <div className="grid gap-3 rounded-xl border border-border-subtle bg-surface-muted/40 p-3 sm:grid-cols-2 lg:grid-cols-4">
                      <Select
                        label={t("organizations.filters.organizationType")}
                        value={branchType}
                        options={[
                          { label: t("organizations.filters.allTypes"), value: "all" },
                          { label: t("organizations.options.generalType"), value: "generalType" },
                          { label: t("organizations.options.combinedType"), value: "combinedType" },
                          { label: t("organizations.options.inclusiveType"), value: "inclusiveType" },
                          { label: t("organizations.options.specializedType"), value: "specializedType" },
                        ]}
                        onChange={(event) => setBranchType(event.target.value)}
                      />
                    </div>
                  ) : null}
                </div>

                {visibleBranches.length ? (
                  <>
                    <TableContainer>
                      <Table className="min-w-[1180px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("organizations.labels.rowNumber")}</TableHead>
                            <TableHead>{t("organizations.labels.organizationName")}</TableHead>
                            <TableHead>{t("organizations.labels.taxId")}</TableHead>
                            <TableHead>{t("organizations.labels.ownership")}</TableHead>
                            <TableHead>{t("organizations.labels.organizationType")}</TableHead>
                            <TableHead>{t("organizations.labels.cityDistrict")}</TableHead>
                            <TableHead>{t("organizations.labels.street")}</TableHead>
                            <TableHead>{t("organizations.labels.childrenCount")}</TableHead>
                            <TableHead>{t("organizations.labels.teachersCount")}</TableHead>
                            <TableHead className="w-12" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {visibleBranches.map((branch) => (
                            <TableRow key={branch.id} className="cursor-pointer" onClick={() => setSelectedBranch(branch)}>
                              <TableCell className="font-medium">{branch.rowNumber}</TableCell>
                              <TableCell>{branch.shortName}</TableCell>
                              <TableCell>{`${branch.taxId} / ${branch.registrationNumber}`}</TableCell>
                              <TableCell>
                                <StatusBadge status="success">{organizationOptionLabel(branch.ownership, t)}</StatusBadge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={branch.organizationType === "inclusiveType" ? "purple" : "info"}>
                                  {organizationOptionLabel(branch.organizationType, t)}
                                </Badge>
                              </TableCell>
                              <TableCell>{branch.cityDistrict}</TableCell>
                              <TableCell>{branch.street}</TableCell>
                              <TableCell>{branch.childrenCount}</TableCell>
                              <TableCell>{branch.teachersCount}</TableCell>
                              <TableCell>
                                <ActionMenu
                                  label={t("common.actions.open")}
                                  items={[
                                    { label: t("common.actions.details"), onClick: () => setSelectedBranch(branch) },
                                    { label: t("common.actions.edit"), onClick: () => setModalState({ type: "edit", branch }) },
                                    {
                                      label: t("common.actions.delete"),
                                      tone: "danger",
                                      onClick: () =>
                                        setModalState({
                                          type: "delete",
                                          branch,
                                          scenario: branch.dependenciesCount > 0 ? "blocked" : "allowed",
                                        }),
                                    },
                                  ]}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm font-medium text-text-secondary">
                        {t("organizations.page.totalBranches", { count: visibleBranches.length })}
                      </div>
                      <Pagination page={page} pageCount={2} onPageChange={setPage} />
                    </div>
                  </>
                ) : (
                  <EmptyState
                    title={t("organizations.empty.branchesTitle")}
                    description={t("organizations.empty.branchesDescription")}
                    actionLabel={t("organizations.actions.addBranch")}
                    onAction={() => setModalState({ type: "add" })}
                  />
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </PageContainer>

      <BranchFormModal
        open={modalState?.type === "add" || modalState?.type === "edit"}
        mode={modalState?.type === "edit" ? "edit" : "add"}
        initialValues={modalState?.type === "edit" ? modalState.branch : undefined}
        onOpenChange={(open) => !open && setModalState(null)}
        onSave={saveBranch}
      />

      {modalState?.type === "delete" ? (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && setModalState(null)}
          title={
            modalState.scenario === "allowed"
              ? t("organizations.delete.canDeleteTitle")
              : t("organizations.delete.blockedTitle")
          }
          description={
            modalState.scenario === "allowed"
              ? t("organizations.delete.canDeleteText", { organizationName: modalState.branch.shortName })
              : t("organizations.delete.blockedText", {
                  organizationName: modalState.branch.shortName,
                  count: modalState.branch.dependenciesCount,
                })
          }
          confirmLabel={modalState.scenario === "allowed" ? t("common.actions.delete") : t("common.actions.goToBranch")}
          cancelLabel={t("common.actions.cancel")}
          variant={modalState.scenario === "allowed" ? "danger" : "primary"}
          onConfirm={() => {
            if (modalState.scenario === "allowed") deleteBranch(modalState.branch);
            else setSelectedBranch(modalState.branch);
          }}
        />
      ) : null}
    </AppShell>
  );
}

function createDetailItems(record: OrganizationRecord, t: (key: string) => string) {
  return [
    { label: t("organizations.labels.organizationType"), value: organizationOptionLabel(record.organizationType, t) },
    { label: t("organizations.labels.ownership"), value: organizationOptionLabel(record.ownership, t) },
    { label: t("organizations.labels.createdAt"), value: record.createdAt },
    { label: t("organizations.labels.cityDistrict"), value: record.cityDistrict },
    { label: t("organizations.labels.taxId"), value: record.taxId },
    { label: t("organizations.labels.street"), value: record.street },
    { label: t("organizations.labels.registrationNumber"), value: record.registrationNumber },
    { label: t("organizations.labels.phone"), value: record.phone },
    {
      label: t("organizations.labels.license"),
      value: (
        <span className="inline-flex items-center gap-2 text-primary">
          <FileText className="h-4 w-4" />
          {record.licenseFile}
        </span>
      ),
    },
    { label: t("organizations.labels.ownerDirector"), value: record.ownerDirectorName },
    { label: t("organizations.labels.bankAccount"), value: record.bankAccount },
    { label: t("organizations.labels.managementPhone"), value: record.managementPhone },
  ];
}

function organizationOptionLabel(value: string, t: (key: string) => string) {
  return value.startsWith("custom:") ? displayDictionaryValue(value) : t(`organizations.options.${value}`);
}
