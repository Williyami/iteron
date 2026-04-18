import Image from "next/image";
import clsx from "clsx";

export function IteronLogo({
  className,
  withWordmark = true,
  size = 30,
}: {
  className?: string;
  withWordmark?: boolean;
  size?: number;
}) {
  const src = withWordmark ? "/iteron-logo-full.png" : "/iteron-i.png";
  const width = withWordmark ? Math.round(size * 3.1) : size;

  return (
    <div className={clsx("flex items-center", className)}>
      <Image
        src={src}
        alt={withWordmark ? "Iteron logo" : "Iteron icon"}
        width={width}
        height={size}
        priority
      />
    </div>
  );
}
