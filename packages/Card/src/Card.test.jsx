import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Card from './Card';

describe('Card', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Card title="Test Title">Test Content</Card>);
    expect(baseElement).toBeTruthy();
  });
});
