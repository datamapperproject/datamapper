//create array of objects 
var proms = [
  {name: "sense", type: "verb", column: 0, action:0, active : true, links : ["linkA", "linkB"]},
  {name: "lifeworlds", type: "subject", column:1, action:0, active : false, links : ["linkA"]},
  {name:"to describe", type:"verb2", column:2, action:0, active : false, links : ["linkB"]},
  {name: "needs and aspirations", type:"object", column:3, action:0 , active :false, links : ["toolA"]},
  {name: "formulate", type: "verb", column: 0, action:1, active : true, links : ["linkC"]},
  {name: "concepts", type: "subject", column:1, action:1, active : false, links : ["linkC"]},
  {name:"to frame", type:"verb2", column:2, action:1, active : false, links : ["linkD"]},
  {name: "problems", type:"object", column:3 , action:1, active : false, links : ["toolD"]},
  {name: "gather", type: "verb", column: 0, action:2, active : true, links : ["linkE"]},
  {name: "data", type: "subject", column:1, action:2, active : false, links : ["linkE"]},
  {name:"to analyse", type:"verb2", column:2, action:2, active : false, links : ["linkF", "toolB"]},
  {name: "limits", type:"object", column:3, action:2, active : false , links : ["toolB", "linkK"]},
  {name: "imagine", type: "verb", column: 0, action:3, active : true, links : ["linkG"]},
  {name: "potentials", type: "subject", column:1, action:3, active : false, links : ["linkG"]},
  {name:"to create", type:"verb2", column:2, action:3, active : false, links : ["linkB", "toolC"]},
  {name: "ideas", type:"object", column:3, action:3 , active : false, links : ["toolC", "linkA"]},
  {name: "craft", type: "verb", column: 0, action:4, active : true, links : ["linkH"]},
  {name: "cases", type: "subject", column:1, action:4, active : false, links : ["linkH"]},
  {name:"to evaluate", type:"verb2", column:2, action:4, active : false, links : ["linkD", "toolD"]},
  {name: "solutions", type:"object", column:3 , action:4, active : false, links : ["toolA"]},
  {name: "empower", type: "verb", column: 0, action:5, active : true, links : ["linkI"]},
  {name: "participants", type: "subject", column:1, action:5, active : false, links : ["linkI"]},
  {name:"to negotiate", type:"verb2", column:2, action:5, active : false, links : ["linkF", "toolA"]},
  {name: "projects", type:"object", column:3 , action:5, active : false, links : ["toolC"]},
];


// assign svg to D3 selection
var svg = d3.select("body")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 700);
// add force in d3 v4
const simulation = d3.forceSimulation()
.force("charge", d3.forceManyBody())
.force("x", d3.forceX().strength(0.1))
.force("y", d3.forceY())
.on("tick", ticked);
var linktemp = svg.append('g');
var test = svg.append('g');
//create node  as circle for each element in array with d3
var nodes = svg.selectAll("circle")
  .data(proms)
  .enter()
  .append("circle")
  .attr("r", 40)
  .attr("cx", function(d) {
    return d.column * 200 + 50;
  })
  .attr("cy", function(d) {
    return d.action * 100 + 50;   
  })
  .style("fill", function(d) {
    return d.active ? "lightblue" : "white";
  })
  .style("stroke", "black")
  .attr("z-index", 100)
  .on("click", function(d) { 
    if(d.active) createlink(this);
  }) 


  ;

// add labels to each nodes
var labels = svg.selectAll("text")
  .data(proms)
  .enter()
  .append("text")
  .attr("x", function(d) {
    return d.column * 200 + 50;
  })
  .attr("y", function(d) {
    return d.action * 100 + 50;
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
function createlink(t) {
  //create line
  console.log(t);
  var data = d3.select(t).data()[0];
  var column = data.column;

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

    //activate all nodes of same type

reactivate(column+1, true);
reactivate(column, false);

}
// update the link position base on mouse move
document.onmousemove = function(e){
  if(link === undefined) return;
  cursorX = e.pageX;
  cursorY = e.pageY;
  link.attr("x2", cursorX)
      .attr("y2", cursorY);
}
// update node active status base on order of sentence 
document.onmousedown = function(e){
  if(link === undefined) return;

  var node = document.elementFromPoint( e.pageX, e.pageY);
  var data = d3.select(node).data()[0];

  if(node.tagName !== "circle" || !data.active) {
    link.remove();
    link = undefined;
    reactivate(0,true);
    reactivate(1, false);
    reactivate(2, false);
    reactivate(3, false);
  }
   else if  ( data.column === 3)
    {
      link.attr("x2", node.cx.baseVal.value)
          .attr("y2", node.cy.baseVal.value);
       link = undefined;
       reactivate(3, false);
       crateTools(data, node.cx.baseVal.value, node.cy.baseVal.value);
    }
    
    else {
    link.attr("x2", node.cx.baseVal.value)
        .attr("y2", node.cy.baseVal.value);
    link = undefined;
  }

  if(data != undefined && data.column === 3)
    reactivate(0,true);
}

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
function crateTools(data, x,y){
 // create array of object from data.links with index
  var arr = data.links.map(function(d, i) {
    return {name: d, index: i, x: 800, y: i*70};
  });

  //create node  as circle for each element in array with d3
  tools=   svg.append("g").selectAll("circle")
    .data(arr)
    .enter()
    .append("circle")
    .attr("r", 30)
    .attr("cx", function(d) {return d.x}) 
    .attr("cy", function(d) {return y+ d.y}) 
    .style("fill", "lightblue")
    .style("stroke", "black")
    .attr("z-index", "10")
    ;

    //add labels to each nodes
    svg.append("g").selectAll("text")
    .data(arr)
    .enter()
    .append("text")
    .attr("x", function(d) {return d.x}) 
    .attr("y", function(d) {return y+ d.y}) 
    .text(function(d) {return d.name;})
    .attr("font-family", "helvetica")
    .attr("font-size", "12px")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("vertical-align", "middle")
    .attr("z-index", "0")
    ;
}

function ticked() {
if (tools === undefined) return;
// update tools position base on simulation
}