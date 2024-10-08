import { Slider } from "@nextui-org/react";
import { useState, useEffect } from "react";

export const PriceSlider = ({ value, onValueChange }) => {
  const [range, setRange] = useState(value || [100, 500]);

  useEffect(() => {
    setRange(value);
  }, [value]);

  const handlePriceChange = (newValue) => {
    setRange(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div>
      <Slider
        label="Rango"
        color="black"
        showTooltip={true}
        showOutline={true}
        value={range}
        onChange={handlePriceChange}
        step={10}
        minValue={0}
        maxValue={1000}
        classNames={{
          base: "max-w-md",
          filler: "bg-gray-900",
          labelWrapper: "mb-2",
          label: "text-light",
          value: "text-light",
          thumb: [
            "bg-gray-900",
            "data-[dragging=true]:bg-gray-700",
            "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
          ],
          step: "data-[in-range=true]:bg-gray-600 dark:data-[in-range=true]:bg-white/50",
        }}
        tooltipProps={{
          offset: 10,
          placement: "bottom",
          classNames: {
            base: ["before:bg-gray-900"],
            content: ["py-2 shadow-xl", "text-white bg-black"],
          },
        }}
      />
    </div>
  );
};
