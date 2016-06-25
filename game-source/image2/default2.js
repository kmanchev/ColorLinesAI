// Programming by Philipp Lenssen based on a game idea by Olga Demina

var map = new Array();
var map_cache = new Array();
var g_mapMax = null;
var g_colorMax = null;
var g_ballsPerTurn = null;
var g_tileSize = null;
var g_circleMax = null;
var g_ballsStart = 5;
var g_empty = -1;
var g_completeLine = 5;
var selectedBall = new Position();
var busy = true;
var g_pathIterator = 0;
var g_shortestPath = null;
var g_moveDelay = 50;
var g_nextBalls = new Array();
var g_score = 0;
var g_avatars = new Array();
var g_avatarsDelay = 200;
var g_circlesDelay = 80;
var g_circles = new Array();
var g_scoreBarOverlayCounter = 0;

function init(mapMax, colorMax, ballsPerTurn, tileSize, circleMax)
{
    g_mapMax = mapMax;
    g_colorMax = colorMax;
    g_ballsPerTurn = ballsPerTurn;
    g_tileSize = tileSize;
    g_circleMax = circleMax;

    for (var x = 0; x < g_mapMax; x++) {
        map[x] = new Array();
        map_cache[x] = new Array();
        for (var y = 0; y < g_mapMax; y++) {
            map[x][y] = g_empty;
            map_cache[x][y] = g_empty;
        }
    }

    initAvatars();
    initCircles();

    for (var i = 0; i < g_ballsStart; i++) {
        addBall( getRandomBall() );
    }
    prepareNextBalls();

    render();
    busy = false;
}

function clickMap(x, y)
{
    if (!busy) {
        busy = true;
        if (x == selectedBall.x && y == selectedBall.y) {
            doLolite(selectedBall.x, selectedBall.y);
            selectedBall.x = null;
            selectedBall.y = null;
            busy = false;
        }
        else {
            if (map[x][y] == g_empty && selectedBall.x != null && selectedBall.y != null) {
                g_shortestPath = getShortestPath(selectedBall.x, selectedBall.y, x, y);
                if (g_shortestPath.length >= 1) {
                    doLolite(selectedBall.x, selectedBall.y);
                    g_pathIterator = 0;
                    setTimeout( "continuePath()", g_moveDelay );
                }
                else {
                    busy = false;
                }                
            }
            else {
                if (selectedBall.x != null) {
                    doLolite(selectedBall.x, selectedBall.y);
                }
    
                selectedBall.x = x;
                selectedBall.y = y;
                doHilite(selectedBall.x, selectedBall.y);
                busy = false;
            }
        }
    }
}

function initAvatars()
{
    var i = 0;
    g_avatars[i] = new Avatar();
    g_avatars[i].x = 60;
    g_avatars[i].speedX = 6;
    g_avatars[i].y = 500;
    g_avatars[i].type = 1;
    g_avatars[i].limitX2 = 415;

    i = 1;
    g_avatars[i] = new Avatar();
    g_avatars[i].x = 470;
    g_avatars[i].y = 500;
    g_avatars[i].speedX = - 4;
    g_avatars[i].type = 2;
    setTimeout("moveAvatars()", g_avatarsDelay);
}

function initCircles()
{
    for (var i = 0; i < g_circleMax; i++) {
        g_circles[i] = new Circle();
        g_circles[i].x = getRandomInt(0, 400);
        g_circles[i].y = getRandomInt(0, 400);
        g_circles[i].visible = false;
    }
    setTimeout("animateCircles()", g_circlesDelay);
}

function moveAvatars()
{
    for (var i = 0; i < g_avatars.length; i++) {
        g_avatars[i].speedX *= .8;
        if (g_avatars[i].speedX >= -0.1 && g_avatars[i].speedX < 0.1) {
            g_avatars[i].speedX = 0;
        }
        g_avatars[i].move();
        g_avatars[i].render();
    }
    setTimeout("moveAvatars()", g_avatarsDelay);
}

function animateCircles()
{
    for (var i = 0; i < g_circleMax; i++) {
        g_circles[i].animate();
        g_circles[i].render();
    }
    setTimeout("animateCircles()", g_circlesDelay);
}

function createCircleAt(x, y, size, source, growth)
{
    for (var i = 0; i < g_circleMax; i++) {
        if (!g_circles[i].visible) {
            g_circles[i].x = x;
            g_circles[i].y = y;
            g_circles[i].opacity = 100;
            g_circles[i].size = size;
            g_circles[i].growth = growth;
            g_circles[i].source = source;
            g_circles[i].visible = true;
            // alert("Created new circle at " + x + "/" + y);
            break;
        }
    }
}

function prepareNextBalls()
{
    for (i = 0; i < g_ballsPerTurn; i++) {
        g_nextBalls[i] = getRandomBall();
    }
}

function throwNextBalls()
{
    var gameOver = false;
    for (i = 0; i < g_ballsPerTurn; i++) {
        var thisGameOver = addBall(g_nextBalls[i]);
        if (thisGameOver) { gameOver = true; }
        g_nextBalls[i] = g_empty;
    }

    var hasLines = checkHasLines();
    if (hasLines) {
        gameOver = false;
        render();
    }

    var tile = new getRandomFreeTile();
    if (tile.x == null) { gameOver = true; }

    if (gameOver) {
        var elmGameOverScore = document.getElementById("gameOverScore");
        elmGameOverScore.innerHTML = g_score;
        showElm("gameOver");
        showElm("gameOverShade");
        busy = true;
    }
}

function continuePath()
{
    if (+g_pathIterator < g_shortestPath.length) {

        var direction = g_shortestPath[g_pathIterator];
        var ball = map[selectedBall.x][selectedBall.y];
        map[selectedBall.x][selectedBall.y] = g_empty;
        switch (direction) {
            case "L": selectedBall.x--; break;
            case "U": selectedBall.y--; break;
            case "R": selectedBall.x++; break;
            case "D": selectedBall.y++; break;
        }
        map[selectedBall.x][selectedBall.y] = ball;

        render();

        if (++g_pathIterator < g_shortestPath.length) {
            setTimeout( "continuePath()", g_moveDelay );
        }
        else {
            selectedBall.x = null;
            selectedBall.y = null;
            setTimeout( "checkMove()", g_moveDelay * 4);
        }
    }
}

function checkMove()
{
    if ( checkHasLines() ) {
        render();
        busy = false;
    }
    else {
        throwNextBalls();
        prepareNextBalls();
        g_avatars[0].speedX = -2;
        render();
        busy = false;
    }
}

function checkHasLines()
{
    var hasLines = false;

    var map_check = new Array();
    for (var x = 0; x < g_mapMax; x++) {
        map_check[x] = new Array();
        for (var y = 0; y < g_mapMax; y++) {
            map_check[x][y] = map[x][y];
        }
    }

    // Checking --
    for (var y = -1; y < g_mapMax + 1; y++) {
        var x = -1;
        var thisHasLines = checkHasLinesDirection(map_check, x, y, 1, 0);
        if (thisHasLines) { hasLines = true; }
    }

    // Checking |
    for (var x = -1; x < g_mapMax + 1; x++) {
        var y = -1;
        var thisHasLines = checkHasLinesDirection(map_check, x, y, 0, 1);
        if (thisHasLines) { hasLines = true; }
    }

    // Checking \
    for (var x = -1; x < g_mapMax + 1; x++) {
        var y = -1;
        var thisHasLines = checkHasLinesDirection(map_check, x, y, 1, 1);
        if (thisHasLines) { hasLines = true; }
    }
    for (var y = 0; y < g_mapMax + 1; y++) {
        var x = -1;
        var thisHasLines = checkHasLinesDirection(map_check, x, y, 1, 1);
        if (thisHasLines) { hasLines = true; }
    }

    // Checking /
    for (var x = -1; x < g_mapMax + 1; x++) {
        var y = -1;
        var thisHasLines = checkHasLinesDirection(map_check, x, y, -1, 1);
        if (thisHasLines) { hasLines = true; }
    }
    for (var y = 0; y < g_mapMax + 1; y++) {
        var x = g_mapMax;
        var thisHasLines = checkHasLinesDirection(map_check, x, y, -1, 1);
        if (thisHasLines) { hasLines = true; }
    }

    return hasLines;
}

function checkHasLinesDirection(map_check, x, y, speedX, speedY)
{
    var hasLines = false;
    var onEdge = false;
    var marked = new Array();

    while (!onEdge) {
        x += speedX;
        y += speedY;

        var i = marked.length;
        marked[i] = new PositionColor();
        marked[i].x = x;
        marked[i].y = y;
        marked[i].color = (x >= 0 && x < g_mapMax && y >= 0 && y < g_mapMax) ? map_check[x][y] : g_empty;
        onEdge = (x + speedX <= -1) || (y + speedY <= -1) || (x + speedX >= g_mapMax) || (y + speedY >= g_mapMax);

        var oldColor = (i >= 1) ? marked[i - 1].color : g_empty;
        var sameColor = marked[i].color != g_empty && marked[i].color == oldColor;
        if (!sameColor || onEdge || map_check[x][y] == g_empty) {
            var thisLine = (sameColor) ? marked.length : marked.length - 1;
            if (thisLine >= g_completeLine) {
                removeMarkedBalls(marked, thisLine);
                hasLines = true;
            }

            marked = new Array();
            i = marked.length;
            marked[i] = new PositionColor();
            marked[i].x = x;
            marked[i].y = y;
            marked[i].color = (x >= 0 && x < g_mapMax && y >= 0 && y < g_mapMax) ? map_check[x][y] : g_empty;
        }
    }

    return hasLines;
}

function removeMarkedBalls(marked, lineLength)
{
    for (var i = 0; i < lineLength; i++) {
        var x = marked[i].x;
        var y = marked[i].y;
        if (x >= 0 && x < g_mapMax && y >= 0 && y < g_mapMax) {
            map[x][y] = g_empty;
            createCircleAt( x * g_tileSize + g_tileSize / 2, (y + 1) * g_tileSize + g_tileSize / 2, g_tileSize - 5 , "circle-success", 3 );
        }
    }

    var bonus = lineLength - g_completeLine;
    if (bonus > 0) {
        bonus *= (bonus + 1);

        if (g_scoreBarOverlayCounter == 0) {
            var elm = document.getElementById("scoreBarOverlay");
            elm.style.MozOpacity = 1;
            elm.style.filter = "alpha(opacity=100)";
            elm.style.display = "block";
            g_scoreBarOverlayCounter = 100;
            fadeOutScoreBarOverlay();
        }
    }
    else if (bonus < 0) { bonus = 0; }
    g_score += lineLength * 2 + bonus;

    g_avatars[0].speedX = 4;
}

function fadeOutScoreBarOverlay()
{
    var elm = document.getElementById("scoreBarOverlay");
    g_scoreBarOverlayCounter -= 5;
    if (g_scoreBarOverlayCounter >= 10) {
        elm.style.MozOpacity = "." + g_scoreBarOverlayCounter;
        elm.style.filter = "alpha(opacity=" + g_scoreBarOverlayCounter + ")";
        setTimeout( "fadeOutScoreBarOverlay()", 100 );
    }
    else {
        g_scoreBarOverlayCounter = 0;
        elm.style.display = "none";
    }
}

function lolite(x, y)
{
    if (!busy) { doLolite(x, y); }
}

function hilite(x, y)
{
    if (!busy) { doHilite(x, y); }
}

function doLolite(x, y)
{
    var elm = document.getElementById("ball" + x + "_" + y);
    elm.style.MozOpacity = 1;
    elm.style.filter = "alpha(opacity=100)";
    elm.style.height = g_tileSize + "px";
    elm.style.marginTop = 0;
}

function doHilite(x, y)
{
    var elm = document.getElementById("ball" + x + "_" + y);
    var opacity = 40;
    elm.style.MozOpacity = "." + opacity;
    elm.style.filter = "alpha(opacity=" + opacity + ")";
    elm.style.height = (g_tileSize - 10) + "px";
    elm.style.marginTop = 5 + "px";
}

function render()
{
    for (var x = 0; x < g_mapMax; x++) {
        for (var y = 0; y < g_mapMax; y++) {
            if (map[x][y] != map_cache[x][y]) {
                var elm = document.getElementById("ball" + x + "_" + y);
                elm.src = "image2/ball" + map[x][y] + ".png";
                map_cache[x][y] = map[x][y];
            }
        }
    }

    for (i = 0; i < g_ballsPerTurn; i++) {
        var elm = document.getElementById("nextBall" + i);
        if (elm) {
            elm.src = "image2/small/ball" + g_nextBalls[i] + ".png";
        }
    }

    var elmScoreValue = document.getElementById("scoreValue");
    elmScoreValue.innerHTML = g_score;

    var elmScoreBar = document.getElementById("scoreBar");
    var elmScoreBarOverlay = document.getElementById("scoreBarOverlay");
    var width = 60 + g_score;
    max = 480;
    if (width >= max) { width = max; }
    elmScoreBar.style.width = width + "px";
    elmScoreBarOverlay.style.width = width + "px";

    max = 380;
    var limitX1 = width;
    if (limitX1 >= max) { limitX1 = max; }
    g_avatars[0].limitX1 = limitX1;
}

function addBall(ball)
{
    var gameOver = false;
    var tile = new getRandomFreeTile();
    if (tile.x != null) {
        map[tile.x][tile.y] = ball;
        // createCircleAt( tile.x * g_tileSize + g_tileSize / 2, (tile.y + 1) * g_tileSize + g_tileSize / 2, g_tileSize - 8, "circle-new", -2 );
    }
    else {
        gameOver = true;
    }
    return gameOver;
}

function getRandomBall()
{
    return getRandomInt(0, g_colorMax - 1);
}

function getRandomInt(min, max)
{
    return Math.floor( ( (max + 1 - min) * Math.random() ) + min );
}

function getRandomFreeTile()
{
    var pos = new Position();
    var freeTiles = getFreeTiles();
    if (freeTiles.length >= 1) {
        var r = getRandomInt(0, freeTiles.length - 1);
        pos.x = freeTiles[r].x;
        pos.y = freeTiles[r].y;
    }
    return pos;
}

function getFreeTiles()
{
    var freeTiles = new Array();
    for (var x = 0; x < g_mapMax; x++) {
        for (var y = 0; y < g_mapMax; y++) {
            if (map[x][y] == g_empty) {
                var i = freeTiles.length;
                freeTiles[i] = new Position();
                freeTiles[i].x = x;
                freeTiles[i].y = y;
            }
        }
    }
    return freeTiles;
}

function inArray(arr, v)
{
    var isIn = false;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == v) {
            isIn = true;
            break;
        }
    }
    return isIn;
}

function Position()
{
    this.x = null;
    this.y = null;
}

function PositionColor()
{
    this.x = null;
    this.y = null;
    this.color = null;
}

function showElm(id)
{
    var elm = document.getElementById(id);
    if (elm) {
        elm.style.display = "block";
    }
}
