import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface DialogContent {
  title: string;
  description: string;
}

export function InfoDialog({
  content,
  onClose,
}: {
  content: DialogContent | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (content) ref.current?.showModal();
    else ref.current?.close();
  }, [content]);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <button
        className="dialog-close icon-button"
        aria-label="Đóng"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <span className="eyebrow">GOAN • ĐỒNG HÀNH CÙNG BẠN</span>
      <h2 id="dialog-title">{content?.title}</h2>
      <p id="dialog-description">{content?.description}</p>
      <button className="primary-button" onClick={onClose}>
        Đã hiểu
      </button>
    </dialog>
  );
}
