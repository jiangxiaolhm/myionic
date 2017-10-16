
import { User } from '../src/models/user';


export class AuthMock  {
    login(user: User): Promise<any> {
        return Promise.resolve()
    };

    register(user: User): Promise<any> {
        return Promise.resolve()
    };

    logout(): Promise<any> {
        return Promise.resolve()
    };
}