import orbSmall from "@/assets/vmm/orb_small.png.asset.json";
import orbMedium from "@/assets/vmm/orb_medium.png.asset.json";
import orbLarge from "@/assets/vmm/orb_large.png.asset.json";

type OrbSpec = { size: "s" | "m" | "l"; top?: string; left?: string; right?: string; bottom?: string; opacity?: number; className?: string };

const src = { s: orbSmall.url, m: orbMedium.url, l: orbLarge.url };
const px = { s: 120, m: 260, l: 520 };

export function Orbs({ items }: { items: OrbSpec[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((o, i) => (
        <img
          key={i}
          data-orb
          src={src[o.size]}
          width={px[o.size]}
          height={px[o.size]}
          alt=""
          className={`absolute select-none ${o.className ?? ""}`}
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
