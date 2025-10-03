import { render } from '@testing-library/react';
import ButtonWrapper from './ButtonWrapper';

describe('ButtonWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ButtonWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
