import BoxDomainException from '../../../core/erros/box.domain.exception';
import BoxEntity from './box.entity';

describe('test in constructor box entity', () => {
  it('create box entity without id', () => {
    const boxPropsConstant = {
      latitude: -23.55052,
      longitude: -46.633308,
      createdAt: new Date(),
      updatedAt: new Date(),
      freeSpace: 7,
      filledSpace: 7,
      listUser: [],
      image: 'image',
    };
    const boxEntity = new BoxEntity(boxPropsConstant);

    expect(boxEntity).toBeDefined();
    expect(boxEntity).toBeInstanceOf(BoxEntity);
    expect(boxEntity.boxId).toBeDefined();
  });
  it('create box entity with id and without created and updated', () => {
    const id = '123';
    const props = {
      latitude: -23.55052,
      longitude: -46.633308,
      freeSpace: 7,
      filledSpace: 7,
      listUser: [],
      image: 'image',
    };
    const boxEntity = new BoxEntity(props, id);

    expect(boxEntity).toBeDefined();
    expect(boxEntity).toBeInstanceOf(BoxEntity);
    expect(boxEntity.createdAt).toBeDefined();
    expect(boxEntity.updatedAt).toBeDefined();
  });
  it('should return an error if the number of free space is less than the number of users', () => {
    const id = '123';
    const latitude = -23.55052;
    const longitude = -46.633308;
    const createdAt = new Date();
    const updatedAt = new Date();
    const freeSpace = 7;
    const filledSpace = 7;
    const image = 'image';
    const listUser = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const boxPropsConstant = {
      latitude,
      longitude,
      createdAt,
      filledSpace,
      freeSpace,
      updatedAt,
      listUser,
      image,
    };
    expect(() => new BoxEntity(boxPropsConstant, id)).toThrow(
      new BoxDomainException(
        'Free space must be graeter than list user length',
      ),
    );
  });
  it("create box entity and filled space can't be greater than free space", () => {
    const id = '123';
    const latitude = -23.55052;
    const longitude = -46.633308;
    const createdAt = new Date();
    const updatedAt = new Date();
    const freeSpace = 7;
    const filledSpace = 8;
    const listUser = [];
    const image = 'image';
    const boxPropsConstant = {
      latitude,
      longitude,
      createdAt,
      filledSpace,
      freeSpace,
      updatedAt,
      listUser,
      image,
    };

    expect(() => {
      new BoxEntity(boxPropsConstant, id);
    }).toThrow(BoxDomainException);
  });
  it('create box entity with id created and updated', () => {
    const id = '123';
    const latitude = -23.55052;
    const longitude = -46.633308;
    const createdAt = new Date();
    const updatedAt = new Date();
    const freeSpace = 7;
    const filledSpace = 7;
    const listUser = [];
    const image = 'image';
    const boxPropsConstant = {
      latitude,
      longitude,
      createdAt,
      filledSpace,
      freeSpace,
      updatedAt,
      listUser: listUser,
      image,
    };
    const boxEntity = new BoxEntity(boxPropsConstant, id);
    expect(boxEntity).toBeDefined();
    expect(boxEntity).toBeInstanceOf(BoxEntity);
    expect(boxEntity.createdAt).toEqual(createdAt);
    expect(boxEntity.updatedAt).toEqual(updatedAt);
    expect(boxEntity.latitude).toEqual(latitude);
    expect(boxEntity.longitude).toEqual(longitude);
  });
});
