selDataset();

function selDataset() {
    
    d3.json("../data/samples.json").then((d) => {
        var names = d.names;
        names.forEach((sampleid) => {
        option
            .append("option")
            .text(sampleid)
            .property("value", sampleid);
        });
    
        const defaultSample = names[Math.floor(Math.random()*names.length)]
        chart(defaultSample);
        demographicData(defaultSample);
    });

    var option = d3.select("#selDataset");
}

function demographicData(sample) {
    d3.json("../data/samples.json").then((d) => {
        var metadata = d.metadata;
        var metaFilter = metadata.filter(sampleid => 
            sampleid.id == sample);
        var filteredData = metaFilter[0]
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(filteredData).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });
    });
}
  
function chart(sample) {
  d3.json("samples.json").then((d) => {
    var sampledata= d.samples;
    var sampleFilter= sampledata.filter(sampleid => 
        sampleid.id == sample);
    var filteredData= sampleFilter[0]
  
    var otu_ids = filteredData.otu_ids;
    var otu_labels = filteredData.otu_labels;
    var sample_values = filteredData.sample_values;

    var bar_data =[
        {
            type:"bar",
            y:otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x:sample_values.slice(0,10).reverse(),
            text:otu_labels.slice(0,10).reverse(),
            orientation:"h"  
        }
    ];
    
    var barLayout = {
        title: "Top 10 OTUs found in individual",
        margin: { t: 45, l: 200 }
    };
    
    Plotly.newPlot("bar", bar_data, barLayout);
  
    var bubble_layout = {
        title: "Top 10 OTUs found in individual",  
        margin: { t: 0 },
        xaxis: { title: "OTU ID" },
        hovermode: "closest",
    };
  
    var bubble_data = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            color: otu_ids,
            size: sample_values,
            colorscale: 'Rainbow'
        }
    }];
  
    Plotly.newPlot("bubble", bubble_data, bubble_layout);
  

    
  });
}
   
function optionChanged(newSample) {
    chart(newSample);
    demographicData(newSample);
}