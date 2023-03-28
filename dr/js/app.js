const svgns = "http://www.w3.org/2000/svg";


// get real size of svg element
var width = document.documentElement.clientWidth,
    height = document.documentElement.clientHeight;
 
 var   root;
 var nodes;
var  i = 0;
var testX =0;
var gi =1;
var test =0;
var force = d3.layout.force()
    .linkDistance(160)
    .charge(-1000)
    .gravity(.02)
    .friction(0.7)
    .linkStrength(0.3)
    .theta(0.1)
    .alpha(0.1)
    .size([width, height])
    .on("tick", tick);


var svg = d3.select("#svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

svg.append("g")
    .attr("class", "groups")
    .attr("id", "groups")
const groupsLayer = document.getElementById("groups");

let zoom = d3.behavior.zoom()
    .on('zoom', handleZoom);

function handleZoom(e) {

      svg.attr('transform', "translate(" + d3.event.translate + ") scale("+  d3.event.scale + ")");
    }
    var ha = d3.select("#svg")

ha.call(zoom);    

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

var buttons;   

// draw crosses on grid 50x50
for (var x = -width ; x <= 2*width; x += 50) {
  for (var y = -height; y <= 2*height; y += 50) {
    //draw little squares
    svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 1,5)
        .attr("fill", "lightgrey")
  }
}

d3.json("graph.json", function(error, json) {
  if (error) throw error;

  root = json;

  init(root);
  update(); // HACK to avoid starting tick from 0 position on default
  collapsed(root);
  update();
});

function update() {

 nodes = flatten(root);
  var links = d3.layout.tree().links(nodes);


  
  //updateSize(nodes);
  // Update links.
  link = link.data(links, function(d) { return d.target.id; });
  link.exit().remove();
  link.enter().insert("line", ".node")
      .attr("id", function(d) { return "link"+ d.target.id;})
      .attr("class", "link")
      .attr("opacity", function(d) { if (d.source.size ===0) return  0;else return 1});;

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .start();

  // Update nodes.
  node = node.data(nodes, function(d) { 

    return d.id; });

 
  node.exit().remove();

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("id", function(d) { return "node"+ d.id;})
      .on("mouseover", function (d) {
        ha.on('.zoom', null);
        //get pin image and set display to flex
        if(d.size>0)
        {        
            d3.select("#pin"+d.id).style("display", "flex");
            d3.select("#x"+d.id).style("display", "flex");
            //d3.select("#thumb"+d.id).style("display", "flex");
        }
        const light = shadeColor(  d.color ,50);
        d3.select("#rect"+d.id).style("fill",light);
        //change opacity of the rect

    })
      .on("mouseout", function (d) {
        ha.call(zoom);
        //get pin image and set display to none if image is not unpin.png
        if(d3.select("#pin"+d.id).attr("xlink:href") === "pin.png")
        {
            d3.select("#pin"+d.id).style("display", "none");
        }
        if(d3.select("#x"+d.id).attr("xlink:href") === "x.png")
        {
            d3.select("#x"+d.id).style("display", "none");
        }
        // if(d3.select("#thumb"+d.id).attr("xlink:href") === "thump.png")
        //     d3.select("#thumb"+d.id).style("display", "none");

        if(d.children|| (d.selected && d.size>0))
        {
          d3.select("#rect"+d.id).style("fill",d.color);
            
        } else
        {
          d3.select("#rect"+d.id).style("fill", "white");
        }
      })
      .call(force.drag);

 force.drag().on("dragend", dragend);    
 force.drag().on("dragstart", dragstart);

  nodeEnter.append("rect")
      .on("click", click)
      .attr("opacity", function(d) { 
       if (d.size ===0) return  0; else return 1})
       .style("stroke",colorStroke)
       ;


// create node with div as child text label
  nodeEnter.append("foreignObject")
      .attr("width", function(d) { return getRectWidth(d) -10})
      .attr("height",  getRectHeight )
      .attr("x", function(d) { return -getRectWidth(d)/2 +5;})
      .attr("y", function(d) { if (d.text) return -getRectHeight(d)/2-5; else return 0; })
      .append("xhtml:div")
      .on("click", click)
      .attr("class", "node-label")
      .html(function(d) { if (d.size === 1 || d.size === 6)  return "<br><br>"  +d.text; 
                          else if  (d.size === 2) return d.text;
                          else return "<b>" + d.name + "</b><br>"  +d.text; })
      .style("text-align", "left")
      .style("font-size", function(d) { if ( d.text.split(" ").length < 4) return "11.5px"; else return "11.5px"; })
      .style("font-family", "Helvetica")
      .style("display", function(d) { if (d.size ===0 ) return  "none"; else return "block";})
      // aligh text to center if count of words is less than 3
      .style("text-align", function(d) { if (d.text.split(" ").length < 4) return "center"; else return "left";})
      .style("width", function(d) { return getRectWidth(d) -10})
      .style("height",  getRectHeight )
      .style("text-overflow", "ellipsis")
      .style("line-height",function(d) { if (d.text.split(" ").length < 4)  return  "1.0em"; else return "1.2em";})
      .style("padding", "3px")
      .style("color", "black")
      // allign text vertically to center if count of words is less than 3
      .style("vertical-align", function(d) { if (d.text.split(" ").length < 4) return "middle"; else return "top";} )
      .style("word-wrap", "break-word")
      ;


     // apped pin to node
  nodeEnter.append("image")
      .attr("xlink:href", "pin.png")
      .attr("id",function(d) { return "pin"+ d.id;})
      .attr("x", function(d) { if(d.size ===6)return -getRectWidth(d)/2 +2 ;return -getRectWidth(d)/2 -11;;})
      .attr("y", function(d) {if(d.size ===6)return  -getRectHeight(d)/2 -10 ; else return -getRectHeight(d)/2-22; })
      .attr("width", 15)
      .attr("height", 15)
      .style("display", "none")
      .on("click", function(d) {       
            if(d.fixed)
             {
                 d.fixed = false;
                 d3.select(this).attr("xlink:href", "pin.png")
              } else
              {
                d.fixed = true;
                d3.select(this).attr("xlink:href", "unpin.png")
         }})
      ;


     // apped x to node
     nodeEnter.append("image")
      .attr("xlink:href", "x.png")
      .attr("id",function(d) { return "x"+ d.id;})
      .attr("x", function(d) { if(d.size ===6)return getRectWidth(d)/2 -20; else return getRectWidth(d)/2 -10;})
      .attr("y", function(d) { if(d.size ===6)return  -getRectHeight(d)/2 -10;return -getRectHeight(d)/2-25;})
      .attr("width", 15)
      .attr("height", 15)
      .style("display", "none")
      .on("click", function(d) {   
            // remove node
            d3.select("#node"+d.id).remove();
            // remove link
            d3.select("#link"+d.id).remove();
            // remove pin
            d3.select("#pin"+d.id).remove();
            // remove x
            d3.select("#x"+d.id).remove();
            // remove thumb
            d3.select("#thumb"+d.id).remove();
            // remove text
            d3.select("#text"+d.id).remove();
            // remove image
            d3.select("#image"+d.id).remove();
     
           })
      ;


      //add image to node
      // nodeEnter.append("image")
      // .attr("xlink:href", "thump.png")
      // .attr("id",function(d) { return "thumb"+ d.id;})
      // .attr("opacity", function(d) {if (d.size ===0) return  0; else return 1})
      // .attr("x", function(d) { return getRectWidth(d)/2 -16;})
      // .attr("y", function(d) { if (d.text) return getRectHeight(d)-26; else return 0; })
      // .attr("width", function(d) { if (d.children === undefined) return 30; else return 0;})
      // .attr("height", function(d) { if (d.children === undefined) return 30; else return 0;})
      // .style("display", function(d) {  return  "none";})
      // .on("click", test)
      // ;

      // // add text to node on position of image
      // nodeEnter.append("text")
      // .attr("id",function(d) { return "text"+ d.id;})
      // .attr("x", function(d) { return getRectWidth(d)/2 -1;;})
      // .attr("y", function(d) { if (d.text) return getRectHeight(d)-8; else return 50; })
      // .attr("width", function(d) { if (d.children === undefined) return 20; else return 0;})
      // .attr("height", function(d) { if (d.children === undefined) return 20; else return 0;})
      // .style("font-size", "12px")
      // .style("fill", "white")
      // .attr("opacity", 0)
      // .text(function(d) { return d.likes; })
      // ;

      function test (d)
      {
        //select the button and update test value
        if(d.children === undefined)
        {
        d.likes += 1;
        d3.select(this).html(d.likes);
        var text = document.getElementById( "text" + d.id);
        text.textContent = d.likes;
        text.setAttribute("opacity", 1);
        document.getElementById( "thumb" + d.id).setAttribute("href", "thumpup.png")
        updateSize(nodes);
        }
      }



    
  node.selectAll("rect")
       .attr("id",function(d) { return "rect"+ d.id;})
       .attr("width", getRectWidth)
       .attr("height", getRectHeight )
       .style("fill", color)
       .attr("x", function(d) { return -getRectWidth(d)/2;})
       .attr("y", function(d) {if (d.text) return -getRectHeight(d)/2-10; else return 0;})
        .attr("rx", function(d) {if (d.size ===6) return 70; else return 0;})
        .attr("ry", function(d) {if (d.size ===6) return 70; else return 0;})
       ;
       

       // add rectangle to node 

    function dragstart(d) {
      testX = d.x;
    }

    // get rect height
    function getRectHeight(d)
    { 
      if(d.text) 
         return d.text.split(" ").length > 8 ? 200 : 70;
      else 
        return 0;
    }
    function getRectWidth(d)
    { 
      if(d.text) 
      {
        if( Math.sqrt(d.text.split(" ").length <9) )return 140;
        else return 200;
         
      } else return 0;
    }

  function dragend(d) {
      
    if (testX === d.x)
        {
           return;
        }
    d3.selectAll('rect').each(function(e, i) {
    var distance = Math.sqrt(Math.pow(e.x - d.x, 2) + Math.pow(e.y- d.y, 2));


    if(distance < 50 && e.id !== d.id )
    {
      console.log("dragend");
      links.push({"source": d , "target": e})
   
      link = link.data(links, function(f) { return f.target.id; });
      link.exit().remove();
      link.enter().insert("line", ".node")
                 .attr("class", "link")
                 .attr("opacity", 1);

      force
           .nodes(nodes)
          .links(links)
           .start();
       
      if(d.groupID)
             e.groupID = d.groupID;
     else if (e.groupID)
              d.groupID = e.groupID; 
      else
        {
          d.groupID = gi;
          e.groupID = gi;
                     ++gi;
        }    
        console.log(" dragging ");
         updateGroups();
        }

      });
      if (d.fixed)
      {
        d.x = d.px = Math.round(d.x / 50) * 50;
        d.y = d.py = Math.round(d.y / 50) * 50;
      }
      }
 
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      ;

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  updateGroups();
}
// document.onkeydown = function (e) {
  
//   force.charge(0)   
//   .gravity(.05)
//   .start();

// };

// document.onkeyup = function (e) {
//   force.charge(-970)
//   .gravity(.05)
//   .start();
// };

function color(d) {
  return d.selected  ? d.color
      : d._children ? "#ffffff"
      : "#ffffff" ; // leaf node
}

function colorStroke(d) {
  return d.selected ? "#999999"
      : "#999999" ; // leaf node
}

// Toggle children on click.
function click(d) {
  if (d3.event.defaultPrevented) return; // ignore drag

  if(d.children === undefined && d.selected)
  {
    inser(d);
    d.selected = true;
    update();
    return;
  } 

  else if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  d.selected = true;
  update();
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

function init(root) {

  function initChildren(node,  pi) {
    node.id = i++;
    node.likes = 0;
    node.pin = false;
    node.parrentIdx = pi;
   
	  if(node.children) {
      node.children.forEach(function(item, index){
        initChildren(item,node.id );
      });
	  }
  }
  initChildren(root,0);

}

function collapsed(root) {
  
  function hideChildren(node) {
	  if(node.children) {
		   node._children = node.children;
		   node.children = null;
      
	   	node._children.forEach(hideChildren);
	  }
  }
  root.children.forEach(hideChildren);
  //hideChildren(root);
}
// Duplicate the node
function inser(object) {

  function check(node) {

	  if(node.id === object.parrentIdx) {

       clone = {
        name: object.name, 
        parrentIdx: object.parrentIdx , 
        children : undefined,
        id : ++i, 
        _children : null,
        size:object.size, 
        index: object.index, 
        selected: true,
        tools: object.tools,
        text: object.text,
        color: object.color,
        likes: 0,
      }
       
       node.children.push(clone);
      }
    else  
    {
      if(node.children != null)
		      node.children.forEach(check);
    }
	 
  }
  check(root);
}

function updateSize(nodes) {

  function sum(node) {
    if(node.children)
     { 
       var count =0;
       for (var i =0; i<  node.children.length; ++i)
        {
            count = count + node.children[i].likes;
        }
        node.likes =  count;
     }

     //update foreiner object  button label of this node
      var thumb = document.getElementById( "thumb" + node.id);
      var text = document.getElementById( "text" + node.id);

      if(thumb && node.children != undefined)
      {
            // Set width of button
            thumb.setAttribute("width",  30 )
            thumb.setAttribute("height",  30)
            thumb.setAttribute("href", "thumpup.png")
            d3.select("#thumb" + node.id).style("display", "flex");
            //set text as likes
            text.textContent = node.likes;
          
           // set text opacity to 1
            text.setAttribute("opacity", 1);

      }

        
  }
  nodes.forEach(function(item, index){sum(item)});
  console.log(nodes);
}

//Assign function to listen slider events
// var slider = document.getElementById("myRange");
// slider.oninput = function() {
//   //TODO
// }

function updateGroups()
{
  //delete previsous
  while (groupsLayer.firstChild) {
    groupsLayer.removeChild(groupsLayer.firstChild);}

  var groups = {};
  function groupsCollect(child)
  {
     if(child.children )
        {
          for(var i =0; i< child.children.length;++i)
          {
            if(child.children[i].groupID)
            {
              if(groups[child.children[i].groupID])
              {
                groups[child.children[i].groupID] += " " + child.children[i].x+","+child.children[i].y;
              } else
              {
                groups[child.children[i].groupID]= child.children[i].x+","+child.children[i].y ;
              }
          }
          }
        }
     if(child.children)
          child.children.forEach(groupsCollect)
  } 
   d3.selectAll(".node").data().forEach(groupsCollect);

   for (var key in groups) {

    let poly = document.createElementNS(svgns ,'polyline');
     poly.id = key;
     poly.setAttributeNS(null, "points", groups[key]);
     poly.setAttributeNS(null, "fill", "none");
     poly.setAttribute ("stroke" ,"#c6c6c6");
     poly.setAttribute ("stroke-width" ,280);
     poly.setAttribute ("stroke-linejoin" ,"round");
     poly.setAttribute ("stroke-linecap" ,"round");
     poly.setAttribute ("stroke-opacity" ,.3);
     groupsLayer.append(poly);

     // change link to dashed line on hover
      poly.addEventListener("mouseover", function(e) {

        // keep mouse position (withou D3)
        var mouseX =  e.clientX;
        var mouseY =  e.clientY;
 
        // Wait for 2 seconds before stopping the force
        setTimeout(function() {
          // Check if the mouse is still in the same position
          if (mouseX == e.clientX && mouseY == e.clientY) {
            force.stop();
            e.target.setAttribute ("stroke" ,"red");

          }
        }, 1000);
      }
      );

      poly.addEventListener("mouseend", function(e) {
        force.start();
  
          e.target.setAttribute ("stroke" ,"#c6c6c6");
        
      }
      );


     // delete link outline on click
      poly.addEventListener("click", function(e) {
        var id = e.target.id;
        force.stop();
        var node = d3.selectAll(".node").data().find(function(item){return item.groupID == id});
        if(node)
        {
          node.groupID = undefined;
          update();
        }
      }   



    );
    }
}


function shadeColor(color, amount) {

  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));

}