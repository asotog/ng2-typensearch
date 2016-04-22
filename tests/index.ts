// typings reference added
// please see breaking changes under: 
// https://github.com/angular/angular/blob/master/CHANGELOG.md#user-content-200-beta6-2016-02-11
///<reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {bootstrap}    from 'angular2/platform/browser';
import {Component} from 'angular2/core';
import {TypeNSearchComponent, SearchSuggestionComponent} from '../typensearch';
import {CustomSearchSuggestionComponent} from './custom-search-suggestion.component';

console.info('booting app...');

@Component({
    selector: 'app',
    template: `
        <div>
            <typensearch url="/tests/api/countries.json?country=KEYWORD" [queryResultFilter]="filterSuggestions">
                <search-suggestion></search-suggestion>
            </typensearch>
            <typensearch url="https://restcountries.eu/rest/v1/name/KEYWORD" [queryResultFilter]="filterSuggestions">
                <search-suggestion></search-suggestion>
            </typensearch>
            <typensearch url="/tests/api/countries.json?country=KEYWORD" minKeywordLength="3" [queryResultFilter]="filterSuggestions">
                <custom-search-suggestion></custom-search-suggestion>
            </typensearch>
        </div>
    `,
    directives: [TypeNSearchComponent, SearchSuggestionComponent, CustomSearchSuggestionComponent]
})
export class App {
    
    filterSuggestions:(any) => any = function(data:any): any {
        return data.filter(item => item.name.toLowerCase().includes(this.keyword.toLowerCase()))
            .map(function(item) {
                item.value = item.name;
                return item;
            });
    }

    constructor() {
        
    }
    
}


bootstrap(App, []);
