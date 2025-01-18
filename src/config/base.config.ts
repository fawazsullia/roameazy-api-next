export class BaseConfig {
  public PORT = process.env.PORT ? Number(process.env.PORT) : 9005;
  public JWT_SECRET = process.env.JWT_SECRET || 'very-very-secret';
  public JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ? Number(process.env.JWT_EXPIRES_IN) : 60 * 24 * 10;
  public port = process.env.PORT || 9005;
  public db = {
    uri: process.env.MONGO_URI || 'mongodb+srv://roameazyadmin:yhYsxvGTLMjUN3P1@roam-eazy-uat.ftltt.mongodb.net/roam-eazy-prod-1?ssl=true&retryWrites=true&w=majority',
  };
  public saltRounds = process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10;
  public authCookieMaxAge = process.env.AUTH_COOKIE_MAX_AGE
    ? Number(process.env.AUTH_COOKIE_MAX_AGE)
    : 7 * 24 * 60;
  public allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['localhost:3000', 'http://localhost:3000', 'localhost'];
  public STATIC_GEN_AUTH_TOKEN = process.env.STATIC_GEN_AUTH_TOKEN;
}

// mongodb+srv://roameazyadmin:yhYsxvGTLMjUN3P1@roam-eazy-uat.ftltt.mongodb.net/roam-eazy-uat?ssl=true&retryWrites=true&w=majority

export const Config = new BaseConfig();
