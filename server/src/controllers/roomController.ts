import type { Request, Response } from 'express';
import * as roomService from '../services/roomService.ts';
import { parseNumericParam } from './validation.ts';

export function list(_req: Request, res: Response): void {
  res.json(roomService.listRooms());
}

export function show(req: Request, res: Response): void {
  const id = parseNumericParam(req.params.id, 'id');
  res.json(roomService.getRoom(id));
}
