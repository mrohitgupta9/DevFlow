import {
  FiBell,
  FiMenu,
  FiSearch,
  FiUser,
} from "react-icons/fi";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <FiMenu size={20} />
        </button>

        <div className="relative hidden md:block">
          <FiSearch
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="h-9 w-64 rounded-lg border border-slate-800 bg-slate-900 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
          />

          <span className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500 lg:block">
            /
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <FiBell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-slate-800 sm:block" />

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-800"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300">
            <FiUser size={16} />
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium text-white">
              Developer
            </p>

            <p className="text-[10px] text-slate-500">
              devflow
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Topbar;