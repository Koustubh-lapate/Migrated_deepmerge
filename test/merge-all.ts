import merge from '..'
import test from 'tape'

test('throw error if first argument is not an array', t => {
  t.throws(() => merge.all({ example: true } as any, { another: '2' } as any), Error)
  t.end()
})

test('return an empty object if first argument is an array with no elements', t => {
  t.deepEqual(merge.all([]), {})
  t.end()
})

test('Work just fine if first argument is an array with least than two elements', t => {
  const actual = merge.all([{ example: true }])
  const expected = { example: true }
  t.deepEqual(actual, expected)
  t.end()
})

test('execute correctly if options object were not passed', t => {
  const arrayToMerge = [{ example: true }, { another: '123' }]
  t.doesNotThrow(() => merge.all(arrayToMerge))
  t.end()
})

test('execute correctly if options object were passed', t => {
  const arrayToMerge = [{ example: true }, { another: '123' }]
  t.doesNotThrow(() => merge.all(arrayToMerge, { clone: true }))
  t.end()
})

test('invoke merge on every item in array should result with all props', t => {
  const firstObject = { first: true }
  const secondObject = { second: false }
  const thirdObject = { third: 123 }
  const fourthObject = { fourth: 'some string' }

  const mergedObject = merge.all([firstObject, secondObject, thirdObject, fourthObject])

  t.ok(mergedObject.first === true)
  t.ok(mergedObject.second === false)
  t.ok(mergedObject.third === 123)
  t.ok(mergedObject.fourth === 'some string')
  t.end()
})

test('invoke merge on every item in array with clone should clone all elements', t => {
  const firstObject = { a: { d: 123 } }
  const secondObject = { b: { e: true } }
  const thirdObject = { c: { f: 'string' } }

  const mergedWithClone = merge.all([firstObject, secondObject, thirdObject], { clone: true })

  t.notEqual(mergedWithClone.a, firstObject.a)
  t.notEqual(mergedWithClone.b, secondObject.b)
  t.notEqual(mergedWithClone.c, thirdObject.c)
  t.end()
})

test('invoke merge on every item in array clone=false should not clone all elements', t => {
  const firstObject = { a: { d: 123 } }
  const secondObject = { b: { e: true } }
  const thirdObject = { c: { f: 'string' } }

  const mergedWithoutClone = merge.all([firstObject, secondObject, thirdObject], { clone: false })

  t.equal(mergedWithoutClone.a, firstObject.a)
  t.equal(mergedWithoutClone.b, secondObject.b)
  t.equal(mergedWithoutClone.c, thirdObject.c)
  t.end()
})

test('invoke merge on every item in array without clone should clone all elements', t => {
  const firstObject = { a: { d: 123 } }
  const secondObject = { b: { e: true } }
  const thirdObject = { c: { f: 'string' } }

  const mergedWithoutClone = merge.all([firstObject, secondObject, thirdObject])

  t.notEqual(mergedWithoutClone.a, firstObject.a)
  t.notEqual(mergedWithoutClone.b, secondObject.b)
  t.notEqual(mergedWithoutClone.c, thirdObject.c)
  t.end()
})
