import React, { FC } from 'react';
import styled from 'styled-components';
import { Toggle as StrapiToggle, Flex, Field } from '@strapi/design-system';

interface IToggleProps {
  label?: string;
  required?: boolean;
  checked?: boolean;
  onLabel?: string;
  offLabel?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
}

const Toggle: FC<IToggleProps> = ({
  label,
  required,
  checked,
  onLabel,
  offLabel,
  onChange = () => {},
}): JSX.Element => {
  return (
    <>
      <Field.Root required={required}>
        <Field.Label>{label}</Field.Label>
        <StrapiToggle
          checked={checked}
          onLabel={onLabel ?? ''}
          offLabel={offLabel ?? ''}
          onChange={onChange}
        />
      </Field.Root>
    </>
  );
};

export default Toggle;
