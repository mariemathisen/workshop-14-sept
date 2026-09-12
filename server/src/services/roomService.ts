import { NotFoundError } from '../errors.ts';
import * as roomRepository from '../repositories/roomRepository.ts';
import type { Room } from '../types.ts';

export function listRooms(): Room[] {
  return roomRepository.findAll();
}

export function getRoom(id: number): Room {
  const room = roomRepository.findById(id);
  if (!room) {
    throw new NotFoundError(`Room ${id} does not exist`);
  }
  return room;
}
