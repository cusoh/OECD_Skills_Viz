

var _mdata;
var _cdata;
/**
 * Do the following when the browser window loads
 */
window.onload = function(){

    console.log("Create a global variable named \"_data\"");
    loadMapData("world-110m2.json");
    loadSkillData('skills.csv');
    //loadKnob(150,150, "knobDiv");

};

function loadMapData(path){
    //The csv returns JSON object per row?
    d3.json(path).then(
        function(data){
            _mdata = data;
            drawCountries(data);
        }
    );
}

function loadSkillData(path){
    d3.csv(path).then(
        function(data){
            _cdata  = data;
            drawFilters();
        }
    )
}

function drawFilters(){
    /*
    * Draw a bar corresponding to each skill
    * Then we can just scroll over the bars and see the countries get colored
    * */
}

function drawCountries(data){
    //Idea : use let to create local variables instead of var.
    // Draw each country that is present in the following list
    let cList = ['Austria', 'Austrailia','Belgium', 'Czech Republic','Canada', 'France',
                 'Denmark', 'Finland', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland',
                 'Italy', 'Luxembourg', 'Mexico', 'Netherlands', 'New Zealand', 'Norway',
                 'Poland', 'Portugal', 'Slovak Republic', 'Spain', 'Sweden', 'Switzerland',
                 'Turkey', 'United Kingdom', 'United States', 'Argentina', 'Brazil', 'Bulgaria',
                 'Chile', 'Cyprus', 'Estonia', 'Latvia', 'Lithuania', 'Peru', 'Romania',
                 'Slovenia', 'South Africa', 'Malaysia'];
    console.log("Total countries : "+cList.length);
    let svg=d3.select("#vis1");
    console.log(data)
    //viewbox: "origin aspect ratio"
    let ratioWidth = $("#vis2").width();
    let ratioHeight = $("#vis2").height();

    svg.attr("viewBox","0, 0,"+ratioWidth+","+ratioHeight);

    //Even though "rect" elements do not exist yet. We can select them.
    svg.selectAll("rect").data(data)
        .enter()
        .append("rect")
        .attr("x",function(d,i){
                            //d is the object
                            //i is the index
                            console.log(i);
                            return i*14; })
        .attr("y", 10).attr("width", 8).attr("height", function(d,i){
            return parseInt(d['Employment rate']);
    })
        .attr("fill",function(d,i){
            let j = parseInt(d['Employment rate']);
            return rgb(153, 204+j/5, 2);});
}

function drawBars(data){
    //Idea : use let to create local variables instead of var.
    let svg=d3.select("#vis3");

    //viewbox: "origin aspect ratio"
    let ratioWidth = $("#vis3").width();
    let ratioHeight = $("#vis3").height();

    let width = $("#vis3").width();
    let height = $("#vis3").height();
    let barWidth = width/data.length;


    let mm = d3.max(data, function(d){
        return d["Water quality"];
    });

    // console.log("XxXxX");
    // console.log(mm);
    //set up scale
    let xScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .domain([0, mm])
        .range([height*2.2, 0]);

    svg.attr("viewBox","0, 0,"+ratioWidth+","+ratioHeight);

    //Even though "rect" elements do not exist yet. We can select them.
    svg.selectAll("rect").data(data)
        .enter()
        .append("rect")
        .attr("x",function(d,i){
            return xScale(i);
            })
        .attr("y", function(d,i){
            //console.log("xxxx");
            //console.log(yScale(d["Water quality"]));
            return yScale(d["Water quality"]);
        })
        .attr("width", 10).attr("height", height)
        .attr("fill", function(d,i){
            return rgb(153,204-yScale(d["Water quality"]), 0)
        }).on("mouseover", function(d,i){
            //console.log("Mouse over");
            console.log(d['Country']);
            let thise = d3.select(this);
            thise.transition()
            .duration('50')
            .attr('opacity', '.75')
            .attr("transform", function(){
                let center = {
                    x : thise.attr("x"),
                    y : thise.attr("y")
                };
               return `translate(${thise.attr("transform_origin_x")}, ${thise.attr("transform_origin_y")}) 
                    translate(${-0.2 * center.x}, ${-0.2 * center.y})
                    scale(1.2, 1.2)`;

                });

        })
        .on('mouseout', function(d,i){
            console.log("Bye from ");
            let thise=d3.select(this);
            thise.transition()
                .duration('50')
                .attr('opacity', '1')
                .attr("transform", function(){
                return `translate(${thise.attr("transform_origin_x")}, ${thise.attr("transform_origin_y")}) scale(1,1)`;
            });

        });

}

function rgb(r, g, b){
    return "rgb("+r+","+g+","+b+")";
}

function loadKnob(x,y, elemDiv){
    console.log("Loading Knob now...");
    // Create knob element, 300 x 300 px in size.
    var knob = pureknob.createKnob(x, y);

    // Set properties.
    knob.setProperty('angleStart', -0.75 * Math.PI);
    knob.setProperty('angleEnd', 0.75 * Math.PI);
    knob.setProperty('colorFG', '#88ff88');
    knob.setProperty('trackWidth', 0.4);
    knob.setProperty('valMin', 0);
    knob.setProperty('valMax', 100);

    // Set initial value.
    knob.setValue(50);

    var listener = function(knob, value) {
        console.log(value);
    };

    knob.addListener(listener);

    // Create element node.
    var node = knob.node();

    // Add it to the DOM.
    var elem = document.getElementById(elemDiv);
    elem.appendChild(node);

}