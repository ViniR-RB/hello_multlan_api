import RouteDomainException from '@/core/erros/route.domain.exception';
import BoxEntity from '@/modules/box/domain/box.entity';

interface RouteProps {
  boxes?: BoxEntity[];
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class RouteEntity {
  constructor(
    private readonly props: RouteProps,
    private readonly id: string = crypto.randomUUID(),
  ) {
    this.props.boxes = props.boxes ?? [];
    this.props.name = props.name;
    this.props.createdAt = props.createdAt ?? new Date();
    this.props.updatedAt = props.updatedAt ?? new Date();
  }

  get routeId() {
    return this.id;
  }
  get boxes() {
    return [...this.props.boxes];
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get routeName() {
    return this.props.name;
  }

  addBox(box: BoxEntity) {
    if (box.routeId && box.routeId !== this.id) {
      throw new RouteDomainException('Caixa já está associada a outra rota.');
    }

    box.assignToRoute(this.id);
    this.props.boxes.push(box);
    this.touch();
  }

  removeBox(boxId: string) {
    const box = this.props.boxes.find(b => b.boxId === boxId);
    if (!box) {
      throw new RouteDomainException('Caixa não encontrada na rota.');
    }
    box.removeFromRoute();
    this.props.boxes = this.props.boxes.filter(b => b.boxId !== boxId);
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  toObject() {
    return {
      id: this.routeId,
      ...this.props,
      boxes: this.props.boxes.map(box => box.boxId),
    };
  }
}
