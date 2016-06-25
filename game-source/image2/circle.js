var gCircleId = 0;

function Circle()
{
    this.visible = true;

    this.x = 0;
    this.y = 0;
    this.opacity = 100;
    this.growth = 3;
    this.sizeMax = 100;
    this.size = 30;
    this.elm = document.getElementById("circle" + gCircleId++);
    this.source = "circle-white";

    this.visible_cache = null;
}

Circle.prototype.animate = function()
{
    this.size += this.growth;
    this.opacity -= 8;

    if (this.size >= this.sizeMax) {
        this.size = this.sizeMax;
        this.visible = false;
    }
    else if (this.size <= 0) {
        this.size = 0;
        this.visible = false;
    }

    if (this.opacity <= 0) {
        this.visible = false;
        this.opacity = 0;
    }
}

Circle.prototype.render = function()
{
    if (this.visible) {
        this.elm.style.MozOpacity = this.opacity / 100;
        this.elm.style.filter = "alpha(opacity= " + this.opacity + ")";
        this.elm.style.left = Math.floor(this.x - this.size / 2) + "px";
        this.elm.style.top = Math.floor(this.y - this.size / 2) + "px";
        this.elm.style.width = Math.floor(this.size) + "px";
        this.elm.style.height = Math.floor(this.size) + "px";
        if (this.source_cache != this.source) {
            this.elm.src = "image2/" + this.source + ".png";
            this.source_cache = this.source
        }
        if (this.visible_cache != this.visible) {    
            this.elm.style.display = "block";
            this.visible_cache = this.visible;
        }

    }
    else {
        if (this.visible_cache != this.visible) {
            this.elm.style.display = "none";
            this.visible_cache = this.visible;
        }
    }
}
