//Kostadin Manchev - colorLines AI

    var ai_empty = -1;
	var ai_map = new Array();
	var ai_map_cache = new Array();
	var ai_mapMax = 9;



function triggerAI(mapMax) {

	scanMap(ai_mapMax);
	scanForClusters(ai_mapMax);
}


function scanMap(mapMax) {

     // scaning the map 
    for (var x = 0; x < mapMax; x++) {
        ai_map[x] = new Array();
        ai_map_cache[x] = new Array();
        for (var y = 0; y < mapMax; y++) {
        	 var elm = document.getElementById("ball" + x + "_" + y);
             ai_map[x][y] = elm.src.split("/").pop().split(".")[0].split("ball").pop();
             //console.log(ai_map[x][y]);
            // ai_map_cache[x][y] = ai_empty;
        }
    }



}

function scanForClusters(mapMax) {

  var verticalClusters = scanVertical(mapMax);
  var horizontalClusters = scanHorizontal(mapMax);
  console.log(horizontalClusters);
  console.log(verticalClusters);
}

function scanVertical(mapMax) {

	console.log("scan Vertical");
	// max length of cluster is 4  
	var verticalClusters = new Array();
	

	for (var x = 0;x < mapMax; x++) {
		var verticalCluster = new Array();
		for(var y = 0;y < mapMax; y++) {
			var verticalCluster = new Array();
			if (mapMax > y+1 && ai_map[x][y] == ai_map[x][y+1] && ai_map[x][y] != -1) {
				var mapElement1 = new MapElement();
				var mapElement2 = new MapElement();
				mapElement1.x = x;
				mapElement1.y = y;
				mapElement1.colorValue = ai_map[x][y];
				mapElement2.x = x;
				mapElement2.y = y+1;
				mapElement2.colorValue = ai_map[x][y+1];
				verticalCluster.push(mapElement1);
				verticalCluster.push(mapElement2);
				y = y+1;
				if (mapMax > y+1 && ai_map[x][y] == ai_map[x][y+1]) {
					var mapElement3 = new MapElement();
					mapElement3.x = x;
					mapElement3.y = y+1;
					mapElement3.colorValue = ai_map[x][y+1];
					verticalCluster.push(mapElement3);
					y = y+1;
					if (mapMax > y+1 && ai_map[x][y] == ai_map[x][y+1]) {
						var mapElement4 = new MapElement();
						mapElement4.x = x;
						mapElement4.y = y+1;
						mapElement4.colorValue = ai_map[x][y+1];
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

function scanHorizontal(mapMax) {

	console.log("scan Horizontal");
	// max length of cluster is 4  
	var horizontalClusters = new Array();
	

	for (var y = 0;y < mapMax; y++) {
		var horizontalCluster = new Array();
		for(var x = 0;x < mapMax; x++) {
			var horizontalCluster = new Array();
			if (mapMax > x+1 && ai_map[x][y] == ai_map[x+1][y] && ai_map[x][y] != -1) {
				var mapElement1 = new MapElement();
				var mapElement2 = new MapElement();
				mapElement1.x = x;
				mapElement1.y = y;
				mapElement1.colorValue = ai_map[x][y];
				mapElement2.x = x+1;
				mapElement2.y = y;
				mapElement2.colorValue = ai_map[x+1][y];
				horizontalCluster.push(mapElement1);
				horizontalCluster.push(mapElement2);
				x = x+1;
				if (mapMax > x+1 && ai_map[x][y] == ai_map[x+1][y]) {
					var mapElement3 = new MapElement();
					mapElement3.x = x+1;
					mapElement3.y = y;
					mapElement3.colorValue = ai_map[x+1][y];
					horizontalCluster.push(mapElement3);
					x = x+1;
					if (mapMax > x+1 && ai_map[x][y] == ai_map[x+1][y]) {
						var mapElement4 = new MapElement();
						mapElement4.x = x+1;
						mapElement4.y = y;
						mapElement4.colorValue = ai_map[x+1][y];
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




















