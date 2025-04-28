import { useState } from "react";

const useStatefulBool = (v: boolean): [boolean, (to?: boolean) => void] => {
  const [value, setValue] = useState(v);

  const toggle = (to?: boolean) => setValue(to !== undefined ? to : !value);

  return [value, toggle];
};

export default useStatefulBool;
