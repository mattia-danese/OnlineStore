var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
name = "";
login = "";
signup = "";


http.createServer(function(request, response)
{
	var pathname = url.parse(request.url).pathname.substr(1);
	console.log("Request for " + pathname + " received.");
	checkPath(pathname,request,response);
}).listen(8081);

function checkPath(pathname,request,response)
{
	var extension = pathname.substring(pathname.indexOf(".") + 1);
	if((extension == "html") && (request.method == "GET"))
	{
		if(pathname == "checkout.html")
		{
			checkoutPage(pathname,response,extension);
		}
		else
		{
			noDataRequest(pathname,response,extension);	
		}
	}
	if(extension == "css")
	{
		noDataRequest(pathname,response,extension);
	}
	if(extension == "js")
	{
		noDataRequest(pathname,response,extension);
	}
	if((extension == "jpg") || (extension == "jpeg")) 
	{
		fs.readFile(pathname, function(err, data)
		{
			if (err)
			{	
				console.log(err);
				response.writeHead(404, {"Content-Type": 'image/"' + extension + '"'});
			}
			else
			{
				response.writeHead(200, {"Content-Type": 'image/"' + extension + '"'});
				response.write(data,"binary");
				response.end();
			}
		});
	}
	if((extension == "html") && (request.method == "POST"))
	{
		DataRequest(pathname,request,response);
	}
	if(pathname.includes(".") == false)
	{
		ajaxRequest(pathname,request,response);
	}
}

function ajaxRequest(pathname,request,response)
{
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	response.setHeader("Access-Control-Allow-Headers", "X-Requested-With, contenttype");
	response.setHeader("Access-Control-Allow-Credentials", true);
	
	response.writeHead(200, {"Content-Type": "text/plain"});
	request.on("data",function(info)
	{
		var dataObj = qs.parse(info.toString());
		var bag = fs.readFileSync("bag.txt").toString();
		if(bag[0] == "{")
		{
			fs.appendFile("bag.txt",';{"image":"' + dataObj.image + '","name":"' + dataObj.name + '","price":"' + dataObj.price + '","quantity":"' + dataObj.quantity + '"}', function(err)
						{
							if (err)
							{
								console.log(err);
								return;
							}
						});
		}
		else
		{
			fs.appendFile("bag.txt",'{"image":"' + dataObj.image + '","name":"' + dataObj.name + '","price":"' + dataObj.price + '","quantity":"' + dataObj.quantity + '"}', function(err)
						{
							if (err)
							{
								console.log(err);
								return;
							}
						}); 
		}
		console.log(dataObj.image);
	});
}

function noDataRequest(pathname,response,extension)
{	
	fs.readFile(pathname, function(err, data)
		{
			if (err)
			{	
				console.log(err);
				response.writeHead(404, {"Content-Type": "text/" + extension});
			}
			else
			{
				response.writeHead(200, {"Content-Type": "text/" + extension});
				response.write(data.toString());
				response.end();
			}
		});
}

function DataRequest(pathname,request,response)
{
	if(pathname == "login.html")
	{
		request.on("data", function(qstr)
		{
			var qobj = qs.parse(qstr.toString());
			checkForSignUp(qobj);
			console.log(signup);
			console.log(pathname);
			if(signup != "no")
			{
				fs.readFile(pathname, function(err, data)
				{
					if (err)
					{
						console.log(err);
						response.writeHead(404, {"Content-Type": "text/html"});
					}
					else
					{
						response.writeHead(200, {"Content-Type": "text/html"});
						fs.appendFile("dbase.txt", ';{"uname":"' + qobj.uname + '", "pword":"' + qobj.pword + '", "firstname":"' + qobj.firstname + '", "lastname":"' + qobj.lastname + '"}', function(err)
						{
							if (err)
							{
								return;
							}
						}); 
						response.write(data.toString());
						response.end();
					}
				});
			}
			else
			{
				fs.readFile("signin.html", function(err, data)
				{
					if (err)
					{
						console.log(err);
						response.writeHead(404, {"Content-Type": "text/html"});
					}
					else
					{
						response.writeHead(200, {"Content-Type": "text/html"}); 
						response.write(data.toString());
						response.write("\n<div class = 'red'>Username already exists</div>\n");
						response.end();
					}
				});
			}
		});
	}
	else
	{
		request.on("data", function(qstr)
		{
			var qobj = qs.parse(qstr.toString());
			checkForLogin(qobj);
			if(login != "yes")
			{
				fs.readFile("login.html", function(err, data)
				{
					if (err)
					{
						console.log(err);
						response.writeHead(404, {"Content-Type": "text/html"});
					}
					else
					{
						response.writeHead(200, {"Content-Type": "text/html"});
						if (request.method == "POST")
						{
							response.write(data.toString());
							response.write("\n<div class = 'red'>Username or Password incorrect</div>\n");
							response.end();
						}
					}
				});
			}
			else
			{
				fs.readFile(pathname, function(err, data)
				{
					if (err)
					{
						console.log(err);
						response.writeHead(404, {"Content-Type": "text/html"});
					}
					else
					{
						response.writeHead(200, {"Content-Type": "text/html"});
						if (request.method == "POST")
						{
							response.write(data.toString());
							response.write("\n<script>sessionStorage.setItem('name'," + name + ");</script>\n");
							response.end();
						}
					}
				});
			}
		});
	}
}

function checkForLogin(qobj)
{
	var loginData = fs.readFileSync("dbase.txt");
	loginData = loginData.toString().split(";");
	for (var i = 0; i < loginData.length; i++)
	{
		var dataObj = JSON.parse(loginData[i]);
		if (dataObj.uname == qobj.uname && dataObj.pword == qobj.pword)
		{
			name = JSON.stringify(dataObj.firstname);
			login = "yes";
			return;
		}
	}
}

function checkForSignUp(qobj)
{
	var loginData = fs.readFileSync("dbase.txt");
	loginData = loginData.toString().split(";");
	for (var i = 0; i < loginData.length; i++)
	{
		var dataObj = JSON.parse(loginData[i]);
		if(dataObj.uname == qobj.uname)
		{
			console.log(dataObj.uname);
			signup = "no";
			return;
		}
	}
}

function checkoutPage(pathname,response,extension)
{
	var bag = fs.readFileSync("bag.txt").toString();
	bag = JSON.stringify(bag);
	fs.readFile(pathname, function(err, data)
		{
			if (err)
			{	
				console.log(err);
				response.writeHead(404, {"Content-Type": "text/" + extension});
			}
			else
			{
				response.writeHead(200, {"Content-Type": "text/" + extension});
				response.write(data.toString());
				response.write("\n<script>create(" + bag + ");</script>\n");
				response.end();
			}
		});
}
console.log("Server running at http://127.0.0.1:8081");