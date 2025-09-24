import React from 'react';

export interface HotbarProps {
  /**
   * Array of item identifiers to display in the hotbar.  Unused slots
   * are undefined.  Items might include consumables like magnets or
   * clocks, or pets waiting to be activated.  When an item is
   * clicked the corresponding index is passed to onUse.
   */
  items: (string | undefined)[];
  onUse: (index: number) => void;
}

/**
 * A simple horizontal hotbar UI reminiscent of Minecraft.  Displays
 * up to nine items; empty slots render as semi‑transparent boxes.
 * Clicking a slot invokes the onUse callback.  The styling uses
 * Tailwind classes; adjust as needed to match your theme.
 */
const Hotbar: React.FC<HotbarProps> = ({ items, onUse }) => {
  const slots = Array.from({ length: 9 }).map((_, i) => items[i]);
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-2 flex space-x-1">
      {slots.map((item, idx) => (
        <button
          key={idx}
          className={`w-10 h-10 flex items-center justify-center border-2 border-white/40 rounded-sm ${item ? 'bg-white/90' : 'bg-white/20'}`}
          onClick={() => {
            if (item) onUse(idx);
          }}
        >
          {item ? <span className="text-xs text-black truncate">{item}</span> : null}
        </button>
      ))}
    </div>
  );
};

export default Hotbar;