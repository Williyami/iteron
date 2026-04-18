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
  return (
    <div className={clsx("flex items-center", className)} style={{ gap: withWordmark ? 10 : 0 }}>
      <Image
        src="/iteron-logo.png"
        alt="Iteron logo"
        width={size}
        height={size}
        priority
      />

      {withWordmark ? (
        <div className="flex items-center gap-1.5">
          <span
            className="text-[15px] leading-none text-ink"
            style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            iteron
          </span>
          <span
            className="text-[15px] leading-none"
            style={{ color: "var(--signal)", letterSpacing: "-0.02em" }}
          >
            ai
          </span>
        </div>
      ) : null}
    </div>
  );
}
