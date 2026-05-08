/** Shared OG ImageResponse content for PWA / favicon assets. */

const BG = "#7C3AED";
const FG = "#FAF7F2";

type Opts = { borderRadius?: string };

export function pwaAppIconElement(size: number, opts?: Opts) {
  const borderRadius = opts?.borderRadius ?? "22%";
  const fontSize = Math.round((size * 280) / 512);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BG,
        borderRadius,
      }}
    >
      <span
        style={{
          fontSize,
          lineHeight: 1,
          color: FG,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        U
      </span>
    </div>
  );
}
