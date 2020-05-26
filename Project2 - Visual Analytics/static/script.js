function drawScreePlot(data) {
    // set the dimensions and margins of the graph
    var margin = {
            top: 10,
            right: 30,
            bottom: 55,
            left: 60
        },
        width = 660 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    var svg = d3.select("#pcachartdiv")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d, i) {
            return i + 1;
        }))
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(30));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.variance + 1;
        })])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#0b1a38")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d, i) {
                return x(i + 1)
            })
            .y(function(d) {
                return y(d.variance)
            })
        )

    

    // Add the points
    svg.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {
            return x(i + 1)
        })
        .attr("cy", function(d) {
            return y(d.variance)
        })
        .attr("r", 3.5)
        .attr("fill", "#7d1528")

    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 25) + ")")
        .style("text-anchor", "middle")
        .style('stroke', '#0b1a38')
        .style('stroke-opacity', '0.3')
        .attr("font-size", "14px")
        .text("Components");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style('stroke', '#0b1a38')
        .style('stroke-opacity', '0.3')
        .attr("font-size", "14px")
        .text("% variance");
}

function PCA_Random() {
    $.post("", {
        'request': 'randomsampling'
    }, function(result) {
        data = JSON.parse(result.pcadata)
        var sum = 0
        data.forEach(function(d) {
            sum += d.variance;
        });
        data.forEach(function(d) {
            d.variance = (d.variance / sum) * 100;
        });
        console.log(data);
        d3.select("#pcachartdiv").select("svg").remove();
        drawScreePlot(data);
    })
}

function PCA_Original() {
    $.post("", {
        'request': 'originaldata'
    }, function(result) {
        data = JSON.parse(result.pcadata)
        var sum = 0
        data.forEach(function(d) {
            sum += d.variance;
        });
        data.forEach(function(d) {
            d.variance = (d.variance / sum) * 100;
        });
        console.log(data);
        d3.select("#pcachartdiv").select("svg").remove();
        drawScreePlot(data);
    })
}

function PCA_Stratified() {
    $.post("", {
        'request': 'stratifiedsampling'
    }, function(result) {
        data = JSON.parse(result.pcadata)
        var sum = 0
        data.forEach(function(d) {
            sum += d.variance;
        });
        data.forEach(function(d) {
            d.variance = (d.variance / sum) * 100;
        });
        console.log(data);
        d3.select("#pcachartdiv").select("svg").remove();
        drawScreePlot(data);
    })
}

function drawScatterMatrix(data) {
    d3.selectAll("g").remove();

    var size = 180,
        padding = 30;
    //Load each columns
    var columnsDomain = {},
        columns = d3.keys(data[0]).filter(function(d) {
            return d !== "Cluster";
        }),
        n = columns.length; //Number of Columns
    //Domain based on columns
    columns.forEach(function(column) {
        columnsDomain[column] = d3.extent(data, function(d) {
            return d[column];
        });
    });

    var svg = d3.select("#pcachartdiv")
        .append("svg")
        .attr("width", size * n + padding)
        .attr("height", size * n + padding);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var xScale = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var yScale = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var g = svg.append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    g.selectAll(".x.axis")
        .data(columns)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) {
            return "translate(" + (n - i - 1) * size + ",0)";
        })
        .each(function(d) {
            d3.select(this).call(d3.axisBottom(xScale).tickSize(size * n));
        });

    g.selectAll(".y.axis")
        .data(columns)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) {
            return "translate(0," + i * size + ")";
        })
        .each(function(d) {
            d3.select(this).call(d3.axisLeft(yScale).tickSize(-size * n));
        });
    //Cell to represent plot in Matrix form
    var cell = g.selectAll(".cell")
        .data(cross(columns, columns))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) {
            return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
        })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) {
            return d.i === d.j;
        }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) {
            return d.x;
        });
    // Function to plot cells based on Number of Columns
    function plot(p) {
        var cell = d3.select(this);

        xScale.domain(columnsDomain[p.x]);
        yScale.domain(columnsDomain[p.y]);

        cell.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) {
                return xScale(d[p.x]);
            })
            .attr("cy", function(d) {
                return yScale(d[p.y]);
            })
            .attr("r", 3.5)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.8)
            .style("fill", "#00ffff");
    }
}

function drawScatterMatrixClustered(data) {
    d3.selectAll("g").remove();

    var size = 180,
        padding = 30;
    //Load each columns
    var columnsDomain = {},
        columns = d3.keys(data[0]).filter(function(d) {
            return d !== "Cluster";
        }),
        n = columns.length; //Number of Columns
    //Domain based on columns
    columns.forEach(function(column) {
        columnsDomain[column] = d3.extent(data, function(d) {
            return d[column];
        });
    });

    var svg = d3.select("#pcachartdiv")
        .append("svg")
        .attr("width", size * n + padding)
        .attr("height", size * n + padding);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var xScale = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var yScale = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var g = svg.append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    g.selectAll(".x.axis")
        .data(columns)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) {
            return "translate(" + (n - i - 1) * size + ",0)";
        })
        .each(function(d) {
            xScale.domain(columnsDomain[d]);
            d3.select(this).call(d3.axisBottom(xScale).tickSize(size * n));
        });

    g.selectAll(".y.axis")
        .data(columns)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) {
            return "translate(0," + i * size + ")";
        })
        .each(function(d) {
            yScale.domain(columnsDomain[d]);
            d3.select(this).call(d3.axisLeft(yScale).tickSize(-size * n));
        });
    //Cell to represent plot in Matrix form
    var cell = g.selectAll(".cell")
        .data(cross(columns, columns))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) {
            return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
        })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) {
            return d.i === d.j;
        }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) {
            return d.x;
        });
    // Function to plot cells based on Number of Columns
    function plot(p) {
        var cell = d3.select(this);

        xScale.domain(columnsDomain[p.x]);
        yScale.domain(columnsDomain[p.y]);

        cell.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) {
                return xScale(d[p.x]);
            })
            .attr("cy", function(d) {
                return yScale(d[p.y]);
            })
            .attr("r", 3.5)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.8)
            .style("fill", function(d) {
                return color(d.Cluster);
            });
    }
}
// Function to find Cross between each columns
function cross(a, b) {
    var c = [],
        n = a.length,
        m = b.length,
        i, j;
    for (i = -1; ++i < n;)
        for (j = -1; ++j < m;) c.push({
            x: a[i],
            i: i,
            y: b[j],
            j: j
        });
    return c;
}

function DrawScatterPlot(data) {
    // set the dimensions and margins of the graph
    var margin = {
            top: 10,
            right: 30,
            bottom: 50,
            left: 60
        },
        width = 660 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#pcachartdiv")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain([-150000, 300000])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([-10000, 30000])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return x(d.Component1);
        })
        .attr("cy", function(d) {
            return y(d.Component2);
        })
        .attr("r", 2.5)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.8)
        .style("fill", "#69b3a2")

    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 25) + ")")
        .style("text-anchor", "middle")
        .style('stroke', '#0b1a38')
        .style('stroke-opacity', '0.3')
        .attr("font-size", "12px")
        .text("Vector 1");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style('stroke', '#0b1a38')
        .style('stroke-opacity', '0.3')
        .attr("font-size", "12px")
        .text("Vector 2");

}

function drawScatterPlotColored() {
    // set the dimensions and margins of the graph
    var margin = {
            top: 10,
            right: 30,
            bottom: 40,
            left: 60
        },
        width = 660 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#pcachartdiv")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain([
            d3.min([0, d3.min(data, function(d) {
                return d.Component1 - 1
            })]),
            d3.max([0, d3.max(data, function(d) {
                return d.Component2 + 1
            })])
        ])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([
            d3.min([0, d3.min(data, function(d) {
                return d.Component2 - 1
            })]),
            d3.max([0, d3.max(data, function(d) {
                return d.Component2 + 1
            })])
        ])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    //     data.forEach(function(d) {
    //     d.Component1 = d.Component2
    //     d.Component1 = d.Component2
    // });

    var color = d3.scale.category10();

    var circles = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function(d) {
            return x(d.Component1)
        })
        .attr('cy', function(d) {
            return y(d.Component2)
        })
        .attr('r', '2.5')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.8)
        .style("fill", function(d) {
            return color(d.Cluster);
        });

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });

    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 25) + ")")
        .style("text-anchor", "middle")
        .style('stroke', '#0b1a38')
        .style('stroke-opacity', '0.3')
        .attr("font-size", "12px")
        .text("Vector 1");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style('stroke', '#0b1a38')
        .style('stroke-opacity', '0.3')
        .attr("font-size", "12px")
        .text("Vector 2");

}

function PCA_TwoScatter() {
    $.post("", {
        'request': 'pcatwovectororiginal'
    }, function(result) {
        data = JSON.parse(result.pcatwovectordata)
        console.log(data);
        d3.select("#pcachartdiv").select("svg").remove();
        DrawScatterPlot(data);
    })
}

function PCA_TwoScatterRandom() {
    $.post("", {
        'request': 'pcatwovectorrandom'
    }, function(result) {
        data = JSON.parse(result.pcatwovectordata)
        console.log(data);
        d3.select("#pcachartdiv").select("svg").remove();
        DrawScatterPlot(data);
    })
}

function PCA_TwoScatterStratified() {
    $.post("", {
        'request': 'pcatwovectorstratified'
    }, function(result) {
        data = JSON.parse(result.pcatwovectordata)
        console.log(data);
        d3.select("#pcachartdiv").select("svg").remove();
        drawScatterPlotColored(data);
    })
}

function ScatterMatrixOriginal() {
    $.post("", {
        'request': 'scattermatrixorig'
    }, function(result) {
        data = JSON.parse(result.scattermatrixdata)
        console.log(data);
        d3.select("#pcachartdiv").select("svg").remove();
        drawScatterMatrix(data);
    })
}

function ScatterMatrixStratified() {
    $.post("", {
        'request': 'scattermatrixstrat'
    }, function(result) {
        data = JSON.parse(result.scattermatrixdata)
        console.log(data);
        d3.select("#pcachartdiv").select("svg").remove();
        drawScatterMatrixClustered(data);
    })
}

function ScatterMatrixRandom() {
    $.post("", {
        'request': 'scattermatrixrandom'
    }, function(result) {
        data = JSON.parse(result.scattermatrixdata)
        console.log(data);
        d3.select("#pcachartdiv").select("svg").remove();
        drawScatterMatrix(data);
    })
}

function drawMDSScatterPlotColored(data, colorbool) {

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    }
    var height = 550 - margin.top - margin.bottom
    var width = 550 - margin.left - margin.right

    var svg = d3.select("#pcachartdiv")
        .append("svg")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);


    var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) {
            return d.x - 0.1;
        }), d3.max(data, function(d) {
            return d.x + 0.1;
        })])
        .range([0, width]).nice(); // output

    var yScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) {
            return d.y - 0.1;
        }), d3.max(data, function(d) {
            return d.y + 0.1;
        })])
        .range([height, 0]).nice(); // output


    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickSize(-height))
        .append("text")
        .attr("y", 50) //Lable Height X axis
        .attr("x", width) // Lable Width X axis
        .attr("text-anchor", "end")
        .style("fill", "#401400")
        .attr("font-size", "15px")
        .text("MDS1");

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale).tickSize(-width))
        .append("text")
        .attr("y", 50)
        .attr("dy", "-5.1em")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .style("fill", "#401400")
        .attr("font-size", "15px")
        .text("MDS2");

    g.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d) {
            return xScale(d.x)
        })
        .attr("cy", function(d) {
            return yScale(d.y)
        })
        .attr("r", 3)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.8)
        .style("fill", function(d) {
            return color(d.Cluster);
        })
;

    if (colorbool) {
        var legend = g.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 10)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 20)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {
                return d;
            });
    }

}

function Stratified_MDS_Co() {
    $.post("", {
        'request': 'mdsstratifiedco'
    }, function(jsondata) {
        d3.select("#pcachartdiv").select("svg").remove();
        data = JSON.parse(jsondata.mdsscatterdata);
        console.log(data);
        drawMDSScatterPlotColored(data, true);

    })
}

function Stratified_MDS_Eu() {
    $.post("", {
        'request': 'mdsstratifiedeu'
    }, function(jsondata) {
        d3.select("#pcachartdiv").select("svg").remove();
        data = JSON.parse(jsondata.mdsscatterdata);
        console.log(data);
        drawMDSScatterPlotColored(data, true);
    })
}

function Random_MDS_Co() {
    $.post("", {
        'request': 'mdsrandomco'
    }, function(jsondata) {
        d3.select("#pcachartdiv").select("svg").remove();
        data = JSON.parse(jsondata.mdsscatterdata);
        console.log(data);
        drawMDSScatterPlotColored(data, false);

    })
}

function Random_MDS_Eu() {
    $.post("", {
        'request': 'mdsrandomeu'
    }, function(jsondata) {
        d3.select("#pcachartdiv").select("svg").remove();
        data = JSON.parse(jsondata.mdsscatterdata);
        console.log(data);
        drawMDSScatterPlotColored(data, false);
    })
}

function Original_MDS_Co() {
    $.post("", {
        'request': 'mdsorigco'
    }, function(jsondata) {
        d3.select("#pcachartdiv").select("svg").remove();
        data = JSON.parse(jsondata.mdsscatterdata);
        console.log(data);
        drawMDSScatterPlotColored(data, false);

    })
}

function Original_MDS_Eu() {
    $.post("", {
        'request': 'mdsorigeu'
    }, function(jsondata) {
        d3.select("#pcachartdiv").select("svg").remove();
        data = JSON.parse(jsondata.mdsscatterdata);
        console.log(data);
        drawMDSScatterPlotColored(data, false);
    })
}