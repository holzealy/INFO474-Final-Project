$(function () {

    // Variables to show
    var xVar1 = 'x1';
    var xVar2 = '';
    var xVar3 = '';
    var xVar4 = '';
    var yVar = 'y';
    var seriesNames = new Set(["x1", "x2", "x3"]);
    var variables = { "x1": null, "x2": null, "x3": null};
    var chartData = new Array();

    // to store data for normal curve
    var data = [];
    // get data for normal curve
    function getData() {
        // loop to populate data array with probabily - quantile pairs
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

    // create chart using reusable function
    getData();
    var n = normal_curve();
    var chart1 = d3.select("#vis").datum(data).call(n);  


    //For creating scatterplot

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

        // create scatterplot using reusable function
        var scatter = ScatterPlot().Title("Happiness Score by Economy, Trust & Health").yTitle('Happiness Score').xTitle("Indicators");
        var chart = d3.select("#vis2").datum(chartData).call(scatter);

        // update chart variables when controls are changed
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
            //update
            chart.datum(chartData).call(scatter);

            //for displaying results
            var pvalue1 = 'N/A';
            var pvalue2 = 'N/A';
            var pvalue3 = 'N/A';
            var pub1 = 'N/A';
            var pub2 = 'N/A';
            var pub3 = 'N/A';
            if (keys.length == 1) {
                if (keys[0] == 'x1') {
                    pvalue1 = 0.129;
                    pub1 = 'no';
                } else if (keys[0] == 'x2') {
                    pvalue2 = 0;
                    pub2 = 'yes';
                } else if (keys[0] == 'x3') {
                    pvalue3 = 0.484;
                    pub3 = 'no';
                }
            } else if (keys.length == 2) {
                if(keys[0] == 'x1' && keys[1] == 'x2') {
                    pvalue1 = 0.484;
                    pvalue2 = 0;
                    pub1 = 'no';
                    pub2 = 'yes';
                } else if(keys[0] == 'x2' && keys[1] == 'x3') {
                    pvalue2 = 0;
                    pvalue3 = 0.211;
                    pub2 = 'yes';
                    pub3 = 'no';
                } else if(keys[0] == 'x1' && keys[1] == 'x3') {
                    pvalue1 = 0.117;
                    pvalue3 = 0.421;
                    pub1 = 'no';
                    pub3 = 'no';
                }
            } else if (keys.length == 3) {
                pvalue1 = 1.331E-227;
                pvalue2 = 0;
                pvalue3 = 0.663;
                pub1 = 'yes';
                pub2 = 'yes';
                pub3 = 'no';
            }

            setResults = function(num, value, pub) {
                pId = '#p-val' + num;
                pubId = '#pub' + num;
                    d3.select(pId).text(value).attr('class', pub);
                    d3.select(pubId).text(pub).attr('class', pub);
            }
            //get results for selected variables
            setResults(1, pvalue1, pub1);
            setResults(2, pvalue2, pub2);
            setResults(3, pvalue3, pub3);
        }

        // for initial chart on page load
        updateVars();

        // listen for changes
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
        } else if (document.body.scrollTop > 1300 && document.body.scrollTop < 1750) {
            d3.select('.curve').style('opacity', 1);
            d3.select('.vertical').style('opacity', 1);
            d3.select('.area').style('opacity', 1);
            d3.select('.scatter').style('opacity', 0);
        } else if (document.body.scrollTop > 1750 && document.body.scrollTop < 2000) {
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
