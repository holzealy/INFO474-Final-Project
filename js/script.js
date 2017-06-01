$(function () {

    /* Create a scatter plot of 1960 life expectancy (gdp) versus 2013 life expectancy (life_expectancy).*/
    // Variables to show
    var xVar1 = 'Economy';
    var xVar2 = '';
    var xVar3 = '';
    var xVar4 = '';
    var yVar = 'target';
    var seriesNames = new Set(["Economy", "Family", "Trust", "Health"]);
    var variables = { "Economy": null, "Family": null, "Trust": null, "Health": null };
    var chartData = new Array();

    // Load data in using d3's csv function.
    d3.csv('data/normalized_2016.csv', function (error, data) {
        // Put data into generic terms
        var prepData = function () {
            // all data is mapped and returned
            var keys = Object.keys(variables);
            keys.forEach(function(series){
                 variables[series] = data.map(function (d) {
                        return { x: +d[series], y: +d[yVar], id: d.Country, type: series };
                    });
            });
        };

        prepData();
        var scatter = ScatterPlot().Title("Happiness Score by Economy, Trust, Family & Health").yTitle('Happiness Score').xTitle("Indicators");
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
