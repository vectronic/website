---
title: Multi-File Macro in FreeCAD
date: 2018-11-12
tags: 
- freecad
- tip

---

I've been developing a fairly complex macro for FreeCAD and wanted to split the code out into a module with separate 
files.

<!--more-->

I couldn't find instructions how to do this anywhere, but thankfully someone on the very helpful forum FreeCAD Forum 
gave me [this answer](https://forum.freecadweb.org/viewtopic.php?t=26982).

So now I have the following in my macro folder:

* `Legify` a sub-folder containing the Python module source files
* `legify-brick.FCMacro` a macro file importing the module as follows:

```
from Legify import Brick

Brick.Dialog()
```

This structure can be seen in the [macro repository on GitHub](https://github.com/vectronic/freecad-legify-macros)
       