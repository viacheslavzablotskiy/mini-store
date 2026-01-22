import { User } from "src/generated/prisma/client"
declare global {
    namespace Express {
        export interface Request extends TokenTypeData {}
    }
}


export type TokenTypeData = Pick<User, 'id' | 'role' | 'email' | 'login'>