export interface DetalleUsuario {
  bio?: string;
  birthDate?: string;
  birthDtate?: string;
  email?: string;
  emailVerified?: boolean;
  foto?: string;
  gender?: string;
  lastName?: string;
  mtoken?: string;
  name?: string;
  phone?: string;
  role?: string;
  spei?: string;
  idioma?: Array<Idiomas>;
  country?: string;
}

export interface Idiomas {
  idioma: string
}
