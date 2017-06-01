$(function () {

    /* Create a scatter plot of 1960 life expectancy (gdp) versus 2013 life expectancy (life_expectancy).*/
    // Variables to show
    var xVar1 = 'x1';
    var xVar2 = '';
    var xVar3 = '';
    var xVar4 = '';
    var yVar = 'y';
    var seriesNames = new Set(["x1", "x2", "x3"]);
    var variables = { "x1": null, "x2": null, "x3": null};
    var chartData = new Array();

    // Load data in using d3's csv function.
    d3.csv('data/generated_data.csv', function (error, data) {
        // Put data into generic terms
        var prepData = function () {
            // all data is mapped and returned
            var keys = Object.keys(variables);
            keys.forEach(function(series){
                 variables[series] = data.map(function (d) {
                        return { x: +d[series], y: +d[yVar], id: d.id, type: series };
                    });
            });
        };

        prepData();
        var scatter = ScatterPlot().Title("Happiness Score by Economy, Trust & Health").yTitle('Happiness Score').xTitle("Indicators");
        var chart = d3.select("#vis2").datum(chartData).call(scatter);

        updateVars =  function() {
            chartData.length = 0;
            var selected =  $("input:checkbox:checked");
            var keys = [];
            for (let i = 0; i < selected.length; i++){
                keys.push(selected[i].value);
            }
            for(var el of seriesNames){
                if(keys.indexOf(el) != -1){
                    var series_a = new Object();
                    series_a.key = el;
                    series_a.values = variables[el];
                    chartData.push(series_a);
                }
            }
            chart.datum(chartData).call(scatter);

            var pvalue = 0;
            var pub = 'No';
            if (keys.length == 1) {
                if (keys[0] == 'x1') {
                    pvalue = 0.128765011;
                } else if (keys[0] == 'x1') {
                    pvalue = 0.4840859;
                }
            } else if (keys.length == 2) {
                if(keys[0] == 'x1' && keys[1] == 'x2') {
                    pvalue = 0.4840859;
                } else if(keys[0] == 'x2' && keys[1] == 'x3') {
                    pvalue = 0.210957409574648;
                } else if(keys[0] == 'x1' && keys[1] == 'x3') {
                    pvalue = 0.420889108678542;
                }
            } else if (keys.length == 3) {
                pvalue = 1.33055625860781E-227;
            }
            if (pvalue <= 0.05) {
                pub = 'Yes';
            }
            d3.select('#p-val').text(pvalue);
            d3.select('#pub').text(pub);
        }
        updateVars();

        $(".form-check-input").change(function () {
            updateVars();
        });

    });

    // hide curve initially
    d3.select('.curve').style('opacity', 0);

    // add scroll event
    window.onscroll = function() { updateVis() };

    // update visualization based on position from top
    function updateVis() {
        if (document.body.scrollTop < 100) {
            d3.select('.curve').style('opacity', 0);
            d3.select('.scatter').style('opacity', 0);
        } else if (document.body.scrollTop > 100 && document.body.scrollTop < 600) {
            d3.select('.curve').style('opacity', 1);
            d3.select('.vertical').style('opacity', 0);
            d3.select('.area').style('opacity', 0);
            d3.select('.scatter').style('opacity', 0);
        } else if (document.body.scrollTop > 600 && document.body.scrollTop < 1300) {
            d3.select('.curve').style('opacity', 1);
            d3.select('.vertical').style('opacity', 1);
            d3.select('.area').style('opacity', 0);
            d3.select('.scatter').style('opacity', 0);
        } else if (document.body.scrollTop > 1300 && document.body.scrollTop < 1800) {
            d3.select('.curve').style('opacity', 1);
            d3.select('.vertical').style('opacity', 1);
            d3.select('.area').style('opacity', 1);
            d3.select('.scatter').style('opacity', 0);
        } else if (document.body.scrollTop > 1800 && document.body.scrollTop < 2000) {
            d3.select('.curve').style('opacity', 0);
            d3.select('.scatter').style('opacity', 0);
        } else if (document.body.scrollTop > 2000) {
            d3.select('.curve').style('opacity', 0);
            d3.select('.scatter').style('opacity', 1);
        }
    }

});
