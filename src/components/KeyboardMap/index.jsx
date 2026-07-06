import React from 'react';
import { keyboard } from './isoLayout';
import data from '@site/src/data/keybindings.json';
import styles from './styles.module.css';

// KeyboardMap renders the app's shipped keyboard bindings as an ISO keyboard SVG with the
// bound keys highlighted, plus grouped reference tables. Its data is generated from the app
// (see cmd/keymap-dump in the Oblikovati repo) so it never drifts from what ships.

const MOD_OF = {
  ShiftLeft: 'shift', ShiftRight: 'shift',
  ControlLeft: 'ctrl', ControlRight: 'ctrl',
  AltLeft: 'alt', AltRight: 'alt',
};

const GROUP_ORDER = ['File', 'Sketch', 'Feature', 'View', 'Edit', 'Tool', 'Other'];

// keybindings.json is keyboard-only (typed command aliases are documented on the Commands
// page); every entry here is a pressable chord.
const keyboardShortcuts = data.shortcuts;

// baseKeyMap maps a physical key code to the shortcut(s) whose chord ends on that key.
const baseKeyMap = keyboardShortcuts.reduce((map, s) => {
  const arr = map.get(s.chord.key) || [];
  arr.push(s);
  map.set(s.chord.key, arr);
  return map;
}, new Map());

// modsUsed is the set of modifiers that any bound chord holds, so their keys light up too.
const modsUsed = new Set();
keyboardShortcuts.forEach((s) => {
  if (s.chord.ctrl) modsUsed.add('ctrl');
  if (s.chord.alt) modsUsed.add('alt');
  if (s.chord.shift) modsUsed.add('shift');
});

function keyState(code) {
  if (!code) return 'plain';
  if (baseKeyMap.has(code)) return 'base';
  const mod = MOD_OF[code];
  if (mod && modsUsed.has(mod)) return 'mod';
  return 'plain';
}

function tooltip(code) {
  const bound = baseKeyMap.get(code);
  if (bound) return bound.map((s) => `${s.chordText} — ${s.displayName}`).join('\n');
  const mod = MOD_OF[code];
  if (mod && modsUsed.has(mod)) return `Modifier used by ${mod === 'ctrl' ? 'Ctrl' : mod === 'shift' ? 'Shift' : 'Alt'} shortcuts`;
  return '';
}

function classForState(state) {
  if (state === 'base') return `${styles.key} ${styles.keyBase}`;
  if (state === 'mod') return `${styles.key} ${styles.keyMod}`;
  return styles.key;
}

function KeyCap({ k }) {
  const state = keyState(k.code);
  return (
    <g>
      <rect x={k.x} y={k.y} width={k.w} height={keyboard.keySize} rx={5} className={classForState(state)}>
        <title>{tooltip(k.code)}</title>
      </rect>
      <text x={k.x + k.w / 2} y={k.y + keyboard.keySize / 2} className={styles.keyLabel}>
        {k.label}
      </text>
    </g>
  );
}

function EnterCap() {
  const e = keyboard.enter;
  const state = keyState(e.code);
  return (
    <g>
      <polygon points={e.points} className={classForState(state)}>
        <title>{tooltip(e.code)}</title>
      </polygon>
      <text x={e.labelX} y={e.labelY} className={styles.keyLabel}>{e.label}</text>
    </g>
  );
}

function KeyboardSvg() {
  return (
    <div className={styles.svgWrap}>
      <svg viewBox={`0 0 ${keyboard.width} ${keyboard.height}`} className={styles.svg} role="img"
        aria-label="ISO keyboard with Oblikovati shortcuts highlighted">
        {keyboard.keys.map((k, i) => <KeyCap key={i} k={k} />)}
        <EnterCap />
      </svg>
    </div>
  );
}

function Legend() {
  return (
    <div className={styles.legend}>
      <span className={styles.legendItem}>
        <span className={`${styles.swatch} ${styles.swatchBase}`} /> Command key
      </span>
      <span className={styles.legendItem}>
        <span className={`${styles.swatch} ${styles.swatchMod}`} /> Modifier
      </span>
    </div>
  );
}

function Chord({ text }) {
  return text.split('+').map((t, i) => (
    <React.Fragment key={i}>
      {i > 0 && <span className={styles.plus}>+</span>}
      <kbd className={styles.kbd}>{t}</kbd>
    </React.Fragment>
  ));
}

function groupOrder(a, b) {
  return GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b);
}

function KeyboardTables() {
  const groups = [...new Set(keyboardShortcuts.map((s) => s.group))].sort(groupOrder);
  return groups.map((group) => {
    const rows = keyboardShortcuts
      .filter((s) => s.group === group)
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
    return (
      <div key={group} className={styles.group}>
        <h3>{group}</h3>
        <table>
          <thead><tr><th>Shortcut</th><th>Command</th></tr></thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.actionId}>
                <td><Chord text={s.chordText} /></td>
                <td>{s.displayName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
}

export default function KeyboardMap() {
  return (
    <div className={styles.wrap}>
      <KeyboardSvg />
      <Legend />
      <KeyboardTables />
    </div>
  );
}
