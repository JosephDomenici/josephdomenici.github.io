var maxWidth = 1920;
var minWidth = 400;
var maxBodyWidth = .9;
var minBodyWidth = .5;

function resizeWidth()
{
	var perc = (maxWidth - window.innerWidth) / (maxWidth - minWidth); // 1110 = .5, 1920 = 0, 300 = 1
	perc = minBodyWidth + (perc * (maxBodyWidth - minBodyWidth));
	perc = Math.min(Math.max(perc, minBodyWidth), maxBodyWidth);
	perc = (perc * 100) + '%';
	
	console.log(perc);
	
	document.body.style.width = perc;
}

window.onresize = resizeWidth();