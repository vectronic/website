---
title: PyCharm for FreeCAD Macro Development
date: 2018-12-27
tags: 
- freecad
- tip

---

Beyond simple scripts, FreeCAD macro development really benefits from using a Python IDE. My Python IDE of choice is PyCharm.

I have been able to setup the same Python environment with FreeCAD and PyCharm using this great project
[https://github.com/FreeCAD/FreeCAD_Conda](https://github.com/FreeCAD/FreeCAD_Conda). 

This allows the same Python syntax and semantics to be applied (especially important when switching from Python 2 to 
Python 3). Unfortunately however, having code completion for FreeCAD modules still eludes me...

<!--more-->

## Installation

The following steps will get PyCharm and FreeCAD using the same Python installation.

NOTE: This was done on MacOS.

#### Install Miniconda

Download Miniconda installer from [https://conda.io/miniconda.html](https://conda.io/miniconda.html) and install it:

	bash Miniconda3-latest-MacOSX-x86_64.sh 
	echo ". /Users/vectronic/miniconda3/etc/profile.d/conda.sh" >> ~/.bash_profile

#### Create Conda Environment for FreeCAD

A Conda environment with FreeCAD can then be built with:

	conda create -n freecad-0.18-mac freecad

#### Use FreeCAD

To use the FreeCAD binary built with Conda it needs to be launched from the terminal:

	conda activate freecad-0.18-mac
	FreeCAD

Inside the FreeCAD Python console you can then check the Python environment using:

	import sys
	print('Python %s on %s' % (sys.version, sys.platform))

#### Use Conda Environment in PyCharm

The same Conda environment can then be configured within your PyCharm project via the following GUI path:


	PyCharm Preferences -> Project Interpreter -> Gear Icon -> Add -> Conda Environment -> Existing Environment

Choose the location of the Python executable from the Conda environment. In my case this is `~/miniconda3/envs/freecad-0.18-mac/bin/python`.

Now from the PyCharm Python console you should get the same results as previously with:

	import sys
	print('Python %s on %s' % (sys.version, sys.platform))

## Fail...

Despite the above and my endless attempts to configure dynamic library and module paths correctly, code completion just 
will not work. As far as I can tell it relates to an issue with how PyCharm handles processing of dynamic 
native libraries. 

I don't hold much hope of it being resolved:

[https://youtrack.jetbrains.com/issue/PY-20463](https://youtrack.jetbrains.com/issue/PY-20463)
