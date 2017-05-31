var ScatterPlot = function () {
    // Set default values
    var height = 500,
        width = 500,
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        xTitle = 'X Axis Title',
        yTitle = 'Y Axis Title',
        title = 'Chart title',
        fill = 'green',
        radius = 6,
        colors = ['red', 'green', 'blue', 'orange'],
        margin = {
            left: 70,
            bottom: 50,
            top: 30,
            right: 10,
        };


    // Function returned by ScatterPlot
    var chart = function (selection) {
        // Height/width of the drawing area itself
        var chartHeight = height - margin.bottom - margin.top;
        var chartWidth = width - margin.left - margin.right;

        // line of best fit
        

        // Iterate through selections, in case there are multiple
        selection.each(function (data) {
            // Use the data-join to create the svg (if necessary)
            var ele = d3.select(this);
            var svg = ele.selectAll("svg").data([data]);

            // Append static elements (i.e., only added once)
            var svgEnter = svg.enter()
                .append("svg")
                .attr('width', width)
                .attr("height", height);

            // Title G
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + 20 + ')')
                .text(title)
                .attr('class', 'chart-title')

            // g element for markers
            svgEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr("class", 'chartG');

            // Append axes to the svgEnter element
            svgEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + (chartHeight + margin.top) + ')')
                .attr('class', 'xAxis');

            svgEnter.append('g')
                .attr('class', 'yAxis')
                .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')

            // Add a title g for the x axis
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + (chartHeight + margin.top + 40) + ')')
                .attr('class', 'xTitle');

            // Add a title g for the y axis
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + chartHeight / 2) + ') rotate(-90)')
                .attr('class', 'yTitle');

            // Define xAxis and yAxis functions
            var xAxis = d3.axisBottom().tickFormat(d3.format('.2s'));
            var yAxis = d3.axisLeft().tickFormat(d3.format('.2s'));
            //console.log(d3.merge(data));
            var allValues = d3.merge(data);

            xScale.range([0, chartWidth]);
            yScale.range([chartHeight, 0]);


            var xMax = d3.max(allValues, (d) => +d.x) * 1.05;
            var xMin = d3.min(allValues, (d) => +d.x) * .95;
            xScale.domain([-0.0001, xMax]).nice();

            var yMin = d3.min(allValues, (d) => +d.y) * .95;
            var yMax = d3.max(allValues, (d) => +d.y) * 1.05;
            yScale.domain([yMin, yMax]).nice();


            //var line = d3.svg.line()
            //.x(function (d) {
             //   return xScale(d.x);
           // })
           // .y(function (d) {
            //    return yScale(d.yhat);
            //});

            // Update axes
            xAxis.scale(xScale);
            yAxis.scale(yScale);
            ele.select('.xAxis').transition().duration(1000).call(xAxis);
            ele.select('.yAxis').transition().duration(1000).call(yAxis);

            // Update titles
            ele.select('.xTitle').text(xTitle)
            ele.select('.yTitle').text(yTitle)

            var z = d3.scaleOrdinal(d3.schemeCategory10);

            // draw circles in series
            var series = ele.select('.chartG').selectAll(".series")
                .data(data)
                .enter().append("g")
                .attr("class", "series")
                .style("fill", function(d, i) { return z(i); });

                var circles = series.selectAll(".point")
                .data(function (d) { return d; })
                .enter().append("circle")
                .attr('cx', (d) => xScale(+d.x))
                .attr('cy', chartHeight)
                .transition()
                .duration(1500)
                .delay((d) => xScale(+d.x) *5)
                .attr("class", "point")
                .attr("r", 4.5)
                .style('opacity', .3)
                .attr('cx', (d) => xScale(+d.x))
                .attr('cy', (d) => yScale(+d.y));

                series.merge(series)
                .style("fill", function(d, i) { return colors[i]; })
                .attr('r', radius)
                .transition()
                .duration(1500)
                .delay((d) => xScale(+d.x) * 5)
                .attr('cx', (d) => xScale(+d.x))
                .attr('cy', (d) => yScale(+d.y))

                series.exit().remove();
            
            // draw line of best fit
            /*svgEnter.append("path")
                .datum(data)
                .attr("class", "line")
                .transition()
                .duration(1500)
                .attr("d", line);*/
        });
    };

    // Getter/setter methods to change locally scoped options
    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.fill = function (value) {
        if (!arguments.length) return fill;
        fill = value;
        return chart;
    };

    chart.xTitle = function (value) {
        if (!arguments.length) return xTitle;
        xTitle = value;
        return chart;
    };

    chart.yTitle = function (value) {
        if (!arguments.length) return yTitle;
        yTitle = value;
        return chart;
    };
    chart.radius = function (value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    return chart;
};