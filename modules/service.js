const $ = require('jquery');

var ajaxCall = {
	loadData(url){
		return $.ajax({
          url: url,
          type: 'GET',
          success(response) {
            return Promise.resolve(response)
          },
          error(error) {
            return Promise.reject(error)
          }
      	});
	} 
};

export{
	ajaxCall
}