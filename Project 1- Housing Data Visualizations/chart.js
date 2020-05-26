function createClickHandler(variable,nobins){		
	var numericalset = new Set(["MSSubClass","OverallCond","BedroomAbvGr","TotRmsAbvGrd","GarageArea","SalePrice","GarageCars","GrLivArea"]); 
	//var categoricalset = new Set(["date","c"]); 
	var columnname = variable;
	//console.log(columnname);
	if(numericalset.has(columnname))
	{
		return createNumerical(columnname,nobins);
	}
	else
		return createCategorical(columnname);
}

var deltaX, deltaY;
var current;
var dragHandler = d3.drag()
    .on("start", function () {
        current = d3.event.x;
        //console.log("X"+d3.event.x);
    })
    .on("drag", function () {
        //console.log("This is" + deltaX);
        deltaX =Math.floor((current - d3.event.x)/50 ) ;
        numbins += deltaX;
        if(numbins<1)
        	numbins = 0;
        if(numbins>50)
        	numbins = 50;
    	console.log("Drag"+numbins);
    	createClickHandler(currentselectedelement,numbins);   
    	//console.log(d3.event.y + deltaY);
    });

function createCategorical(variable)
{
	var columnname = variable;
	var dataset=[];
	for(var i=0;i<csvdata.length;i++)
		{
			dataset.push(csvdata[i][columnname]);
		}	
	var dict = getFrequency(dataset);
	var data = []
	for(var key in dict) 
	{
  		var value = dict[key];
  		var obj = new Object();
		obj.variable = key;
		obj.frequency = value;
		data.push(obj);
	}
	//console.log(data);
	var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 500 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

	var x = d3.scaleBand()
		.range([ 0, width ])
		.padding(0.2);

	var y = d3.scaleLinear()
  			.range([ height, 0]);

    var tip = d3.tip()
      			.attr('class', 'd3-tip')
        		.offset([-5, 0])

	d3.select(".d3-tip").remove();
    d3.select("#chart").select("svg").remove();

	var svg = d3.select("#chart").append("svg") 
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .attr("id", "svgelement")  
			  	.append("g")
			    .attr("transform",
			          "translate(" + margin.left + "," + margin.top + ")");
 	
    svg.call(tip);

	x.domain(data.map(function(d) { return d.variable; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x))
	  .selectAll("text")
	  .attr("transform", "translate(-10,0)rotate(-45)")
	  .style("text-anchor", "end");

	svg.append("g")
	  .call(d3.axisLeft(y))
	  .append("text");

	svg.append("text")             
	      .attr("transform",
	            "translate(" + (width/2) + " ," + 
	                           (height + margin.top + 25) + ")")
	      .style("text-anchor", "middle")
	      .style('stroke', '#0b1a38')
	      .style('stroke-opacity', '0.3')
	      .text(variable);

	svg.append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 0 - margin.left)
	      .attr("x",0 - (height / 2))
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .style('stroke', '#0b1a38')
	      .style('stroke-opacity', '0.3')
	      .text("Frequency");      

	svg.selectAll(".bar")
		  .data(data)
		  .enter()
		  .append("rect")
		  .attr("class", "bar")
		  .attr("x", function(d) { return x(d.variable); })
		  .attr("y", function(d) { return y(d.frequency); })
		  .attr("width", x.bandwidth())
		  .attr("height", function(d) { return height - y(d.frequency); })
		  .attr("fill", "#0f3f61")
		  .on('mouseover', function(d){
		    	var xPos = +d3.select(this).attr("x");
		    	var yPos = +d3.select(this).attr("y");
		        var wid = +d3.select(this).attr("width");
		        var height = +d3.select(this).attr("height");
		        d3.select(this).attr("x", xPos - 4).attr("width", wid + 8);
		        d3.select(this).attr("y", yPos - 8).attr("height", height + 8);
		        d3.select(this)
		            .transition()
		            .attr('fill', '#038242');
		        var myElement = document.getElementById("svgelement");
		        var rectpos = myElement.getBoundingClientRect();
				console.log("Offsets"+rectpos.top+","+rectpos.left);
				var left = x(d.variable)+100+rectpos.left;
				var right = y(d.frequency)+50+ rectpos.top;
		        tip.html( "<strong> <span style='color:#038242; width:"+ wid +"px;text-align: center;display: block' >" + d.frequency + "</span></strong>")
		  		.style("left", left + "px")
		                      .style("top", right+ "px");
		        tip.show();
		    	})
		  .on('mouseout', function(){
		    	d3.select(this).attr("x", function(d) {
		                return x(d.variable)
		            })
		            .attr("width", x.bandwidth());
		        d3.select(this).attr("y", function(d) {
		                return y(d.frequency)
		            })
		            .attr("height", function(d) { return height - y(d.frequency); });
		        d3.select(this)
		            .transition()
		            .attr('fill', '#0f3f61');
		        tip.hide;
		    });
}

function getFrequency(dataset)
{
	var dict = {};
	for(var i=0;i<dataset.length;i++)
	{
		var key = dataset[i];
		if(key in dict)
		{
			var val = dict[key];
			dict[key] = val+1;
		} 
		else
		{
			dict[key] = 1;
		}
	}
	return dict;
}

function createNumerical(variable,nobins)
{
	var columnname = variable;
	var dataset=[];
	for(var i=0;i<csvdata.length;i++)
		{
			dataset.push(csvdata[i][columnname]);
		}

	var margin = {top: 30, right: 30, bottom: 70, left: 60},
	width = 500 - margin.left - margin.right,
	height = 520 - margin.top - margin.bottom;

	d3.select(".d3-tip").remove();
	d3.select("#chart").select("svg").remove();

  	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-5, 0])

    var svg = d3.select("#chart").append("svg") 
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .attr("id","svgelement")
	    .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");
            	
    svg.call(tip);

  	var x = d3.scaleLinear()
	      .domain([0, d3.max(dataset.map(function(d) { return d; }))])     
	      .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

  	var histogram = d3.histogram()
	    .value(function(d) { return d; })   
	    .domain(x.domain())  
	    .thresholds(x.ticks(nobins)); 

  	var bins = histogram(dataset);

 // console.log(bins.length);

    var y = d3.scaleLinear()
        .range([height, 0]);

    y.domain([0, d3.max(bins, function(d) { return d.length; })]); 
 
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")             
       .attr("transform",
            "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
       .style("text-anchor", "middle")
       .style('stroke', '#0b1a38')
       .style('stroke-opacity', '0.3')
       .text(variable);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style('stroke', '#0b1a38')
      .style('stroke-opacity', '0.3')
      .text("Frequency");      


    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr('class', 'bar')
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -5 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .attr( 'fill', '#038242' )
        // Show tooltip on hover
        .on('mouseover', function(d){
			var xPos = +d3.select(this).attr("x")
	    	var yPos = +d3.select(this).attr("y")
	        var wid = +d3.select(this).attr("width");
	        var height = +d3.select(this).attr("height");
	        d3.select(this).attr("x", xPos - 4).attr("width", wid + 8);
	        d3.select(this).attr("y", yPos - 8).attr("height", height + 8);
	        d3.select(this)
	            .transition()
	            .attr('fill', '#0f3f61');
	        var myElement = document.getElementById("svgelement");
	        var rectpos = myElement.getBoundingClientRect();
			console.log("Offsets"+rectpos.top+","+rectpos.left);
			var left = x(d.x0)+100+rectpos.left;
			var right = y(d.length)+50+ rectpos.top;
	        tip.html( "<strong> <span style='color:#0f3f61; width:"+ wid +"px;text-align: center;display: block' >" + d.length + "</span></strong>")
	  		.style("left", left + "px")
	                      .style("top", right+ "px");
	        tip.show();
    	})
    	.on('mouseout', function(){
			var xPos = +d3.select(this).attr("x")
	    	var yPos = +d3.select(this).attr("y")
	        var wid = +d3.select(this).attr("width");
	        var height = +d3.select(this).attr("height");
	        d3.select(this).attr("x", xPos + 4).attr("width", wid - 8);
	        d3.select(this).attr("y", yPos + 8).attr("height", height - 8);
	        d3.select(this)
	            .transition()
	            .attr('fill', '#038242');
	            tip.hide();
    	});
    
	var newdiv = d3.select("#chart")
	dragHandler(newdiv);
}