/**
 * Returns nested keys of T. These keys are combined with `'.'`
 *
 * @param Type extends object
 *
 * @example
 * type Post = {
 *   id: number;
 *   user: {
 *     id: number;
 *     name: string;
 *   };
 * };
 *
 *
 * NestedKeyOf<Post> => [ "id", "user.id", "user.name" ]
 * */
export type NestedKeyOf<
  Type,
  Key extends keyof Type = keyof Type,
> = Key extends string | number // Check if Key is a string or a number.
  ? Type[Key] extends Record<string | number, unknown> // Check if the value at Key is an object.
    ? `${Key}` | `${Key}.${NestedKeyOf<Type[Key]>}` // Return Key and recursively find nested keys for objects.
    : `${Key}` // Return Key as is if not an object (no further nesting).
  : never; // Stop for non-string/non-number keys.

/**
 * Return type of particular NestedKeyOf<T>
 *
 * @param Type extends object
 * @param NestedKey extends NestedKeyOf<T>
 *
 * @example
 * type Post = {
 *   id: number;
 *   user: {
 *     id: number;
 *     name: string;
 *   };
 * };
 *
 *
 * NestedKeyOf<Post, "user.id"> => number
 * */
export type NestedValueOf<
  Type,
  NestedKey extends NestedKeyOf<Type>,
> = NestedKey extends keyof Type // They key is a direct key of the object and not further nested
  ? Type[NestedKey] // Direct key access
  : NestedKey extends `${infer Key}.${infer RestOfNestedKey}` // Split the key at the .
    ? Key extends keyof Type // Check if NestedKey is a direct key of T (first part of NestedKey)
      ? RestOfNestedKey extends NestedKeyOf<Type[Key]> // Check if RestOfNestedKey is a valid nested key of the nested Type
        ? NestedValueOf<Type[Key], RestOfNestedKey> // Recursive resolution for nested keys
        : never // RestOfNestedKey is not a valid nested key
      : never // Key is not a valid key of Type
    : never; // NestedKey is not valid
