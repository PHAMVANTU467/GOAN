import { useEffect, useRef, useState } from "react";
import { UserPlus, X, UserRound, Phone } from "lucide-react";
import type { NewCustomerInput } from "../domain/NewCustomerInput";

export type NewCustomerFormData = NewCustomerInput;

export interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewCustomerFormData) => void;
}

type CustomerField = keyof NewCustomerFormData;
type CustomerErrors = Partial<Record<CustomerField, string>>;

const FORM_ID = "add-customer-form";
const DEFAULT_MEMBER_TIER = "Th\u01b0\u1eddng";
const DEFAULT_CUSTOMER_STATUS = "Ho\u1ea1t \u0111\u1ed9ng";
const MEMBER_TIERS = [DEFAULT_MEMBER_TIER, "VIP"] as const;
const CUSTOMER_STATUSES = [DEFAULT_CUSTOMER_STATUS, "Ng\u1eebng ho\u1ea1t \u0111\u1ed9ng"] as const;

function validateCustomer(data: NewCustomerFormData): CustomerErrors {
  const errors: CustomerErrors = {};
  if (!data.name.trim()) errors.name = "H\u1ecd v\u00e0 t\u00ean l\u00e0 th\u00f4ng tin b\u1eaft bu\u1ed9c.";
  else if (data.name.trim().length < 2) errors.name = "H\u1ecd v\u00e0 t\u00ean c\u1ea7n \u00edt nh\u1ea5t 2 k\u00fd t\u1ef1.";
  if (data.phone.trim() && !/^[+\d() .-]{8,20}$/.test(data.phone.trim())) {
    errors.phone = "S\u1ed1 \u0111i\u1ec7n tho\u1ea1i kh\u00f4ng h\u1ee3p l\u1ec7.";
  }
  if (!data.memberTier.trim()) errors.memberTier = "H\u1ea1ng th\u00e0nh vi\u00ean l\u00e0 b\u1eaft bu\u1ed9c.";
  if (!data.status.trim()) errors.status = "Tr\u1ea1ng th\u00e1i l\u00e0 b\u1eaft bu\u1ed9c.";
  return errors;
}

export function AddCustomerModal({ open, onClose, onSubmit }: AddCustomerModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<NewCustomerFormData>({ name: "", phone: "", memberTier: DEFAULT_MEMBER_TIER, status: DEFAULT_CUSTOMER_STATUS });
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      nameInputRef.current?.focus();
      setForm({ name: "", phone: "", memberTier: DEFAULT_MEMBER_TIER, status: DEFAULT_CUSTOMER_STATUS });
      setErrors({});
      setSubmitted(false);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function updateField(field: CustomerField, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (submitted) setErrors(validateCustomer(next));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateCustomer(form);
    setSubmitted(true);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.name) nameInputRef.current?.focus();
      return;
    }
    onSubmit({ ...form, name: form.name.trim(), phone: form.phone.trim() });
    onClose();
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="add-customer-dialog"
      aria-labelledby="add-customer-title"
      onCancel={onClose}
      onClick={handleBackdropClick}
    >
      <div className="acd-header">
        <div className="acd-header-left">
          <span className="acd-header-icon" aria-hidden="true"><UserPlus size={20} /></span>
          <div>
            <span className="acd-eyebrow">KHÁCH HÀNG</span>
            <h2 id="add-customer-title" className="acd-title">Thêm khách hàng</h2>
          </div>
        </div>
        <button type="button" className="acd-close-btn" aria-label="Đóng biểu mẫu thêm khách hàng" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <form id={FORM_ID} className="acd-form" noValidate onSubmit={handleSubmit}>
        <div className="acd-field-group">
          <label htmlFor="acd-name" className="acd-label">
            Họ và tên <span className="acd-required" aria-label="bắt buộc">*</span>
          </label>
          <div className={`acd-input-wrap ${errors.name ? "acd-input-invalid" : ""}`}>
            <UserRound size={16} className="acd-input-icon" aria-hidden="true" />
            <input
              ref={nameInputRef}
              id="acd-name"
              type="text"
              autoComplete="name"
              placeholder="Nhập họ và tên"
              value={form.name}
              maxLength={100}
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "acd-name-error" : undefined}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </div>
          {errors.name && <p id="acd-name-error" className="acd-field-error" role="alert">{errors.name}</p>}
        </div>

        <div className="acd-field-group">
            <label htmlFor="acd-phone" className="acd-label">Số điện thoại</label>
          <div className={`acd-input-wrap ${errors.phone ? "acd-input-invalid" : ""}`}>
            <Phone size={16} className="acd-input-icon" aria-hidden="true" />
            <input
              id="acd-phone"
              type="tel"
              autoComplete="tel"
              placeholder="Nhập số điện thoại"
              value={form.phone}
              maxLength={20}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "acd-phone-error" : undefined}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </div>
          {errors.phone && <p id="acd-phone-error" className="acd-field-error" role="alert">{errors.phone}</p>}
        </div>

        <div className="acd-field-group">
          <label htmlFor="acd-tier" className="acd-label">Hạng thành viên <span className="acd-required">*</span></label>
          <select id="acd-tier" className="acd-text-input" required aria-invalid={Boolean(errors.memberTier)} aria-describedby={errors.memberTier ? "acd-tier-error" : undefined} value={form.memberTier} onChange={(event) => updateField("memberTier", event.target.value)}>
            {MEMBER_TIERS.map((tier) => <option key={tier} value={tier}>{tier}</option>)}
          </select>
          {errors.memberTier && <p id="acd-tier-error" className="acd-field-error" role="alert">{errors.memberTier}</p>}
        </div>
        <div className="acd-field-group">
          <label htmlFor="acd-status" className="acd-label">Trạng thái <span className="acd-required">*</span></label>
          <select id="acd-status" className="acd-text-input" required aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? "acd-status-error" : undefined} value={form.status} onChange={(event) => updateField("status", event.target.value)}>
            {CUSTOMER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          {errors.status && <p id="acd-status-error" className="acd-field-error" role="alert">{errors.status}</p>}
        </div>
      </form>

      <div className="acd-footer">
        <button type="button" className="acd-btn-cancel" onClick={onClose}>Hủy</button>
        <button type="submit" form={FORM_ID} className="acd-btn-submit">
          <UserPlus size={16} aria-hidden="true" /> Thêm khách hàng
        </button>
      </div>
    </dialog>
  );
}
