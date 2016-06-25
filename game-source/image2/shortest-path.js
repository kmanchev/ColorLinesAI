function getShortestPath(sourceX, sourceY, targetX, targetY)
{
    var shortestPath = new Array();

    var map_path = new Array();
    for (var x = 0; x < g_mapMax; x++) {
        map_path[x] = new Array();
        for (var y = 0; y < g_mapMax; y++) {
            if (map[x][y] == g_empty) {
                map_path[x][y] = ".";
            }
            else if (map[x][y] >= 0 && map[x][y] <= g_colorMax) {
                map_path[x][y] = "*";
            }
        }
    }
    map_path[sourceX][sourceY] = "X";

    var foundFree = true;
    var targets = "X/L/U/R/D";
    var targetArray = targets.split("/");

    while (foundFree) {
        foundFree = false;

        for (var x = 0; x < g_mapMax; x++) {
            for (var y = 0; y < g_mapMax; y++) {
                if (map_path[x][y] == ".") {
                    if ( hasNeighborLeft(map_path, x, y, targetArray) ) {
                        map_path[x][y] = "L";
                        foundFree = true;
                    }
                    else if ( hasNeighborUp(map_path, x, y, targetArray) ) {
                        map_path[x][y] = "U";
                        foundFree = true;
                    }
                    else if ( hasNeighborRight(map_path, x, y, targetArray) ) {
                        map_path[x][y] = "R";
                        foundFree = true;
                    }
                    else if ( hasNeighborDown(map_path, x, y, targetArray) ) {
                        map_path[x][y] = "D";
                        foundFree = true;
                    }
                }
            }
        }
    }

    var reversePath = getReversePath(map_path, sourceX, sourceY, targetX, targetY);
    shortestPath = invertPath(reversePath);

    // showPathFinderMap(map_path);

    return shortestPath;
}

function invertPath(reversePath)
{
    var shortestPath = new Array();
    for (var i = reversePath.length - 1; i >= 0; i--) {
        shortestPath[shortestPath.length] = invertDirection(reversePath[i]);
    }
    return shortestPath;
}

function invertDirection(direction)
{
    var invertedDirection;
    switch (direction) {
        case "L": invertedDirection = "R"; break;
        case "U": invertedDirection = "D"; break;
        case "R": invertedDirection = "L"; break;
        case "D": invertedDirection = "U"; break;
    }
    return invertedDirection;
}

function getReversePath(map_path, sourceX, sourceY, targetX, targetY)
{
    var reversePath = new Array();
    if (map_path[targetX][targetY] != ".") {
        var x = targetX;
        var y = targetY;

        while ( !(x == sourceX && y == sourceY) ) {
            var i = reversePath.length;
            var direction = map_path[x][y];
            reversePath[i] = direction;
            map_path[x][y] = "_" + direction + "_";
            switch (direction) {
                case "L": x--; break;
                case "U": y--; break;
                case "R": x++; break;
                case "D": y++; break;
            }
        }
    }
    return reversePath;
}

function hasNeighbor(map_path, x, y, targetArray)
{
    return hasNeighborLeft(map_path, x, y, targetArray)
            || hasNeighborUp(map_path, x, y, targetArray)
            || hasNeighborRight(map_path, x, y, targetArray)
            || hasNeighborDown(map_path, x, y, targetArray);
}

function hasNeighborLeft(map_path, x, y, targetArray)
{
    return (x >= 1) ? inArray(targetArray, map_path[x - 1][y]) : false;
}

function hasNeighborRight(map_path, x, y, targetArray)
{
    return (x < g_mapMax - 1) ? inArray(targetArray, map_path[x + 1][y]) : false;
}

function hasNeighborUp(map_path, x, y, targetArray)
{
    return (y >= 1) ? inArray(targetArray, map_path[x][y - 1]) : false;
}

function hasNeighborDown(map_path, x, y, targetArray)
{
    return (y < g_mapMax - 1) ? inArray(targetArray, map_path[x][y + 1]) : false;
}

function showPathFinderMap(map_path)
{
    for (var x = 0; x < g_mapMax; x++) {
        for (var y = 0; y < g_mapMax; y++) {
            var elm = document.getElementById("overlay" + x + "_" + y);
            elm.innerHTML = map_path[x][y];
        }
    }
}
