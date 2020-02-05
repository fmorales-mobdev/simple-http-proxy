import { Route, RouteMethods } from "./route";

export class Proxy extends Route {
    target: string;

    constructor(method: RouteMethods, path: string, target: string) {
        super(method, path);
        this.target = target;
    }
}