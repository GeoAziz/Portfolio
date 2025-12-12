/**
 * TypeScript declarations for JSON module imports
 * Allows importing JSON files as ES modules with type safety
 */

declare module '*/messages/en.json' {
  const value: Record<string, any>;
  export default value;
}

declare module '*/messages/ar.json' {
  const value: Record<string, any>;
  export default value;
}

declare module '*/messages/fr.json' {
  const value: Record<string, any>;
  export default value;
}

declare module '*.json' {
  const value: Record<string, any>;
  export default value;
}
