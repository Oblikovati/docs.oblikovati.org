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
-- Create a parametric plate and extrude it.
local part = app.new_part("plate")
local sketch = part:new_sketch("XY")

local w = part:parameter("width", 60)   -- mm
local h = part:parameter("height", 40)  -- mm
sketch:rectangle(0, 0, w, h)

part:extrude(sketch, { distance = part:parameter("thickness", 5) })
part:save("plate.opd")
```

Fenced ` ```lua ` blocks are syntax-highlighted throughout these docs.
