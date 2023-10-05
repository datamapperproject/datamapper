
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
var nodes;
var labels
var coor;
var isBeginerMode = true;
var sentence = [-1,-1,-1,-1];
var json;

// add force in d3 v4
const simulation = d3.forceSimulation()
.force("charge", d3.forceManyBody())
.force("x", d3.forceX().strength(0.1))
.force("y", d3.forceY())
.on("tick", ticked);

var linktemp = group.append('g');

fetch("data/content.json")
.then((response) => response.json())
.then((json) => onLoad( json ));

//Create layout
function onLoad (thisJson)
{ 
  json = json;
  createLayout();
  drawNodes(thisJson);
  drawAllLinks(thisJson);
  updateInteraction(thisJson);
}
// create tools

// create dummy reference for each action
svg.call(zoom.on("zoom", function() {

  group.attr("transform", d3.event.transform);
  //onZoom();
}
));

//set default zoom bases on the width of the page
var zoomLevel = pageWidth/17;
zoom.scaleTo(svg, zoomLevel);
//zoom.translateBy(svg, pageWidth/2, pageHeight/2);

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

    var from = d.from ;
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

    