
// assign svg to D3 selection
var svg = d3.select("body")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
;
//Get page width and height
var pageWidth = document.documentElement.clientWidth /100;
var pageHeight = document.documentElement.clientHeight/100;


//add zoom behaviour
var zoom = d3.zoom();

//Basic variablea
var group = svg.append("g");
var layoutGroup = group.append("g").attr("class", "layout");
var linksGroup = group.append("g").attr("class", "backgroundLinks");
var linksBackground;
var tools;
var positionArray = [{x:-0.8, y:0}, {x:0.8, y:0}, {x:0, y:0.8}, {x:0, y:-0.8}];
var colorArray = ["red", "blue", "green", "orange"];
var colorArrayLight = ["ef8b8b", "8b96ef", "a0ef8b", "efcf8b"];
var groupColor = colorArray[0];
var groupColorLight = colorArrayLight[0];
var currentGroup =0;
var increase = 5;
var circleColor = "black";
var link;
var useHistory = -1;
var allLinksArray = [];
var links;
var tools;
var toolsText;
var LinkGroup = group.append("g");
var arenaGroup = group.append("g");
var rightGroup = group.append("g");
var arenaArray = [];
var rightArray = [];
var newGroup = group.append("g");
var linkArray = [];
var hoverGroup  ;
var subNode;
var subNodesArray =  [];
var hoverPanel = document.getElementById("hoverPanel");
var hoverContent = document.getElementById("hoverContent");

// add text to svg
var dna = group
    .selectAll("text")
    .data(["test"])
    .enter()
    .append("text")
    .attr("class", "dna")
    .attr("x", layoutSetup[2].x+ 0.5 + "%")
    .attr("y", layoutSetup[2].y +3 + "%")
    .attr("text-anchor", "left")
    .style("font-size", "0.7em")
    .style("font-family", "helvetica")
    .text("DNA:")
    .style("fill", "black")
    .call(wrap,  layoutSetup[2].w *pageWidth-10); 

// add force in d3 v4
const simulation = d3.forceSimulation()
.force("charge", d3.forceManyBody())
.force("x", d3.forceX().strength(0.1))
.force("y", d3.forceY())
.on("tick", ticked);
var linktemp = group.append('g');

//Create layout
createLayout();

//- drawTools();

//create node  as circle for each element in array with d3
var nodes = group.append("g").selectAll("ellipse")
  .data(proms)
  .enter()
  .append("ellipse")
  .attr("rx", function(d){return  27})
  .attr("ry", function(d){return  27})
  .attr("cx", function(d) {
    return pageWidth * layoutSetup[1].x +  d.column *pageWidth * layoutSetup[1].w/5 +70 ;
  })
  .attr("cy", function(d) {
    return pageHeight * layoutSetup[1].y +  d.action*pageHeight * layoutSetup[1].h/7  + 70;   
  })
  .style("fill", "white")
  .style("stroke", circleColor )
  .style("stroke-width", function(d) {return d.active ? 0.7: 0.5;})
  .attr("z-index", 100)
  .attr("pointer-events", "fill")
  .on("click", function(d) {  onActionClick(this,d);}) 
// change color of node to grey when mouse is over
  .on("mouseover", function(d) {
    d3.select(this).style("fill", "lightgrey");
    onActionHover(this,d.desc);
  })
  .on("mouseout", function(d) {
    d3.select(this).style("fill", "white");
    onActionHoverOut(this,d);
  })
  ;

  //Add sub nodes for count

  for (var i = 0; i < colorArray.length; i++) {
    for(var j = 0; j < proms.length; j++) {
      var object = { 
        group: i, 
        count: 0, 
        x: 0,
        column: proms[j].column, 
        action: proms[j].action,
        name: proms[j].name
      };
      subNodesArray.push(object)
    }
   }
   subNode = group.append("g").selectAll("circle")
  .data(subNodesArray)
  .enter()
  .append("circle")
  .attr("r", function(d){return d.count})
  .attr("cx", function(d) { 
    return pageWidth * layoutSetup[1].x +  d.column *pageWidth * layoutSetup[1].w/5 +70 + positionArray[d.group].x * d.count ;
  })
  .attr("cy", function(d) {
    return pageHeight * layoutSetup[1].y +  d.action*pageHeight * layoutSetup[1].h/7  + 70 + positionArray[d.group].y * d.count;   
  })
  .style("fill", function(d) {return colorArray[d.group];})
  .style("stroke", "transparent")
  .style("opacity", 0.5)
  .style("mix-blend-mode", "darken")
  .style("stroke-width", 0)
  .attr("z-index", 0)

  ;

// add labels to each nodes
var labels = group.append("g").selectAll("text")
  .data(proms)
  .enter()
  .append("text")
  .attr("x", function(d) {
    return pageWidth * layoutSetup[1].x +  d.column *pageWidth * layoutSetup[1].w/5 +70 ;
  })
  .attr("y", function(d) {
    return pageHeight * layoutSetup[1].y +  d.action*pageHeight * layoutSetup[1].h/7  + 70 - d.name.split("&").length * 5+7;   
  })
  .text(function(d) {
    return d.name;
  })
  .attr("font-family", "helvetica")
  .attr("font-size", "9px")
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .attr("vertical-align", "middle")
  .attr("z-index", 0)
  .attr("pointer-events", "none")
  .on("click", function(d) {  onActionClick(this,d);}) 
  .call(wrap, 52);
  ;


  // Draw line between each nodes from one column to all nodes in next column
  drawAllLinks();

// create tools




// create dummy reference for each action

function ticked() {
if (tools === undefined) return;
// update tools position base on simulation
}
svg.call(zoom.on("zoom", function() {
  group.attr("transform", d3.event.transform);
  // if (d3.event.transform.k > 1.5) {
  //   labels.attr("font-size", "6px");
  //   labels.text( function(d) {return d.desc;});
  //   toolsText.attr("font-size", "6px");
  //   toolsText.text( function(d) {return "this is dummy text for " + d.name;});
  // } else {
  //   labels.attr("font-size", "12px");
  //   labels.text( function(d) {return d.name;});
  //   toolsText.attr("font-size", "12px");
  //   toolsText.text( function(d) {return d.name;});
//  }
}
));

function wrap(text, width) {
  text.each(function () {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text.text(null)
                      .append("tspan")
                      .attr("x", x)
                      .attr("y", y)
                      .attr("dy", dy + "em");
      while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" ") + " ");
          if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" ") + " ");
              line = [word];
              tspan = text.append("tspan")
                          .attr("x", x)
                          .attr("y", y)
                          .attr("dy", ++lineNumber * lineHeight + dy + "em")
                          .text(word + " ");
          }
      }
  });
}

function updateGroups()
{
  linkArray.forEach(function(d){
    var from = d.from;
    var to = d.to;
    var link =d.link;

    var thisG = document.getElementById(from);
    var thisTrans = thisG.getAttribute("transform");
    var tx = parseInt(thisTrans.substring(thisTrans.indexOf("(")+1, thisTrans.indexOf(")")).split(",")[0])
    var ax = parseInt(thisG.getElementsByTagName("rect")[0].getAttribute("x"));
    var thisX = tx + ax;
    var ty = parseInt(thisTrans.substring(thisTrans.indexOf("(")+1, thisTrans.indexOf(")")).split(",")[1]);
    var ay = parseInt(thisG.getElementsByTagName("rect")[0].getAttribute("y"));
    var thisY = ty+ay ;

    //Get d3 node by element id
    var g = document.getElementById(to);
    var test = g.getAttribute("transform");
    var x = parseInt(test.substring(test.indexOf("(")+1, test.indexOf(")")).split(",")[0])+parseInt(g.getElementsByTagName("rect")[0].getAttribute("x"));
    var y = parseInt(test.substring(test.indexOf("(")+1, test.indexOf(")")).split(",")[1])+parseInt(g.getElementsByTagName("rect")[0].getAttribute("y"));
    link.attr("x1", thisX + 50)
        .attr("y1", thisY + 25)
        .attr("x2", x + 50)
        .attr("y2", y +25 );
  });

}

    