var gAvatarId = 0;

function Avatar()
{
    this.x = 0; this.x_cache = null;
    this.y = 0; this.y_cache = null;
    this.speedX = 0;
    this.speedY = 0;
    this.cell = 1; this.cell_cache = null;
    this.cellCounter = 0;
    this.type = 1; this.type_cache = null;
    this.limitX1 = 80;
    this.limitX2 = 1000;
    this.direction = "fr"; this.direction_cache = null;
    this.elm = document.getElementById("avatar" + gAvatarId++);
}

Avatar.prototype.show = function()
{
    this.elm.style.display = "block";
}

Avatar.prototype.hide = function()
{
    this.elm.style.display = "none";
}

Avatar.prototype.move = function()
{
    var isMoving = this.speedX != 0 || this.speedY != 0;
    if ( isMoving || getRandomInt(0, 100) <= 10 ) {
        if (--this.cellCounter <= 0) {
            this.cellCounter = 5;
            if (++this.cell > 2) {
                this.cell = 1;
            }
        }
    }

    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > this.limitX2) {
        this.x = this.limitX2;
    }
    else if (this.x < this.limitX1) {
        this.x = this.limitX1;
    }
}

Avatar.prototype.render = function()
{
    if (this.speedX >= .2) {
        this.direction = "rt";
    }
    else if (this.speedX <= -.2) {
        this.direction = "lf";
    }
    else if (this.speedY <= -.2) {
        this.direction = "bk";
    }
    else {
        this.direction = "fr";
    }

    if (this.x_cache != this.x || this.y_cache != this.y || this.cell_cache != this.cell ||
            this.type_cache != this.type || this.direction_cache != this.direction) {
        this.elm.style.left = Math.floor(this.x) + "px";
        this.elm.style.top = Math.floor(this.y) + "px";
        this.elm.src = "image2/avatar/" + this.type + "_" + this.direction + this.cell + ".gif";

        this.x_cache = this.x;
        this.y_cache = this.y;
        this.cell_cache = this.cell;
        this.type_cache = this.type;
        this.direction_cache = this.direction;
    }
}
