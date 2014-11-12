//requirejs(["d3.min"]);
requirejs.config({

    paths: {
        'jquery2': '../extensions/GanttSense/jquery-1.4.2',
        'jqueryui2': '../extensions/GanttSense/jquery-ui-1.8.4',
        'ganttView': '../extensions/GanttSense/jquery.ganttView',
        'dateJS': '../extensions/GanttSense/date'
    },
    shim: {
        'jquery2': {
            exports: '$'
        },
        'jqueryui2': {
            deps: ['jquery2']
        },
        'ganttView': {
            deps: ['jquery2']
        },
        'dateJS':{
        	deps: ['jquery2']
        }
    }
});
//define( ["jquery", "jqueryui",,"./jquery.ganttView","text!./jquery.ganttView.css","text!./jquery-ui-1.8.4.css","text!./reset.css"], function ( $, cssContent,jQueryCSS) {
define( ["jquery2","jqueryui2","ganttView","dateJS"], function ($) {
	console.info("inside");
	$( "head" ).append('<link rel="stylesheet" type="text/css" href="../extensions/GanttSense/jquery.ganttView.css" />');
	$( "head" ).append('<link rel="stylesheet" type="text/css" href="../extensions/GanttSense/jquery-ui-1.8.4.css" />');
	$( "head" ).append('<link rel="stylesheet" type="text/css" href="../extensions/GanttSense/reset.css" />');
	
	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 5,
					qHeight: 2000
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 3
				},
				measures: {
					uses: "measures",
					min: 0
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		resize: function () {

		},
		paint: function ( $element, layout) {
			var qData = layout.qHyperCube.qDataPages[0];
			var qMatrix = qData.qMatrix;
			var id = "container_"+ layout.qInfo.qId;
			 if (document.getElementById(id)) {
	             $("#" + id).empty();
		    }
		    else {
		        $element.append($('<div />').attr("id", id));        
		   }
	       $("#" + id).width($element.width());
		   $("#" + id).height($element.height());
	       $element.css("overflow","auto");

			var sourcevalues;
			var recid = 1;
			var sourcedata = qMatrix.map(function(d) {
			return {
				"name":d[0].qText,
				"start":d[1].qText,
				"end":d[2].qText
				,"projStart":d[3].qText
				,"projEnd":d[4].qText
			}
			});

			var ganttData =[];

			sourcedata.forEach(function(d) {
			  if (d.start != '-') {
				var ganttStartArray = d.start.split('-');
				var ganttStartYear = ganttStartArray[0];
				var ganttStartMonth = ganttStartArray[1]-1;
				var ganttStartDay = ganttStartArray[2];
				var ganttStart = new Date(ganttStartYear,ganttStartMonth,ganttStartDay);

				var ganttFinishArray = d.end.split('-');
				var ganttFinishYear = ganttFinishArray[0];
				var ganttFinishMonth = ganttFinishArray[1]-1;
				var ganttFinishDay = ganttFinishArray[2];
				var ganttEnd = new Date(ganttFinishYear,ganttFinishMonth,ganttFinishDay);

				// console.log(d.start)
				// console.log('start array: '+ganttStartArray)
				// console.log('finish array: '+ganttFinishArray)
				// console.log('start year: '+ganttStartYear)
				// console.log('start month: '+ganttStartMonth)
				// console.log('start day: '+ganttStartDay)
				// console.log('finish year: '+ganttFinishYear)
				// console.log('finish month: '+ganttFinishMonth)
				// console.log('finish day: '+ganttFinishDay)


				var ganttProjStartArray = d.projStart.split('-');
				var ganttProjStartYear = ganttProjStartArray[0];
				var ganttProjStartMonth = ganttProjStartArray[1]-1;
				var ganttProjStartDay = ganttProjStartArray[2];
				var ganttProjStart = new Date(ganttProjStartYear,ganttProjStartMonth,ganttProjStartDay);

				var ganttProjFinishArray = d.projEnd.split('-');
				var ganttProjFinishYear = ganttProjFinishArray[0];
				var ganttProjFinishMonth = ganttProjFinishArray[1]-1;
				var ganttProjFinishDay = ganttProjFinishArray[2];
				var ganttProjEnd = new Date(ganttProjFinishYear,ganttProjFinishMonth,ganttProjFinishDay);

				// console.log(d.start)
				// console.log('Proj start array: '+ganttProjStartArray)
				// console.log('Proj finish array: '+ganttProjFinishArray)
				// console.log('Proj start year: '+ganttProjStartYear)
				// console.log('Proj start month: '+ganttProjStartMonth)
				// console.log('Proj start day: '+ganttProjStartDay)
				// console.log('Proj finish year: '+ganttProjFinishYear)
				// console.log('Proj finish month: '+ganttProjFinishMonth)
				// console.log('Proj finish day: '+ganttProjFinishDay)

					ganttData.push(
						{
							id: recid,
							name: d.name,
							series: [
								{
									"name": "Actual",
									"start": ganttStart,
									"end": ganttEnd,
									"color": "#ff0000"
								}
								,{
									"name": "Projected",
									"start": ganttProjStart,
									"end": ganttProjEnd,
									"color": "#e0e0e0"
								}

							] 
						}
					)
					
					recid += 1
				}
				}

			)

			var html = "<div id='eventMessage'></div>";
			/*var ganttData = [
	{
		id: 1, name: "Feature 1", series: [
			{ name: "Planned", start: new Date(2010,00,01), end: new Date(2010,00,03) },
			{ name: "Actual", start: new Date(2010,00,02), end: new Date(2010,00,05), color: "#f0f0f0" }
		]
	}, 
	{
		id: 2, name: "Feature 2", series: [
			{ name: "Planned", start: new Date(2010,00,05), end: new Date(2010,00,20) },
			{ name: "Actual", start: new Date(2010,00,06), end: new Date(2010,00,17), color: "#f0f0f0" },
			{ name: "Projected", start: new Date(2010,00,06), end: new Date(2010,00,17), color: "#e0e0e0" }
		]
	}, 
	{
		id: 3, name: "Feature 3", series: [
			{ name: "Planned", start: new Date(2010,00,11), end: new Date(2010,01,03) },
			{ name: "Actual", start: new Date(2010,00,15), end: new Date(2010,01,03), color: "#f0f0f0" }
		]
	}, 
	{
		id: 4, name: "Feature 4", series: [
			{ name: "Planned", start: new Date(2010,01,01), end: new Date(2010,01,03) },
			{ name: "Actual", start: new Date(2010,01,01), end: new Date(2010,01,05), color: "#f0f0f0" }
		]
	},
	{
		id: 5, name: "Feature 5", series: [
			{ name: "Planned", start: new Date(2010,02,01), end: new Date(2010,03,20) },
			{ name: "Actual", start: new Date(2010,02,01), end: new Date(2010,03,26), color: "#f0f0f0" }
		]
	}, 
	{
		id: 6, name: "Feature 6", series: [
			{ name: "Planned", start: new Date(2010,00,05), end: new Date(2010,00,20) },
			{ name: "Actual", start: new Date(2010,00,06), end: new Date(2010,00,17), color: "#f0f0f0" },
			{ name: "Projected", start: new Date(2010,00,06), end: new Date(2010,00,20), color: "#e0e0e0" }
		]
	}, 
	{
		id: 7, name: "Feature 7", series: [
			{ name: "Planned", start: new Date(2010,00,11), end: new Date(2010,01,03) }
		]
	}, 
	{
		id: 8, name: "Feature 8", series: [
			{ name: "Planned", start: new Date(2010,01,01), end: new Date(2010,01,03) },
			{ name: "Actual", start: new Date(2010,01,01), end: new Date(2010,01,05), color: "#f0f0f0" }
		]
	}
];*/

			$("#"+id).ganttView({ 
				data: ganttData,
				slideWidth: 900,
				behavior: {
					onClick: function (data) { 
						var msg = "You clicked on an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
						$("#eventMessage").text(msg);
					},
					onResize: function (data) { 
						var msg = "You resized an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
						$("#eventMessage").text(msg);
					},
					onDrag: function (data) { 
						var msg = "You dragged an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
						$("#eventMessage").text(msg);
					}
				}
			
		});
		}
	};
} );
