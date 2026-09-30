import Card from './Card';

export default {
  title: 'Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    footer: { control: 'text' },
  },
};

export const Default = {
  args: {
    title: 'Card Title',
    children: 'This is the card body.',
  },
};

export const WithFooter = {
  args: {
    title: 'Card Title',
    children: 'This is the card body.',
    footer: 'Card Footer',
  },
};
