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
    this.dropzoneOn;
    this.dropzone;
    this.events = {};
    this.init();
}

DgQn.prototype = {
    init : function(){
        var self = this;
        var throttle = 0;
        var setCoordinates = function (e) {
            throttle++;
            if(!(throttle % 2) || throttle == 1){
                // Console log causes a ton of lag within these regularly fired functions, debug only
                // console.log('Setting coordinates');
                if(self.constraintOn){
                    var constr = self.constraint;
                    var thisPs = self.dragElPos;
                    var top = e.pageY-self.dragElPos.innerTop;
                    var left = e.pageX-self.dragElPos.innerLeft;

                    // Handle top and bottom
                    if(constr.top+5 > top) top = constr.top;
                    else if(constr.bottom+5 < top) top = constr.bottom;

                    // Handle left and right
                    if(constr.left-5 > left) left = constr.left;
                    else if(constr.right-5 < left) left = constr.right;

                    self.dragElPos.pageTop = top;
                    self.dragElPos.pageLeft = left;
                }
                else{
                    self.dragElPos.pageTop = (e.pageY-self.dragElPos.innerTop);
                    self.dragElPos.pageLeft = (e.pageX-self.dragElPos.innerLeft);
                }
            }
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
            // Reset throttle variable
            throttle = 0;
            // Adding events to the window seem to work a lot smoother than adding it to the element or document
            window.addEventListener('mousemove', setCoordinates, false);
            window.addEventListener('mouseup', function _funcHook(){
                cancelAnimationFrame(self.animFrame);
                window.removeEventListener('mouseup', _funcHook);
                window.removeEventListener('mousemove', setCoordinates, false);
                if(self.dropzoneOn){
                    var drZone = self.dropzone;
                    var thisPs = self.dragElPos;
                    var top = self.dragElPos.pageTop;
                    var left = self.dragElPos.pageLeft;
                    if(drZone.top+5 < top && drZone.bottom+5 > top && drZone.left-5 < left && drZone.right-5 > left){
                        if('drop' in self.events)
                            self.events.drop();
                    }
                }
            })
        });
        return this;
    },
    // EVERYTHING BELOW THIS LINE HAS TO BECOME D.R.Y.
    constraint : function(el){
        var self = this;
        this.constraintOn = true;
        var setConstraints = function(){
            console.log('Calculating constraints');
            var constraintElement = document.getElementById(el).getBoundingClientRect();
            self.constraint = {
                left : constraintElement.left,
                top : constraintElement.top,
                right : (constraintElement.left + constraintElement.width)-self.ele.offsetWidth,
                bottom : (constraintElement.top + constraintElement.height)-self.ele.offsetHeight
            };
        }
        setConstraints();

        var rsEndTimer;
        window.addEventListener('resize', function(){
            clearTimeout(rsEndTimer);
            rsEndTimer = setTimeout(function() {
                setConstraints();
            }, 200);
        }, false);

        window.onfocus = function(){
            setConstraints();
        }

        return this;
    },
    dropzone : function(el, strict){
        var self = this;
        this.dropzoneOn = true;
        var setDropzone = function(){
            console.log('Calculating dropzone pos');
            var dropzoneElement = document.getElementById(el).getBoundingClientRect();
            if(strict){
                self.dropzone = {
                    left : dropzoneElement.left,
                    top : dropzoneElement.top,
                    right : ((dropzoneElement.left + dropzoneElement.width)-self.ele.offsetWidth),
                    bottom : ((dropzoneElement.top + dropzoneElement.height)-self.ele.offsetHeight)
                };
            }
            else{
                self.dropzone = {
                    left : dropzoneElement.left-(self.ele.offsetWidth/2),
                    top : dropzoneElement.top-(self.ele.offsetHeight/2),
                    right : ((dropzoneElement.left + dropzoneElement.width)-self.ele.offsetWidth)+(self.ele.offsetWidth/2),
                    bottom : ((dropzoneElement.top + dropzoneElement.height)-self.ele.offsetHeight)+(self.ele.offsetWidth/2)
                };
            }
        }
        setDropzone();

        var rsEndTimer;
        window.addEventListener('resize', function(){
            clearTimeout(rsEndTimer);
            rsEndTimer = setTimeout(function() {
                setDropzone();
            }, 200);
        }, false);

        window.onfocus = function(){
            setDropzone();
        }

        console.log(this.dropzone);

        return this;
    },
    on : function(events){
        for(key in events){
            if(!(key in this.events))
                this.events[key] = events[key];
            else
                console.error('Attempting to assign duplicate event', key);
        }
    }
}