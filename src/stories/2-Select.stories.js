/** @format */
import { CustomSelect as Select } from "../shared/components/Dropdown";

export default {
  title: "Dropdown",
  component: Select,
};

export const multiSelectWithOutScroll = () => (
  <Select
    options={["option-1", "option-2"]}
    isMulti={true}
    onSelectChange={(e) => console.log(e)}
  />
);

export const multiSelectWithScroll = () => (
  <Select
    options={[
      "option-1",
      "option-2",
      "option-3",
      "option-4",
      "option-5",
      "option-6",
      "option-7",
      "option-8",
    ]}
    isMulti={true}
    onSelectChange={(e) => console.log(e)}
  />
);

export const singleSelectWithScrollBar = () => (
  <Select
    options={[
      "option-1",
      "option-2",
      "option-3",
      "option-4",
      "option-5",
      "option-6",
      "option-7",
      "option-8",
    ]}
    isMulti={false}
    onSelectChange={(e) => console.log(e)}
  />
);

export const singleSelectWithoutScrollBar = () => (
  <Select
    options={["option-1", "option-2", "option-3"]}
    isMulti={false}
    onSelectChange={(e) => console.log(e)}
  />
);

export const noData = () => (
  <Select options={[]} isMulti={false} onSelectChange={(e) => console.log(e)} />
);
