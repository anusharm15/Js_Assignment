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
					}
					return obj;
				});
				firebase.database().ref('cart_items').set(newObj, function(error) {
				    if (error) {
				      // The write failed...
				    }else {
				    	var modal = document.getElementById("myModal");
		    			modal.style.display = "none";
				      	ref.loadData();
				    }
				 });
			},(error)=>{

			});
		},

		/********* create and render list items 
			@params : data as array of json
		**********/
		renderHTML : function(data){
			var html = "";
			var load = document.getElementById("loader");

			for(var i=0; i<data.length; i++){
				html += `<li>
				<div class="listitem_block">
					<div class="peritem_block" data-id="${data[i].id}">
					<div class="img_block"><img data-img="${data[i].img_name}" src="images/${data[i].img_name}" alt="${data[i].title}"></div>
					<div class="content_block">
						<h5 class="item_title" data-title="${data[i].title}">${data[i].title}</h5>
						<p data-style="${data[i].style}">Style #: ${data[i].style}</p>
						<p data-color="${data[i].color}">Color: ${data[i].color}</p>
						<p data-size="${data[i].size}" class="size_mobile">Size: ${data[i].size}</p>
						<p class="quantity_mobile" data-quantity="${data[i].quantity}">QTY: <input type="text" value="${data[i].quantity}"></p>
						<p class="price_mobile" data-price="${data[i].price}"><sup>$</sup><strong>${data[i].price}</strong></p>
						
					</div>
						<ul class="action_block">
							<li class="editBtn"><a href="javascript:void(0);">Edit</a> &nbsp;</li>
							<li>&nbsp;&nbsp;<a href="javascript:void(0);"><strong>X</strong> Remove &nbsp;</a></li>
							<li>&nbsp;&nbsp;<a href="javascript:void(0);">Save for Later</a></li>
						</ul>
					</div>
					<div data-size="${data[i].size}" class="size">${data[i].size}</div>
					<div data-size="${data[i].quantity}" class="quantity"><input type="text" value="${data[i].quantity}"></div>
					<div data-size="${data[i].price}" class="price"><sup>$</sup>${data[i].price}</div>
				</div>
				</li>`
			}
			document.getElementById('list').innerHTML = html;
			$(".loading").hide();
			this.bindListEvents();

		},

		/******** bind events on list items after cretae dynamic list *******/
		bindListEvents: function(){
			var listitem = document.querySelectorAll('.listitem_block .peritem_block');
			var modal = document.getElementById("myModal");
			var span = document.getElementsByClassName("close")[0];
			var datasets = "";
			var ref = this;
			var obj = {};

			for (var item of listitem) {
				// item.addEventListener('click', function(event) {
				item.onclick = function(event){
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

					if(event.target.innerHTML == 'Edit'){
						modal.style.display = "block";
						ref.showPopup(obj);
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
		showPopup: function(obj){
			//console.log(obj)
			var html = "";
			var ref = this;
			html +=`<div class="modal_leftpart">
						<div class="mainBlock_leftPart">
			   			<div class="line"></div>
			   			<div class="content_leftpart"><h4>${obj.title}</h4><p><sup>$</sup>${obj.price}</p><div>${obj.style} <br> <a href="javascript:void(0)" id="yellow"></a><a href="javascript:void(0)" id="green"></a></div></div><div>
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
			$("#yellow").on('click',function(){
				selected_color = $(this)[0].id;
				if($(this).hasClass("active")){
					$(this).css("background-color", "#e4e473");
					$(this).removeClass("active");
				}else{
					$(this).css("background-color", "yellow");
					$(this).addClass("active");
				}

				if($("#green").hasClass("active")){
					$(this).css("background-color", "#e4e473");
					$(this).removeClass("active");
					selected_color = "green";
				}
				
			})

			$("#green").on('click',function(){
				selected_color = $(this)[0].id;
				
				if($(this).hasClass("active")){
					$(this).css("background-color", "#8ac58a");
					$(this).removeClass("active");
				}else{
					$(this).css("background-color", "green");
					$(this).addClass("active");
				}

				if($("#yellow").hasClass("active")){
					$(this).css("background-color", "#8ac58a");
					$(this).removeClass("active");
					selected_color = "yellow";
				}
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
		}

	}

})();

export {
	controller
}