function simulateP()
{
	var c = 0;
	
	try
	{
		c = parseFloat(document.getElementById("c").value);
	}
	catch (err)
	{
		alert("Number must be between 0 and 1");
	}
	
	document.getElementById("p-result").innerHTML = calculatePFromC(c);
}

function simulateC()
{
	var p = 0;
	
	try
	{
		p = parseFloat(document.getElementById("p").value);
	}
	catch (err)
	{
		alert("Number must be between 0 and 1");
	}
	
	document.getElementById("c-result").innerHTML = calculateCFromP(p);
}

function calculatePFromC(c)
{
	var sum = 0;
	
	for (var n = 1, pByN = 0; c * (n - 1) <= 1; n++)
	{
		var pOnN = Math.min(1, c * n) * (1 - pByN);
		pByN += pOnN;
		sum += n * pOnN;
	}
	
	return (1 / sum);
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