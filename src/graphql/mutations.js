/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const hit = /* GraphQL */ `
  mutation Hit(
    $input: CreateCounterInput!
    $condition: ModelCounterConditionInput
  ) {
    hit(input: $input, condition: $condition) {
      id
      hits
      createdAt
      updatedAt
    }
  }
`;
