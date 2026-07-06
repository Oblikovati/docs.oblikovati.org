---
sidebar_position: 2
title: Getting Started
---

# Getting Started

:::note
Placeholder page. Installation and first-part walkthroughs land here soon.
:::

## Scripting

Oblikovati is scriptable with **Lua**. Scripts drive the same document and feature model
the UI does, so anything you can model by hand you can automate:

```lua
oblikovati.documents.create{ type = "part", name = "plate" }
oblikovati.sketch.create{ plane = "XY" }
oblikovati.sketch.rectangle{ sketchIndex = 0, width = "40 mm", height = "30 mm" }
oblikovati.features.add{ kind = "extrude",
  args = { sketchIndex = 0, profileIndex = 0, distance = "10 mm" } }

print(string.format("volume = %.3f cm3", oblikovati.model.physicalProperties().volume))
```

See the [Scripting with Lua](./scripting.mdx) guide for the full introduction and examples.
