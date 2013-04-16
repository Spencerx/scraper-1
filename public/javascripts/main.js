$(function(){

	"use strict";
	function JSTest(){

		if ( JSTest.prototype._singletonInstance ) {
	      return JSTest.prototype._singletonInstance;
	    }

	    JSTest.prototype._singletonInstance = this;
	    this.toggleWaitingBar = function(){

	    }
		this.test = function(pageURL, callback){
			

			$.ajax({
				type: 'POST',
				data: { "input_url": pageURL},
				url: "/test/jstest/"
			}).done(function(resultBody){

				callback.call(this, resultBody)

			});
		}
	}

	var jsTest = new JSTest();
	var input = $("#input-url");
	var output = $("#output-content");
	var waiting_bar = $("#waiting-bar");

	$('#input-form').submit(function() {

		event.preventDefault();

		var pageURL = input.val()
		if (pageURL.indexOf("http://") === -1 && pageURL.indexOf("https://") === -1) pageURL = "http://" + pageURL;

		waiting_bar.fadeIn();
		jsTest.test(pageURL, function(result){

			output.prepend(result);
			output.prepend("<p><i>" + Date() + "</i></p>");
			output.prepend("<p><b>" + pageURL + "</b></p>");
			waiting_bar.fadeOut();
		});
	});
	

});



	