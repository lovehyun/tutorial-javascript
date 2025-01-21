import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from './userController';

const router = Router();

// 사용자 목록 조회
router.get('/', (req: Request, res: Response) => {
    const users = UserController.listUsers();
    res.json(users);
});

// 사용자 추가
router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            throw new Error('Name and email are required.');
        }
        const newUser = UserController.addUser(name, email);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

// 사용자 삭제
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        UserController.deleteUser(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// 모든 사용자 삭제
router.delete("/", (req: Request, res: Response) => {
    UserController.clearUsers();
    res.status(204).send();
});

export default router;
