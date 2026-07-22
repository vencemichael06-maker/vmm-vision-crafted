type SocialLinksProps = {
  facebookUrl: string | null;
  linkedinUrl: string | null;
  className?: string;
};

const controlClassName =
  "grid h-11 w-11 shrink-0 place-items-center border border-current transition-colors duration-200";

export function SocialLinks({ facebookUrl, linkedinUrl, className = "" }: SocialLinksProps) {
  return (
    <nav aria-label="Social profiles" className={`flex items-center gap-2 ${className}`}>
      <SocialProfile label="Facebook" url={facebookUrl} icon={<FacebookIcon />} />
      <SocialProfile label="LinkedIn" url={linkedinUrl} icon={<LinkedInIcon />} />
    </nav>
  );
}

function SocialProfile({
  label,
  url,
  icon,
}: {
  label: "Facebook" | "LinkedIn";
  url: string | null;
  icon: React.ReactNode;
}) {
  const selector = label.toLowerCase();

  if (!url) {
    const unavailableLabel = `${label} profile unavailable`;
    return (
      <button
        type="button"
        disabled
        aria-label={unavailableLabel}
        title={unavailableLabel}
        data-social-profile={selector}
        className={`${controlClassName} cursor-not-allowed border-vmm-line text-vmm-ink/35`}
      >
        {icon}
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${label} profile`}
      title={label}
      data-social-profile={selector}
      className={`${controlClassName} text-vmm-ink hover:border-vmm-red hover:bg-vmm-red hover:text-white`}
    >
      {icon}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" aria-hidden="true">
      <path
        fill="currentColor"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.385H7.078v-3.542h3.047V9.374c0-3.019 1.792-4.687 4.533-4.687 1.312 0 2.686.236 2.686.236v2.967h-1.513c-1.491 0-1.956.93-1.956 1.883v2.3h3.328l-.532 3.542h-2.796V24C19.612 23.093 24 18.099 24 12.073Z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.202 24 24 23.227 24 22.271V1.729C24 .774 23.202 0 22.225 0Z"
      />
    </svg>
  );
}
