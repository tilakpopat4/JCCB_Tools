// Official High-Resolution Bank Emblem SVG Vector for The Junagadh Commercial Co-Operative Bank Ltd.
const TJCCB_LOGO_SVG = `
<svg viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <!-- Circular Base -->
  <circle cx="250" cy="250" r="242" fill="#ffffff" stroke="#041562" stroke-width="14"/>
  <circle cx="250" cy="250" r="222" fill="none" stroke="#041562" stroke-width="4"/>
  
  <!-- Outer Circular Text Path -->
  <defs>
    <!-- Top Arc Path for English Bank Name -->
    <path id="topTextArc" d="M 65 250 A 185 185 0 1 1 435 250" fill="none"/>
    <!-- Bottom Arc Path for Junagadh -->
    <path id="bottomTextArc" d="M 435 250 A 185 185 0 0 1 65 250" fill="none"/>
  </defs>

  <text fill="#041562" font-family="'Plus Jakarta Sans', 'Arial Black', sans-serif" font-size="28.5" font-weight="900" letter-spacing="2.5">
    <textPath href="#topTextArc" startOffset="50%" text-anchor="middle">
      THE JUNAGADH COMMERCIAL CO-OPERATIVE BANK LTD.
    </textPath>
  </text>

  <text fill="#041562" font-family="'Plus Jakarta Sans', 'Arial Black', sans-serif" font-size="34" font-weight="900" letter-spacing="4">
    <textPath href="#bottomTextArc" startOffset="50%" text-anchor="middle">
      • JUNAGADH. •
    </textPath>
  </text>

  <!-- Inner Cogwheel Ring -->
  <circle cx="250" cy="250" r="140" fill="none" stroke="#041562" stroke-width="14"/>

  <!-- Cogwheel 8 Teeth (Gear) -->
  <g fill="#041562">
    <rect x="238" y="94" width="24" height="24" rx="3" />
    <rect x="238" y="382" width="24" height="24" rx="3" />
    <rect x="94" y="238" width="24" height="24" rx="3" />
    <rect x="382" y="238" width="24" height="24" rx="3" />
    
    <rect x="238" y="94" width="24" height="24" rx="3" transform="rotate(45 250 250)" />
    <rect x="238" y="382" width="24" height="24" rx="3" transform="rotate(45 250 250)" />
    <rect x="94" y="238" width="24" height="24" rx="3" transform="rotate(45 250 250)" />
    <rect x="382" y="238" width="24" height="24" rx="3" transform="rotate(45 250 250)" />
  </g>

  <!-- Central Pillar & Weighing Scale Structure -->
  <g stroke="#041562" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- Vertical Center Pillar -->
    <line x1="250" y1="120" x2="250" y2="380" stroke-width="12"/>
    
    <!-- Top Horizontal Scale Beam -->
    <line x1="140" y1="195" x2="360" y2="195" stroke-width="12"/>
    <line x1="145" y1="208" x2="355" y2="208" stroke-width="7"/>

    <!-- Left Scale Strings and Pan -->
    <polygon points="190,208 145,315 235,315" fill="#ffffff" fill-opacity="0.8"/>
    <line x1="190" y1="208" x2="145" y2="315" stroke-width="7"/>
    <line x1="190" y1="208" x2="235" y2="315" stroke-width="7"/>
    <line x1="190" y1="208" x2="190" y2="315" stroke-width="5"/>
    <path d="M 140 315 L 240 315 L 232 328 L 148 328 Z" fill="#041562" />

    <!-- Right Scale Strings and Pan -->
    <polygon points="310,208 265,315 355,315" fill="#ffffff" fill-opacity="0.8"/>
    <line x1="310" y1="208" x2="265" y2="315" stroke-width="7"/>
    <line x1="310" y1="208" x2="355" y2="315" stroke-width="7"/>
    <line x1="310" y1="208" x2="310" y2="315" stroke-width="5"/>
    <path d="M 260 315 L 360 315 L 352 328 L 268 328 Z" fill="#041562" />
  </g>

  <!-- Central Auspicious 'શ્રી' Symbol -->
  <text x="250" y="270" font-family="'Noto Sans Gujarati', 'Shruti', 'Gujarati MT', sans-serif" font-size="44" font-weight="bold" fill="#041562" text-anchor="middle" dominant-baseline="middle">
    શ્રી
  </text>
</svg>
`;

function renderBankLogos() {
  document.querySelectorAll('.bank-logo-placeholder').forEach(el => {
    el.innerHTML = TJCCB_LOGO_SVG;
  });
}

document.addEventListener('DOMContentLoaded', renderBankLogos);
