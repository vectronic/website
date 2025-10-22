---
title: First Real Project on the Pocket NC
date: 2025-10-21
tags: 
- cnc

---

The first "real world" project on the Pocket NC was to create 2 replacement Oilite bushes for the mains powered Synchron motor in a 1940's [Kit Cat Clock](https://kit-cat.com/pages/history).

{{< figure src="images/closeup.jpg" width="50%">}}

<!--more-->

I'm much more familiar with Fusion 360 and was able to generate a program with 9 operations using 4 tools:

{{< figure src="images/toolpaths.jpg" width="75%">}}

I used the [Vers Wireless Touch Probe](https://vers.ge/en/blog/user-guides/wlr-v8) to setup the work coordinates, but just did the touch off manually. I also used it connected to the receiver instead of wirelessly as the receiver is yet to be integrated into the Pocket NC tool length sensor. So the next step is definitely to integrate with the hardware and automate within GCode.

---

Anyway, less words, more pictures!

Here is a video showing an overview of the setup:

* iPad for local control
* computer for more detailed configuration, Fusion work and management of the machine view videos

{{< youtube videoId="bK00T2wEW_w">}}

Here is a video showing a close up of the final parting off step:

{{< youtube videoId="_Q8DdQ0NQlQ">}}

Closeups of the results (new on the left, original on the right):

{{< figure src="images/inner.jpg" width="75%">}}

{{< figure src="images/outer.jpg" width="75%">}}

And for those so inclined, here is a full length video of the operation from within the enclosure:

{{< youtube videoId="RvZ1_O5oE18">}}

If you got past the glitchy, out of focus moments, awkward manual tool changes and endless B axis unwind, 
you might have enjoyed the ability to simply snap off the workpiece as it was left with a minimal 0.1mm ring around
the central hole connecting it to the stock.

As observed before, I think I need to upgrade the camera technology here to improve depth of field,
vibration handling and enclosure open/close remote control.

I also really need to understand how to use the `M999` GCode to avoid that painfully long B-Axis unwind at the end: https://pentamachine.atlassian.net/wiki/spaces/KCUR/pages/1713471506/Rotary+Unwind

