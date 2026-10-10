type AuthPromoPanelProps = {
  alt: string;
  src: string;
};

export default function AuthPromoPanel({ src }: AuthPromoPanelProps) {
  return (
    <div
      className="hidden h-full self-start lg:block"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "top left",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
