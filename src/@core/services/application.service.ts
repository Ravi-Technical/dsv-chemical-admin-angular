import { Injectable } from "@angular/core";
import { environment } from "../../environments/env";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_Response, IApplicationProductReq, IApplicationRequest } from "../models/commonModels";
import { Whole_API_URLs } from "../models/apiUrls";

@Injectable({
    providedIn: 'root'
})

export class ApplicationService {
    private API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    GET_ALL_APPLICATION_CATEGORIES(): Observable<API_Response<[]>> {
        return this.http.get<API_Response<[]>>(`${this.API_URL}${Whole_API_URLs.DSV_GET_ALL_APPLICATIONS}`);
    }

    GET_SINGLE_APPLICATION_CATEGORY(id: string): Observable<API_Response<any>> {
        return this.http.get<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_GET_APPLICATIONBY_ID}${id}`);
    }

    UPDATE_SINGLE_APPLICATION_CATEGORY(data: IApplicationRequest, id: string): Observable<API_Response<any>> {
        return this.http.put<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_UPDATE_APPLICATION}${id}`, data);
    }

    DELETE_SINGLE_APPLICATION_CATEGORY(id: string): Observable<API_Response<any>> {
        return this.http.delete<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_DELETE_APPLICATIONBY_ID}${id}`);
    }

    INSERT_APPLICATION_CATEGORY(data: IApplicationRequest): Observable<API_Response<any>> {
        return this.http.post<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_INSERT_APPLICATION}`, data);
    }

    // APPLICATION PRODUCTS 
    GET_ALL_APPLICATION_PRODUCTS(): Observable<API_Response<[]>> {
        return this.http.get<API_Response<[]>>(`${this.API_URL}${Whole_API_URLs.DSV_GET_ALL_APPLICATION_PRODUCTS}`);
    }
    GET_SINGLE_APPLICATION_PRODUCT(id: string): Observable<API_Response<any>> {
        return this.http.get<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_GET_APPLICATION_PRODUCT_BY_ID}${id}`);
    }
    INSERT_FRESH_APPLICATION_PRODUCT(data: IApplicationProductReq): Observable<API_Response<any>> {
        return this.http.post<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_INSERT_APPLICATION_PRODUCT}`, data)
    }
    DELETE_APPLICATION_PRODUCT_BY_ID(id: string): Observable<API_Response<any>> {
        return this.http.delete<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_DELETE_APPLICATION_PRODUCT}${id}`);
    }
    UPDATE_APPLICATION_PRODUCT(Id: string, data: IApplicationProductReq): Observable<API_Response<any>> {
        return this.http.put<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_UPDATE_APPLICATION_PRODUCT_BY_ID}${Id}`, data);
    }

}