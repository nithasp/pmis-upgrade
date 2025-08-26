import type { IToken } from "./IToken";
import type { IUser } from "./IUser";

export interface IAuth {
    token: IToken;
    user: IUser;
}
