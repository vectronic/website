---
title: New FreeCAD Assembly Render and Animation 
date: 2021-10-21
tags: 
- freecad
- legify  

---

I have just completed the finishing touches on Technic pin support:

{{< figure src="images/brick_assembly_2_render.png" width="50%">}}

<!--more-->

There were a few potholes encountered on the journey and as always, they were solved with excellent community support:

* [Behaviour of Object.Tip with PartDesign LinearPattern](https://forum.freecadweb.org/viewtopic.php?f=22&t=61597)
* [Particular Assembly4 model fails to render correctly](https://github.com/FreeCAD/FreeCAD-render/issues/151)

As I now have pins available in my assemblies, I was able to try out the animation support within the
[Assembly4 Workbench](https://github.com/Zolko-123/FreeCAD_Assembly4):

{{< movie src="movies/brick_assembly_2_animation.mp4" poster="images/brick_assembly_2_animation.jpg" width="50%">}}


I will be pushing the Technic pins support and various improvements in the next couple of days to:

[https://github.com/vectronic/freecad-legify-macros](https://github.com/vectronic/freecad-legify-macros)
