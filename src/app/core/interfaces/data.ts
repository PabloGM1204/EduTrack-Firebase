export interface Pagination{
    page:number,
    pageSize:number,
    pageCount:number,
    total:number
}
export interface PaginatedData<T>{
    data:T[],
    pagination:Pagination
}