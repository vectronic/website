---
title: A Successfully Rendered FreeCAD Assembly 
date: 2021-03-30
tags: 
- freecad
- legify  

---

I reached a milestone last weekend with a successful render of a brick assembly in FreeCAD.

{{< figure src="images/brick_assembly_render.png" width="50%">}}

<!--more-->

All brick models were created the legify macro code available at:

[https://github.com/vectronic/freecad-legify-macros](https://github.com/vectronic/freecad-legify-macros)

Thanks to some excellent FreeCAD developers I was able to create the assembly using 
[Assembly4 Workbench](https://github.com/Zolko-123/FreeCAD_Assembly4) and
then render using [Render Workbench](https://github.com/FreeCAD/FreeCAD-render).

I've created a [zip](models/bricks.zip) of all the model files and below are some highlight renders and tech draw workbench diagrams.

This was all done using the instructions I [posted previously](https://vectronic.io/posts/building-freecad-on-macos-big-sur/)
    for getting the latest version of FreeCAD on Big Sur
running with the [Render Workbench](https://github.com/FreeCAD/FreeCAD-render) (with rendering performed by [Cycles](https://www.cycles-renderer.org)).

For reference, the FreeCAD details used for this:
    
    OS: macOS 10.16
    Word size of OS: 64-bit
    Word size of FreeCAD: 64-bit
    Version: 0.20.24511 (Git)
    Build type: Release
    Branch: master
    Hash: efa19683aee7fdcf4efbdec81acb0c947ee46f9b
    Python version: 3.8.8
    Qt version: 5.12.5
    Coin version: 4.0.0
    OCC version: 7.4.0
    Locale: English/United Kingdom (en_GB)

{{< figure src="images/brick_assembly.png" link="images/brick_assembly.pdf" width="50%">}}

{{< figure src="images/brick_4x2_1.png" link="images/brick_4x2_1.pdf" width="50%">}}

{{< figure src="images/brick_4x2_2.png" link="images/brick_4x2_2.pdf" width="50%">}}

{{< figure src="images/brick_4x2_render.png" width="50%">}}

{{< figure src="images/technic_brick_4x1.png" link="images/technic_brick_4x1.pdf" width="50%">}}

{{< figure src="images/technic_brick_4x1_render.png" width="50%">}}

{{< figure src="images/brick_1x1_front_stud.png" link="images/brick_1x1_front_stud.pdf" width="50%">}}

{{< figure src="images/brick_1x1_front_stud_render.png" width="50%">}}
