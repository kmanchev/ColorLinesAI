//Kostadin Manchev - colorLines AI

function AI() {

    this.ai_empty = -1;
	this.ai_map = new Array();
	this.ai_map_cache = new Array();
	this.ai_mapMax = 9;
}



/*function triggerAI() {
	var ai = new AI();
	ai.decideMove(this.ai_mapMax);
}*/



function decideMove() {

	var ai = new AI();
	var mapMax = ai.ai_mapMax;
	ai.scanMap(mapMax);
	//console.log(ai.ai_map[1][2]);
	var verticalClusters = ai.scanVertical(mapMax);
  	var horizontalClusters = ai.scanHorizontal(mapMax);
  	var sortedVerticalClusters = ai.sortClusterDecending(verticalClusters);
  	var sortedHorizontalClusters = ai.sortClusterDecending(horizontalClusters);
  	var freeTiles = ai.getFreeTiles();
	var singleElements = ai.getSingleElements();

	if (ai.slotForAppendUpVertical(sortedVerticalClusters[0])) {
		var appendUp = ai.slotForAppendUpVertical(sortedVerticalClusters[0]);
		console.log(appendUp);
	}

		if (ai.slotForAppendDownVertical(sortedVerticalClusters[0])) {
		var appendDown = ai.slotForAppendDownVertical(sortedVerticalClusters[0]);
		console.log(appendDown);
	}

		if (ai.slotForAppendLeftHorizontal(sortedHorizontalClusters[0])) {
		var appendLeft = ai.slotForAppendLeftHorizontal(sortedHorizontalClusters[0]);
		console.log(appendLeft);
	}

		if (ai.slotForAppendRightHorizontal(sortedHorizontalClusters[0])) {
		var appendRight = ai.slotForAppendRightHorizontal(sortedHorizontalClusters[0]);
		console.log(appendRight);
	}

	var sameColorSingleElem = ai.sameColorSingleElement(sortedVerticalClusters[0],singleElements);
	console.log(sameColorSingleElem);

	/*console.log(verticalClusters);
	console.log(horizontalClusters);
	console.log(sortedVerticalClusters);
	console.log(sortedHorizontalClusters);
	console.log(freeTiles);
	console.log(singleElements);*/
 	
 }


AI.prototype.scanMap = function(mapMax) {

     // scaning the map 
    for (var x = 0; x < mapMax; x++) {
        this.ai_map[x] = new Array();
        this.ai_map_cache[x] = new Array();
        for (var y = 0; y < mapMax; y++) {
        	 var elm = document.getElementById("ball" + x + "_" + y);
             this.ai_map[x][y] = elm.src.split("/").pop().split(".")[0].split("ball").pop();
        }
    }
}

AI.prototype.scanVertical = function(mapMax) {

	console.log("scan Vertical");
	// max length of cluster is 4  
	var verticalClusters = new Array();
	

	for (var x = 0;x < mapMax; x++) {
		var verticalCluster = new Array();
		for(var y = 0;y < mapMax; y++) {
			var verticalCluster = new Array();
			if (mapMax > y+1 && this.ai_map[x][y] == this.ai_map[x][y+1] && this.ai_map[x][y] != -1) {
				var mapElement1 = new MapElement();
				var mapElement2 = new MapElement();
				mapElement1.x = x;
				mapElement1.y = y;
				mapElement1.colorValue = this.ai_map[x][y];
				mapElement2.x = x;
				mapElement2.y = y+1;
				mapElement2.colorValue = this.ai_map[x][y+1];
				verticalCluster.push(mapElement1);
				verticalCluster.push(mapElement2);
				y = y+1;
				if (mapMax > y+1 && this.ai_map[x][y] == this.ai_map[x][y+1]) {
					var mapElement3 = new MapElement();
					mapElement3.x = x;
					mapElement3.y = y+1;
					mapElement3.colorValue = this.ai_map[x][y+1];
					verticalCluster.push(mapElement3);
					y = y+1;
					if (mapMax > y+1 && this.ai_map[x][y] == this.ai_map[x][y+1]) {
						var mapElement4 = new MapElement();
						mapElement4.x = x;
						mapElement4.y = y+1;
						mapElement4.colorValue = this.ai_map[x][y+1];
						verticalCluster.push(mapElement4);
						y = y+1;
					}
				}
			} 
			if (verticalCluster.length > 0) {
				verticalClusters.push(verticalCluster);
			}	
		}

	}
	return verticalClusters;
}

AI.prototype.scanHorizontal = function(mapMax) {

	console.log("scan Horizontal");
	// max length of cluster is 4  
	var horizontalClusters = new Array();
	
	for (var y = 0;y < mapMax; y++) {
		var horizontalCluster = new Array();
		for(var x = 0;x < mapMax; x++) {
			var horizontalCluster = new Array();
			if (mapMax > x+1 && this.ai_map[x][y] == this.ai_map[x+1][y] && this.ai_map[x][y] != -1) {
				var mapElement1 = new MapElement();
				var mapElement2 = new MapElement();
				mapElement1.x = x;
				mapElement1.y = y;
				mapElement1.colorValue = this.ai_map[x][y];
				mapElement2.x = x+1;
				mapElement2.y = y;
				mapElement2.colorValue = this.ai_map[x+1][y];
				horizontalCluster.push(mapElement1);
				horizontalCluster.push(mapElement2);
				x = x+1;
				if (mapMax > x+1 && this.ai_map[x][y] == this.ai_map[x+1][y]) {
					var mapElement3 = new MapElement();
					mapElement3.x = x+1;
					mapElement3.y = y;
					mapElement3.colorValue = this.ai_map[x+1][y];
					horizontalCluster.push(mapElement3);
					x = x+1;
					if (mapMax > x+1 && this.ai_map[x][y] == this.ai_map[x+1][y]) {
						var mapElement4 = new MapElement();
						mapElement4.x = x+1;
						mapElement4.y = y;
						mapElement4.colorValue = this.ai_map[x+1][y];
						horizontalCluster.push(mapElement4);
						x = x+1;
					}
				}
			} 
			if (horizontalCluster.length > 0) {
				horizontalClusters.push(horizontalCluster);
			}	
		}
	}
	return horizontalClusters;
}

AI.prototype.getFreeTiles = function() {

    var freeTiles = new Array();
    for (var x = 0; x < this.ai_mapMax; x++) {
        for (var y = 0; y < this.ai_mapMax; y++) {
            if (this.ai_map[x][y] == this.ai_empty) {
            	var mapElement = new MapElement();
            	mapElement.x = x;
            	mapElement.y = y;
            	mapElement.colorValue = this.ai_empty;
            	freeTiles.push(mapElement);
            }
        }
    }
    return freeTiles;
}


AI.prototype.getSingleElements = function() {

	var horizontalClusters = this.scanHorizontal(this.ai_mapMax);
	var verticalClusters = this.scanVertical(this.ai_mapMax);
	var freeTiles = this.getFreeTiles();
	var singleElements = new Array();
	var tempoMap = new Array();

	// filling temporary map with 0 so we can know which are single elements.Will exclude clusters and empty spaces lates.
	for (var x = 0; x < this.ai_mapMax; x++) {
		tempoMap[x] = new Array();
        for (var y = 0; y < this.ai_mapMax; y++) {
        	tempoMap[x][y] = 0;
        }
    }

    // changing value of all elements that are free or part of a cluster.That way the only 0 elements left in the map will be single elements.
	for (var i = 0; i < freeTiles.length; i++) {
		tempoMap[freeTiles[i].x][freeTiles[i].y] = 1;
	}

	if(verticalClusters.length != 0) {
		for (var i = 0; i < verticalClusters.length; i++) {
			for (var j = 0; j < verticalClusters[i].length; j++) {
				tempoMap[verticalClusters[i][j].x][verticalClusters[i][j].y] = 1;
			}
		}
	}

	if(horizontalClusters.length != 0) {
		for (var i = 0; i < horizontalClusters.length; i++) {
			for (var j = 0; j < horizontalClusters[i].length; j++) {
			tempoMap[horizontalClusters[i][j].x][horizontalClusters[i][j].y] = 1;
			}	
		}
	}

	for (var x = 0; x < this.ai_mapMax; x++) {
		for (var y = 0; y < this.ai_mapMax; y++) {
			if (tempoMap[x][y] == 0) {
				var singleElement = new MapElement();
				singleElement.x = x;
				singleElement.y = y;
				singleElement.colorValue = this.ai_map[x][y];
				singleElements.push(singleElement);
			}
		}
	}
	return singleElements;
}
 
AI.prototype.sortClusterDecending = function(clusters) {

    var swapped;
    do {
        swapped = false;
        for (var i=0; i < clusters.length-1; i++) {
            if (clusters[i].length < clusters[i+1].length) {
                var temp = clusters[i];
                clusters[i] = clusters[i+1];
                clusters[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
	return clusters;
}

AI.prototype.slotForAppendUpVertical = function(verticalCluster) {

   if(typeof verticalCluster != 'undefined') {
		var x = verticalCluster[0].x;
		var y = verticalCluster[0].y;
		var colorValue = verticalCluster[0].colorValue;
		if (y-1 >= 0) {
			if (this.ai_map[x][y-1] == this.ai_empty) {
				element = new MapElement();
				element.x = x;
				element.y = y-1;
				element.colorValue = this.ai_empty;
				return element;
			} else {
				return false;
			}
		}
		return false;
	}
	return false;
}

AI.prototype.slotForAppendDownVertical = function(verticalCluster) {

	  if(typeof verticalCluster != 'undefined') {
		var x = verticalCluster[0].x;
		var y = verticalCluster[0].y;
		var colorValue = verticalCluster[0].colorValue;
		if (y+1 < this.ai_mapMax) {
			if (this.ai_map[x][y+1] == this.ai_empty) {
				element = new MapElement();
				element.x = x;
				element.y = y+1;
				element.colorValue = this.ai_empty;
				return element;
			} else {
				return false;
			}
		}
		return false;
	}
	return false;
}

AI.prototype.slotForAppendLeftHorizontal = function(horizontalCluster) {

	if(typeof horizontalCluster != 'undefined') {
		var x = horizontalCluster[0].x;
		var y = horizontalCluster[0].y;
		var colorValue = horizontalCluster[0].colorValue;
		if (x-1 >= 0) {
			if (this.ai_map[x-1][y] == this.ai_empty) {
				element = new MapElement();
				element.x = x-1;
				element.y = y;
				element.colorValue = this.ai_empty;
				return element;
			} else {
				return false;
			}
		}
		return false;
	}
	return false;
}

AI.prototype.slotForAppendRightHorizontal = function(horizontalCluster,emptySlots) {

	if(typeof horizontalCluster != 'undefined') {
		var x = horizontalCluster[0].x;
		var y = horizontalCluster[0].y;
		var colorValue = horizontalCluster[0].colorValue;
		if (x+1 < this.ai_mapMax) {
			if (this.ai_map[x+1][y] == this.ai_empty) {
				element = new MapElement();
				element.x = x+1;
				element.y = y;
				element.colorValue = this.ai_empty;
				return element;
			} else {
				return false;
			}
		}
		return false;
	}
	return false;
}

AI.prototype.sameColorSingleElement = function(cluster,singleElements) {

	var colorValue = cluster[0].colorValue;
	for (var i=0; i < singleElements.length; i++) {
		if(singleElements[i].colorValue == colorValue) {
			return singleElements[i];
		}
	}
	return false;
}
 



























