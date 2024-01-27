import { Injectable } from "@angular/core";
import { PaginatedData } from "../../interfaces/data";
import { User } from "../../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export abstract class MappingService {

  public abstract queryUsersUrl():string;

  public abstract getUserUrl(id:number):string;

  public abstract updateUserUrl(id:number):string;

  public abstract deleteUserUrl(id:number):string;
  
  public abstract mapUsers(data:PaginatedData<any>):PaginatedData<User>;

  public abstract mapUser(data:any):User;
  
}