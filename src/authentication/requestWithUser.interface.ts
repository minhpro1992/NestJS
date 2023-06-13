import { Request, Express } from 'express';
import User from '../users/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
  file: Express.Multer.File;
}
export default RequestWithUser;
