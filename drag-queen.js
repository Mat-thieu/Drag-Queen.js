// Developed and maintained by Matthieu van den Bosch, availabe at https://github.com/Mat-thieu/Drag-Queen.js
// I've managed to make the dragging function efficient by separating the movement function from the coordinate calculator
// and using animation frames instead of intervals

var dragqueen = function(el){
    return new DgQn(el);
}

var DgQn = function(el){
    this.ele = document.getElementById(el);
    this.animFrame;
    this.dragElPos = {innerTop : 0, innerLeft : 0, pageLeft : 0, pageTop : 0};
    this.constraintOn;
    this.constraint;
    this.init();
}

DgQn.prototype = {
    init : function(){
        var self = this;
        var setCoordinates = function (e) {
            // Console log causes a ton of lag within these regularly fired functions, debug only
            // console.log('Setting coordinates');
            if(self.constraintOn){
                var constr = self.constraint;
                var thisPs = self.dragElPos;
                var top = e.pageY-self.dragElPos.innerTop;
                var left = e.pageX-self.dragElPos.innerLeft;
                if(constr.top+5 > top) top = constr.top;
                if(constr.left-5 > left) left = constr.left;
                if(constr.right-5 < left) left = constr.right;
                if(constr.bottom+5 < top) top = constr.bottom;
                self.dragElPos.pageTop = top;
                self.dragElPos.pageLeft = left;
            }
            else{
                self.dragElPos.pageTop = (e.pageY-self.dragElPos.innerTop);
                self.dragElPos.pageLeft = (e.pageX-self.dragElPos.innerLeft);
            }
            // console.log(self.dragElPos.pageTop, self.settings.constraint.top);
        }
        var handleMovement = function(){
            // Console log  causes a ton of lag within these regularly fired functions, debug only
            // console.log('Handling movement');
            self.ele.style.top = self.dragElPos.pageTop+'px';
            self.ele.style.left = self.dragElPos.pageLeft+'px';
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
        return this;
    },
    constraint : function(el){
        var self = this;
        this.constraintOn = true;
        var constraintElement = document.getElementById(el).getBoundingClientRect();
        this.constraint = {
            left : constraintElement.left,
            top : constraintElement.top,
            right : (constraintElement.left + constraintElement.width)-self.ele.offsetWidth,
            bottom : (constraintElement.top + constraintElement.height)-self.ele.offsetHeight
        };
        console.log(this.constraint);
        return this;
    }
}