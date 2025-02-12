import type { Meta, StoryObj } from '@storybook/react';
import { StarRating } from '../components/StarRating';

const meta: Meta<typeof StarRating> = {
  title: 'Components/StarRating',
  component: StarRating,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Overview
A highly flexible and customizable star rating component for React applications. Perfect for product reviews, user feedback, and rating systems.

### Key Features
- ⭐ Configurable number of stars
- 🌟 Support for half-star ratings
- 🔄 Deselectable ratings (click same rating to cancel)
- ✨ Interactive hover effects
- 🔒 Read-only mode support
- 🎨 Customizable star colors
- 📐 Adjustable star sizes
- 🎯 TypeScript support
- 🪶 Lightweight (Final Bundle Size: 14.1 kB)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    starsLength: {
      description: 'Number of stars to display',
      control: { type: 'number', min: 1, max: 10 },
      table: { defaultValue: { summary: '5' } },
    },
    initialRating: {
      description: 'Initial rating value',
      control: { type: 'number', min: 0, max: 10, step: 0.5 },
      table: { defaultValue: { summary: '0' } },
    },
    isHalfRatingEnabled: {
      description: 'Enable half-star ratings',
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    isReadOnly: {
      description: 'Make the rating display-only',
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    isHoverEnabled: {
      description: 'Enable hover effects',
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    dimension: {
      description: 'Size of stars in rem units',
      control: { type: 'number', min: 1, max: 10 },
      table: { defaultValue: { summary: '2' } },
    },
    color: {
      description: 'Color of the stars (HEX format)',
      control: 'color',
      table: { defaultValue: { summary: '#FFD700' } },
    },
    onRatingChange: {
      description: 'Callback function when rating changes',
      action: 'rating changed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    starsLength: 5,
    initialRating: 0,
    onRatingChange: (rating) => console.log('New rating:', rating),
  },
  parameters: {
    docs: {
      description: {
        story: 'The basic implementation with default settings. Click to set a rating or hover to preview.',
      },
    },
  },
};

export const HalfStarRating: Story = {
  args: {
    starsLength: 5,
    initialRating: 3.5,
    isHalfRatingEnabled: true,
    onRatingChange: (rating) => console.log('New rating:', rating),
  },
  parameters: {
    docs: {
      description: {
        story: 'Enables half-star ratings for more precise feedback. Hover over the left or right side of a star to select half or full ratings.',
      },
    },
  },
};

export const CustomStyledRed: Story = {
  args: {
    starsLength: 10,
    initialRating: 5,
    dimension: 20,
    color: '#FF5733',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates color customization with a red theme and smaller star size. Perfect for error or warning indicators.',
      },
    },
  },
};

export const CustomStyledGreen: Story = {
  args: {
    starsLength: 10,
    initialRating: 3,
    dimension: 40,
    color: '#2ECC71',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a success-themed rating with larger stars. Ideal for positive feedback or success indicators.',
      },
    },
  },
};

export const CustomStyledBlue: Story = {
  args: {
    starsLength: 3,
    initialRating: 1,
    dimension: 45,
    color: '#3498DB',
  },
  parameters: {
    docs: {
      description: {
        story: 'A simplified 3-star rating system with blue stars. Suitable for quick feedback or satisfaction surveys.',
      },
    },
  },
};

export const SingleLargeStar: Story = {
  args: {
    starsLength: 1,
    initialRating: 1,
    dimension: 30,
    color: '#9B59B6',
    isHoverEnabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A single large star for simple like/favorite functionality. Great for wishlists or favorites.',
      },
    },
  },
};

export const ReadOnly: Story = {
  args: {
    starsLength: 5,
    initialRating: 4,
    isReadOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Display-only mode for showing static ratings. Useful for displaying average ratings or historical data.',
      },
    },
  },
};

export const DisabledHover: Story = {
  args: {
    starsLength: 5,
    initialRating: 3,
    isHoverEnabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Rating component without hover effects. Provides a simpler interaction model with direct click-to-rate functionality.',
      },
    },
  },
};
