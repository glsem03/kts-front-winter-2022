import { parse } from "qs";
import { parseCommandLine } from "typescript";
import {ApiResponse, IApiStore, RequestParams} from "./types";

export default class ApiStore implements IApiStore {
    baseUrl: string;
    constructor(url:string) {
        this.baseUrl = url;
    }

    async request<SuccessT, ErrorT = any, ReqT = {}>(params: RequestParams<ReqT>): Promise<ApiResponse<SuccessT, ErrorT>> {
        // TODO: Напишите здесь код, который с помощью fetch будет делать запрос
        const resp = await fetch(this.baseUrl + params.endpoint, {
            ...params
        })
        if(resp.ok){
            return { success:true, data: await resp.json(), status: resp.status }
        }
        else {
            return {success: false, status: resp.status, data: await resp.json()}
        }
    }
}