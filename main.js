function mapviz() {
	var margin = {top: 0, left:0, right:0, bottom:0}, // this for creating an SVG
		height = 700 ,
		width = 800 ;

	var svg = d3.select("#map")
				.append("svg")
				.attr("height", height )
				.attr("width", width )
				.append("g")


// queue is used to run asynchronous task simultaneously

	d3.queue()
		.defer(d3.json, "states-10m.json")
		.defer(d3.csv, "National_Obesity_2014.csv")
		.await(begin)

	var projection = d3.geoAlbersUsa().translate([width/2 , height/2]).scale(850)
	var path = d3.geoPath().projection(projection);


	function begin(error, data, obesity) {
		if (error) throw error;
		console.log(data)
		

	var ratebyObesity = {}
	  obesity.forEach(function (d){
		//   console.log(d.Name);
		  ratebyObesity[d.Name] = +d.Obesity;
	  })

	  	//Drawing the map and adding hover on and out function over it
		var states = topojson.feature(data, data.objects.states).features;
		console.log(states)
		
	
		svg.selectAll(".state")
			.data(states)
			.enter().append("path")
			.attr("class","state")
			.attr("d", path)
			.on("mouseover", mouseOver)
			.on("mouseout", mouseOut)

		function mouseOver(d,i){
        // console.log(d);
	        svg.append("text")
	            .attr("id","t" + d.x + "-" + d.y + "-" + i)
	            .attr("x",d3.event.pageX - document.getElementById("map").getBoundingClientRect().x + 10)
	            .attr("y",d3.event.pageY - document.getElementById("map").getBoundingClientRect().y + 10)
	            .style("fill","ff0000")
	            .style("font-family","sans-serif")
	            .style("font-size","15")
	            .text(d.properties.name+"-"+ratebyObesity[d.properties.name].toFixed(2));
	            
   		 }

   		 function mouseOut(d,i){
       		 d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();
  		}
			
		

			
		console.log(obesity)
		svg.selectAll(".obese")
			.data(obesity)
			.enter().append("circle")
			.attr("class","obese")
			.attr("r", 2)
			.attr("cx", function(d){ 
				var co_ordinates = projection([d.Longitude, d.Latitude])
				console.log(co_ordinates)
				return co_ordinates[0]
			})
			.attr("cy", function(d){ 
				var co_ordinates = projection([d.Longitude, d.Latitude])
				//console.log(co_ordinates)
				return co_ordinates[1]
			})

		// if you uncomment the lines below and comment .on functions then it will show you values on the maps instead of hovering	
			
		// svg.selectAll(".obese-label")
		// 	.data(obesity)
		// 	.enter().append("text")
		// 	.attr("class","obese-label")
		// 	.attr("x", function(d){ 
		// 		var co_ordinates = projection([d.Longitude, d.Latitude])
		// 		console.log(co_ordinates)
		// 		return co_ordinates[0]
		// 	})
		// 	.attr("y", function(d){ 
		// 		var co_ordinates = projection([d.Longitude, d.Latitude])
		// 		//console.log(co_ordinates)
		// 		return co_ordinates[1]
		// 	})
		// 	.text(function(d){
		// 		return d.State;
		// 		return d.Obesity;
		// 	})
		// 	.attr("dx", 5)
		// 	.attr("dy",1)
			
		// svg.selectAll(".obese-name")
		// 	.data(obesity)
		// 	.enter().append("text")
		// 	.attr("class","obese-name")
		// 	.attr("x", function(d){ 
		// 		var co_ordinates = projection([d.Longitude, d.Latitude])
		// 		console.log(co_ordinates)
		// 		return co_ordinates[0]
		// 	})
		// 	.attr("y", function(d){ 
		// 		var co_ordinates = projection([d.Longitude, d.Latitude])
		// 		//console.log(co_ordinates)
		// 		return co_ordinates[1]
		// 	})
		// 	.text(function(d){
		// 		return d.Name;
		// 		return d.State;
		// 		return d.Obesity;
		// 	})
		// 	.attr("dx", -10)
		// 	.attr("dy",10)
		}
}

function choropleth() {

	//var width = 2000;
//var height = 1200;
	var lowColor = '#f9f9f9'
	var highColor = '#bc2a66'


	var margin = {top: 0, left:0, right:0, bottom:0},
		height = 700 ,
		width = 700 ;

	var svg = d3.select("#map")
				.append("svg")
				.attr("height", height )
				.attr("width", width )
				.append("g");

		//Coloring scheme for choropleth maps		
	var scheme = d3.schemePastel1;
	var color = d3.scaleThreshold()
	   	.domain([18,24,30,35,40])
	   	//.range(["cce6ff","ccf2ff","99e6ff","4dd2ff","1ac6ff","0099cc"]);
	   	.range(["b3cde3","ccebc5","decbe4","fed9a6","ffffcc"]);
	    //.range(["#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1"])
	    

	    //Legends
	var g =svg.append("g")
			.attr("class","legendThreshold")
			.attr("transform","translate(20,20)");
		g.append("text")
			.attr("class","caption")
			.attr("x", 0)
			.attr("y",-6)
			.text("BMI Index Ratio")
	var labels =[" <19 - Underweight","19-24 - Healthy","24.1-30 - Overweight","30-35 - Obese","35> - Obese",">40"];

	var legend = d3.legendColor()
			.labels(function (d) { return labels[d.i]; })
			.shapePadding(2)
			.scale(color);	
	svg.select(".legendThreshold")
			.call(legend)

	  



	d3.queue()
		.defer(d3.json, "states-10m.json")
		.defer(d3.csv, "National_Obesity_2014.csv")
		.await(begin)

	var projection = d3.geoAlbersUsa().translate([width/2 , height/2]).scale(850)
	var path = d3.geoPath().projection(projection);

	function begin(error, data, obesity) {
		if (error) throw error;
		// console.log(data)
		
		  //creat empty array and store the obesity value and the names
		  //svg.append("g")
		  var ratebyObesity = {}
		  obesity.forEach(function (d){
			//   console.log(d.Name);
			  ratebyObesity[d.Name] = +d.Obesity;
		  })
		  	console.log(ratebyObesity)
			//.data(topojson.feature(data, data.objects.states).features)

		var states = topojson.feature(data, data.objects.states).features;
		console.log(states)
		var j;
		
		svg.selectAll(".state")
			.data(states)
			.enter().append("path")
			.attr("class","state")
			.attr("d", path)
				.style("fill", function(d){
					//console.log(color(ratebyObesity[d.properties.name]));
					return color(ratebyObesity[d.properties.name]);
				}) // compare the names from json and csv and then add the color
			.on('mouseover', function(d) {
				d3.select(this).classed("selected", true)
			})
			.on('mouseout', function(d) {
				d3.select(this).classed("selected", false)
			})
		}
		
}

function reset(){
	location.reload();
}
