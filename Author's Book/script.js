const authorApp = {};

authorApp.key = 'V4EMMNaUZ2nu18zIt2KCw';

authorApp.events = function () {
	$('form').on('submit', function (e) {
		e.preventDefault();
		$('#authorId').fadeOut();
		$('.displayWrapper').removeClass('hidden');
		$('#displayAuthor').fadeIn();
		//store the value (author name) that the user search
		const newAuthor = $("#authorSearch").val();
		authorApp.getId(newAuthor);
	});
}

// search.author API functionality starts below
authorApp.getId = (id) => {
	return $.ajax({
		url: 'http://proxy.hackeryou.com',
		method: 'GET',
		data: {
			reqUrl: `https://www.goodreads.com/api/author_url/<${id}>`,
			params: {
				key: authorApp.key
			},
			xmlToJSON: true
		}
	}).then(function (searchResult) {
		console.log(searchResult);               
		const id = searchResult.GoodreadsResponse.author.id;
		authorApp.displayAuthorInfo(searchResult.GoodreadsResponse.author);
		authorApp.getAuthor(id);
	})
}

authorApp.displayAuthorInfo = function (authorArray) {
	$('#displayAuthor').empty();
	const nameResult = $('<h1>').text(authorArray.name);
	const idResult = $('<h2>').text(`Author ID: ${authorArray.id}`);
	const display = $('<div>').addClass('authorInformation').append(nameResult,idResult);
	$('#displayAuthor').append(display);
	
};
//search.author API ends


// paginate author API starts here
//Make a request to get the API using the id from the first API
authorApp.getAuthor = (id) => { //use author id from the first API 
	return $.ajax({
		url: 'http://proxy.hackeryou.com',
		method: 'GET',
		data: {
		reqUrl: `https://www.goodreads.com/author/list.xml`,
		params: {
			key: authorApp.key,
			id: id
		},
		xmlToJSON: true
	}
	}).then(function (result) {
		console.log(result);
		authorApp.displayAuthor(result.GoodreadsResponse.author.books.book)
		authorApp.imagesOk(result.GoodreadsResponse.author.books.book[0].authors.author.image_url);
	});
}

//displaying the result
authorApp.displayAuthor = function (booksArray) {
	$('#authorSearch').empty();
	//put a filter so it only shows us filtered results of only the books that have images
	booksArray.filter(function (book) {
		return book.image_url != null;
		}).forEach(function (book) {
		//create a new variable and use the 'book' variable to grab the elements are display them
		const image = $('<img>').attr('src', book.image_url);
		const title = $('<h2>').text(book.title);
		const description = $('<p>').addClass('description').text(book.description);
		const pulicationDate = $('<h4>').text(`Published: ${book.published}`)
		const isbn = $('<p>').addClass('isbn').text(`ISBN: ${book.isbn13}`)
		const mainBook = $('<div>').addClass('book').append(image,title,description,pulicationDate,isbn);
		$('.displayBooks').append(mainBook);
		$('.footer').removeClass('hidden');
	});	
}

//to display author's image in the header area
authorApp.imagesOk = function (image) {
	const authorImage = $('<img>').attr('src', image.$t)
	$('.displayAuthor').append(authorImage)
}
//Paginate API ends here

//intro fade function
authorApp.introFade = function (){
	$('.startButton').on("click", function (e) {
		e.preventDefault();
		$("#intro").fadeOut();
		$("#authorId").fadeIn();
	});
}

//initialization function , call all functions here
authorApp.init = function () {
	authorApp.introFade();
	authorApp.events();
};

//document ready function
$(function () {
	authorApp.init();
});
