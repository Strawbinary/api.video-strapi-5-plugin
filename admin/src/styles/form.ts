import styled from 'styled-components';
import { Badge, BadgeProps } from '@strapi/design-system';

export const Title = styled.p<{ dark: boolean }>`
  color: ${(p) => (p.dark ? '#ffffff' : '#32324d')};
  font-size: 12px;
  font-weight: bold;
  padding: 0px 0px 5px 0px;
`;

export const SubTitle = styled.p`
  color: #666c8e;
  font-size: 12px;
  padding-bottom: 10px;
`;

export const FormInput = styled.input`
  border: 1px solid #eaeaef;
  width: 150px;
  height: 32px;
  padding: 0px 12px;
  border-radius: 4px;
  color: #32324d;
  font-size: 12px;

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #cecece;
  }
`;
export const CustomBadge: React.FC<BadgeProps> = styled(Badge)`
  margin-left: 10px;
`;
