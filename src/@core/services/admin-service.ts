import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/env';
import { Observable } from 'rxjs';
import { About_Api_Response, API_Response, CategoryModel, IAbout, IProduct, ProductCateogriesModel, ProductModel } from '../models/commonModels';
import { Whole_API_URLs } from '../models/apiUrls';
import { AboutUs } from '../../components/about-us/about-us';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

 private API_URL = environment.apiUrl;  // https://localhost:7126/api/

  constructor(private _http: HttpClient) { }

  Insert_New_Product(data:ProductModel):Observable<API_Response<any>>{
      return this._http.post<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_INSERT_PORDUCT}`, data);
  }

  GetAllProduct():Observable<API_Response<[]>>{
    return this._http.get<API_Response<[]>>(`${this.API_URL}${Whole_API_URLs.DSV_GET_ALL_PRODUCTS}`);
  }

  GetProductById(id:string):Observable<API_Response<any>>{
     return this._http.get<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_GET_PRODUCT_BY_ID}${id}`);
  }

  UpdateProductById(updatedData:ProductModel, id:string):Observable<API_Response<any>>{
   return this._http.put<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_UPDATE_PRODUCT_BY_ID}${id}`, updatedData);
  }

  DeleteProductById(id:string):Observable<API_Response<any>>{
   return this._http.delete<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_DELETE_PRODUCT}${id}`);
  }

  //**************************************** Categories APIs Integration *************************************** //

  Get_Generic_CategoryById(id:string):Observable<API_Response<any>>{
     return this._http.get<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_GET_CATEGORY_BY_ID}/${id}`);
  }

  Get_Generic_Product_Categoris():Observable<API_Response<[]>>{
    return this._http.get<API_Response<[]>>(`${this.API_URL}${Whole_API_URLs.DSV_GET_ALL_CATEGORIES}`);
  }

  Insert_New_Generic_Category(data:CategoryModel):Observable<API_Response<any>>{
     return this._http.post<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_INSERT_NEW_CATEGORY}`, data);
  }

  Update_Category(data:CategoryModel, id:string):Observable<API_Response<any>>{
  return this._http.put<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_UPDATE_CATEGORY}${id}`, data);
  }

  delete_Category(id:string):Observable<API_Response<any>>{ 
     return this._http.delete<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_DELETE_CATEGORY}${id}`);
  }

  //**************************************** About APIs Integration *************************************** //
  Insert_About_Data(data:IAbout):Observable<API_Response<any>>{
    return this._http.post<API_Response<any>>(`${this.API_URL}${Whole_API_URLs.DSV_ABOUT_INSERT}`, data);
  }
  Get_About_Data():Observable<About_Api_Response>{
    return this._http.get<About_Api_Response>(`${this.API_URL}${Whole_API_URLs.DSV_GET_ABOUT_DATA}`);
  }
  Update_About_Data(data:IAbout, id:string):Observable<About_Api_Response>{
     return this._http.put<About_Api_Response>(`${this.API_URL}${Whole_API_URLs.DSV_UPDATE_ABOUT_DATA}${id}`, data);
  }
  
}
