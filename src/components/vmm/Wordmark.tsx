export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-display text-2xl leading-none tracking-tight ${className}`}
    >
      <span>vmm</span>
      <span className="text-vmm-red">.</span>
    </span>
  );
}
