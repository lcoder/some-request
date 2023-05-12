/**
 * 用于创建Error对象的子类
 * https://github.com/Microsoft/TypeScript/issues/12123
 */
export function createErrorClass<T>(createImpl: (_super: any) => any): T {
  const _super = (instance: any) => {
    Error.call(instance);
    instance.stack = new Error().stack;
  };

  const ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}
