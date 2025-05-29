import deepmerge from '../';

interface XObject {
	foo: string;
	bar: string;
	wat: number;
}

interface YObject {
	foo: string;
	bar: string;
	wat: number;
}

interface ZObject {
	baz: string;
	quux: string;
	wat: number;
}

const x: XObject = {
	foo: 'abc',
	bar: 'def',
	wat: 42,
};

const y: YObject = {
	foo: 'cba',
	bar: 'fed',
	wat: 42,
};

const z: ZObject = {
	baz: '123',
	quux: '456',
	wat: 42,
};

let merged1: XObject & YObject = deepmerge(x, y);
let merged2: XObject & ZObject = deepmerge(x, z);
let merged3: {wat: number} = deepmerge.all([x, y, z]);

merged1.foo;
merged1.bar;
merged2.foo;
merged2.baz;
merged3.wat;

// Using DeepMergeOptions interface from your implementation
interface DeepMergeOptions {
	clone?: boolean;
	isMergeableObject?: (value: any) => boolean;
	arrayMerge?: (target: any[], source: any[], options: DeepMergeOptions) => any[];
	customMerge?: (key: PropertyKey) => ((target: any, source: any, options: DeepMergeOptions) => any) | undefined;
	cloneUnlessOtherwiseSpecified?: (value: any, options: DeepMergeOptions) => any;
}

const options1: DeepMergeOptions = {
	clone: true,
	isMergeableObject(value: any): boolean {
		return false;
	},
};

const options2: DeepMergeOptions = {
	arrayMerge(target: any[], source: any[], options: DeepMergeOptions): any[] {
		target.length;
		source.length;
		options.isMergeableObject?.(target);
		return [];
	},
	clone: true,
	isMergeableObject(value: any): boolean {
		return false;
	},
};

const options3: DeepMergeOptions = {
    customMerge: (key: PropertyKey) => {
        if (key === 'foo') {
          return (target: any, source: any, options: DeepMergeOptions): any => target + source;
        }
    }
};

merged1 = deepmerge(x, y, options1);
merged2 = deepmerge(x, z, options2);
merged3 = deepmerge.all([x, y, z], options1);
const merged4 = deepmerge(x, y, options3);