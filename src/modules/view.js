import {event} from './events';
import {controller} from './controller';
const $ = require('jquery');

var view = (function(){


	return {

		/********* create and render list items 
			@params : data as array of json
		**********/
		renderHTML : function(data){
			var html = "";
			var img_name = "";
			var price = 0;
			var sub_amount = 0;
			var load = document.getElementById("loader");
			for(var i=0; i<data.length; i++){
				
				price =  (parseInt(data[i].price) * data[i].quantity);
				sub_amount = sub_amount + price;

				html += `<li>
				<div class="listitem_block">
					<div class="peritem_block" data-id="${data[i].id}" tabindex="-1">
					<div class="img_block" tabindex="-1"><img data-role="image" data-img="${data[i].img_name}" src="src/images/${data[i].img_name}" alt="${data[i].title}"></div>
					<div class="content_block" tabindex="-1">
						<h5 class="item_title" data-title="${data[i].title}">${data[i].title}</h5>
						<p data-style="${data[i].style}">Style #: ${data[i].style}</p>
						<p data-color="${data[i].color}" style="text-transform: capitalize;">Color: ${data[i].color}</p>
						<p data-size="${data[i].size}" class="size_mobile">Size: ${data[i].size}</p>
						<p class="quantity_mobile" data-quantity="${data[i].quantity}">QTY: <input type="text" value="${data[i].quantity}" disabled></p>
						<p class="price_mobile" data-price="${price}"><sup>$</sup><strong>${price}.00</strong></p>
						
					</div>
						<ul class="action_block" tabindex="-1">
							<li class="editBtn"><a href="javascript:void(0);" id="editList">Edit</a> &nbsp;</li>
							<li>&nbsp;&nbsp;<a href="javascript:void(0);" id="remove"><strong>X</strong> Remove &nbsp;</a></li>
							<li>&nbsp;&nbsp;<a href="javascript:void(0);">Save for Later</a></li>
						</ul>
					</div>
					<div data-size="${data[i].size}" class="size">${data[i].size}</div>
					<div data-quantity="${data[i].quantity}" class="quantity"><input type="text" value="${data[i].quantity}" disabled></div>
					<div data-price="${price}" class="price"><sup>$</sup>${price}.00</div>
				</div>
				</li>`
			}
			document.getElementById('list').innerHTML = html;
			$(".loading").hide();
			event.bindListEvents(data);

			$(".sub_amount").html("<sup>$</sup>"+parseInt(sub_amount)+".00");
			$(".total_amount").html("<h4><sup>$</sup>"+(parseInt(sub_amount)-7)+".00</h4>");

		},

		/******** open popup 
			@params : obj as data items of selected list 
		********/
		showPopup: function(data, obj){
			for(let i=0; i<data.length; i++){
				if(data[i].id == obj.id){
					for(var j=0; j<data[i].images.length; j++){
						if(data[i].images[j].yellow){
							obj.yellowImg = data[i].images[j].yellow;
						}else if(data[i].images[j].green){
							obj.greenImg = data[i].images[j].green;
						}else if(data[i].images[j].default){
							obj.defaultImg = data[i].images[j].default;
							obj.bgcolor = data[i].images[j].default.split(".")[0];
						}
					}
				}
			}
			var html = "";
			var ref = this;
			html +=`<div class="modal_leftpart">
						<div class="mainBlock_leftPart">
			   			<div class="line"></div>
			   			<div class="content_leftpart"><h4>${obj.title}</h4><p><sup>$</sup>${obj.price}.00</p><div>${obj.style} <br> <a href="javascript:void(0)" id="${obj.id}" class="yellow"></a><a href="javascript:void(0)" id="${obj.id}" class="green"></a><a href="javascript:void(0)" id="${obj.id}" class="default"></a></div></div><div>
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
		   	<div class="modal_rightpart"><img src="src/images/${obj.img}" alt="${obj.title}">
		   	</div>`
			document.getElementById("modal_body").innerHTML = html;

			$("#size_select").val(obj.size);
			$("#qty_select").val(obj.quantity);

			event.bindevents_Popup(obj);

		}
	}

})()


export {
	view
}