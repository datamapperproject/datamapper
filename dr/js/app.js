const svgns = "http://www.w3.org/2000/svg";



var width = 1200,
    height = 700,
    root;
 var nodes;
var  i = 0;
var testX =0;
var gi =1;
var test =0;
var force = d3.layout.force()
    .linkDistance(50)
    .charge(-900)
    .gravity(.05)
    .friction(0.8)
    .linkStrength(0.2)
    .theta(0.8)
    .alpha(0.1)
    .size([width, height])
    .on("tick", tick);

// make force move slower

var svg = d3.select("#svg")
    .attr("width", width)
    .attr("height", height).append("g");
svg.append("g")
    .attr("class", "groups")
    .attr("id", "groups")
const groupsLayer = document.getElementById("groups");

var description = d3.select("#svg").append("text")
    .attr("dy", "12")
    .attr("dx", width/2)
    .attr("class", "description")
    .text(function(d) { return "description"; });

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

// draw grid 100x100
for (var x = 0; x <= width; x += 100) {
    svg.append("line")
        .attr("x1", x)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", height)
        .attr("stroke", "lightgrey")
        .attr("stroke-width", 1)
        .attr("opacity", 0.5);
}
for (var y = 0; y <= height; y += 100) {
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", width)
        .attr("y2", y)
        .attr("stroke", "lightgrey")
        .attr("stroke-width", 1)
        .attr("opacity", 0.5);
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
      .on("mouseover", function (d) {ha.on('.zoom', null);})
      .on("mouseout", function (d) {ha.call(zoom);})
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
      .attr("width", 70)
      .attr("height", function(d){ if (d.text) return Math.sqrt(d.text.length*100); else return 0; })
      .attr("x", function(d) { return -35;})
      .attr("y", function(d) { if (d.text) return -5; else return 0; })
      .append("xhtml:div")
      .on("click", click)
      .attr("class", "node-label")
      .html(function(d) { return d.text; })
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("text-align", "center")
      .style("font-size", "12px")
      .style("display", function(d) { if (d.size ===0) return  "none"; else return "flex";})
      .style("word-wrap", "break-word")
      ;


     // apped image to node
  nodeEnter.append("image")
      .attr("xlink:href", "pin.png")
      .attr("id",function(d) { return "pin"+ d.id;})
      .attr("x", function(d) { return -47;})
      .attr("y", function(d) { if (d.text) return -20 ; else return 0; })
      .attr("width", 15)
      .attr("height", 15)
      .style("display", function(d) { if (d.size ===0) return  "none"; else return "flex";})
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


      //add image to node
      nodeEnter.append("image")
      .attr("xlink:href", "thump.png")
      .attr("id",function(d) { return "thumb"+ d.id;})
      .attr("opacity", function(d) {if (d.size ===0) return  0; else return 1})
      .attr("x", function(d) { return 20;})
      .attr("y", function(d) { if (d.text) return -35; else return 0; })
      .attr("width", function(d) { if (d.children === undefined) return 30; else return 0;})
      .attr("height", function(d) { if (d.children === undefined) return 30; else return 0;})
      .style("display", function(d) { if (d.size ===0) return  "none"; else return "flex";})
      .on("click", test)
      ;

      // add text to node on position of image
      nodeEnter.append("text")
      .attr("id",function(d) { return "text"+ d.id;})
      .attr("x", function(d) { return 35;})
      .attr("y", function(d) { if (d.text) return -15; else return 50; })
      .attr("width", function(d) { if (d.children === undefined) return 20; else return 0;})
      .attr("height", function(d) { if (d.children === undefined) return 20; else return 0;})
      .style("display", function(d) { if (d.size ===0) return  "none"; else return "flex";})
      .style("font-size", "12px")
      .style("fill", "white")
      .text(function(d) { return d.likes; })
      ;

      function test (d)
      {
        //select the button and update test value
        if(d.children === undefined)
        {
        d.likes += 1;
        d3.select(this).html(d.likes);
        var text = document.getElementById( "text" + d.id);
        text.textContent = d.likes;
        document.getElementById( "thumb" + d.id).setAttribute("href", "thumpup.png")
        updateSize(nodes);
        }
      }

  node.select("rect")
      .style("fill", color)
      ;

    
  node.selectAll("rect")
       .attr("width", function(d) { return 80;})
       .attr("height", function(d) {if (d.text) return Math.sqrt(d.text.length*100) +10; else return 0;})
       .attr("x", function(d) { return -40;})
       .attr("y", function(d) {if (d.text) return -10; else return 0;})
       .attr("rx", 10)
       .attr("ry", 10);

       // add rectangle to node 

    function dragstart(d) {
      testX = d.x;
      // if (d.fixed)
      // {
      // d.x = d.px = Math.round(d.x / 100) * 100;
      // d.y = d.py = Math.round(d.y / 100) * 100;
      // }
    }

  function dragend(d) {
      
    if (testX === d.x)
        {
           return;
        }
    d3.selectAll('rect').each(function(e, i) {
    var distance = Math.sqrt(Math.pow(e.x - d.x, 2) + Math.pow(e.y- d.y, 2));

    console.log(distance)
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
      d.x = d.px = Math.round(d.x / 100) * 100;
      d.y = d.py = Math.round(d.y / 100) * 100;
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
document.onkeydown = function (e) {
  
  force.charge(0)   
  .gravity(.05)
  .start();

};

document.onkeyup = function (e) {
  force.charge(-970)
  .gravity(.05)
  .start();
};

// function color(d) {
//   return d.selected && d.size ===4 ? "#5EBF71"
//       :d.selected && d.size ===3 ? "#83DF78"
//       : d.selected && d.size ===2 ? "#B0F578"
//       : d.selected && d.size ===1 ? "#D2EB73"
//       : d._children && d.size ===3 ? "#ffffff"
//       : d._children && d.size ===2 ? "#ffffff"
//       : "#ffffff" ; // leaf node
// }


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
        size:1, 
        index: object.index, 
        selected: true,
        tools: object.tools,
        text: object.text,
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
      console.log(thumb);
      if(thumb && node.children != undefined)
      {
            // Set width of button
            thumb.setAttribute("width",  30 )
            thumb.setAttribute("height",  30)
            thumb.setAttribute("href", "thumpup.png")
            //set text as likes
            text.textContent = node.likes;

      }

        
  }
  nodes.forEach(function(item, index){sum(item)});
  console.log(nodes);
}

//Assign function to listen slider events
var slider = document.getElementById("myRange");
slider.oninput = function() {
  //TODO
}

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
     poly.setAttribute ("stroke-width" ,100);
     poly.setAttribute ("stroke-linejoin" ,"round");
     poly.setAttribute ("stroke-linecap" ,"round");
     poly.setAttribute ("stroke-opacity" ,.3);
     groupsLayer.append(poly);
   }
}

