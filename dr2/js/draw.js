// Draw all links beatween nodes

function drawAllLinks() {

  // itirate throght each proms and draw line to all next proms
  for (var i = 0; i < proms.length; i++) {
    var prom = proms[i];
    var nextProms = proms.filter(function(d) {
      return d.column == prom.column + 1;
    });
    for (var j = 0; j < nextProms.length; j++) {
      var nextProm = nextProms[j];
      var link = {
        source: prom,
        target: nextProm,
        count : 1,
        color : "grey"
      };
      allLinksArray.push(link);
    }
  }
  // Draw all links
  linksBackground=  linksGroup.selectAll("line").data(allLinksArray).enter()
  .append("line")
  .attr("x1", function(d) {
    return pageWidth * layoutSetup[1].x +  d.source.column *pageWidth * layoutSetup[1].w/5 +70 ;
  })
  .attr("y1", function(d) {
    return pageHeight * layoutSetup[1].y +  d.source.action*pageHeight * layoutSetup[1].h/7  + 70;
  })
  .attr("x2", function(d) {
    return pageWidth * layoutSetup[1].x +  d.target.column *pageWidth * layoutSetup[1].w/5 +70 ;
  })
  .attr("y2", function(d) {
    return pageHeight * layoutSetup[1].y +   d.target.action*pageHeight * layoutSetup[1].h/7  + 70;
  })
  .style("stroke", d => d.color)
  .style("stroke-width", d => d.count*0.5)
  .style("opacity", 1)
  .attr("z-index", 0)
  .on("mouseover", function(d) { d3.select(this).style("stroke", "black");onLinkHover(this,d);})
  .on("mouseout", function(d) { d3.select(this).style("stroke", d=>d.color);onLinkHoverOut(this,d);})
  ;
}

// Handle update of the subnodes for each action
function updateSubNodes(data) {

  //Update size of all subnodes
  subNode.attr("r", function(d){return d.count })
    .attr("cx", function(d) {
      return pageWidth * layoutSetup[1].x +  d.column *pageWidth * layoutSetup[1].w/5 +70 + positionArray[d.group].x * d.count ;
    })
    .attr("cy", function(d) {
      return pageHeight * layoutSetup[1].y +  d.action*pageHeight * layoutSetup[1].h/7  + 70+ positionArray[d.group].y * d.count ;   
    });
}

// Handle update of the subnodes for each action
function updateSubLinks(data) {

  //Update size of all subnodes
  linksBackground.style("stroke", d=> d.color)
           .style("stroke-width",  d => d.count*0.2);
}


// Handle creation of the link between nodes
function createLink (t) {
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
}

// Handle update of the link between nodes
function updateLink (t) {
  link.attr("x2", t.cx.baseVal.value)
      .attr("y2", t.cy.baseVal.value); 
  link = undefined;
}

function createLayout() {
  //create layout from layoutSetup
  for (var i = 0; i < layoutSetup.length; i++) {
    layoutGroup .append("rect")
    .attr("x", layoutSetup[i].x + "%")
    .attr("y", layoutSetup[i].y+ "%")
    .attr("width", layoutSetup[i].w+ "%")
    .attr("height", layoutSetup[i].h+ "%")
    .style("fill", "transparent")
    .style("stroke", "white")
    .style("stroke-width", 0)
    ;
  }
}

//create tools from toolsList as rectangles for each element in array with d
function drawTools(){
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
  }


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
     .on("mouseover", d=> onActionHover(this,d.name, " - some description"))
     .on("mouseout", d=> onActionHoverOut(this,d))
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
 
