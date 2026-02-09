'use client';
import React from "react";
import {composeRenderProps, DropZoneProps, DropZone as RACDropZone} from 'react-aria-components';
import { tv } from "tailwind-variants";

const dropZone = tv({
  base: "flex items-center justify-center p-12 min-h-40 h-full font-sans text-base text-balance text-center rounded-2xl border border-neutral-100 bg-white duration-200 outline-white relative before:absolute before:inset-0 before:m-auto before:w-[calc(100%-16px)] before:h-[calc(100%-16px)] before:border before:rounded-lg before:border-dashed before:border-neutral-200",
  variants: {
    isFocusVisible: {
      true: "outline-neutral-600 forced-colors:outline-[Highlight]"
    },
    isDropTarget: {
      true: "bg-neutral-100 -outline-offset-1 outline-neutral-200 forced-colors:outline-[Highlight]",
    }
  }
});

export function DropZone(props: DropZoneProps) {
  return (
    <RACDropZone
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) => dropZone({ ...renderProps, className }))} />
  );
}
