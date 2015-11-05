var dragqueen = function(el){
    return new Dggy(el);
}

var Dggy = function(el){
    this.ele = document.querySelectorAll(el)[0];
    this.animFrame;
    this.dragElOs = {top : 0, left : 0, posX : 0, posY : 0};
    this.init();
}

Dggy.prototype = {
    init : function(){
        var self = this;
        var setCoordinates = function (e) {
            self.dragElOs.posY = (e.pageY-self.dragElOs.top)+'px';
            self.dragElOs.posX = (e.pageX-self.dragElOs.left)+'px';
        }
        var handleMovement = function(){
            self.ele.style.top = self.dragElOs.posY;
            self.ele.style.left = self.dragElOs.posX;
            self.animFrame = requestAnimationFrame(handleMovement);
        }
        self.ele.addEventListener('mousedown', function(e){
            self.ele.style.position = "absolute";
            var viewportOffset = self.ele.getBoundingClientRect();
            self.dragElOs.left = (e.pageX - viewportOffset.left);
            self.dragElOs.top = (e.pageY - viewportOffset.top);
            console.log('offsets', [e.pageX+' - '+viewportOffset.left, e.pageY+' - '+viewportOffset.top]);
            handleMovement();
            window.addEventListener('mousemove', setCoordinates, false);
            window.addEventListener('mouseup', function(){
                window.removeEventListener('mousemove', setCoordinates, false);
                cancelAnimationFrame(self.animFrame);
            })
        });
    }
}