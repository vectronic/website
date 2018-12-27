---
title: Reloading FreeCAD Macro Code
date: 2018-12-27
tags: 
- freecad
- tip

---

I've been developing a fairly complex macro for FreeCAD and wanted to re-run it after making code changes without 
having to restart FreeCAD.

I found this [forum posting](https://forum.freecadweb.org/viewtopic.php?t=320) which gave me the answer. 

This post was discussing reloading code for workbenches and GUI Commands (which has some 
[caveats](https://forum.freecadweb.org/viewtopic.php?t=320#p2066)) and it also works perfectly for macros.

<!--more-->

I have a multi-file macro setup as discussed in [this post](https://vectronic.io/posts/multi-file-macro-in-freecad/). 
The entry point is a `.FCMacro` file with the following:

```
from Legify.Dialog import *
Dialog()
```

From within the FreeCAD Python console, the macro dialog can be displayed for the first time with:

```
>>> from Legify import Dialog
>>> Dialog.Dialog()
```

To reload and redisplay the dialog when code has been modified:

```
reload(Dialog); Dialog.Dialog()
```

If you need to update sub-modules, they need to be reloaded (as well as the parent module loading them) e.g.:

```
>>> from Legify import Brick; from Legify import Body
>>> reload(Body); reload(Brick); reload(Dialog); Dialog.Dialog()
```

NOTE: If you are using Python 3, you will first need to import the `reload` module:

```
from importlib import reload
```
