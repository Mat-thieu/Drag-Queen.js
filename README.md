# Drag-queen.js
**This drag and drop script performs very well, the element follows the cursor almost instantly**

The intention was to create a full-fledged drag and drop library to compete with the (scarce amount of) other drag and drop libraries.

I found out it's a pretty tedious task to create a good drag and drop library so I'll be developing this over a very long period of time.

## Methods

Make an element draggable
```javascript
// Only works with ids at the moment.
dragqueen('elementId');
```

Restrict where an element can get moved to
```javascript
dragqueen('elementId').constraint('parentId');
```

If the dragged element lands on a dropzone element fire the dropped event (indev).
```javascript
// The second argument (defaults to false) sets the strict option, if set to true the entire element has to be within the dropzone
// If set to false/nothing only half of the element has to be within the dropzone
dragqueen('elementId').dropzone('dropzoneId', true);
```

## Bugs

Scrolling messes up some coordinates


### Finished alternatives
[jQuery UI](https://jqueryui.com/) (Requires jQuery as a dependency).

[Interact JS](http://interactjs.io/) (No dependencies but I personally had some trouble with this one, you might have more luck)

[Dragula](https://github.com/bevacqua/dragula) (No dependencies, looks good, well documented)