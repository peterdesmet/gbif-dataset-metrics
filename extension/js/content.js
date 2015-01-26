var getDatasetKeyFromURL = function() {
    var pathArray = window.location.pathname.split('/');
    var datasetKey = "";
    if (pathArray[1] == "dataset") { // On GBIF website, get datasetKey from URL.
        datasetKey = pathArray[2];
    } else { // Elsewhere, e.g. demo pages, use demo datasetKey.
        datasetKey = "42319b8f-9b9d-448d-969f-656792a69176"; // Coccinellidae
    }
    return datasetKey;
}

var getMetrics = function(datasetKey, showMetrics) {
    // Get data from metrics store in CartoDB.
    var url = "http://datafable.cartodb.com/api/v2/sql?q=SELECT * FROM gbif_dataset_metrics WHERE dataset_key ='" + datasetKey + "'";
    $.getJSON(url,function(result) {
        if (result["rows"] == "") {
            console.log("No metrics for this dataset");
        } else {
            showMetrics(result["rows"][0]); // Only one row [0] expected
        }
    });
}

var createMetricBar = function(metric) {
    // Create HTML for a metric, using Bootstrap progress bar.
    var html = '<div class="progress">';
    for (var i = 0; i < metric.counts.length; i++) {
        var percentage = Math.round(metric.counts[i]/metric.total*100,1);
        html = html + '<div class="progress-bar ' + metric.cssClass + '-' + i + '" style="width: ' + percentage + '%" data-toggle="tooltip" data-placement="top" title="' + metric.labels[i] + ' ' + percentage + '%"><span class="sr-only">' + metric.labels[i] + '</span></div>';
    }
    var html = html + '</div>';
    return html;
}

var basisOfRecordBar = function(metrics) {
    var basisOfRecords = {
        total: metrics["occurrences"],
        cssClass: "basis-of-record",
        labels: [
            "Preserved specimens",
            "Fossil specimens",
            "Living specimens",
            "Material samples",
            "Observations",
            "Human observations",
            "Machine observations",
            "Literature occurrences",
            "Unknown"
        ],
        counts: [
            metrics["bor_preserved_specimen"],
            metrics["bor_fossil_specimen"],
            metrics["bor_living_specimen"],
            metrics["bor_material_sample"],
            metrics["bor_observation"],
            metrics["bor_human_observation"],
            metrics["bor_machine_observation"],
            metrics["bor_literature"],
            metrics["bor_unknown"]
        ]
    };
    return createMetricBar(basisOfRecords);
}
