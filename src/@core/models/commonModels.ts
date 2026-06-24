export type Guid = string;

export interface BaseModel {
  Id: Guid,
}
export interface ProductCategoryModel extends BaseModel {
  Title: string,
  Slug: string
}

export interface MessageDialogData {

  title: string,

  message: string,

  type?: 'error' | 'success' | 'warning' | 'info',

  buttonText?: string,

  buttonColor?: 'primary' | 'accent' | 'warn',

  flag?:boolean;
}

export interface API_Response<T> {
   success:boolean,
   message:string,
   data:T;
}

export interface About_Api_Response{
   success:boolean,
   message:string,
   data:any;
}

export interface ProductModel {
    Name:string,
    Slug:string,
    Description:string,
    ImageUrl:string,
    ProductCategoryId:string,
    CategoryName?:string
}

export interface ProductCateogriesModel {
   id:string,
   name:string,
   slug:string,
   products?:[],
   status:boolean,
   createdDateTimeStamp:string,
   modifiedDateTimeStamp:string
}

export interface CategoryModel{
   Name:string,
   Slug:string
}

export interface IProduct {
   id:string,
   name:string,
   categoryName:string,
   description:string,
   imageUrl:string,
   slug:string,
   status:boolean,
   modifiedDateTimeStamp:string,
   createdDateTimeStamp:string,
   productCategoryId:string
}

export interface IAbout {
    name:string,
    description:string,
    imageUrl:string,
    certificateImageUrl:string
}

export interface IApplicationRequest {
    applicationName:string,
    slug:string,
    isActive:Boolean
}

export interface IApplicationProductReq {
    Title:string,
    Slug:string,
    Category:string
}
