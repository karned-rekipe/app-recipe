/**
 * Types pour les licences
 */

export interface LicenseHistorical {
  iat: number;
  exp: number;
  user_uuid: string;
}

export interface LicenseSale {
  uuid: string;
  iat: number;
  status: 'paid' | 'unpaid' | 'pending';
}

export interface ApiRoles {
  [apiName: string]: {
    roles: string[];
  };
}

export interface AppRoles {
  [appName: string]: {
    roles: string[];
  };
}

export interface AppInfo {
  name: string;
  url: string;
}

export interface License {
  uuid: string;
  type_uuid: string;
  name: string;
  auto_renew: boolean;
  iat: number;
  exp: number;
  user_uuid: string;
  entity_uuid: string;
  historical: LicenseHistorical[];
  sales: LicenseSale[];
  api_roles: ApiRoles;
  app_roles: AppRoles;
  apps: AppInfo;
}

export interface LicenseResponse {
  status: 'success' | 'error';
  data: License[];
  message: string;
}

export interface LicenseError {
  code: string;
  message: string;
  details?: string;
}
