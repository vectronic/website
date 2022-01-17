---
title: 3D Printed Brick Assemblies 
date: 2022-01-17
tags: 
- freecad
- legify
- hardware

---

I ordered some 3D prints of bricks designed with the legify macro code available at:

[https://github.com/vectronic/freecad-legify-macros](https://github.com/vectronic/freecad-legify-macros)

Presented below are two assemblies as rendered within FreeCAD and assembled in real life.

<!--more-->

Playing around with the physical prints it is obvious that they don't 'stick' together anywhere near as well as the real thing.

Taking various measurements it seems that the quoted print accuracy of ±0.3% (min: ±0.15mm) really does come into play.
Given the [various dimensions used in the models](https://github.com/vectronic/freecad-legify-macros/blob/master/Legify/Common.py#L23-L73)
it is obvious that a minimum error of 0.15mm will have a significant impact on some of the features.

It looks like I will need to start exploring CNC machining sooner than expected if I want to achieve accuracy around ±0.05mm.

I might also need a better setup for macro photography!

{{< figure src="images/brick_assembly_1_render.png" link="images/brick_assembly_1_render.png" width="50%">}}

{{< figure src="images/brick_assembly_1_3d_print.jpg" link="images/brick_assembly_1_3d_print.jpg" width="50%">}}

{{< figure src="images/brick_assembly_2_render.png" link="images/brick_assembly_2_render.png" width="50%">}}

{{< figure src="images/brick_assembly_2_3d_print.jpg" link="images/brick_assembly_2_3d_print.jpg" width="50%">}}
