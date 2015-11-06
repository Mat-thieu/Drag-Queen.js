// Developed and maintained by Matthieu van den Bosch, availabe at https://github.com/Mat-thieu/Drag-Queen.js
// I've managed to make the dragging function efficient by separating the movement function from the coordinate calculator
// and using animation frames instead of intervals

var dragqueen = function(el){
    return new DgQn(el);
}

var DgQn = function(el){
    this.ele = document.querySelectorAll(el)[0];
    this.animFrame;
    this.dragElPos = {innerTop : 0, innerLeft : 0, pageLeft : 0, pageRight : 0};
    this.init();
}

DgQn.prototype = {
    init : function(){
        var self = this;
        var setCoordinates = function (e) {
            // Console log causes a ton of lag within these regularly fired functions, debug only
            // console.log('Setting coordinates');
            self.dragElPos.pageRight = (e.pageY-self.dragElPos.innerTop)+'px';
            self.dragElPos.pageLeft = (e.pageX-self.dragElPos.innerLeft)+'px';
        }
        var handleMovement = function(){
            // Console log  causes a ton of lag within these regularly fired functions, debug only
            // console.log('Handling movement');
            self.ele.style.top = self.dragElPos.pageRight;
            self.ele.style.left = self.dragElPos.pageLeft;
            self.animFrame = requestAnimationFrame(handleMovement);
        }
        self.ele.addEventListener('mousedown', function(e){
            self.ele.style.position = "absolute";
            var viewportOffset = self.ele.getBoundingClientRect();
            self.dragElPos.innerLeft = (e.pageX - viewportOffset.left);
            self.dragElPos.innerTop = (e.pageY - viewportOffset.top);
            // console.log('debug offsets', [e.pageX+' - '+viewportOffset.left, e.pageY+' - '+viewportOffset.top]);
            // Initiate movement loop
            handleMovement();
            // Adding events to the window seem to work a lot smoother than adding it to the element or document
            window.addEventListener('mousemove', setCoordinates, false);
            window.addEventListener('mouseup', function(){
                window.removeEventListener('mousemove', setCoordinates, false);
                cancelAnimationFrame(self.animFrame);
            })
        });
    }
}