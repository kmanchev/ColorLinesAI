//Kostadin Manchev - colorLines AI

function AI() {


    this.ai_empty = -1;
	this.ai_map = new Array();
	this.ai_map_cache = new Array();
	this.ai_mapMax = 9;
	
}



function triggerAI() {
	var ai = new AI();
	ai.scanMap(ai.ai_mapMax);
	ai.scanForClusters(ai.ai_mapMax);
}


AI.prototype.scanMap = function(mapMax) {

     // scaning the map 
    for (var x = 0; x < mapMax; x++) {
        this.ai_map[x] = new Array();
        this.ai_map_cache[x] = new Array();
        for (var y = 0; y < mapMax; y++) {
        	 var elm = document.getElementById("ball" + x + "_" + y);
             this.ai_map[x][y] = elm.src.split("/").pop().split(".")[0].split("ball").pop();
             //console.log(ai_map[x][y]);
            // ai_map_cache[x][y] = ai_empty;
        }
    }



}

AI.prototype.scanForClusters = function(mapMax) {

  var verticalClusters = this.scanVertical(mapMax);
  var horizontalClusters = this.scanHorizontal(mapMax);
  this.getSingleElements()
  //console.log(horizontalClusters);
  //console.log(verticalClusters);
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
					mapElement3.colorValue = ai_map[x][y+1];
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

/*AI.prototype.getSingleElements = function() {

	var singleElements = new Array();

	for (var x = 0; x < this.ai_mapMax; x++) {
        for (var y = 0; y < this.ai_mapMax; y++) {
        	if(x != 0 && y != 0 && x != this.ai_mapMax - 1 && y != this.ai_mapMax - 1) {
        		if(this.ai_map[x][y] != this.ai_map[x+1][y] && this.ai_map[x][y] != this.ai_map[x-1][y] 
        			&& this.ai_map[x][y] != this.ai_map[x][y+1] && this.ai_map[x][y] != this.ai_map[x][y-1]) {
        			var singleElem = new MapElement();
        			singleElem.x = x;
        			singleElem.y = y;
        			singleElem.colorValue = ai_map[x][y];
        			singleElements.push(singleElem);
        		}
        	}

        	if(x==0){
        		var singleElem = new MapElement();	

        	}
        }
    }
}*/

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

	for (var i = 0; i < freeTiles.length; i++) {
		tempoMap[freeTiles[i].x][freeTiles[i].y] = 1;
	}

	if(verticalClusters.length != 0) {
		//console.log(verticalClusters[0][0].x);
		for (var i = 0; i < verticalClusters.length; i++) {
			for (var j = 0; j < verticalClusters[i].length; j++) {
				//console.log(verticalClusters);
				tempoMap[verticalClusters[i][j].x][verticalClusters[i][j].y] = 1;
			}
		}
	}

	if(horizontalClusters.length != 0) {
		for (var i = 0; i < horizontalClusters.length; i++) {
			for (var j = 0; j < horizontalClusters[i].length; j++) {
			//console.log(horizontalClusters);
			tempoMap[horizontalClusters[i][j].x][horizontalClusters[i][j].y] = 1;
			}	
		}
	}

	console.log(tempoMap);

}




















