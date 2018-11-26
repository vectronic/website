---
title: Automatic Google Analytics Outbound Link Tracking
date: 2018-11-26
tags: 
- website
- tip

---

Google Analytics tracking of internal links within your own website is super-simple. 
Tracking outbound links is slightly more involved. [Google tells you how](https://support.google.com/analytics/answer/7478520?hl=en),
but this requires remembering to modify each outbound link's `onclick` event handler.

<!--more-->

The Google answer involves installing an `onclick` event handler similar to the following for each outbound link:

```html
<a href="http://www.example.com" onclick="trackOutboundLink('http://www.example.com'); return false;">Check out example.com</a>
``` 

When writing blog entries I didn't want to have to remember this everytime. My other requirement was a nice indicator 
for the reader when links are external. 

After suitable perusing of stackoverflow, and some trial and error, I submit to you the following code which handles a few hiccups
I encountered:

* local links might be specified as relative or absolute
* links might be defined with relative protocol i.e. `//www.example.com` 
* Google Analytics might be blocked or somehow disabled
* there might be an existing `onclick` handler defined
* there might be an existing `rel` attribute (see further below for it's use in styling)

So, onto the code:

Firstly, in the `<head>` element is the standard Google Analytics gtag.js setup:
  
```html
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-121478710-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-121478710-1', { 'anonymize_ip': true });
    </script>
```  
  
Nextly, at the end of the `<body>` tag is the automatic discovery, styling and `onclick` hijacking of the outbound links:

```html
<script>
    // Get all links on the page
    Array.from(document.getElementsByTagName('a'))

        // Filter for outbound links
        .filter(link =>
            ((link.href.indexOf(location.host) > 8 || link.href.indexOf(location.host) === -1) &&
            (link.href.match(/^http:/i) || link.href.match(/^https:/i)))
            || link.href.match(/^mailto:/i)
        )

        // For each external link
        .forEach(externalLink => {

            // Set rel attribute as external to ensure styling applied
            if (externalLink.rel && externalLink.rel !== '') {
                externalLink.rel += " external";
            }
            else {
                externalLink.rel = "external";
            }

            // Save old onclick handler (if it exists) and install new one
            let oldOnClick = externalLink.onclick;
            externalLink.onclick = function(event) {

                // Test if Google Analytics loaded
                if (window.ga && ga.create) {
    
                    // Send tracking event
                    gtag('event', 'click', {
                        'event_category': 'outbound',
                        'event_label': externalLink.href,
                        'transport_type': 'beacon',
                        'event_callback': function() {
                            document.location = externalLink.href;
                        }
                    });
                }
                else {
                    document.location = externalLink.href;
                }
    
                // Invoke replaced onclick handler if it existed
                if (oldOnClick) {
                    return oldOnClick.call(this, event);
                }
                return false;
            }
        });
</script>
```

P.S. For the styling of external links something like the following CSS-fu should work:

```css
a[*|rel~="external"]::after {
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    font-size: x-small;
    font-family: "Font Awesome 5 Free";
    content: "\f35d";
    padding-left: 0.5em;
}
```

