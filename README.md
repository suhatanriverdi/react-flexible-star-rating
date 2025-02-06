# React Star Rating Component

A highly customizable and lightweight star rating component for React applications. Supports both full and half-star ratings with extensive customization options.

## 🚀 Features

- ⭐ Configurable number of stars
- 🌟 Support for half-star ratings
- 🔄 Deselectable ratings (click same rating to cancel)
- ✨ Interactive hover effects
- 🔒 Read-only mode support
- 🎨 Customizable star colors
- 📐 Adjustable star sizes
- 🎯 TypeScript support
- 🪶 Lightweight

## 📦 Installation

```bash
npm install react-flexible-star-rating
```

Alternatively, you can use other package managers:

```bash
# Using yarn
yarn add react-flexible-star-rating

# Using pnpm
pnpm add react-flexible-star-rating
```

## 💻 Basic Usage

```tsx
import { StarRating } from "react-flexible-star-rating";

function App() {
  const handleRatingChange = (rating: number) => {
    // rating will be 0 when user deselects by clicking the same rating again
    console.log(`New rating: ${rating}`);
  };

  return <StarRating initialRating={3.5} onRatingChange={handleRatingChange} />;
}
```

## ⚙️ Props

| Prop                  | Type                       | Default     | Description               |
| --------------------- | -------------------------- | ----------- |---------------------------|
| `starsLength`         | `number`                   | `5`         | Number of stars to display |
| `isHalfRatingEnabled` | `boolean`                  | `false`     | Enable half-star ratings  |
| `isHoverEnabled`      | `boolean`                  | `true`      | Enable hover effects      |
| `isReadOnly`          | `boolean`                  | `false`     | Make the rating read-only |
| `initialRating`       | `number`                   | `0`         | Initial rating value      |
| `dimension`           | `number`                   | `30`        | Size of stars in rem      |
| `color`               | `string`                   | `"#FFD700"` | Star color in HEX format  |
| `onRatingChange`      | `(rating: number) => void` | -           | Rating change callback    |

## 📝 Examples

### Basic Star Rating

```tsx
<StarRating
  starsLength={5}
  initialRating={0}
  onRatingChange={(rating) => console.log(rating)}
/>
```

### Half-Star Rating

```tsx
<StarRating
  starsLength={5}
  initialRating={3.5}
  isHalfRatingEnabled={true}
  onRatingChange={(rating) => console.log(rating)}
/>
```

### Read-only Rating Display

```tsx
<StarRating starsLength={5} initialRating={4} isReadOnly={true} />
```

### Custom Styled Rating

```tsx
<StarRating
  starsLength={5}
  initialRating={5}
  dimension={40}
  color="#FF5733"
  isHoverEnabled={true}
/>
```

### Disabled Hover Effects

```tsx
<StarRating starsLength={5} initialRating={3} isHoverEnabled={false} />
```

## 🎯 Advanced Usage

### With Form Integration

```tsx
import { useState } from "react";
import { StarRating } from "react-flexible-star-rating";

function ReviewForm() {
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted rating:", rating);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Your Rating:</label>
        <StarRating
          initialRating={rating}
          onRatingChange={setRating}
          isHalfRatingEnabled={true}
        />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
}
```

### With Dynamic Updates

```tsx
// Example 1: Using setState directly
function DynamicRatingWithState() {
  const [rating, setRating] = useState(0);

  return (
    <div>
      <StarRating initialRating={rating} onRatingChange={setRating} />
      <p>Current rating: {rating}</p>
      <button onClick={() => setRating(0)}>Reset</button>
    </div>
  );
}

// Example 2: Using callback function for custom logic
function DynamicRatingWithCallback() {
  const [rating, setRating] = useState(0);
  const [ratingHistory, setRatingHistory] = useState<number[]>([]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setRatingHistory((prev) => [...prev, newRating]);

    // Additional custom logic
    console.log(`Rating updated to: ${newRating}`);
    console.log(`Rating history: ${[...ratingHistory, newRating]}`);
  };

  return (
    <div>
      <StarRating initialRating={rating} onRatingChange={handleRatingChange} />
      <p>Current rating: {rating}</p>
      <p>Previous ratings: {ratingHistory.join(", ")}</p>
      <button
        onClick={() => {
          setRating(0);
          setRatingHistory([]);
        }}
      >
        Reset
      </button>
    </div>
  );
}
```

### Error Handling

```tsx
function ErrorHandlingExample() {
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = (newRating: number) => {
    try {
      if (newRating > 5) {
        throw new Error("Rating cannot exceed maximum value");
      }
      setRating(newRating);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div>
      <StarRating
        initialRating={rating}
        onRatingChange={handleRatingChange}
        starsLength={5}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
```

### Controlled Component

```tsx
function ControlledRating() {
  const [rating, setRating] = useState(0);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const toggleReadOnly = () => {
    setIsReadOnly(!isReadOnly);
  };

  return (
    <div>
      <StarRating
        initialRating={rating}
        onRatingChange={setRating}
        isReadOnly={isReadOnly}
      />
      <button onClick={toggleReadOnly}>
        {isReadOnly ? "Enable Rating" : "Disable Rating"}
      </button>
      <p>Current rating: {rating}</p>
    </div>
  );
}
```

## 🔍 API Details

### Rating Validation

- When `isHalfRatingEnabled` is `true`, ratings can be in increments of 0.5
- When `isHalfRatingEnabled` is `false`, only integer ratings are allowed
- `initialRating` must be between 0 and `starsLength`
- The component will throw an error if:
  - `initialRating` is greater than `starsLength`
  - `initialRating` is less than 0
  - `starsLength` is less than or equal to 0
  - `isHoverEnabled` is true when `isReadOnly` is true

### Rating Deselection

The component supports rating deselection:

- Click on the same rating twice to cancel/deselect it
- The rating will reset to 0
- The `onRatingChange` callback will be called with 0

### Performance Optimization

- Uses React's `useMemo` and `useCallback` hooks for optimal rendering
- Memoized color and dimension props to prevent unnecessary re-renders
- Efficient state updates using React's state management

### Browser Compatibility

- Supports all modern browsers (Chrome, Firefox, Safari, Edge)
- Touch events supported for mobile devices

### Troubleshooting

#### Common Issues

1. Rating not updating:

   - Ensure `onRatingChange` prop is properly passed
   - Check if component is not in read-only mode

2. Half-star ratings not working:

   - Verify `isHalfRatingEnabled` is set to `true`
   - Check if `initialRating` has decimal values

3. Hover effects not showing:
   - Confirm `isHoverEnabled` is not set to `false`
   - Verify the component is not in read-only mode
