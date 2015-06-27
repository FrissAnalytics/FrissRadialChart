(function() {

  var binding = new Shiny.OutputBinding();
      
  binding.find = function(scope){return $(scope).find(".FrissRadialChart");};
  
  binding.renderValue = function(el, data) {
  
  // get element     
  var $el = $(el);
  
  // div chart id created by Shiny    
  var ChartID = el.id;
  
   // determine element width 
  var Width = $(el).width();

  // determine element height 
  var Height = $(el).height(); 
  
  // minimum of width and height
  var Min = d3.min([Width,Height]);   
    
  d3.select(el).select("*").remove();
  
  //////////
  // DATA //
  //////////
  
  var CentralCircleColor = 'red';

  var VariableNames = ["var 1", "var 2", "var 3", "var 4", "var 5", "var 6", "var 7", "var 8", "var 9", "var 10", "var 11"];
	
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
	var rl   = d3.scale.linear().domain([0, 75]).range([0, w / 2 - 60]);
	var rs   = d3.scale.log().domain([1, 74]).range([0, w / 2 - 60]);
	var rr   = d3.scale.linear().domain([Math.sqrt(1 / Math.PI), Math.sqrt(15 / Math.PI), Math.sqrt(74 / Math.PI)]).range([22, 5, 2]);
	var rinw = d3.scale.linear().domain(d3.extent(data, function(x) { return Math.sqrt(x.inw / Math.PI); })).range([2, 40]);
	var ro   = d3.scale.linear().domain(d3.extent(data, function(x) { return x.opk; })).range([2, 70]);
	var c    = d3.scale.log().domain([1, 20, 74]).range(["#ADDD8E", "#41415F", "#193244"]);

	var rfuncs = [
		function(d, i) { return rinw(Math.sqrt(d.inw / Math.PI)); }, // population
		function(d, i) { return rr(Math.sqrt(d['chi'][index] / Math.PI) == 0 ? 1 : Math.sqrt(d['chi'][index] / Math.PI)); }, // similarity
		function(d, i) { return ro(d.opk); } // show up
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
		.attr("id", "selectedcity")
		.attr("x", 54)
		.attr("y", 30)
		.text(data[index]["gem"])
		.style("fill", "#000")
		.style("text-anchor", "start")
		.style("font-family", "Quicksand")
		.style("font-size", "24px");

	var selectors = svg.append("foreignObject")
		.attr("transform", "translate(200, 200)")
		.append("body")
		.append("ul");

	selectors.append("li");
	selectors.append("li");

	var g = svg.append('g').attr('transform', 'translate(' + w / 2 + ', ' + h / 2 + ')');
    
	//circles used in radial mode
	var arc = d3.svg.arc()
		.outerRadius(function(d) { return rl(d.value); })
		.startAngle(0)
		.endAngle(2 * Math.PI);

	var ga = g.append("g")
      		  .attr("id", "axisgroup")
      		  .style("opacity", 0);

	ga.selectAll(".axispath")
	  	.data(axes)
	  	  .enter().append("path")
	  	.attr("id", function(d, i) { return "axispath" + i; })
	  	.attr("class", "axispath")
	  	.attr("d", arc)
	  	.style("stroke", "#91B6D4")
	  	.style("fill", "none")
	  	.style("opacity", 0.6);

	ga.selectAll(".axislabel")
		.data(axes)
		  .enter().append("text")
		.attr("class", "axislabel")
		.attr("dy", -5)
		.attr("dx", 0)
		.style("fill", "#91B6D4")
		.style("font-size", "11px")
		.style("text-anchor", "middle")
	  .append("textPath")
	  	.attr("xlink:href", function(d, i) { return "#axispath" + i; })
	  	.attr("startOffset", "40%")
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
			
			
  function UpdateCity(ShinyIndex){
    console.log("UpdateCity called");
    console.log(ShinyIndex);
    index = ShinyIndex;
		update();
  }
  
  function Resize(message){
    if(message == "Similarity") sizeBySimilarity();
    if(message == "Size") sizeByPopulation();
  }
  
  function Collapse(message){

    d3.selectAll(".city")
      .transition()
      .duration(1300)
      .attr("cx", 0)
      .style("opacity",0);
  }
  
  function Reset(message){

    d3.selectAll(".city")
      .transition()
      .duration(1300)
      .attr("cx", function(d, i) { return rs(d['chi'][index] == 0 ? 1 : d['chi'][index])})
      .style("opacity",1);
  }

  Shiny.addCustomMessageHandler("myCallbackHandler1",UpdateCity);
  Shiny.addCustomMessageHandler("myCallbackHandler2",Resize);
  Shiny.addCustomMessageHandler("myCallbackHandler3",Collapse);
  Shiny.addCustomMessageHandler("myCallbackHandler4",Reset);
  
  function update(){
  	d3.selectAll('.city')
    	.style("opacity",1)
      .transition()
      .duration(800)
      .attr("cx", function(d, i) { return rs(d['chi'][index] == 0 ? 1 : d['chi'][index])})
      .attr('r', rfunc)
      .style('fill', function(d, i) { return index == d.s ? CentralCircleColor : c(d['chi'][index] == 0 ? 1 : d['chi'][index]); });	
      
    d3.selectAll(".label").remove();

    d3.select("#selectedcity").text(data[index]["gem"]);
    
    bar.data(data[index]['stm'])
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
    	d3.selectAll('.city').each(function(d, ind) {
        	if (d.s == index){
        	  d3.select(this).moveToFront();
        	}
    	});

      index = ind;
      
      // indicate to selected city to shiny
      Shiny.onInputChange("Index", index);

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
			.attr('dy', function() { return size == "pop" ? -1 * rinw(Math.sqrt(d.inw / Math.PI)) - 5 : -1 * rr(Math.sqrt(d['chi'][index] / Math.PI) == 0 ? 1 : Math.sqrt(d['chi'][index] / Math.PI)) - 5; })
			.style('fill', 'none')

		var labelforeground = d3.select(this.parentNode)
			.append('text')
			.attr('class', 'label')
			.style('text-anchor', 'middle')
			.text(function() { return d.gem; })
			.style('font-family', "'Quicksand', sans-serif")
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.attr('dy', function() { return size == "pop" ? -1 * rinw(Math.sqrt(d.inw / Math.PI)) - 5 : -1 * rr(Math.sqrt(d['chi'][index] / Math.PI) == 0 ? 1 : Math.sqrt(d['chi'][index] / Math.PI)) - 5; })
			.style('fill', '#000')

		if (layout == "geo") {
			labelbackground
				.attr('y', function() { return merc([d['geo'][1], d['geo'][0]])[1]; })
  	ge			.attr('x', function() { return merc([d['geo'][1], d['geo'][0]])[0]; })

  			labelforeground
				.attr('y', function() { return merc([d['geo'][1], d['geo'][0]])[1]; })
  				.attr('x', function() { return merc([d['geo'][1], d['geo'][0]])[0]; })
		} else {
			labelbackground
				.attr('x', function() { return index == i ? 0 : Math.cos(d.s/data.length * 2 * Math.PI) * rs(d['chi'][index] == 0 ? 1 : d['chi'][index]); })
				.attr('y', function() { return index == i ? 0 : Math.sin(d.s/data.length * 2 * Math.PI) * rs(d['chi'][index] == 0 ? 1 : d['chi'][index]); })

			labelforeground
				.attr('x', function() { return index == i ? 0 : Math.cos(d.s/data.length * 2 * Math.PI) * rs(d['chi'][index] == 0 ? 1 : d['chi'][index]); })
				.attr('y', function() { return index == i ? 0 : Math.sin(d.s/data.length * 2 * Math.PI) * rs(d['chi'][index] == 0 ? 1 : d['chi'][index]); })
		}

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
		d3.selectAll('.label')
			.remove()

		d3.selectAll(".marker")
			.remove()
	});

	var bs = d3.scale.linear().domain([0, 100]).range([0, 200]);

	var bg = svg.append("g")
		.attr("transform", "translate(50, 50)")
    
	//text in front of bars on top left hand side 
	var party = bg.selectAll(".party")
		.data(["var 1", "var 2", "var 3", "var 4", "var 5", "var 6", "var 7", "var 8", "var 9", "var 10", "var 11"])
		.enter().append("text")
		.attr("class", "party")
		.attr("x",-50)
		.attr("y", function(d, i) { return 8 + i * 11; })
		.text(String)
		.style("fill", "#91B6D4")
		.style("text-anchor", "right-align")

	//bars in left top cir
	var bar = bg.selectAll("rect")
		.data(data[index]["stm"])
		.enter().append("rect")
		.attr("x", 5)
		.attr("y", function(d, i) { return i * 11; })
		.attr("height", 10)
		.attr("width", function(d) { return bs(d); })
		.style("fill", "#C0CCD5")
   
   
   // radial layout
			layout = "radial";

			d3.selectAll(".city")
				.transition()
				.duration(1300)
				.attr("cy", 0)
  				.attr("cx", function(d, i) { return rs(d['chi'][index] == 0 ? 1 : d['chi'][index])})
  				.attr("transform", function(d, i) { return "rotate(" + d.s/data.length * 360 + " 0 0)"; })

			d3.selectAll("#axisgroup")
  				.transition()
  				.duration(1300)
  				.style("opacity", 1)

			d3.select(this)
			.attr("class", "selected")

      update();
  };
    
  Shiny.outputBindings.register(binding, "FrissRadialChartOutputBinding");
    
})();