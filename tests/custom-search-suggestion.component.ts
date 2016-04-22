import {Component} from 'angular2/core';
import {SearchSuggestionComponent} from '../typensearch';
import {TypeNSearchComponent} from '../typensearch';

@Component({
    selector: 'custom-search-suggestion',
    template: `
        <div class="custom-search-suggestion">
            <ul>
                <li *ngFor="#item of data.suggestions; #i = index" 
                    (click)="didSelected(item)"
                    [ngClass]="{'hover': selectedIndex == i}">{{item.value}} <br><i>{{item.capital}}</i></li>
            </ul>
        </div>
    `
})
export class CustomSearchSuggestionComponent extends SearchSuggestionComponent {
    
    constructor(private search:TypeNSearchComponent) {
        super(search);
    }

}
