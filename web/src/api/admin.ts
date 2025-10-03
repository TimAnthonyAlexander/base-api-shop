import { http, type HttpOptions } from '../http';
import { type ThemeName } from '../themes';

export interface GetAdminThemeResponse {
  success: boolean;
  data: {
    theme: ThemeName;
  };
}

export interface PostAdminThemeResponse {
  success: boolean;
  data: {
    theme: ThemeName;
  };
  message: string;
}

export interface PostAdminThemeBody {
  theme: ThemeName;
}

export async function getAdminTheme(options?: HttpOptions): Promise<GetAdminThemeResponse> {
  return http.get<GetAdminThemeResponse>('/admin/theme', options);
}

export async function postAdminTheme(
  body: PostAdminThemeBody,
  options?: HttpOptions
): Promise<PostAdminThemeResponse> {
  return http.post<PostAdminThemeResponse>('/admin/theme', body, options);
}

