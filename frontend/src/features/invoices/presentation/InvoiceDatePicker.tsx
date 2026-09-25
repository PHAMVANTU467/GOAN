import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface InvoiceDatePickerProps {
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parseDate = (value: string) => new Date(`${value}T00:00:00`);

export function InvoiceDatePicker({ label, value, min, max, onChange }: InvoiceDatePickerProps) {
  const selected = value ? parseDate(value) : null;
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = value ? parseDate(value) : new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (value) {
      const date = parseDate(value);
      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function closeOnOutsideClick(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const count = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)];
  }, [visibleMonth]);

  const displayValue = selected
    ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(selected)
    : "Chọn ngày";
  const monthLabel = new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(visibleMonth);

  return (
    <div className="invoice-date-picker" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="invoice-date-trigger"
        aria-label={`${label}: ${displayValue}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <CalendarDays size={16} aria-hidden="true" />
        <span>{displayValue}</span>
      </button>
      {open && <div className="invoice-calendar-popover" role="dialog" aria-label={label}>
        <div className="invoice-calendar-header">
          <button type="button" aria-label="Tháng trước" onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={17} /></button>
          <strong>{monthLabel}</strong>
          <button type="button" aria-label="Tháng sau" onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={17} /></button>
        </div>
        <div className="invoice-calendar-grid">
          {WEEKDAYS.map((weekday) => <span key={weekday} className="invoice-calendar-weekday">{weekday}</span>)}
          {calendarDays.map((day, index) => {
            if (day === null) return <span key={`blank-${index}`} aria-hidden="true" />;
            const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
            const key = dateKey(date);
            const disabled = Boolean((min && key < min) || (max && key > max));
            const today = key === dateKey(new Date());
            return <button
              key={key}
              type="button"
              aria-label={new Intl.DateTimeFormat("vi-VN", { dateStyle: "full" }).format(date)}
              aria-pressed={key === value}
              className={`${key === value ? "is-selected" : ""} ${today ? "is-today" : ""}`}
              disabled={disabled}
              onClick={() => { onChange(key); setOpen(false); }}
            >{day}</button>;
          })}
        </div>
        <div className="invoice-calendar-footer">
          <button type="button" onClick={() => { onChange(""); setOpen(false); }}>Xóa ngày</button>
          <button type="button" onClick={() => { const today = dateKey(new Date()); onChange(today); setVisibleMonth(parseDate(today)); setOpen(false); }}>Hôm nay</button>
        </div>
      </div>}
    </div>
  );
}
