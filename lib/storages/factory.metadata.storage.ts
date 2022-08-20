import { PropertyMetadata } from '../interfaces';
import { Type } from '@nestjs/common';

export class FactoryMetadataStorageHost {
  private properties = new Array<PropertyMetadata>();

  addPropertyMetadata(metadata: PropertyMetadata): void {
    this.properties.push(metadata);
  }

  getPropertyMetadatasByTarget(target: Type<unknown>): PropertyMetadata[] {
    let targets: Type<unknown>[] = []
    do {
      targets.push(target)
    } while (target = Object.getPrototypeOf(target))
    return this.properties.filter(property => targets.includes(<any>property.target));
  }
}

const globalRef = global as any;
export const FactoryMetadataStorage: FactoryMetadataStorageHost =
  globalRef.FactoryMetadataStorage ||
  (globalRef.FactoryMetadataStorage = new FactoryMetadataStorageHost());
