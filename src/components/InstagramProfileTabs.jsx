import React, { useState } from 'react';

const INACTIVE = '#737373';
const ACTIVE = '#f5f5f5';
const STROKE = 1.5;

function TabIcon({ children, active, label, onClick }) {
  return (
    <button
      type="button"
      className={`ig-profile-tab${active ? ' ig-profile-tab--active' : ''}`}
      aria-label={label}
      aria-selected={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/** Publicações — grade 3×3 */
export function IconPostsGrid({ color = INACTIVE, size = 24, filled = false }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={3 + col * 6.5}
              y={3 + row * 6.5}
              width="5.5"
              height="5.5"
              fill={color}
            />
          )),
        )}
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" stroke={color} strokeWidth={STROKE} />
      <line x1="9.015" y1="3" x2="9.015" y2="21" stroke={color} strokeWidth={STROKE} />
      <line x1="14.985" y1="3" x2="14.985" y2="21" stroke={color} strokeWidth={STROKE} />
      <line x1="3" y1="9.015" x2="21" y2="9.015" stroke={color} strokeWidth={STROKE} />
      <line x1="3" y1="14.985" x2="21" y2="14.985" stroke={color} strokeWidth={STROKE} />
    </svg>
  );
}

/** Guardados (Saved) — marcador */
export function IconSaved({ color = INACTIVE, size = 24, filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.75 3.75h10.5v16.128l-5.25-2.928-5.25 2.928V3.75Z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
    </svg>
  );
}

/** Reposts — loop retangular com setas (estilo Instagram) */
export function IconReposts({ color = INACTIVE, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5.25 9.75h9.19l-2.03-2.03M14.44 9.75l2.03 2.03M16.47 11.78v3.94M16.47 15.72H7.28l2.03 2.03M9.31 15.72l-2.03-2.03M7.28 13.69V9.75"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Marcações (Tagged) — pessoa dentro do quadrado arredondado (Instagram) */
export function IconTagged({ color = INACTIVE, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="3"
        stroke={color}
        strokeWidth={STROKE}
      />
      <circle
        cx="12"
        cy="10.75"
        r="2.5"
        stroke={color}
        strokeWidth={STROKE}
      />
      <path
        d="M8.25 15.5c.94 1.19 2.41 1.95 3.75 1.95s2.81-.76 3.75-1.95"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
    </svg>
  );
}

const TABS = [
  { id: 'posts', label: 'Publicações' },
  { id: 'saved', label: 'Guardados' },
  { id: 'reposts', label: 'Reposts' },
  { id: 'tagged', label: 'Marcações' },
];

function renderTabIcon(id, color, isActive) {
  switch (id) {
    case 'posts':
      return <IconPostsGrid color={color} filled={isActive} />;
    case 'saved':
      return <IconSaved color={color} filled={isActive} />;
    case 'reposts':
      return <IconReposts color={color} />;
    case 'tagged':
      return <IconTagged color={color} />;
    default:
      return null;
  }
}

export default function InstagramProfileTabs({
  defaultTab = 'posts',
  onTabChange,
}) {
  const [active, setActive] = useState(defaultTab);

  const select = (id) => {
    setActive(id);
    onTabChange?.(id);
  };

  return (
    <div className="ig-profile-tabs" role="tablist">
      {TABS.map(({ id, label }) => {
        const isActive = active === id;
        const color = isActive ? ACTIVE : INACTIVE;
        return (
          <TabIcon
            key={id}
            active={isActive}
            label={label}
            onClick={() => select(id)}
          >
            {renderTabIcon(id, color, isActive)}
          </TabIcon>
        );
      })}
    </div>
  );
}
