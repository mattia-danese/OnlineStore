function selectBig(small)
{
	var place1 = null;
	var place2 = null;
	for(var i = 0; i < images.length; i++)
	{
		if(document.getElementById("big").src.includes(images[i]))
		   place1 = i;
	}
	for(var a = 0; a < images.length; a++)
	{
		if(small.src.includes(images[a]))
		   place2 = a;
	}
	document.getElementById("big").src = images[place2];
	if(place1 % 2 == 0)
	{
		small.src = images[place1];
	}
	else
	{
		place1--;
		small.src = images[place1];
	}
	populate();
}

function populate()
{
	var place = null;
	for(var i = 0; i < images.length; i++)
	{
		if(document.getElementById("big").src.includes(images[i]))
		   place = i;
	}
	title.innerHTML = names[place];
	price.innerHTML = "$" + prices[place];
	overview.innerHTML = overviews[place];
}

function changeColor(color)
{
	var place = null;
	var source = document.getElementById("big").src;
	var index = source.lastIndexOf("/");
	source = source.substring(index+1);
	
	if(((color == "white") && (source[0] == "w")) || ((color == "blue") && (source[0] == "b")) || ((color == "red") && (source[0] == "R" )) || ((color == "black") && (source[0] == "b")) || ((color == "gold") && (source[0] == "G")) || ((color == "black") && (source[0] == "B")))
	{
		return;
	}
	for(var i = 0; i < images.length; i++)
	{
		if(document.getElementById("big").src.includes(images[i]) == true)
		{
			place = i;
		}
	}
	if((color == "white") || (color == "black"))
	{
		place--;
		document.getElementById("big").src = images[place];
	}
	if ((color == "blue") || (color == "red") || (color == "gold"))
	{
		place++;
		document.getElementById("big").src = images[place];
	}
	populate();
}

function checkLogin()
{
	if(sessionStorage.getItem("name"))
	{
		var name = sessionStorage.getItem("name");
		idStuff.innerHTML = "Hello, " + name;
	}
}

function addBag()
{
	var place = null;
	for(var i = 0; i < images.length; i++)
	{
		if(document.getElementById("big").src.includes(images[i]))
			place = i;
	}
				
	var addRequest = new XMLHttpRequest();
	addRequest.open("POST", "http://127.0.0.1:8081/addBagRequest", true);
	var info = "image=" + images[place] + "&&" + "name=" + names[place] + "&&" + "price=" + prices[place] + "&&" + "quantity=" + quant.value;
	addRequest.send(info);
}

function showRefund2()
{
	if((fundText2.style.display == "") || (fundText2.style.display == "none"))
	{
		fundText2.style.display = "block";
		fundText.style.textDecoration = "underline";	
	}
	else
	{
		fundText2.style.display = "none";
		fundText.style.textDecoration = "";
	}
}

function showTermText2()
{
	if((termText2.style.display == "") || (termText2.style.display == "none"))
	{
		termText2.style.display = "block";
		termText.style.textDecoration = "underline";	
	}
	else
	{
		termText2.style.display = "none";
		termText.style.textDecoration = "";
	}
}
