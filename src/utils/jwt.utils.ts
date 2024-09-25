import { Config } from "../config/base.config";

const jwt = require("jsonwebtoken");

export const jwtutils = {
  verify: (token: string): Promise<any> => {
    return new Promise((res, rej) => {
      jwt.verify(
        token,
        Config.JWT_SECRET,
        { algorithm: "HS256" },
        (err: any, decoded: { [key: string]: any }) => {
          if (err) {
            console.log(err, "Error in verifying jwt");
            rej(err.name);
          }
          res(decoded);
        }
      );
    });
  },
  sign: (payload: { [key: string]: unknown }) => {
    return new Promise((res, rej) => {
      jwt.sign(
        payload,
        Config.JWT_SECRET,
        { expiresIn: Config.JWT_EXPIRES_IN, algorithm: "HS256" },
        (err: any, token: string) => {
          if (err) {
            console.log("error in signing jwt", err);
            rej(err.name);
          }
          res(token);
        }
      );
    });
  },
};