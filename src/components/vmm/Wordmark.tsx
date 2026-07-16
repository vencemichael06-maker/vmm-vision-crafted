import { Link } from "@tanstack/react-router";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-baseline font-display text-2xl leading-none tracking-tight ${className}`}>
      <span>vmm</span>
      <span className="text-vmm-red">.</span>
    </Link>
  );
}
