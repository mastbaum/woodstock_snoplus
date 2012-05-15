function showPlotModal(title, data) {
  $("#modal-plot").plot(data);
  $("#plot-modal-title").html(title);
  $("#plot-modal").modal('show');
}

(function($) {
  /* sparkline via flot
   * adapted from http://joeloughton.com/blog/web-applications/sparklines-using-flot/
   */
  $.fn.sparkline = function(data) {
    var min_point = data[0];
    var min = Math.pow(2, 32) - 1 // max int

    var max_point = data[0];
    var max = -min + 1; // min int

    for (i in data) {
      if (data[i][1] < min) {
        min = data[i][1];
        min_point = data[i];
      }
      if (data[i][1] > max) {
        max = data[i][1];
        max_point = data[i];
      }
    }

    var options = {
      xaxis: {
        min: data[data.length-1][0] - (data[0][0] - data[data.length-1][0]) / 25,
        max: data[0][0] + (data[0][0] - data[data.length-1][0]) / 25
      },
      yaxis: {
        max: 1.05 * max_point[1],
        min: 0.95 * min_point[1]
      },
      grid: {
        show: false
      }
    };

    var series = [{
      data: data,
      color: '#000000',
      lines: {
        lineWidth: 0.8
      },
      shadowSize: 0
    }];

    // min and max
    series.push({
      data: [ min_point, max_point ],
      points: {
        show: true,
        radius: 1,
        fillColor: '#00a0ff'
      },
      color: '#00a0ff',
      shadowsize: 0
    });

    // end point
    series.push({
      data: [ data[0] ],
      points: {
        show: true,
        radius: 1,
        fillColor: '#ff0000'
      },
      color: '#ff0000',
      shadowsize: 0
    });

    $.plot($(this), series, options);

    return [data[0], min_point, max_point];
  };

  /* annotated sparkline */
  $.fn.sparkrow = function(data) {
    var sr_div = $('<div style="display:table"></div>');
    var sr_row = sr_div.append('<div style="display:table-row"></div>');

    // the sparkline
    var sl = $('<div style="display:table-cell;height:20px;width:100px"></div>');
    stats = sl.sparkline(data);
    $(this).append(sl);

    // the stats
    $(this).append('<div class="sparkdata" style="display:table-cell;color:red">' + stats[0][1].toFixed(3) + '</div>');
    $(this).append('<div class="sparkdata" style="display:table-cell;color:#00a0ff">' + stats[1][1].toFixed(3) + '</div>');
    $(this).append('<div class="sparkdata" style="display:table-cell;color:#00a0ff">' + stats[2][1].toFixed(3) + '</div>');

    return $(this);
  };

  /* plot with selectable zoom window
   * adapted from http://people.iola.dk/olau/flot/examples/zooming.html
   */
  $.fn.plot = function(data) {
    var series = [{
      data: eval(data).map(function(x) {
        return [x[0]*60*1000, x[1]];
      }),
      color: 'black'
    }];

    var options = {
      legend: { show: false },
      series: {
        lines: {
          show: true,
          lineWidth: 0.8
        },
        points: {
          show: true,
          radius: 1
        }
      },
      xaxis: { mode: 'time' },
      yaxis: { ticks: 10 },
      selection: {
        color: '#ccc',
        mode: "xy"
      },
      shadowSize: 0
    };

    var plot = $.plot($(this), series, options);

    // setup overview
    var overview = $.plot($("#modal-plot-overview"), series, {
      legend: { show: true, container: $("#modal-plot-overview-legend") },
      series: {
        lines: {
          show: true,
          lineWidth: 0.8
        },
        points: { show: false },
        shadowSize: 0
      },
      xaxis: {
        mode: 'time',
        ticks: 3
      },
      yaxis: { ticks: 3 },
      grid: { color: "#999" },
      selection: {
        color: '#ccc',
        mode: "xy"
      }
    });

    // now connect the two
    $(this).bind("plotselected", function (event, ranges) {
      // clamp the zooming to prevent eternal zoom
      if (ranges.xaxis.to - ranges.xaxis.from < 0.00001)
        ranges.xaxis.to = ranges.xaxis.from + 0.00001;
      if (ranges.yaxis.to - ranges.yaxis.from < 0.00001)
        ranges.yaxis.to = ranges.yaxis.from + 0.00001;

      // do the zooming
      plot = $.plot($(this), series,
      $.extend(true, {}, options, {
        xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
        yaxis: { min: ranges.yaxis.from, max: ranges.yaxis.to }
      }));

      // don't fire event on the overview to prevent eternal loop
      overview.setSelection(ranges, true);
    });

    $("#modal-plot-overview").bind("plotselected", function (event, ranges) {
      plot.setSelection(ranges);
    });
  };
})(jQuery);

