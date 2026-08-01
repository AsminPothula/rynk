import { DomainEvent, IntegrationEvent, NotifyEvent } from '@events';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppError } from '@types';

@Injectable()
export class EventService {
  constructor(private _emitter: EventEmitter2) {}

  emitDomainEvent = async (
    event: DomainEvent,
    value?: any,
  ): Promise<(true | AppError)[]> => {
    return this._emitter.emitAsync(event, value);
  };

  emitIntegrationEvent = (event: IntegrationEvent, value?: any) => {
    return this._emitter.emit(event, value);
  };

  emitNotifyEvent = (event: NotifyEvent, value?: any) => {
    return this._emitter.emit(event, value);
  };
}
