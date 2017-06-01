$(function () {

    d3.select('.curve').style('opacity', 0);

    window.onscroll = function() { updateVis() };

    function updateVis() {
        if (document.body.scrollTop < 100) {
            d3.select('.curve').style('opacity', 0);
        } else if (document.body.scrollTop > 100 && document.body.scrollTop < 600) {
            d3.select('.curve').style('opacity', 1);
            d3.select('.vertical').style('opacity', 0);
            d3.select('.area').style('opacity', 0);
        } else if (document.body.scrollTop > 600 && document.body.scrollTop < 1300) {
            d3.select('.curve').style('opacity', 1);
            d3.select('.vertical').style('opacity', 1);
            d3.select('.area').style('opacity', 0);
        } else if (document.body.scrollTop > 1300 && document.body.scrollTop < 1800) {
            d3.select('.curve').style('opacity', 1);
            d3.select('.vertical').style('opacity', 1);
            d3.select('.area').style('opacity', 1);
        } else if (document.body.scrollTop > 1800) {
            d3.select('.curve').style('opacity', 0);
        }
    }

});
