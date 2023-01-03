---
title: Nostalgia - NetToaster
date: 2023-01-03
tags: 
- nostalgia
- embedded

---

I've held onto the hard copy of my Electrical Engineering Thesis for around 25 years. It recently suffered water damage so I decided
it was time to immortalise it on the world wide web.

I say 'world wide web' in preference to modern terminology such as 'net', 'web' etc. in homage to the title of the thesis:

*A TOASTER WITH A WORLD WIDE WEB INTERFACE*.

Here is a photo of the 'completed' project:

{{< figure src="images/photo-overview.jpg" link="images/photo-overview.jpg" width="50%">}}

<!--more-->

and a photo of the electronics board:

{{< figure src="images/photo-board.jpg" link="images/photo-board.jpg" width="50%">}}

I say 'completed' as I suffered a major setback about 6 weeks before the due date when I fried the ethernet controller chip.
The lead time was over 3 months and so I set myself on a new journey of implementing network connectivity over [SLIP](https://en.wikipedia.org/wiki/Serial_Line_Internet_Protocol).

This ate into my development time and consequently I only managed to get to the point where I had a multi-tasking OS running two processes: one outputting 'S' and one outputting 'O' over serial. Get it...? *SOS...*

Still, designing and building a compute board to interface with the [Hitachi SH1](https://en.wikipedia.org/wiki/SuperH) processor
and porting [XINU](https://xinu.cs.purdue.edu) to run on it was not easy - and I'm still proud of my achievement to this day.

Click on the cover for the full thesis:

{{< figure src="images/cover.jpg" link="files/thesis.pdf" width="50%">}}

And click on the floppy for the code:

{{< figure src="images/floppy.jpg" link="files/toast.zip" width="50%">}}
