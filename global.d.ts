declare module "class-variance-authority" {
  // Type-safe declaration for CVA
  import * as React from "react";

  export type ClassValue = string | number | null | boolean | undefined | ClassValue[];

  export function cva<
    Variants extends Record<string, Record<string, string>>,
    DefaultVariants extends Partial<{ [K in keyof Variants]: keyof Variants[K] }>
  >(
    base?: string,
    options?: {
      variants?: Variants;
      defaultVariants?: DefaultVariants;
    }
  ): (
    props?: Partial<
      {
        [K in keyof Variants]: keyof Variants[K];
      } & { class?: string }
    >
  ) => string;

  // ✅ Proper type for VariantProps
  export type VariantProps<
    T extends (...args: any[]) => string
  > = T extends (options?: infer O) => any ? NonNullable<O> : never;
}
declare module "@radix-ui/react-separator" {
  import * as React from "react";

  export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
  }

  export const Root: React.ForwardRefExoticComponent<
    SeparatorProps & React.RefAttributes<HTMLDivElement>
  >;
}

declare module "@radix-ui/react-checkbox" {
  import * as React from "react";

  type CheckedState = boolean | "indeterminate";

  export interface CheckboxProps extends React.ComponentPropsWithoutRef<"button"> {
    checked?: CheckedState;
    onCheckedChange?: (checked: CheckedState) => void;
    disabled?: boolean;
  }

  export const Root: React.ForwardRefExoticComponent<
    CheckboxProps & React.RefAttributes<HTMLButtonElement>
  >;

  export const Indicator: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<"span"> & React.RefAttributes<HTMLSpanElement>
  >;
}
