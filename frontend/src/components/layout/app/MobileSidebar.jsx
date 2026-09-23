import { useEffect } from "react";

import Sidebar from "./Sidebar";

const MobileSidebar = ({
  open,
  onClose,
}) => {
  /*
  |--------------------------------------------------------------------------
  | Lock body scroll while mobile sidebar is open
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /*
  |--------------------------------------------------------------------------
  | Escape key
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* =====================================================
          BACKDROP
      ====================================================== */}

      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
      />

      {/* =====================================================
          DRAWER
      ====================================================== */}

      <div className="relative z-10 h-full w-72 max-w-[85vw]">
        <div className="h-full overflow-hidden bg-slate-950 shadow-2xl shadow-black/50">
          <Sidebar
            mobile
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;