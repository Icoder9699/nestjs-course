import { Request } from 'express';
import { UserEntity } from 'src/users/user.entity';

export interface ExpressRequestInterface extends Request {
  user?: UserEntity;
}
