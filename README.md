# Bilimtoy ERP UI

Frontend-прототип ERP-интерфейса для Bilimtoy на `React + TypeScript + Vite + Tailwind CSS`.

Проект собран как UI foundation для генерации и развития новых экранов в одном визуальном стиле. Сейчас в нем уже есть:

- страница организации;
- страница групп;
- UI Kit с базовыми компонентами и токенами;
- mock-данные для демонстрационных сценариев;
- локализация `ru / uz / en`.

## Что важно понимать

Это не production-backend приложение, а frontend-песочница с зафиксированным дизайн-языком и готовыми шаблонами экранов.

Главная цель проекта:
быстро собирать новые ERP-страницы так, чтобы они выглядели как часть одной системы, а не как отдельные случайные макеты.

## Технологии

- `React 18`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `lucide-react` для иконок
- собственные UI-компоненты и design tokens

## Запуск проекта

Установка зависимостей:

```bash
npm install
```

Запуск dev-сервера:

```bash
npm run dev
```

Сборка production-версии:

```bash
npm run build
```

Локальный preview после сборки:

```bash
npm run preview
```

## Маршруты

Сейчас приложение использует простой переключатель по `window.location.pathname`, без `react-router`.

Поддерживаемые пути:

- `/` -> страница организации
- `/groups` -> страница групп
- `/ui-kit` -> UI Kit

Точка входа находится в [src/App.tsx](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/App.tsx:1).

## Структура проекта

```text
src/
  app/routes/              Страницы приложения
  components/layout/       Layout-обвязка: sidebar, header, breadcrumbs, page shell
  components/ui/           Базовые UI-компоненты
  data/                    Mock-данные для экранов
  features/                Более крупные feature-компоненты
  i18n/                    Локализация
  styles/                  Глобальные стили и CSS tokens
  lib/                     Вспомогательные функции
  design-tokens.ts         Централизованные дизайн-токены
```

Основные файлы:

- [src/main.tsx](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/main.tsx:1) — bootstrap приложения
- [src/App.tsx](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/App.tsx:1) — выбор текущего экрана по pathname
- [src/design-tokens.ts](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/design-tokens.ts:1) — токены системы
- [src/styles/tokens.css](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/styles/tokens.css:1) — CSS custom properties
- [src/styles/globals.css](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/styles/globals.css:1) — базовые глобальные стили
- [tailwind.config.ts](/Users/a1234/Desktop/My%20Projects/Bilimtoy/tailwind.config.ts:1) — связка Tailwind с токенами

## Как устроен стиль проекта

Визуальный стиль завязан на design tokens, а не на случайные значения в компонентах.

Источник токенов:

- [src/design-tokens.ts](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/design-tokens.ts:1)
- [src/styles/tokens.css](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/styles/tokens.css:1)

Через них задаются:

- основные цвета;
- статусные цвета;
- типографика;
- радиусы;
- тени;
- размеры layout.

Tailwind уже подключен к этим токенам, поэтому в коде нужно использовать готовые классы:

- `bg-page`, `bg-surface`
- `text-text-primary`, `text-text-secondary`, `text-text-muted`
- `border-border`
- `text-page-title`, `text-card-title`
- `rounded-input`, `rounded-card`, `rounded-modal`
- `shadow-card`, `shadow-modal`

## Layout-паттерн

Для всех страниц нужно сохранять один и тот же каркас:

1. `AppShell`
2. `PageContainer`
3. `PageHeader`
4. контент страницы из `Card`, `Table`, `StatsCard`, `Modal` и других базовых блоков

Смотри:

- [src/components/layout/AppShell.tsx](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/components/layout/AppShell.tsx:1)
- [src/components/layout/PageContainer.tsx](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/components/layout/PageContainer.tsx:1)
- [src/components/layout/PageHeader.tsx](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/components/layout/PageHeader.tsx:1)

## Базовые UI-компоненты

Переиспользуемые UI-элементы лежат в [src/components/ui/index.ts](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/components/ui/index.ts:1).

Чаще всего для новых страниц нужны:

- `Button`
- `Card`
- `Input`
- `Select`
- `Textarea`
- `Checkbox`
- `Table`
- `Pagination`
- `Badge`
- `StatusBadge`
- `Modal`
- `FilterBar`
- `EmptyState`
- `StatsCard`

Правило:
если похожий элемент уже есть в `components/ui`, не надо собирать новый стиль с нуля.

## Локализация

Переводы лежат здесь:

- [src/i18n/ru.ts](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/i18n/ru.ts:1)
- [src/i18n/uz.ts](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/i18n/uz.ts:1)
- [src/i18n/en.ts](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/i18n/en.ts:1)
- [src/i18n/index.tsx](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/i18n/index.tsx:1)

Для новых страниц:

- не хардкодить пользовательские тексты прямо в JSX, если это основной интерфейсный текст;
- добавлять ключи перевода в `ru`, а затем дублировать в `uz` и `en`;
- использовать `const { t } = useI18n()`.

## Mock-данные

Пока что экраны работают на mock-данных:

- [src/data/mockOrganizations.ts](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/data/mockOrganizations.ts:1)
- [src/data/mockGroups.ts](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/data/mockGroups.ts:1)

Подход такой:

- страница сначала собирается на моках;
- структура данных стабилизируется;
- только потом при необходимости подключается реальный API.

## Как добавить новую страницу в том же стиле

### 1. Создай новый route-компонент

Пример размещения:

```text
src/app/routes/TeachersPage.tsx
```

### 2. Собери страницу через существующий layout

Базовый шаблон:

```tsx
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import { Card, CardContent } from "../../components/ui";

export function TeachersPage() {
  return (
    <AppShell activeNavigation="employees">
      <PageContainer>
        <PageHeader
          title="Сотрудники"
          description="Описание страницы"
          breadcrumbs={[{ label: "Главная", href: "#" }, { label: "Сотрудники" }]}
        />

        <Card>
          <CardContent>Контент страницы</CardContent>
        </Card>
      </PageContainer>
    </AppShell>
  );
}
```

### 3. Подключи страницу в `App.tsx`

Сейчас навигация работает вручную, поэтому нужно:

- добавить новый `AppView`;
- обработать `window.location.pathname`;
- подключить новый route-компонент;
- при необходимости расширить `SidebarNavigationKey`.

### 4. Добавь mock-данные и переводы

Если странице нужны собственные таблицы, фильтры, карточки или модалки:

- вынеси данные в `src/data`;
- переводы добавь в `src/i18n`.

## Правила для генерации новых страниц

Чтобы новые экраны выглядели одинаково качественно, придерживайтесь этих правил:

1. Не менять базовые токены без необходимости.
2. Не использовать случайные цвета и отступы вне token-системы.
3. Все крупные блоки строить на базе существующих `Card`, `Table`, `Modal`, `FilterBar`, `StatsCard`.
4. Заголовки страниц делать через `PageHeader`.
5. Статусы показывать через `StatusBadge` или `Badge`.
6. Для табличных ERP-экранов сохранять спокойную плотную компоновку, без маркетинговых hero-блоков.
7. Если новый паттерн может переиспользоваться, выносить его в `components/ui` или `features`.

## Какие страницы уже можно брать за образец

- [src/app/routes/OrganizationPage.tsx](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/app/routes/OrganizationPage.tsx:1)
  Страница с detail-view, таблицей, статистикой и CRUD-сценариями.

- [src/app/routes/GroupsPage.tsx](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/app/routes/GroupsPage.tsx:1)
  Более насыщенный экран: таблицы, карточки, модалки, детальная страница группы, сравнительная карта.

- [src/app/routes/UiKitPage.tsx](/Users/a1234/Desktop/My%20Projects/Bilimtoy/src/app/routes/UiKitPage.tsx:1)
  Витрина компонентов и лучший ориентир по существующему визуальному языку.

## Рекомендованный workflow для команды

1. Сначала открыть `/ui-kit`.
2. Посмотреть похожую страницу в `src/app/routes`.
3. Переиспользовать существующие UI-компоненты.
4. Добавить mock-данные.
5. Добавить переводы.
6. Проверить `npm run build`.

## Contributing

Если вы добавляете новую страницу, модалку, карточку или таблицу, ориентируйтесь не только на “чтобы работало”, но и на то, чтобы следующий человек мог продолжить работу без пересборки визуального языка с нуля.

### Чеклист для разработчика

Перед созданием нового экрана:

1. Откройте `/ui-kit` и найдите уже существующие паттерны.
2. Проверьте, нет ли похожего решения в `src/app/routes` или `src/components/ui`.
3. Решите, что это:
   route-страница, feature-блок или базовый UI-компонент.

Во время реализации:

1. Используйте `AppShell -> PageContainer -> PageHeader` для новых страниц.
2. Берите цвета, размеры, радиусы и тени только из token-системы.
3. Переиспользуйте `Button`, `Card`, `Table`, `Modal`, `FilterBar`, `StatsCard`, `Badge`, `StatusBadge`.
4. Тексты интерфейса выносите в `i18n`.
5. Крупные мок-структуры выносите в `src/data`.
6. Если кусок UI может пригодиться повторно, выносите его в `components/ui` или `features`.

Перед завершением задачи:

1. Проверьте страницу в браузере.
2. Убедитесь, что текст не ломает сетку и не вылезает из кнопок, таблиц и модалок.
3. Проверьте, что новые состояния выглядят согласованно с существующими экранами.
4. Запустите `npm run build`.

### Чеклист для AI-генерации новых экранов

Если страницу или модуль генерирует AI, ему нужно дать такие ограничения:

1. Использовать только существующий layout проекта.
2. Не придумывать новую палитру, если для задачи хватает текущих token-цветов.
3. Не делать маркетинговые hero-блоки, декоративные лендинги и “визуальный шум”.
4. Строить ERP-экраны как рабочие интерфейсы: плотные, спокойные, сканируемые.
5. Переиспользовать компоненты из `src/components/ui`, а не собирать кнопки, таблицы и модалки заново.
6. Новые тексты добавлять в `ru`, `uz`, `en`.
7. Для сложных экранов сначала собирать mock-данные и только потом подключать API.

Короткий prompt-template для генерации:

```text
Собери новую страницу в стиле текущего Bilimtoy ERP UI.
Используй существующие layout-компоненты, design tokens, Tailwind-классы проекта и переиспользуемые UI-компоненты из src/components/ui.
Не меняй визуальный язык проекта.
Если нужен новый паттерн, сначала проверь, нельзя ли собрать его из существующих Card, Table, Modal, FilterBar, Badge, StatusBadge и StatsCard.
Все пользовательские тексты должны быть готовы к переносу в i18n.
```

### Что не стоит делать

- Не хардкодить случайные `hex`-цвета прямо в JSX.
- Не собирать отдельные “авторские” кнопки, инпуты, таблицы или модалки рядом с уже существующими.
- Не делать новую страницу в другом ритме отступов, радиусов и заголовков.
- Не смешивать mock-данные, layout и большие бизнес-сценарии в одном гигантском неразделенном компоненте, если это уже мешает читать код.

## Перед пушем

Минимальная проверка:

```bash
npm run build
```

Если сборка проходит, значит:

- TypeScript не нашел критичных ошибок;
- route-компоненты и импорты подключены корректно;
- проект можно безопасно отдавать дальше в работу.

## Что можно улучшить дальше

- подключить настоящий роутер (`react-router`);
- вынести большие страницы на более мелкие feature-компоненты;
- добавить линтер и форматтер;
- добавить Storybook или отдельную документацию по UI-компонентам;
- подключить реальные API вместо mock-данных.
