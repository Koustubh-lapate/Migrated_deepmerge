import merge, { DeepMergeOptions } from '../'
import test from 'tape'

test('custom merge array', function (t) {
	let mergeFunctionCalled = false

	function overwriteMerge<T>(target: T[], source: T[], options: DeepMergeOptions): T[] {
		mergeFunctionCalled = true
		t.equal(options.arrayMerge, overwriteMerge)
		return source
	}

	const destination = {
		someArray: [1, 2],
		someObject: { what: 'yes' },
	}
	const source = {
		someArray: [1, 2, 3],
	}

	const actual = merge(destination, source, { arrayMerge: overwriteMerge })
	const expected = {
		someArray: [1, 2, 3],
		someObject: { what: 'yes' },
	}

	t.ok(mergeFunctionCalled)
	t.deepEqual(actual, expected)
	t.end()
})

test('merge top-level arrays', function (t) {
	function overwriteMerge<T>(a: T[], b: T[]): T[] {
		return b
	}

	const actual = merge([1, 2], [1, 2], { arrayMerge: overwriteMerge })
	const expected = [1, 2]

	t.deepEqual(actual, expected)
	t.end()
})

test('cloner function is available for merge functions to use', function (t) {
	let customMergeWasCalled = false

	function cloneMerge<T>(target: T[], source: T[], options: DeepMergeOptions): T[] {
		customMergeWasCalled = true
		t.ok(options.cloneUnlessOtherwiseSpecified)
		return target.concat(source).map(element =>
			options.cloneUnlessOtherwiseSpecified!(element, options)
		)
	}

	const src = {
		key1: ['one', 'three'],
		key2: ['four'],
	}
	const target = {
		key1: ['one', 'two'],
	}

	const expected = {
		key1: ['one', 'two', 'one', 'three'],
		key2: ['four'],
	}

	t.deepEqual(merge(target, src, { arrayMerge: cloneMerge }), expected)
	t.ok(customMergeWasCalled)
	t.ok(Array.isArray(merge(target, src).key1))
	t.ok(Array.isArray(merge(target, src).key2))
	t.end()
})
