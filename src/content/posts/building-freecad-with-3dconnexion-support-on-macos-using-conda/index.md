---
title: Building FreeCAD with 3DConnexion Support on macOS using Conda 
date: 2019-05-04
tags: 
- freecad
- tip

---

Presented here is a somewhat terse step-by-step guide to building FreeCAD from source using Conda and 
the [Conda Forge feedstock for FreeCAD](https://github.com/conda-forge/freecad-feedstock).

I need to do this to ensure I can run the latest FreeCAD code AND use a 
[3DConnexion SpaceMouse](https://www.3dconnexion.co.uk/spacemouse_wireless/uk/) on a MacBook Pro.

<!--more-->

The steps below were compiled through trial and error, much hair-pulling and extraction of useful information from
[here](https://github.com/FreeCAD/FreeCAD_Conda/blob/master/build.md#osx),
[here](https://forum.freecadweb.org/viewtopic.php?style=4&f=3&t=29766&start=50) and
[here](https://forum.freecadweb.org/viewtopic.php?f=4&t=34608&p=305702#p305702).

#### Install 3DConnexion Drivers

Download and install the latest [driver for macOS](https://www.3dconnexion.co.uk/service/drivers.html).

#### Install miniconda

	curl -L -O https://repo.continuum.io/miniconda/Miniconda3-latest-MacOSX-x86_64.sh
	bash Miniconda3-latest-MacOSX-x86_64.sh -b
	rm Miniconda3-latest-MacOSX-x86_64.sh 
	echo ". /Users/vectronic/miniconda3/etc/profile.d/conda.sh" >> ~/.bash_profile

#### Install MacOSX10.9.sdk

	curl -L -O https://github.com/phracker/MacOSX-SDKs/releases/download/10.13/MacOSX10.9.sdk.tar.xz
	sudo tar -C /opt/ -xf MacOSX10.9.sdk.tar.xz 
	rm MacOSX10.9.sdk.tar.xz

#### Set SDK location for Conda

	echo "CONDA_BUILD_SYSROOT:" > ~/conda_build_config.yaml
	echo "   - /opt/MacOSX10.9.sdk  # [osx]" >> ~/conda_build_config.yaml

#### Link to SDK for Circle CI based support scripts

	mkdir -p /Applications/Xcode-9.0.1.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/
	ln -s /opt/MacOSX10.9.sdk /Applications/Xcode-9.0.1.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/

#### Prepare Conda environment

	conda create -n freecad_0_18_1 -y
	conda activate freecad_0_18_1
	conda config --add channels conda-forge
	conda install conda-build -y

#### Get FreeCAD feedstock

	git clone https://github.com/conda-forge/freecad-feedstock
	cd freecad-feedstock/

#### Build FreeCAD

	conda build ./recipe -m ./.ci_support/osx_python3.7.yaml

**NOTE**: I found it wasn't necessary to add `-D FREECAD_USE_3DCONNEXION=ON` to `recipe/build.sh` as the build seemed to pick up the 
presence of the installed driver and use it by default.

**NOTE**: To modify the version of FreeCAD which is build, edit `recipe/meta.yaml` and change the `version` variable e.g.:

    {% set version = "master" %}

#### Install FreeCAD

	conda install -c file://${CONDA_PREFIX}/conda-bld/ freecad=0.18.1 -y

**NOTE**: `conda install --use-local freecad=0.18.1` didn't seem to use the locally build package - possibly related to [this reported issue](https://github.com/conda/conda/issues/7024).

#### Use it!

	FreeCAD
