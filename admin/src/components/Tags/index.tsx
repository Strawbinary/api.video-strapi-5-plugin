import { FC, useState } from 'react';
import { CustomBadge, SubTitle, Title } from '../../styles/form';
import { useTheme } from '../../utils/hooks';
import { Combobox, ComboboxOption } from '@strapi/design-system';

interface ITag {
  tags: string[];
  handleSetTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  editable: boolean;
}

const Tags: FC<ITag> = ({ tags, handleSetTag, handleRemoveTag, editable }) => {
  const [value, setValue] = useState<string>('');
  const theme = useTheme();

  const onCreateOption = (value?: string) => {
    if (value) {
      handleSetTag(value);
      setValue(value);
    }
  };

  const onClear = () => {
    if (tags.find((tag) => tag === value)) {
      handleRemoveTag(value);
    }
  };

  return (
    <>
      <Title dark={theme === 'dark'}>
        Tags
        <CustomBadge active={tags.length > 0}>{tags.length}</CustomBadge>
      </Title>
      <SubTitle>A list of tags you want to use to describe your video.</SubTitle>
      <Combobox
        aria-label="Tags"
        value={value}
        onInputChange={(e) => setValue(e.target.value)}
        onCreateOption={onCreateOption}
        onClear={onClear}
        disabled={!editable}
        creatable={true}
      >
        {tags.map((tag, i) => (
          <ComboboxOption key={i} value={tag}>
            {tag}
          </ComboboxOption>
        ))}
      </Combobox>
      <br />
    </>
  );
};

export default Tags;
