var sliderPFromC;
var sliderCFromP;
var inputPFromC;
var inputCFromP;
var chartP;
var chartC;

window.onload = function()
{
	var sliders = document.querySelectorAll("input[type=range]");
	for (var i = 0; i < sliders.length; i++) { sliders[i].addEventListener('input', updateValue); }
	
	var inputs = document.querySelectorAll("input[type=text]");
	for (var i = 0; i < inputs.length; i++) { inputs[i].addEventListener('change', updateValue); }
	
	sliderPFromC = document.getElementById("slider-p-from-c");
	sliderCFromP = document.getElementById("slider-c-from-p");
	inputPFromC = document.getElementById("input-p-from-c");
	inputCFromP = document.getElementById("input-c-from-p");
	
	createChartP();
	createChartC();
}

function createChartP()
{
	var p = calculatePFromC(sliderPFromC.value);
	
	chartP = new Chart(document.getElementById("chart-p").getContext('2d'), {
		type: "line",
		data: {
			labels: p.trials,
			datasets: [{
				label: "Trial % frequency",
				data: p.data,
				borderColor: "#3e95cd",
				fill: false
			}, {
				label: "Cumulative %",
				data: p.cumData,
				borderColor: "#8e5ea2",
				fill: false
			}]
		},
		options: {
			title: {
				display: true,
				fontColor: "#333333",
				fontFamily: "'Nunito Sans', sans-serif",
				fontSize: 16,
				fontStyle: 'bold',
				position: 'top',
				text: "(P) = " + (Math.round(p.value * 10000) / 100).toFixed(2) + "%"
			},
			scales: {
				yAxes: [{
					ticks: {
						min: 0,
						max: 1,
						stepSize: 0.1
					}
				}]
			},
			responsive: true,
			aspectRatio: 1,
			maintainAspectRatio: true
		}
	});
}

function createChartC()
{
	// chartC = ....
}

function updateValue(e)
{
	// when updating chart, display the real value being calculated for (restrict to between min-max, but don't mess with input field)
	switch (e.target.id)
	{
		case "slider-p-from-c":
			inputPFromC.value = sliderPFromC.value;
			simulateP();
			break;
		case "slider-c-from-p":
			inputCFromP.value = sliderCFromP.value;

			break;
		case "input-p-from-c":
			inputPFromC.value = inputPFromC.value.replace(/[^\d.]/g, "");
			
			if (inputPFromC.value === "NaN" || inputPFromC.value <= 0)
			{
				inputPFromC.value = inputPFromC.defaultValue;
			}
			
			sliderPFromC.value = inputPFromC.value;
			simulateP();
			
			break;
		case "input-c-from-p":
			
			
			break;
		default:
			alert("You broke me. Please contact josephdomenici@gmail.com!");
			return;
	}
}

function simulateP()
{
	var c = 0;
	
	try
	{
		c = parseFloat(document.getElementById("input-p-from-c").value);
	}
	catch (err)
	{
		alert("Number must be between 0 and 1");
	}
	
	var p = calculatePFromC(c);
	
	chartP.data.labels = p.trials;
	chartP.data.datasets = [{
		label: "Trial % frequency",
		data: p.data,
		borderColor: "#3e95cd",
		fill: false
	}, {
		label: "Cumulative %",
		data: p.cumData,
		borderColor: "#8e5ea2",
		fill: false
	}];
	chartP.options = {
		title: {
				display: true,
				fontColor: "#333333",
				fontFamily: "'Nunito Sans', sans-serif",
				fontSize: 16,
				fontStyle: 'bold',
				position: 'top',
				text: "(P) = " + (Math.round(p.value * 10000) / 100).toFixed(2) + "%"
		},
		scales: {
			yAxes: [{
				ticks: {
					min: 0,
					max: 1,
					stepSize: 0.1
				}
			}]
		}
	};
	
	chartP.update({
		duration: 0,
		easing: "linear"
	});
}

function simulateC()
{
	var p = 0;
	
	try
	{
		p = parseFloat(document.getElementById("c-from-p").value);
	}
	catch (err)
	{
		alert("Number must be between 0 and 1");
	}
	
	document.getElementById("c-result").innerHTML = calculateCFromP(p);
}

function calculatePFromC(c)
{
	var p = { value: -1, data: [], cumData: [], trials: [] }, sum = 0;
	
	for (var n = 1, pByN = 0; c * (n - 1) < 1; n++)
	{
		var pOnN = Math.min(1, c * n) * (1 - pByN);
		pByN += pOnN;
		sum += n * pOnN;
		
		p.data.push(pOnN);
		// p.cumData.push(pByN);
		p.trials.push(n);
	}
	
	p.cumData = calculateCumP(c);
	p.value = 1 / sum;
	
	return p;
}

function calculateCumP(c)
{
	var cumData = [];
	
	for (var n = 0; c * n < 1; n++)
	{
		if (n == 0)
		{
			cumData.push(c);
		}
		else
		{
			var cumP = 1 - ((1 - (c * (n + 1))) * (1 - cumData[n - 1]));
			cumData.push(Math.min(1, cumP));
		}
	}
	
	return cumData;
}

function calculateCFromP(p)
{
	var cUpper = p, cLower = 0, cMid = 0, p2 = 1;
	
	while (true)
	{
		cMid = (cUpper + cLower) / 2;
		var p1 = calculatePFromC(cMid);
		
		if (Math.abs(p1 - p2) <= 0)
		{
			break;
		}
		
		if (p1 > p)
		{
			cUpper = cMid;
		}
		else
		{
			cLower = cMid;
		}
		
		p2 = p1;
	}
	
	return cMid;
}