//create array of objects 
var proms = [
  {name: "sense", type: "verb", column: 0, action:0, active : true, links : ["linkA", "linkB"], desc: "sence can be listened, seen, felt, smelt, tasted"},
  {name: "lifeworlds", type: "subject", column:1, action:0, active : false, links : ["linkA"],desc: "lifeworlds are the worlds we live in"},
  {name:"to describe", type:"verb2", column:2, action:0, active : false, links : ["linkB"], desc: "description is a way to understand"},
  {name: "needs and aspirations", type:"object", column:3, action:0 , active :false, links : ["toolA"], desc: "needs and aspirations are the things we want"},
  {name: "formulate", type: "verb", column: 0, action:1, active : true, links : ["linkC"], desc: "formulation is a way to understand"},
  {name: "concepts", type: "subject", column:1, action:1, active : false, links : ["linkC"], desc: "concepts are the things we think"},
  {name:"to frame", type:"verb2", column:2, action:1, active : false, links : ["linkD"], desc: "framing is a way to understand"},
  {name: "problems", type:"object", column:3 , action:1, active : false, links : ["toolD"], desc: "problems are the things we want to change"},
  {name: "gather", type: "verb", column: 0, action:2, active : true, links : ["linkE"], desc: "gathering is a way to understand"},
  {name: "data", type: "subject", column:1, action:2, active : false, links : ["linkE"], desc: "data is the things we know"},
  {name:"to analyse", type:"verb2", column:2, action:2, active : false, links : ["linkF", "toolB"], desc: "analysis is a way to understand"},
  {name: "limits", type:"object", column:3, action:2, active : false , links : ["toolB", "linkK"], desc: "limits are the things we can't do"},
  {name: "imagine", type: "verb", column: 0, action:3, active : true, links : ["linkG"], desc: "imagination is a way to understand"},
  {name: "potentials", type: "subject", column:1, action:3, active : false, links : ["linkG"], desc: "potentials are the things we can do"},
  {name:"to create", type:"verb2", column:2, action:3, active : false, links : ["linkB", "toolC"], desc: "creation is a way to understand"},
  {name: "ideas", type:"object", column:3, action:3 , active : false, links : ["toolC", "linkA"], desc: "ideas are the things we can do"},
  {name: "craft", type: "verb", column: 0, action:4, active : true, links : ["linkH"], desc: "craft is a way to understand"},
  {name: "cases", type: "subject", column:1, action:4, active : false, links : ["linkH"], desc: "cases are the things we can do"},
  {name:"to evaluate", type:"verb2", column:2, action:4, active : false, links : ["linkD", "toolD"], desc: "evaluation is a way to understand"},
  {name: "solutions", type:"object", column:3 , action:4, active : false, links : ["toolA"], desc: "solutions are the things we can do"},
  {name: "empower", type: "verb", column: 0, action:5, active : true, links : ["linkI"], desc: "empowerment is a way to understand"},
  {name: "participants", type: "subject", column:1, action:5, active : false, links : ["linkI"], desc: "participants are the things we can do"},
  {name:"to negotiate", type:"verb2", column:2, action:5, active : false, links : ["linkF", "toolA"], desc: "negotiation is a way to find compromises"},
  {name: "projects", type:"object", column:3 , action:5, active : false, links : ["toolC"], desc: "projects are the things we can do"},
];


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
var nodes = group.selectAll("rect")
  .data(proms)
  .enter()
  .append("rect")
  .attr("width", 100)
  .attr("height",25)
  .attr("x", function(d) {
    return d.column * 200 + 50;
  })
  .attr("y", function(d) {
    return d.action * 30 + 50;   
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
    return d.column * 200 + 100;
  })
  .attr("y", function(d) {
    return d.action * 30 + 65;
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
  .attr("x1", t.x.baseVal.value)
  .attr("y1", t.y.baseVal.value)
  .attr("x2", t.x.baseVal.value)
  .attr("y2", t.y.baseVal.value)
  .attr("stroke-width",4)
  .attr("stroke", "black")
  .attr("opacity", 0.2)
  .attr("onclick", "this.remove()") //remove line on click
  ;
  reactivate(0,false);
    reactivate(1,true);
 }
  else  if  ( data.column === 3)
    {
      console.log("end");
      link.attr("x2", t.x.baseVal.value)
          .attr("y2", t.y.baseVal.value);
       link = undefined;
       reactivate(3, false);
       crateTools(data, t.x.baseVal.value, t.y.baseVal.value);
    }
    
    else {

    link.attr("x2", t.x.baseVal.value)
        .attr("y2", t.y.baseVal.value);
    link = undefined;

    link = linktemp.append("line")
    .attr("x1", t.x.baseVal.value)
    .attr("y1", t.y.baseVal.value)
    .attr("x2", t.x.baseVal.value)
    .attr("y2", t.y.baseVal.value)
    .attr("stroke-width",4)
    .attr("stroke", "black")
    .attr("opacity", 0.2)
    .attr("onclick", "this.remove()") //remove line on click

    reactivate(data.column,false);
    reactivate(data.column +1,true);
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
document.onmousedown = function(e){


  if(link === undefined) return;

  var node = document.elementFromPoint( e.pageX, e.pageY);
  var data = d3.select(node).data()[0];

  if(node.tagName !== "rect" || !data.active) {
    link.remove();
    link = undefined;
    reactivate(0,true);
    reactivate(1, false);
    reactivate(2, false);
    reactivate(3, false);
  }
  else if  ( data.column === 3)
  {
    link.attr("x2", node.x.baseVal.value)
        .attr("y2", node.y.baseVal.value);
    link = undefined;
    reactivate(3, false);
    crateTools(data, node.x.baseVal.value, node.y.baseVal.value);
  }
  else {
    link.attr("x2", node.x.baseVal.value)
        .attr("y2", node.y.baseVal.value);
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
var toolsText;
function crateTools(data, x,y){
 // create array of object from data.links with index
  var arr = data.links.map(function(d, i) {
    return {name: d, index: i, x: 800, y: i*70};
  });

  //create node  as circle for each element in array with d3
  var x = Math.random()*1000;
  var y = 500 + Math.random()*250;
  tools=   group.append("g").selectAll("circle")
    .data(arr)
    .enter()
    .append("circle")
    .attr("r", 30)
    .attr("cx", function(d) {return x + 100 * d.index;}) 
    .attr("cy", function(d) {return y}) 
    .style("fill", "lightblue")
    .style("stroke", "black")
    .attr("z-index", "10")
    ;

    //add labels to each nodes
    toolsText = group.append("g").selectAll("text")
    .data(arr)
    .enter()
    .append("text")
    .attr("x", function(d) {return x+ 100 * d.index;}) 
    .attr("y", function(d) {return y}) 
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

