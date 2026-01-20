import Address from "../models/Address";
import type { IAddress } from "../types/address.js";
import { Transaction } from "sequelize";

export default class AddressRepository {
  private AddressModel: typeof Address;

  constructor(addressModel: typeof Address) {
    this.AddressModel = addressModel;
  }

  async createAddress(
    addressData: Omit<IAddress, "id" | "createdAt" | "updatedAt">,
    transaction?: Transaction,
  ): Promise<IAddress> {
    const address = await this.AddressModel.create(addressData, {
      transaction,
    });
    return address.toJSON() as IAddress;
  }
}
