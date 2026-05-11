import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  ExternalLink,
  FileText,
  Folder,
  FolderOpen,
  Gamepad2,
  Info,
  ListFilter,
  MapPin,
  Printer,
  PencilLine,
  Play,
  Plus,
  Settings,
  Sparkles,
  Target,
  MessageSquare,
  UserRound,
  Users,
  Volume2,
  Zap,
} from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  CircularMetric,
  CrudSelect,
  DataSourceIcon,
  FilterBar,
  FileUploadZone,
  Input,
  Modal,
  NicuDistributionCard,
  Pagination,
  Radio,
  SearchField,
  SearchableSelect,
  Select,
  StatusBadge,
  StackedNicuBar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
} from "../../components/ui";
import { mockBilimtoyGames, mockRealtimeChildren, mockRealtimeSession, type AlertStatus, type BilimtoyGame, type GameAgeCategory, type GameThumbnailType, type RealtimeChildListItem, type TimelineTone } from "../../data/mockBilimtoy";
import { mockDevelopmentMapChildren, mockDevelopmentMapDetail, type DevelopmentAreaDetail, type DevelopmentIndicator, type DevelopmentMapChild, type DevelopmentTrend, type MapStatus, type NicuScore, type ObservationCycle, type RecommendationStatus } from "../../data/mockDevelopmentMap";
import { mockEmployees } from "../../data/mockEmployees";
import { materialTypeOptions, mockEducationalProgramSummary, mockProgramWeeks, type ProgramAgeCategory, type ProgramMaterial, type ProgramWeek, type WeekStatus } from "../../data/mockEducationalProgram";
import { folderGroups, indicatorMaterialContext, mockLearningMaterials, type LearningMaterial, type LearningMaterialFormat } from "../../data/mockLearningMaterials";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

type BilimtoySection = "realtime" | "games" | "education" | "development-map" | "library";

interface BilimtoyPageProps {
  section: BilimtoySection;
  onNavigate?: (key: SidebarNavigationKey) => void;
}

const ageCategories: GameAgeCategory[] = ["3-4", "4-5", "5-6", "6-7"];

export function BilimtoyPage({ section, onNavigate }: BilimtoyPageProps) {
  return (
    <AppShell activeNavigation={section === "games" ? "bilimtoy-games" : section === "education" ? "bilimtoy-education" : section === "development-map" ? "bilimtoy-development-map" : section === "library" ? "bilimtoy-library" : "bilimtoy-realtime"} onNavigate={onNavigate}>
      {section === "games" ? <BilimtoyGamesPage /> : null}
      {section === "realtime" ? <BilimtoyRealtimePage onNavigate={onNavigate} /> : null}
      {section === "education" ? <EducationalProgramPage onNavigate={onNavigate} /> : null}
      {section === "development-map" ? <DevelopmentMapPage /> : null}
      {section === "library" ? <LearningMaterialsPage /> : null}
    </AppShell>
  );
}

function BilimtoyGamesPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [age, setAge] = useState<GameAgeCategory>("4-5");
  const [page, setPage] = useState(1);
  const [selectedGame, setSelectedGame] = useState<BilimtoyGame | null>(null);

  const games = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return mockBilimtoyGames.filter((game) => game.ageCategory === age && (!query || game.title.toLocaleLowerCase().includes(query)));
  }, [age, search]);

  return (
    <PageContainer>
      <PageHeader
        title={t("bilimtoyModule.games.title")}
        description={t("bilimtoyModule.games.description")}
        breadcrumbs={[{ label: t("navigation.bilimtoy") }, { label: t("navigation.bilimtoyGames") }]}
      />

      <div className="space-y-5">
        <FilterBar
          left={
            <SearchField
              className="w-full sm:w-[360px]"
              aria-label={t("bilimtoyModule.games.search")}
              placeholder={t("bilimtoyModule.games.search")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          }
          right={
            <>
              <Select aria-label={t("bilimtoyModule.games.filters.location")} defaultValue="all" options={[{ label: t("bilimtoyModule.games.filters.location"), value: "all" }]} />
              <Select aria-label={t("bilimtoyModule.games.filters.category")} defaultValue="all" options={[{ label: t("bilimtoyModule.games.filters.category"), value: "all" }]} />
              <Select aria-label={t("bilimtoyModule.games.filters.age")} defaultValue="all" options={[{ label: t("bilimtoyModule.games.filters.age"), value: "all" }]} />
              <Select aria-label={t("bilimtoyModule.games.filters.skill")} defaultValue="all" options={[{ label: t("bilimtoyModule.games.filters.skill"), value: "all" }]} />
            </>
          }
        />

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text-primary">{t("bilimtoyModule.games.ageCategoryTitle")}</h2>
          <Tabs defaultValue={age} value={age} onValueChange={(value) => setAge(value as GameAgeCategory)}>
            <TabsList>
              {ageCategories.map((item) => (
                <TabsTrigger key={item} value={item}>
                  {t(`bilimtoyModule.ageCategories.${item}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {games.map((game, index) => (
            <GameCard key={game.id} game={game} isLastInRow={(index + 1) % 4 === 0} onOpen={() => setSelectedGame(game)} />
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-text-secondary">{t("bilimtoyModule.games.pagination", { shown: games.length, total: 48 })}</div>
          <Pagination page={page} pageCount={4} onPageChange={setPage} />
        </div>
      </div>

      <GameDetailsModal game={selectedGame} onOpenChange={(open) => !open && setSelectedGame(null)} />
    </PageContainer>
  );
}

function GameCard({ game, isLastInRow, onOpen }: { game: BilimtoyGame; isLastInRow: boolean; onOpen: () => void }) {
  const { t } = useI18n();

  return (
    <div className="relative">
      <Card className="h-full transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-dropdown">
        <button type="button" className="h-full w-full text-left" onClick={onOpen}>
          <CardContent className="space-y-3 p-4">
            <GameThumbnail game={game} />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-text-primary">{game.title}</h3>
                <div className="mt-2 grid gap-2 text-xs text-text-secondary">
                  <MetaPill icon={<MapPin className="h-3.5 w-3.5" />} label={game.location} />
                  <MetaPill icon={<CalendarDays className="h-3.5 w-3.5" />} label={game.gameCategory} tone="purple" />
                  <MetaPill icon={<Target className="h-3.5 w-3.5" />} label={game.skill} tone="success" />
                </div>
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface text-primary">
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
            <div className="text-xs text-text-muted">{t(`bilimtoyModule.ageCategories.${game.ageCategory}`)}</div>
          </CardContent>
        </button>
      </Card>
      {!isLastInRow ? <ChevronRight className="pointer-events-none absolute -right-4 top-[86px] hidden h-5 w-5 text-primary md:block" /> : null}
    </div>
  );
}

function GameThumbnail({ game, compact = false }: { game: BilimtoyGame; compact?: boolean }) {
  const items: Record<GameThumbnailType, string[]> = {
    letters: ["H", "U", "K", "C", "E"],
    pairs: ["cat", "?", "dog"],
    animals: ["rabbit", "fox", "bear"],
    numbers: ["1", "2", "3", "4", "5"],
    shapes: ["circle", "square", "triangle", "rect"],
    sorting: ["apple", "ball", "car", "toy"],
    logic: ["one", "two", "?", "four"],
    shadow: ["fox", "shadow", "home"],
    puzzle: ["p1", "p2", "p3"],
    maze: ["start", "path", "finish"],
    sequence: ["sun", "rain", "rainbow", "?"],
    sound: ["drum", "bird", "bell"],
  };

  return (
    <div className={cn("relative overflow-hidden rounded-input border border-border bg-info-bg", compact ? "h-36" : "h-28")}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-info-bg)_0%,var(--color-success-bg)_100%)]" />
      <div className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-text-inverse shadow-card">{game.order}</div>
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-center gap-2">
        {items[game.thumbnailType].map((item) => (
          <ThumbnailObject key={item} item={item} />
        ))}
      </div>
      <div className="absolute right-4 top-5 h-8 w-10 rounded-full bg-surface/80" />
      <div className="absolute right-9 top-3 h-7 w-12 rounded-full bg-surface/80" />
    </div>
  );
}

function ThumbnailObject({ item }: { item: string }) {
  const symbolMap: Record<string, string> = {
    cat: "🐱",
    dog: "🐶",
    rabbit: "🐰",
    fox: "🦊",
    bear: "🐻",
    circle: "●",
    square: "■",
    triangle: "▲",
    rect: "▬",
    apple: "🍎",
    ball: "🏀",
    car: "🚗",
    toy: "🧸",
    one: "1",
    two: "2",
    four: "4",
    shadow: "◼",
    home: "🏠",
    p1: "▣",
    p2: "▧",
    p3: "▤",
    start: "🥕",
    path: "↝",
    finish: "🐇",
    sun: "☀",
    rain: "🌧",
    rainbow: "🌈",
    drum: "🥁",
    bird: "🐦",
    bell: "🔔",
  };

  return (
    <span className="grid h-10 min-w-10 place-items-center rounded-[10px] border border-warning-bg bg-surface px-2 text-sm font-bold text-primary shadow-card">
      {symbolMap[item] ?? item}
    </span>
  );
}

function GameDetailsModal({ game, onOpenChange }: { game: BilimtoyGame | null; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();

  return (
    <Modal
      open={Boolean(game)}
      onOpenChange={onOpenChange}
      title={
        <span className="inline-flex items-center gap-3">
          {t("bilimtoyModule.gameDetails.title")}
          {game ? <Badge variant="info">{t("bilimtoyModule.gameDetails.number", { order: game.order })}</Badge> : null}
        </span>
      }
      size="xl"
      footer={<Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.close")}</Button>}
    >
      {game ? (
        <div className="space-y-6">
          <div className="flex justify-end border-b border-border pb-4">
            <Button variant="outline" leftIcon={<ExternalLink className="h-4 w-4" />}>
              {t("bilimtoyModule.gameDetails.openInNewTab")}
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <GameThumbnail game={game} compact />
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-text-primary">{game.title}</h3>
              <div className="flex flex-wrap gap-2">
                <GameDetailPill icon={<MapPin className="h-4 w-4" />} label={t("bilimtoyModule.gameDetails.location")} value={game.location} />
                <GameDetailPill icon={<Gamepad2 className="h-4 w-4" />} label={t("bilimtoyModule.gameDetails.category")} value={game.gameCategory} tone="purple" />
                <GameDetailPill icon={<Target className="h-4 w-4" />} label={t("bilimtoyModule.gameDetails.skill")} value={game.skill} tone="success" />
                <GameDetailPill icon={<CalendarDays className="h-4 w-4" />} value={t(`bilimtoyModule.ageCategories.${game.ageCategory}`)} />
              </div>
              <p className="text-sm leading-6 text-text-secondary">{game.description}</p>
            </div>
          </div>

          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">{t("bilimtoyModule.gameDetails.screenshots")}</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <GameScreenshot game={game} variant="start" />
              <GameScreenshot game={game} variant="play" />
              <GameScreenshot game={game} variant="success" />
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">{t("bilimtoyModule.gameDetails.video")}</h4>
            <div className="overflow-hidden rounded-input border border-border bg-surface shadow-card">
              <div className="relative h-44 md:h-52">
                <GameThumbnail game={game} compact />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <button type="button" className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-text-inverse shadow-modal">
                  <Play className="ml-1 h-8 w-8 fill-current" />
                </button>
                <div className="absolute inset-x-4 bottom-3 flex items-center gap-3 text-text-inverse">
                  <Play className="h-4 w-4 fill-current" />
                  <span className="text-xs font-semibold">0:00 / 0:56</span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/70">
                    <div className="h-full w-1/4 rounded-full bg-primary" />
                  </div>
                  <Volume2 className="h-4 w-4" />
                  <Settings className="h-4 w-4" />
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </Modal>
  );
}

function GameDetailPill({ icon, label, value, tone = "info" }: { icon: ReactNode; label?: string; value: string; tone?: "info" | "purple" | "success" }) {
  const toneClass = {
    info: "bg-info-bg text-info-text",
    purple: "bg-purple-bg text-purple-text",
    success: "bg-success-bg text-success-text",
  }[tone];

  return (
    <span className="inline-flex items-center gap-2 rounded-input border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary">
      <span className={cn("grid h-6 w-6 place-items-center rounded-full", toneClass)}>{icon}</span>
      {label ? <span className="text-text-muted">{label}:</span> : null}
      <span className="text-text-primary">{value}</span>
    </span>
  );
}

function GameScreenshot({ game, variant }: { game: BilimtoyGame; variant: "start" | "play" | "success" }) {
  const { t } = useI18n();

  return (
    <div className="relative overflow-hidden rounded-input border border-border bg-surface p-2 shadow-card">
      <GameThumbnail game={game} compact />
      {variant === "play" ? (
        <div className="absolute left-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-primary text-text-inverse">
          <ArrowLeft className="h-5 w-5" />
        </div>
      ) : null}
      {variant === "success" ? (
        <>
          <div className="absolute left-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-primary text-text-inverse">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <div className="absolute left-1/2 top-7 -translate-x-1/2 rounded-full bg-warning-bg px-5 py-2 text-sm font-bold uppercase tracking-wide text-warning-text shadow-card">
            {t("bilimtoyModule.gameDetails.success")}
          </div>
        </>
      ) : null}
    </div>
  );
}

function LearningMaterialsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);
  const materials = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return mockLearningMaterials.slice(0, 10);
    return mockLearningMaterials.filter((material) =>
      [material.title, material.type, material.area, material.monthTheme, material.weekTheme, material.gameTitle ?? ""].some((value) => value.toLocaleLowerCase().includes(query)),
    );
  }, [search]);

  return (
    <PageContainer>
      <PageHeader
        title={t("learningMaterials.page.title")}
        description={t("learningMaterials.page.description")}
        breadcrumbs={[{ label: t("navigation.bilimtoy") }, { label: t("navigation.bilimtoyLibrary") }]}
      />

      <div className="space-y-6">
        <FilterBar
          left={
            <SearchField
              className="w-full sm:w-[520px]"
              aria-label={t("learningMaterials.filters.search")}
              placeholder={t("learningMaterials.filters.search")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          }
          right={
            <>
              <Button variant="outline" leftIcon={<ListFilter className="h-4 w-4" />}>{t("learningMaterials.filters.filters")}</Button>
              <Select aria-label={t("learningMaterials.filters.sort")} defaultValue="newest" options={[{ label: t("learningMaterials.filters.newest"), value: "newest" }, { label: t("learningMaterials.filters.oldest"), value: "oldest" }]} />
            </>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>{t("learningMaterials.library.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <LearningMaterialsTable materials={materials} onPreview={setSelectedMaterial} />
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-sm text-text-secondary">{t("learningMaterials.library.total", { shown: materials.length, total: 248 })}</div>
              <div className="flex items-center gap-3">
                <Pagination page={page} pageCount={25} onPageChange={setPage} />
                <Select aria-label={t("learningMaterials.library.perPage")} defaultValue="10" options={[{ label: t("learningMaterials.library.perPage"), value: "10" }]} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MaterialPreviewModal material={selectedMaterial} onOpenChange={(open) => !open && setSelectedMaterial(null)} />
    </PageContainer>
  );
}

function LearningMaterialsTable({ materials, compact = false, onPreview }: { materials: LearningMaterial[]; compact?: boolean; onPreview: (material: LearningMaterial) => void }) {
  const { t } = useI18n();
  return (
    <TableContainer>
      <Table className={compact ? "min-w-[980px]" : "min-w-[1320px]"}>
        <TableHeader>
          <TableRow>
            {!compact ? <TableHead className="w-12"><Checkbox aria-label={t("learningMaterials.table.select")} /></TableHead> : null}
            {compact ? <TableHead className="w-12">№</TableHead> : null}
            <TableHead>{t("learningMaterials.table.title")}</TableHead>
            <TableHead>{t("learningMaterials.table.type")}</TableHead>
            <TableHead>{t("learningMaterials.table.age")}</TableHead>
            <TableHead>{t("learningMaterials.table.area")}</TableHead>
            {compact ? <TableHead>{t("learningMaterials.table.subarea")}</TableHead> : null}
            {!compact ? <TableHead>{t("learningMaterials.table.monthTheme")}</TableHead> : null}
            {!compact ? <TableHead>{t("learningMaterials.table.weekTheme")}</TableHead> : null}
            <TableHead>{t("learningMaterials.table.format")}</TableHead>
            <TableHead>{t("learningMaterials.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material, index) => (
            <TableRow key={material.id} className="hover:bg-primary-soft/50">
              {!compact ? <TableCell><Checkbox aria-label={material.title} /></TableCell> : null}
              {compact ? <TableCell>{index + 1}</TableCell> : null}
              <TableCell className="font-medium text-text-primary">{material.title}</TableCell>
              <TableCell><MaterialTypeBadge type={material.type} /></TableCell>
              <TableCell>{t(`bilimtoyModule.ageCategories.${material.ageCategory}`)}</TableCell>
              <TableCell>{material.area}</TableCell>
              {compact ? <TableCell>{material.subarea}</TableCell> : null}
              {!compact ? <TableCell>{material.monthTheme}</TableCell> : null}
              {!compact ? <TableCell>{material.weekTheme}</TableCell> : null}
              <TableCell><FormatBadge format={material.format} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" aria-label={t("learningMaterials.actions.preview")} onClick={() => onPreview(material)}><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" aria-label={t("common.actions.download")}><Download className="h-4 w-4" /></Button>
                  {!compact ? <Button variant="ghost" size="icon" aria-label={t("learningMaterials.actions.print")}><Printer className="h-4 w-4" /></Button> : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function MaterialPreviewModal({ material, onOpenChange }: { material: LearningMaterial | null; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  return (
    <Modal
      open={Boolean(material)}
      onOpenChange={onOpenChange}
      title={t("learningMaterials.preview.title")}
      description={material?.title}
      size="lg"
      footer={<Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.close")}</Button>}
    >
      {material ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-card border border-border bg-page p-5">
            <div className="flex aspect-video items-center justify-center rounded-card border border-dashed border-border bg-surface text-center">
              <div>
                <FileText className="mx-auto h-12 w-12 text-primary" />
                <div className="mt-3 text-lg font-semibold text-text-primary">{material.fileName}</div>
                <div className="mt-1 text-sm text-text-muted">{t("learningMaterials.preview.mockPreview")}</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <InfoBox label={t("learningMaterials.table.type")} value={<MaterialTypeBadge type={material.type} />} />
            <InfoBox label={t("learningMaterials.table.age")} value={t(`bilimtoyModule.ageCategories.${material.ageCategory}`)} />
            <InfoBox label={t("learningMaterials.table.area")} value={material.area} />
            <InfoBox label={t("learningMaterials.table.subarea")} value={material.subarea} />
            <InfoBox label={t("learningMaterials.table.format")} value={<FormatBadge format={material.format} />} />
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function IndicatorMaterialsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);
  const materials = mockLearningMaterials.filter((material) => material.area === indicatorMaterialContext.area && material.subarea === indicatorMaterialContext.subarea);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={t("learningMaterials.indicator.title")}
        size="xl"
        footer={<Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.close")}</Button>}
      >
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <IndicatorContextBox icon={<BookOpen className="h-5 w-5" />} label={t("learningMaterials.add.area")} value={indicatorMaterialContext.area} tone="primary" />
            <IndicatorContextBox icon={<Sparkles className="h-5 w-5" />} label={t("learningMaterials.add.subarea")} value={indicatorMaterialContext.subarea} tone="success" />
            <IndicatorContextBox icon={<Users className="h-5 w-5" />} label={t("learningMaterials.add.age")} value={t(`bilimtoyModule.ageCategories.${indicatorMaterialContext.ageCategory}`)} tone="warning" />
          </div>

          <div className="max-h-[620px] space-y-3 overflow-auto pr-2">
            <FolderSection title={t("learningMaterials.indicator.systemFolder")} materials={folderGroups[0].materials} onPreview={setSelectedMaterial} />
            <FolderSection title={t("learningMaterials.indicator.organizationFolder")} materials={[]} onPreview={setSelectedMaterial}>
              <FolderSection title="Подпапка: Речевые упражнения" materials={folderGroups[1].materials.length ? folderGroups[1].materials : materials} onPreview={setSelectedMaterial} nested />
              <FolderSection title="Подпапка: Домашние задания" materials={folderGroups[2].materials} onPreview={setSelectedMaterial} nested collapsed />
            </FolderSection>
          </div>
        </div>
      </Modal>
      <MaterialPreviewModal material={selectedMaterial} onOpenChange={(open) => !open && setSelectedMaterial(null)} />
    </>
  );
}

function IndicatorContextBox({ icon, label, value, tone }: { icon: ReactNode; label: string; value: ReactNode; tone: "primary" | "success" | "warning" }) {
  const toneClass = tone === "success" ? "bg-success-bg text-success-text" : tone === "warning" ? "bg-warning-bg text-warning-text" : "bg-primary-soft text-primary";
  return (
    <div className="flex min-h-[72px] items-center gap-3 rounded-card border border-border bg-surface p-4">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-input", toneClass)}>{icon}</div>
      <div>
        <div className="text-xs text-text-muted">{label}:</div>
        <div className="mt-1 text-sm font-semibold text-text-primary">{value}</div>
      </div>
    </div>
  );
}

function FolderSection({
  title,
  materials,
  onPreview,
  collapsed = false,
  nested = false,
  children,
}: {
  title: string;
  materials: LearningMaterial[];
  onPreview: (material: LearningMaterial) => void;
  collapsed?: boolean;
  nested?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={cn("rounded-card border border-border bg-surface", nested && "mx-4 my-3")}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-text-primary">{nested ? <Folder className="h-5 w-5 text-primary" /> : <FolderOpen className="h-5 w-5 text-primary" />}{title}</div>
        {collapsed ? <ChevronRight className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
      </div>
      {!collapsed && materials.length ? <LearningMaterialsTable materials={materials} compact onPreview={onPreview} /> : null}
      {!collapsed ? children : null}
    </div>
  );
}

function DevelopmentMapPage() {
  const [selectedChild, setSelectedChild] = useState<DevelopmentMapChild | null>(null);
  return selectedChild ? <DevelopmentMapDetailPage child={selectedChild} onBack={() => setSelectedChild(null)} /> : <DevelopmentMapListPage onOpenChild={setSelectedChild} />;
}

function DevelopmentMapListPage({ onOpenChild }: { onOpenChild: (child: DevelopmentMapChild) => void }) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const labels = nicuLabels(t);
  const children = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return mockDevelopmentMapChildren;
    return mockDevelopmentMapChildren.filter((child) => child.fullName.toLocaleLowerCase().includes(query) || child.group.toLocaleLowerCase().includes(query) || child.parent.toLocaleLowerCase().includes(query));
  }, [search]);

  return (
    <PageContainer>
      <PageHeader
        title={t("developmentMap.list.title")}
        description={t("developmentMap.list.description")}
        breadcrumbs={[{ label: t("navigation.bilimtoy") }, { label: t("navigation.bilimtoyDevelopmentMap") }]}
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ProgramSummaryCard label={t("developmentMap.summary.totalChildren")} value="126" />
          <ProgramSummaryCard label={t("developmentMap.summary.needsReview")} value="17" />
          <ProgramSummaryCard label={t("developmentMap.summary.completedCycle")} value="84" />
          <ProgramSummaryCard label={t("developmentMap.summary.averageProgress")} value="78%" />
        </div>

        <Card>
          <CardContent className="space-y-4">
            <FilterBar
              left={
                <SearchField
                  className="w-full sm:w-[440px]"
                  aria-label={t("developmentMap.filters.search")}
                  placeholder={t("developmentMap.filters.search")}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              }
              right={
                <>
                  <Select aria-label={t("developmentMap.filters.branch")} defaultValue="all" options={[{ label: t("developmentMap.filters.branch"), value: "all" }]} />
                  <Select aria-label={t("developmentMap.filters.group")} defaultValue="all" options={[{ label: t("developmentMap.filters.group"), value: "all" }]} />
                  <Select aria-label={t("developmentMap.filters.age")} defaultValue="all" options={[{ label: t("developmentMap.filters.age"), value: "all" }]} />
                  <Select aria-label={t("developmentMap.filters.cycle")} defaultValue="all" options={[{ label: t("developmentMap.filters.cycle"), value: "all" }]} />
                  <Select aria-label={t("developmentMap.filters.review")} defaultValue="all" options={[{ label: t("developmentMap.filters.review"), value: "all" }]} />
                  <Select aria-label={t("developmentMap.filters.source")} defaultValue="all" options={[{ label: t("developmentMap.filters.source"), value: "all" }]} />
                </>
              }
            />

            <TableContainer>
              <Table className="min-w-[1180px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("developmentMap.table.id")}</TableHead>
                    <TableHead>{t("developmentMap.table.child")}</TableHead>
                    <TableHead>{t("developmentMap.table.group")}</TableHead>
                    <TableHead>{t("developmentMap.table.age")}</TableHead>
                    <TableHead>{t("developmentMap.table.cycle")}</TableHead>
                    <TableHead>{t("developmentMap.table.summary")}</TableHead>
                    <TableHead>{t("developmentMap.table.needsReview")}</TableHead>
                    <TableHead>{t("developmentMap.table.source")}</TableHead>
                    <TableHead>{t("developmentMap.table.updatedAt")}</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {children.map((child) => (
                    <TableRow key={child.id} className="cursor-pointer" onClick={() => onOpenChild(child)}>
                      <TableCell className="font-medium">{child.id}</TableCell>
                      <TableCell className="font-medium text-primary">{child.fullName}</TableCell>
                      <TableCell>{child.group}</TableCell>
                      <TableCell>{child.age}</TableCell>
                      <TableCell><Badge variant="info">{t(`developmentMap.cycles.${child.currentCycle}`)}</Badge></TableCell>
                      <TableCell><StackedNicuBar value={child.summary} labels={labels} compact /></TableCell>
                      <TableCell>{child.needsReviewCount ? <Badge variant="warning">{child.needsReviewCount}</Badge> : <Badge variant="success">0</Badge>}</TableCell>
                      <TableCell><DataSourceIcon type={child.source} label={t(`developmentMap.sources.${child.source}`)} /></TableCell>
                      <TableCell>{child.updatedAt}</TableCell>
                      <TableCell><ChevronRight className="h-4 w-4 text-text-muted" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="flex items-center justify-between">
              <div className="text-sm text-text-secondary">{t("developmentMap.table.total", { shown: children.length, total: mockDevelopmentMapChildren.length })}</div>
              <Pagination page={page} pageCount={2} onPageChange={setPage} />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function DevelopmentMapDetailPage({ child, onBack }: { child: DevelopmentMapChild; onBack: () => void }) {
  const { t } = useI18n();
  const [observationOpen, setObservationOpen] = useState(false);
  const [indicator, setIndicator] = useState<DevelopmentIndicator | null>(null);
  const [selectedScores, setSelectedScores] = useState<Record<string, NicuScore>>({});
  const [goalDraft, setGoalDraft] = useState<{ row: ReadRow; cycle: ObservationCycle; includeGoal?: boolean } | null>(null);
  const [readGoal, setReadGoal] = useState<{ row: ReadRow; cycle: ObservationCycle; mode: "goal" | "comment" } | null>(null);
  const detail = { ...mockDevelopmentMapDetail, child: { ...mockDevelopmentMapDetail.child, ...child } };
  const rows = createDevelopmentReadRows(detail.areas);

  const selectCycleScore = (rowId: string, cycle: ObservationCycle, score: NicuScore) => {
    setSelectedScores((current) => ({
      ...current,
      [`${rowId}-${cycle}`]: score,
    }));
  };

  const getCycleScore = (row: ReadRow, cycle: ObservationCycle) => {
    const selectedScore = selectedScores[`${row.id}-${cycle}`];
    if (selectedScore) return selectedScore;

    return (["n", "i", "ch", "u"] as NicuScore[]).find((score) => row.cells[`${row.id}-${cycle}-${score}`]);
  };

  return (
    <PageContainer>
      <PageHeader
        title={t("developmentMap.detail.title")}
        breadcrumbs={[{ label: t("navigation.bilimtoy") }, { label: t("navigation.bilimtoyDevelopmentMap") }, { label: t("developmentMap.read.reading") }]}
        actions={
          <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={onBack}>{t("developmentMap.actions.backToList")}</Button>
        }
      />

      <div className="space-y-6">
        <ChildMapProfile child={detail.child} />

        <Card>
          <CardHeader>
            <CardTitle>{t("developmentMap.detail.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <SearchField className="min-w-[280px] flex-1" aria-label={t("developmentMap.read.search")} placeholder={t("developmentMap.read.search")} />
              <Select className="w-[170px]" aria-label={t("developmentMap.read.area")} defaultValue="all" options={[{ label: t("developmentMap.read.area"), value: "all" }]} />
              <Select className="w-[140px]" aria-label={t("developmentMap.read.subarea")} defaultValue="all" options={[{ label: t("developmentMap.read.subarea"), value: "all" }]} />
              <Select className="w-[180px]" aria-label={t("developmentMap.read.value")} defaultValue="all" options={[{ label: t("developmentMap.read.value"), value: "all" }]} />
              <Select className="w-[170px]" aria-label={t("developmentMap.read.dataSource")} defaultValue="all" options={[{ label: t("developmentMap.read.dataSource"), value: "all" }]} />
              <Select className="w-[180px]" aria-label={t("developmentMap.read.fillStatus")} defaultValue="all" options={[{ label: t("developmentMap.read.fillStatus"), value: "all" }]} />
              <Checkbox label={t("developmentMap.read.onlyGoals")} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <LegendButton icon={<DataSourceIcon type="teacher" label={t("developmentMap.sources.teacher")} />} label={t("developmentMap.read.teacherObservation")} />
              <LegendButton icon={<DataSourceIcon type="bilimtoy" label={t("developmentMap.sources.bilimtoy")} />} label={t("developmentMap.read.bilimtoy")} />
              <LegendButton icon={<DataSourceIcon type="combined" label={t("developmentMap.sources.combined")} />} label={t("developmentMap.read.combined")} />
              <Badge variant="success" className="min-h-10 px-4">{t("developmentMap.common.confirmed")}</Badge>
              <Badge variant="danger" className="min-h-10 px-4">{t("developmentMap.common.needsReview")}</Badge>
              <Badge variant="warning" className="min-h-10 px-4">{t("developmentMap.read.mismatch")}</Badge>
            </div>

            <TableContainer className="max-h-[680px] overflow-auto">
              <Table className="min-w-[1660px] text-xs">
                <TableHeader className="sticky top-0 z-10">
                  <TableRow>
                    <TableHead rowSpan={2} className="w-14 text-center">{t("developmentMap.read.number")}</TableHead>
                    <TableHead rowSpan={2} className="w-[210px]">{t("developmentMap.read.areaColumn")}</TableHead>
                    <TableHead rowSpan={2} className="w-[160px]">{t("developmentMap.indicatorTable.subarea")}</TableHead>
                    <TableHead rowSpan={2} className="w-[230px]">{t("developmentMap.read.expectedResult")}</TableHead>
                    <TableHead colSpan={6} className="text-center">{t("developmentMap.cycles.primary")}</TableHead>
                    <TableHead colSpan={6} className="text-center">{t("developmentMap.cycles.intermediate")}</TableHead>
                    <TableHead colSpan={4} className="text-center">{t("developmentMap.cycles.final")}</TableHead>
                    <TableHead rowSpan={2} className="w-[190px]">{t("common.labels.comment")}</TableHead>
                  </TableRow>
                  <TableRow>
                    {(["primary", "intermediate", "final"] as ObservationCycle[]).flatMap((cycleName) => [
                      ...(["n", "i", "ch", "u"] as NicuScore[]).map((score) => (
                        <TableHead key={`${cycleName}-${score}`} className="w-12 text-center">{t(`developmentMap.nicu.${score}`)}</TableHead>
                      )),
                      cycleName !== "final" ? (
                        <TableHead key={`${cycleName}-goal`} className="w-[170px] text-center normal-case">{t("developmentMap.goals.goalColumn")}</TableHead>
                      ) : null,
                      cycleName !== "final" ? (
                        <TableHead key={`${cycleName}-comment`} className="w-[180px] text-center normal-case">{t("common.labels.comment")}</TableHead>
                      ) : null,
                    ])}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-primary-soft/40">
                      <TableCell className="text-center font-semibold">{row.number}</TableCell>
                      <TableCell className="text-xs font-medium leading-5">{row.area}</TableCell>
                      <TableCell className="text-xs font-medium">{row.subarea}</TableCell>
                      <TableCell className="text-xs leading-5">{row.expectedResult}</TableCell>
                      {(["primary", "intermediate", "final"] as ObservationCycle[]).flatMap((cycleName) => {
                        const scoreCells = (["n", "i", "ch", "u"] as NicuScore[]).map((score) => {
                          const cellId = `${row.id}-${cycleName}-${score}`;
                          const cycleScore = getCycleScore(row, cycleName);
                          const value =
                            cycleScore === score
                              ? (row.cells[cellId] ?? { score, source: "teacher" as const })
                              : null;
                          return (
                            <TableCell
                              key={cellId}
                              className="h-12 cursor-pointer border-l border-border p-1 text-center"
                              onClick={() => selectCycleScore(row.id, cycleName, score)}
                            >
                              {value ? <ReadNicuCell score={value.score} source={value.source} state={value.state} /> : null}
                            </TableCell>
                          );
                        });
                        const goalText = cycleName !== "final" ? getReadGoalText(row, cycleName) : "";
                        const cycleComment = cycleName !== "final" ? getReadCycleComment(row, cycleName) : "";
                        return [
                          ...scoreCells,
                          cycleName !== "final" ? (
                            <TableCell
                              key={`${row.id}-${cycleName}-goal`}
                              className="cursor-pointer border-l border-border p-2 hover:bg-primary-soft/50"
                              onClick={() => goalText ? setReadGoal({ row, cycle: cycleName, mode: "goal" }) : setGoalDraft({ row, cycle: cycleName, includeGoal: true })}
                            >
                              {goalText ? (
                                <button
                                  type="button"
                                  className="line-clamp-3 w-full rounded-input border border-primary/20 bg-primary-soft px-2 py-1.5 text-left text-[11px] font-medium leading-4 text-primary hover:border-primary"
                                >
                                  {goalText}
                                </button>
                              ) : <span className="block min-h-8 rounded-input border border-dashed border-border" />}
                            </TableCell>
                          ) : null,
                          cycleName !== "final" ? (
                            <TableCell
                              key={`${row.id}-${cycleName}-comment`}
                              className="cursor-pointer border-l border-border p-2 text-[11px] leading-4 hover:bg-primary-soft/50"
                              onClick={() => cycleComment ? setReadGoal({ row, cycle: cycleName, mode: "comment" }) : setGoalDraft({ row, cycle: cycleName })}
                            >
                              {cycleComment ? <span className="line-clamp-3">{cycleComment}</span> : <span className="block min-h-8 rounded-input border border-dashed border-border" />}
                            </TableCell>
                          ) : null,
                        ];
                      })}
                      <TableCell className="text-xs leading-5">{row.comment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>

      <AddObservationModal open={observationOpen} child={detail.child.fullName} onOpenChange={setObservationOpen} />
      <IndicatorDetailsModal indicator={indicator} cycle={child.currentCycle} onOpenChange={(open) => !open && setIndicator(null)} />
      <DevelopmentGoalModal state={goalDraft} onOpenChange={(open) => !open && setGoalDraft(null)} />
      <DevelopmentGoalReadModal state={readGoal} onOpenChange={(open) => !open && setReadGoal(null)} />
    </PageContainer>
  );
}

function ChildMapProfile({ child }: { child: typeof mockDevelopmentMapDetail.child }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardContent className="grid gap-0 divide-y divide-border p-0 md:grid-cols-3 md:divide-x md:divide-y-0 xl:grid-cols-6">
        <ReadProfileItem label={t("developmentMap.profile.child")} value={child.fullName} primary />
        <ReadProfileItem label={t("developmentMap.read.age")} value={child.age} />
        <ReadProfileItem label={t("developmentMap.profile.group")} value={child.group} />
        <ReadProfileItem label={t("developmentMap.read.ageCategory")} value="4–5 лет" />
        <ReadProfileItem label={t("developmentMap.read.responsibleTeacher")} value={child.teacher} primary />
        <ReadProfileItem label={t("developmentMap.profile.updatedAt")} value={child.updatedAt} />
      </CardContent>
    </Card>
  );
}

function ReadProfileItem({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div className="min-w-0 px-5 py-4">
      <div className="text-xs font-medium text-text-secondary">{label}</div>
      <div className={cn("mt-2 truncate text-sm font-semibold", primary ? "text-primary" : "text-text-primary")}>{value}</div>
    </div>
  );
}

function LegendButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Button variant="outline" size="sm" className="h-10">
      {icon}
      {label}
    </Button>
  );
}

type ReadCellState = "normal" | "review" | "mismatch";
type ReadCellValue = {
  score: NicuScore;
  source: "teacher" | "bilimtoy" | "combined";
  state?: ReadCellState;
};
type ReadRow = {
  id: string;
  number: number;
  area: string;
  subarea: string;
  expectedResult: string;
  comment: string;
  cells: Record<string, ReadCellValue>;
};

function getReadGoalText(row: ReadRow, cycle: ObservationCycle) {
  if (cycle === "primary" && [1, 3, 8].includes(row.number)) return "Поддержать использование связной речи в игровых и бытовых ситуациях";
  if (cycle === "intermediate" && [2, 7].includes(row.number)) return "Закрепить навык через совместные задания и короткие ежедневные упражнения";
  return "";
}

function getReadCycleComment(row: ReadRow, cycle: ObservationCycle) {
  if (cycle === "primary" && [1, 2, 8].includes(row.number)) return "Ребёнок выполняет действие после показа, иногда требуется словесная подсказка воспитателя.";
  if (cycle === "intermediate" && [2, 4, 7].includes(row.number)) return "Отмечена положительная динамика, но навык пока нестабилен в самостоятельной деятельности.";
  return "";
}

function ReadNicuCell({ score, source, state = "normal" }: ReadCellValue) {
  const { t } = useI18n();
  const stateClass =
    state === "review"
      ? "border-danger-bg bg-danger-bg text-danger-text"
      : state === "mismatch"
        ? "border-warning-bg bg-warning-bg text-warning-text"
        : "border-success-bg bg-success-bg text-success-text";

  if (state === "review" || state === "mismatch") {
    return (
      <span className={cn("inline-flex min-h-8 items-center gap-1 rounded-[6px] border px-2 text-[11px] font-semibold", stateClass)}>
        {state === "review" ? t("developmentMap.common.needsReview") : t("developmentMap.read.mismatch")}
        {state === "mismatch" ? <Info className="h-3.5 w-3.5" /> : <DataSourceIcon type={source} label={t(`developmentMap.sources.${source}`)} className="bg-transparent p-0" />}
      </span>
    );
  }

  return (
    <button type="button" className={cn("inline-flex min-h-8 items-center gap-1 rounded-[6px] border px-2 text-[11px] font-semibold", stateClass)}>
      {t(`developmentMap.nicu.${score}`)}
      {source === "teacher" ? <PencilLine className="h-3.5 w-3.5" /> : <DataSourceIcon type={source} label={t(`developmentMap.sources.${source}`)} className="bg-transparent p-0" />}
    </button>
  );
}

function DevelopmentGoalModal({ state, onOpenChange }: { state: { row: ReadRow; cycle: ObservationCycle; includeGoal?: boolean } | null; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const row = state?.row ?? null;
  const cycle = state?.cycle ?? "primary";
  const basis = row ? getGoalBasisForCycle(row, cycle) : { cycle, score: "i" as NicuScore };
  const [goalCycles, setGoalCycles] = useState<ObservationCycle[]>(state?.includeGoal ? [cycle] : []);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    setGoalCycles(state?.includeGoal ? [state.cycle] : []);
    setRecommendations([]);
  }, [state]);

  const employeeOptions = mockEmployees.slice(0, 8).map((employee) => ({
    label: employee.fullName,
    value: String(employee.id),
    description: employee.position,
  }));

  const addGoalCycle = (cycle: ObservationCycle) => {
    setGoalCycles((current) => (current.includes(cycle) ? current : [...current, cycle]));
  };

  const closeModal = () => {
    onOpenChange(false);
    setGoalCycles([]);
    setRecommendations([]);
  };

  return (
    <Modal
      open={Boolean(row)}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
      title={t("developmentMap.goals.createTitle")}
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <Button variant="outline" onClick={closeModal}>{t("common.actions.close")}</Button>
          <Button onClick={closeModal}>{t("common.actions.save")}</Button>
        </div>
      }
    >
      {row ? (
        <div className="space-y-3 text-[13px]">
          <div className="grid overflow-hidden rounded-input border border-border md:grid-cols-3">
            <ContextCell label={t("developmentMap.read.area")} value={row.area} />
            <ContextCell label={t("developmentMap.read.subarea")} value={row.subarea} />
            <ContextCell
              label={t("developmentMap.goals.observationCycle")}
              value={`${t(`developmentMap.cycles.${cycle}`).toLocaleLowerCase()} — ${t(`developmentMap.nicu.${basis.score}`)}`}
            />
          </div>

          <section className="space-y-2">
            <h3 className="text-[15px] font-semibold text-text-primary">{t("developmentMap.goals.primaryComment")}</h3>
            <Textarea rows={4} placeholder={t("developmentMap.goals.primaryCommentPlaceholder")} />
          </section>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={() => addGoalCycle(cycle)}>
              {t("developmentMap.goals.addGoal")}
            </Button>
            <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setRecommendations((current) => [...current, ""])}>
              {t("developmentMap.goals.addRecommendation")}
            </Button>
          </div>

          {goalCycles.map((cycle, index) => (
            <CreateGoalBlock
              key={cycle}
              cycle={cycle}
              index={index}
              row={row}
              employeeOptions={employeeOptions}
            />
          ))}

          {recommendations.map((_, index) => (
            <CreateRecommendationBlock
              key={`recommendation-${index}`}
              index={index}
              onAddMore={() => setRecommendations((current) => [...current, ""])}
              isLast={index === recommendations.length - 1}
            />
          ))}
        </div>
      ) : null}
    </Modal>
  );
}

function CreateGoalBlock({
  cycle,
  index,
  row,
  employeeOptions,
}: {
  cycle: ObservationCycle;
  index: number;
  row: ReadRow;
  employeeOptions: Array<{ label: string; value: string; description: string }>;
}) {
  const { t } = useI18n();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([employeeOptions[0]?.value ?? ""]);
  const availableOptions = employeeOptions.filter((option) => !selectedEmployees.includes(option.value));
  const addEmployee = (value: string) => setSelectedEmployees((current) => (current.includes(value) ? current : [...current, value]));
  const removeEmployee = (value: string) => setSelectedEmployees((current) => current.filter((item) => item !== value));

  return (
    <section className="space-y-2">
      <h3 className="text-[15px] font-semibold text-text-primary">
        {index + 1}. {t("developmentMap.goals.goalForCycle", { cycle: t(`developmentMap.cycles.${cycle}`).toLocaleLowerCase() })}
      </h3>
      <div className="grid overflow-visible rounded-input border border-border lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.55fr)]">
        <div className="divide-y divide-border">
          <GoalMetaRow label={t("developmentMap.goals.indicator")} value={row.expectedResult} />
          <GoalMetaRow label={t("developmentMap.goals.goalText")} value={<Textarea rows={4} placeholder={t("developmentMap.goals.goalPlaceholder")} />} />
          <GoalMetaRow
            label={t("developmentMap.goals.participants")}
            value={
              <div className="space-y-2">
                <SearchableSelect
                  placeholder={t("developmentMap.goals.employeeSearch")}
                  searchPlaceholder={t("developmentMap.goals.employeeSearch")}
                  options={availableOptions}
                  onChange={addEmployee}
                />
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmployees.map((employeeId) => {
                    const employee = employeeOptions.find((option) => option.value === employeeId);
                    if (!employee) return null;
                    return (
                      <Badge key={employeeId} variant="neutral" className="gap-1.5">
                        {employee.label}
                        <button type="button" className="text-text-muted hover:text-danger-text" onClick={() => removeEmployee(employeeId)}>
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            }
          />
          <GoalMetaRow
            label={t("common.labels.status")}
            value={
              <Select
                defaultValue="draft"
                options={[
                  { label: t("status.draft"), value: "draft" },
                  { label: t("status.activeMasculine"), value: "active" },
                  { label: t("status.pending"), value: "review" },
                ]}
              />
            }
          />
        </div>
        <div className="space-y-2 border-t border-border p-3 text-xs text-text-muted lg:border-l lg:border-t-0">
          <div className="font-semibold text-text-primary">{t("developmentMap.goals.autoAfterSave")}</div>
          <div>{t("developmentMap.goals.initiator")}: Дилфуза Каримова</div>
          <div>{t("developmentMap.goals.createdAt")}: {new Date().toLocaleDateString("ru-RU")}</div>
        </div>
      </div>
    </section>
  );
}

function CreateRecommendationBlock({ index, isLast, onAddMore }: { index: number; isLast: boolean; onAddMore: () => void }) {
  const { t } = useI18n();
  const [selectedParent, setSelectedParent] = useState("parent-1");

  return (
    <section className="space-y-2 rounded-input border border-border p-3">
      <h3 className="text-[15px] font-semibold text-text-primary">{t("developmentMap.goals.recommendationNumber", { number: index + 1 })}</h3>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
        <Textarea rows={4} placeholder={t("developmentMap.goals.recommendationPlaceholder")} />
        <SearchableSelect
          label={t("developmentMap.goals.selectParent")}
          value={selectedParent}
          onChange={setSelectedParent}
          searchPlaceholder={t("parents.list.search")}
          options={[
            { label: "Абдрахманова Айгерим Сериковна", value: "parent-1", description: "+7 701 345 67 89" },
            { label: "Иванова Светлана Сергеевна", value: "parent-2", description: "+998 90 555 11 22" },
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {isLast ? (
          <Button variant="ghost" size="sm" className="px-0" leftIcon={<Plus className="h-4 w-4" />} onClick={onAddMore}>
            {t("developmentMap.goals.addMoreRecommendation")}
          </Button>
        ) : <span />}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">{t("common.actions.save")}</Button>
          <Button size="sm">{t("developmentMap.goals.sendToParent")}</Button>
        </div>
      </div>
    </section>
  );
}

function DevelopmentGoalReadModal({ state, onOpenChange }: { state: { row: ReadRow; cycle: ObservationCycle; mode: "goal" | "comment" } | null; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const row = state?.row ?? null;
  const cycle = state?.cycle ?? "primary";
  const basis = row ? getGoalBasisForCycle(row, cycle) : { cycle, score: "i" as NicuScore };
  const currentComment = row && state
    ? (getReadCycleComment(row, state.cycle) || t("developmentMap.goals.primaryCommentText"))
    : "";
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(false);
  }, [state]);

  return (
    <Modal
      open={Boolean(state)}
      onOpenChange={onOpenChange}
      title={t("developmentMap.goals.title")}
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.close")}</Button>
          {editing ? <Button variant="outline" onClick={() => setEditing(false)}>{t("common.actions.save")}</Button> : null}
          <Button onClick={() => onOpenChange(false)}>{t("developmentMap.goals.goToMap")}</Button>
        </div>
      }
    >
      {row ? (
        <div className="space-y-3 text-[13px]">
          <div className="grid overflow-hidden rounded-input border border-border md:grid-cols-3">
            <ContextCell label={t("developmentMap.read.area")} value={row.area} />
            <ContextCell label={t("developmentMap.read.subarea")} value={row.subarea} />
            <ContextCell
              label={t("developmentMap.goals.observationCycle")}
              value={`${t(`developmentMap.cycles.${cycle}`).toLocaleLowerCase()} — ${t(`developmentMap.nicu.${basis.score}`)}`}
            />
          </div>

          <section className="space-y-2">
            <h3 className="text-[15px] font-semibold text-text-primary">{t("developmentMap.goals.primaryComment")}</h3>
            {editing ? (
              <Textarea rows={4} defaultValue={currentComment} />
            ) : (
              <button type="button" className="w-full rounded-input border border-border bg-surface p-3 text-left text-[13px] leading-5 text-text-primary" onClick={() => setEditing(true)}>
                {currentComment}
              </button>
            )}
          </section>

          {state?.mode === "goal" ? (
            <GoalCard
              number={1}
              status="success"
              row={row}
              goalText={getReadGoalText(row, state?.cycle ?? "primary") || t("developmentMap.goals.goal1Text")}
              recommendation={t("developmentMap.goals.parentRecommendation1")}
              editing={editing}
              onEdit={() => setEditing(true)}
            />
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}

function ContextCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-b border-border px-3 py-2 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="text-xs font-medium text-text-secondary">{label}:</div>
      <div className="mt-1 line-clamp-2 text-xs font-semibold leading-4 text-primary">{value}</div>
    </div>
  );
}

function GoalCard({
  number,
  status,
  row,
  goalText,
  recommendation,
  withCycleComments,
  editing,
  onEdit,
}: {
  number: number;
  status: "success" | "warning";
  row: ReadRow;
  goalText: string;
  recommendation: string;
  withCycleComments?: boolean;
  editing?: boolean;
  onEdit?: () => void;
}) {
  const { t } = useI18n();
  return (
    <section className="space-y-2">
      <h3 className="text-[15px] font-semibold text-text-primary">{t("developmentMap.goals.goalNumber", { number })}</h3>
      <div className="grid overflow-hidden rounded-input border border-border lg:grid-cols-[minmax(0,1fr)_minmax(270px,0.58fr)]">
        <div className="divide-y divide-border">
          <GoalMetaRow label={t("developmentMap.goals.indicator")} value={row.expectedResult} />
          <GoalMetaRow
            label={t("developmentMap.goals.goalText")}
            value={editing ? <Textarea rows={4} defaultValue={goalText} /> : <button type="button" className="text-left" onClick={onEdit}>{goalText}</button>}
          />
          <GoalMetaRow label={t("developmentMap.goals.createdAt")} value="15.05.2026" />
          <GoalMetaRow label={t("common.labels.status")} value={<StatusBadge status={status}>{status === "success" ? t("status.activeMasculine") : t("status.pending")}</StatusBadge>} />
          <GoalMetaRow
            label={t("developmentMap.goals.initiator")}
            value={
              <span className="inline-flex items-center gap-2">
                <Avatar size="sm" className="h-6 w-6 text-[10px]"><AvatarFallback>ИО</AvatarFallback></Avatar>
                Иванова Ольга Сергеевна, воспитатель
              </span>
            }
          />
          <GoalMetaRow
            label={t("developmentMap.goals.participants")}
            value={
              <div className="flex flex-wrap gap-1.5">
                {["Иванова О.С., воспитатель", "Петрова Н.А., логопед", "Смагулова Д.К., воспитатель"].slice(0, withCycleComments ? 2 : 3).map((name) => (
                  <Badge key={name} variant="neutral" className="min-h-6 py-0.5">{name}</Badge>
                ))}
              </div>
            }
          />
        </div>
        <div className="space-y-3 border-t border-border p-3 lg:border-l lg:border-t-0">
          {withCycleComments ? (
            <>
              <CommentBox title={t("developmentMap.goals.intermediateComment")} text={t("developmentMap.goals.intermediateCommentText")} />
              <CommentBox title={t("developmentMap.goals.finalComment")} text={t("developmentMap.goals.finalCommentText")} />
            </>
          ) : null}
          {editing ? (
            <Textarea rows={4} defaultValue={recommendation} />
          ) : (
            <button type="button" className="w-full text-left" onClick={onEdit}>
              <CommentBox title={t("developmentMap.goals.parentRecommendation")} text={recommendation} />
            </button>
          )}
          {!withCycleComments ? <Button variant="ghost" size="sm" className="px-0">{t("developmentMap.goals.addMore")}</Button> : null}
        </div>
      </div>
    </section>
  );
}

function GoalMetaRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-2 px-3 py-2.5 md:grid-cols-[120px_minmax(0,1fr)]">
      <div className="text-xs font-medium text-text-secondary">{label}</div>
      <div className="text-xs font-semibold leading-5 text-text-primary">{value}</div>
    </div>
  );
}

function CommentBox({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold text-text-secondary">{title}</div>
      <div className="rounded-input border border-border p-2.5 text-xs leading-5 text-text-primary">{text}</div>
    </div>
  );
}

function InfoLineDense({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium text-text-secondary">{label}</div>
      <div className="mt-1 text-sm font-semibold leading-5 text-text-primary">{value}</div>
    </div>
  );
}

function getGoalBasisForCycle(row: ReadRow, cycle: ObservationCycle) {
  for (const score of ["n", "i", "ch", "u"] as NicuScore[]) {
    if (row.cells[`${row.id}-${cycle}-${score}`]) return { cycle, score };
  }

  return { cycle, score: "i" as NicuScore };
}

function createDevelopmentReadRows(areas: DevelopmentAreaDetail[]): ReadRow[] {
  const seed = [
    {
      area: areas[0]?.title ?? "Физическое развитие и формирование здорового образа жизни",
      subarea: "Крупная моторика",
      expectedResult: "ходит на носочках, пятках, на внешней стороне стопы и высоко поднимая колени",
      comment: "Уверенно выполняет после показа",
    },
    {
      area: areas[0]?.title ?? "Физическое развитие и формирование здорового образа жизни",
      subarea: "Крупная моторика",
      expectedResult: "сохраняет равновесие во время ходьбы по верёвке",
      comment: "Требуется подтверждение педагога",
    },
    {
      area: areas[0]?.title ?? "Физическое развитие и формирование здорового образа жизни",
      subarea: "Крупная моторика",
      expectedResult: "бегает, высоко поднимая колени",
      comment: "Есть положительная динамика",
    },
    {
      area: areas[0]?.title ?? "Физическое развитие и формирование здорового образа жизни",
      subarea: "Мелкая моторика",
      expectedResult: "застёгивает и расстёгивает пуговицы",
      comment: "Нужна дополнительная практика",
    },
    {
      area: areas[0]?.title ?? "Физическое развитие и формирование здорового образа жизни",
      subarea: "Сенсомоторика",
      expectedResult: "различает форму и размер предметов на ощупь",
      comment: "Уверенно справляется",
    },
    {
      area: areas[0]?.title ?? "Физическое развитие и формирование здорового образа жизни",
      subarea: "Здоровый образ жизни и безопасность",
      expectedResult: "соблюдает правила мытья рук",
      comment: "Формирует привычку",
    },
    {
      area: areas[1]?.title ?? "Социально-эмоциональное развитие",
      subarea: "Взаимодействие со сверстниками",
      expectedResult: "участвует в совместной игре",
      comment: "С интересом принимает роли",
    },
    {
      area: areas[2]?.title ?? "Речь, общение, навыки чтения и письма",
      subarea: "Активная речь",
      expectedResult: "описывает предметы и действия простыми предложениями",
      comment: "Требуется подтверждение педагога",
    },
    {
      area: areas[3]?.title ?? "Познавательное развитие",
      subarea: "Математические представления",
      expectedResult: "считает предметы до 5",
      comment: "Есть прогресс",
    },
    {
      area: areas[4]?.title ?? "Творческое развитие",
      subarea: "Изобразительная деятельность",
      expectedResult: "подбирает цвета и создаёт простые композиции",
      comment: "Иногда требуется подсказка",
    },
  ];

  return seed.map((row, index) => {
    const number = index + 1;
    const cells: Record<string, ReadCellValue> = {};
    const add = (cycle: ObservationCycle, score: NicuScore, source: ReadCellValue["source"], state?: ReadCellState) => {
      cells[`read-${number}-${cycle}-${score}`] = { score, source, state };
    };

    if (number === 2 || number === 8) {
      add("primary", "n", "bilimtoy", "review");
    } else {
      add("primary", number % 3 === 0 ? "ch" : "i", number % 2 === 0 ? "combined" : "teacher");
    }

    if (number === 2 || number === 10) {
      add("intermediate", "i", "teacher", "mismatch");
    } else {
      add("intermediate", number % 4 === 0 ? "i" : "ch", number % 2 === 0 ? "teacher" : "combined");
    }

    if (number === 6 || number === 9) {
      add("final", "u", "bilimtoy");
    }

    return {
      id: `read-${number}`,
      number,
      ...row,
      cells,
    };
  });
}

function DevelopmentAreaSummaryCard({ area, labels, onOpen }: { area: DevelopmentAreaDetail; labels: ReturnType<typeof nicuLabels>; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="line-clamp-2 text-sm font-semibold text-text-primary">{area.title}</div>
            <div className="mt-1 text-xs text-text-muted">{t("developmentMap.detail.filledAndReview", { filled: area.filledIndicators, review: area.reviewCount })}</div>
          </div>
          <DataSourceIcon type={area.source} label={t(`developmentMap.sources.${area.source}`)} />
        </div>
        <StackedNicuBar value={area.summary} labels={labels} compact />
        <Button variant="ghost" size="sm" className="px-0" onClick={onOpen}>{t("common.actions.details")}</Button>
      </CardContent>
    </Card>
  );
}

function DevelopmentIndicatorTable({ area, onOpenIndicator, onAddObservation }: { area: DevelopmentAreaDetail; onOpenIndicator: (indicator: DevelopmentIndicator) => void; onAddObservation: () => void }) {
  const { t } = useI18n();
  return (
    <div className="border-t border-border p-4">
      <TableContainer>
        <Table className="min-w-[1180px]">
          <TableHeader>
            <TableRow>
              <TableHead>{t("developmentMap.indicatorTable.subarea")}</TableHead>
              <TableHead>{t("developmentMap.indicatorTable.indicator")}</TableHead>
              <TableHead>{t("developmentMap.indicatorTable.auto")}</TableHead>
              <TableHead>{t("developmentMap.indicatorTable.manual")}</TableHead>
              <TableHead>{t("developmentMap.indicatorTable.final")}</TableHead>
              <TableHead>{t("developmentMap.indicatorTable.source")}</TableHead>
              <TableHead>{t("developmentMap.indicatorTable.review")}</TableHead>
              <TableHead>{t("developmentMap.indicatorTable.updatedAt")}</TableHead>
              <TableHead>{t("developmentMap.indicatorTable.author")}</TableHead>
              <TableHead>{t("developmentMap.indicatorTable.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {area.indicators.map((indicator) => (
              <TableRow key={indicator.id} className="cursor-pointer" onClick={() => onOpenIndicator(indicator)}>
                <TableCell>{indicator.subarea}</TableCell>
                <TableCell>{indicator.indicator}</TableCell>
                <TableCell><NicuScoreBadge score={indicator.scoreAuto} /></TableCell>
                <TableCell><NicuScoreBadge score={indicator.scoreManual} /></TableCell>
                <TableCell><NicuScoreBadge score={indicator.scoreFinal} /></TableCell>
                <TableCell><DataSourceIcon type={indicator.source} label={t(`developmentMap.sources.${indicator.source}`)} /></TableCell>
                <TableCell>{indicator.needsReview ? <Badge variant="warning">{t("developmentMap.common.needsReview")}</Badge> : <Badge variant="success">{t("developmentMap.common.confirmed")}</Badge>}</TableCell>
                <TableCell>{indicator.updatedAt}</TableCell>
                <TableCell>{indicator.author}</TableCell>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <div className="flex flex-wrap gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onOpenIndicator(indicator)}>{t("common.actions.details")}</Button>
                    <Button variant="ghost" size="sm" onClick={onAddObservation}>{t("developmentMap.actions.addObservation")}</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function AddObservationModal({ open, child, onOpenChange }: { open: boolean; child: string; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const [score, setScore] = useState<NicuScore>("ch");
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("developmentMap.addObservation.title")}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.cancel")}</Button>
          <Button onClick={() => onOpenChange(false)}>{t("common.actions.save")}</Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input label={t("developmentMap.addObservation.child")} value={child} readOnly />
        <Select label={t("developmentMap.addObservation.area")} defaultValue="speech" options={[{ label: t("developmentMap.areas.speech"), value: "speech" }, { label: t("developmentMap.areas.cognitive"), value: "cognitive" }]} />
        <Input label={t("developmentMap.addObservation.subarea")} placeholder={t("developmentMap.addObservation.subarea")} />
        <Input label={t("developmentMap.addObservation.indicator")} placeholder={t("developmentMap.addObservation.indicator")} />
        <Select label={t("developmentMap.addObservation.cycle")} defaultValue="intermediate" options={[{ label: t("developmentMap.cycles.primary"), value: "primary" }, { label: t("developmentMap.cycles.intermediate"), value: "intermediate" }, { label: t("developmentMap.cycles.final"), value: "final" }]} />
        <Input label={t("developmentMap.addObservation.date")} type="date" />
        <div className="md:col-span-2">
          <div className="mb-2 text-sm font-medium text-text-secondary">{t("developmentMap.addObservation.score")}</div>
          <div className="grid gap-3 sm:grid-cols-4">
            {(["n", "i", "ch", "u"] as NicuScore[]).map((item) => (
              <Radio key={item} name="nicu-score" checked={score === item} onChange={() => setScore(item)} label={<NicuScoreBadge score={item} />} />
            ))}
          </div>
        </div>
        <Textarea className="md:col-span-2" label={t("developmentMap.addObservation.comment")} />
        <Input label={t("developmentMap.addObservation.author")} placeholder={t("developmentMap.addObservation.author")} />
      </div>
    </Modal>
  );
}

function IndicatorDetailsModal({ indicator, cycle, onOpenChange }: { indicator: DevelopmentIndicator | null; cycle: ObservationCycle; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const [materialsOpen, setMaterialsOpen] = useState(false);
  return (
    <>
      <Modal
        open={Boolean(indicator)}
        onOpenChange={onOpenChange}
        title={t("developmentMap.indicatorDetails.title")}
        description={indicator?.indicator}
        size="lg"
        footer={
          <>
            <Button variant="outline">{t("developmentMap.actions.confirm")}</Button>
            <Button variant="outline" leftIcon={<BookOpen className="h-4 w-4" />} onClick={() => setMaterialsOpen(true)}>{t("learningMaterials.indicator.openMaterials")}</Button>
            <Button variant="outline" leftIcon={<MessageSquare className="h-4 w-4" />}>{t("developmentMap.actions.addComment")}</Button>
            <Button onClick={() => onOpenChange(false)}>{t("common.actions.close")}</Button>
          </>
        }
      >
        {indicator ? (
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              <InfoBox label={t("developmentMap.indicatorTable.subarea")} value={indicator.subarea} />
              <InfoBox label={t("developmentMap.addObservation.cycle")} value={t(`developmentMap.cycles.${cycle}`)} />
              <InfoBox label={t("developmentMap.indicatorTable.source")} value={<DataSourceIcon type={indicator.source} label={t(`developmentMap.sources.${indicator.source}`)} />} />
              <InfoBox label={t("developmentMap.indicatorTable.auto")} value={<NicuScoreBadge score={indicator.scoreAuto} />} />
              <InfoBox label={t("developmentMap.indicatorTable.manual")} value={<NicuScoreBadge score={indicator.scoreManual} />} />
              <InfoBox label={t("developmentMap.indicatorTable.final")} value={<NicuScoreBadge score={indicator.scoreFinal} />} />
            </div>
            <Section title={t("common.labels.description")}><p className="text-sm text-text-secondary">{indicator.description}</p></Section>
            {indicator.needsReview ? <Section title={t("developmentMap.indicatorDetails.whyReview")}><p className="rounded-input bg-warning-bg p-3 text-sm text-warning-text">{t("developmentMap.indicatorDetails.reviewReason")}</p></Section> : null}
            <Section title={t("developmentMap.indicatorDetails.history")}>{indicator.comments.map((comment) => <p key={comment} className="rounded-input border border-border p-3 text-sm text-text-secondary">{comment}</p>)}</Section>
            <Section title={t("developmentMap.indicatorDetails.relatedGames")}><GameChips games={indicator.relatedGames} /></Section>
            <Section title={t("developmentMap.indicatorDetails.parentRecommendation")}><p className="text-sm text-text-secondary">{indicator.parentRecommendation}</p></Section>
          </div>
        ) : null}
      </Modal>
      <IndicatorMaterialsModal open={materialsOpen} onOpenChange={setMaterialsOpen} />
    </>
  );
}

function DevelopmentDynamicsTable() {
  const { t } = useI18n();
  const labels = nicuLabels(t);
  return (
    <Card>
      <CardHeader><CardTitle>{t("developmentMap.dynamics.title")}</CardTitle></CardHeader>
      <CardContent>
        <TableContainer>
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead>{t("developmentMap.dynamics.area")}</TableHead>
                <TableHead>{t("developmentMap.cycles.primary")}</TableHead>
                <TableHead>{t("developmentMap.cycles.intermediate")}</TableHead>
                <TableHead>{t("developmentMap.cycles.final")}</TableHead>
                <TableHead>{t("developmentMap.dynamics.trend")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDevelopmentMapDetail.dynamics.map((row) => (
                <TableRow key={row.area}>
                  <TableCell className="font-medium">{row.area}</TableCell>
                  <TableCell><StackedNicuBar value={row.primary} labels={labels} compact /></TableCell>
                  <TableCell><StackedNicuBar value={row.intermediate} labels={labels} compact /></TableCell>
                  <TableCell><StackedNicuBar value={row.final} labels={labels} compact /></TableCell>
                  <TableCell><TrendBadge trend={row.trend} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

function RelatedBilimtoyGames() {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader><CardTitle>{t("developmentMap.relatedGames.title")}</CardTitle></CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {mockDevelopmentMapDetail.relatedGames.map((game) => (
          <div key={game.id} className="rounded-input border border-border p-3">
            <div className="font-semibold text-text-primary">{game.title}</div>
            <div className="mt-2 space-y-1 text-sm text-text-secondary">
              <div>{game.area}</div>
              <div>{game.subarea}</div>
              <div>{t("developmentMap.relatedGames.sessions")}: {game.sessionsCount}</div>
              <div>{t("developmentMap.relatedGames.impact")}: {game.impact}</div>
            </div>
            <Button variant="ghost" size="sm" className="mt-2 px-0">{t("educationalProgram.actions.openGame")}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ParentRecommendationsCard() {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader><CardTitle>{t("developmentMap.recommendations.title")}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {mockDevelopmentMapDetail.recommendations.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-input border border-border p-3 md:grid-cols-[160px_minmax(0,1fr)_120px_140px] md:items-center">
            <Badge variant="info">{item.area}</Badge>
            <div className="text-sm text-text-secondary">{item.recommendation}</div>
            <RecommendationStatusBadge status={item.status} />
            <Button variant="outline" size="sm">{t("developmentMap.actions.sendToParent")}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function EducationalProgramPage({ onNavigate }: { onNavigate?: (key: SidebarNavigationKey) => void }) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("table");
  const [selectedWeek, setSelectedWeek] = useState<ProgramWeek | null>(null);
  const [materialFormWeek, setMaterialFormWeek] = useState<ProgramWeek | null>(null);
  const [commentWeek, setCommentWeek] = useState<ProgramWeek | null>(null);
  const [assignWeek, setAssignWeek] = useState<ProgramWeek | null>(null);

  const weeks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return mockProgramWeeks;
    return mockProgramWeeks.filter(
      (week) =>
        week.monthTheme.toLocaleLowerCase().includes(query) ||
        week.weekTheme.toLocaleLowerCase().includes(query) ||
        week.games.some((game) => game.title.toLocaleLowerCase().includes(query)),
    );
  }, [search]);

  return (
    <PageContainer>
      <PageHeader
        title={t("educationalProgram.page.title")}
        description={t("educationalProgram.page.description")}
        breadcrumbs={[{ label: t("navigation.bilimtoy") }, { label: t("navigation.bilimtoyEducation") }]}
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ProgramSummaryCard label={t("educationalProgram.summary.schoolYear")} value={mockEducationalProgramSummary.schoolYear} />
          <ProgramSummaryCard label={t("educationalProgram.summary.summerPeriod")} value={mockEducationalProgramSummary.summerPeriod} />
          <ProgramSummaryCard label={t("educationalProgram.summary.ageGroups")} value={mockEducationalProgramSummary.ageGroups} />
          <ProgramSummaryCard label={t("educationalProgram.summary.topicsWeeks")} value={mockEducationalProgramSummary.topicsWeeks} />
        </div>

        <Card>
          <CardContent className="space-y-4">
            <FilterBar
              left={
                <SearchField
                  className="w-full sm:w-[440px]"
                  aria-label={t("educationalProgram.filters.search")}
                  placeholder={t("educationalProgram.filters.search")}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              }
              right={
                <>
                  <Select aria-label={t("educationalProgram.filters.schoolYear")} defaultValue="2026" options={[{ label: t("educationalProgram.filters.schoolYear"), value: "2026" }]} />
                  <Select aria-label={t("educationalProgram.filters.ageGroup")} defaultValue="all" options={[{ label: t("educationalProgram.filters.ageGroup"), value: "all" }]} />
                  <Select aria-label={t("educationalProgram.filters.month")} defaultValue="all" options={[{ label: t("educationalProgram.filters.month"), value: "all" }]} />
                  <Select aria-label={t("educationalProgram.filters.area")} defaultValue="all" options={[{ label: t("educationalProgram.filters.area"), value: "all" }]} />
                  <Select aria-label={t("educationalProgram.filters.center")} defaultValue="all" options={[{ label: t("educationalProgram.filters.center"), value: "all" }]} />
                  <Select aria-label={t("educationalProgram.filters.hasGames")} defaultValue="all" options={[{ label: t("educationalProgram.filters.hasGames"), value: "all" }]} />
                </>
              }
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="table" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="table">{t("educationalProgram.tabs.table")}</TabsTrigger>
            <TabsTrigger value="calendar">{t("educationalProgram.tabs.calendar")}</TabsTrigger>
            <TabsTrigger value="ageGroups">{t("educationalProgram.tabs.ageGroups")}</TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "table" ? <ProgramTable weeks={weeks} onOpenWeek={setSelectedWeek} onOpenComment={setCommentWeek} /> : null}
        {tab === "calendar" ? <ProgramCalendarView weeks={weeks} onOpenWeek={setSelectedWeek} /> : null}
        {tab === "ageGroups" ? <ProgramAgeGroupView weeks={weeks} onOpenWeek={setSelectedWeek} /> : null}
      </div>

      <WeekDetailsModal
        week={selectedWeek}
        onAddMaterial={(week) => setMaterialFormWeek(week)}
        onOpenChange={(open) => !open && setSelectedWeek(null)}
      />
      <AddProgramMaterialModal week={materialFormWeek} onOpenChange={(open) => !open && setMaterialFormWeek(null)} />
      <FinalCommentModal week={commentWeek} onOpenChange={(open) => !open && setCommentWeek(null)} />
      <AssignProgramModal week={assignWeek} onOpenChange={(open) => !open && setAssignWeek(null)} />
    </PageContainer>
  );
}

function ProgramSummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary">
          <CalendarDays className="h-5 w-5" />
        </span>
        <div>
          <div className="text-sm text-text-secondary">{label}</div>
          <div className="mt-1 text-lg font-semibold text-text-primary">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgramTable({ weeks, onOpenWeek, onOpenComment }: { weeks: ProgramWeek[]; onOpenWeek: (week: ProgramWeek) => void; onOpenComment: (week: ProgramWeek) => void }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardContent>
        <TableContainer>
          <Table className="min-w-[1480px]">
            <TableHeader>
              <TableRow>
                <TableHead>{t("educationalProgram.table.month")}</TableHead>
                <TableHead>{t("educationalProgram.table.monthTheme")}</TableHead>
                <TableHead>{t("educationalProgram.table.week")}</TableHead>
                <TableHead>{t("educationalProgram.table.weekTheme")}</TableHead>
                <TableHead>{t("educationalProgram.table.ageGroup")}</TableHead>
                <TableHead>{t("educationalProgram.table.areas")}</TableHead>
                <TableHead>{t("educationalProgram.table.centers")}</TableHead>
                <TableHead>{t("educationalProgram.table.games")}</TableHead>
                <TableHead>{t("educationalProgram.table.indicators")}</TableHead>
                <TableHead>{t("educationalProgram.table.materials")}</TableHead>
                <TableHead>{t("common.labels.comment")}</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeks.map((week) => (
                <TableRow key={week.id} className="cursor-pointer" onClick={() => onOpenWeek(week)}>
                  <TableCell>{week.month}</TableCell>
                  <TableCell className="font-medium text-primary">{week.monthTheme}</TableCell>
                  <TableCell>{week.weekNumber}</TableCell>
                  <TableCell className="font-medium text-primary">{week.weekTheme}</TableCell>
                  <TableCell>{t(`bilimtoyModule.ageCategories.${week.ageCategory}`)}</TableCell>
                  <TableCell><DevelopmentAreaBadges areas={week.developmentAreas} /></TableCell>
                  <TableCell><DevelopmentCenterTags centers={week.developmentCenters} /></TableCell>
                  <TableCell><GameChips games={week.games.map((game) => game.title)} /></TableCell>
                  <TableCell>{t("educationalProgram.counts.indicators", { count: week.indicators.length })}</TableCell>
                  <TableCell>{t("educationalProgram.counts.materials", { count: week.materials.length })}</TableCell>
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      className="line-clamp-2 rounded-input border border-border px-2 py-1.5 text-left text-xs text-text-secondary hover:border-primary hover:text-primary"
                      onClick={() => onOpenComment(week)}
                    >
                      {t("educationalProgram.table.finalCommentSample")}
                    </button>
                  </TableCell>
                  <TableCell><ChevronRight className="h-4 w-4 text-text-muted" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

function ProgramCalendarView({ weeks, onOpenWeek }: { weeks: ProgramWeek[]; onOpenWeek: (week: ProgramWeek) => void }) {
  const months = Array.from(new Set(weeks.map((week) => week.month)));
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {months.map((month) => (
        <Card key={month}>
          <CardHeader>
            <CardTitle>{month}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weeks.filter((week) => week.month === month).map((week) => (
              <WeekCard key={week.id} week={week} onOpen={() => onOpenWeek(week)} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProgramAgeGroupView({ weeks, onOpenWeek }: { weeks: ProgramWeek[]; onOpenWeek: (week: ProgramWeek) => void }) {
  const { t } = useI18n();
  const groups: ProgramAgeCategory[] = ["3-4", "4-5", "5-6", "6-7"];

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {groups.map((group) => {
        const groupWeeks = weeks.filter((week) => week.ageCategory === group);
        const games = groupWeeks.reduce((count, week) => count + week.games.length, 0);
        const materials = groupWeeks.reduce((count, week) => count + week.materials.length, 0);
        return (
          <Card key={group}>
            <CardHeader>
              <CardTitle>{t(`bilimtoyModule.ageCategories.${group}`)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <Metric label={t("educationalProgram.ageGroup.themes")} value={String(new Set(groupWeeks.map((week) => week.monthTheme)).size)} />
                <Metric label={t("educationalProgram.ageGroup.weeks")} value={String(groupWeeks.length)} />
                <Metric label={t("educationalProgram.ageGroup.games")} value={String(games)} />
                <Metric label={t("educationalProgram.ageGroup.materials")} value={String(materials)} />
              </div>
              <div className="space-y-2">
                {groupWeeks.slice(0, 3).map((week) => (
                  <WeekCard key={week.id} week={week} onOpen={() => onOpenWeek(week)} compact />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function WeekCard({ week, onOpen, compact = false }: { week: ProgramWeek; onOpen: () => void; compact?: boolean }) {
  const { t } = useI18n();
  return (
    <button type="button" className="w-full rounded-input border border-border bg-surface p-3 text-left transition hover:border-primary/40 hover:bg-primary-soft" onClick={onOpen}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-text-muted">{week.month} · {t("educationalProgram.table.week")} {week.weekNumber}</div>
          <div className="mt-1 font-semibold text-text-primary">{week.weekTheme}</div>
          {!compact ? <div className="mt-1 text-sm text-text-secondary">{t(`bilimtoyModule.ageCategories.${week.ageCategory}`)}</div> : null}
        </div>
        <WeekStatusBadge status={week.status} />
      </div>
      {!compact ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="info">{t("educationalProgram.counts.games", { count: week.games.length })}</Badge>
          {week.developmentAreas.slice(0, 2).map((area) => <Badge key={area} variant="neutral">{area}</Badge>)}
        </div>
      ) : null}
    </button>
  );
}

function WeekDetailsModal({
  week,
  onAddMaterial,
  onOpenChange,
}: {
  week: ProgramWeek | null;
  onAddMaterial: (week: ProgramWeek) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const monthMaterials = week ? getProgramThemeMaterials(week) : [];
  const organizationMaterials = week ? getProgramOrganizationMaterials(week) : [];

  return (
    <Modal
      open={Boolean(week)}
      onOpenChange={onOpenChange}
      title={t("educationalProgram.weekDetails.title")}
      size="xl"
    >
      {week ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-10 text-sm">
              <div>
                <span className="font-medium text-text-secondary">{t("educationalProgram.weekDetails.monthThemeLabel")}: </span>
                <span className="font-semibold text-primary">{week.monthTheme}</span>
              </div>
              <div>
                <span className="font-medium text-text-secondary">{t("educationalProgram.table.ageGroup")}: </span>
                <span className="font-semibold text-text-primary">{t(`bilimtoyModule.ageCategories.${week.ageCategory}`)}</span>
              </div>
            </div>
            <Button onClick={() => onAddMaterial(week)}>{t("educationalProgram.weekDetails.addMaterial")}</Button>
          </div>

          <div className="max-h-[660px] space-y-3 overflow-y-auto pr-3">
            <ProgramMaterialFolder
              title={t("educationalProgram.weekDetails.systemMaterials")}
              materials={monthMaterials}
              ageCategory={week.ageCategory}
              weekTheme={week.weekTheme}
            />
            <ProgramMaterialFolder title={t("educationalProgram.weekDetails.organizationMaterials")}>
              <ProgramMaterialFolder
                nested
                title={t("educationalProgram.weekDetails.familyProjectsFolder")}
                materials={organizationMaterials}
                ageCategory={week.ageCategory}
                weekTheme={week.weekTheme}
              />
            </ProgramMaterialFolder>
            <ProgramMaterialFolder title={t("educationalProgram.weekDetails.teacherMaterials")} collapsed />
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function ProgramMaterialFolder({
  title,
  materials = [],
  ageCategory,
  weekTheme,
  nested = false,
  collapsed = false,
  children,
}: {
  title: string;
  materials?: ProgramMaterial[];
  ageCategory?: ProgramAgeCategory;
  weekTheme?: string;
  nested?: boolean;
  collapsed?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={cn("overflow-hidden rounded-input border border-border bg-surface", nested && "mx-4")}>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-page/60 px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-text-primary">
          <Folder className="h-5 w-5 text-primary" />
          {title}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-primary transition", !collapsed && "rotate-180")} />
      </div>
      {!collapsed ? (
        <div>
          {materials.length ? <ProgramMaterialTable materials={materials} ageCategory={ageCategory ?? "4-5"} weekTheme={weekTheme ?? "—"} /> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}

function ProgramMaterialTable({ materials, ageCategory, weekTheme }: { materials: ProgramMaterial[]; ageCategory: ProgramAgeCategory; weekTheme: string }) {
  const { t } = useI18n();
  return (
    <TableContainer className="rounded-none border-0 shadow-none">
      <Table className="min-w-[980px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-14 text-center">{t("developmentMap.read.number")}</TableHead>
            <TableHead>{t("common.labels.name")}</TableHead>
            <TableHead>{t("educationalProgram.addMaterial.type")}</TableHead>
            <TableHead>{t("educationalProgram.table.ageGroup")}</TableHead>
            <TableHead>{t("educationalProgram.table.areas")}</TableHead>
            <TableHead>{t("educationalProgram.table.weekTheme")}</TableHead>
            <TableHead>{t("learningMaterials.table.format")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material, index) => (
            <TableRow key={material.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="font-medium text-primary">{material.title}</TableCell>
              <TableCell><MaterialTypeBadge type={material.type} /></TableCell>
              <TableCell>{t(`bilimtoyModule.ageCategories.${ageCategory}`)}</TableCell>
              <TableCell><ProgramAreaBadge index={index} /></TableCell>
              <TableCell>{index % 3 === 2 ? "—" : weekTheme}</TableCell>
              <TableCell><FormatBadge format={getProgramMaterialFormat(material.file)} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ProgramAreaBadge({ index }: { index: number }) {
  const areas = [
    { label: "СЭР", variant: "purple" as const },
    { label: "Познавательное", variant: "success" as const },
    { label: "Речь", variant: "info" as const },
    { label: "Творческое", variant: "warning" as const },
  ];
  const area = areas[index % areas.length];
  return <Badge variant={area.variant}>{area.label}</Badge>;
}

function getProgramThemeMaterials(week: ProgramWeek): ProgramMaterial[] {
  const extras: ProgramMaterial[] = [
    { id: `${week.id}-system-1`, title: "Карточки «Профессии»", type: "Карточки", audience: "child", file: "professions.pdf" },
    { id: `${week.id}-system-2`, title: "Инструкция: Семейное дерево", type: "Инструкция", audience: "teacher", file: "family_tree.pdf" },
    { id: `${week.id}-system-3`, title: "Презентация: Мой дом", type: "Презентация", audience: "teacher", file: "home.pptx" },
    { id: `${week.id}-system-4`, title: "Плакат «Правила дома»", type: "Плакат", audience: "child", file: "home_rules.png" },
    { id: `${week.id}-system-5`, title: "Шаблон семейного герба", type: "Шаблон", audience: "child", file: "family_crest.png" },
    { id: `${week.id}-system-6`, title: "Календарь семейных праздников", type: "Рабочий лист", audience: "parent", file: "family_calendar.pdf" },
  ];

  return [...week.materials, ...extras].slice(0, 9);
}

function getProgramOrganizationMaterials(week: ProgramWeek): ProgramMaterial[] {
  return [
    { id: `${week.id}-org-1`, title: "Проект «Моя семья»", type: "Методическая рекомендация", audience: "teacher", file: "family_project.pdf" },
    { id: `${week.id}-org-2`, title: "Шаблон книги «История моей семьи»", type: "Шаблон", audience: "child", file: "family_book.docx" },
    { id: `${week.id}-org-3`, title: "Фотоотчёт: День семьи", type: "Презентация", audience: "parent", file: "family_day.pptx" },
    { id: `${week.id}-org-4`, title: "Анкета для родителей", type: "Рабочий лист", audience: "parent", file: "parent_form.pdf" },
  ];
}

function getProgramMaterialFormat(file: string): LearningMaterialFormat {
  const ext = file.split(".").pop()?.toUpperCase();
  if (ext === "DOCX") return "DOCX";
  if (ext === "PPTX") return "PPTX";
  if (ext === "PNG") return "PNG";
  if (ext === "SVG") return "SVG";
  return "PDF";
}

function AddProgramMaterialModal({ week, onOpenChange }: { week: ProgramWeek | null; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  return (
    <Modal
      open={Boolean(week)}
      onOpenChange={onOpenChange}
      title={t("educationalProgram.addMaterial.title")}
      description={t("educationalProgram.addMaterial.description")}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.cancel")}</Button>
          <Button onClick={() => onOpenChange(false)}>{t("common.actions.add")}</Button>
        </>
      }
    >
      {week ? (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <InfoBox label={t("educationalProgram.table.monthTheme")} value={week.monthTheme} />
            <InfoBox label={t("educationalProgram.table.weekTheme")} value={week.weekTheme} />
            <InfoBox label={t("educationalProgram.table.ageGroup")} value={t(`bilimtoyModule.ageCategories.${week.ageCategory}`)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-4 rounded-input border border-border p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label={t("educationalProgram.addMaterial.folder")}
                  defaultValue="system"
                  options={[
                    { label: t("educationalProgram.weekDetails.systemMaterials"), value: "system" },
                    { label: t("educationalProgram.weekDetails.organizationMaterials"), value: "organization" },
                    { label: t("educationalProgram.weekDetails.teacherMaterials"), value: "teacher" },
                  ]}
                />
                <Select
                  label={t("educationalProgram.addMaterial.subfolder")}
                  defaultValue="family"
                  options={[
                    { label: t("educationalProgram.weekDetails.familyProjectsFolder"), value: "family" },
                    { label: t("educationalProgram.addMaterial.noSubfolder"), value: "none" },
                  ]}
                />
                <Input label={t("educationalProgram.addMaterial.name")} placeholder={t("educationalProgram.addMaterial.namePlaceholder")} />
                <CrudSelect
                  label={t("educationalProgram.addMaterial.type")}
                  value={materialTypeOptions[0]}
                  options={materialTypeOptions.map((type) => ({ label: type, value: type }))}
                  onValueChange={() => undefined}
                  addLabel={t("common.actions.addNew")}
                  newItemLabel={t("common.labels.newValueName")}
                  newItemPlaceholder={t("common.placeholders.enterName")}
                  saveLabel={t("common.actions.save")}
                  cancelLabel={t("common.actions.cancel")}
                />
                <Select
                  label={t("educationalProgram.table.ageGroup")}
                  defaultValue={week.ageCategory}
                  options={ageCategories.map((category) => ({ label: t(`bilimtoyModule.ageCategories.${category}`), value: category }))}
                />
                <Select
                  label={t("educationalProgram.addMaterial.area")}
                  defaultValue="speech"
                  options={[
                    { label: "Речь, общение, чтение и письмо", value: "speech" },
                    { label: "Познавательное развитие", value: "cognitive" },
                    { label: "Социально-эмоциональное развитие", value: "social" },
                    { label: "Творческое развитие", value: "creative" },
                  ]}
                />
                <Select
                  label={t("educationalProgram.table.weekTheme")}
                  defaultValue={week.weekTheme}
                  options={[{ label: week.weekTheme, value: week.weekTheme }, { label: "Семейные традиции", value: "Семейные традиции" }]}
                />
                <Select
                  label={t("learningMaterials.table.format")}
                  defaultValue="PDF"
                  options={["PDF", "DOCX", "PPTX", "PNG", "SVG"].map((format) => ({ label: format, value: format }))}
                />
              </div>

              <FileUploadZone
                label={t("educationalProgram.addMaterial.uploadTitle")}
                description={t("educationalProgram.addMaterial.uploadHint")}
              />
            </div>

            <aside className="space-y-4 rounded-input border border-border bg-page/50 p-4">
              <div>
                <h3 className="text-sm font-semibold text-primary">{t("educationalProgram.addMaterial.selectedPlacement")}</h3>
                <div className="mt-3 space-y-3 text-sm">
                  <InfoLineDense label={t("educationalProgram.table.monthTheme")} value={week.monthTheme} />
                  <InfoLineDense label={t("educationalProgram.table.weekTheme")} value={week.weekTheme} />
                  <InfoLineDense label={t("educationalProgram.table.ageGroup")} value={t(`bilimtoyModule.ageCategories.${week.ageCategory}`)} />
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-primary">{t("educationalProgram.addMaterial.uploadRules")}</h3>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-text-secondary">
                  <li>{t("educationalProgram.addMaterial.singleFile")}</li>
                  <li>{t("educationalProgram.addMaterial.formats")}</li>
                  <li>{t("educationalProgram.addMaterial.maxSize")}</li>
                  <li>{t("educationalProgram.addMaterial.checkPlacement")}</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function AssignProgramModal({ week, onOpenChange }: { week: ProgramWeek | null; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  return (
    <Modal
      open={Boolean(week)}
      onOpenChange={onOpenChange}
      title={t("educationalProgram.assign.title")}
      description={week?.weekTheme}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.cancel")}</Button>
          <Button onClick={() => onOpenChange(false)}>{t("educationalProgram.actions.assign")}</Button>
        </>
      }
    >
      {week ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Select label={t("educationalProgram.assign.group")} defaultValue="sun" options={[{ label: t("educationalProgram.assign.groups.sun"), value: "sun" }, { label: t("educationalProgram.assign.groups.stars"), value: "stars" }]} />
          <Input label={t("educationalProgram.assign.ageCategory")} value={t(`bilimtoyModule.ageCategories.${week.ageCategory}`)} readOnly />
          <Input label={t("educationalProgram.assign.week")} value={week.weekTheme} readOnly />
          <Input label={t("educationalProgram.assign.startDate")} type="date" />
          <Input label={t("educationalProgram.assign.endDate")} type="date" />
        </div>
      ) : null}
    </Modal>
  );
}

function FinalCommentModal({ week, onOpenChange }: { week: ProgramWeek | null; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(false);
  }, [week]);

  return (
    <Modal
      open={Boolean(week)}
      onOpenChange={onOpenChange}
      title={t("educationalProgram.table.finalCommentTitle")}
      description={week?.weekTheme}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.close")}</Button>
          {editing ? <Button onClick={() => setEditing(false)}>{t("common.actions.save")}</Button> : null}
        </>
      }
    >
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <InfoBox label={t("educationalProgram.table.month")} value={week?.month ?? ""} />
          <InfoBox label={t("educationalProgram.table.week")} value={String(week?.weekNumber ?? "")} />
          <InfoBox label={t("educationalProgram.table.ageGroup")} value={week ? t(`bilimtoyModule.ageCategories.${week.ageCategory}`) : ""} />
        </div>
        {editing ? (
          <Textarea rows={5} defaultValue={t("educationalProgram.table.finalCommentSample")} />
        ) : (
          <button type="button" className="w-full rounded-input border border-border p-4 text-left text-sm leading-6 text-text-primary" onClick={() => setEditing(true)}>
            {t("educationalProgram.table.finalCommentSample")}
          </button>
        )}
      </div>
    </Modal>
  );
}

function DevelopmentAreaBadges({ areas }: { areas: string[] }) {
  return <div className="flex flex-wrap gap-1.5">{areas.map((area) => <Badge key={area} variant="info">{area}</Badge>)}</div>;
}

function DevelopmentCenterTags({ centers }: { centers: string[] }) {
  return <div className="flex flex-wrap gap-1.5">{centers.slice(0, 3).map((center) => <Badge key={center} variant="neutral">{center}</Badge>)}</div>;
}

function GameChips({ games }: { games: string[] }) {
  return <div className="flex flex-wrap gap-1.5">{games.map((game) => <Badge key={game} variant="purple">{game}</Badge>)}</div>;
}

function MaterialList({ materials }: { materials: ProgramMaterial[] }) {
  const { t } = useI18n();
  return (
    <div className="space-y-2">
      {materials.map((material) => (
        <div key={material.id} className="grid gap-3 rounded-input border border-border p-3 md:grid-cols-[minmax(0,1fr)_160px_130px_40px] md:items-center">
          <div>
            <div className="font-semibold text-text-primary">{material.title}</div>
            <div className="text-xs text-text-muted">{material.file}</div>
          </div>
          <Badge variant="info">{material.type}</Badge>
          <span className="text-sm text-text-secondary">{t(`educationalProgram.audience.${material.audience}`)}</span>
          <Button variant="ghost" size="icon" aria-label={t("common.actions.download")}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function MaterialTypeBadge({ type }: { type: string }) {
  const variant = type.includes("родител") ? "danger" : type.includes("Презентация") || type.includes("Аудио") ? "purple" : type.includes("Рабочий") ? "success" : type.includes("Карточ") ? "warning" : type.includes("Инструкция") ? "info" : "neutral";
  return <Badge variant={variant}>{type}</Badge>;
}

function FormatBadge({ format }: { format: LearningMaterialFormat }) {
  const variant = format === "PDF" ? "danger" : format === "PPTX" ? "warning" : format === "PNG" || format === "SVG" ? "success" : format === "MP3" ? "purple" : "info";
  return <Badge variant={variant}>{format}</Badge>;
}

function WeekStatusBadge({ status }: { status: WeekStatus }) {
  const { t } = useI18n();
  const variant = status === "current" ? "success" : status === "future" ? "info" : "neutral";
  return <StatusBadge status={variant}>{t(`educationalProgram.weekStatus.${status}`)}</StatusBadge>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-border p-3">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 text-lg font-semibold text-text-primary">{value}</div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-input border border-border p-3">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 text-sm font-semibold text-text-primary">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {children}
    </div>
  );
}

function BilimtoyRealtimePage({ onNavigate }: { onNavigate?: (key: SidebarNavigationKey) => void }) {
  const { t } = useI18n();
  const [selectedChild, setSelectedChild] = useState<RealtimeChildListItem | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  return (
    <PageContainer>
      <PageHeader
        title={t("bilimtoyModule.realtime.title")}
        description={selectedChild ? undefined : t("bilimtoyModule.realtime.listDescription")}
        breadcrumbs={selectedChild ? [{ label: t("navigation.bilimtoy") }, { label: t("navigation.bilimtoyRealtime") }, { label: t("bilimtoyModule.realtime.reading") }] : [{ label: t("navigation.bilimtoy") }, { label: t("navigation.bilimtoyRealtime") }]}
        actions={
          selectedChild ? (
            <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => setSelectedChild(null)}>
              {t("bilimtoyModule.realtime.backToRealtimeList")}
            </Button>
          ) : (
            <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => onNavigate?.("children")}>
              {t("bilimtoyModule.realtime.backToChildren")}
            </Button>
          )
        }
      />

      {selectedChild ? (
        <div className="space-y-6">
          <RealtimeChildHeader child={selectedChild} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <SessionProgressCard />
            <LiveMetricsGrid />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.75fr)]">
            <AlertsTable selectedAlert={selectedAlert} onSelectAlert={setSelectedAlert} />
            <SessionTimeline />
          </div>
        </div>
      ) : (
        <RealtimeChildrenList onOpenChild={setSelectedChild} />
      )}
    </PageContainer>
  );
}

function RealtimeChildrenList({ onOpenChild }: { onOpenChild: (child: RealtimeChildListItem) => void }) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const children = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return mockRealtimeChildren;
    return mockRealtimeChildren.filter((child) => child.fullName.toLocaleLowerCase().includes(query) || child.group.toLocaleLowerCase().includes(query) || child.game.toLocaleLowerCase().includes(query));
  }, [search]);

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-success-bg text-success-text">
            <Users className="h-6 w-6" />
          </span>
          <div>
            <div className="text-sm text-text-secondary">{t("bilimtoyModule.realtime.onlineChildren")}</div>
            <div className="text-3xl font-semibold text-text-primary">37</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <FilterBar
            left={
              <SearchField
                className="w-full sm:w-[420px]"
                aria-label={t("bilimtoyModule.realtime.searchChild")}
                placeholder={t("bilimtoyModule.realtime.searchChild")}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            }
            right={
              <>
                <Select aria-label={t("bilimtoyModule.realtime.filters.group")} defaultValue="all" options={[{ label: t("bilimtoyModule.realtime.filters.group"), value: "all" }]} />
                <Select aria-label={t("bilimtoyModule.realtime.filters.game")} defaultValue="all" options={[{ label: t("bilimtoyModule.realtime.filters.game"), value: "all" }]} />
                <Select aria-label={t("bilimtoyModule.realtime.filters.sort")} defaultValue="alphabet" options={[{ label: t("bilimtoyModule.realtime.filters.sort"), value: "alphabet" }]} />
              </>
            }
          />

          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("bilimtoyModule.realtime.childrenTable.fullName")}</TableHead>
                  <TableHead>{t("bilimtoyModule.realtime.childrenTable.group")}</TableHead>
                  <TableHead>{t("bilimtoyModule.realtime.childrenTable.game")}</TableHead>
                  <TableHead>{t("bilimtoyModule.realtime.childrenTable.level")}</TableHead>
                  <TableHead>{t("bilimtoyModule.realtime.childrenTable.time")}</TableHead>
                  <TableHead>{t("bilimtoyModule.realtime.childrenTable.status")}</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {children.map((child) => (
                  <TableRow key={child.id} className="cursor-pointer" onClick={() => onOpenChild(child)}>
                    <TableCell className="font-medium">
                      <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-success-text" />
                      {child.fullName}
                    </TableCell>
                    <TableCell>{child.group}</TableCell>
                    <TableCell>{child.game}</TableCell>
                    <TableCell>{child.level}</TableCell>
                    <TableCell>{child.timeInGame}</TableCell>
                    <TableCell>
                      <RealtimeStatusBadge status={child.status} />
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-text-muted" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">{t("bilimtoyModule.realtime.childrenTable.total", { shown: children.length, total: mockRealtimeChildren.length })}</div>
            <Pagination page={page} pageCount={3} onPageChange={setPage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RealtimeChildHeader({ child: selectedChild }: { child: RealtimeChildListItem }) {
  const { t } = useI18n();
  const { child, currentSession } = mockRealtimeSession;

  const items = [
    { icon: <CalendarDays className="h-5 w-5" />, label: t("bilimtoyModule.realtime.age"), value: child.age },
    { icon: <Users className="h-5 w-5" />, label: t("bilimtoyModule.realtime.group"), value: child.group },
    { icon: <UserRound className="h-5 w-5" />, label: t("bilimtoyModule.realtime.ageCategory"), value: child.ageCategory },
    { icon: <Target className="h-5 w-5" />, label: t("bilimtoyModule.realtime.direction"), value: child.direction },
    { icon: <Zap className="h-5 w-5" />, label: t("bilimtoyModule.realtime.status"), value: t("bilimtoyModule.realtime.online"), dot: true },
    { icon: <Gamepad2 className="h-5 w-5" />, label: t("bilimtoyModule.realtime.game"), value: currentSession.game },
    { icon: <ListFilter className="h-5 w-5" />, label: t("bilimtoyModule.realtime.level"), value: currentSession.level },
    { icon: <Clock className="h-5 w-5" />, label: t("bilimtoyModule.realtime.timeInGame"), value: currentSession.timeInGame },
  ];

  return (
    <Card>
      <CardContent className="grid gap-5 lg:grid-cols-[120px_minmax(0,1fr)]">
        <div className="relative">
          <Avatar size="lg" className="h-24 w-24 text-xl">
            <AvatarFallback>{child.avatarInitials}</AvatarFallback>
          </Avatar>
          <span className="absolute right-5 top-1 h-3 w-3 rounded-full bg-success-text ring-4 ring-surface" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">{selectedChild.fullName}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.label} className="flex items-start gap-3 border-border xl:border-r xl:pr-4">
                <span className="text-primary">{item.icon}</span>
                <div>
                  <div className="text-xs text-text-muted">{item.label}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-text-primary">
                    {item.dot ? <span className="h-2.5 w-2.5 rounded-full bg-success-text" /> : null}
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SessionProgressCard() {
  const { t } = useI18n();
  const session = mockRealtimeSession.currentSession;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("bilimtoyModule.realtime.sessionProgress.title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 md:grid-cols-[160px_minmax(0,1fr)]">
        <div className="flex justify-center">
          <CircularMetric value={session.progress} label={t("bilimtoyModule.realtime.sessionProgress.progress")} tone="info" size="lg" className="flex-col text-center" />
        </div>
        <div className="space-y-4">
          <RealtimeLine icon={<FileText className="h-5 w-5" />} label={t("bilimtoyModule.realtime.sessionProgress.task")} value={session.task} />
          <RealtimeLine icon={<CalendarDays className="h-5 w-5" />} label={t("bilimtoyModule.realtime.sessionProgress.startedAt")} value={session.startedAt} />
          <RealtimeLine icon={<Sparkles className="h-5 w-5" />} label={t("bilimtoyModule.realtime.sessionProgress.currentAction")} value={session.currentAction} />
          <RealtimeLine icon={<AlertTriangle className="h-5 w-5" />} label={t("bilimtoyModule.realtime.sessionProgress.error")} value={session.error} tone="danger" />
          <RealtimeLine icon={<ListFilter className="h-5 w-5" />} label={t("bilimtoyModule.realtime.sessionProgress.errorMoment")} value={session.errorMoment} />
          <Badge variant="info">{session.completedSteps}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function LiveMetricsGrid() {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("bilimtoyModule.realtime.liveMetrics.title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {mockRealtimeSession.liveMetrics.map((metric) => (
          <div key={metric.id} className="rounded-card border border-border p-4 text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-text-primary">
              {t(`bilimtoyModule.realtime.liveMetrics.${metric.id}`)}
              <Tooltip content={t("bilimtoyModule.realtime.liveMetrics.tooltip")}>
                <Info className="h-4 w-4 text-primary" />
              </Tooltip>
            </div>
            <CircularMetric value={metric.value} label="%" tone={metric.tone} size="lg" className="justify-center" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AlertsTable({ selectedAlert, onSelectAlert }: { selectedAlert: string | null; onSelectAlert: (id: string) => void }) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{t("bilimtoyModule.realtime.alerts.title")}</CardTitle>
          <Badge variant="danger">{mockRealtimeSession.alerts.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("bilimtoyModule.realtime.alerts.type")}</TableHead>
                <TableHead>{t("bilimtoyModule.realtime.alerts.description")}</TableHead>
                <TableHead>{t("bilimtoyModule.realtime.alerts.time")}</TableHead>
                <TableHead>{t("bilimtoyModule.realtime.alerts.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRealtimeSession.alerts.map((alert) => (
                <TableRow key={alert.id} className={cn("cursor-pointer", selectedAlert === alert.id && "bg-primary-soft")} onClick={() => onSelectAlert(alert.id)}>
                  <TableCell className="font-mono text-xs">{alert.type}</TableCell>
                  <TableCell>{alert.description}</TableCell>
                  <TableCell>{alert.time}</TableCell>
                  <TableCell>
                    <AlertStatusBadge status={alert.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

function SessionTimeline() {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{t("bilimtoyModule.realtime.timeline.title")}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="h-2.5 w-2.5 rounded-full bg-success-text" />
            {t("bilimtoyModule.realtime.timeline.live")}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {mockRealtimeSession.timeline.map((event) => (
            <div key={event.id} className="grid grid-cols-[76px_24px_minmax(0,1fr)]">
              <div className="py-2 text-sm text-text-secondary">{event.time}</div>
              <div className="relative flex justify-center">
                <span className={cn("mt-3 h-3 w-3 rounded-full ring-4 ring-surface", timelineToneClasses[event.tone])} />
                <span className="absolute bottom-0 top-6 w-px bg-border" />
              </div>
              <div className="py-2 text-sm font-medium text-text-primary">{event.event}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RealtimeLine({ icon, label, value, tone = "default" }: { icon: ReactNode; label: string; value: string; tone?: "default" | "danger" }) {
  return (
    <div className="flex items-start gap-3">
      <span className={cn("mt-0.5 text-primary", tone === "danger" && "text-danger-text")}>{icon}</span>
      <div>
        <div className="text-xs text-text-muted">{label}</div>
        <div className={cn("mt-1 text-sm font-semibold text-text-primary", tone === "danger" && "text-danger-text")}>{value}</div>
      </div>
    </div>
  );
}

function MetaPill({ icon, label, tone = "info" }: { icon: ReactNode; label: string; tone?: "info" | "purple" | "success" }) {
  const classes = tone === "success" ? "bg-success-bg text-success-text" : tone === "purple" ? "bg-purple-bg text-purple-text" : "bg-info-bg text-info-text";
  return (
    <span className={cn("inline-flex w-fit items-center gap-1 rounded-[7px] px-2 py-1 font-medium", classes)}>
      {icon}
      {label}
    </span>
  );
}

function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const { t } = useI18n();
  const variant = status === "success" ? "success" : status === "error" ? "danger" : status === "pending" ? "warning" : "info";
  return <StatusBadge status={variant}>{t(`bilimtoyModule.realtime.alertStatuses.${status}`)}</StatusBadge>;
}

function RealtimeStatusBadge({ status }: { status: RealtimeChildListItem["status"] }) {
  const { t } = useI18n();
  const variant = status === "online" ? "success" : status === "warning" ? "warning" : "neutral";
  return <StatusBadge status={variant}>{t(`bilimtoyModule.realtime.childStatuses.${status}`)}</StatusBadge>;
}

const timelineToneClasses: Record<TimelineTone, string> = {
  success: "bg-success-text",
  info: "bg-info-text",
  danger: "bg-danger-text",
  warning: "bg-warning-text",
};

function nicuLabels(t: (key: string, params?: Record<string, string | number>) => string) {
  return {
    n: t("developmentMap.nicu.n"),
    i: t("developmentMap.nicu.i"),
    ch: t("developmentMap.nicu.ch"),
    u: t("developmentMap.nicu.u"),
  };
}

function NicuScoreBadge({ score }: { score: NicuScore }) {
  const { t } = useI18n();
  const variant = score === "n" ? "danger" : score === "i" ? "warning" : score === "ch" ? "info" : "success";
  return <Badge variant={variant}>{t(`developmentMap.nicu.${score}`)}</Badge>;
}

function MapStatusBadge({ status }: { status: MapStatus }) {
  const { t } = useI18n();
  const variant = status === "actual" ? "success" : status === "needsReview" ? "warning" : "neutral";
  return <StatusBadge status={variant}>{t(`developmentMap.mapStatus.${status}`)}</StatusBadge>;
}

function TrendBadge({ trend }: { trend: DevelopmentTrend }) {
  const { t } = useI18n();
  const variant = trend === "improved" ? "success" : trend === "attention" ? "warning" : "neutral";
  return <Badge variant={variant}>{t(`developmentMap.trends.${trend}`)}</Badge>;
}

function RecommendationStatusBadge({ status }: { status: RecommendationStatus }) {
  const { t } = useI18n();
  const variant = status === "new" ? "info" : status === "sent" ? "success" : "neutral";
  return <Badge variant={variant}>{t(`developmentMap.recommendationStatus.${status}`)}</Badge>;
}
