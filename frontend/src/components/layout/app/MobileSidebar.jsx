import Sidebar from "./Sidebar";

const MobileSidebar = ({ open, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* Sidebar */}
      <div className="relative z-10 h-full">
        <Sidebar mobile onClose={onClose} />
      </div>
    </div>
  );
};

export default MobileSidebar;