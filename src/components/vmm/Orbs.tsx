type OrbSpec = {
  size: "s" | "m" | "l";
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  className?: string;
};

const px = { s: 120, m: 260, l: 520 };

export function Orbs({ items }: { items: OrbSpec[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((o, i) => (
        <span
          key={i}
          data-orb
          className={`vmm-orb select-none ${o.className ?? ""}`}
          style={{
            top: o.top,
            left: o.left,
            right: o.right,
            bottom: o.bottom,
            opacity: o.opacity ?? 0.85,
            width: px[o.size],
            height: px[o.size],
          }}
        />
      ))}
    </div>
  );
}
