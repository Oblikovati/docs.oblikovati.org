// ISO 105-key keyboard geometry for the KeyboardMap SVG. Each key's `code` is the canonical
// token used by the binding catalog (single upper-case letters, "F5", "Escape", "Delete",
// "Enter", and the modifier tokens) so the renderer can match a shortcut's chord to a
// physical key. Widths are in key units; positions are baked here so the renderer only draws.
//
// The ISO signatures are present: the tall L-shaped Enter and the extra key left of the
// short left Shift.

export const KEY_U = 44; // key pitch in px
const KEY_SIZE = 40; // drawn key size (leaves a 4px gap)
const ROW_H = 44;
const PAD = 12;

// A row is a list of { label, code?, w? } placed left-to-right, or { gap } to advance x.
const funcRow = [
  { label: 'Esc', code: 'Escape' },
  { gap: 0.5 },
  { label: 'F1', code: 'F1' }, { label: 'F2', code: 'F2' }, { label: 'F3', code: 'F3' }, { label: 'F4', code: 'F4' },
  { gap: 0.5 },
  { label: 'F5', code: 'F5' }, { label: 'F6', code: 'F6' }, { label: 'F7', code: 'F7' }, { label: 'F8', code: 'F8' },
  { gap: 0.5 },
  { label: 'F9', code: 'F9' }, { label: 'F10', code: 'F10' }, { label: 'F11', code: 'F11' }, { label: 'F12', code: 'F12' },
];

const numberRow = [
  { label: '`' }, { label: '1' }, { label: '2' }, { label: '3' }, { label: '4' }, { label: '5' },
  { label: '6' }, { label: '7' }, { label: '8' }, { label: '9' }, { label: '0' }, { label: '-' }, { label: '=' },
  { label: 'Backspace', w: 2 },
];

const tabRow = [
  { label: 'Tab', w: 1.5 },
  { label: 'Q', code: 'Q' }, { label: 'W', code: 'W' }, { label: 'E', code: 'E' }, { label: 'R', code: 'R' },
  { label: 'T', code: 'T' }, { label: 'Y', code: 'Y' }, { label: 'U', code: 'U' }, { label: 'I', code: 'I' },
  { label: 'O', code: 'O' }, { label: 'P', code: 'P' }, { label: '[' }, { label: ']' },
];

const capsRow = [
  { label: 'Caps', w: 1.75 },
  { label: 'A', code: 'A' }, { label: 'S', code: 'S' }, { label: 'D', code: 'D' }, { label: 'F', code: 'F' },
  { label: 'G', code: 'G' }, { label: 'H', code: 'H' }, { label: 'J', code: 'J' }, { label: 'K', code: 'K' },
  { label: 'L', code: 'L' }, { label: ';' }, { label: "'" }, { label: '#' },
];

const shiftRow = [
  { label: 'Shift', code: 'ShiftLeft', w: 1.25 },
  { label: '\\' },
  { label: 'Z', code: 'Z' }, { label: 'X', code: 'X' }, { label: 'C', code: 'C' }, { label: 'V', code: 'V' },
  { label: 'B', code: 'B' }, { label: 'N', code: 'N' }, { label: 'M', code: 'M' }, { label: ',' }, { label: '.' }, { label: '/' },
  { label: 'Shift', code: 'ShiftRight', w: 2.75 },
];

const spaceRow = [
  { label: 'Ctrl', code: 'ControlLeft', w: 1.25 },
  { label: 'Win', w: 1.25 },
  { label: 'Alt', code: 'AltLeft', w: 1.25 },
  { label: '', code: 'Space', w: 6.25 },
  { label: 'AltGr', code: 'AltRight', w: 1.25 },
  { label: 'Win', w: 1.25 },
  { label: 'Menu', w: 1.25 },
  { label: 'Ctrl', code: 'ControlRight', w: 1.25 },
];

const mainRows = [funcRow, numberRow, tabRow, capsRow, shiftRow, spaceRow];

// The editing cluster (right of the main block) hosts Delete at the number/Tab-row level.
const CLUSTER_X = 15.5; // key units from the left edge
const clusterRows = [
  { rowIndex: 1, keys: [{ label: 'Ins' }, { label: 'Home' }, { label: 'PgUp' }] },
  { rowIndex: 2, keys: [{ label: 'Del', code: 'Delete' }, { label: 'End' }, { label: 'PgDn' }] },
];

// placeRow expands one row into positioned keys, dropping the caps row's would-be last cell
// so the L-shaped Enter's stem has room.
function placeRow(row, rowIndex, xStart) {
  let x = xStart;
  const out = [];
  for (const entry of row) {
    if (entry.gap) {
      x += entry.gap * KEY_U;
      continue;
    }
    const w = entry.w || 1;
    out.push({
      x, y: rowIndex * ROW_H, w: w * KEY_U - (KEY_U - KEY_SIZE),
      label: entry.label, code: entry.code,
    });
    x += w * KEY_U;
  }
  return out;
}

function buildKeys() {
  const keys = [];
  mainRows.forEach((row, i) => keys.push(...placeRow(row, i, 0)));
  clusterRows.forEach(({ rowIndex, keys: row }) => {
    let x = CLUSTER_X * KEY_U;
    row.forEach((entry) => {
      keys.push({ x, y: rowIndex * ROW_H, w: KEY_SIZE, label: entry.label, code: entry.code });
      x += KEY_U;
    });
  });
  return keys;
}

// buildEnter returns the L-shaped ISO Enter polygon (spanning the Tab and Caps rows) plus a
// label anchor. Its `code` is "Enter" so a Finish-Command binding highlights it.
function buildEnter() {
  const topY = 2 * ROW_H;
  const botY = 3 * ROW_H;
  const left = 13.5 * KEY_U + 2;
  const stemLeft = 13.75 * KEY_U + 2;
  const right = 15 * KEY_U - 2;
  const top = topY + 2;
  const mid = botY + 2;
  const bottom = botY + KEY_SIZE + 2;
  const points = [
    [left, top], [right, top], [right, bottom], [stemLeft, bottom],
    [stemLeft, mid], [left, mid],
  ];
  return {
    code: 'Enter',
    label: 'Enter',
    points: points.map((p) => p.join(',')).join(' '),
    labelX: (stemLeft + right) / 2,
    labelY: top + (mid - top) / 2,
  };
}

const keys = buildKeys();
const enter = buildEnter();
const width = (CLUSTER_X + 3) * KEY_U + PAD;
const height = mainRows.length * ROW_H + PAD;

export const keyboard = { keys, enter, width, height, keySize: KEY_SIZE };
