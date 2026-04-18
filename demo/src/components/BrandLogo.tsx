type BrandLogoProps = {
  variant?: "full" | "icon";
  className?: string;
};

export const BrandLogo = ({ variant = "full", className = "" }: BrandLogoProps) => {
  const src = variant === "icon" ? "/iteron-i.png" : "/iteron-logo-full.png";
  const alt = variant === "icon" ? "Iteron icon" : "Iteron logo";
  const baseClass = variant === "icon" ? "h-8 w-8" : "h-8 w-auto";

  return <img src={src} alt={alt} className={`${baseClass} ${className}`.trim()} />;
};
