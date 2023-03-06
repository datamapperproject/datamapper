const radius = 5;
var data = [];
var cleanData = [];
var adjustArray = [{x:0, y:1},{x:-1, y:-1},{x:1, y:-1},{x:0, y:-3},{x:-2, y:1},{x:2, y:1},{x:-1, y:3},{x:1, y:3},{x:3, y:-1},{x:-3, y:-1} ,{x:2, y:-3},{x:-2, y:-3}];
var svgns = "http://www.w3.org/2000/svg";
var svg = document.getElementById('svg');
var sr =  document.getElementById("spatialResolutionID");
var tr =  document.getElementById("temporalResolutionID");

var fromYearEl =  document.getElementById("fromYearID");
var toYearEl =  document.getElementById("toYearID");
var fromMonthEl =  document.getElementById("fromMonthID");
var toMonthEl =  document.getElementById("toMonthID");
var fromDayEl =  document.getElementById("fromDayID");
var toDayEl =  document.getElementById("toDayID");
var fromHourEl =  document.getElementById("fromHourID");
var toHourEl =  document.getElementById("toHourID");
var fromMinuteEl =  document.getElementById("fromMinuteID");
var toMinuteEl =  document.getElementById("toMinuteID");

var nameInput =  document.getElementById("nameID");
var landuseInput =  document.getElementById("landuseID");
var typeInput =  document.getElementById("typeID");
var sourceInput =  document.getElementById("sourceID");
var linkInput =  document.getElementById("linkID");
var spatialExtendEl = document.getElementById("spatialExtendID");
var spatialExtendTextEl = document.getElementById("spatialExtendTextID");
var contactInput =  document.getElementById("contactID");
var issuesInputEl =  document.getElementById("issuesID");
var issuesTextEl =  document.getElementById("issuesTextID");
console.log(issuesTextEl)
var unitsInputEl =  document.getElementById("unitID");
var unitsTextEl =  document.getElementById("customUnitID");
var panel =  document.getElementById("panelID");
var productInputEl =  document.getElementById("producID");
var productTextEl =  document.getElementById("productTextID");
var sourceInputEl =  document.getElementById("sourceID");
var sourceTextEl =  document.getElementById("sourceTextID");
drawLines();

function getSelected(selectEl, textEl) {
  var text = textEl.value;
  var selection = selectEl.options[selectEl.selectedIndex].text;
  if (selection === "Other") {
    return text;
  } else {
    return selection;
  }
}

function enable() {
    var record = {
        srv: sr.selectedIndex, 
        spatialResolution : sr.options[sr.selectedIndex].text,
        trv: tr.selectedIndex, 
        temporalResolution : tr.options[tr.selectedIndex].text,
        count : dataExists(sr.options[sr.selectedIndex].text,  tr.options[tr.selectedIndex].text),
        landuse : landuseInput.options[landuseInput.selectedIndex].text,
        type : typeInput.options[landuseInput.selectedIndex].text,
        name: nameInput.value,
        source: getSelected(sourceInputEl, sourceTextEl),
        link: linkInput.value,
        spatialExtendType: spatialExtendEl.value,
        spatialExtendLocaltion: spatialExtendTextEl.value,
        minTimeExtend: fromYearEl.value + "-" + fromMonthEl.value + "-" + fromDayEl.value + " " + fromHourEl.value + ":" + fromMinuteEl.value,
        maxTimeExtend:toYearEl.value + "-" + toMonthEl.value + "-" + toDayEl.value + " " + toHourEl.value + ":" + toMinuteEl.value,
        issues: getSelected(issuesInputEl, issuesTextEl),
        contact: contactInput.value,
        units: getSelected(unitsInputEl, unitsTextEl),
        product: getSelected(productInputEl, productTextEl),
        timeStamp: new Date(),
        draw: true,
     } 

     var cleanRecord = {
      spatialResolution : sr.options[sr.selectedIndex].text,
      temporalResolution : tr.options[tr.selectedIndex].text,
      landuse : landuseInput.options[landuseInput.selectedIndex].text,
      fileType : typeInput.options[landuseInput.selectedIndex].text,
      fullName: nameInput.value,
      source: getSelected(sourceInputEl, sourceTextEl),
      link: linkInput.value,
      spatialExtendType: spatialExtendEl.value,
      spatialExtendLocaltion: spatialExtendTextEl.value,
      minTimeExtend: fromYearEl.value + "-" + fromMonthEl.value + "-" + fromDayEl.value + " " + fromHourEl.value + ":" + fromMinuteEl.value,
      maxTimeExtend:toYearEl.value + "-" + toMonthEl.value + "-" + toDayEl.value + " " + toHourEl.value + ":" + toMinuteEl.value,
      issues: getSelected(issuesInputEl, issuesTextEl),
      contact: contactInput.value,
      product: getSelected(productInputEl, productTextEl),
      timeStamp: new Date(),
      dataUnits: getSelected(unitsInputEl, unitsTextEl),
   } 
     data.push(record);
     cleanData.push(cleanRecord)
     updateGraph();
}

function dataExists(srt, trt){
  var id = 0;
  for(var i=0; i<data.length; i++){
      if(data[i].spatialResolution === srt 
        && data[i].temporalResolution === trt) 
         id = id +1;
  }
  return id;
}

function drawLines() {

  for (let i =0; i< tr.length;i++)
  {
    var label = document.createElementNS(svgns, 'text');
    label.setAttributeNS(null, 'x', '1%');
    label.setAttributeNS(null, 'y', 5 +  i/tr.length * 90 + '%');
    label.setAttributeNS(null, 'font-size', '10px');
    label.innerHTML = tr.options[i].text;
    svg.appendChild(label);
  }
  for (let i =0; i< sr.length;i++)
  {
    var label = document.createElementNS(svgns, 'text');
    label.setAttributeNS(null, 'x', 13 +i/sr.length * 85 + '%');
    label.setAttributeNS(null, 'y', '95%');
    label.setAttributeNS(null, 'font-size', '10px');
    label.innerHTML = sr.options[sr.length - (i+1)].text;
    svg.appendChild(label);
  }
}

function updateGraph()
{
    // iterate thru all data and create circle for each record
    for (let i =0; i< data.length;i++)
    {
      //? var box = svg.getBoundingClientRect();
      if(data[i].draw && data[i].count <adjustArray.length )
      {
        var circle = document.createElementNS(svgns, 'circle');
        var adjust = adjustArray[data[i].count];
        var x = 90 - data[i].srv /sr.length *85 + adjust.x;
        var y =  5 +data[i].trv /tr.length *90+ adjust.y;
        circle.setAttributeNS(null, 'cx', x + '%');
        circle.setAttributeNS(null, 'cy', y+'%');
        circle.setAttributeNS(null, 'height', '50');
        circle.setAttributeNS(null, 'width', '50');
        circle.setAttributeNS(null, 'fill', 'black');
        circle.setAttributeNS(null, 'r', radius +'');
        circle.addEventListener("mouseenter", (e) =>  mouseEnter(e,data[i]));
        circle.addEventListener("mouseout", mouseExit);
        svg.appendChild(circle);
        data[i].draw = false;
      }
    }

    //itirate trru all combination of data and draw conenction of product

    for (let i =0; i< data.length;i++)
    {
      for (let j =0; j< data.length;j++)
      {
         if(data[i].product === data[j].product && data[i].fullName !== data[j].fullName)
         {
             var line = document.createElementNS(svgns, 'line');
             var adjust1 = adjustArray[data[i].count];
             var x1 = 90 - data[i].srv /sr.length *85 + adjust1.x;
             var y1 =  5 +data[i].trv /tr.length *90+ adjust1.y;

             var adjust2 = adjustArray[data[j].count];
             var x2 = 90 - data[j].srv /sr.length *85 + adjust2.x;
             var y2 =  5 +data[j].trv /tr.length *90+ adjust2.y;

             line.setAttributeNS(null, 'x1', x1 + '%');
             line.setAttributeNS(null, 'y1', y1 + '%');
             line.setAttributeNS(null, 'x2', x2 + '%');
             line.setAttributeNS(null, 'y2', y2+  '%');
             line.setAttributeNS(null, 'style', "stroke:black;stroke-width:1");
             svg.appendChild(line);

         }
      }
    }
}

function mouseEnter(e,data)
{
  panel.style.left = e.clientX + 'px';
  panel.style.top =  e.clientY + 'px';
  panel.style.display = 'inline-block';
  panel.innerHTML = "Name: " + data.name + " <br>" +
                    "Landuse: " + data.trt + " <br>" + 
                    "Type: " + data.type + " <br>" +
                    "Spatial resolution: " + data.srt + " <br>" + 
                    "Temporal resolution: " + data.trt + " <br>" +  
                    "Min Spatial Extent: " + data.minSpatial + " <br>" + 
                    "Max Spatial Extent: " + data.maxSpatial + " <br>" + 
                    "Min Temporal Extent: " + data.minTime + " <br>" + 
                    "Max Temporal Extent: " + data.maxTime + " <br>" + 
                    "Units: " + data.units+ " <br>"  +
                    "Source: " + data.source+ " <br>" +  
                    "Link: " + data.link+ " <br>" +  
                    "Conatct: " + data.contact+ " <br>" +  
                    "Issues: " + data.issues+ " <br>"+
                    "Time Stamp: " + data.timeStamp+ " <br>"  ;  
                    
}
function mouseExit(e)
{
  panel.style.display = 'none';
}
function download()
{

var csv = CSV(cleanData);
var downloadLink = document.createElement("a");
var blob = new Blob(["\ufeff", csv]);
var url = URL.createObjectURL(blob);
downloadLink.href = url;
downloadLink.download = "data.csv";

document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);
}
function CSV(array) {
  // Use first element to choose the keys and the order
  var keys = Object.keys(array[0]);

  // Build header
  var result = keys.join(",") + "\n";

  // Add the rows
  array.forEach(function(obj){
      result += keys.map(k => obj[k]).join(",") + "\n";
  });

  return result;
}

function upload()
{

  // open interface to select csv file
  var input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {
    // getting a hold of the file reference
    var file = e.target.files[0];
    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');
    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      var content = readerEvent.target.result; // this is the content!

      // parse csv file and add to data
      var lines = content.split("\n");
      var result = [];
      var headers=lines[0].split(",");
      for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");

        //if currentLine is empty then skip 
        if(currentline.length < 2)  continue;
          
        for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      
      console.log(result);
      cleanData = cleanData.concat(result);
      // add extra fields to result
      for (let i =0; i< result.length;i++)
      {
        result[i].srv = indexMatchingText(sr, result[i].spatialResolution);
        result[i].trv = indexMatchingText(tr, result[i].temporalResolution);
        result[i].draw = true;
        result[i].count = dataExists(result[i].spatialResolution, result[i].temporalResolution);
      }

      data = data.concat(result);
      updateGraph();
    }
  }
  input.click();
}

function indexMatchingText(ele, text) {

  for (var i=0; i<ele.options.length;i++) {
      if (ele.options[i].value === text){
          return i;
      }
  }
  return undefined;
}


function onChangeSpatialExtend(){

  var selectEl = document.getElementById("spatialExtendID");
  var textEl = document.getElementById("spatialExtendTextID");
    console.log(selectEl.value )
    if (selectEl.value === "global" || selectEl.value === "non spatial") {
    textEl.style.display = "none";
  } else {
    textEl.style.display = "inline";
  }
}

function onProductChanged(){

  var selectEl = document.getElementById("producID");
  var textEl = document.getElementById("productTextID");
    if (selectEl.value === "not in this list") {
    textEl.style.display = "inline";
  } else {
    textEl.style.display = "none";
  }
}

function onSourceChanged(){

  var selectEl = document.getElementById("sourceID");
  var textEl = document.getElementById("sourceTextID");
    if (selectEl.value === "not in this list") {
    textEl.style.display = "inline";
  } else {
    textEl.style.display = "none";
  }
}

function onUnitChanged(){

  var selectEl = document.getElementById("unitID");
  var textEl = document.getElementById("customUnitID");
    console.log(selectEl.value )
    if (selectEl.value === "not in this list") {
    textEl.style.display = "inline";
  } else {
    textEl.style.display = "none";
  }
}

function onChangeTemporalExtend(){
  
  var selectEl = document.getElementById("temporalResolutionID");
  var fromYearEl = document.getElementById("fromYearID");
  var toYearEl = document.getElementById("toYearID");
  var fromMonthEl = document.getElementById("fromMonthID");
  var toMonthEl = document.getElementById("toMonthID");
  var fromDayEl = document.getElementById("fromDayID");
  var toDayEl = document.getElementById("toDayID");
  var fromHourEl = document.getElementById("fromHourID");
  var toHourEl = document.getElementById("toHourID");
  var fromMinuteEl = document.getElementById("fromMinuteID");
  var toMinuteEl = document.getElementById("toMinuteID");

    if (selectEl.value === "adhoc" ) {
      fromYearEl.style.display = "none"; 
      toYearEl.style.display = "inline";
      fromMonthEl.style.display = "none";
      toMonthEl.style.display = "none";
      fromDayEl.style.display = "none";
      toDayEl.style.display = "none";
      fromHourEl.style.display = "none";
      toHourEl.style.display = "none";
      fromMinuteEl.style.display = "none";
      toMinuteEl.style.display = "none";
    }
    else if (selectEl.value === "yearly")
    {
      fromYearEl.style.display = "inline"; 
      toYearEl.style.display = "inline";
      fromMonthEl.style.display = "none";
      toMonthEl.style.display = "none";
      fromDayEl.style.display = "none";
      toDayEl.style.display = "none";
      fromHourEl.style.display = "none";
      toHourEl.style.display = "none";
      fromMinuteEl.style.display = "none";
      toMinuteEl.style.display = "none";

    }
    else if (selectEl.value === "monthly")
    {
      fromYearEl.style.display = "inline"; 
      toYearEl.style.display = "inline";
      fromMonthEl.style.display = "inline";
      toMonthEl.style.display = "inline";
      fromDayEl.style.display = "none";
      toDayEl.style.display = "none";
      fromHourEl.style.display = "none";
      toHourEl.style.display = "none";
      fromMinuteEl.style.display = "none";
      toMinuteEl.style.display = "none";
    }    
    else if (selectEl.value === "weekly" ||selectEl.value === "daily" )
    {
      fromYearEl.style.display = "inline"; 
      toYearEl.style.display = "inline";
      fromMonthEl.style.display = "inline";
      toMonthEl.style.display = "inline";
      fromDayEl.style.display = "inline";
      toDayEl.style.display = "inline";
      fromHourEl.style.display = "none";
      toHourEl.style.display = "none";
      fromMinuteEl.style.display = "none";
      toMinuteEl.style.display = "none";
    }
    else if (selectEl.value === "hourly"  )
    {
      fromYearEl.style.display = "inline"; 
      toYearEl.style.display = "inline";
      fromMonthEl.style.display = "inline";
      toMonthEl.style.display = "inline";
      fromDayEl.style.display = "inline";
      toDayEl.style.display = "inline";
      fromHourEl.style.display = "inline";
      toHourEl.style.display = "inline";
      fromMinuteEl.style.display = "none";
      toMinuteEl.style.display = "none";
    }
    else if (selectEl.value === "hourly"  )
    {
      fromYearEl.style.display = "inline"; 
      toYearEl.style.display = "inline";
      fromMonthEl.style.display = "inline";
      toMonthEl.style.display = "inline";
      fromDayEl.style.display = "inline";
      toDayEl.style.display = "inline";
      fromHourEl.style.display = "inline";
      toHourEl.style.display = "inline";
      fromMinuteEl.style.display = "none";
      toMinuteEl.style.display = "none";
    }
    else if (selectEl.value === "minutely"  )
    {
      fromYearEl.style.display = "inline"; 
      toYearEl.style.display = "inline";
      fromMonthEl.style.display = "inline";
      toMonthEl.style.display = "inline";
      fromDayEl.style.display = "inline";
      toDayEl.style.display = "inline";
      fromHourEl.style.display = "inline";
      toHourEl.style.display = "inline";
      fromMinuteEl.style.display = "inline";
      toMinuteEl.style.display = "inline";
    }

}
