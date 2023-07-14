//create array of objects 
var proms = [
  {name: "sense", type: "verb", column: 0, action:0, active : true, links : ["link A", "link B", "story A", "case A"], desc: "sence can be listened, seen, felt, smelt, tasted"},
  {name: "lifeworlds", type: "subject", column:1, action:0, active : false, links : ["case A"],desc: "lifeworlds are the worlds we live in", src : "10165,-15037,13803,7546"},
  {name:"to describe", type:"verb2", column:2, action:0, active : false, links : ["link B"], desc: "description is a way to understand", src : "10165,-15037,3803,546"},
  {name: "needs & aspirations", type:"object", column:3, action:0 , active :false, links : ["case A"], desc: "needs and aspirations are the things we want"},
  {name: "formulate", type: "verb", column: 0, action:1, active : true, links : ["case C"], desc: "formulation is a way to understand"},
  {name: "concepts", type: "subject", column:1, action:1, active : false, links : ["link C"], desc: "concepts are the things we think"},
  {name:"to frame", type:"verb2", column:2, action:1, active : false, links : ["link D"], desc: "framing is a way to understand"},
  {name: "problems", type:"object", column:3 , action:1, active : false, links : ["story D"], desc: "problems are the things we want to change"},
  {name: "gather", type: "verb", column: 0, action:2, active : true, links : ["link E"], desc: "gathering is a way to understand"},
  {name: "data", type: "subject", column:1, action:2, active : false, links : ["case E"], desc: "data is the things we know"},
  {name:"to analyse", type:"verb2", column:2, action:2, active : false, links : ["link F", "story B"], desc: "analysis is a way to understand"},
  {name: "limits", type:"object", column:3, action:2, active : false , links : ["story B", "link K"], desc: "limits are the things we can't do"},
  {name: "imagine", type: "verb", column: 0, action:3, active : true, links : ["link G"], desc: "imagination is a way to understand"},
  {name: "potentials", type: "subject", column:1, action:3, active : false, links : ["link G"], desc: "potentials are the things we can do"},
  {name:"to create", type:"verb2", column:2, action:3, active : false, links : ["link B", "story C"], desc: "creation is a way to understand"},
  {name: "ideas", type:"object", column:3, action:3 , active : false, links : ["story C", "link A"], desc: "ideas are the things we can do"},
  {name: "craft", type: "verb", column: 0, action:4, active : true, links : ["link H"], desc: "craft is a way to understand"},
  {name: "cases", type: "subject", column:1, action:4, active : false, links : ["link H"], desc: "cases are the things we can do"},
  {name:"to evaluate", type:"verb2", column:2, action:4, active : false, links : ["link D", "story D"], desc: "evaluation is a way to understand"},
  {name: "solutions", type:"object", column:3 , action:4, active : false, links : ["story A", "case A"], desc: "solutions are the things we can do"},
  {name: "empower", type: "verb", column: 0, action:5, active : true, links : ["link I"], desc: "empowerment is a way to understand"},
  {name: "participants", type: "subject", column:1, action:5, active : false, links : ["link I", "link J"], desc: "participants are the things we can do"},
  {name:"to negotiate", type:"verb2", column:2, action:5, active : false, links : ["link F", "story A","case A"], desc: "negotiation is a way to find compromises"},
  {name: "projects", type:"object", column:3 , action:5, active : false, links : ["story C", "story D"], desc: "projects are the things we can do"},
];

layoutSetup = [
  {x: 0, y: 0,w : 25, h : 30}, // header
  {x: 0, y: 30,w : 25, h : 70},  //actions
  {x: 25, y: 0,w : 75, h : 30}, //dna
  {x: 60, y: 30,w : 10, h : 70}, //tools
  {x: 25, y: 30,w : 35, h : 70}, //arena
  {x: 70, y: 30,w : 30, h : 70} //right
];

var toolsList = [
  {name:"urscape"},
  {name:"toolA"},  
  {name:"toolB"},
  {name:"toolC"},
  {name:"toolD"},

];

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
var tools;
var positionArray = [{x:-1, y:0}, {x:1, y:0}, {x:0, y:1}, {x:0, y:-1}];
var colorArray = ["red", "blue", "green", "orange"];
var colorArrayLight = ["ef8b8b", "8b96ef", "a0ef8b", "efcf8b"];
var groupColor = colorArray[0];
var groupColorLight = colorArrayLight[0];
var currentGroup =0;
var increase = 5;
var circleColor = "black";


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
for (var i = 0; i < layoutSetup.length; i++) {
   group.append("rect")
  .attr("x", layoutSetup[i].x + "%")
  .attr("y", layoutSetup[i].y+ "%")
  .attr("width", layoutSetup[i].w+ "%")
  .attr("height", layoutSetup[i].h+ "%")
  .style("fill", "transparent")
  .style("stroke", "black")
  .style("stroke-width", 1)
  ;
}

//create tools from toolsList as rectangles for each element in array with d
var toolsTest = group.append("g").selectAll("rect")
  .data(toolsList)
  .enter()
  .append("g")
  .call(function () {
    return d3.drag().on('drag', function (d, i) {
      if(d.x == undefined) { d.x = 0;d.y = 0;}
         d.x += d3.event.dx;
         d.y += d3.event.dy;
        d3.select(this).attr("transform", function () {
            return "translate(" + [d.x, d.y] + ")";
        });
    })
  }())
  ;
  
  toolsTest.append("rect")
  .attr("x", function(d,i) {
    return  layoutSetup[3].x * pageWidth + 30;
  })
  .attr("y", function(d,i) {
    return  pageHeight * layoutSetup[3].y  + 80 * i +20 ;
  })
  .attr("width", 60)
  .attr("height", 60)
  .style("fill", "white")
  .style("stroke", circleColor )
  .attr("z-index", 100)
  .on("click", function(d) {
    console.log(d);
  })
  ;

  toolsTest.append("text")
  .attr("x", function(d,i) {
    return  layoutSetup[3].x * pageWidth + 60;
  })
  .attr("y", function(d,i) {
    return  pageHeight * layoutSetup[3].y  + 80 * i +20 + 30  ;
  })
  .attr("font-size", "12px")
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("pointer-events", "none")
  .attr("font-family", "helvetica")
  .text( function (d) { return d.name; } )
  .style("pointer-events", "none")
  ;

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
  .on("click", function(d) {  createlink(this,d);}) 
  ;
  //Add sub nodes for count
  var subNode;
  var subNodesArray =  [];
  for (var i = 0; i < colorArray.length; i++) {
    for(var j = 0; j < proms.length; j++) {
      var object = { 
        group: i, 
        count: 0, 
        x: 0,
        column: proms[j].column, 
        action: proms[j].action
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
  .on("click", function(d) {  createlink(this,d);}) 
  .call(wrap, 52);
  ;

//create links between nodes
var link;
function createlink(t,data) {
  // find all elements with group equal to current group from subNodesArray
  subNodesArray.forEach( (d, i) => {
    if( d.group === currentGroup && d.column === data.column && d.action === data.action)
      d.count = d.count + increase;});

  //console.log(index);
  //Update size of all subnodes
  subNode 
  .attr("r", function(d){return d.count })
  .attr("cx", function(d) {
    return pageWidth * layoutSetup[1].x +  d.column *pageWidth * layoutSetup[1].w/5 +70 + positionArray[d.group].x * d.count ;
  })
  .attr("cy", function(d) {
    return pageHeight * layoutSetup[1].y +  d.action*pageHeight * layoutSetup[1].h/7  + 70+ positionArray[d.group].y * d.count ;   
  })
  

  //create line
 if(link === undefined)   
 {
  link = linktemp.append("line")
  .attr("x1", t.cx.baseVal.value)
  .attr("y1", t.cy.baseVal.value)
  .attr("x2", t.cx.baseVal.value)
  .attr("y2", t.cy.baseVal.value)
  .attr("stroke-width",1)
  .attr("stroke", colorArray[currentGroup])
  .style("mix-blend-mode", "darken")
  .attr("opacity", 1)
  .attr("onclick", "this.remove()") //remove line on click
  ;
  reactivate(0,false);
  reactivate(1,true);
  crateTools(data, t.cx.baseVal.value,true);
  dnaUpdate("");
  dnaUpdate( data.name);

 }
  else  if  ( data.column === 3)
  {
    link.attr("x2", t.cx.baseVal.value)
        .attr("y2", t.cy.baseVal.value);
     link = undefined;
     reactivate(3, false);
     crateTools(data, t.cx.baseVal.value, false);
     dnaUpdate( data.name);

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
  .attr("stroke-width",1)
  .attr("stroke", colorArray[currentGroup])
  .style("mix-blend-mode", "darken")
  .attr("opacity", 1)
  .attr("onclick", "this.remove()") //remove line on click
  reactivate(data.column,false);
  reactivate(data.column +1,true);
  crateTools(data, t.cx.baseVal.value, false);
  dnaUpdate( data.name);
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
  .style("stroke-width", t ? 0.7 : 0.5)
  .data()
  .forEach(function(d) {
    d.active = t;
  })
  ;
}

// create tools
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


function crateTools(data, x,firstTime){

   //preparation
   if(firstTime)
   {
     arenaGroup.remove();
     arenaGroup = group.append("g");
     arenaArray = [];
   }
     data.links.map(function(d, i) {
    arenaArray.push( {name: d, index: i, x: 0, y:0});
  });

  //create new nodes
  tools = arenaGroup .selectAll("rect")
    .data(arenaArray)
    .enter().append("g")
    .call(function () {
      return d3.drag().on('drag', function (d, i) {
          d.x += d3.event.dx;
          d.y += d3.event.dy;
          d3.select(this).attr("transform", function () {
              return "translate(" + [d.x, d.y] + ")";
          });
      }).on('end', function (d, i) {
        //change parrent group to rightGroup
        d.x += d3.event.dx;
        d.y += d3.event.dy;
      d3.select(this).remove();

      rightArray.push(d);
      newGroup = rightGroup.selectAll("rect")
      .data(rightArray)
      .enter().append("g")
      .attr("id",function(d){return d.name;})
      .attr("transform", function () { return "translate(" + [d.x, d.y] + ")"; })
      .call(function () {
        return d3.drag().on('drag', function (d, i) {
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            d3.select(this).attr("transform", function () {
                return "translate(" + [d.x, d.y] + ")";
            });
            updateGroups();
        }).on('end', function (d, i) {

          //Check for overlap with other elemnts in New Group
          var thisG = document.getElementById(d.name);
          var thisTrans = thisG.getAttribute("transform");
          var tx = parseInt(thisTrans.substring(thisTrans.indexOf("(")+1, thisTrans.indexOf(")")).split(",")[0])
          var ax = parseInt(thisG.getElementsByTagName("rect")[0].getAttribute("x"));
          var thisX = tx + ax;
          var ty = parseInt(thisTrans.substring(thisTrans.indexOf("(")+1, thisTrans.indexOf(")")).split(",")[1]);
          var ay = parseInt(thisG.getElementsByTagName("rect")[0].getAttribute("y"));
          var thisY = ty+ay ;
          console.log("dragend " +  rightArray.length);
          rightArray.forEach(function(e){
          //Get d3 node by element id
          var g = document.getElementById(e.name);
          var test = g.getAttribute("transform");
          var x = parseInt(test.substring(test.indexOf("(")+1, test.indexOf(")")).split(",")[0])+parseInt(g.getElementsByTagName("rect")[0].getAttribute("x"));
          var y = parseInt(test.substring(test.indexOf("(")+1, test.indexOf(")")).split(",")[1])+parseInt(g.getElementsByTagName("rect")[0].getAttribute("y"));
          var distance = Math.sqrt(Math.pow(x - thisX, 2) + Math.pow(y- thisY, 2));

          if(distance<100 && distance >0)
          {
              //create link between two nodes
              var newLink = LinkGroup.append("line")
              .attr("x1", x + 50)
              .attr("y1", y + 25 )
              .attr("x2", thisX + 50)
              .attr("y2", thisY +25)
              .attr("stroke" ,"#c6c6c6")
              .attr("stroke-width" ,150)
              .attr("stroke-linejoin" ,"round")
              .attr("stroke-linecap" ,"round")
              .attr("stroke-opacity",1)
              ;
              var fromName = d.name;
              var toName = e.name;
              linkArray.push({"link":newLink, "from":fromName, "to":toName});
          }
          }
          );
        })
      
      }())
      ;
      var name =  d3.select(this).select("text").text();
      if(name.includes(".png"))
      {
        // add image to new group
        newGroup.append("svg:image")
        .attr("xlink:href", "data/" +name )
       .attr("width", 100)
        .attr("height", 50)
        .attr("x", d3.select(this).select("rect").attr("x"))
        .attr("y", d3.select(this).select("rect").attr("y"))

      } else{
      newGroup.append("rect")
     .attr("width", 100)
      .attr("height", 50)
      .attr("x", d3.select(this).select("rect").attr("x"))
      .attr("y", d3.select(this).select("rect").attr("y"))
      .style("fill", "lightgrey")
      .style("stroke", "black")
      .attr("z-index", "10")
      
      newGroup.append("text")
      .attr("x", d3.select(this).select("rect").attr("x") )
      .attr("y", d3.select(this).select("rect").attr("y"))
      .attr("dy", "25")
      .attr("dx", "50")
      .attr("font-size", "9px")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("pointer-events", "none")
      .attr("font-family", "helvetica")
      .text( d3.select(this).select("text").text())
      .style("pointer-events", "none")
      ;


      }
      dnaUpdate(name = d3.select(this).select("text").text());
      })
    }())
    ;

    tools.append("svg:image")
      .attr("xlink:href",function(d){ return d.name.includes(".png")?"data/" +d.name:"";})
     .attr("width", 100)
      .attr("height", 50)
      .attr("x", function(d){return layoutSetup[4].x * pageWidth- 50 + x*1.4 }) 
      .attr("y", function(d){return layoutSetup[4].y * pageHeight+ 20+  50 * d.index }) 
   
    tools.append("rect")
   .attr("width", 100)
    .attr("height", 50)
    .attr("x", function(d){return layoutSetup[4].x * pageWidth- 50 + x*1.4 }) 
    .attr("y", function(d){return layoutSetup[4].y * pageHeight+ 20+  50 * d.index }) 
    .style("fill", "transparent")
    .style("stroke", "black")
    .attr("z-index", "10")
    ;

   // add text to rect as child
   tools.append("text")
    .attr("x", function(d){return layoutSetup[4].x * pageWidth- 50 + x*1.4 })
    .attr("y", function(d){return layoutSetup[4].y * pageHeight+ 20+  50 * d.index })
    .attr("font-size", "12px")
    .attr("dy", "25")
    .attr("dx", "50")
    .attr("fill", function(d){ return d.name.includes(".png")?"transparent":"black"})
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("pointer-events", "none")
    .attr("font-family", "helvetica")
    .text( function(d){ return d.name;})
    .style("pointer-events", "none")
    ;
 

}

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

      /* When the user clicks on the button, 
      toggle between hiding and showing the dropdown content */
      function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
      }
      
      // Close the dropdown if the user clicks outside of it
      window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
          var dropdowns = document.getElementsByClassName("dropdown-content");
          var i;
          for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
            }
          }
        }
      }

      function groupChanged(value) {
        groupColor = colorArray[value];
        groupColorLight = colorArrayLight[value];
        currentGroup = value;
      }
      var dnaArray = [];
      var dnaNodes;
      var dnaLabels;
      var dnaCounts = [0,0,0,0];
      function dnaUpdate(input) {
        dnaArray.push(input);
        dnaCounts[currentGroup] = dnaCounts[currentGroup] + 1;

        if (input == "") return;
        dnaNodes = group.append("g")
        .selectAll("circle")
        .data(dnaArray)
        .enter()
        .append("circle")
        .attr("cx",layoutSetup[2].x *pageWidth +  dnaCounts[currentGroup] * 43)
        .attr("cy", function(d){return 28 +( currentGroup) * 47;})
        .attr("r", 22)
        .style("fill",  groupColorLight)
        .style("stroke", "transparent");
        //add text to circle

        dnaLabels = group.append("g").selectAll("text").data([dnaArray])
        .enter()
        .append("text")
        .attr("x",layoutSetup[2].x*pageWidth +  dnaCounts[currentGroup] * 43)
        .attr("y", function(d){return 28 +( currentGroup) * 47;})
        .attr("dy", "0")
        .attr("dx", "0")
        .attr("font-size", "9px")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("pointer-events", "none")
        .attr("font-family", "helvetica")
        .text(function(d){return input;})
        .call(wrap, 44)
        ;



        // dna.text( dna.text() + " " + input[0].toUpperCase() + input.slice(1) + ". "  );
        // dna.call(wrap,  layoutSetup[2].w *pageWidth-10); 
      }
