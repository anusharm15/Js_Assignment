import './scss/styles.scss';
import './scss/loader.scss';
import {controller} from './modules/controller';

window.addEventListener("DOMContentLoaded",function(){
	controller.loadData()
})