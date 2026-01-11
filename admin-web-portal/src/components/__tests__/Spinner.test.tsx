import { render } from '@testing-library/react';
import Spinner from '../Spinner';
import { describe, it, expect } from 'vitest';

describe('Spinner', () => {
  it('renders spinner container', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('p-6');
    expect(container.firstChild).toHaveClass('flex');
    expect(container.firstChild).toHaveClass('items-center');
    expect(container.firstChild).toHaveClass('justify-center');
  });

  it('renders animated spinner', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('rounded-full');
    expect(spinner).toHaveClass('h-8');
    expect(spinner).toHaveClass('w-8');
    expect(spinner).toHaveClass('border-b-2');
    expect(spinner).toHaveClass('border-gray-900');
  });
});
