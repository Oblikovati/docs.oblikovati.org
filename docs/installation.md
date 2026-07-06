---
sidebar_position: 2
title: Installation
description: Download and install Oblikovati from the nightly builds.
---

# Installation

Oblikovati is under active development and is published as **nightly** builds. Download the
latest from the release page:

**➡️ [Oblikovati nightly release](https://github.com/Oblikovati/Oblikovati/releases/tag/nightly)**

:::caution Pre-release software
Nightly builds are updated frequently and are not yet stable. Expect rough edges, and update
often — the assets are replaced on each new build.
:::

## Desktop application

Download the asset for your platform from the nightly release and run it. File names include
the build version, so match by the suffix:

| Platform | Asset | Run it |
| --- | --- | --- |
| **Linux** (x86-64) | `oblikovati-head-*-linux-amd64.AppImage` | `chmod +x` the file, then run it |
| **Windows** (x86-64) | `oblikovati-head-*-windows-amd64.zip` | Unzip, then run the executable |
| **macOS** (universal) | `Oblikovati-*-macos-universal.zip` | Unzip, then open `Oblikovati.app` |

## Command-line tool

`oblikovati-cli` is the headless entry point — it creates and inspects documents and runs
[Lua scripts](./scripting.mdx) without a window. Download the build for your platform and
architecture:

| Platform | Assets |
| --- | --- |
| **Linux** | `oblikovati-cli-*-linux-amd64`, `oblikovati-cli-*-linux-arm64` |
| **macOS** | `oblikovati-cli-*-darwin-amd64`, `oblikovati-cli-*-darwin-arm64` |
| **Windows** | `oblikovati-cli-*-windows-amd64.exe`, `oblikovati-cli-*-windows-arm64.exe` |

On Linux and macOS, make it executable and run it:

```bash
chmod +x oblikovati-cli-*-linux-amd64
./oblikovati-cli-*-linux-amd64 --help
```

## Verifying your download

Every release includes a `checksums.txt`. Verify a download's integrity with:

```bash
sha256sum --check --ignore-missing checksums.txt
```

## Next steps

- **[Scripting with Lua](./scripting.mdx)** — automate modeling from the CLI or the GUI.
- **[Keyboard Shortcuts](./reference/keyboard-shortcuts.mdx)** and
  **[Commands](./reference/commands.mdx)** — drive the application quickly.
