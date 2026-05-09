import { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import type { BranchRecord, Gender, OrganizationForm, OrganizationType, OwnerRole, OwnershipType } from "../../data/mockOrganizations";
import { useI18n } from "../../i18n";
import { Button, CrudSelect, FileAttachment, FormSection, Input, Modal, Select } from "../../components/ui";

export interface BranchFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialValues?: BranchRecord;
  onOpenChange: (open: boolean) => void;
  onSave: (branch: BranchRecord) => void;
}

const emptyBranch: Omit<BranchRecord, "id" | "rowNumber"> = {
  organizationForm: "mchj",
  legalName: "",
  shortName: "",
  organizationType: "combinedType",
  ownership: "private",
  createdAt: "09.05.2026",
  taxId: "",
  registrationNumber: "",
  licenseFile: "license_branch_001.pdf",
  cityDistrict: "",
  street: "",
  coordinates: "",
  phone: "",
  managementPhone: "",
  ownerDirectorName: "",
  bankAccount: "",
  ownerRole: "director",
  birthDate: "",
  gender: "female",
  additionalPhone: "",
  email: "",
  passportPinfl: "",
  password: "••••••••••••••••",
  stats: {
    children: 0,
    groups: 0,
    employees: 0,
    finance: "0 сум",
  },
  childrenCount: 0,
  teachersCount: 0,
  dependenciesCount: 0,
};

export function BranchFormModal({ open, mode, initialValues, onOpenChange, onSave }: BranchFormModalProps) {
  const { t } = useI18n();
  const [form, setForm] = useState<BranchRecord>(() => toFormRecord(initialValues));

  useEffect(() => {
    if (open) setForm(toFormRecord(initialValues));
  }, [initialValues, open]);

  const taxLabel =
    form.organizationForm === "yatt" || form.organizationForm === "ok" ? t("organizations.labels.pinfl") : t("organizations.labels.inn");

  const update = (key: keyof BranchRecord, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const title = mode === "add" ? t("organizations.modal.addTitle") : t("organizations.modal.editTitle");
  const description = mode === "add" ? t("organizations.modal.addDescription") : t("organizations.modal.editDescription");

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.actions.cancel")}
          </Button>
          <Button
            onClick={() => {
              onSave(form);
              onOpenChange(false);
            }}
          >
            {t("common.actions.save")}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <FormSection title={`1. ${t("organizations.sections.basicInfo")}`}>
          <Select
            label={`${t("organizations.labels.organizationForm")} *`}
            value={form.organizationForm}
            onChange={(event) => update("organizationForm", event.target.value as OrganizationForm)}
            options={organizationFormOptions(t)}
          />
          <Input
            label={`${t("organizations.labels.legalName")} *`}
            value={form.legalName}
            onChange={(event) => update("legalName", event.target.value)}
          />
          <Input
            label={`${t("organizations.labels.shortName")} *`}
            value={form.shortName}
            onChange={(event) => update("shortName", event.target.value)}
          />
          <Input
            label={`${t("organizations.labels.cityDistrict")} *`}
            value={form.cityDistrict}
            onChange={(event) => update("cityDistrict", event.target.value)}
            rightIcon={<Search className="h-4 w-4" />}
          />
          <Input
            label={`${t("organizations.labels.address")} *`}
            value={form.street}
            onChange={(event) => update("street", event.target.value)}
          />
          <Input
            label={`${t("organizations.labels.coordinates")} *`}
            value={form.coordinates}
            onChange={(event) => update("coordinates", event.target.value)}
          />
          <CrudSelect
            label={`${t("organizations.labels.ownership")} *`}
            value={form.ownership}
            onValueChange={(value) => update("ownership", value as OwnershipType)}
            options={ownershipOptions(t)}
            addLabel={t("common.actions.addNew")}
            newItemLabel={t("common.labels.newValueName")}
            newItemPlaceholder={t("common.placeholders.enterName")}
            saveLabel={t("common.actions.save")}
            cancelLabel={t("common.actions.cancel")}
          />
          <Input
            label={`${t("organizations.labels.phone")} *`}
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </FormSection>

        <FormSection title={`2. ${t("organizations.sections.legalInfo")}`}>
          <Input label={`${taxLabel} *`} value={form.taxId} onChange={(event) => update("taxId", event.target.value)} />
          <Input
            label={`${t("organizations.labels.registrationNumber")} *`}
            value={form.registrationNumber}
            onChange={(event) => update("registrationNumber", event.target.value)}
          />
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">{t("organizations.labels.license")} *</span>
            <FileAttachment
              fileName={form.licenseFile}
              removeLabel={t("common.actions.removeFile")}
              onRemove={() => update("licenseFile", "license_branch_001.pdf")}
            />
          </div>
          <CrudSelect
            label={`${t("organizations.labels.organizationType")} *`}
            value={form.organizationType}
            onValueChange={(value) => update("organizationType", value as OrganizationType)}
            options={organizationTypeOptions(t)}
            addLabel={t("common.actions.addNew")}
            newItemLabel={t("common.labels.newValueName")}
            newItemPlaceholder={t("common.placeholders.enterName")}
            saveLabel={t("common.actions.save")}
            cancelLabel={t("common.actions.cancel")}
          />
          <Input
            className="md:col-span-2"
            label={`${t("organizations.labels.bankAccount")} *`}
            value={form.bankAccount}
            onChange={(event) => update("bankAccount", event.target.value)}
          />
        </FormSection>

        <FormSection title={`3. ${t("organizations.sections.ownerInfo")}`}>
          <Input
            label={`${t("organizations.labels.ownerDirector")} *`}
            value={form.ownerDirectorName}
            onChange={(event) => update("ownerDirectorName", event.target.value)}
          />
          <Select
            label={`${t("organizations.labels.role")} *`}
            value={form.ownerRole}
            onChange={(event) => update("ownerRole", event.target.value as OwnerRole)}
            options={ownerRoleOptions(t)}
          />
          <Input
            label={`${t("organizations.labels.birthDate")} *`}
            value={form.birthDate}
            onChange={(event) => update("birthDate", event.target.value)}
          />
          <Select
            label={t("organizations.labels.gender")}
            value={form.gender}
            onChange={(event) => update("gender", event.target.value as Gender)}
            options={genderOptions(t)}
          />
          <Input
            label={`${t("organizations.labels.managementPhone")} *`}
            value={form.managementPhone}
            onChange={(event) => update("managementPhone", event.target.value)}
          />
          <Input
            label={t("organizations.labels.additionalPhone")}
            value={form.additionalPhone}
            onChange={(event) => update("additionalPhone", event.target.value)}
          />
          <Input label={`${t("organizations.labels.email")} *`} value={form.email} onChange={(event) => update("email", event.target.value)} />
          <Input
            label={`${t("organizations.labels.passportPinfl")} *`}
            value={form.passportPinfl}
            onChange={(event) => update("passportPinfl", event.target.value)}
          />
          <Input
            label={`${t("organizations.labels.password")} *`}
            value={form.password}
            onChange={(event) => update("password", event.target.value)}
            rightIcon={<Eye className="h-4 w-4" />}
          />
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => update("password", "Bt-2026-4821")}>
              {t("common.actions.generate")}
            </Button>
          </div>
        </FormSection>
      </div>
    </Modal>
  );
}

function toFormRecord(initialValues?: BranchRecord): BranchRecord {
  return {
    id: initialValues?.id ?? "branch-new",
    rowNumber: initialValues?.rowNumber ?? "10036",
    ...emptyBranch,
    ...initialValues,
  };
}

function organizationFormOptions(t: (key: string) => string) {
  return [
    { value: "mchj", label: t("organizations.options.mchj") },
    { value: "ntm", label: t("organizations.options.ntm") },
    { value: "yatt", label: t("organizations.options.yatt") },
    { value: "ok", label: t("organizations.options.ok") },
  ];
}

function ownershipOptions(t: (key: string) => string) {
  return [
    { value: "private", label: t("organizations.options.private") },
    { value: "state", label: t("organizations.options.state") },
    { value: "publicPrivate", label: t("organizations.options.publicPrivate") },
    { value: "family", label: t("organizations.options.family") },
  ];
}

function organizationTypeOptions(t: (key: string) => string) {
  return [
    { value: "generalType", label: t("organizations.options.generalType") },
    { value: "combinedType", label: t("organizations.options.combinedType") },
    { value: "inclusiveType", label: t("organizations.options.inclusiveType") },
    { value: "specializedType", label: t("organizations.options.specializedType") },
  ];
}

function ownerRoleOptions(t: (key: string) => string) {
  return [
    { value: "director", label: t("organizations.options.director") },
    { value: "owner", label: t("organizations.options.owner") },
  ];
}

function genderOptions(t: (key: string) => string) {
  return [
    { value: "female", label: t("organizations.options.female") },
    { value: "male", label: t("organizations.options.male") },
  ];
}
