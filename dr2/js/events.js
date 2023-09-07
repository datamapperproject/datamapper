// Handle click on node
function onActionClick(t,data) {

  //Hide description
  onClosePanel();
  //Update sub nodes (record of previous clicks)
  subNodesArray.forEach( (d, i) => {
    if( d.group === currentGroup && d.column === data.column && d.action === data.action)
        d.count = d.count + increase;
  });
  updateSubNodes(data);

  //Decide what to do depending on the state of the node
  if(link === undefined) {
    createLink (t);
    reactivate(0,false);
    reactivate(1,true);
    crateTools(data, t.cx.baseVal.value,true);
    //dnaUpdate(""); // reset DNA
  } else if  ( data.column === 3){
    updateLink (t);
    reactivate(3, false);
    crateTools(data, t.cx.baseVal.value, false);
  } else {
    updateLink (t);
    createLink (t);
    reactivate(data.column,false);
    reactivate(data.column +1,true);
    crateTools(data, t.cx.baseVal.value, false);
  }
  // Update DNA
  //-dnaUpdate( data.name);
  if(data != undefined && data.column === 3)
    reactivate(0,true);
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

// Handle hover on node
function onActionHover(t,name, data) {

  // if data in description the use it
  cleanName = data.split(" - ")[0];
   if (description.find(d=> d.name == cleanName) !== undefined)
       data = description.find(d=> d.name == cleanName).desc;     

  //Create text with listing links from data
  var decsArray = data.split("|");
  var text = decsArray[0] + "<br>";

  if(decsArray.length > 0)
  for (var i = 1; i < decsArray.length; i++) {
    //add image with name from data
    if(decsArray[i].includes("img"))
      text += "<img src='data/" + decsArray[i].trim() + ".jpg ' width='100%' height='auto' style='margin-top: 5px; margin-bottom: 5px;'>";
    else
      text += decsArray[i] + "<br>";
  }
  //data.links.forEach(function(d) { text += d + "<br>";});

  if(useHistory > 0)
  {
    text += "<br><b> User Reviews</b> <br> ";
    historyData.forEach( (h, i) => {
      if(h.name.includes(name))
      {
    
        var decsArray = h.desc.split("|");
        for (var i = 0; i < decsArray.length; i++) {
          //add image with name from data
          if(decsArray[i].includes("img"))
            text += "<img src='data/" + decsArray[i].trim() + ".jpg ' width='100%' height='auto' style='margin-top: 5px; margin-bottom: 5px;'>";
          else
            text += decsArray[i] + "<br>";
        }
      }
    });
  }
  hoverPanel = document.getElementById("hoverPanel");
  hoverContent = document.getElementById("hoverContent"); 
  hoverPanel.classList.add("block");
  hoverPanel.classList.remove("none");
  hoverContent.innerHTML = text;
}
// Handle hover out of node
function onActionHoverOut() {
  // hoverPanel = document.getElementById("hoverPanel");
  // hoverContent = document.getElementById("hoverContent"); 
  // hoverPanel.classList.remove("block");
  // hoverPanel.classList.add("none");
}

function onClosePanel() {
  hoverPanel = document.getElementById("hoverPanel");
  hoverContent = document.getElementById("hoverContent");
  hoverPanel.classList.remove("block");
  hoverPanel.classList.add("none");
}
// Handle hover on node
function onLinkHover(t,data) {
  //Create text with listing links from data
  var text = data.desc ;

  if(useHistory > 0)
  {
    text += "<br><b> User Reviews</b>  ";
    historyData.forEach( (h, i) => {
      if(h.name.includes(data.sn) && h.name.includes(data.tn))
        text += "<br>" + h.desc + "<br>---";
    });
  }
  hoverPanel = document.getElementById("hoverPanel");
  hoverContent = document.getElementById("hoverContent");
  hoverPanel.classList.add("block");
  hoverPanel.classList.remove("none");
  hoverContent.innerHTML = text;
}
// Handle hover out of node
function onLinkHoverOut() {
  //+hoverPanel.classList.remove("block");
  //+hoverPanel.classList.add("none");
}



// Update the link position base on mouse move
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

function onShowHistory()
{
  console.log("show history");
  useHistory = useHistory* -1;
  // hide subnodes
  // subNode.style("opacity", historyOpacity); 
  // // hide links
  // linktemp.selectAll("line").style("opacity", historyOpacity);

  subNodesArray.forEach( (d, i) => {
      historyData.forEach( (h, i) => {
        if(h.name.includes(d.name) && d.group === h.user)
          d.count = d.count + 1*increase*useHistory;
      });
  });

 // update all linksGroup with new color
 console.log(linksGroup);
 allLinksArray.forEach( (d, i) => {
   historyData.forEach( (h, i) => {
      if(h.name.includes(d.sn) && h.name.includes(d.tn))
      {
         d.count = d.count + 1*increase*useHistory;
        d.color = useHistory >0 ?colorArray[h.user]:"grey";
      }
    });
});

  updateSubNodes();
  updateSubLinks();
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
        .attr("cy", function(d){return 28 +layoutSetup[2].y *pageHeight  +( currentGroup) * 47;})
        .attr("r", 22)
        .style("fill",  groupColorLight)
        .style("stroke", "transparent");
        //add text to circle

        dnaLabels = group.append("g").selectAll("text").data([dnaArray])
        .enter()
        .append("text")
        .attr("x",layoutSetup[2].x*pageWidth +  dnaCounts[currentGroup] * 43)
        .attr("y", function(d){return 28 +layoutSetup[2].y *pageHeight  +( currentGroup) * 47;})
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
      }

      //Listen to any mouse move and update position of hoverPanel if defined
      document.addEventListener("mousemove", function(e){
          // hoverPanel?.attr("x", d=> e.pageX + 2)
          //            .attr("y", d=> e.pageY + 2)
          //           ;
      });

function onDrag(d,i)
{
  //Change positon of the box 
  d.x += d3.event.dx;
  d.y += d3.event.dy;
  d3.select(this).attr("transform", d=> "translate(" + [d.x, d.y] + ")");
  updateGroups(d);
}


function onDragEnd(d,i) {

  //Check for overlap with other elemnts in New Group
  var thisG = document.getElementById(d.name);
  var thisTrans = thisG.getAttribute("transform");
  var tx = parseInt(thisTrans.substring(thisTrans.indexOf("(")+1, thisTrans.indexOf(")")).split(",")[0])
  var ax = parseInt(thisG.getElementsByTagName("rect")[0].getAttribute("x"));
  var thisX = tx + ax;
  var ty = parseInt(thisTrans.substring(thisTrans.indexOf("(")+1, thisTrans.indexOf(")")).split(",")[1]);
  var ay = parseInt(thisG.getElementsByTagName("rect")[0].getAttribute("y"));
  var thisY = ty+ay ;

  // get image from thisG

  var image = thisG.getElementsByTagName("image")[1];
  image.setAttribute("href","ui/unpin.png")

  arenaArray.forEach(function(e){

    if (e.fixed == false || d.fixed == false || e.name == d.name )
        return;

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
        .classed("group-link", true)
        .attr("x1", x + 50)
        .attr("y1", y + 25 )
        .attr("x2", thisX + 50)
        .attr("y2", thisY +25)
        ;

        linkArray.push({"link":newLink, "from":d.name, "to":e.name});
    }
    }
  );
}

function onDragHandle ()
{
return d3.drag()
.on('drag', onDrag)
.on('end', function (d, i) {
  d.fixed = true;
  arenaArray.filter(a=> d.name == a.name && d.index == a.index).fixed = true;
  d3.select(this).fixed = true;

  onDragEnd(d,i);
//  dnaUpdate(name = d3.select(this).select("text").text());
  })
}

//When zoom change replace contatnt of nodes
function onZoom() {

    // select all labels and change font size
    d3.selectAll(".big").classed("hidden", d3.event.transform.k  < 5 || d3.event.transform.k  > 10);
    d3.selectAll("text").classed("hidden", d3.event.transform.k  > 5);
    d3.selectAll(".small").classed("hidden", d3.event.transform.k < 10);
}
