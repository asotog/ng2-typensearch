import {Component, Input} from 'angular2/core';
import {ISuggestions} from './suggestions.interface';
import {TypeNSearchComponent} from './typensearch.component';

@Component({
    selector: 'search-suggestion',
    template: `
        <div class="search-suggestion">
            <ul>
                <li *ngFor="#item of data.suggestions; #i = index" (click)="didSelected(item)"
                    [ngClass]="{'hover': selectedIndex == i}">{{item.value}}</li>
            </ul>
        </div>
    `
})
export class SearchSuggestionComponent implements ISuggestions {
    
    private data:Object = {};
    private selectedIndex:number = -1;
 
    constructor(private typedSearchComponent:TypeNSearchComponent) {
        this.typedSearchComponent.suggestionsComponent = this;
    }

    /* Begin ISuggestions implementation */

    setData(data:Object) {
        this.selectedIndex = -1;
        this.data = data;
    }
    
    getData() {
        var list = this.data['suggestions'];
        return list && Array.isArray(list) ? list : [];
    }

    hasSuggestions(): boolean {
        return this.getData().length > 0;
    }
    
    // sugestions selection
    didMoveUpDown(up:boolean) {
        if (this.hasSuggestions()) {
            var list = this.getData();
            var increment = (up) ? -1 : 1;
            increment = (up && this.selectedIndex === -1) ? list.length : increment;
            this.selectedIndex += increment;
            if (!list[this.selectedIndex]) {
                this.selectedIndex = -1;
            }
            this.typedSearchComponent.didSelected(list[this.selectedIndex]);
        }
    }

    didSelected(item:any) {
        this.typedSearchComponent.didSelected(item);
    }
    /* End ISuggestions */
}
