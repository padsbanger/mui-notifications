import { useContext } from "react";

export function useNonNullableContext<T>(
  context: React.Context<T>,
  name?: string,
): NonNullable<T> {
  const maybeContext = useContext(context);
  if (maybeContext === null || maybeContext === undefined) {
    throw new Error(`context "${name}" was used without a Provider`);
  }
  return maybeContext;
}

export default useNonNullableContext;
