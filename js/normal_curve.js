$(document).ready(function(){
    var data = [];

    getData(); // populate data 

    // line chart based on http://bl.ocks.org/mbostock/3883245
    var margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 60
        },
        width = 800,
        drawWidth = width - margin.left - margin.right,
        height = 400,
        drawHeight = height - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, drawWidth]);

    var y = d3.scaleLinear()
        .range([drawHeight, 0]);

    var xAxis = d3.axisBottom()
        .scale(x);
        //.orient("bottom");

    var yAxis = d3.axisLeft()
        .scale(y);
        //.orient("left");

    var line = d3.line()
        .x(function(d) {
            return x(d.q);
        })
        .y(function(d) {
            return y(d.p);
        });

    var svg = d3.select("#vis").append("svg")
        .attr('class', 'curve')
        .attr("width", width)
        .attr("height", height);
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function(d) {
        return d.q;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.p;
    }));

    // x axis
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + drawHeight + ")")
        .call(xAxis);
    // x axis label
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'translate(' + (drawWidth / 2) + ',' + (drawHeight + margin.bottom) + ')')
        .style('text-anchor', 'middle')
        .text("Standard Deviations From Mean")

    // y axis
    g.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    // y axis label
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (drawHeight / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Probability')

    // get data above p value 0.05
    var fillData = [];
    data.forEach(function(d) {
        if (x(d.q) >= x(1.96)) {
            fillData.push(d);
        }
    });

    // fill area with p above 0.05
    var area = d3.area()
        .x(function(d) {
            return x(d.q);
        })
        .y0(y(0))
        .y1(function(d) {
            return y(d.p);
        });
    g.append('path')
        .data([fillData])
        .attr('class', 'area')
        .attr('d', area);

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("d", line);

    // draw vertical line for p value of 0.05 (z=1.96)
    var vertical = g.append('rect')
        .attr('class', 'vertical')
        .attr('stroke', 'red')
        .attr('x', x(1.96))
        .attr('y', 0)
        .attr('width', 1)
        .attr('height', drawHeight);

    function getData() {

    // loop to populate data array with 
    // probabily - quantile pairs
    for (var i = 0; i < 25000; i++) {
        q = normal() // calc random draw from normal dist
        p = gaussian(q) // calc prob of rand draw
        el = {
            "q": q,
            "p": p
        }
        data.push(el)
    };

    // need to sort for plotting
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    data.sort(function(x, y) {
        return x.q - y.q;
    });	
    }

    // from http://bl.ocks.org/mbostock/4349187
    // Sample from a normal distribution with mean 0, stddev 1.
    function normal() {
        var x = 0,
            y = 0,
            rds, c;
        do {
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            rds = x * x + y * y;
        } while (rds == 0 || rds > 1);
        c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
        return x * c; // throw away extra sample y * c
    }

    //taken from Jason Davies science library
    // https://github.com/jasondavies/science.js/
    function gaussian(x) {
        var gaussianConstant = 1 / Math.sqrt(2 * Math.PI),
            mean = 0,
            sigma = 1;

        x = (x - mean) / sigma;
        return gaussianConstant * Math.exp(-.5 * x * x) / sigma;
    };
});