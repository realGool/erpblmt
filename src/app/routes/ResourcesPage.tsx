import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  Box,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  ClipboardPlus,
  Copy,
  Download,
  Edit3,
  Eye,
  MapPin,
  PackageCheck,
  PackagePlus,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  Utensils,
  WalletCards,
} from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FilterBar,
  Input,
  Modal,
  Pagination,
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
import {
  foodProducts,
  inventoryHistory,
  inventoryObjects,
  productBatches,
  purchaseRequests,
  resourceBranches,
  supplierGoods,
  suppliers,
  writeOffHistory,
  type FoodProduct,
  type FoodStockStatus,
  type InventoryCategory,
  type InventoryObject,
  type ProductBatchStatus,
  type PurchaseRequest,
  type PurchaseStatus,
  type ResourceBranch,
  type Supplier,
} from "../../data/mockResources";
import { useI18n } from "../../i18n";

interface ResourcesPageProps {
  section?: "inventory" | "foodStock" | "purchases" | "suppliers";
  onNavigate?: (key: SidebarNavigationKey) => void;
}

type InventoryModal = "details" | "move" | "inventory" | "history" | "create" | null;
const allValue = "all";

export function ResourcesPage({ section = "inventory", onNavigate }: ResourcesPageProps) {
  const { t } = useI18n();
  const [selectedBranch, setSelectedBranch] = useState<ResourceBranch | null>(null);
  const [selectedObject, setSelectedObject] = useState<InventoryObject>(inventoryObjects[0]);
  const [modal, setModal] = useState<InventoryModal>(null);

  const summary = useMemo(
    () =>
      resourceBranches.reduce(
        (acc, branch) => ({
          objects: acc.objects + branch.objectsCount,
          value: acc.value + branch.totalValue,
        }),
        { objects: 0, value: 0 },
      ),
    [],
  );

  const openObjectModal = (item: InventoryObject, modalType: InventoryModal) => {
    setSelectedObject(item);
    setModal(modalType);
  };

  if (section !== "inventory") {
    if (section === "foodStock") return <FoodStockPage onNavigate={onNavigate} />;
    if (section === "purchases") return <PurchasesPage onNavigate={onNavigate} />;
    return <SuppliersPage onNavigate={onNavigate} />;
  }

  return (
    <AppShell activeNavigation="resourcesInventory" onNavigate={onNavigate}>
      {selectedBranch ? (
        <InventoryDetailView
          branch={selectedBranch}
          selectedObject={selectedObject}
          onBack={() => setSelectedBranch(null)}
          onOpenObjectModal={openObjectModal}
          onOpenCreate={() => setModal("create")}
          onOpenHistory={() => setModal("history")}
        />
      ) : (
        <InventoryBranchesView summary={summary} onBranchOpen={setSelectedBranch} />
      )}

      <Modal
        open={modal === "details"}
        onOpenChange={(open) => !open && setModal(null)}
        title={t("resources.inventory.modals.details.title")}
        size="md"
        footer={
          <>
            <Button variant="outline" leftIcon={<ArrowLeftRight className="h-4 w-4" />} onClick={() => setModal("move")}>
              {t("resources.inventory.actions.move")}
            </Button>
            <Button leftIcon={<ClipboardList className="h-4 w-4" />} onClick={() => setModal("inventory")}>
              {t("resources.inventory.actions.inventory")}
            </Button>
          </>
        }
      >
        <ObjectDetails object={selectedObject} branch={selectedBranch} />
      </Modal>

      <Modal
        open={modal === "move"}
        onOpenChange={(open) => !open && setModal(null)}
        title={t("resources.inventory.modals.move.title")}
        description={t("resources.inventory.modals.move.description")}
        footer={<ModalActions submitLabel={t("resources.inventory.actions.moveSubmit")} onClose={() => setModal(null)} />}
      >
        <MoveObjectForm object={selectedObject} branch={selectedBranch} />
      </Modal>

      <Modal
        open={modal === "inventory"}
        onOpenChange={(open) => !open && setModal(null)}
        title={t("resources.inventory.modals.inventory.title")}
        footer={<ModalActions submitLabel={t("common.actions.save")} onClose={() => setModal(null)} />}
      >
        <InventoryObjectForm object={selectedObject} branch={selectedBranch} />
      </Modal>

      <Modal
        open={modal === "history"}
        onOpenChange={(open) => !open && setModal(null)}
        title={t("resources.inventory.modals.history.title")}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModal(null)}>
              {t("common.actions.close")}
            </Button>
            <Button leftIcon={<Download className="h-4 w-4" />}>{t("common.actions.export")}</Button>
          </>
        }
      >
        <InventoryHistory object={selectedObject} branch={selectedBranch} />
      </Modal>

      <Modal
        open={modal === "create"}
        onOpenChange={(open) => !open && setModal(null)}
        title={t("resources.inventory.modals.create.title")}
        description={t("resources.inventory.modals.create.description")}
        size="lg"
        footer={<ModalActions submitLabel={t("resources.inventory.actions.addObject")} onClose={() => setModal(null)} />}
      >
        <CreateObjectForm branch={selectedBranch} />
      </Modal>
    </AppShell>
  );
}

function FoodStockPage({ onNavigate }: { onNavigate?: (key: SidebarNavigationKey) => void }) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(allValue);
  const [supplier, setSupplier] = useState(allValue);
  const [status, setStatus] = useState(allValue);
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct | null>(null);
  const [modal, setModal] = useState<"receive" | "writeOff" | "create" | "writeOffHistory" | null>(null);
  const currencyUnit = t("resources.inventory.currencyUnit");

  const filteredProducts = foodProducts.filter((product) => {
    const query = search.trim().toLocaleLowerCase();
    const matchesSearch = !query || product.id.toLocaleLowerCase().includes(query) || product.name.toLocaleLowerCase().includes(query);
    const matchesCategory = category === allValue || product.category === category;
    const matchesSupplier = supplier === allValue || product.suppliers.includes(supplier);
    const matchesStatus = status === allValue || product.status === status;
    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
  });

  const currentProduct = selectedProduct ?? foodProducts[0];
  const totalValue = foodProducts.reduce((sum, product) => sum + product.currentStock * product.averagePrice, 0);
  const lowCount = foodProducts.filter((product) => product.status === "low").length;
  const expiringCount = foodProducts.filter((product) => product.status === "expiring").length;

  if (selectedProduct) {
    return (
      <FoodProductDetail
        product={selectedProduct}
        onNavigate={onNavigate}
        onBack={() => setSelectedProduct(null)}
        onHistory={() => setModal("writeOffHistory")}
        onEdit={() => setModal("create")}
      />
    );
  }

  return (
    <AppShell activeNavigation="resourcesFoodStock" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader
          title={t("resources.foodStock.page.title")}
          description={t("resources.foodStock.page.description")}
          breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.resources") }, { label: t("resources.nav.foodStock") }]}
        />

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard title={t("resources.foodStock.stats.totalProducts")} value={foodProducts.length} icon={<Box className="h-6 w-6" />} />
            <StatsCard title={t("resources.foodStock.stats.totalValue")} value={formatCurrency(totalValue, currencyUnit)} icon={<WalletCards className="h-6 w-6" />} />
            <StatsCard title={t("resources.foodStock.stats.lowStock")} value={lowCount} icon={<AlertTriangle className="h-6 w-6" />} />
            <StatsCard title={t("resources.foodStock.stats.expiring")} value={expiringCount} icon={<CalendarClock className="h-6 w-6" />} />
          </div>

          <Card>
            <CardContent className="space-y-4">
              <FilterBar
                left={
                  <Input
                    className="w-full sm:w-[360px]"
                    aria-label={t("resources.foodStock.filters.search")}
                    placeholder={t("resources.foodStock.filters.search")}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                }
                right={
                  <>
                    <Button variant="outline" leftIcon={<ClipboardPlus className="h-4 w-4" />} onClick={() => setModal("receive")}>
                      {t("resources.foodStock.actions.receive")}
                    </Button>
                    <Button variant="outline" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setModal("writeOff")}>
                      {t("resources.foodStock.actions.writeOff")}
                    </Button>
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModal("create")}>
                      {t("resources.foodStock.actions.addProduct")}
                    </Button>
                  </>
                }
              />

              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
                <Select label={t("resources.foodStock.filters.category")} value={category} onChange={(event) => setCategory(event.target.value)} options={[{ label: t("resources.foodStock.filters.allCategories"), value: allValue }, ...uniqueOptions(foodProducts.map((item) => item.category))]} />
                <Select label={t("resources.foodStock.filters.supplier")} value={supplier} onChange={(event) => setSupplier(event.target.value)} options={[{ label: t("resources.foodStock.filters.allSuppliers"), value: allValue }, ...uniqueOptions(foodProducts.flatMap((item) => item.suppliers))]} />
                <Select label={t("resources.foodStock.filters.status")} value={status} onChange={(event) => setStatus(event.target.value)} options={[{ label: t("resources.foodStock.filters.allStatuses"), value: allValue }, ...foodStatusOptions(t)]} />
                <Button className="mt-auto" variant="outline" onClick={() => undefined}>
                  {t("resources.inventory.filters.clear")}
                </Button>
              </div>

              <TableContainer>
                <Table className="min-w-[1180px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("resources.foodStock.table.id")}</TableHead>
                      <TableHead>{t("resources.foodStock.table.name")}</TableHead>
                      <TableHead>{t("resources.foodStock.table.category")}</TableHead>
                      <TableHead>{t("resources.foodStock.table.unit")}</TableHead>
                      <TableHead>{t("resources.foodStock.table.currentStock")}</TableHead>
                      <TableHead>{t("resources.foodStock.table.minimumStock")}</TableHead>
                      <TableHead>{t("resources.foodStock.table.nearestExpiry")}</TableHead>
                      <TableHead>{t("resources.foodStock.table.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>{product.currentStock}</TableCell>
                        <TableCell>{product.minimumStock}</TableCell>
                        <TableCell>{product.nearestExpiry}</TableCell>
                        <TableCell>
                          <StatusBadge status={foodStatusVariant(product.status)}>{t(`resources.foodStock.status.${product.status}`)}</StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-medium text-text-secondary">{t("resources.foodStock.table.total", { count: filteredProducts.length })}</div>
                <Pagination page={1} pageCount={4} onPageChange={() => undefined} />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>

      <FoodStockModals modal={modal} product={currentProduct} onClose={() => setModal(null)} />
    </AppShell>
  );
}

function FoodProductDetail({
  product,
  onNavigate,
  onBack,
  onHistory,
  onEdit,
}: {
  product: FoodProduct;
  onNavigate?: (key: SidebarNavigationKey) => void;
  onBack: () => void;
  onHistory: () => void;
  onEdit: () => void;
}) {
  const { t } = useI18n();
  const currencyUnit = t("resources.inventory.currencyUnit");

  return (
    <AppShell activeNavigation="resourcesFoodStock" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader
          title={t("resources.foodStock.detail.title")}
          description={product.name}
          breadcrumbs={[
            { label: t("navigation.home"), href: "#" },
            { label: t("navigation.resources"), href: "#" },
            { label: t("resources.nav.foodStock"), href: "#" },
            { label: t("resources.inventory.page.view") },
          ]}
          actions={
            <>
              <Button variant="outline" onClick={onBack}>
                {t("resources.foodStock.actions.backToStock")}
              </Button>
              <Button variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={onHistory}>
                {t("resources.foodStock.actions.writeOffHistory")}
              </Button>
              <Button leftIcon={<Edit3 className="h-4 w-4" />} onClick={onEdit}>
                {t("common.actions.edit")}
              </Button>
            </>
          }
        />

        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-4">
                  <InfoLine label={t("resources.foodStock.table.id")} value={product.id} />
                  <InfoLine label={t("resources.foodStock.table.name")} value={product.name} />
                  <InfoLine label={t("resources.foodStock.table.category")} value={product.category} />
                  <InfoLine label={t("resources.foodStock.table.status")} value={t(`resources.foodStock.status.${product.status}`)} />
                  <InfoLine label={t("resources.foodStock.table.currentStock")} value={`${product.currentStock} ${product.unit}`} />
                  <InfoLine label={t("resources.foodStock.fields.averagePrice")} value={formatCurrency(product.averagePrice, currencyUnit)} />
                  <InfoLine label={t("resources.foodStock.table.unit")} value={product.unit} />
                  <InfoLine label={t("resources.foodStock.table.minimumStock")} value={`${product.minimumStock} ${product.unit}`} />
                  <InfoLine label={t("resources.foodStock.table.nearestExpiry")} value={product.nearestExpiry} />
                  <InfoLine label={t("resources.foodStock.fields.suppliers")} value={product.suppliers.join(", ")} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("resources.suppliers.page.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {product.suppliers.map((item) => (
                  <button key={item} className="flex h-10 w-full items-center justify-between rounded-input border border-border px-3 text-sm font-medium text-text-primary hover:bg-page">
                    {item}
                    <Eye className="h-4 w-4 text-text-muted" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("resources.foodStock.detail.batches")}</CardTitle>
              <CardDescription>{t("resources.foodStock.detail.batchesDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <TableContainer>
                <Table className="min-w-[1220px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("resources.foodStock.batches.id")}</TableHead>
                      <TableHead>{t("resources.foodStock.batches.product")}</TableHead>
                      <TableHead>{t("resources.foodStock.batches.supplier")}</TableHead>
                      <TableHead>{t("resources.foodStock.batches.receivedAt")}</TableHead>
                      <TableHead>{t("resources.foodStock.batches.receivedQuantity")}</TableHead>
                      <TableHead>{t("resources.foodStock.batches.currentQuantity")}</TableHead>
                      <TableHead>{t("resources.foodStock.batches.unitPrice")}</TableHead>
                      <TableHead>{t("resources.foodStock.batches.expiryDate")}</TableHead>
                      <TableHead>{t("resources.foodStock.batches.status")}</TableHead>
                      <TableHead>{t("resources.foodStock.batches.author")}</TableHead>
                      <TableHead>{t("resources.foodStock.batches.total")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.id}</TableCell>
                        <TableCell>{batch.productName}</TableCell>
                        <TableCell>{batch.supplier}</TableCell>
                        <TableCell>{batch.receivedAt}</TableCell>
                        <TableCell>{batch.receivedQuantity} {product.unit}</TableCell>
                        <TableCell>{batch.currentQuantity} {product.unit}</TableCell>
                        <TableCell>{formatCurrency(batch.unitPrice, currencyUnit)}</TableCell>
                        <TableCell>{batch.expiryDate}</TableCell>
                        <TableCell><StatusBadge status={batchStatusVariant(batch.status)}>{t(`resources.foodStock.batchStatus.${batch.status}`)}</StatusBadge></TableCell>
                        <TableCell>{batch.author}</TableCell>
                        <TableCell>{formatCurrency(batch.receivedQuantity * batch.unitPrice, currencyUnit)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  );
}

function FoodStockModals({ modal, product, onClose }: { modal: "receive" | "writeOff" | "create" | "writeOffHistory" | null; product: FoodProduct; onClose: () => void }) {
  const { t } = useI18n();
  const currencyUnit = t("resources.inventory.currencyUnit");

  return (
    <>
      <Modal open={modal === "receive"} onOpenChange={(open) => !open && onClose()} title={t("resources.foodStock.modals.receive.title")} description={t("resources.foodStock.modals.receive.description")} size="xl" footer={<ModalActions submitLabel={t("common.actions.add")} onClose={onClose} />}>
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Input label={t("resources.foodStock.modals.receive.date")} defaultValue="25.05.2026" />
            <Select label={t("resources.foodStock.filters.supplier")} defaultValue={suppliers[0].company} options={suppliers.map((item) => ({ label: item.company, value: item.company }))} />
            <Select label={t("resources.foodStock.modals.receive.request")} defaultValue={purchaseRequests[0].id} options={purchaseRequests.map((item) => ({ label: `${item.id} — ${item.title}`, value: item.id }))} />
          </div>
          <Select label={t("resources.foodStock.modals.receive.chooseProduct")} defaultValue={product.id} options={foodProducts.slice(0, 5).map((item) => ({ label: item.name, value: item.id }))} />
          <EditableFoodRows type="receive" currencyUnit={currencyUnit} />
        </div>
      </Modal>

      <Modal open={modal === "writeOff"} onOpenChange={(open) => !open && onClose()} title={t("resources.foodStock.modals.writeOff.title")} description={t("resources.foodStock.modals.writeOff.description")} size="xl" footer={<ModalActions submitLabel={t("resources.foodStock.actions.writeOff")} onClose={onClose} />}>
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label={t("resources.foodStock.modals.writeOff.date")} defaultValue="25.05.2026" />
            <Select label={t("resources.foodStock.modals.receive.chooseProduct")} defaultValue={product.id} options={foodProducts.slice(0, 5).map((item) => ({ label: item.name, value: item.id }))} />
          </div>
          <EditableFoodRows type="writeOff" currencyUnit={currencyUnit} />
        </div>
      </Modal>

      <Modal open={modal === "create"} onOpenChange={(open) => !open && onClose()} title={t("resources.foodStock.modals.create.title")} description={t("resources.foodStock.modals.create.description")} size="lg" footer={<ModalActions submitLabel={t("common.actions.save")} onClose={onClose} />}>
        <div className="space-y-4">
          <Input label={t("resources.foodStock.table.name")} defaultValue={product.name} />
          <Select label={t("resources.foodStock.table.category")} defaultValue={product.category} options={uniqueOptions(foodProducts.map((item) => item.category))} />
          <Select label={t("resources.foodStock.table.unit")} defaultValue={product.unit} options={uniqueOptions(["л", "кг", "шт", "пачка", "короб", "комплект"])} />
          <Input label={t("resources.foodStock.table.minimumStock")} type="number" defaultValue={product.minimumStock} />
          <Input label={t("resources.foodStock.fields.averagePrice")} defaultValue={formatNumber(product.averagePrice)} />
          <Select label={t("resources.foodStock.fields.suppliers")} defaultValue={product.suppliers[0]} options={suppliers.map((item) => ({ label: item.company, value: item.company }))} />
        </div>
      </Modal>

      <Modal open={modal === "writeOffHistory"} onOpenChange={(open) => !open && onClose()} title={t("resources.foodStock.modals.history.title")} size="xl" footer={<><Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>{t("common.actions.export")}</Button><Button onClick={onClose}>{t("common.actions.close")}</Button></>}>
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Input label={t("resources.foodStock.modals.history.writeOffFrom")} defaultValue="01.04.2026" />
            <Select label={t("resources.foodStock.modals.history.reason")} defaultValue={allValue} options={[{ label: t("resources.foodStock.filters.allStatuses"), value: allValue }, ...batchStatusOptions(t)]} />
            <Select label={t("resources.foodStock.filters.supplier")} defaultValue={allValue} options={[{ label: t("resources.foodStock.filters.allSuppliers"), value: allValue }, ...suppliers.map((item) => ({ label: item.company, value: item.company }))]} />
          </div>
          <TableContainer>
            <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("resources.foodStock.modals.history.date")}</TableHead>
                  <TableHead>{t("resources.foodStock.table.name")}</TableHead>
                  <TableHead>{t("resources.foodStock.table.currentStock")}</TableHead>
                  <TableHead>{t("resources.foodStock.table.unit")}</TableHead>
                  <TableHead>{t("resources.foodStock.table.nearestExpiry")}</TableHead>
                  <TableHead>{t("resources.foodStock.batches.supplier")}</TableHead>
                  <TableHead>{t("resources.foodStock.modals.history.reason")}</TableHead>
                  <TableHead>{t("resources.foodStock.batches.author")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {writeOffHistory.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.expiryDate}</TableCell>
                    <TableCell>{row.supplier}</TableCell>
                    <TableCell><StatusBadge status={batchStatusVariant(row.reason)}>{t(`resources.foodStock.batchStatus.${row.reason}`)}</StatusBadge></TableCell>
                    <TableCell>{row.author}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Modal>
    </>
  );
}

function EditableFoodRows({ type, currencyUnit }: { type: "receive" | "writeOff"; currencyUnit: string }) {
  const { t } = useI18n();
  const rows = foodProducts.slice(0, type === "receive" ? 4 : 5);
  return (
    <TableContainer>
      <Table className="min-w-[920px]">
        <TableHeader>
          <TableRow>
            <TableHead>{t("resources.foodStock.table.name")}</TableHead>
            <TableHead>{t("resources.foodStock.modals.receive.quantity")}</TableHead>
            <TableHead>{t("resources.foodStock.table.unit")}</TableHead>
            {type === "receive" ? <TableHead>{t("resources.foodStock.batches.unitPrice")}</TableHead> : null}
            <TableHead>{t("resources.foodStock.table.nearestExpiry")}</TableHead>
            {type === "writeOff" ? <TableHead>{t("resources.foodStock.batches.supplier")}</TableHead> : null}
            {type === "writeOff" ? <TableHead>{t("resources.foodStock.modals.history.reason")}</TableHead> : null}
            <TableHead>{t("resources.foodStock.modals.receive.duplicate")}</TableHead>
            {type === "receive" ? <TableHead>{t("resources.foodStock.batches.total")}</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell><Input type="number" defaultValue={type === "receive" ? row.currentStock : Math.min(row.currentStock, 15)} /></TableCell>
              <TableCell>{row.unit}</TableCell>
              {type === "receive" ? <TableCell><Input defaultValue={formatNumber(row.averagePrice)} /></TableCell> : null}
              <TableCell><Input defaultValue={row.nearestExpiry === "—" ? "30.06.2026" : row.nearestExpiry} /></TableCell>
              {type === "writeOff" ? <TableCell>{row.suppliers[0]}</TableCell> : null}
              {type === "writeOff" ? <TableCell><Select defaultValue="used" options={batchStatusOptions(t)} /></TableCell> : null}
              <TableCell><Button variant="ghost" size="icon" aria-label={t("resources.foodStock.modals.receive.duplicate")}><Copy className="h-4 w-4" /></Button></TableCell>
              {type === "receive" ? <TableCell>{formatCurrency(row.currentStock * row.averagePrice, currencyUnit)}</TableCell> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function PurchasesPage({ onNavigate }: { onNavigate?: (key: SidebarNavigationKey) => void }) {
  const { t } = useI18n();
  const [modal, setModal] = useState<"create" | "view" | null>(null);
  const [selected, setSelected] = useState<PurchaseRequest>(purchaseRequests[0]);
  const currencyUnit = t("resources.inventory.currencyUnit");

  return (
    <AppShell activeNavigation="resourcesPurchases" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader title={t("resources.purchases.page.title")} description={t("resources.purchases.page.description")} breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.resources") }, { label: t("resources.nav.purchases") }]} actions={<Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModal("create")}>{t("resources.purchases.actions.create")}</Button>} />
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard title={t("resources.purchases.stats.total")} value={purchaseRequests.length} icon={<ShoppingCart className="h-6 w-6" />} />
            <StatsCard title={t("resources.purchases.stats.inProgress")} value={purchaseRequests.filter((item) => item.status === "inProgress").length} icon={<ClipboardCheck className="h-6 w-6" />} />
            <StatsCard title={t("resources.purchases.stats.totalValue")} value={formatCurrency(purchaseRequests.reduce((sum, item) => sum + item.totalValue, 0), currencyUnit)} icon={<WalletCards className="h-6 w-6" />} />
          </div>
          <Card>
            <CardContent className="space-y-4">
              <FilterBar left={<Input className="w-full sm:w-[360px]" placeholder={t("resources.purchases.filters.search")} leftIcon={<Search className="h-4 w-4" />} />} right={<><Select className="w-48" value="newest" options={[{ label: t("resources.inventory.filters.newest"), value: "newest" }, { label: t("resources.inventory.filters.alphabet"), value: "alphabet" }]} onChange={() => undefined} /><Select className="w-48" value={allValue} options={[{ label: t("resources.purchases.filters.allStatuses"), value: allValue }, ...purchaseStatusOptions(t)]} onChange={() => undefined} /></>} />
              <TableContainer>
                <Table className="min-w-[1120px]">
                  <TableHeader><TableRow><TableHead>{t("resources.purchases.table.id")}</TableHead><TableHead>{t("resources.purchases.table.title")}</TableHead><TableHead>{t("resources.purchases.table.branch")}</TableHead><TableHead>{t("resources.purchases.table.supplier")}</TableHead><TableHead>{t("resources.purchases.table.category")}</TableHead><TableHead>{t("resources.purchases.table.items")}</TableHead><TableHead>{t("resources.purchases.table.total")}</TableHead><TableHead>{t("resources.purchases.table.dueDate")}</TableHead><TableHead>{t("resources.purchases.table.status")}</TableHead></TableRow></TableHeader>
                  <TableBody>{purchaseRequests.map((item) => <TableRow key={item.id} className="cursor-pointer" onClick={() => { setSelected(item); setModal("view"); }}><TableCell className="font-medium">{item.id}</TableCell><TableCell>{item.title}</TableCell><TableCell>{item.branch}</TableCell><TableCell>{item.supplier}</TableCell><TableCell>{item.category}</TableCell><TableCell>{item.itemsCount}</TableCell><TableCell>{formatCurrency(item.totalValue, currencyUnit)}</TableCell><TableCell>{item.dueDate}</TableCell><TableCell><StatusBadge status={purchaseStatusVariant(item.status)}>{t(`resources.purchases.status.${item.status}`)}</StatusBadge></TableCell></TableRow>)}</TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
      <PurchaseModals modal={modal} selected={selected} onClose={() => setModal(null)} />
    </AppShell>
  );
}

function PurchaseModals({ modal, selected, onClose }: { modal: "create" | "view" | null; selected: PurchaseRequest; onClose: () => void }) {
  const { t } = useI18n();
  const currencyUnit = t("resources.inventory.currencyUnit");
  return (
    <>
      <Modal open={modal === "view"} onOpenChange={(open) => !open && onClose()} title={selected.id} description={selected.title} footer={<Button onClick={onClose}>{t("common.actions.close")}</Button>}>
        <InfoRows rows={[[t("resources.purchases.table.branch"), selected.branch], [t("resources.purchases.table.supplier"), selected.supplier], [t("resources.purchases.table.category"), selected.category], [t("resources.purchases.table.total"), formatCurrency(selected.totalValue, currencyUnit)], [t("resources.purchases.table.status"), t(`resources.purchases.status.${selected.status}`)], [t("resources.purchases.table.author"), selected.author]]} />
      </Modal>
      <Modal open={modal === "create"} onOpenChange={(open) => !open && onClose()} title={t("resources.purchases.actions.create")} size="lg" footer={<ModalActions submitLabel={t("common.actions.save")} onClose={onClose} />}>
        <div className="grid gap-4 md:grid-cols-2"><Input label={t("resources.purchases.table.title")} placeholder={t("resources.purchases.placeholders.title")} /><Select label={t("resources.purchases.table.branch")} defaultValue={resourceBranches[0].id} options={resourceBranches.map((item) => ({ label: item.name, value: item.id }))} /><Select label={t("resources.purchases.table.supplier")} defaultValue={suppliers[0].id} options={suppliers.map((item) => ({ label: item.company, value: item.id }))} /><Select label={t("resources.purchases.table.status")} defaultValue="draft" options={purchaseStatusOptions(t)} /><Input label={t("resources.purchases.table.dueDate")} defaultValue="25.05.2026" /><Input label={t("resources.purchases.table.total")} placeholder={formatCurrency(0, currencyUnit)} /></div>
      </Modal>
    </>
  );
}

function SuppliersPage({ onNavigate }: { onNavigate?: (key: SidebarNavigationKey) => void }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [modal, setModal] = useState<"create" | "goods" | null>(null);
  const currencyUnit = t("resources.inventory.currencyUnit");

  if (selected) {
    const goods = supplierGoods.filter((item) => item.supplierId === selected.id);
    return (
      <AppShell activeNavigation="resourcesSuppliers" onNavigate={onNavigate}>
        <PageContainer>
          <PageHeader title={selected.company} description={selected.contactName} breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.resources"), href: "#" }, { label: t("resources.nav.suppliers"), href: "#" }, { label: t("resources.inventory.page.view") }]} actions={<><Button variant="outline" onClick={() => setSelected(null)}>{t("resources.suppliers.actions.back")}</Button><Button onClick={() => setModal("goods")}>{t("resources.suppliers.actions.addGoods")}</Button></>} />
          <div className="space-y-6">
            <Card><CardContent><InfoRows rows={[[t("resources.suppliers.table.addedAt"), selected.addedAt], [t("resources.suppliers.table.author"), selected.author], [t("resources.suppliers.table.contact"), selected.contactName], [t("resources.suppliers.table.company"), selected.company], [t("resources.suppliers.table.taxId"), selected.taxId], [t("resources.suppliers.table.phone"), selected.phone], [t("resources.suppliers.table.address"), selected.address], [t("resources.suppliers.table.categories"), selected.categories.join(", ")]]} /></CardContent></Card>
            <Card><CardHeader><CardTitle>{t("resources.suppliers.goods.title")}</CardTitle></CardHeader><CardContent><SupplierGoodsTable goods={goods.length ? goods : supplierGoods.slice(0, 3)} currencyUnit={currencyUnit} /></CardContent></Card>
          </div>
        </PageContainer>
        <SupplierModals modal={modal} supplier={selected} onClose={() => setModal(null)} />
      </AppShell>
    );
  }

  return (
    <AppShell activeNavigation="resourcesSuppliers" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader title={t("resources.suppliers.page.title")} description={t("resources.suppliers.page.description")} breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.resources") }, { label: t("resources.nav.suppliers") }]} actions={<Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModal("create")}>{t("resources.suppliers.actions.add")}</Button>} />
        <Card><CardContent className="space-y-4"><FilterBar left={<Input className="w-full sm:w-[360px]" placeholder={t("resources.suppliers.filters.search")} leftIcon={<Search className="h-4 w-4" />} />} right={<Select className="w-52" value={allValue} options={[{ label: t("resources.suppliers.filters.allCategories"), value: allValue }, ...uniqueOptions(suppliers.flatMap((item) => item.categories))]} onChange={() => undefined} />} /><TableContainer><Table className="min-w-[1040px]"><TableHeader><TableRow><TableHead>{t("resources.suppliers.table.number")}</TableHead><TableHead>{t("resources.suppliers.table.contact")}</TableHead><TableHead>{t("resources.suppliers.table.company")}</TableHead><TableHead>{t("resources.suppliers.table.phone")}</TableHead><TableHead>{t("resources.suppliers.table.address")}</TableHead><TableHead>{t("resources.suppliers.table.categories")}</TableHead></TableRow></TableHeader><TableBody>{suppliers.map((item, index) => <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelected(item)}><TableCell>{index + 1}</TableCell><TableCell className="font-medium">{item.contactName}</TableCell><TableCell>{item.company}</TableCell><TableCell>{item.phone}</TableCell><TableCell>{item.address}</TableCell><TableCell>{item.categories.join(", ")}</TableCell></TableRow>)}</TableBody></Table></TableContainer></CardContent></Card>
      </PageContainer>
      <SupplierModals modal={modal} supplier={suppliers[0]} onClose={() => setModal(null)} />
    </AppShell>
  );
}

function SupplierGoodsTable({ goods, currencyUnit }: { goods: typeof supplierGoods; currencyUnit: string }) {
  const { t } = useI18n();
  return <TableContainer><Table><TableHeader><TableRow><TableHead>{t("resources.suppliers.goods.number")}</TableHead><TableHead>{t("resources.suppliers.goods.name")}</TableHead><TableHead>{t("resources.suppliers.goods.category")}</TableHead><TableHead>{t("resources.suppliers.goods.price")}</TableHead><TableHead>{t("resources.suppliers.goods.unit")}</TableHead></TableRow></TableHeader><TableBody>{goods.map((item) => <TableRow key={item.id}><TableCell>{item.id}</TableCell><TableCell>{item.name}</TableCell><TableCell>{item.category}</TableCell><TableCell>{formatCurrency(item.price, currencyUnit)}</TableCell><TableCell>{item.unit}</TableCell></TableRow>)}</TableBody></Table></TableContainer>;
}

function SupplierModals({ modal, supplier, onClose }: { modal: "create" | "goods" | null; supplier: Supplier; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <>
      <Modal open={modal === "create"} onOpenChange={(open) => !open && onClose()} title={t("resources.suppliers.actions.add")} size="lg" footer={<ModalActions submitLabel={t("common.actions.save")} onClose={onClose} />}><div className="grid gap-4 md:grid-cols-2"><Input label={t("resources.suppliers.table.contact")} defaultValue={supplier.contactName} /><Input label={t("resources.suppliers.table.company")} defaultValue={supplier.company} /><Input label={t("resources.suppliers.table.taxId")} defaultValue={supplier.taxId} /><Input label={t("resources.suppliers.table.phone")} defaultValue={supplier.phone} /><Input className="md:col-span-2" label={t("resources.suppliers.table.address")} defaultValue={supplier.address} /></div></Modal>
      <Modal open={modal === "goods"} onOpenChange={(open) => !open && onClose()} title={t("resources.suppliers.actions.addGoods")} size="lg" footer={<ModalActions submitLabel={t("common.actions.save")} onClose={onClose} />}><div className="grid gap-4 md:grid-cols-2"><Input label={t("resources.suppliers.goods.name")} /><Select label={t("resources.suppliers.goods.category")} defaultValue="food" options={[{ label: t("resources.suppliers.categories.food"), value: "food" }, { label: t("resources.suppliers.categories.stationery"), value: "stationery" }, { label: t("resources.suppliers.categories.chemistry"), value: "chemistry" }, { label: t("resources.suppliers.categories.electronics"), value: "electronics" }]} /><Input label={t("resources.suppliers.goods.price")} /><Select label={t("resources.suppliers.goods.unit")} defaultValue="kg" options={uniqueOptions(["шт", "л", "кг", "гр", "метр", "упак", "короб", "пачка", "комплект"])} /></div></Modal>
    </>
  );
}

function InventoryBranchesView({ summary, onBranchOpen }: { summary: { objects: number; value: number }; onBranchOpen: (branch: ResourceBranch) => void }) {
  const { t } = useI18n();
  const currencyUnit = t("resources.inventory.currencyUnit");

  return (
    <PageContainer>
      <PageHeader
        title={t("resources.inventory.page.title")}
        description={t("resources.inventory.page.description")}
        breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.resources") }, { label: t("resources.nav.inventory") }]}
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <StatsCard title={t("resources.inventory.stats.totalObjects")} value={formatNumber(summary.objects)} icon={<Box className="h-6 w-6" />} />
          <StatsCard title={t("resources.inventory.stats.totalValue")} value={formatCurrency(summary.value, currencyUnit)} icon={<PackagePlus className="h-6 w-6" />} />
        </div>

        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-card-title text-text-primary">{t("resources.inventory.branches.title")}</h2>
            <TableContainer>
              <Table className="min-w-[980px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("resources.inventory.branches.name")}</TableHead>
                    <TableHead>{t("resources.inventory.branches.address")}</TableHead>
                    <TableHead>{t("resources.inventory.branches.objectsCount")}</TableHead>
                    <TableHead>{t("resources.inventory.branches.totalValue")}</TableHead>
                    <TableHead className="w-12">{t("resources.inventory.branches.view")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resourceBranches.map((branch) => (
                    <TableRow key={branch.id} className="cursor-pointer" onClick={() => onBranchOpen(branch)}>
                      <TableCell className="font-medium">{branch.name}</TableCell>
                      <TableCell>{branch.address}</TableCell>
                      <TableCell>{branch.objectsCount}</TableCell>
                      <TableCell>{formatCurrency(branch.totalValue, currencyUnit)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" aria-label={t("common.actions.open")}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-medium text-text-secondary">{t("resources.inventory.branches.total", { count: resourceBranches.length })}</div>
              <Pagination page={1} pageCount={3} onPageChange={() => undefined} />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function InventoryDetailView({
  branch,
  selectedObject,
  onBack,
  onOpenObjectModal,
  onOpenCreate,
  onOpenHistory,
}: {
  branch: ResourceBranch;
  selectedObject: InventoryObject;
  onBack: () => void;
  onOpenObjectModal: (item: InventoryObject, modalType: InventoryModal) => void;
  onOpenCreate: () => void;
  onOpenHistory: () => void;
}) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(allValue);
  const [author, setAuthor] = useState(allValue);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const currencyUnit = t("resources.inventory.currencyUnit");

  const filteredObjects = inventoryObjects.filter((item) => {
    const query = search.trim().toLocaleLowerCase();
    const matchesSearch = !query || item.id.toLocaleLowerCase().includes(query) || item.name.toLocaleLowerCase().includes(query);
    const matchesCategory = category === allValue || item.category === category;
    const matchesAuthor = author === allValue || item.author === author;
    return matchesSearch && matchesCategory && matchesAuthor;
  });

  return (
    <PageContainer>
      <PageHeader
        title={branch.name}
        description={branch.address}
        breadcrumbs={[
          { label: t("navigation.home"), href: "#" },
          { label: t("navigation.resources"), href: "#" },
          { label: t("resources.nav.inventory"), href: "#" },
          { label: t("resources.inventory.page.view") },
        ]}
        actions={
          <Button variant="outline" onClick={onBack}>
            {t("resources.inventory.actions.backToBranches")}
          </Button>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-page-title text-text-primary">{branch.name}</h2>
                <Badge variant="neutral">{t("resources.inventory.branches.branchBadge")}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <MapPin className="h-4 w-4" />
                {branch.address}
              </div>
            </div>
            <StatsCard title={t("resources.inventory.stats.branchObjects")} value={branch.objectsCount} icon={<Box className="h-6 w-6" />} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <FilterBar
              left={
                <Input
                  className="w-full sm:w-[320px]"
                  aria-label={t("resources.inventory.filters.search")}
                  placeholder={t("resources.inventory.filters.search")}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              }
              right={
                <>
                  <Select
                    className="w-44"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    options={[
                      { label: t("resources.inventory.filters.newest"), value: "newest" },
                      { label: t("resources.inventory.filters.alphabet"), value: "alphabet" },
                    ]}
                  />
                  <Button variant="outline" leftIcon={<ArrowLeftRight className="h-4 w-4" />} onClick={() => onOpenObjectModal(selectedObject, "move")}>
                    {t("resources.inventory.actions.move")}
                  </Button>
                  <Button variant="outline" leftIcon={<ClipboardList className="h-4 w-4" />} onClick={() => onOpenObjectModal(selectedObject, "inventory")}>
                    {t("resources.inventory.actions.inventory")}
                  </Button>
                  <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onOpenCreate}>
                    {t("resources.inventory.actions.addObject")}
                  </Button>
                </>
              }
            />

            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
              <Select
                label={t("resources.inventory.filters.category")}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                options={[
                  { label: t("resources.inventory.filters.allCategories"), value: allValue },
                  ...categoryOptions(t),
                ]}
              />
              <Select
                label={t("resources.inventory.filters.author")}
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                options={[{ label: t("resources.inventory.filters.allAuthors"), value: allValue }, ...authorOptions()]}
              />
              <Input label={t("resources.inventory.filters.valueFrom")} placeholder={t("resources.inventory.filters.from")} />
              <Button className="mt-auto" variant="outline" onClick={() => undefined}>
                {t("resources.inventory.filters.clear")}
              </Button>
            </div>

            <TableContainer>
              <Table className="min-w-[1320px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("resources.inventory.table.id")}</TableHead>
                    <TableHead>{t("resources.inventory.table.name")}</TableHead>
                    <TableHead>{t("resources.inventory.table.category")}</TableHead>
                    <TableHead>{t("resources.inventory.table.quantity")}</TableHead>
                    <TableHead>{t("resources.inventory.table.unit")}</TableHead>
                    <TableHead>{t("resources.inventory.table.totalValue")}</TableHead>
                    <TableHead>{t("resources.inventory.table.lastInventory")}</TableHead>
                    <TableHead>{t("resources.inventory.table.author")}</TableHead>
                    <TableHead>{t("resources.inventory.table.details")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObjects.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Badge variant={categoryVariant(item.category)}>{t(`resources.inventory.categories.${item.category}`)}</Badge>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{formatCurrency(item.quantity * item.unitPrice, currencyUnit)}</TableCell>
                      <TableCell>{item.lastInventoryDate}</TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>
                        <Button variant="ghost" onClick={() => onOpenObjectModal(item, "details")}>
                          {t("common.actions.details")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
                <span>{t("resources.inventory.table.showBy")}</span>
                <Select className="w-24" value="10" options={[{ label: "10", value: "10" }, { label: "20", value: "20" }]} onChange={() => undefined} />
                <span>{t("resources.inventory.table.shown", { shown: filteredObjects.length, total: branch.objectsCount })}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" leftIcon={<CalendarClock className="h-4 w-4" />} onClick={onOpenHistory}>
                  {t("resources.inventory.actions.history")}
                </Button>
                <Pagination page={page} pageCount={5} onPageChange={setPage} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function ObjectDetails({ object, branch }: { object: InventoryObject; branch: ResourceBranch | null }) {
  const { t } = useI18n();
  const currencyUnit = t("resources.inventory.currencyUnit");
  return (
    <InfoRows
      rows={[
        [t("resources.inventory.fields.id"), object.id],
        [t("resources.inventory.fields.addedAt"), object.lastInventoryDate],
        [t("resources.inventory.fields.objectName"), object.name],
        [t("resources.inventory.fields.branch"), branch?.name ?? resourceBranches[0].name],
        [t("resources.inventory.fields.unitPrice"), formatCurrency(object.unitPrice, currencyUnit)],
        [t("resources.inventory.fields.quantityWithUnit"), `${object.quantity} ${object.unit}`],
        [t("resources.inventory.fields.author"), object.author],
      ]}
    />
  );
}

function MoveObjectForm({ object, branch }: { object: InventoryObject; branch: ResourceBranch | null }) {
  const { t } = useI18n();
  return (
    <div className="space-y-5">
      <InfoRows
        rows={[
          [t("resources.inventory.fields.id"), object.id],
          [t("resources.inventory.fields.objectName"), object.name],
          [t("resources.inventory.fields.currentBranch"), branch?.name ?? resourceBranches[0].name],
        ]}
      />
      <Select label={t("resources.inventory.fields.chooseBranch")} defaultValue={resourceBranches[1].id} options={resourceBranches.slice(1).map((item) => ({ label: item.name, value: item.id }))} />
    </div>
  );
}

function InventoryObjectForm({ object, branch }: { object: InventoryObject; branch: ResourceBranch | null }) {
  const { t } = useI18n();
  return (
    <div className="space-y-5">
      <InfoRows
        rows={[
          [t("resources.inventory.fields.id"), object.id],
          [t("resources.inventory.fields.objectName"), object.name],
          [t("resources.inventory.fields.branch"), branch?.name ?? resourceBranches[0].name],
          [t("resources.inventory.fields.unit"), object.unit],
        ]}
      />
      <Input label={t("resources.inventory.fields.quantity")} type="number" defaultValue={object.quantity} />
      <p className="text-sm text-text-muted">{t("resources.inventory.modals.inventory.hint")}</p>
    </div>
  );
}

function CreateObjectForm({ branch }: { branch: ResourceBranch | null }) {
  const { t } = useI18n();
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Input label={t("resources.inventory.fields.objectName")} placeholder={t("resources.inventory.placeholders.objectName")} />
      <Select label={t("resources.inventory.fields.category")} defaultValue="toys" options={categoryOptions(t)} />
      <Select label={t("resources.inventory.fields.branch")} defaultValue={branch?.id ?? resourceBranches[0].id} options={resourceBranches.map((item) => ({ label: item.name, value: item.id }))} />
      <Input label={t("resources.inventory.fields.unit")} placeholder={t("resources.inventory.placeholders.unit")} />
      <Input label={t("resources.inventory.fields.quantity")} type="number" defaultValue={1} />
      <Input label={t("resources.inventory.fields.unitPrice")} placeholder={t("resources.inventory.placeholders.unitPrice")} />
    </div>
  );
}

function InventoryHistory({ object, branch }: { object: InventoryObject; branch: ResourceBranch | null }) {
  const { t } = useI18n();
  return (
    <div className="space-y-5">
      <div className="rounded-card border border-border p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoLine label={t("resources.inventory.fields.id")} value={object.id} />
          <InfoLine label={t("resources.inventory.fields.objectName")} value={object.name} />
          <InfoLine label={t("resources.inventory.fields.branch")} value={branch?.name ?? resourceBranches[0].name} />
        </div>
      </div>
      <FilterBar
        left={<Input className="w-full sm:w-[320px]" placeholder={t("resources.inventory.modals.history.search")} leftIcon={<Search className="h-4 w-4" />} />}
        right={<div className="text-sm font-medium text-text-secondary">{t("resources.inventory.modals.history.records", { count: inventoryHistory.length })}</div>}
      />
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("resources.inventory.modals.history.number")}</TableHead>
              <TableHead>{t("resources.inventory.modals.history.date")}</TableHead>
              <TableHead>{t("resources.inventory.modals.history.before")}</TableHead>
              <TableHead>{t("resources.inventory.modals.history.after")}</TableHead>
              <TableHead>{t("resources.inventory.modals.history.author")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryHistory.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.before}</TableCell>
                <TableCell>{row.after}</TableCell>
                <TableCell>{row.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function ModalActions({ submitLabel, onClose }: { submitLabel: string; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <>
      <Button variant="outline" onClick={onClose}>
        {t("common.actions.cancel")}
      </Button>
      <Button onClick={onClose}>{submitLabel}</Button>
    </>
  );
}

function InfoRows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="divide-y divide-border rounded-card border border-border">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[220px_minmax(0,1fr)]">
          <div className="text-text-secondary">{label}</div>
          <div className="font-medium text-text-primary">{value}</div>
        </div>
      ))}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 font-medium text-text-primary">{value}</div>
    </div>
  );
}

function categoryOptions(t: (key: string) => string) {
  return (["toys", "books", "stationery", "dishes", "furniture"] as InventoryCategory[]).map((category) => ({
    label: t(`resources.inventory.categories.${category}`),
    value: category,
  }));
}

function uniqueOptions(values: string[]) {
  return Array.from(new Set(values)).map((value) => ({ label: value, value }));
}

function foodStatusOptions(t: (key: string) => string) {
  return (["normal", "low", "expiring", "archived"] as FoodStockStatus[]).map((status) => ({
    label: t(`resources.foodStock.status.${status}`),
    value: status,
  }));
}

function batchStatusOptions(t: (key: string) => string) {
  return (["active", "used", "expired", "writtenOff"] as ProductBatchStatus[]).map((status) => ({
    label: t(`resources.foodStock.batchStatus.${status}`),
    value: status,
  }));
}

function purchaseStatusOptions(t: (key: string) => string) {
  return (["draft", "approved", "inProgress", "overdue", "done", "cancelled"] as PurchaseStatus[]).map((status) => ({
    label: t(`resources.purchases.status.${status}`),
    value: status,
  }));
}

function authorOptions() {
  return Array.from(new Set(inventoryObjects.map((item) => item.author))).map((author) => ({ label: author, value: author }));
}

function categoryVariant(category: InventoryCategory) {
  const variants: Record<InventoryCategory, "info" | "purple" | "warning" | "success" | "danger"> = {
    toys: "purple",
    books: "success",
    stationery: "warning",
    dishes: "danger",
    furniture: "info",
  };
  return variants[category];
}

function foodStatusVariant(status: FoodStockStatus) {
  if (status === "normal") return "success";
  if (status === "low" || status === "expiring") return "warning";
  return "neutral";
}

function batchStatusVariant(status: ProductBatchStatus) {
  if (status === "active") return "success";
  if (status === "used") return "info";
  if (status === "expired") return "danger";
  return "neutral";
}

function purchaseStatusVariant(status: PurchaseStatus) {
  if (status === "done" || status === "approved") return "success";
  if (status === "inProgress" || status === "draft") return "info";
  if (status === "overdue") return "danger";
  return "neutral";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatCurrency(value: number, unit: string) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ${unit}`;
}
