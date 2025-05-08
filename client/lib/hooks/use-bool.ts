import { useState } from "react";

const useBool = (init: boolean | (() => boolean) = false): [boolean, (setTo?: boolean) => void] => {
  const [value, setValue] = useState(init);

  const toggle = (setTo?: boolean) => setValue(setTo !== undefined ? setTo : !value);
  return [value, toggle];
};

export default useBool;
