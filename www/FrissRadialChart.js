(function() {

   // see also http://192.168.41.209/~friss/DemoD3Radial/D3RadialDemo.html
  var binding = new Shiny.OutputBinding();
      
  binding.find = function(scope){return $(scope).find(".FrissRadialChart");};
  
  binding.renderValue = function(el, data) {
    
  // get element     
  var $el = $(el);
  
  // div chart id created by Shiny    
  var ChartID = el.id;
  
  console.log("my chart id:", ChartID);
  
   // determine element width 
  var Width = $(el).width();

  // determine element height 
  var Height = $(el).height(); 
  
  // minimum of width and height
  var Min = d3.min([Width,Height]);   

  // remove previous graph
  d3.select(el).selectAll("*").remove();
    
  //////////
  // DATA //
  //////////

  var CentralCircleColor = 'red';

  var VariableNames  = ["variable 1", "variable 2", "variable 3", "variable 4", "variable 5", "variable 6", "variable 7", "variable 8", "variable 9", "variable 10", "variable 11"];
	
	var NrOfVariables  = VariableNames.length;
	  
  var BarOffsetX     = -50;
  var BarTextColor   = "#91B6D4";
  var BarTextAlign   = "left-align";
  var BarColor       = "#C0CCD5";
  
  var CircleGuideTextColor = "#91B6D4";
  var CircleGuideTextSize = "11px";
  var CircleGuideOffset = "40%";
  
  var CircleGuideFill = "none";
  var CircleGuideStroke  = "#91B6D4";
  var CircleGuideOpacity = 0.6;
  var CircleGuideStrokeWidth = "1px";

  // color circles with high similarity (low distance from center) 
  // medium similarity (medium distance from center), low similarity (high distance from center)
  var CircleColorArray = ["#ADDD8E", "#41415F", "#193244"];
  
	//axis used during radial layout
	var axes = [
		{ 'label': 'very comparible'      , 'value': 15 },
		{ 'label': 'comparible'           , 'value': 30 },
		{ 'label': 'different'            , 'value': 45 },
		{ 'label': 'very different'       , 'value': 60 },
		{ 'label': 'extremely  different' , 'value': 75 } 
	];

	//select a city to start visualization
	var index =  0,
	
	//canvas width and height
	w = Min, 
	h = Min;
	
	//scales used to adjust data points during visualization
	
	// circle guide scale
	var rl   = d3.scale.linear().domain([0, 75]).range([0, w / 2 - 60]);
	
	var rs   = d3.scale.log().domain([1, 74]).range([0, w / 2 - 60]);
	
	// circle radius scale when based on similarity
	var rr   = d3.scale.linear().domain([Math.sqrt(1 / Math.PI), Math.sqrt(15 / Math.PI), Math.sqrt(74 / Math.PI)]).range([22, 5, 2]);
	
	// circle radius scale when based on population
	var rinw = d3.scale.linear().domain(d3.extent(data, function(x) { return Math.sqrt(x.inw / Math.PI); })).range([2, 40]);
	
	// circle color scale
	var c    = d3.scale.log().domain([1, 20, 74]).range(CircleColorArray);

	var rfuncs = [
		function(d, i) { return rinw(Math.sqrt(d.inw / Math.PI)); }, // population
		function(d, i) { return rr(Math.sqrt(d['chi'][index] / Math.PI) == 0 ? 1 : Math.sqrt(d['chi'][index] / Math.PI)); }, // similarity
	];

	var rfunc  = rfuncs[1];
	var layout = "geo";
	var size   = "sim";

	//set canvas on which to draw D3 visualization
	var svg = d3.select(el).append("svg") 
		.attr("width", w)
		.attr("height", h);

  //left hand side text indicating which city is selected
	var selectedCity = svg.append("text")
		.attr("id", ChartID + "_selectedcity")
		.attr("x", 54)
		.attr("y", 30)
		.text(data[index]["gem"])
		.style("fill", "#000")
		.style("text-anchor", "start")
		.style("font-family", "Quicksand")
		.style("font-size", "24px");

	var g = svg.append('g').attr('transform', 'translate(' + w / 2 + ', ' + h / 2 + ')');
    
	//circles used in radial mode
	var arc = d3.svg.arc()
		.outerRadius(function(d) { return rl(d.value); })
		.startAngle(0)
		.endAngle(2 * Math.PI);

	var ga = g.append("g")
      		  .attr("id", ChartID + "_axisgroup")
      		  .style("opacity", 0);

	ga.selectAll(".axispath")
	  	.data(axes)
	  	  .enter().append("path")
	  	.attr("id", function(d, i) { return "axispath" + i; })
	  	.attr("class", "axispath")
	  	.attr("d", arc)
	  	.style("stroke", CircleGuideStroke)
	  		  	.style("stroke-width", CircleGuideStrokeWidth)
	  	.style("fill", CircleGuideFill)
	  	.style("opacity", CircleGuideOpacity);

  // circle guides
	ga.selectAll(".axislabel")
		.data(axes)
		  .enter().append("text")
		.attr("class", "axislabel")
		.attr("dy", -5)
		.attr("dx", 0)
		.style("fill", CircleGuideTextColor)
		.style("font-size", CircleGuideTextSize)
		.style("text-anchor", "middle")
	  .append("textPath")
	  	.attr("xlink:href", function(d, i) { return "#axispath" + i; })
	  	.attr("startOffset", CircleGuideOffset)
		.text(function(d, i) { return d.label; });

	d3.selection.prototype.moveToFront = function() { 
    return this.each(function(){ 
        this.parentNode.appendChild(this); 
    }); 
	}; 

	data.forEach(function(d, i) {
		d.s = i;
	});

  // helper function
  function sizeByPopulation(){
    rfunc = rfuncs[0];
    
    circle.each(function(d, i) {
      d3.select(this)
      .style("opacity",1)
      .transition()
      .duration(800)
      .attr('r', rfunc);
    });
    
    size = "pop";
  }

  // helper function
  function sizeBySimilarity(){
		rfunc = rfuncs[1];
		
		circle.each(function(d, i) {
			d3.select(this)
		   	.style("opacity",1)
				.transition()
				.duration(800)
				.attr('r', rfunc);
		});
		
		size = "sim";
  }			
			
			
  function City(ShinyIndex){
    index = ShinyIndex;
		update();
  }
  
  function Size(message){
    if(message == "Similarity") sizeBySimilarity();
    if(message == "Size") sizeByPopulation();
  }
  
  Shiny.addCustomMessageHandler(ChartID + "_callbackCity",City);
  Shiny.addCustomMessageHandler(ChartID + "_callbackSize",Size);
  
  function update(){
  	d3.select(el).selectAll('.city')
    	.style("opacity",1)
      .transition()
      .duration(800)
      .attr("cx", function(d, i) { return rs(d.chi[index] === 0 ? 1 : d.chi[index])})
      .attr('r', rfunc)
      .style('fill', function(d, i) { return index === d.s ? CentralCircleColor : c(d.chi[index] === 0 ? 1 : d.chi[index]); });	
      
    d3.select(el)
      .selectAll(".label")
      .remove();

    d3.select(el)
      .select("#" + ChartID + "_selectedcity")
      .text(data[index].gem);
    
    bar.data(data[index].stm)
       .transition()
       .duration(800)
       .attr("width", function(d) { return bs(d);});
  }		

  var circle = g.selectAll('.city')
  	.data(data)
  .enter().append('circle')
    .attr('class', 'city')
  	.attr('r', rfunc)
  	.attr('cy', 200)
  	.style('fill', function(d, i) { return index == d.s ? CentralCircleColor : c(d['chi'][index] == 0 ? 1 : d['chi'][index]); })
  	.style('stroke', 'white')
  	.style('stroke-opacity', 0.3)
  	.style("opacity", 0.9)
    .on("click", function(d, ind) {
    	d3.select(el).selectAll('.city').each(function(d, ind) {
        	if (d.s == index){
        	  d3.select(this).moveToFront();
        	}
    	});

      index = ind;
      
      // indicate to selected city to shiny
      Shiny.onInputChange(ChartID + "_index", index);

      update();

  })
	.on("mouseover", function(d, i) {
	  
	 var labelbackground = d3.select(this.parentNode)
			.append('text')
			.attr('class', 'label')
			.style('text-anchor', 'middle')
			.text(function() { return d.gem; })
			.style('font-family', "'Quicksand', sans-serif")
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.style('stroke', 'rgb(240,249,255)')
			.style('stroke-width', 3.5)
			.style('stroke-opacity', 0.6)
			.style('filter', 'url:(#dropshadow)')
			.attr('dy', function() { return size == "pop" ? -1 * rinw(Math.sqrt(d.inw / Math.PI)) - 5 : 
			                                                -1 * rr(Math.sqrt(d['chi'][index] / Math.PI) == 0 ? 
			                                                1 : Math.sqrt(d['chi'][index] / Math.PI)) - 5; })
			.style('fill', 'none')

		var labelforeground = d3.select(this.parentNode)
			.append('text')
			.attr('class', 'label')
			.style('text-anchor', 'middle')
			.text(function() { return d.gem; })
			.style('font-family', "'Quicksand', sans-serif")
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.attr('dy', function() { return size == "pop" ? 
			                         -1 * rinw(Math.sqrt(d.inw / Math.PI)) - 5 : 
			                         -1 * rr(Math.sqrt(d['chi'][index] / Math.PI) == 0 ? 
			                         1 : Math.sqrt(d['chi'][index] / Math.PI)) - 5; })
			.style('fill', '#000');

			labelbackground
				.attr('x', function() { return index == i ? 0 : Math.cos(d.s/data.length * 2 * Math.PI) * rs(d['chi'][index] == 0 ? 1 : d['chi'][index]); })
				.attr('y', function() { return index == i ? 0 : Math.sin(d.s/data.length * 2 * Math.PI) * rs(d['chi'][index] == 0 ? 1 : d['chi'][index]); })

			labelforeground
				.attr('x', function() { return index == i ? 0 : Math.cos(d.s/data.length * 2 * Math.PI) * rs(d['chi'][index] == 0 ? 1 : d['chi'][index]); })
				.attr('y', function() { return index == i ? 0 : Math.sin(d.s/data.length * 2 * Math.PI) * rs(d['chi'][index] == 0 ? 1 : d['chi'][index]); })
		

		bg.selectAll(".marker")
			.data(data[d.s]["stm"])
			.enter().append("line")
			.attr("class", "marker")
			.attr("x1", function(d) { return 5 + bs(d); })
			.attr("y1", function(d, i) { return i * 11; })
			.attr("x2", function(d) { return 5 + bs(d); })
			.attr("y2", function(d, i) { return 10 + i * 11; })
			.style("stroke", "#000")
			.style("opacity", 0.8)

		bg.selectAll(".marker")
			.data(data[d.s]["stm"])
			.enter().append("line")
			.attr("class", "marker")
			.attr("x1", function(d) { return 5 + bs(d); })
			.attr("y1", function(d, i) { return i * 11; })
			.attr("x2", function(d) { return 5 + bs(d); })
			.attr("y2", function(d, i) { return 10 + i * 11; })
			.style("stroke", "#000")
			.style("opacity", 0.8);
	})
	.on("mouseout", function(d, i) {
		d3.select(el).selectAll('.label')
			.remove()

		d3.select(el).selectAll(".marker")
			.remove()
	});

	var bs = d3.scale.linear().domain([0, 100]).range([0, 200]);

	var bg = svg.append("g")
		.attr("transform", "translate(50, 50)")
    
  //text in front of bars on top left hand side 
	var party = bg.selectAll(".bar")
		.data(VariableNames) 
		.enter().append("text")
		.attr("class", "bar")
		.attr("x",BarOffsetX)
		.attr("y", function(d, i) { return 8 + i * 11; })
		.text(String)
		.style("fill", BarTextColor)
		.style("text-anchor", BarTextAlign)

	//bars in left top cir
	var bar = bg.selectAll("rect")
		.data(data[index]["stm"])
		.enter().append("rect")
		.attr("x", 5)
		.attr("y", function(d, i) { return i * NrOfVariables; })
		.attr("height", 10)
		.attr("width", function(d) { return bs(d); })
		.style("fill", BarColor);
   
   
  // added HSO radial layout
	layout = "radial";

	d3.select(el).selectAll(".city")
		.transition()
		.duration(1300)
		.attr("cy", 0)
		.attr("cx", function(d, i) { return rs(d['chi'][index] == 0 ? 1 : d['chi'][index])})
		.attr("transform", function(d, i) { return "rotate(" + d.s/data.length * 360 + " 0 0)"; })

	d3.select(el).select("#"+ChartID + "_axisgroup")
			.transition()
			.duration(1300)
			.style("opacity", 1);

  };
    
  Shiny.outputBindings.register(binding, "FrissRadialChartOutputBinding");
    
})();