export interface ExpressController {
  registerOn(app: Express.Application): Promise<void>;
}
