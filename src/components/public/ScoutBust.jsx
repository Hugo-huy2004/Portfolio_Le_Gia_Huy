// Youth leader (Huynh trưởng TNTT) — the reference illustration itself (public/education/huynh-truong.png, 856×974).
// A grayscale copy sits over the scarf through a mask; the page's scroll timeline draws black strokes into
// that mask (.scout-reveal) in tying order — left side, right side, knot, tail — so the red scarf "goes on".
// Without the timeline (reduced motion) the reveal strokes are fully drawn, i.e. the full-colour picture.
const SRC = "/education/huynh-truong.png";
// Centre-lines of the scarf in image pixels, in the order it is tied.
const SCARF = [
  "M286 258 C250 290 222 330 240 380 C256 420 300 440 336 448",
  "M548 258 C578 300 586 340 540 372 C490 404 440 428 396 446",
  "M296 474 L396 474",
  "M345 500 C345 640 348 760 360 900",
];

export default function ScoutBust({ label }) {
  return (
    <svg className="scout-bust" viewBox="0 0 856 974" role="img" aria-label={label}>
      <defs>
        <clipPath id="scout-frame"><rect width="856" height="974" rx="56" /></clipPath>
        <filter id="scout-gray" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncR type="linear" slope="1.12" /><feFuncG type="linear" slope="1.12" /><feFuncB type="linear" slope="1.12" /></feComponentTransfer>
        </filter>
        <mask id="scout-scarf-gray" maskUnits="userSpaceOnUse" x="0" y="0" width="856" height="974">
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {SCARF.map((d) => <path key={`cover-${d}`} d={d} stroke="#fff" strokeWidth="86" />)}
            {SCARF.map((d) => <path key={`reveal-${d}`} className="scout-reveal" d={d} pathLength="1" stroke="#000" strokeWidth="98" />)}
          </g>
        </mask>
      </defs>
      <g clipPath="url(#scout-frame)">
        <image href={SRC} width="856" height="974" />
        <image href={SRC} width="856" height="974" filter="url(#scout-gray)" mask="url(#scout-scarf-gray)" />
        {/* hides the step number "6" printed on the reference */}
        <rect x="626" y="104" width="130" height="130" fill="#87c2ff" />
      </g>
    </svg>
  );
}
