import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("mx-auto w-full max-w-screen-2xl px-5 py-10 md:px-10 md:py-20 lg:px-20", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;