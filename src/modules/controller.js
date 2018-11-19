import {view} from './view';
import {ajaxCall} from './service';
const $ = require('jquery');


var controller = (function(){

	return {

		/**** upload local json data to firebase database ******/
		uploadData: function(){
			ajaxCall.loadData('data.json').then(data =>{
				firebase.database().ref('cart_items').set(data);
		   		view.renderHTML(data.data);
			},(error)=>{

			});
		},

		/********** load data from firebase, if data not found on firebase then upload data ***********/
		loadData : function(){	
			$(".loading").show();
			ajaxCall.loadData('https://demoapp-8fd72.firebaseio.com/cart_items.json').then(data =>{
				//console.log(data);
				if(!data || data == 'undefined' || data == null)
			  	this.uploadData();
			  	else
			    view.renderHTML(data.data);
			},(error)=>{

			});
		},

		/********  update new data to firebase 
			@params : key as id and obj as data need to change 
		************/
		updateData: function(key, obj){
			$(".loading").show();
			ajaxCall.loadData('https://demoapp-8fd72.firebaseio.com/cart_items.json').then(data =>{
			  	var ref = this;
				var newObj = {
					"data": data.data					
				};
				var updatedArray = newObj.data.map(item => {
					if(item.id == key){
						item.size = obj.size;
						item.color = obj.color;
						item.quantity = obj.quantity;
						if(obj.color == "yellow"){
							item.images.map(res => {
								if(res.yellow){
									item.img_name = res.yellow;
								}
							})
						}else if(obj.color == "green"){
							item.images.map(res => {
								if(res.green){
									item.img_name = res.green;
								}
							})
						}else{
							item.images.map(res => {
								if(res.default){
									item.img_name = res.default;
								}
							})
						}
					}
					return item;
				});
				firebase.database().ref('cart_items').set(newObj, function(error) {
				    if (error) {
				    
				    }else {
				    	var modal = document.getElementById("myModal");
		    			modal.style.display = "none";
				      	ref.loadData();
				    }
				 });
			},(error)=>{
				alert("error")
			});
		},

		removeItem: function(data, obj){
			var confirm = window.confirm("Do you really want to delete this item");
			if(!confirm){
				return false;
			}
			var ref = this;
			var newObj = {
				"data": data					
			};
			for(var i=0; i<newObj.data.length; i++){
				if(obj.id == newObj.data[i].id){
					newObj.data.splice(i, 1);
				}
			}
			firebase.database().ref('cart_items').set(newObj, function(error) {
			    if (error) {
			    
			    }else {
			    	alert("Removed Succesfully");
			    	ref.loadData();
			    }
			 });
		}
	}

})()


export {
	controller
}