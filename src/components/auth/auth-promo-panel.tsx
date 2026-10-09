import Image from "next/image";

type AuthPromoPanelProps = {
  alt: string;
  src: string;
};

export default function AuthPromoPanel({ alt, src }: AuthPromoPanelProps) {
  return (
    <div className="hidden h-svh self-start lg:block">
      <div className="relative h-full">
        <Image
          alt={alt}
          className="object-cover"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          src={src}
          unoptimized
        />
      </div>
    </div>
  );
}
