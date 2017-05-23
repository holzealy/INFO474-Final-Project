$(function () {
    // Variables to show
    var scrollVis = function () {
        // constants to define the size
        // and margins of the vis area.
        var width = 600;
        var height = 520;
        var margin = { top: 0, left: 20, bottom: 40, right: 10 };
        var chartHeight = height - margin.bottom - margin.top;
        var chartWidth = width - margin.left - margin.right;

        // Keep track of which visualization
        // we are on and which was the last
        // index activated. When user scrolls
        // quickly, we want to call all the
        // activate functions that they pass.
        var lastIndex = -1;
        var activeIndex = 0;

        // main svg used for visualization
        var svg = null;

        // d3 selection that will be used
        // for displaying visualizations
        var g = null;

        // scatterplot scales
        var scatterxScale = d3.scaleLinear()
            .range([0, chartWidth]),
            scatteryScale = d3.scaleLinear()
                .range([chartHeight, 0]);

        // normal curve scales
        var normalxScale = d3.scaleLinear()
            .range([0, width]);
        var normalyScale = d3.scaleLinear()
            .range([height, 0]);

        //scatter axis
        var scatterxAxis = d3.axisBottom()
            .tickFormat(d3.format('.2s'))
            .scale(scatterxScale);
        var scatteryAxis = d3.axisLeft()
            .tickFormat(d3.format('.2s'))
            .scale(scatteryScale);

        //normal curve axis
        var curvexAxis = d3.axisBottom()
            .scale(normalxScale);

        var curveyAxis = d3.axisLeft()
            .scale(normalyScale);


        // scatter line of best fit
        var scatterLine = d3.svg.line()
            .x(function (d) {
                return x(d.x);
            })
            .y(function (d) {
                return y(d.yhat);
            });


        var curveLine = d3.line()
            .x(function (d) {
                return x(d.q);
            })
            .y(function (d) {
                return y(d.p);
            });


        // When scrolling to a new section
        // the activation function for that
        // section is called.
        var activateFunctions = [];
        // If a section has an update function
        // then it is called while scrolling
        // through the section with the current
        // progress through the section.
        var updateFunctions = [];

        var chart = function (selection) {
            selection.each(function (rawData) {
                // create svg and give it a width and height
                svg = d3.select(this).selectAll('svg').data([chartData]);
                var svgE = svg.enter().append('svg');
                // @v4 use merge to combine enter and existing selection
                svg = svg.merge(svgE);

                svg.attr('width', width + margin.left + margin.right);
                svg.attr('height', height + margin.top + margin.bottom);

                svg.append('g');

                // this group element will be used to contain all
                // other elements.
                g = svg.select('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // perform some preprocessing on raw data
                var chartData = getHappyScores(rawData);

                // filter to get initial x and y variable combination
                var defaultVarSelection = getXYCombination(chartData);

                // filter to just include normalized target
                var normalData = getNormalTarget(chartData);

                // Calculate scatter x and y scales
                var scatterxMax = d3.max(defaultVarSelection, (d) => +d.x) * 1.05;
                var scatterxMin = d3.min(defaultVarSelection, (d) => +d.x) * .95;
                scatterxScale.domain([scatterxMin, scatterxMax]);

                var scatteryMin = d3.min(defaultVarSelection, (d) => +d.y) * .95;
                var scatteryMax = d3.max(defaultVarSelection, (d) => +d.y) * 1.05;
                scatteryScale.domain([scatteryMin, scatteryMax]);

                //Calculate normal curve x and y scales
                normalxScale.domain(d3.extent(normalData, function (d) {
                    return d.q;
                }));
                normalyScale.domain(d3.extent(normalData, function (d) {
                    return d.p;
                }));

                //initial elements for viz
                setupVis(chartData, defaultVarSelection, normalData);
                setupSections();

                //selection 
            });

            //chart
        };

        var setupVis = function (chartData, varSelection, normalData) {
            // normal axis
            g.append('g')
                .attr('class', 'x-axis')
                .attr('transform', "translate(0," + height + ")")
                .call(normalxAxis);
            g.select('normal-x-axis').style('opacity', 0);
            g.append('g')
                .attr('class', 'y-axis')
                .call(normalyAxis);
            g.select('normal-y-axis').style('opacity', 0);

            //normal curve elements
            var curve = g.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("d", curveLine)
                .style("opacity", 0);


            // scatterplot elements
            var scatter = g.selectAll('circle').data(data, (d) => d.id);
            var scatterE = scatter.enter().append('circle').attr('class', 'point');

            scatter = scatter.merge(scatterE)
                .attr('fill', fill)
                .attr('cy', chartHeight)
                .style('opacity', .3)
                .attr('cx', (d) => xScale(d.x))
                .delay((d) => xScale(d.x) * 5)
                .attr('cx', (d) => xScale(d.x))
                .attr('cy', (d) => yScale(d.y))
                .style("opacity", 0);

        };

        var setupSections = function () {
            activateFunctions[0] = showCurve();
            activateFunctions[1] = showScatter();

            //TO-DO: Update functions


        };

        function showAxis(xAxis, yAxis) {
            g.select('.x-axis')
                .call(xAxis)
                .transition().duration(500)
                .style('opacity', 1);

            g.select('.y-axis')
                .call(yAxis)
                .transition().duration(500)
                .style('opacity', 1);
        };

        function hideAxis() {
            g.select('.x-axis')
                .transition().duration(500)
                .style('opacity', 0);
            g.select('.y-axis')
                .transition().duration(500)
                .style('opacity', 0);
        };

        function showCurve() {
            showAxis(curvexAxis, curveyAxis);
            //transitions all remaining scatter points out (if any)
            g.selectAll('.point')
                .transition()
                .duration(800)
                .attr('opacity', 0);
            
            //enter line
            var line = g.select('.line').attr('stroke-width', 1.5)
                .attr('stroke', "blue")
                .attr('stroke-dasharray', function (d) {
                    var value = d3.select(this).node().getTotalLength();
                    return value + " " + value;
                }).attr('stroke-dashoffset', function (d) {
                    var value = d3.select(this).node().getTotalLength();
                    return -value;
                }).transition().duration(1000).attr('stroke-dashoffset', 0);

            //update line
            line.attr('stroke-dasharray', 'none')
            .transition()
            .duration(500)
            .attr('d', function(d){
                return line(d.values);
            });
            

        };

        function showScatter() {


        };

        //matches features to target
        function getHappyScores(rawData) { };

        //gets normal target data
        function getNormalTarget(chartData) { };

        //get combination of x and target for scatterplot
        function getXYCombination(chartData) { };
        //scrollvis
    };

});
