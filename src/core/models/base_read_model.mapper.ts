export default abstract class BaseReadModelMapper<M, R> {
  abstract toReadModel(model: M): R;
}
