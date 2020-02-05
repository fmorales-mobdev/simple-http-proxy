export type RouteMethods = "all" | "get" | "post" | "put" | "delete" | "options" | "patch";

export class Route {
    method: RouteMethods;
    path: string;

    constructor(method: RouteMethods, path: string) {
        this.method = method;
        this.path = path;
    }
}