import './scss/styles.scss';
import './scss/loader.scss';
import {controller} from './modules/render';

window.addEventListener("DOMContentLoaded",function(){
	controller.loadData()
})