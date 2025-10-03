import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Foo from './Foo';

describe('Foo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Foo />);
    expect(baseElement).toBeTruthy();
  });
});
