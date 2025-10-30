import BoxDomainException from '@/modules/box/exceptions/box_domain.exception';
import BoxEntity from './box.entity';
import { BoxZone } from './box_zone_enum';

describe('BoxEntity', () => {
  const createValidProps = () => ({
    label: 'Box 001',
    latitude: -23.5505,
    longitude: -46.6333,
    freeSpace: 10,
    filledSpace: 3,
    signal: 75,
    zone: BoxZone.SAFE,
    listUser: ['user1', 'user2', 'user3'],
    routeId: null,
    note: null,
    createdByUserId: 1,
  });

  describe('validate', () => {
    it('should throw exception when label has less than 3 characters', () => {
      const props = {
        ...createValidProps(),
        label: 'AB',
        id: 'test-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: null,
        updatedByUserId: null,
      };

      expect(() => BoxEntity.validate(props)).toThrow(BoxDomainException);
      expect(() => BoxEntity.validate(props)).toThrow(
        'Label must be at least 3 characters long',
      );
    });

    it('should throw exception when filledSpace is greater than freeSpace', () => {
      const props = {
        ...createValidProps(),
        filledSpace: 15,
        freeSpace: 10,
        id: 'test-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: null,
        updatedByUserId: null,
      };

      expect(() => BoxEntity.validate(props)).toThrow(BoxDomainException);
      expect(() => BoxEntity.validate(props)).toThrow(
        'Filled space cannot be greater than free space',
      );
    });

    it('should throw exception when filledSpace is not equal to listUser length', () => {
      const props = {
        ...createValidProps(),
        filledSpace: 5,
        listUser: ['user1', 'user2', 'user3'],
        id: 'test-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: null,
        updatedByUserId: null,
      };

      expect(() => BoxEntity.validate(props)).toThrow(BoxDomainException);
      expect(() => BoxEntity.validate(props)).toThrow(
        'Filled space must be equal to the number of users in the box',
      );
    });

    it('should throw exception when filledSpace is less than listUser length', () => {
      const props = {
        ...createValidProps(),
        filledSpace: 2,
        listUser: ['user1', 'user2', 'user3'],
        id: 'test-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: null,
        updatedByUserId: null,
      };

      expect(() => BoxEntity.validate(props)).toThrow(BoxDomainException);
      expect(() => BoxEntity.validate(props)).toThrow(
        'Filled space must be equal to the number of users in the box',
      );
    });

    it('should throw exception when zone is not provided', () => {
      const props = {
        ...createValidProps(),
        zone: null as any,
        id: 'test-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: null,
        updatedByUserId: null,
      };

      expect(() => BoxEntity.validate(props)).toThrow(BoxDomainException);
      expect(() => BoxEntity.validate(props)).toThrow('Zone is required');
    });

    it('should throw exception when zone is undefined', () => {
      const props = {
        ...createValidProps(),
        zone: undefined as any,
        id: 'test-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: null,
        updatedByUserId: null,
      };

      expect(() => BoxEntity.validate(props)).toThrow(BoxDomainException);
      expect(() => BoxEntity.validate(props)).toThrow('Zone is required');
    });

    it('should not throw exception when all validations pass', () => {
      const props = {
        ...createValidProps(),
        id: 'test-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: null,
        updatedByUserId: null,
      };

      expect(() => BoxEntity.validate(props)).not.toThrow();
    });

    it('should not throw exception when filledSpace equals listUser length', () => {
      const props = {
        ...createValidProps(),
        filledSpace: 3,
        listUser: ['user1', 'user2', 'user3'],
        id: 'test-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: null,
        updatedByUserId: null,
      };

      expect(() => BoxEntity.validate(props)).not.toThrow();
    });
  });

  describe('create', () => {
    it('should create a valid box entity', () => {
      const props = createValidProps();

      const box = BoxEntity.create(props);

      expect(box).toBeInstanceOf(BoxEntity);
      expect(box.id).toBeDefined();
      expect(box.label).toBe(props.label);
      expect(box.latitude).toBe(props.latitude);
      expect(box.longitude).toBe(props.longitude);
      expect(box.freeSpace).toBe(props.freeSpace);
      expect(box.filledSpace).toBe(props.filledSpace);
      expect(box.signal).toBe(props.signal);
      expect(box.zone).toBe(props.zone);
      expect(box.listUser).toEqual(props.listUser);
      expect(box.routeId).toBeNull();
      expect(box.imageUrl).toBeNull();
      expect(box.note).toBeNull();
      expect(box.createdAt).toBeInstanceOf(Date);
      expect(box.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a box entity with provided id', () => {
      const props = createValidProps();
      const customId = 'custom-box-id';

      const box = BoxEntity.create(props, customId);

      expect(box.id).toBe(customId);
    });

    it('should create a box entity with auto-generated id when id is not provided', () => {
      const props = createValidProps();

      const box = BoxEntity.create(props);

      expect(box.id).toBeDefined();
      expect(box.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('should set imageUrl to null when creating', () => {
      const props = createValidProps();

      const box = BoxEntity.create(props);

      expect(box.imageUrl).toBeNull();
    });

    it('should set createdAt and updatedAt to current date', () => {
      const props = createValidProps();
      const beforeDate = new Date();

      const box = BoxEntity.create(props);

      const afterDate = new Date();

      expect(box.createdAt).toBeInstanceOf(Date);
      expect(box.updatedAt).toBeInstanceOf(Date);
      expect(box.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeDate.getTime(),
      );
      expect(box.createdAt.getTime()).toBeLessThanOrEqual(afterDate.getTime());
      expect(box.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeDate.getTime(),
      );
      expect(box.updatedAt.getTime()).toBeLessThanOrEqual(afterDate.getTime());
    });

    it('should set updatedByUserId to createdByUserId when creating', () => {
      const props = createValidProps();

      const box = BoxEntity.create(props);

      expect(box.createdByUserId).toBe(props.createdByUserId);
      expect(box.updatedByUserId).toBe(props.createdByUserId);
    });

    it('should throw exception when creating with invalid label', () => {
      const props = {
        ...createValidProps(),
        label: 'AB',
      };

      expect(() => BoxEntity.create(props)).toThrow(BoxDomainException);
      expect(() => BoxEntity.create(props)).toThrow(
        'Label must be at least 3 characters long',
      );
    });

    it('should throw exception when creating with filledSpace greater than freeSpace', () => {
      const props = {
        ...createValidProps(),
        filledSpace: 15,
        freeSpace: 10,
      };

      expect(() => BoxEntity.create(props)).toThrow(BoxDomainException);
      expect(() => BoxEntity.create(props)).toThrow(
        'Filled space cannot be greater than free space',
      );
    });

    it('should throw exception when creating with filledSpace not equal to listUser length', () => {
      const props = {
        ...createValidProps(),
        filledSpace: 5,
        listUser: ['user1', 'user2', 'user3'],
      };

      expect(() => BoxEntity.create(props)).toThrow(BoxDomainException);
      expect(() => BoxEntity.create(props)).toThrow(
        'Filled space must be equal to the number of users in the box',
      );
    });

    it('should throw exception when creating without zone', () => {
      const props = {
        ...createValidProps(),
        zone: null as any,
      };

      expect(() => BoxEntity.create(props)).toThrow(BoxDomainException);
      expect(() => BoxEntity.create(props)).toThrow('Zone is required');
    });

    it('should create box with different zones', () => {
      const zones = [BoxZone.SAFE, BoxZone.MODERATE, BoxZone.DANGER];

      zones.forEach(zone => {
        const props = {
          ...createValidProps(),
          zone,
        };

        const box = BoxEntity.create(props);

        expect(box.zone).toBe(zone);
      });
    });

    it('should create box with empty listUser when filledSpace is 0', () => {
      const props = {
        ...createValidProps(),
        filledSpace: 0,
        listUser: [],
      };

      const box = BoxEntity.create(props);

      expect(box.filledSpace).toBe(0);
      expect(box.listUser).toEqual([]);
    });
  });
});
