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
    .linkDistance(140)
    .charge(-200)
    .gravity(.05)
    .size([width, height])
    .on("tick", tick);

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


  
  updateSize(nodes)
  // Update links.
  link = link.data(links, function(d) { return d.target.id; });
  link.exit().remove();
  link.enter().insert("line", ".node")
      .attr("class", "link")
      .attr("opacity", function(d) { 

        if (d.source.size ===0) return  test
        else return 1});;

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
      .on("click", click)
      .on("mouseover", function (d) {ha.on('.zoom', null); ;description.text ( d.text);})
      .on("mouseout", function (d) {ha.call(zoom);description.text ( "");})
      .call(force.drag);



 force.drag().on("dragend", dragend);    
 force.drag().on("dragstart", dragstart);
  nodeEnter.append("rect")
      .attr("opacity", function(d) { 
       if (d.size ===0) return  test
       else return 1})
       .style("stroke",colorStroke)
       ;


// create node with div as child text label
  nodeEnter.append("foreignObject")
      .attr("width", 80)
      //.attr("height", 40)
      .attr("height", function(d){ if (d.text) return Math.sqrt(d.text.length*100); else return 0; })
      .attr("x", function(d) { return -40;})
      //.attr("y", function(d) { return -20;})
      .attr("y", function(d) { if (d.text) return -Math.sqrt(d.text.length*50); else return 0; })
      .attr("opacity", function(d) {
        if (d.size ===0) return  test
        else return 1})
      .append("xhtml:div")
      .attr("class", "node-label")
      .html(function(d) { return d.text; })
    // make text appear in the middle of the div
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("text-align", "center")
      //.style("font-size", function(d) { if (d.text) return Math.sqrt(4000/(d.text.length+1)) + "px"; else return "0px"; })
      .style("font-size", "12px")
// long text is fitting to div size
      .style("word-wrap", "break-word")
      ;
  

  // nodeEnter.append("text")
  //     .attr("dy", ".35em")
  //     .text(function(d) { return d.name; })
  //     .attr("opacity", function(d) { 

  //       if (d.size ===4) return  test
  //       else return 1});

  node.select("rect")
      .style("fill", color)
      ;


  node.selectAll("rect")
       .attr("width", function(d) { return 80;})
       //.attr("height", function(d) { return 40;})
       .attr("height", function(d) {if (d.text) return Math.sqrt(d.text.length*100); else return 0;})
       .attr("x", function(d) { return -40;})
       .attr("y", function(d) {if (d.text) return -Math.sqrt(d.text.length*50); else return 0;})
       .attr("rx", 10)
       .attr("ry", 10);

       // add rectangle to node 


    function dragstart(d) {
      testX = d.x;
    }

  function dragend(d) {
      
    if (testX === d.x)
        {
           return;
        }
    d3.selectAll('rect').each(function(e, i) {
    var distance = Math.sqrt(Math.pow(e.x - d.x, 2) + Math.pow(e.y- d.y, 2));
    var inside = distance < 40 + d.sum * 2;
    if(inside && distance >0)
    {
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
  .gravity(0)
  .start();

};

document.onkeyup = function (e) {
  force.charge(-170)
  .gravity(.05)
  .start();
};

function color(d) {
  return d.selected && d.size ===4 ? "#5EBF71"
      :d.selected && d.size ===3 ? "#83DF78"
      : d.selected && d.size ===2 ? "#B0F578"
      : d.selected && d.size ===1 ? "#D2EB73"
      : d._children && d.size ===3 ? "#ffffff"
      : d._children && d.size ===2 ? "#ffffff"
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
        tools: object.tools
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
       var count =1;
       for (var i =0; i<  node.children.length; ++i)
        {
          if (node.children[i].selected ===true)
          {
            count = count + node.children[i].sum;
          }
        }
        node.sum = count;
     }
     else
     {
       node.sum = 1;
     }
  }
  nodes.forEach(function(item, index){sum(item)});
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

