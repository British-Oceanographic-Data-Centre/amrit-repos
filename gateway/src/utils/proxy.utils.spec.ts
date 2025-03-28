import { HttpService } from '@nestjs/axios';
import { buildAxiosRequestConfigFromSourceRequest, cleanProxyHeaders, proxyHttpRequest } from './proxy.utils';
import { Request} from 'express';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';

describe('cleanProxyHeaders', () => {
  it('should remove excluded headers', () => {
    const headers = {
      'host': 'example.com',
      'content-length': '123',
      'x-custom': 'value',
      'user-agent': 'test', 
      'connection': 'keep-alive',
      'accept-encoding':'gzip',
      'postman-token':'123'      
    };

    const result = cleanProxyHeaders(headers);

    expect(result).toEqual({ 'x-custom': 'value' });
  });
});

describe('buildAxiosRequestConfigFromSourceRequest', () => {
    it('should build a valid AxiosRequestConfig from an incoming request', () => {
      const mockReq = {
        method: 'POST',
        url: '/api/alerta/alerts?status=open',
        query: { status: 'open' },
        headers: {
          'content-length':'123',
          'content-type': 'application/json',
          'x-custom-header': 'value',
        },
        body: { key: 'value' },
      } as unknown as Request;
  
      const result = buildAxiosRequestConfigFromSourceRequest(mockReq, 'amrit-alerta.example.com', 'api/alerta');
  
      expect(result).toEqual({
        method: 'post',
        url: 'https://amrit-alerta.example.com/api/alerts?status=open',
        headers: {
          'content-type': 'application/json',
          'x-custom-header': 'value',
          'host': 'amrit-alerta.example.com',
        },
        params: { status: 'open' },
        data: { key: 'value' },
      });
    });
  });

describe('proxyHttpRequest', () => {
let httpService: HttpService;

beforeEach(() => {
    // @ts-expect-error - partial mock
    httpService = {
    request: jest.fn(),
    };
});

it('should return data from the response', async () => {

    //ARRANGE
    const mockResponse: Partial<AxiosResponse> = {
    data: { success: true },
    };  
    
    const requestSpy = jest.spyOn(httpService, 'request');
    requestSpy.mockReturnValue(of(mockResponse as AxiosResponse));;   
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://example.com/test',
    };

        //ACT
    const result = await proxyHttpRequest(httpService, config);

    // ASSERT
    expect(result).toEqual({ success: true });
    expect(requestSpy).toHaveBeenCalledWith(config);
});

it('should throw HttpException on error', async () => {
    // ARRANGE
    const errorResponse = {
        response: {
        status: 404,
        data: { message: 'Not Found' },
        },
    };
    
    jest.spyOn(httpService, 'request').mockReturnValue(throwError(() => errorResponse));
    
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://example.com/test',
    };

    // ACT & ASSERT
    await expect(proxyHttpRequest(httpService, config)).rejects.toThrow(HttpException);
});
});