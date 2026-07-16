import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import toolN8n from "@/assets/vmm/tool_n8n.png.asset.json";
import toolVs from "@/assets/vmm/tool_vscode.png.asset.json";
import toolVapi from "@/assets/vmm/tool_vapi.png.asset.json";
import toolGpt from "@/assets/vmm/tool_chatgpt.png.asset.json";
import toolClaude from "@/assets/vmm/tool_claude.png.asset.json";
import toolNetlify from "@/assets/vmm/tool_netlify.png.asset.json";
import toolSupabase from "@/assets/vmm/tool_supabase.png.asset.json";
import { Wordmark } from "./Wordmark";

const tools = [
  { src: toolN8n.url, name: "n8n" },
  { src: toolVs.url, name: "VS Code" },
  { src: toolVapi.url, name: "Vapi" },
  { src: toolGpt.url, name: "ChatGPT / Codex" },
  { src: toolClaude.url, name: "Claude Code" },
  { src: toolNetlify.url, name: "Netlify" },
  { src: toolSupabase.url, name: "Supabase" },
];

export function HomeToolsStrip() {
  return (
    <section className="relative w-full">
      <div className="red-panel w-full py-8 md:py-10">
        <div className="mx-auto flex max-w-[1760px] flex-wrap items-center gap-x-10 gap-y-4 px-5 md:px-16 lg:px-24">
          <span className="text-[12px] font-bold tracking-[0.28em]">TOOLS I USE</span>
          <span className="hidden h-6 w-px bg-white/40 md:block" />
          <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-4 md:gap-x-10">
            {tools.map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-white">
                <img src={t.src} alt="" className="h-7 w-7 object-contain" />
                <span className="text-sm font-bold tracking-wide">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer className="w-full bg-vmm-ink text-white">
      <div className="mx-auto grid max-w-[1760px] grid-cols-1 gap-10 px-5 py-16 md:grid-cols-3 md:px-16 lg:px-24">
        <div>
          <Wordmark className="text-white [&>span:first-child]:text-white" />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            UI/UX Designer & Web Developer building clean, modern and impactful digital experiences.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["/", "Home"],
            ["/about", "About"],
            ["/work", "Work"],
            ["/services", "Services"],
            ["/contact", "Contact"],
          ].map(([to, l]) => (
            <Link key={to} to={to} className="text-white/70 hover:text-vmm-red">
              {l}
            </Link>
          ))}
        </nav>
        <div className="md:justify-self-end">
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 rounded-md bg-vmm-red px-6 py-4 text-[12px] font-bold tracking-[0.2em] text-white"
          >
            START A PROJECT <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1760px] flex-col gap-2 px-5 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between md:px-16 lg:px-24">
          <p>© {new Date().getFullYear()} Vence Michael Montero. All rights reserved.</p>
          <p>Based in the Philippines · Available for freelance</p>
        </div>
      </div>
    </footer>
  );
}
