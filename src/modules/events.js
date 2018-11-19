import {controller} from './controller';
import {view} from './view';

const $ = require('jquery');


var event = (function (){

	return {

		/******** bind events on list items after cretae dynamic list *******/
		bindListEvents: function(data){
			var listitem = document.querySelectorAll('.listitem_block .peritem_block');
			var modal = document.getElementById("myModal");
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

					//obj.imgArr = arr;

					if(event.target.id == 'editList'){
						modal.style.display = "block";
						view.showPopup(data, obj);
					}
					if(event.target.id == 'remove'){
						controller.removeItem(data, obj);
					}
				};	
			}
		},

		/******* bind events on popup ********/
		bindevents_Popup: function(obj){
			var selected_color = obj.color;
			var ref = this;

			$(".default").css("background-color", obj.bgcolor)			

			$(".yellow").hover(function(){
				var img = "src/images/"+obj.yellowImg;
				$(".modal_rightpart").find("img").attr("src", img);
			})
			$(".green").hover(function(){
				var img = "src/images/"+obj.greenImg;
				$(".modal_rightpart").find("img").attr("src", img)
			})
			$(".default").hover(function(){
				var img = "src/images/"+obj.defaultImg;
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
				selected_color = obj.bgcolor;
				$(this).addClass("active");
				$("#yellow").removeClass("active");
				$("#green").removeClass("active");
			})


			document.getElementById("edit").addEventListener("click",function(){
				var updateItems ={
					"size": $("#size_select").val(),
					"quantity": $("#qty_select").val(),
					"color": selected_color
				}
				controller.updateData(obj.id, updateItems);
			})

			var close = document.getElementsByClassName("close")[0];
			var modal = document.getElementById("myModal");
			close.onclick = function() {
			    modal.style.display = "none";
			}
		}
	}

})()

export{
	event
}