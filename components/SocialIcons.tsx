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

export function InstagramIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.7" cy="8.2" r="1.3" />
      <rect x="6.7" y="10.8" width="2" height="6.8" />
      <path d="M11.3 10.8h2v1c.5-.75 1.3-1.2 2.3-1.2 1.9 0 2.9 1.25 2.9 3.4v3.6h-2v-3.2c0-1-.4-1.7-1.4-1.7-.8 0-1.3.55-1.5 1.05-.08.2-.1.45-.1.75v3.1h-2v-6.75Z" />
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

export const socialIcons = [FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon];
