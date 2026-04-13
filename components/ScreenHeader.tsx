import Image from "next/image";

type ScreenHeaderProps = {
  title: string;
};

export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <header
      className="relative mb-3.5 flex min-h-[50px] w-full items-center justify-center"
      role="banner"
    >
      <div className="absolute left-0 top-0 h-[50px] w-[50px]">
        <Image
          src="/matchpoint-logo.png"
          alt=""
          width={50}
          height={50}
          className="h-[50px] w-[50px] object-contain"
          priority
          aria-hidden
        />
      </div>
      <h1 className="shrink-0 text-[13px] font-semibold italic tracking-wide text-white">
        {title}
      </h1>
    </header>
  );
}
