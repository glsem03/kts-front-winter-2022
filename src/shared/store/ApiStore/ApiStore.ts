import qs from "qs";
import { parseCommandLine } from "typescript";
import {ApiResponse, HTTPMethod, IApiStore, RequestParams, StatusHTTP} from "./types";

export default class ApiStore implements IApiStore {
    baseUrl: string;
    constructor(url:string) {
        this.baseUrl = url;
    }

    private getReqData<ReqT> (params: RequestParams<ReqT>): [string, RequestInit] {
        let endpoint = `${this.baseUrl}${params.endpoint}`;
        const req:RequestInit = {};
        if(params.method === HTTPMethod.GET)
            endpoint = `${this.baseUrl}?${qs.stringify(params.data)}`;
        
        if(params.method === HTTPMethod.POST) {
            req.body = JSON.stringify(params.data);
            req.headers = { ...params.headers, 'Content-Type': 'trxt/plain;charset=UTF-8' };
        }
        return [endpoint, req];
    }

    async request<SuccessT, ErrorT = any, ReqT = {}>(params: RequestParams<ReqT>): Promise<ApiResponse<SuccessT, ErrorT>> {
        try {
            const resp = await fetch(...this.getReqData(params));
            if(resp.ok){
                return { success:true, data: await resp.json(), status: resp.status }
            }
            else {
                return {success: false, status: resp.status, data: await resp.json()}
            }
        }
        catch(e) {
            return {success: false, status: StatusHTTP.ERROR, data: await e}
        }
        
    }
}