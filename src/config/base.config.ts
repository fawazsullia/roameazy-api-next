export class BaseConfig {
  public PORT = process.env.PORT ? Number(process.env.PORT) : 9005;
  public JWT_SECRET = process.env.JWT_SECRET || 'very-very-secret';
  public JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ? Number(process.env.JWT_EXPIRES_IN) : 60 * 24 * 10;
}

export const Config = new BaseConfig();
