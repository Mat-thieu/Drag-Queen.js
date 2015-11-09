# Drag-queen.js
**Small and efficient dragging script, developing this very very slowly.**

The intention was to create a full-fledged drag and drop library to compete with the (scarce amount of) other drag and drop libraries.

I found out it's a pretty tedious task to create a good drag and drop library so I'll be developing this over a very long period of time.

### Finished alternatives
[jQuery UI](https://jqueryui.com/) (Requires jQuery as a dependency).

[Interact JS](http://interactjs.io/) (No dependencies but I personally had some trouble with this one, you might have more luck)

[Dragula](https://github.com/bevacqua/dragula) (No dependencies, looks good, well documented)


Make an element draggable
```javascript
// Only works with ids at the moment.
dragqueen('elementId');
```

Restrict where an element can get moved to
```javascript
dragqueen('elementId').constraint('parentId')
```
