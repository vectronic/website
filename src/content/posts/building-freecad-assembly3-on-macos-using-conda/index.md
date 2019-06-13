---
title: Building FreeCAD Assembly3 on macOS using Conda 
date: 2019-06-13
tags: 
- freecad
- tip

---

I have moved on from learning basic part design and scripting in FreeCAD and now want to tackle assemblies.
 
Following on from my previous post, 
[Building FreeCAD with 3DConnexion Support on macOS using Conda](/posts/building-freecad-with-3dconnexion-support-on-macos-using-conda),
this post presents similar instructions for building the very promising
[Assembly3 Workbench for FreeCAD](https://github.com/realthunder/FreeCAD_assembly3).
 
Again, I wanted to use the latest source AND use a [3DConnexion SpaceMouse](https://www.3dconnexion.co.uk/spacemouse_wireless/uk/) on a MacBook Pro.
Using Conda and the [Conda Forge feedstock for FreeCAD](https://github.com/conda-forge/freecad-feedstock) makes this a
scriptable, repeatable process. 

<!--more-->

#### Install 3DConnexion Drivers

Download and install the latest [driver for macOS](https://www.3dconnexion.co.uk/service/drivers.html).

#### Install miniconda

	curl -L -O https://repo.continuum.io/miniconda/Miniconda3-latest-MacOSX-x86_64.sh
	bash Miniconda3-latest-MacOSX-x86_64.sh -b
	rm Miniconda3-latest-MacOSX-x86_64.sh 
	echo ". ~/miniconda3/etc/profile.d/conda.sh" >> ~/.bash_profile

#### Install MacOSX10.9.sdk

	curl -L -O https://github.com/phracker/MacOSX-SDKs/releases/download/10.13/MacOSX10.9.sdk.tar.xz
	sudo tar -C /opt/ -xf MacOSX10.9.sdk.tar.xz 
	rm MacOSX10.9.sdk.tar.xz

#### Set SDK location for Conda

	echo "CONDA_BUILD_SYSROOT:" > ~/conda_build_config.yaml
	echo "   - /opt/MacOSX10.9.sdk  # [osx]" >> ~/conda_build_config.yaml

#### Link to SDK for Circle CI based support scripts

	mkdir -p /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/
	ln -s /opt/MacOSX10.9.sdk /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs

#### Prepare Conda environment

	conda create -n freecad_ass3 -y
	conda activate freecad_ass3
	conda config --add channels conda-forge
	conda install conda-build -y

#### Get FreeCAD feedstock

	git clone https://github.com/conda-forge/freecad-feedstock
	cd freecad-feedstock/

#### Point to the Assembly3 FreeCAD Fork
 
The FreeCAD feedstock recipe needs to be modified to use [realthunder's FreeCAD Fork](https://github.com/realthunder/FreeCAD).

Edit `recipe/meta.yaml` and edit the following:
 
* the `version` variable: `{% set version = "LinkStage3" %}`
* the `git_url` variable: `git_url: https://github.com/realthunder/FreeCAD.git`

#### Build FreeCAD

	conda build ./recipe -m ./.ci_support/osx_python3.7.yaml

#### Workaround failing tests

The build will finally fail with a message similar to:

    Tests failed for freecad-LinkStage3-py37h7748daf_1.tar.bz2 - moving package to /Users/vectronic/miniconda3/envs/freecad_ass3/conda-bld/broken

The failed tests don't seem to stop basic functionality working in FreeCAD and realthunder is planning to eventually fix them. 
In the meantime I ignore them as follows:

    mv ~/miniconda3/envs/freecad_ass3/conda-bld/broken/freecad-LinkStage3-py37h7748daf_1.tar.bz2  ~/miniconda3/envs/freecad_ass3/conda-bld/osx-64/
    conda index ~/miniconda3/envs/freecad_ass3/conda-bld

#### Install FreeCAD

	conda install -c file://${CONDA_PREFIX}/conda-bld/ freecad=LinkStage3 -y

#### Install and build the Assembly3 workbench and constraint solver

    conda install swig -y
    
    cd ~/miniconda3/envs/freecad_ass3/Ext/freecad
    git clone https://github.com/realthunder/FreeCAD_assembly3.git
    mv FreeCAD_assembly3 asm3
    cd asm3
    
    git checkout f66358d
    git submodule update --init slvs
    cd slvs
    git submodule update --init --recursive
    
    mkdir build
    cd build
    cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_PYTHON=1 ..
    make _slvs
    
    cd ../..
    touch py_slvs_mac/__init__.py
    cp slvs/build/src/swig/python/_slvs.so py_slvs_mac/
    cp slvs/build/src/swig/python/slvs.py py_slvs_mac/
    
    cd py_slvs_mac
    install_name_tool -id "_slvs.so" _slvs.so
    install_name_tool -add_rpath "@loader_path/../../../../lib/" _slvs.so
    
    install_name_tool -change "~/miniconda3/envs/freecad_assembly3_0.9.1/lib/libpython3.7m.dylib" "@rpath/Python" _slvs.so
    
**NOTE**: If the last command didn't work as the python library version has changed, run the following to see which library to relink to:

    otool -L _slvs.so

#### Use it!

	FreeCAD
