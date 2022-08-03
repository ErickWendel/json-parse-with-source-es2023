const assert = require('assert')

const item = {
  name: 'Erick',
  age: 27,
  state: 0,
  profession: null,
  password: 'abc',
}
const data = JSON.stringify(item);

assert.deepStrictEqual(
  JSON.parse(data),
  item,
  'should be equal'
)

const jsonFiltered = JSON.parse(data, (key, value) => {
  if (!value) return;
  if (key === 'password') return;

  return value
})

assert.deepStrictEqual(
  jsonFiltered, {
    name: 'Erick',
    age: 27
  }, 'should contain filtered data'
)


/// -------------------proposal json parse

assert.strictEqual(
  Number("9999999999999999"),
  1e16,
  "equal to 10_000_000_000_000_000"
)

assert.ok(
  Number("9999999999999999") > Number.MAX_SAFE_INTEGER,
  "10_000_000_000_000_000 > 9_007_199_254_740_991 true because its a BigInt"
)
// 10_000_000_000_000_000 > 9_007_199_254_740_991

assert.strictEqual(
  JSON.parse("9999999999999999"),
  1e16,
  "JSON.parse do the same as Number"
)

// nothing we can do here...
// JSON.parse("9999999999999999", (k, v) => {
//   console.log(k, v)
//   return v
// })

// https://github.com/tc39/proposal-json-parse-with-source#illustrative-examples

const tooBigForInt = BigInt(9999999999999999)
const source = Number("9999999999999999")

assert.notStrictEqual(
  tooBigForInt,
  source,
  "Number 10000000000000000 and BigInt 10000000000000000n are different values"
)

assert.strictEqual(
  parseInt(tooBigForInt),
  source,
  'when parseInt a BigInt works'
)

const intToBigInt = (key, val, /** ,source */ ) => {
  if (Number(val) >= Number.MAX_SAFE_INTEGER)
    return BigInt(source)

  return Number(val);
}

const roundTripped = JSON.parse(source, intToBigInt);

assert.strictEqual(
  roundTripped,
  tooBigForInt,
  'proposal makes JSON.parse handle convertions by adding "source" as a 3rd param'
)