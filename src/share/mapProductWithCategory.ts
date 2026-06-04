export function mapProductCategoryName(products:any[], categories:any[]){ 
    return products.map(product=>{
        const category = categories.find(x=>x.id === product.productCategoryId);
        return { 
            ...product,
            categoryName: category ? category.name : 'Unknown'
        }
    }); 
}