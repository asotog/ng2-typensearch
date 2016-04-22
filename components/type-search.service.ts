import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TypeSearchService {
    
    keyword:string = "";

    constructor(private http: Http) {}
    
    query(url:string, keyword:string) {
        this.keyword = keyword;
        return this.http
        .get(url.replace(/KEYWORD/g, keyword))
        .map(res => res.json());
    }

    queryFiltered(url:string, keyword:string, queryFilter:(data:any) => any) {
        return this.query(url, keyword).map(queryFilter, this);
    }
}
