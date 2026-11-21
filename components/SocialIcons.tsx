import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size = 16) {
  return { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor" };
}

export function FacebookIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.35C16.2 4.3 15.2 4.2 14 4.2c-2.4 0-4 1.45-4 4.1V10.5H7.5v3H10V21h3.5Z" />
    </svg>
  );
}

export function TwitterIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.3 9.7v4.6l4-2.3-4-2.3Z" />
    </svg>
  );
}

export const socialLinks = [
  {
    label: "Facebook",
    Icon: FacebookIcon,
    href: "https://www.facebook.com/people/Furqan-Saeed-Technical-Institute/61591534803467/",
  },
  {
    label: "Twitter",
    Icon: TwitterIcon,
    href: "https://x.com/fstechins",
  },
  {
    label: "YouTube",
    Icon: YoutubeIcon,
    href: "https://www.youtube.com/@FurqanSaeedTechnicalInstitute",
  },
];
