const $ = require('jquery');

var ajaxCall = {
	loadData(url){
		return $.ajax({
          url: url,
          type: 'GET',
          success(response) {
            return Promise.resolve(response)
          },
      	});
	} 
};

export{
	ajaxCall
}