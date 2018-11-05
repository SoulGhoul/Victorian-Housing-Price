//Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoid3o1MDgwMSIsImEiOiJjamZ1b3l5NHQwY3Q3MndxczExN2VuY2tpIn0.avSw04ysxrm6826GZZrOrg';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/wz50801/cjhgfa80309mn2ssw9i5kwcoe',
center: [143.2406775, -36.5563675],   
zoom: 6,
maxZoom: 15,
minZoom: 6
});

//Initial Filter
var filterYear = ['==', ['number', ['get', 'year']], 2016];
var filterType = ['==', ['string', ['get', 'type']], "house"];
var filterNA = ['has', 'price'];
var filterHover = ['==', ['string', ['get', 'Suburb']], ""];
var filterSuburb = ['has', 'Suburb']

//Initial Map
map.on('load', function(){
    //add dataset uploaded to mapbox to create circles
    map.addSource("mainData", {type: "vector",
                               url: "mapbox://wz50801.cjhpom4z106mrqwqtea7zxkqo-5ae6f"});
    //add layer with circles                       
    map.addLayer({"id": "priceCircle",
                  "type": "circle",
                  "source": "mainData",
                  "source-layer": "VicSuburbs2",
                  'filter': ['all', filterYear, filterType, filterNA],
                  "paint": {"circle-opacity":0.8,
                            'circle-color': [
                                             'interpolate',
                                            ['linear'],
                                            ['number', ['get', 'price']],
                                            50000, '#2DC4B2',
                                            200000, '#3BB3C3',
                                            1000000, '#669EC4',
                                            2000000, '#8B88B6',
                                            3000000, '#A2719B',
                                            4700000, '#AA5E79'
                                            ],
                            'circle-radius': [
                                              'interpolate',
                                              ['linear'],
                                              ['number', ['get', 'price']],
                                              50000, 5,
                                              4700000, 50
                                              ]}                           
    });
    //add another layer to show hover effect
    map.addLayer({"id": "priceCircle-hover",
                  "type": "circle",
                  "source": "mainData",
                  "source-layer": "VicSuburbs2",
                  'filter': ['all', filterYear, filterType, filterNA,filterHover],
                  "paint": {"circle-opacity":1,
                            'circle-color': [
                                             'interpolate',
                                            ['linear'],
                                            ['number', ['get', 'price']],
                                            50000, '#2DC4B2',
                                            200000, '#3BB3C3',
                                            1000000, '#669EC4',
                                            2000000, '#8B88B6',
                                            3000000, '#A2719B',
                                            4700000, '#AA5E79'
                                            ],
                            'circle-radius': [
                                              'interpolate',
                                              ['linear'],
                                              ['number', ['get', 'price']],
                                              50000, 5,
                                              4700000, 50
                                              ],
                           'circle-stroke-width': 1,
                           'circle-stroke-color': '#000000'}                           
    });
    //render an empty list to initialize
    renderListings([]);
    //move the map to start list rendering
    map.flyTo({
        center: [143.2406775, -36.5563675],
        zoom: 6,
        bearing: 0,
        speed: 0.8
    });
});

//Slider Controll
document.getElementById('slider').addEventListener('input', function(e) {
  var year = parseInt(e.target.value);
  // update the map filter
  filterYear = ['==', ['number', ['get', 'year']], year];
  map.setFilter('priceCircle', ['all', filterYear, filterType, filterNA]);
  map.setFilter('priceCircle-hover', ['all', filterYear, filterType, filterNA, filterHover]);
  // update text in the UI
  document.getElementById('visible-year').innerText = year;
});

//Radio Buttons Controll
document.getElementById('type-filters').addEventListener('change', function(e) {
  var type = e.target.value;
  // update the map filter
  if (type === 'house') {
    filterType = ['==', ['string', ['get', 'type']], "house"];
    setTypeHouse();
  } else if (type === 'unit') {
    filterType = ['==', ['string', ['get', 'type']], "unit"];
    setTypeUnit();
  } else if (type === 'vacant') {
    filterType = ['==', ['string', ['get', 'type']], "vacant"];
    setTypeVacant();
  } else {
    console.log('error');
  }
  map.setFilter('priceCircle', ['all', filterYear, filterType, filterNA]);
  map.setFilter('priceCircle-hover', ['all', filterYear, filterType, filterNA, filterHover]);
});

//Circle color and radius for type "house"
var houseColor = ['interpolate',
                        ['linear'],
                        ['number', ['get', 'price']],
                        50000, '#2DC4B2',
                        200000, '#3BB3C3',
                        1000000, '#669EC4',
                        2000000, '#8B88B6',
                        3000000, '#A2719B',
                        4700000, '#AA5E79'
                        ];
var houseRadius = ['interpolate',
                        ['linear'],
                        ['number', ['get', 'price']],
                        50000, 5,
                        4700000, 50
                        ];
//Update the layer to show appropriate color and radius 
function setTypeHouse(){
    map.setPaintProperty('priceCircle','circle-color',
                        houseColor);
    map.setPaintProperty('priceCircle','circle-radius',
                        houseRadius);
    map.setPaintProperty('priceCircle-hover','circle-color',
                        houseColor);
    map.setPaintProperty('priceCircle-hover','circle-radius',
                        houseRadius);
    //display house legend and set other invisible
    document.getElementById('legend-house').style.display = 'block';
    document.getElementById('legend-unit').style.display = 'none';
    document.getElementById('legend-vacant').style.display = 'none';
};

//Circle color and radius for type "unit"
var unitColor = ['interpolate',
                        ['linear'],
                        ['number', ['get', 'price']],
                        65000, '#2DC4B2',
                        300000, '#3BB3C3',
                        600000, '#669EC4',
                        900000, '#8B88B6',
                        1200000, '#A2719B',
                        1345000, '#AA5E79'
                        ];
var unitRadius = ['interpolate',
                        ['linear'],
                        ['number', ['get', 'price']],
                        65000, 5,
                        1345000, 50
                        ];
//Update the layer to show appropriate color and radius 
function setTypeUnit(){
    map.setPaintProperty('priceCircle','circle-color',
                        unitColor);
    map.setPaintProperty('priceCircle','circle-radius',
                        unitRadius);
    map.setPaintProperty('priceCircle-hover','circle-color',
                        unitColor);
    map.setPaintProperty('priceCircle-hover','circle-radius',
                        unitRadius);
    //display unit legend and set other invisible
    document.getElementById('legend-house').style.display = 'none';
    document.getElementById('legend-unit').style.display = 'block';
    document.getElementById('legend-vacant').style.display = 'none';
};

//Circle color and radius for type "vacant"
var vacantColor = ['interpolate',
                        ['linear'],
                        ['number', ['get', 'price']],
                        17500, '#2DC4B2',
                        300000, '#3BB3C3',
                        600000, '#669EC4',
                        900000, '#8B88B6',
                        1200000, '#A2719B',
                        1500000, '#AA5E79'
                        ];
var vacantRadius = ['interpolate',
                        ['linear'],
                        ['number', ['get', 'price']],
                        17500, 5,
                        1500000, 50
                        ];
//Update the layer to show appropriate color and radius
function setTypeVacant(){
    map.setPaintProperty('priceCircle','circle-color',
                        vacantColor);
    map.setPaintProperty('priceCircle','circle-radius',
                        vacantRadius);
    map.setPaintProperty('priceCircle-hover','circle-color',
                        vacantColor);
    map.setPaintProperty('priceCircle-hover','circle-radius',
                        vacantRadius);
    //display vacant legend and set other invisible
    document.getElementById('legend-house').style.display = 'none';
    document.getElementById('legend-unit').style.display = 'none';
    document.getElementById('legend-vacant').style.display = 'block';
    
};

//Set onclick function on map to show popup box
map.on('click', function(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['priceCircle'] });
  // if the features have no info, return nothing
  if (!features.length) {
    return;
  }
    
  var feature = features[0];
  // populate the popup and set its coordinates
  // based on the feature found
  var popup = new mapboxgl.Popup()
  .setLngLat(feature.geometry.coordinates)
  .setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'>' +
  '<ul class=\'list-group\'>' +
  '<li class=\'list-group-item\'> <h2>' + feature.properties['Suburb'] + '</h2> </li>' +
  '<li class=\'list-group-item\'> Property type: ' + feature.properties['type'] + ' </li>' +
  '<li class=\'list-group-item\'> Year: ' + feature.properties['year'] + ' </li>' +
  '<li class=\'list-group-item\'> Price: AUD$ ' + feature.properties['price'] + ' </li></ul></div>')
  .addTo(map);
  //and update the bar chart with current clicked suburb  
  getPriceGraph(feature.properties['Suburb'],feature.properties['type']);
});

//Set hover effect
map.on("mousemove", "priceCircle", function(e) {
    filterHover = ['==', ['string', ['get', 'Suburb']], e.features[0].properties.Suburb];
    map.setFilter('priceCircle-hover', ['all', filterYear, filterType, filterNA, filterHover]);
});

// Reset the priceCircle-hover layer's filter when the mouse leaves the layer.
map.on("mouseleave", "priceCircle", function() {
    filterHover = ['==', ['string', ['get', 'Suburb']], ""];
    map.setFilter('priceCircle-hover', ['all', filterYear, filterType, filterNA, filterHover]);
});


//Suburb filter
var suburbs = [];

var filterSub = document.getElementById('suburb-filter');
var listingSub = document.getElementById('suburb-listing');
var filterTip = document.getElementById('suburb-filter-tips');

//Reset current view to initial view
function resetView(){
    map.flyTo({
        center: [143.2406775, -36.5563675],
        zoom: 6,
        bearing: 0,
        speed: 0.8,
        curve: 1
    });
};

//Render filtered listings
function renderListings(features) {
    // clear any existing listings
    listingSub.innerHTML = '';
    
    if (features.length) {
        features.forEach(function(feature) {
            var prop = feature.properties;
            var item = document.createElement('p');
            item.textContent = prop.Suburb;
            //when hovering on an item, change it's color
            item.addEventListener('mouseover',function(){
                filterHover = ['==', ['string', ['get', 'Suburb']], prop.Suburb];
                map.setFilter('priceCircle-hover', ['all', filterYear, filterType, filterNA, filterHover]);
                item.style.color = "#2dc4b2";
            });
            item.addEventListener('mouseleave',function(){
                item.style.color = "#FFF";
            });
            //when clicking on an item, navigate to the suburb and display it's info in bar chart also show popup box
            item.addEventListener('click',function(){
                map.flyTo({
                    center: feature.geometry.coordinates,
                    zoom: 11,
                    bearing: 0,
                    speed: 0.8,
                    curve: 1
                });
            getPriceGraph(prop.Suburb,prop.type);
                
            var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'>' +
            '<ul class=\'list-group\'>' +
            '<li class=\'list-group-item\'> <h2>' + prop['Suburb'] + '</h2> </li>' +
            '<li class=\'list-group-item\'> Property type: ' + prop['type'] + ' </li>' +
            '<li class=\'list-group-item\'> Year: ' + prop['year'] + ' </li>' +
            '<li class=\'list-group-item\'> Price: AUD$ ' + prop['price'] + ' </li></ul></div>')
            .addTo(map);
            });
            listingSub.appendChild(item);
        });

        // show the filter input
        filterSub.parentNode.style.display = 'block';
        filterTip.parentNode.style.display = 'block';
    } else {
        //When no features in the list, show warning message
        var empty = document.createElement('h1');
        empty.textContent = 'No records, please click reset button.';
        listingSub.appendChild(empty);

        // Hide the filter input
        filterSub.parentNode.style.display = 'none';
        filterTip.parentNode.style.display = 'none';

        // remove features filter
        filterSuburb = ['has', 'Suburb']
        map.setFilter('priceCircle', ['all', filterYear, filterType, filterNA,filterSuburb]);
    }
}

//Convert string to uppercase
function capitalize(string) {
    return string.trim().toUpperCase();
}

//Only unique features are shown in the list
function getUniqueFeatures(array, comparatorProperty) {
    var existingFeatureKeys = {};

    var uniqueFeatures = array.filter(function(el) {
        if (existingFeatureKeys[el.properties[comparatorProperty]]) {
            return false;
        } else {
            existingFeatureKeys[el.properties[comparatorProperty]] = true;
            return true;
        }
    });

    return uniqueFeatures;
}

//After a map move, get all features in current view and render the list.
map.on('moveend', function() {
        var features = map.queryRenderedFeatures({layers:['priceCircle']});

        if (features) {
            var uniqueFeatures = getUniqueFeatures(features, "Suburb");
            // populate features for the listing overlay.
            renderListings(uniqueFeatures);

            // clear the input container
            filterSub.value = '';

            // store the current features in sn `suburbs` variable to
            // later use for filtering on `keyup`.
            suburbs = uniqueFeatures;
        }
});

//After user input any character in the input field, filter the list
filterSub.addEventListener('keyup', function(e) {
        var value = capitalize(e.target.value);

        // filter visible features that don't match the input value.
        var filtered = suburbs.filter(function(feature) {
            var suburbName = capitalize(feature.properties.Suburb);
            return suburbName.indexOf(value) > -1;
        });

        // populate the sidebar with filtered results
        renderListings(filtered);
    });

//D3 Bar Chart

//Set default size and container
var div = d3.select("#info-graph");
var width = 360;
var height = 200;

//Initialize tooltip of barchart
var barTooltip = d3.select('#info-graph').append('div')
        .attr('class', 'bar-tooltip')
        .style('display', 'none');

//Create svg canvas in container
var svg = div.append("svg").attr("width",width).attr("height",height).attr("class", "svgCanvas");

//Set margin
var margin = {top: 10, right: 40, bottom: 30, left: 50};

//Get the width and height after margin to set the chart
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

//Read Data
var data = [];
d3.csv("Vichousing.csv",function(d){
    d.forEach(function(row){
        var rowData = {suburb: row.Suburb,
           year: row.year,
           price:row.price,
           type:row.type,
           twoyear:row["%2015-2016"],
           tenyear:row["%2006-2016"],
           growPA:row["Growth PA"]};
       data.push(rowData);
    });
    //the default chart is RICHMOND, type is house
    getPriceGraph("RICHMOND","house");
});

//Draw the chart and set other info field
function getPriceGraph(suburb,type){
    
    //remove any content in those two divs
    d3.select("#info-graph").selectAll("g").remove();
    d3.select("#info-title").selectAll("*").remove();
    
    //get the data to be drawn
    var results = [];
    results = data.filter(function(d){
        return d.suburb === suburb && d.type === type;
    });
    
    //set header
    var header = d3.select("#info-header");
    header.text(suburb);
    
    //set chart title
    var title = d3.select("#info-title");
    title.append("div").text("This Suburb's Median Property Price from 2006 to 2016").style("text-align", "center").style("font-size","12px");
    
    //get an object in the list
    var objSubrb = results[0];
    
    //set property type
    if(objSubrb.type === "house"){d3.select("#info-proptype-value").text("House");};
    if(objSubrb.type === "unit"){d3.select("#info-proptype-value").text("Unit");};
    if(objSubrb.type === "vacant"){d3.select("#info-proptype-value").text("Vacant Land");};
    
    //set two year growth
    if(objSubrb.twoyear === "NA"){d3.select("#info-twoyear-value").text("NA");}
    else{
    d3.select("#info-twoyear-value").text(objSubrb.twoyear + "%");
    if(objSubrb.twoyear >= 30){d3.select("#info-twoyear-value").style("color","#ff6f60");};
    if(objSubrb.twoyear < 30 && objSubrb.twoyear >= 0){d3.select("#info-twoyear-value").style("color","#80e27e");};
    if(objSubrb.twoyear < 0){d3.select("#info-twoyear-value").style("color","#6ab7ff");}; 
    };   
    
    //set ten year growth
    if(objSubrb.tenyear === "NA"){d3.select("#info-tenyear-value").text("NA");}
    else{
    d3.select("#info-tenyear-value").text(objSubrb.tenyear + "%");
    if(objSubrb.tenyear >= 150){d3.select("#info-tenyear-value").style("color","#ff6f60");};
    if(objSubrb.tenyear < 150 && objSubrb.tenyear >= 50){d3.select("#info-tenyear-value").style("color","#80e27e");};
    if(objSubrb.tenyear < 50){d3.select("#info-tenyear-value").style("color","#6ab7ff");};
    };
    
    //set per year growth
    if(objSubrb.growPA === "NA"){d3.select("#info-peryear-value").text("NA");}
    else{
    d3.select("#info-peryear-value").text(objSubrb.growPA + "%");
    };
    
    //initialize the axes
    var x = d3.scaleBand().rangeRound([0,width]).padding(0.2);
    var y = d3.scaleLinear().rangeRound([height,0]);
    
    //initialize the drawing area
    var g = svg.append("g").attr("transform", "translate(" + (margin.left-20) + "," + margin.top + ")");
    
    //set domain for x axis
    x.domain(results.map(function(d){
        return d.year;
    }));
    
    //set domain for y axis
    var prices = results.map(function(obj){
        //convert null value to 0
        if(obj.price === "NA"){
            return 0;
        }
        else{
            var x = parseInt(obj.price);
            return x;
        } 
    });
    y.domain([0, Math.max.apply(null, prices)]);
    
    //draw x axis
    g.append("g")
        .attr("class","axis axis--x")
        .attr("transform","translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
    //draw left y axis
    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).tickFormat(d3.format(".0s")));

    //draw right y axis
    g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform","translate(" + width + ", 0)")
      .call(d3.axisRight(y).tickFormat(d3.format(".0s")));
    
    //draw the bars
    g.selectAll(".bar")
        .data(results)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("x",function(d){return x(d.year);})
        .attr("y",function(d){return y(d.price);})
        .attr("width", x.bandwidth())
        .attr("height",function(d){return height - y(d.price);})
        .on("mouseover",function(){
        barTooltip.style('display', 'inline');
        })
        //set hovering tooltip
        .on("mousemove",function(){
        var thisBar = d3.select(this).data()[0]
        barTooltip
            .html(thisBar.year + '<hr/>' + thisBar.price)
            .style('left', (d3.event.pageX - 34) + 'px')
            .style('top', (d3.event.pageY - 30) + 'px');
        })
        .on("mouseout",function(){
        barTooltip.style('display', 'none');
        });
};
