import { memo, useState } from 'react';
import { PauseIcon, PlayIcon } from '@phosphor-icons/react';
import './TransitBusScene.css';
export const TransitBusScene = memo(function TransitBusScene() {
  const [paused, setPaused] = useState(false);
  return (
    <figure
      className="bus-scene"
      data-paused={paused}
      aria-label="Animated illustration of a transit bus arriving at a stop"
    >
      <div className="bus-scene-top">
        <span>Transit Desk / motion study</span>
        <span className="bus-scene-mark">TD—01</span>
      </div>
      <svg className="bus-illustration" viewBox="0 0 720 470" fill="none" aria-hidden="true">
        <defs>
          <pattern id="bus-road-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M36 0H0V36" className="scene-grid" />
          </pattern>
        </defs>
        <path d="M30 322L225 217L700 272L499 405Z" className="road-plane" />
        <path d="M30 322L225 217L700 272L499 405Z" fill="url(#bus-road-grid)" />
        <path d="M32 348L495 430L699 313" className="curb-line" />
        <g className="road-marks">
          <path
            d="M64 333L140 346M177 352L253 365M290 371L366 384M403 390L479 403"
            className="lane-lines"
          />
        </g>
        <ellipse cx="366" cy="330" rx="238" ry="30" className="bus-shadow" />
        <g className="bus-body-motion">
          <path d="M112 163L226 101L606 145L492 207Z" className="bus-roof" />
          <path d="M112 163L492 207V332L112 288Z" className="bus-side" />
          <path d="M492 207L606 145V270L492 332Z" className="bus-front" />
          <path d="M126 185L476 225V269L126 229Z" className="bus-window" />
          <path d="M191 192V237M254 200V245M317 207V252M380 214V259" className="window-dividers" />
          <path
            d="M142 189L175 193M205 197L236 201M269 204L299 208M333 212L363 216"
            className="window-glints"
          />
          <path d="M506 224L590 178V239L506 284Z" className="bus-window" />
          <path d="M550 200V260" className="window-dividers" />
          <path d="M514 226L540 211M558 201L580 189" className="window-glints" />
          <path d="M507 209L590 164V178L507 223Z" className="bus-display" />
          <text transform="matrix(.88 -.48 0 1 517 215)" className="bus-destination">
            IN SERVICE
          </text>
          <path d="M112 251L492 295L606 233V247L492 309L112 265Z" className="bus-stripe" />
          <path d="M112 280L492 324L606 262V273L492 335L112 291Z" className="bus-trim" />
          <path d="M403 219L466 227V318L403 311Z" className="door-frame" />
          <g className="bus-door-left">
            <path d="M407 224L431 227V306L407 303Z" className="bus-door" />
            <path d="M411 230L427 232V265L411 263Z" className="bus-window" />
          </g>
          <g className="bus-door-right">
            <path d="M436 227L461 230V310L436 307Z" className="bus-door" />
            <path d="M440 233L457 235V269L440 267Z" className="bus-window" />
          </g>
          <path
            d="M504 295L520 286V294L504 303ZM577 255L592 247V255L577 263Z"
            className="bus-headlights"
          />
          <path d="M596 193L616 183V202L606 208" className="mirror-arm" />
          <path d="M134 249L155 251" className="bus-badge-line" />
          <text transform="matrix(1 .115 0 1 164 259)" className="bus-wordmark">
            TRANSIT / DESK
          </text>
          <text transform="matrix(1 .115 0 1 127 278)" className="bus-fleet-number">
            TD 001
          </text>
          {[193, 359].map((cx, index) => (
            <g key={cx} transform={`translate(${cx} ${index === 0 ? 287 : 306})`}>
              <ellipse rx="23" ry="30" className="bus-tire" />
              <ellipse rx="13" ry="20" className="bus-hub" />
              <g className="bus-wheel-spokes">
                <path d="M-9 0H9M0-15V15M-6-11L6 11M-6 11L6-11" />
              </g>
              <ellipse rx="4" ry="6" className="bus-tire" />
            </g>
          ))}
          <path d="M248 111L391 128L371 139L229 123Z" className="roof-hatch" />
          <path d="M266 115L378 128M253 120L365 133" className="roof-vents" />
        </g>
        <g className="bus-stop">
          <path d="M633 151V321" className="stop-pole" />
          <rect x="614" y="113" width="38" height="47" rx="3" className="stop-sign" />
          <path d="M623 125h20v16h-20zM627 146h12" className="stop-icon" />
          <circle cx="626" cy="143" r="2" className="stop-icon-fill" />
          <circle cx="640" cy="143" r="2" className="stop-icon-fill" />
        </g>
        <g className="bus-passenger">
          <circle cx="652" cy="269" r="6" className="passenger-fill" />
          <path
            d="M652 278v25m0-17-9 8m9-8 8 6m-8 11-7 12m7-12 8 11"
            className="passenger-stroke"
          />
        </g>
        <path d="M103 369L193 385M500 416L557 385" className="dimension-line" />
        <text x="105" y="399" className="scene-caption">
          A SMALL STUDY IN GETTING THERE.
        </text>
      </svg>
      <figcaption className="bus-scene-bottom">
        <span>Illustration · not a live vehicle</span>
        <button
          className="bus-motion-control"
          aria-label={paused ? 'Play bus animation' : 'Pause bus animation'}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <PlayIcon size={12} /> : <PauseIcon size={12} />}
          <span>{paused ? 'Play' : 'Pause'}</span>
        </button>
      </figcaption>
    </figure>
  );
});
