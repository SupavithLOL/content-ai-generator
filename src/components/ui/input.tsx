import * as React from "react";
import clsx from "clsx"; // ใช้ clsx หรือ cn ก็ได้

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean; // เพิ่ม prop error
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={clsx(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-input bg-background",
          className
        )}
        aria-invalid={error || undefined} // ช่วยให้ A11y ดีขึ้น
        autoComplete="off"
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
