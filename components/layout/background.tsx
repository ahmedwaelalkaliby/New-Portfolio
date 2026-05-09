export function Background() {
  return (
    <>
      <div className="noise" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,#070a0f_0%,#0b1117_42%,#070a0f_100%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/60 to-transparent" />
    </>
  );
}
