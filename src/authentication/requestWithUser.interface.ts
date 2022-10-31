import { Request } from 'express';
import User from '../users/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
  file: Record<string, string | number | Buffer>;
}
export default RequestWithUser;
