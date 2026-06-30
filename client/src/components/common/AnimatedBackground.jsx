export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#090615]">
      {/* Aurora blobs */}
      <div className="blob cyan"></div>
      <div className="blob purple"></div>
      <div className="blob blue"></div>

      {/* Grid */}
      <div className="grid-overlay"></div>

      {/* Noise */}
      <div className="noise"></div>
    </div>
  );
}