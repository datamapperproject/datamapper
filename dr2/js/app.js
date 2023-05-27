//create array of objects 
var proms = [
  {name: "sense", type: "verb", column: 0, action:0, active : true, links : ["link A", "link B"], desc: "sence can be listened, seen, felt, smelt, tasted"},
  {name: "lifeworlds", type: "subject", column:1, action:0, active : false, links : ["case A"],desc: "lifeworlds are the worlds we live in"},
  {name:"to describe", type:"verb2", column:2, action:0, active : false, links : ["link B"], desc: "description is a way to understand"},
  {name: "needs and aspirations", type:"object", column:3, action:0 , active :false, links : ["tool A"], desc: "needs and aspirations are the things we want"},
  {name: "formulate", type: "verb", column: 0, action:1, active : true, links : ["case C"], desc: "formulation is a way to understand"},
  {name: "concepts", type: "subject", column:1, action:1, active : false, links : ["link C"], desc: "concepts are the things we think"},
  {name:"to frame", type:"verb2", column:2, action:1, active : false, links : ["lin D"], desc: "framing is a way to understand"},
  {name: "problems", type:"object", column:3 , action:1, active : false, links : ["tool D"], desc: "problems are the things we want to change"},
  {name: "gather", type: "verb", column: 0, action:2, active : true, links : ["link E"], desc: "gathering is a way to understand"},
  {name: "data", type: "subject", column:1, action:2, active : false, links : ["case E"], desc: "data is the things we know"},
  {name:"to analyse", type:"verb2", column:2, action:2, active : false, links : ["link F", "tool B"], desc: "analysis is a way to understand"},
  {name: "limits", type:"object", column:3, action:2, active : false , links : ["tool B", "link K"], desc: "limits are the things we can't do"},
  {name: "imagine", type: "verb", column: 0, action:3, active : true, links : ["link G"], desc: "imagination is a way to understand"},
  {name: "potentials", type: "subject", column:1, action:3, active : false, links : ["link G"], desc: "potentials are the things we can do"},
  {name:"to create", type:"verb2", column:2, action:3, active : false, links : ["link B", "tool C"], desc: "creation is a way to understand"},
  {name: "ideas", type:"object", column:3, action:3 , active : false, links : ["tool C", "link A"], desc: "ideas are the things we can do"},
  {name: "craft", type: "verb", column: 0, action:4, active : true, links : ["link H"], desc: "craft is a way to understand"},
  {name: "cases", type: "subject", column:1, action:4, active : false, links : ["link H"], desc: "cases are the things we can do"},
  {name:"to evaluate", type:"verb2", column:2, action:4, active : false, links : ["link D", "tool D"], desc: "evaluation is a way to understand"},
  {name: "solutions", type:"object", column:3 , action:4, active : false, links : ["tool A"], desc: "solutions are the things we can do"},
  {name: "empower", type: "verb", column: 0, action:5, active : true, links : ["link I"], desc: "empowerment is a way to understand"},
  {name: "participants", type: "subject", column:1, action:5, active : false, links : ["link I"], desc: "participants are the things we can do"},
  {name:"to negotiate", type:"verb2", column:2, action:5, active : false, links : ["link F", "tool A"], desc: "negotiation is a way to find compromises"},
  {name: "projects", type:"object", column:3 , action:5, active : false, links : ["tool C"], desc: "projects are the things we can do"},
];
var count=0;

// assign svg to D3 selection
var svg = d3.select("body")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 700)
  ;
var group = svg.append("g");
//add zoom behaviour
var zoom = d3.zoom();



// add force in d3 v4
const simulation = d3.forceSimulation()
.force("charge", d3.forceManyBody())
.force("x", d3.forceX().strength(0.1))
.force("y", d3.forceY())
.on("tick", ticked);
var linktemp = group.append('g');

//create node  as circle for each element in array with d3
var nodes = group.selectAll("circle")
  .data(proms)
  .enter()
  .append("circle")
  .attr("r", 30)
  .attr("cx", function(d) {
    return d.column * 220 + 50;
  })
  .attr("cy", function(d) {
    return d.action * 65 + 50;   
  })
  .style("fill", function(d) {
    return d.active ? "lightblue" : "white";
  })
  .style("stroke", "black")
  .attr("z-index", 100)
  .on("click", function(d) { 
     createlink(this,d);
  }) 
  ;

// add labels to each nodes
var labels = group.selectAll("text")
  .data(proms)
  .enter()
  .append("text")
  .attr("x", function(d) {
    return d.column * 220 + 50;
  })
  .attr("y", function(d) {
    return d.action * 65 + 52;
  })
  .text(function(d) {
    return d.name;
  })
  .attr("font-family", "helvetica")
  .attr("font-size", "12px")
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .attr("vertical-align", "middle")
  .attr("z-index", 0)
  .attr("pointer-events", "none")
  ;

//create links between nodes
var link;
function createlink(t,data) {
  //create line

  console.log("start");
 if(link === undefined)   
 {
  link = linktemp.append("line")
  .attr("x1", t.cx.baseVal.value)
  .attr("y1", t.cy.baseVal.value)
  .attr("x2", t.cx.baseVal.value)
  .attr("y2", t.cy.baseVal.value)
  .attr("stroke-width",4)
  .attr("stroke", "black")
  .attr("opacity", 0.2)
  .attr("onclick", "this.remove()") //remove line on click
  ;
  reactivate(0,false);
  reactivate(1,true);
  crateTools(data, t.cx.baseVal.value, t.cy.baseVal.value);
 }
  else  if  ( data.column === 3)
  {
    console.log("end");
 
    link.attr("x2", t.cx.baseVal.value)
        .attr("y2", t.cy.baseVal.value);
     link = undefined;
     reactivate(3, false);
     crateTools(data, t.cx.baseVal.value, t.cy.baseVal.value);
     ++count;
  } 
  else {
  link.attr("x2", t.cx.baseVal.value)
      .attr("y2", t.cy.baseVal.value);
  link = undefined;
  link = linktemp.append("line")
  .attr("x1", t.cx.baseVal.value)
  .attr("y1", t.cy.baseVal.value)
  .attr("x2", t.cx.baseVal.value)
  .attr("y2", t.cy.baseVal.value)
  .attr("stroke-width",4)
  .attr("stroke", "black")
  .attr("opacity", 0.2)
  .attr("onclick", "this.remove()") //remove line on click
  reactivate(data.column,false);
  reactivate(data.column +1,true);
  crateTools(data, t.cx.baseVal.value, t.cy.baseVal.value);
  }
  if(data != undefined && data.column === 3)
    reactivate(0,true);

}
// update the link position base on mouse move
document.onmousemove = function(e){
  if(link === undefined) return;

  // get group transform attribute
  var string = group.attr("transform");
  if (string === null) 
    string = "translate(0,0) scale(1)";
  var ts = string.split(" ");
  translate = ts[0].substring(ts[0].indexOf("(")+1, ts[0].indexOf(")")).split(",");
  scale = ts[1].substring(ts[1].indexOf("scale(")+6, ts[1].indexOf(")")).split(",");

  // get cursor position relative to group
  cursorX = (e.pageX - parseFloat(translate[0])) * 1/scale;
  cursorY = (e.pageY - parseFloat(translate[1])) * 1/scale;
  // update the link position
  link.attr("x2", cursorX)
      .attr("y2", cursorY);
}
// update node active status base on order of sentence 

function reactivate(c, t){
  nodes
  .filter(function(d) {
    return d.column === c;
  })
  .style("fill", t ? "lightblue" : "white")
  .data()
  .forEach(function(d) {
    d.active = t;
  })
  ;
}
var links;
var tools;
var toolsText;
function crateTools(data, x,y){
 // create array of object from data.links with index
  var arr = data.links.map(function(d, i) {
    return {name: d, index: i, x: 0, y:0};
  });

  //create node  as circle for each element in array with d3
  var tools = group.append("g").selectAll("rect")
    .data(arr)
    .enter().append("g")
    .call(function () {
      return d3.drag().on('drag', function (d, i) {
          d.x += d3.event.dx;
          d.y += d3.event.dy;
          d3.select(this).attr("transform", function () {
              return "translate(" + [d.x, d.y] + ")";
          });
  
      })
  }())
    ;
    
    tools.append("rect")
    .attr("width", 100)
    .attr("height", 50)
    .attr("x", function(d){return x}) 
    .attr("y", function(d){return 450+ count * 100+ 50 * d.index }) 
    .style("fill", "lightgrey")
    .style("stroke", "black")
    .attr("z-index", "10")

    ;

   // add text to rect as child
   tools.append("text")
    .attr("x", function(d){return x+50})
    .attr("y", function(d){return 450+ count * 100+ 50 * d.index +25;})
    .attr("font-size", "12px")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("pointer-events", "none")
    .attr("font-family", "helvetica")
    .text( function(d) {return d.name;})
    .style("pointer-events", "none")
    ;
    
}

function ticked() {
if (tools === undefined) return;
// update tools position base on simulation
}
svg.call(zoom.on("zoom", function() {
  group.attr("transform", d3.event.transform)
  if (d3.event.transform.k > 1.5) {
    labels.attr("font-size", "6px");
    labels.text( function(d) {return d.desc;});
    toolsText.attr("font-size", "6px");
    toolsText.text( function(d) {return "this is dummy text for " + d.name;});
  } else {
    labels.attr("font-size", "12px");
    labels.text( function(d) {return d.name;});
    toolsText.attr("font-size", "12px");
    toolsText.text( function(d) {return d.name;});
  }
}));


//implement drag and drop for tools



