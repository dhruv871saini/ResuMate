interface Props {
  url?: string;
}

export default function AppBackground({ url }: Props) {
  if (!url) return null;

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url("${url}")` }}
      />
      <div aria-hidden className="fixed inset-0 -z-10 bg-ink/75" />
    </>
  );
}
