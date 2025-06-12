import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-search',
  imports: [],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css'
})
export class ProductSearchComponent {
  constructor(private router: Router){}
  word : string = "";
  onSearch(event:any)
  {
    let word = event.target.value
    this.router.navigate([],
      { queryParams: { search: word }, queryParamsHandling: 'merge' }
      );
  }

}
