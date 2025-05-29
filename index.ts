import defaultIsMergeableObject from 'is-mergeable-object';

interface DeepMergeOptions {
  clone?: boolean;
  isMergeableObject?: (value: any) => boolean;
  arrayMerge?: (target: any[], source: any[], options: DeepMergeOptions) => any[];
  customMerge?: (key: PropertyKey) => ((target: any, source: any, options: DeepMergeOptions) => any) | undefined;
  cloneUnlessOtherwiseSpecified?: (value: any, options: DeepMergeOptions) => any;
}

function emptyTarget(val: any): any {
  return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value: any, options: DeepMergeOptions): any {
  return (options.clone !== false && options.isMergeableObject?.(value))
    ? deepmerge(emptyTarget(value), value, options)
    : value;
}

function defaultArrayMerge(target: any[], source: any[], options: DeepMergeOptions): any[] {
  return target.concat(source).map((element) => cloneUnlessOtherwiseSpecified(element, options));
}

function getMergeFunction(key: PropertyKey, options: DeepMergeOptions): (target: any, source: any, options: DeepMergeOptions) => any {
  if (!options.customMerge) {
    return deepmerge;
  }
  const customMerge = options.customMerge(key);
  return typeof customMerge === 'function' ? customMerge : deepmerge;
}

function getEnumerableOwnPropertySymbols(target: object): PropertyKey[] {
  if (Object.getOwnPropertySymbols) {
    return Object.getOwnPropertySymbols(target).filter(symbol =>
      Object.prototype.propertyIsEnumerable.call(target, symbol)
    );
  }
  return [];
}

function getKeys(target: object): PropertyKey[] {
  return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target) as any);
}

function propertyIsOnObject(object: object, property: PropertyKey): boolean {
  try {
    return property in object;
  } catch {
    return false;
  }
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target: object, key: PropertyKey): boolean {
  return propertyIsOnObject(target, key) &&
    (Object.prototype.hasOwnProperty.call(target, key) &&
     !Object.prototype.propertyIsEnumerable.call(target, key));
}

function mergeObject(target: object, source: object, options: DeepMergeOptions): any {
  const destination: any = {};
  if (options.isMergeableObject?.(target)) {
    getKeys(target).forEach((key) => {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key as keyof typeof target], options);
    });
  }
  getKeys(source).forEach((key) => {
    if (propertyIsUnsafe(target, key)) {
      return;
    }

    if (
      propertyIsOnObject(target, key) &&
      options.isMergeableObject?.(source[key as keyof typeof source])
    ) {
      destination[key] = getMergeFunction(key, options)(
        target[key as keyof typeof target],
        source[key as keyof typeof source],
        options
      );
    } else {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key as keyof typeof source], options);
    }
  });
  return destination;
}

function deepmerge(target: any, source: any, options?: DeepMergeOptions): any {
  options = options || {};
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || defaultIsMergeableObject;
  options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  } else if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  } else {
    return mergeObject(target, source, options);
  }
}

deepmerge.all = function deepmergeAll(array: any[], options?: DeepMergeOptions): any {
  if (!Array.isArray(array)) {
    throw new Error('first argument should be an array');
  }

  return array.reduce((prev, next) => deepmerge(prev, next, options), {});
};

export default deepmerge;
