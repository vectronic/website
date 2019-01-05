---
title: FreeCAD Part Design Indices
date: 2019-01-05
tags: 
- freecad
- tip

---

There are several limitations when referencing items in FreeCAD via Python script. This includes needing to reference 
Part items such as edges and faces by name, whilst the names are liable (and likely) to change each time the model is modified. 

There are also a number of exposed native methods in the Python scripting layer which expect (rarely documented)
integer based constants. In this post I collate what I've learnt about these constants for future reference.   

<!--more-->

## Body Origin Axes and Planes

The *Origin* of a Part Design workbench *Body* called `myBody` can be acquired via:

```
origin = App.getDocument('Unnamed').getObject('myBody').Origin
```

The axes and planes for this *Origin* are available as `OriginFeatures` which can be identified as follows:

```
for feat in b.Origin.OriginFeatures:
	feat.Name
```

which outputs:

```
'X_Axis'
'Y_Axis'
'Z_Axis'
'XY_Plane'
'XZ_Plane'
'YZ_Plane'
```

Hence to get a reference to one of these you can iterate through `OriginFeatures` matching against the desired feature `Name`.

However if you want to live dangerously, you can rely on indexing into the array of `OriginFeatures` with these values:

```
ORIGIN_X_AXIS_INDEX = 0
ORIGIN_Y_AXIS_INDEX = 1
ORIGIN_Z_AXIS_INDEX = 2
ORIGIN_XY_PLANE_INDEX = 3
ORIGIN_XZ_PLANE_INDEX = 4
ORIGIN_YZ_PLANE_INDEX = 5
```

The risk here is that the native code layer `OriginFeatures` array order may change between FreeCAD releases. 

## Sketch Geometry and Constraints

### Geometry Item Indices

Special indices are defined as follows:

* Horizontal axis: -1
* Vertical axis: -2
* First external geometry construction item: -3. 

Hence, external geometry constructions items in a sketch are indexed from -3 descending! 

### Vertex Indices

The start vertex of a geometry line segment has index 1 and the end vertex has index 2. 

The centre vertex of a geometry circle is index 3.

### Examples

Creating an `DistanceX` constraint between a line segment start and the origin point:

```
SKETCH_GEOMETRY_VERTEX_START_INDEX = 1
SKETCH_GEOMETRY_ITEM_HORIZONTAL_AXIS_INDEX = -1

my_constraint = Sketcher.Constraint("DistanceX",
                                    segment_index, SKETCH_GEOMETRY_VERTEX_START_INDEX,
                                    SKETCH_GEOMETRY_ITEM_HORIZONTAL_AXIS_INDEX, SKETCH_GEOMETRY_VERTEX_START_INDEX, 
                                    distance)
```

Creating a `PointOnObject` constraint between a line segment start and an external item used as a geometry construction item:

```
SKETCH_GEOMETRY_VERTEX_START_INDEX = 1
SKETCH_GEOMETRY_FIRST_CONSTRUCTION_INDEX = -3

my_sketch.addExternal(my_datum_plane.Label, '')
my_constraint = Sketcher.Constraint("PointOnObject", 
                                    segment_index, SKETCH_GEOMETRY_VERTEX_START_INDEX, 
                                    SKETCH_GEOMETRY_FIRST_CONSTRUCTION_INDEX)
```

Creating a `DistanceY` constraint between the centre of a circle and the origin point:

```
SKETCH_GEOMETRY_VERTEX_START_INDEX = 1
SKETCH_GEOMETRY_VERTEX_CENTRE_INDEX = 3
SKETCH_GEOMETRY_ITEM_HORIZONTAL_AXIS_INDEX = -1

my_constraint = Sketcher.Constraint("DistanceY", 
                                    segment_index, SKETCH_GEOMETRY_VERTEX_CENTRE_INDEX, 
                                    SKETCH_GEOMETRY_ITEM_HORIZONTAL_AXIS_INDEX, SKETCH_GEOMETRY_VERTEX_START_INDEX, 
                                    distance)
```
