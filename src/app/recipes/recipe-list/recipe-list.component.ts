import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
	recipes: Recipe[] = [
		new Recipe('test recipe', 'test description', 'https://upload.wikimedia.org/wikipedia/commons/9/93/Spaghetti.jpg')
	]

  constructor() { }

  ngOnInit() {
  }

}
