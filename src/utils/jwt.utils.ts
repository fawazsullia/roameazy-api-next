import baseConfig from "src/configs/base.config";

const jwt = require('jsonwebtoken');

export const jwtutils = {
    verify: (token: string): Promise<any> => {
        return new Promise((res, rej) => {
            jwt.verify(
                token,
                baseConfig().JWT_SECRET,
                { algorithm: 'HS256' },
                (err: any, decoded: { [key: string]: any }) => {
                    if (err) {
                        console.log(err, 'Error in verifying jwt');
                        rej(err.name);
                    }
                    res(decoded);
                },
            );
        });
    },
    sign: (payload: { [key: string]: unknown }, expiresIn?: number) => {
        return new Promise((res, rej) => {
            jwt.sign(
                payload,
                baseConfig().JWT_SECRET,
                { expiresIn: expiresIn ? expiresIn : baseConfig().JWT_EXPIRES_IN, algorithm: 'HS256' },
                (err: any, token: string) => {
                    if (err) {
                        console.log('error in signing jwt', err);
                        rej(err.name);
                    }
                    res(token);
                },
            );
        });
    },
};
