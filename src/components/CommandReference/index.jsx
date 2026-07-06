import React, { useMemo, useState } from 'react';
import manual from '@site/src/data/commands.json';
import styles from './styles.module.css';

// CommandReference renders every command the Command Window accepts, grouped by area with a
// live filter. Its data is generated from the app's built-in vocabulary (see cmd/command-dump
// in the Oblikovati repo) — the same vocabulary the GitHub-wiki command manual is built from —
// so it never drifts from what ships.

function matches(command, query) {
  if (!query) return true;
  const haystack = [command.canonical, command.summary, ...command.aliases].join(' ').toLowerCase();
  return haystack.includes(query);
}

function Aliases({ aliases }) {
  if (aliases.length === 0) return <span className={styles.muted}>—</span>;
  return aliases.map((a, i) => (
    <React.Fragment key={a}>
      {i > 0 && ' '}
      <kbd className={styles.kbd}>{a}</kbd>
    </React.Fragment>
  ));
}

function CommandTable({ group }) {
  return (
    <div className={styles.group}>
      <h3 id={group.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}>{group.title}</h3>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr><th>Command</th><th>Aliases</th><th>Description</th><th>Example</th></tr>
          </thead>
          <tbody>
            {group.commands.map((c) => (
              <tr key={c.action}>
                <td><kbd className={styles.kbd}>{c.canonical}</kbd></td>
                <td><Aliases aliases={c.aliases} /></td>
                <td>{c.summary}</td>
                <td>{c.example ? <code>{c.example}</code> : <span className={styles.muted}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CommandReference() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      manual.groups
        .map((g) => ({ ...g, commands: g.commands.filter((c) => matches(c, q)) }))
        .filter((g) => g.commands.length > 0),
    [q],
  );

  const total = useMemo(
    () => groups.reduce((n, g) => n + g.commands.length, 0),
    [groups],
  );

  return (
    <div className={styles.wrap}>
      <input
        type="search"
        className={styles.filter}
        placeholder="Filter commands…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Filter commands"
      />
      <p className={styles.count}>{total} command{total === 1 ? '' : 's'}</p>
      {groups.length === 0 ? (
        <p>No commands match “{query}”.</p>
      ) : (
        groups.map((g) => <CommandTable key={g.title} group={g} />)
      )}
    </div>
  );
}
