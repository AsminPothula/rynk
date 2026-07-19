import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class HttpService {
  constructor(private readonly httpService: AxiosHttpService) {}

  private createHeaders(
    headers?: Record<string, string>,
  ): Record<string, string> {
    const defaultHeaders = {
      Accept: 'application/json',
    };

    return { ...defaultHeaders, ...headers };
  }

  async get<T>(
    url: string,
    customHeaders?: Record<string, string>,
    config?: any,
  ): Promise<AxiosResponse<T>> {
    const headers = this.createHeaders(customHeaders);
    const observable = this.httpService.get<T>(url, {
      ...config,
      headers,
    }) as Observable<AxiosResponse<any>>;
    return firstValueFrom(observable);
  }

  async post<T>(
    url: string,
    data: any,
    customHeaders?: Record<string, string>,
    config?: any,
  ): Promise<AxiosResponse<T>> {
    const headers = this.createHeaders(customHeaders);
    const observable = this.httpService.post<T>(url, data, {
      ...config,
      headers,
    }) as Observable<AxiosResponse<any>>;
    return firstValueFrom(observable);
  }

  async put(
    url: string,
    data: any,
    customHeaders?: Record<string, string>,
    config?: any,
  ): Promise<AxiosResponse> {
    const headers = this.createHeaders(customHeaders);
    const observable = this.httpService.put(url, data, {
      ...config,
      headers,
    }) as Observable<AxiosResponse<any>>;
    return firstValueFrom(observable);
  }

  async patch(
    url: string,
    data: any,
    customHeaders?: Record<string, string>,
    config?: any,
  ): Promise<AxiosResponse> {
    const headers = this.createHeaders(customHeaders);
    const observable = this.httpService.patch(url, data, {
      ...config,
      headers,
    }) as Observable<AxiosResponse<any>>;
    return firstValueFrom(observable);
  }
}
