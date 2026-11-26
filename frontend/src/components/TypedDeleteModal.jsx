import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";

const TypedDeleteModal = ({
  title = "Delete Item",
  itemName,
  description,
  confirmLabel = "Delete Permanently",
  confirmationWord = "delete",
  deleting = false,
  onCancel,
  onConfirm,
}) => {
  const [value, setValue] = useState("");
  const normalizedWord = useMemo(() => confirmationWord.trim().toLowerCase(), [confirmationWord]);
  const isValid = value.trim().toLowerCase() === normalizedWord;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: "linear-gradient(135deg,#0d1117,#161b22)",
          border: "1px solid #f6796322",
          boxShadow: "0 0 60px #00000099",
        }}
      >
        <div className="h-[2px] bg-gradient-to-r from-[#f67963] to-transparent" />
        <div className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-[#f679630a] border border-[#f6796330] flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-5 h-5 text-[#f67963]" />
          </div>
          <h3
            className="text-sm font-black text-[#f4f3ff] mb-2 uppercase text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <p className="text-xs text-[#7c7aa3] mb-4 text-center" style={{ fontFamily: "var(--font-mono)" }}>
            {description}
          </p>

          <div className="rounded-xl border border-[#f5a25d20] bg-[#f5a25d08] p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#f5a25d] flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] text-[#f5a25d] uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                  Permanent Delete
                </p>
                <p className="text-[11px] text-[#a9a7c9] leading-relaxed break-words" style={{ fontFamily: "var(--font-mono)" }}>
                  Name: <span className="text-[#f4f3ff]">"{itemName}"</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label
              className="block text-[10px] text-[#7c7aa3] uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Type <span className="text-[#f67963]">{confirmationWord}</span> to confirm
            </label>
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={confirmationWord}
              className="w-full bg-[#14112e] border border-[#2b2850] rounded-xl px-4 py-3 text-[#f4f3ff] placeholder:text-[#3d3970] focus:outline-none focus:border-[#f6796344] text-sm"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-[#2b2850] text-[#a9a7c9] text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onConfirm(confirmationWord)}
              disabled={!isValid || deleting}
              className="flex-1 py-2.5 rounded-xl bg-[#f67963] text-white font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {deleting ? "Deleting..." : confirmLabel}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TypedDeleteModal;
