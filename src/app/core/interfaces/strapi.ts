// Datos del usuario en el log
export interface StrapiUser{
    id: number,
    username: string,
    email: string
}

// Datos del usuario para que el strapi confirme en el login
export interface StrapiLoginPayload{
    identifier: string,
    password: string
}

// Datos del usuario para que el strapi confirme en el register
export interface StrapiRegisterPayLoad{
    email: string,
    password: string,
    username: string
}

// Respuesta del login
export interface StrapiLoginResponse{
    jwt: string,
    user: StrapiUser
}

// Respuesta del register
export interface StrapiRegisterResponse{
    jwt: string,
    user: StrapiUser
}

// Datos para la tabla de ExtendedUser
export interface StrapiExtendedUser{
    id?:number,
    name:string,
    surname:string,
    user_id:number,
    nickname?:string,
    picture?:{
        data:StrapiData<StrapiMedia>
    }
}

export type StrapiUploadResponse = StrapiMedia[]

export interface StrapiMedia {
  id: number
  name: string
  alternativeText: any
  caption: any
  width: number
  height: number
  formats: Formats
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: any
  provider: string
  provider_metadata: ProviderMetadata
  createdAt: string
  updatedAt: string
}

export interface StrapiData<T>{
    id:number,
    attributes:T
}


export interface StrapiArrayResponse<T> {
    data: StrapiData<T>[],
    meta: {
      pagination?: {
        page: number,
        pageSize: number,
        pageCount: number,
        total: number,
      }
    }
}

export interface StrapiResponse<T> {
    data: StrapiData<T>
}

export interface Formats {
    large: Large
    small: Small
    medium: Medium
    thumbnail: Thumbnail
}

export interface Small {
    ext: string
    url: string
    hash: string
    mime: string
    name: string
    path: any
    size: number
    width: number
    height: number
    provider_metadata: ProviderMetadata
}
    
export interface Medium {
    ext: string
    url: string
    hash: string
    mime: string
    name: string
    path: any
    size: number
    width: number
    height: number
    provider_metadata: ProviderMetadata
}

export interface Large {
    ext: string
    url: string
    hash: string
    mime: string
    name: string
    path: any
    size: number
    width: number
    height: number
    provider_metadata: ProviderMetadata
}  
  
export interface Thumbnail {
    ext: string
    url: string
    hash: string
    mime: string
    name: string
    path: any
    size: number
    width: number
    height: number
    provider_metadata: ProviderMetadata
}
  
export interface ProviderMetadata {
    public_id: string
    resource_type: string
}