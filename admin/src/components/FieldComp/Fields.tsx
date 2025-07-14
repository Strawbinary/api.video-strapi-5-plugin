import React, { FC } from 'react';
import styled from 'styled-components';
import { Box, Flex, Link, Field } from '@strapi/design-system';

interface IFieldProps {
  name: string;
  label?: string;
  value: string;
  isPassword?: boolean;
  placeholder?: string;
  description?: string;
  tooltip?: string;
  detailsLink?: string;
  error?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<any>) => void;
  editable?: boolean;
}

const FieldLabelStyled = styled(Field.Label)`
  width: 100%;
  & > div {
    width: max-content;
  }
`;

const FieldComp: FC<IFieldProps> = ({
  name,
  label,
  value,
  isPassword,
  placeholder,
  description,
  tooltip,
  detailsLink,
  error,
  required,
  onChange = () => {},
  editable,
}): JSX.Element => {
  return (
    <Field.Root required={required} name={name} hint={description} error={error}>
      <Flex direction="column" gap={1}>
        <Flex>
          <FieldLabelStyled>{label}</FieldLabelStyled>
          <Box paddingLeft={2}></Box>
          {detailsLink && (
            <Flex width="100%" justifyContent="flex-end">
              <Link isExternal href={detailsLink}>
                Details
              </Link>
            </Flex>
          )}
        </Flex>
        <Field.Input
          disabled={editable === undefined ? false : !editable}
          placeholder={placeholder}
          value={value}
          type={isPassword ? 'password' : 'text'}
          onChange={onChange}
        />
        <Field.Hint />
        <Field.Error />
      </Flex>
    </Field.Root>
  );
};

export default FieldComp;
