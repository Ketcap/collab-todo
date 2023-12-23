export const minimumLength = (length: number, fieldName: string) => {
  const [firstLetter, ...rest] = fieldName;
  const fullFieldName = `${firstLetter.toUpperCase()}${rest.join("")}`;
  return `${fullFieldName} should have atleast ${length} character`;
};
