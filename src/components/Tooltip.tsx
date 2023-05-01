import React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

type TTooltipProps = {
  children: React.ReactNode;
  tooltip?: string | React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  showTooltip?: boolean;
};

const Tooltip = ({
  children,
  tooltip = "",
  side = "bottom",
}: TTooltipProps) => {
  return (
    <RadixTooltip.Provider delayDuration={400}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          {tooltip !== "" && (
            <RadixTooltip.Content
              className={`z-50 select-none rounded-md border border-primary bg-primary px-3 py-1.5 text-xs text-primary shadow-sm ${
                side === "top" && "animate-slideUpAndFade"
              } ${side === "left" && "animate-slideLeftAndFade"} ${
                side === "right" && "animate-slideRightAndFade"
              } ${side === "bottom" && "animate-slideDownAndFade"}
            `}
              sideOffset={5}
              side={side}
            >
              {tooltip}
            </RadixTooltip.Content>
          )}
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default Tooltip;
