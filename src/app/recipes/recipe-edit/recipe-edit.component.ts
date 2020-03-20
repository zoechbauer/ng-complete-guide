import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'] !== undefined ? +params['id'] : null;
      this.editMode = this.id != null;
      this.initForm();
    });
  }

  private initForm() {
    let recipeName = '';
    let recipeImgPath = '';
    let recipeDescription = '';
    const recipe = this.recipeService.getRecipe(this.id);

    if (this.editMode) {
      recipeName = recipe.name;
      recipeImgPath = recipe.imagePath;
      recipeDescription = recipe.description;
    }
    // empty values for new recipe, recipe values for edit recipe
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName),
      imagePath: new FormControl(recipeImgPath),
      description: new FormControl(recipeDescription)
    });
  }

  onSubmit() {
    console.log(this.recipeForm);
  }
}
