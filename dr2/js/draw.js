// Draw all links beatween nodes

function drawAllLinks(json) {

  var proms = json.proms.filter(function(d) {
    return d.column == 0;
  });
  var nextProms = json.proms.filter(function(d) {
    return d.column == 3;
  });
  // itirate throght each proms and draw line to all next proms
  for (var i = 0; i < proms.length; i++) {

    for (var j = 0; j < nextProms.length; j++) {
      var link = {
        desc: proms[i].desc + "<br>" + nextProms[j].desc,
        sx: proms[i].column * pageWidth * layoutSetup[1].w / 5,
        sy: proms[i].action * pageHeight * layoutSetup[1].h / 7,
        tx: nextProms[j].column * pageWidth * layoutSetup[1].w / 5,
        ty: nextProms[j].action * pageHeight * layoutSetup[1].h / 7,
        sn: proms[i].name,
        tn: nextProms[j].name,
        count : 1,
        color : "transparent"
      };
      allLinksArray.push(link);
    }
    //create link for all
    // if(json.proms[i].column == 0)
    // {
    //    var link = {
    //      desc: json.description.find(d=> d.name == json.proms[i].name + "Axis").desc,
    //      sx: json.proms[i].column * pageWidth * layoutSetup[1].w / 5 -50,
    //      sy: json.proms[i].action * pageHeight * layoutSetup[1].h / 7,
    //      tx: json.proms[i].column * pageWidth * layoutSetup[1].w / 5 -35,
    //      ty: json.proms[i].action * pageHeight * layoutSetup[1].h / 7,
    //      sn: json.proms[i].name,
    //      tn: json.proms[i].name,
    //      count : 1,
    //      color : "grey"
    //    };
    //    allLinksArray.push(link);
    // }
  }
  // Draw all links
  linksBackground=  linksGroup.selectAll("line")
  .data(allLinksArray)
  .enter()
  .append("line")
  .classed("bgLink", true)
  .attr("x1", d=> pageWidth * layoutSetup[1].x + d.sx + 70)
  .attr("y1", d=> pageHeight * layoutSetup[1].y + d.sy  + 70)
  .attr("x2", d=> pageWidth * layoutSetup[1].x + d.tx  + 70 )
  .attr("y2", d=> pageHeight * layoutSetup[1].y + d.ty  + 70)
  .style("stroke", d => d.color)
  .style("stroke-width", d => d.count)
  .style("opacity", 1)
  .attr("z-index", 0)
  .on("mouseover", function(d) { d3.select(this).style("stroke-width", d => d.count*5);onLinkHover(this,d);})
  .on("mouseout", function(d) { d3.select(this).style("stroke-width", d => d.count);onLinkHoverOut(this,d);})

  ;
}


//create node  as circle for each element in array with d3
function drawNodes(json) {
  console.log(json);
  nodes = group.append("g").selectAll("ellipse")
    .data(json.proms)
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
    .on("click", function(d) {  onActionClick(this,d, json);}) 
  // change color of node to grey when mouse is over
    .on("mouseover", function(d) {
      d3.select(this).style("fill", "lightgrey");
      onActionHover(this,d.name, d.desc, json);
    })
    .on("mouseout", function(d) {
      d3.select(this).style("fill", "white");
      onActionHoverOut(this,d);
    })
    ;
  
    //Add sub nodes for count
  
    for (var i = 0; i < colorArray.length; i++) {
      for(var j = 0; j < json.proms.length; j++) {
        var object = { 
          group: i, 
          count: 0, 
          x: 0,
          column: json.proms[j].column, 
          action: json.proms[j].action,
          name: json.proms[j].name
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
  labels = group.append("g").selectAll("text")
    .data(json.proms)
    .enter()
    .append("text")
    .attr("x", function(d) {
      return pageWidth * layoutSetup[1].x +  d.column *pageWidth * layoutSetup[1].w/5 +70 ;
    })
    .attr("y", function(d) {
      return pageHeight * layoutSetup[1].y +  d.action*pageHeight * layoutSetup[1].h/7  + 55 - d.name.split("&").length * 5+7;   
    })
    .text(d=> d.name)
    .attr("font-family", "helvetica")
    .attr("font-size", "9px")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("vertical-align", "middle")
    .attr("z-index", 0)
    .attr("pointer-events", "none")
    .on("click", function(d) {  onActionClick(this,d, json);}) 
    .call(wrap, 2);
    ;

    group.append("g").append("g").selectAll("foreignObject")
    .data(json.proms)
    .enter()
    .append("foreignObject")
    .classed("big", true)
    .classed("hidden", true)
    .attr("width",35)
    .attr("height",35)
    .attr("x", function(d) {
      return pageWidth * layoutSetup[1].x +  d.column *pageWidth * layoutSetup[1].w/5 +52 ;
    })
    .attr("y", function(d) {
      return pageHeight * layoutSetup[1].y +  d.action*pageHeight * layoutSetup[1].h/7 +52;   
    })
    .append("xhtml:div")
    .style("font", "2px 'Helvetica Neue'")
    .style("color", "black")
    .attr("max-height",35)
    .style("display", "block")
    .style("overflow-y", "auto")
    .html(d=>d.desc)
    ;

    group.append("g").append("g").selectAll("foreignObject")
    .data(json.proms)
    .enter()
    .append("foreignObject")
    .classed("small", true)
    .classed("hidden", true)
    .attr("width",35)
    .attr("height",35)
    .attr("x", function(d) {
      return pageWidth * layoutSetup[1].x +  d.column *pageWidth * layoutSetup[1].w/5 +52 ;
    })
    .attr("y", function(d) {
      return pageHeight * layoutSetup[1].y +  d.action*pageHeight * layoutSetup[1].h/7 +52;   
    })
    .append("xhtml:div")
    .style("font", "1px 'Helvetica Neue'")
    .style("color", "black")
    .attr("max-height",35)
    .style("display", "block")
    .style("overflow-y", "auto")
    .html(d=>d.desc)
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



function crateTools(data, x, clearUnfixed, json)
{
    // remove all unfixed nodes
    if(clearUnfixed)
    {
      arenaGroup.selectAll("g").filter(d=> d.fixed == false).remove();
      arenaArray = arenaArray.filter(d=> d.fixed == true);
    }
    // update arena array
    data.links.map(function(d, i) {
      arenaArray.push( {name: d, index: i, x: 0, y:0, fixed: false});
    });
 
  //create new nodes
  tools = arenaGroup .selectAll("rect")
    .data(arenaArray)
    .enter().append("g")
    .attr("id", d=> d.name)
    .attr("transform", d=> "translate(" + [d.x, d.y] + ")")
    .attr("z-index", 10)
    .on("mouseover", d=> onActionHover(this, d.name, d.name, json))
    .on("mouseout", d=> onActionHoverOut(this,d))
    .call(onDragHandle ())
    ;

  // create rect for each element in array with d  
  tools.append("rect")
    .attr("width", pageWidth*10)
     .attr("height" ,pageWidth*5)
     .attr("x", d=> layoutSetup[4].x * pageWidth- 50 + x*1.4 ) 
     .attr("y", d=> layoutSetup[4].y * pageHeight+ 20+  80 * d.index ) 
     .style("fill", d=> d.name.includes(".jpg")?"transparent":"white")
     .style("stroke", d=> d.name.includes(".jpg")?"transparent":"black")
     .attr("z-index", "10")
     ;

  // add image to new group
  tools.append("svg:image")
    .attr("xlink:href",d=> d.name.includes("jpg")?"data/" +d.name:"")
    .attr("width", pageWidth*10)
    .attr("height" ,pageWidth*5)
    .attr("x", d=>layoutSetup[4].x * pageWidth- 50 + x*1.4 ) 
    .attr("y", d=>layoutSetup[4].y * pageHeight+ 20+ 75 * d.index ) 
    ;
  // add text to rect as child
  tools.append("text")
    .attr("x", d=>layoutSetup[4].x * pageWidth- 50 + x*1.4 )
    .attr("y", d=> layoutSetup[4].y * pageHeight+ 20+  75 * d.index )
    .attr("font-size", "12px")
    .attr("dy", "25")
    .attr("dx", "50")
    .attr("fill", d=> d.name.includes(".jpg")?"transparent":"black")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("pointer-events", "none")
    .attr("font-family", "helvetica")
    .text( d=> d.name)
    .style("pointer-events", "none")
    ;

  // add pin button
  tools.append("svg:image")
  .classed("pin", true)
  .attr("xlink:href","ui/pin.png")
  .attr("width", 15)
  .attr("height" ,15)
  .attr("z-index", 100)
  .attr("x", d=>layoutSetup[4].x * pageWidth- 50 + x*1.4 )
  .attr("y", d=> layoutSetup[4].y * pageHeight+ 20+  75 * d.index -13 )
  .on("click", function(d) {

    var isFixed = d3.select(this).fixed;
    d.fixed = !isFixed ;
    arenaArray.filter(a=> d.name == a.name && d.index == a.index).fixed = !isFixed ;
    d3.select(this).fixed = !isFixed ;
    d3.select(this).attr("xlink:href",isFixed ?"ui/pin.png" :"ui/unpin.png")
    ;
  })
  ;
  
 
 }

 
