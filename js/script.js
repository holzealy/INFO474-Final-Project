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

    var data = [];

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

    var data2 = getData();
    console.log(data);
    var n = normal_curve();
    var chart1 = d3.select("#vis").datum(data).call(n);  

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
                    pvalue = 0.129;
                } else if (keys[0] == 'x1') {
                    pvalue = 0.484;
                }
            } else if (keys.length == 2) {
                if(keys[0] == 'x1' && keys[1] == 'x2') {
                    pvalue = 0.484;
                } else if(keys[0] == 'x2' && keys[1] == 'x3') {
                    pvalue = 0.211;
                } else if(keys[0] == 'x1' && keys[1] == 'x3') {
                    pvalue = 0.421;
                }
            } else if (keys.length == 3) {
                pvalue = 1.331E-227;
            }
            if (pvalue <= 0.05) {
                d3.select('#p-val').text(pvalue).attr('class', 'yes');
                d3.select('#pub').text(pub).attr('class', 'yes');
            } else {
                d3.select('#p-val').text(pvalue).attr('class', 'no');
                d3.select('#pub').text(pub).attr('class', 'no');
            }
            
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
        } else if (document.body.scrollTop > 2000 && document.body.scrollTop < 2400) {
            d3.select('.curve').style('opacity', 0);
            d3.select('.scatter').style('opacity', 1);
            d3.select('.trendline').style('opacity', 0);
        } else if (document.body.scrollTop > 2400) {
            d3.select('.curve').style('opacity', 0);
            d3.select('.scatter').style('opacity', 1);
            d3.select('.trendline').style('opacity', 1);
        }
    }

});
