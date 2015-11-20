var rotationAmount = 90,
	imageDegree = 0,
	imageSrc = $('.image').attr('src'),
	imageURLList = [],
	imageDescripList = [],
	imageNumber = 0,
	searchQuery = 'kandinsky', // I chose for a default of abstract artists, as it is not allway that easy to tell what's up or down in their work.
	requestURL,
	method,
	xhr; 

//////////////////////////////
//	functions to run immediately
//////////////////////////////
europeanaRequest();	

//////////////////////////////
//	click events:
//////////////////////////////
$('.rotate').on('click', function() {
	imageDegree += rotationAmount;
	$('.image').css({transform: 'rotate(' + imageDegree + 'deg)'});
});

$('.guess').on('click', function() {
	guessChecker();
});

$('.next-image').on('click', function() {
	imageNumber += 1;
	if (imageNumber < imageURLList.length) {
		randomImage();
	} 
	else {
		if (confirm('There are no more images to guess! Would you like to play again?')) {
			imageNumber = 0;
			randomImage();
		}
	};
}); 

$('.submit').on('click', function() {
	var userInput = $('#search').val();
	if (userInput.length === 0) {
		$('body').css('background-color', '#B5443A');
		alert('Please fill in something!');
		$('body').css('background-color', '#ffffff');
	} 
	else {
	searchQuery = userInput.replace(/ /g, "+").toLowerCase();
	console.log('"' + searchQuery + '" was submitted');
	europeanaRequest();	
	}
});

function europeanaRequest() {
	method = "GET";
	requestURL = 'http://www.europeana.eu/api/v2/search.json?wskey=y3kTNAyGu&query=' + searchQuery + '&start=1&rows=96&profile=standard&reusability=open';
	xhr = new XMLHttpRequest()
	xhr.open(method, requestURL, true);
	xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			imageURLList = [];
			imageDescripList = [];
			var APIResponse = JSON.parse(xhr.responseText);
			console.log(APIResponse);
			for (var i=0; i<APIResponse.itemsCount; i++){
				if (APIResponse.items[i].hasOwnProperty('edmPreview')) {
					imageURLList.push(APIResponse.items[i].edmPreview[0]);
				} 
			};
			for (var i=0; i<APIResponse.itemsCount; i++){
				if (APIResponse.items[i].hasOwnProperty('title')) {
					imageDescripList.push(APIResponse.items[i].title[0]);
				} 
			};
			randomImage(); //loads image from aray AFTER aray is filled up
		};
	};
};

function guessChecker() {
	if (imageDegree === 0 || imageDegree%360 === 0) {
		$('body').css('background-color', '#70CF9A');
		alert('Well done! Click "next image" to continue.');
		$('body').css('background-color', '#ffffff');
	} 
	else {
		$('body').css('background-color', '#B5443A');
		alert('Sorry, that was incorrect. Try again!');
		$('body').css('background-color', '#ffffff');
	};
};

function randomAngle() {
	return (Math.floor(Math.random()*4)*90);
};

function randomImage(){
	imageDegree = randomAngle();
	$('.image').attr('src',imageURLList[imageNumber]);
	$('.description').text(imageDescripList[imageNumber]);
	$('.image').css({transform: 'rotate(' + imageDegree + 'deg)'});
};


