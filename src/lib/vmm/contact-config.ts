export const contactConfig = {
  endpoint: import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || "/api/contact",
  email: "hello@vmmcreatives.site",
  whatsappDisplay: "+63 906 745 1651",
  whatsappUrl: "https://wa.me/639067451651",
  social: {
    facebookUrl: import.meta.env.VITE_FACEBOOK_URL?.trim() || null,
    linkedinUrl: import.meta.env.VITE_LINKEDIN_URL?.trim() || null,
  },
  budgetRanges: [
    { value: "Under PHP 25k", label: "Under PHP 25k" },
    { value: "PHP 25k-50k", label: "PHP 25k–50k" },
    { value: "PHP 50k-100k", label: "PHP 50k–100k" },
    { value: "PHP 100k-250k", label: "PHP 100k–250k" },
    { value: "PHP 250k+", label: "PHP 250k+" },
  ],
} as const;

export const projectTypes = ["Website", "Web app", "Mobile app", "Automation", "Branding"] as const;
