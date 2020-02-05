// tslint:disable: no-any
import { Route, RouteMethods } from "./route";

export class Mock extends Route {
    responseBody: any;

    constructor(method: RouteMethods, path: string, responseBody: any) {
        super(method, path);
        this.responseBody = responseBody;
    }
}