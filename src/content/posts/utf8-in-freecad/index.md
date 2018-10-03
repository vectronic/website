---
title: UTF-8 in FreeCAD
date: 2018-10-03
tags: 
- freecad
- tip
- python

---

I've been writing a Python macro for FreeCAD as a learning exercise on both subjects. I thought it would be nice to 
display the UTF-8 character &#x1f6c8; as a tooltip icon in a GUI form. A couple of hours 
later and I wanted to stop teaching myself Python and head back to Java...

<!--more-->

Here are the things to look out for when using Python 2.7:

- As per [PEP 263](https://www.python.org/dev/peps/pep-0263/) a Python source file needs to start with:

    ```python
    # coding: UTF-8
    ```
    
    **Note**: This isn't required in Python 3 as UTF-8 is the default encoding as per [PEP 3120](https://www.python.org/dev/peps/pep-3120/).

- UTF-8 [string literals](https://docs.python.org/2/reference/lexical_analysis.html#grammar-token-stringprefix) need 
to be prefixed with a `u` as follows:

    ```python
    u"My UTF-8 string 🛈"
    ```

- Make sure to use a unicode character which has a code point less than the 
[sys.maxunicode](https://docs.python.org/2/library/sys.html#sys.maxunicode) for your build of Python!
  This one was a real doozie to uncover. Here are some other devs [dealing with the same issue](https://stackoverflow.com/a/1446456)   
    
    **Note**: Again things change in Python 3.3 as per [PEP 393](https://www.python.org/dev/peps/pep-0393/).

    Within the FreeCAD 18.0 Python terminal:
    
    ```python
    Python 2.7.15 (default, Aug 22 2018, 16:41:11) 
    [GCC 4.2.1 Compatible Apple LLVM 8.0.0 (clang-800.0.42.1)] on darwin
    Type 'help', 'copyright', 'credits' or 'license' for more information.
    >>> App.setActiveDocument("Unnamed")
    >>> App.ActiveDocument=App.getDocument("Unnamed")
    >>> Gui.ActiveDocument=Gui.getDocument("Unnamed")
    >>> import sys
    >>> print sys.maxunicode
    65535
    >>> 
    ``` 
 
    Of course &#x1f6c8; has a decimal value of 128712 which is TOO BIG! So I've settled on using ℹ which has a decimal
    value of 8505.