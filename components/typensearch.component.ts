import {Component, Input, Output, EventEmitter, ContentChild} from 'angular2/core';
import {NgModel} from 'angular2/common';
import {HTTP_PROVIDERS} from 'angular2/http';
import {TypeSearchService} from './type-search.service';
import {ISuggestions} from './suggestions.interface';

@Component({
    selector: 'typensearch',
    template: `
        <div class="tns">
            <div class="tns-form-wrapper">
                <input type="text" 
                    [placeholder]="placeholder" 
                    [(ngModel)]="value" 
                    (keydown)="onValueChange($event)" (blur)="toggleSuggestions(false)"
                    (focus)="toggleSuggestions(false)"
                /><button (click)="onActionClick()">{{actionButtonLabel}}</button>
            </div>
            <div class="tns-suggestions" 
                [ngClass]="{'has-suggestions': hasSuggestions, 
                            'is-selectable': isSelectable}">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    providers: [HTTP_PROVIDERS, TypeSearchService],
})
export class TypeNSearchComponent {

    static UP_KEY:number = 38;
    static DOWN_KEY:number = 40;
    static ENTER_KEY:number = 13;
    
    /**
     * Search input placeholder text
     *
     *
     */
    @Input() placeholder: string = 'keywords';
    
    /**
     * Predefined search value keyword associated with input
     *
     *
     */
    @Input() value: string = '';
    
    lastValue:string = '';

    /**
     * Label text for the action button
     *
     *
     */
    @Input() actionButtonLabel: string = 'Search';
    
    /**
     * Data source url that supports GET http method,
     * for example: /api/countries.json?country=KEYWORD, then
     * KEYWORD is reserved word
     *
     */
    @Input() url: string = '';
    
    /**
     * Millisecs time after key typing finishes, then trigger the data query
     *
     *
     */
    @Input() debounceTime: number = 400;
    
    /**
     * timeout object to handle the key typing
     *
     *
     */
    private inputTimeout = null;

    /**
     * Minimum keyword length to trigger query
     *
     *
     */
    @Input() minKeywordLength: number = 1;

    /**
     * Whether or not the suggestions are selectable in order
     * to autocomplete the input field
     *
     */
    @Input() isSelectable: boolean = true;
    
    /**
     * Result filter function
     *
     *
     */
    @Input() queryResultFilter: (data:any) => any = null;
    
    /**
     * Event/Output triggered when action button is hit and it has
     * no empty space
     *
     */
    @Output() onSubmit = new EventEmitter();
    
    /**
     * Event/Output triggered when there are suggestions matches for
     * the current keyword
     *
     */
    @Output() onMatches = new EventEmitter();
    
    /**
     * Nested suggestions/dropdown component
     *
     */
    public suggestionsComponent:ISuggestions = null;
    
    /**
     * Flag to let the view know when to display dropdown or not
     *
     */
    private hasSuggestions: boolean = false;

    constructor(private typeSearchService: TypeSearchService) {}
    
    ngOnInit() {
        this.lastValue = this.value;
        if (this.url === '') {
            this.error('required url property not provided');
        }
    }
    
    onValueChange(event) {
        clearTimeout(this.inputTimeout);
        if (this.isSelectable) {
            var keyCode = event.keyCode;
            if (keyCode === TypeNSearchComponent.UP_KEY || 
                keyCode === TypeNSearchComponent.DOWN_KEY) {
                event.preventDefault();
                this.suggestionsComponent
                    .didMoveUpDown(keyCode === TypeNSearchComponent.UP_KEY);
                return;
            }
            if (keyCode === TypeNSearchComponent.ENTER_KEY) {
                this.toggleSuggestions(false);
                return;
            }
        }
        this.inputTimeout = setTimeout(() => this.getMatches(), this.debounceTime);
    }
    
    getMatches() {
        this.lastValue = this.value;
        if (!this.suggestionsComponent) {
            this.error('no nested suggestions component provided');
            return;
        }
        if (this.value !== '' && this.value.length >= this.minKeywordLength) {
            var resultsObservable = this.typeSearchService.query(this.url, this.value);
            if (this.queryResultFilter) {
                var resultsObservable = this.typeSearchService
                    .queryFiltered(this.url, this.value, this.queryResultFilter);
            }
            resultsObservable
                .subscribe(data => this.onMatchesHandler(data),  err => this.log(err));
        } else {
            this.hasSuggestions = false;
        }
    }
    
    toggleSuggestions(show:boolean) {
        if (show) {
            this.hasSuggestions = this.suggestionsComponent.hasSuggestions();
            return;
        }
        this.hasSuggestions = false;
    }

    didSelected(item:any) {
        if (!item) {
            // when user is switching between the suggestions and goes out of the
            // suggestion list, the input field remains the same
            this.value = this.lastValue;
            return;
        }
        this.value = item.value;
    }

    onMatchesHandler(data) {
        this.suggestionsComponent.setData({suggestions: data});
        this.hasSuggestions = this.suggestionsComponent.hasSuggestions();
        this.onMatches.emit(this.suggestionsComponent.getData());
    } 

    onActionClick() {
        if (this.value !== '') {
            this.onSubmit.emit(this.value);
            this.log('search submmited');
        }
    }

    log(data) {
        console.info('typensearch:', data);
    }

    error(data) {
        console.error('typensearch:', data);
    }
    
}
