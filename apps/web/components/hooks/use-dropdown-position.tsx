import React, { RefObject } from "react";

export const useDropDownPosition = (ref: RefObject<HTMLDivElement | null>) => {

  const getDropDownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };
    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; //Dropdown width

    const top = rect.bottom + window.scrollY;  
    let left = rect.left + window.scrollX; 

    if (left + dropdownWidth > window.innerWidth) {
      left = rect.right - dropdownWidth + window.scrollX;
      
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16; 
      }
    }

    if (left < 0) {
      left = 16; 
    }

    return { top, left };
  };

  return {getDropDownPosition};
};
