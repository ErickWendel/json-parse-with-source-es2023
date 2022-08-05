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

const reviver = (key, value) => {
  if (!value) return;
  if (key === 'password') return;

  return value
}

const stringified = JSON.stringify(item, reviver)

assert.deepStrictEqual(
  stringified,
  JSON.stringify({
    name: 'Erick',
    age: 27
  }), 'should contain filtered data'
)

const jsonFiltered = JSON.parse(data, reviver)

assert.deepStrictEqual(
  jsonFiltered, 
  {
    name: 'Erick',
    age: 27
  }, 
  'should contain filtered data'
)

//// ------------- problem

const TEN_QUADRILION = BigInt(Number.MAX_SAFE_INTEGER) + 2n //BigInt(10_000_000_000_000_000) //1e16
assert.throws(
  () => JSON.stringify(TEN_QUADRILION), {
    name: 'TypeError',
    message: 'Do not know how to serialize a BigInt'
  }
)

assert.throws(
  () => JSON.parse('{"name": "erick", "salary": 10000000000000000n}'), {
    name: "SyntaxError"
  },
  "1n is not a valid string for a JSON.parse"
)

/// -------------------proposal json parse

// https://github.com/tc39/proposal-json-parse-with-source#illustrative-examples

assert.notStrictEqual(
  JSON.parse(String(TEN_QUADRILION)),
  TEN_QUADRILION,
  "the big problem is there is no output that would round-trip through JSON.parse"
)
// source will come before converting data
const intToBigInt = (key, val, /** ,source */ ) => {

  if (isNaN(val)) return val

  if (Number(val) >= Number.MAX_SAFE_INTEGER)
    return BigInt(val)

  return Number(val);
}

const myObj = {
  name: 'batman',
  salary: TEN_QUADRILION
}

// proposal will prevent that stringify crashes 
// when using complex types
//  and we handle values 
// on its reviver function
const bigIntAsIntegerString = JSON.stringify({
  ...myObj,
  salary: TEN_QUADRILION.toString()
}, (key, val, /* source*/) => val)

const integerAsBigInt = JSON.parse(
  bigIntAsIntegerString,
  intToBigInt
)

assert.deepStrictEqual(
  integerAsBigInt,
  myObj,
  'proposal makes JSON.parse handle convertions by adding "source" as a 3rd param'
)