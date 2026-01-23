import { User } from "src/generated/prisma/client"

export type TokenTypeData = Pick<User, 'id' | 'role' | 'email' | 'login'>

declare module 'express'{
    interface Request {
        user?: TokenTypeData
    }
}
