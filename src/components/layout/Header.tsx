import { Bell, CheckCircle2, ChevronDown, Clock, LockKeyhole, LogOut, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../../i18n";
import { Avatar, AvatarFallback, Badge, Button, Input, Modal } from "../ui";
import { LanguageSwitcher } from "./LanguageSwitcher";

const notifications = [
  {
    id: "notification-1",
    titleKey: "layout.notifications.items.payment.title",
    descriptionKey: "layout.notifications.items.payment.description",
    time: "08:40",
    tone: "warning",
  },
  {
    id: "notification-2",
    titleKey: "layout.notifications.items.ticket.title",
    descriptionKey: "layout.notifications.items.ticket.description",
    time: "08:25",
    tone: "info",
  },
  {
    id: "notification-3",
    titleKey: "layout.notifications.items.goal.title",
    descriptionKey: "layout.notifications.items.goal.description",
    time: "Вчера",
    tone: "success",
  },
] as const;

export function Header() {
  const { t } = useI18n();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-header items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-3 text-sm text-text-muted">
        <span>{t("layout.headerContext")}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("layout.tooltips.notifications")}
            onClick={() => {
              setNotificationsOpen((current) => !current);
              setProfileOpen(false);
            }}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-text px-1 text-[10px] font-semibold leading-none text-text-inverse">
              3
            </span>
          </Button>

          {notificationsOpen ? (
            <div className="absolute right-0 top-12 z-40 w-[380px] overflow-hidden rounded-card border border-border bg-surface shadow-modal">
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div>
                  <div className="font-semibold text-text-primary">{t("layout.notifications.title")}</div>
                  <div className="text-xs text-text-muted">{t("layout.notifications.description")}</div>
                </div>
                <Badge variant="info">{t("layout.notifications.newCount", { count: 3 })}</Badge>
              </div>
              <div className="max-h-[360px] overflow-y-auto p-2">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    className="flex w-full gap-3 rounded-input p-3 text-left transition hover:bg-page"
                  >
                    <span className={notification.tone === "success" ? "mt-0.5 text-success-text" : notification.tone === "warning" ? "mt-0.5 text-warning-text" : "mt-0.5 text-primary"}>
                      {notification.tone === "success" ? <CheckCircle2 className="h-5 w-5" /> : notification.tone === "warning" ? <ShieldAlert className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-text-primary">{t(notification.titleKey)}</span>
                      <span className="mt-1 block text-xs leading-5 text-text-secondary">{t(notification.descriptionKey)}</span>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-text-muted">
                        <Clock className="h-3.5 w-3.5" />
                        {notification.time}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="border-t border-border p-3">
                <Button variant="outline" className="w-full" onClick={() => setNotificationsOpen(false)}>
                  {t("layout.notifications.viewAll")}
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <LanguageSwitcher />

        <div className="relative ml-2 border-l border-border pl-4">
          <button
            type="button"
            className="flex items-center gap-3 rounded-input px-2 py-1.5 text-left transition hover:bg-page"
            onClick={() => {
              setProfileOpen((current) => !current);
              setNotificationsOpen(false);
            }}
          >
            <Avatar>
              <AvatarFallback>{t("layout.avatarFallback")}</AvatarFallback>
            </Avatar>
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-semibold text-text-primary">{t("layout.userName")}</span>
              <span className="block text-xs text-text-muted">{t("layout.userContext")}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-text-muted" />
          </button>

          {profileOpen ? (
            <div className="absolute right-0 top-14 z-40 w-72 overflow-hidden rounded-card border border-border bg-surface shadow-modal">
              <div className="border-b border-border px-4 py-3">
                <div className="font-semibold text-text-primary">{t("layout.userName")}</div>
                <div className="text-xs text-text-muted">{t("layout.userContext")}</div>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-input px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-page hover:text-text-primary"
                  onClick={() => {
                    setPasswordOpen(true);
                    setProfileOpen(false);
                  }}
                >
                  <LockKeyhole className="h-4 w-4 text-primary" />
                  {t("layout.profile.changePassword")}
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-input px-3 py-2.5 text-sm font-medium text-danger-text transition hover:bg-danger-bg"
                >
                  <LogOut className="h-4 w-4" />
                  {t("layout.profile.logout")}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ChangePasswordModal open={passwordOpen} onOpenChange={setPasswordOpen} />
    </header>
  );
}

function ChangePasswordModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("layout.profile.changePassword")}
      description={t("layout.profile.changePasswordDescription")}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.cancel")}</Button>
          <Button onClick={() => onOpenChange(false)}>{t("common.actions.save")}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label={t("layout.profile.currentPassword")} type="password" placeholder="••••••••" />
        <Input label={t("layout.profile.newPassword")} type="password" placeholder="••••••••" />
        <Input label={t("layout.profile.repeatPassword")} type="password" placeholder="••••••••" />
      </div>
    </Modal>
  );
}
