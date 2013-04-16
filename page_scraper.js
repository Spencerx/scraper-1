var http = require("http"),
	urlHandler  = require("url"),
	jsdom = require("jsdom"),
	request = require('request');

var PageScraper = function PageScraper(){

	if(PageScraper.caller != PageScraper.getInstance){
        throw new Error("This object cannot be instanciated");
    }

	this.read = function(url, contentHandler){
		
		//TODO: validate url
		console.log("URL: "+url);

		request.get(url, function(error, response, body) {
			
			if (typeof response !== 'undefined'){

				var contentType = response.headers['content-type'] || "";
				var isHTMLDocument = contentType.indexOf("html")>-1 ? true : false;

				console.log(contentType);

				if (!error && response.statusCode == 200) {

					if (!isHTMLDocument){
						contentTypeHTML = "</p>" + contentType + "</p>";
						contentHandler.call(this, contentType);

					}else{
						try{
							jsdom.env(
							  body,
							  ["http://code.jquery.com/jquery.js"],
							  function(errors, window) {

							  	

							  	var title = "<h3>"+ window.$("title").text() + "</h3>";
							  	var des = "<p>" + window.$("meta[name=description]").attr("content") + "</p>";

							  	var links = "<ul>";

							  	window.$("a").each(function(){

							  		var src = this.href;
							  		var fileOrScript = 
							  				src.indexOf("file:///") === 0 || 
							  				src.indexOf("javascript") === 0;
							  		
							  		if (this.href == "" || this.href.length == 0 || fileOrScript) 
							  			return;

							  		
							  		//console.log(src);


							  		links += "<li><a href='" + src + "'>" + src + "</a></li>"
							  	});

							  	links += "</ul>";

							  	var html = title + des + links;

							    contentHandler.call(this, html)
							  }
							);

						}catch(err){
							console.log("***Error in jsdom: \n"+err);
							contentHandler.call(this, "<div class='alert alert-error'>Oh Snap! There's no response from:  " + 
								url + "</div>")
						}
					}
				}else{
					 console.log('error: '+ response.statusCode)
	        		 console.log(body)
	        		 contentHandler.call(this, "<div class='alert alert-error'>Oh Snap! There's no response from:  " + 
						url + "</div>")
				}

			}else{
				contentHandler.call(this, "<div class='alert alert-error'>Oh Snap! There's no response from:  " + 
						url + "</div>")
			}	

		});

	}

}

PageScraper.instance = null;
PageScraper.getInstance = function(){
    if(this.instance === null){
        this.instance = new PageScraper();
    }
    return this.instance;
}

module.exports = PageScraper.getInstance();