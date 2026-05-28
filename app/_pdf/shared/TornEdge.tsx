/**
 * Torn-paper edge SVG overlay.
 * direction="down"  → jagged edge at the bottom (green above, content below)
 * direction="up"    → jagged edge at the top (content above, green below)
 *
 * The SVG uses a hand-crafted irregular path that reads as a torn paper edge.
 * Rendered at full width; height is ~40px of "tear".
 */

interface TornEdgeProps {
  direction: "down" | "up";
  color?: string;
  className?: string;
}

// A fixed irregular path across 1000 units wide, 60 units tall.
// direction="down"  → the green band's bottom edge is torn (fill color sits on top)
// direction="up"    → the green band's top edge is torn (fill color sits below)
const TORN_PATH =
  "M0,0 L0,28 C30,42 55,14 80,30 C105,46 130,18 160,35 C190,52 215,22 245,38 " +
  "C275,54 300,20 330,36 C360,52 385,18 415,34 C445,50 470,16 500,32 " +
  "C530,48 555,20 585,36 C615,52 640,18 670,34 C700,50 725,16 755,30 " +
  "C785,44 810,20 840,36 C870,52 895,22 925,38 C955,54 975,28 1000,40 " +
  "L1000,0 Z";

// For "up" direction we flip it: the tear appears at the top of the element,
// with the fill color covering the bottom portion.
const TORN_PATH_UP =
  "M0,60 L0,32 C30,18 55,46 80,30 C105,14 130,42 160,25 " +
  "C190,8 215,38 245,22 C275,6 300,40 330,24 " +
  "C360,8 385,42 415,26 C445,10 470,44 500,28 " +
  "C530,12 555,40 585,24 C615,8 640,42 670,26 " +
  "C700,10 725,44 755,30 C785,16 810,40 840,24 " +
  "C870,8 895,38 925,22 C955,6 975,32 1000,20 " +
  "L1000,60 Z";

export default function TornEdge({ direction, color = "#0e6b3a", className = "" }: TornEdgeProps) {
  const path = direction === "down" ? TORN_PATH : TORN_PATH_UP;
  return (
    <svg
      viewBox="0 0 1000 60"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "block", width: "100%", height: "40px" }}
    >
      <path d={path} fill={color} />
    </svg>
  );
}
