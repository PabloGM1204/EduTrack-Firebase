import { Inject, Injectable } from '@angular/core';
import { PaginatedData } from '../../../interfaces/data';
import { StrapiExtendedUser, StrapiResponse } from '../../../interfaces/strapi';
import { User } from '../../../interfaces/user';
import { MappingService } from '../mapping.service';

export class FirebaseMappingService extends MappingService{

  constructor() {
    super();
   }
  
  public queryUsersUrl():string{
    return 'extended-users?populate=picture&sort=id';
    
  }

  public getUserUrl(id:number):string{
    return `extended-users/${id}/?populate=picture&sort=id`;
  }

  public updateUserUrl(id:number):string{
    return `extended-users/${id}`;
  }

  public deleteUserUrl(id:number):string{
    return `extended-users/${id}`;
  }
  public mapUsers(data:PaginatedData<any>):PaginatedData<User>{
    const strapi_data:PaginatedData<StrapiExtendedUser> = {...data};
        return {
          data:strapi_data.data.map(user=>{
            return {
              id:user.id,
              name:user.name,
              surname:user.surname,
              nickname:user.nickname,
              picture:user.picture?.data?{
                id: user.picture.data.id,
                url_large: user.picture.data.attributes.formats.large?.url,
                url_small: user.picture.data.attributes.formats.small?.url,
                url_medium:user.picture.data.attributes.formats.medium?.url,
                url_thumbnail:user.picture.data.attributes.formats.thumbnail?.url,
              }:null
            };
          }),
          pagination:data.pagination
        };
  }
  public mapUser(data:StrapiExtendedUser):User{
    return {
      id:data.id,
      name:data.name,
      surname:data.surname,
      nickname:data.nickname,
      picture:data.picture?.data?{
        id: data.picture.data.id,
        url_large: data.picture.data.attributes.formats.large?.url,
        url_small: data.picture.data.attributes.formats.small?.url,
        url_medium:data.picture.data.attributes.formats.medium?.url,
        url_thumbnail:data.picture.data.attributes.formats.thumbnail?.url,
      }:null
    };
  }
}