var normal_curve = function () {

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

    // x scale
    var x = d3.scaleLinear()
        .range([0, drawWidth]);

    // y scale
    var y = d3.scaleLinear()
        .range([drawHeight, 0]);

    var xAxis = d3.axisBottom()
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y);

    // line for curve
    var line = d3.line()
        .x(function(d) {
            return x(d.q);
        })
        .y(function(d) {
            return y(d.p);
        });

    var chart = function (selection) {
        selection.each(function (data) {

            var ele = d3.select(this);
            var svg = ele.selectAll("svg").data([data]);

            var svgEnter = svg.enter()
                .append("svg")
                .attr('class', 'curve')
                .attr("width", width)
                .attr("height", height);
            var g = svgEnter.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // set x and y domains
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

            // get data above p value 0.05 to fill in
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

            // draw curve
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
        });

    }
    return chart;
}