import { Injectable } from '@nestjs/common';
import { ClientRepository } from '@shared';
import { Client, FindClientSpecs } from './client.types';

@Injectable()
export class ClientService {
  constructor(private _clientRepo: ClientRepository) {}

  async save(client: Client) {
    return this._clientRepo.save(client);
  }

  async find(spec: FindClientSpecs) {
    return this._clientRepo.findOne(spec);
  }

  async findMany(spec: FindClientSpecs) {
    return this._clientRepo.findMany(spec);
  }

  async findById(id: string) {
    return this.find(new FindClientSpecs().setId(id));
  }

  async findByDomain(domain: string) {
    return this.find(new FindClientSpecs().setDomain(domain));
  }

  async listForOwner(ownerId: string) {
    return this.findMany(new FindClientSpecs().setOwnerId(ownerId));
  }

  /** Every client — rynk-admin view (no ownership filter). */
  async listAll() {
    return this.findMany(new FindClientSpecs());
  }
}
