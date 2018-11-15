import {ajaxCall} from './service';
const $ = require('jquery');

var controller = (function() {

	return{

		/**** upload local json data to firebase database ******/
		uploadData: function(){
			ajaxCall.loadData('data.json').then(data =>{
				firebase.database().ref('cart_items').set(data);
		   		this.renderHTML(data.data);
			},(error)=>{

			});
		},

		/********** load data from firebase, if data not found on firebase then upload data ***********/
		loadData : function(){	
			$(".loading").show();
			ajaxCall.loadData('https://demoapp-8fd72.firebaseio.com/cart_items.json').then(data =>{
				console.log(data);
				if(!data || data == 'undefined' || data == null)
			  	this.uploadData();
			  	else
			    this.renderHTML(data.data);
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

		/********* create and render list items 
			@params : data as array of json
		**********/
		renderHTML : function(data){
			var html = "";
			var img_name = "";
			var total = 0;
			var load = document.getElementById("loader");
			for(var i=0; i<data.length; i++){
				
				total = total+ (parseInt(data[i].price) * data[i].quantity);

				html += `<li>
				<div class="listitem_block">
					<div class="peritem_block" data-id="${data[i].id}" tabindex="-1">
					<div class="img_block" tabindex="-1"><img data-role="image" data-img="${data[i].img_name}" src="images/${data[i].img_name}" alt="${data[i].title}"></div>
					<div class="content_block" tabindex="-1">
						<h5 class="item_title" data-title="${data[i].title}">${data[i].title}</h5>
						<p data-style="${data[i].style}">Style #: ${data[i].style}</p>
						<p data-color="${data[i].color}">Color: ${data[i].color}</p>
						<p data-size="${data[i].size}" class="size_mobile">Size: ${data[i].size}</p>
						<p class="quantity_mobile" data-quantity="${data[i].quantity}">QTY: <input type="text" value="${data[i].quantity}"></p>
						<p class="price_mobile" data-price="${data[i].price}"><sup>$</sup><strong>${data[i].price}</strong></p>
						
					</div>
						<ul class="action_block" tabindex="-1">
							<li class="editBtn"><a href="javascript:void(0);" id="editList">Edit</a> &nbsp;</li>
							<li>&nbsp;&nbsp;<a href="javascript:void(0);" id="remove"><strong>X</strong> Remove &nbsp;</a></li>
							<li>&nbsp;&nbsp;<a href="javascript:void(0);">Save for Later</a></li>
						</ul>
					</div>
					<div data-size="${data[i].size}" class="size">${data[i].size}</div>
					<div data-quantity="${data[i].quantity}" class="quantity"><input type="text" value="${data[i].quantity}"></div>
					<div data-price="${data[i].price}" class="price"><sup>$</sup>${data[i].price}</div>
				</div>
				</li>`
			}
			document.getElementById('list').innerHTML = html;
			$(".loading").hide();
			this.bindListEvents(data);

			$(".sub_amount").html("<sup>$</sup>"+parseInt(total)+".00");
			$(".total_amount").html("<h4><sup>$</sup>"+(parseInt(total)-7)+".00</h4>");

		},

		/******** bind events on list items after cretae dynamic list *******/
		bindListEvents: function(data){
			var listitem = document.querySelectorAll('.listitem_block .peritem_block');
			var modal = document.getElementById("myModal");
			var span = document.getElementsByClassName("close")[0];
			var datasets = "";
			var ref = this;
			var obj = {};

			for (var item of listitem) {
				// item.addEventListener('click', function(event) {
				item.onclick = function(event){
					console.log(event)
					datasets = $(this).children('.content_block');
					obj.id = $(this)[0].dataset.id;
					obj.title = datasets[0].children[0].dataset.title;
					obj.style = datasets[0].children[1].dataset.style;
					obj.color = datasets[0].children[2].dataset.color;
					obj.size = datasets[0].children[3].dataset.size;
					obj.quantity = datasets[0].children[4].dataset.quantity;
					obj.price = datasets[0].children[5].dataset.price;
					var img = $(this).children('.img_block');
					obj.img = img[0].childNodes[0].dataset.img;

					//obj.imgArr = arr;

					if(event.target.id == 'editList'){
						modal.style.display = "block";
						ref.showPopup(data, obj);
					}
					if(event.target.id == 'remove'){
						//modal.style.display = "block";
						ref.removeItem(data, obj);
					}
				};	
			}

			span.onclick = function() {
			    modal.style.display = "none";
			}

		},

		/******** open popup 
			@params : obj as data items of selected list 
		********/
		showPopup: function(data, obj){
			var arr = [];
			for(let i=0; i<data.length; i++){
				if(data[i].id == obj.id){
					for(var j=0; j<data[i].images.length; j++){
						arr.push(data[i].images[j])
					}
				}
			}
			obj.imgArr = arr;
			console.log(obj)
			var html = "";
			var ref = this;
			html +=`<div class="modal_leftpart">
						<div class="mainBlock_leftPart">
			   			<div class="line"></div>
			   			<div class="content_leftpart"><h4>${obj.title}</h4><p><sup>$</sup>${obj.price}</p><div>${obj.style} <br> <a href="javascript:void(0)" id="${obj.id}" class="yellow"></a><a href="javascript:void(0)" id="${obj.id}" class="green"></a><a href="javascript:void(0)" id="${obj.id}" class="default"></a></div></div><div>
			   				<div class="styled-select">
							   <select id="size_select">
							     <option> SIZE : </option>
							     <option> S </option>
							     <option> M </option>
							     <option> L </option>
							   </select>
							  <span class="fa fa-sort-desc"></span>
							</div>
							<div class="styled-select ">
							   <select id="qty_select">
							     <option> QTY : </option>
							     <option> 1 </option>
							     <option> 2 </option>
							     <option> 3 </option>
							   </select>
							  <span class="fa fa-sort-desc"></span>
							</div>
							</div>
						<div class="continue_btn editbtn" id="edit"><input type="button" value="EDIT"></div>
						<div class="detail_link"><a href="javascript:void(0)">See product details</a></div>
			   			</div>
		   			</div>
		   	<div class="modal_rightpart"><img src="images/${obj.img}" alt="${obj.title}">
		   	</div>`
			document.getElementById("modal_body").innerHTML = html;

			$("#size_select").val(obj.size);
			$("#qty_select").val(obj.quantity);

			this.bindevents_Popup(obj);

		},

		/******* bind events on popup ********/
		bindevents_Popup: function(obj){
			var selected_color = obj.color;
			var ref = this;
			var bgcolor = "";
			
			for(var i=0; i<obj.imgArr.length; i++){
				if(obj.imgArr[i].default){
				 	bgcolor = obj.imgArr[i].default.split(".")[0];
				}
			}
			$(".default").css("background-color", bgcolor)			

			$(".yellow").hover(function(){
				for(var i=0; i<obj.imgArr.length; i++){
					if(obj.imgArr[i].yellow){
						var yellow = obj.imgArr[i].yellow;
					}
				}
				var img = "images/"+yellow;
				$(".modal_rightpart").find("img").attr("src", img);
			})
			$(".green").hover(function(){
				for(var i=0; i<obj.imgArr.length; i++){
					if(obj.imgArr[i].green){
						var green = obj.imgArr[i].green;
					}
				}
				var img = "images/"+green;
				$(".modal_rightpart").find("img").attr("src", img)
			})
			$(".default").hover(function(){
				for(var i=0; i<obj.imgArr.length; i++){
					if(obj.imgArr[i].default){
						var color = obj.imgArr[i].default;
					}
				}
				var img = "images/"+color;
				$(".modal_rightpart").find("img").attr("src", img)
			})

			$(".yellow").click(function(){
				selected_color = "yellow";
				$(this).addClass("active");
				$("#green").removeClass("active");
				$("#default").removeClass("active");
			})

			$(".green").click(function(){
				selected_color = "green";
				$(this).addClass("active");
				$("#yellow").removeClass("active");
				$("#default").removeClass("active");
			})

			$(".default").click(function(){
				selected_color = bgcolor;
				$(this).addClass("active");
				$("#yellow").removeClass("active");
				$("#green").removeClass("active");
			})


			document.getElementById("edit").addEventListener("click",function(){
				console.log($("#size_select").val());
				console.log($("#qty_select").val());
				console.log(selected_color);
				var updateItems ={
					"size": $("#size_select").val(),
					"quantity": $("#qty_select").val(),
					"color": selected_color
				}
				ref.updateData(obj.id, updateItems);
			})
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
		},

	}

})();

export {
	controller
}