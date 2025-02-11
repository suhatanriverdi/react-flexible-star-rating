import { EmptyStar, FilledStar, HalfFilledStar } from './Stars';
import React, { useCallback, useState } from 'react';

/**
 * Props for the StarRating component.
 */
interface StarRatingProps {
  /**
   * Total number of stars to display.
   * @default 5
   * @type {number}
   */
  starsLength?: number;

  /**
   * Enables or disables half-star ratings.
   * @default false
   * @type {boolean}
   */
  isHalfRatingEnabled?: boolean;

  /**
   * Determines whether mouse hover behavior is enabled.
   * @default true
   * @type {boolean}
   */
  isHoverEnabled?: boolean;

  /**
   * If true, the component is non-interactive and only displays the rating.
   * @default false
   * @type {boolean}
   */
  isReadOnly?: boolean;

  /**
   * The initial rating to display.
   * Should be in the range of 0 <= initialRating <= starsLength.
   * Can be multiples of either 1 or 0.5 based on `isHalfRatingEnabled`.
   *
   * - If `isHalfRatingEnabled` is true:
   *   Values like 0.5, 1.0, 1.5, etc. are allowed.
   * - If `isHalfRatingEnabled` is false:
   *   Integer values like 0, 1, 2, etc. are allowed.
   *
   * @default 0
   * @type {number}
   */
  initialRating?: number;

  /**
   * Dimension of the stars (width and height, in rem unit, 1rem is 16px by default).
   * @default Depends on the dimension defined in the star components.
   * @type {number}
   */
  dimension?: number;

  /**
   * The HEX color code used for the stars.
   * This property allows you to customize the color of the stars in the rating component.
   *
   * Example:
   * - "#FFD700" for gold-colored stars
   * - "#FF0000" for red-colored stars
   *
   * @default undefined - Defaults to the internal color setting if not specified.
   * @type {string}
   */
  color?: string;

  /**
   * Callback function for handling rating changes.
   *
   * This function is triggered whenever the user updates the rating in the `StarRating` component.
   *
   * @param {number} newRating - The new rating value selected by the user.
   *
   * @example
   * // Example usage in the parent component:
   * const handleRatingChange = (newRating: number) => {
   *    console.log("Updated rating: ", newRating);
   * };
   *
   * <StarRating onRatingChange={handleRatingChange} />
   */
  onRatingChange?: (newRating: number) => void;
}

/**
 * StarRating Component
 *
 * A flexible and customizable star rating component that supports
 * full and half-star ratings with interactive hover and click states.
 *
 * - Provides smooth transitions on hover.
 * - Dynamically updates based on user interaction.
 *
 * @param {StarRatingProps} props - The configuration options for the component.
 * @returns {JSX.Element} The rendered star rating component.
 */
export function StarRating({
  starsLength = 5,
  initialRating = 0,
  isHalfRatingEnabled = initialRating % 1 !== 0,
  isReadOnly = false,
  isHoverEnabled = !isReadOnly,
  dimension = 30,
  color,
  onRatingChange,
}: StarRatingProps): JSX.Element {
  // Validate initial rating within acceptable range and format
  if (initialRating > starsLength || initialRating < 0) {
    throw new Error('initialRating must be within range: 0 <= initialRating <= starsLength.');
  }

  // Validate that the rating is either a whole number or a proper half-star value
  if (initialRating % 0.5 !== 0) {
    throw new Error(
      'initialRating must be a whole number or a multiple of 0.5 when half-rating is enabled.'
    );
  }

  // Validate that starsLength is greater than zero
  if (starsLength <= 0) {
    throw new Error('starsLength must be greater than zero to ensure valid ratings.');
  }

  // Ensure hover interactions are disabled when read-only mode is enabled
  if (isReadOnly && isHoverEnabled) {
    throw new Error(
      'isHoverEnabled cannot be true when isReadOnly is enabled. Please disable hover interactions for read-only mode.'
    );
  }

  // State Management

  /**
   Initializes the state of stars based on initial rating.

   @returns {number[]} The initial state of stars represented as an array.
   */
  const initializeStarsState = (): number[] => createNewStarsState(initialRating);

  /**
   Creates a new array representing the state of stars based on provided index.

   @param {number} untilIndex - Rating index up to which stars should be filled.

   @returns {number[]} Array representing each star's state:
    - `0`: Empty
    - `1`: Half-filled
    - `2`: Fully-filled
   */
  const createNewStarsState = (untilIndex: number): number[] => {
    const flooredUntilIndex = Math.floor(untilIndex);
    const hasHalfFilledStar = untilIndex - flooredUntilIndex > 0;

    const newStarsState: number[] = Array.from({ length: starsLength }, (_, index) =>
      index < flooredUntilIndex ? 2 : 0
    );

    if (hasHalfFilledStar) {
      newStarsState[flooredUntilIndex] = 1;
    }

    return newStarsState;
  };

  /**
   * Holds current state of stars where each star's status is represented by a number:
   * `0` for Empty, `1` for Half-filled, and `2` for Fully-filled.
   * Initialized with value returned from initializeStarsState().
   */
  const [starsState, setStarsState] = useState<number[]>(initializeStarsState);

  /**
   * Stores previous state of stars before user interaction allowing reset if necessary.
   * Initialized with current value of starsState at mount time.
   */
  const [previousStarsState, setPreviousStarsState] = useState<number[]>(starsState);

  /**
   * Tracks last clicked index by user enabling toggle logic for same rating clicks.
   * Initialized with value of initialRating at mount time.
   */
  const [lastClickedUntilIndexState, setLastClickedUntilIndexState] = useState<number | null>(
    initialRating
  );

  /**
   * Keeps track of last side hovered over when half-star ratings are enabled
   * aiding finer control over half-star selections. Initialized as null indicating no side selected at start.
   */
  const [lastSide, setLastSide] = useState<'L' | 'R' | null>(null);

  /**
   * State to track and manage the hover lock behavior.
   *
   * When a user de-selects a star and moves the mouse away from the star, this state ensures that the hover effect remains
   * disabled until the mouse fully exits the star's boundary. This mechanism improves the user experience by providing a clear
   * and consistent visual feedback, preventing any confusion regarding the hover state.
   */
  const [isHoverEffectLockEnabled, setIsHoverEffectLockEnabled] = useState<boolean>(false);

  /**
   Retrieves the corresponding star SVG component based on its state identifier.
   Utilizes memoized color and dimension for optimal performance.

   @param {number} starID - Identifier for star's state:
    - `0`: Empty star
    - `1`: Half-filled star
    - `2`: Fully-filled star

   @returns {JSX.Element} The corresponding star SVG component based on state.
   */
  const getStarSVGs = useCallback(
    (starID: number): JSX.Element => {
      switch (starID) {
        case 1:
          return <HalfFilledStar color={color} />;
        case 2:
          return <FilledStar color={color} />;
        default:
          return <EmptyStar color={color} />;
      }
    },
    [color]
  );

  /**
   Determines if the left or right half of a star was clicked.

   @param {React.MouseEvent<HTMLElement>} event - Mouse event from click action.

   @returns {boolean} `true` if left half was clicked; otherwise `false`.
   */
  const isHalfClicked = (event: React.MouseEvent<HTMLElement>): boolean => {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const midpoint = rect.width / 2;
    return event.nativeEvent.offsetX < midpoint;
  };

  /**
   Resets state of all stars to empty.

   @returns {void}
   */
  const resetStarsState = (): void => {
    const newEmptyStarsState = Array(starsLength).fill(0);
    updateStarsState(newEmptyStarsState);
    setPreviousStarsState(newEmptyStarsState);
  };

  /**
   Updates stars' state within component's state.

   @param {number[]} newStarsState - New state array representing filled/unfilled stars.

   @returns {void}
   */
  const updateStarsState = (newStarsState: number[]): void => setStarsState(newStarsState);

  /**
   Updates index of last clicked star in state.

   @param {number | null} newLastClickedUntilIndexState - New last clicked index or null.

   @returns {void}
   */
  const updateLastClickedUntilIndexState = (newLastClickedUntilIndexState: number | null): void =>
    setLastClickedUntilIndexState(newLastClickedUntilIndexState);

  // Handles changes in rating and invokes callback if provided
  const handleRatingChange = (newRating: number): void => {
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  /**
   Updates stars' state upon star click event.

   @param {number} untilIndex - Index up to which stars should be filled.

   @returns {void}
   */
  const handleStarsStateUpdate = (untilIndex: number): void => {
    setPreviousStarsState(starsState);

    if (lastClickedUntilIndexState === untilIndex) {
      resetStarsState();
      updateLastClickedUntilIndexState(null);
      handleRatingChange(0);
      return;
    }

    const newStarsState = createNewStarsState(untilIndex);
    updateStarsState(newStarsState);
    updateLastClickedUntilIndexState(untilIndex);
    handleRatingChange(untilIndex);
  };

  /**
   Computes index up to which stars should be filled based on user interaction.

   @param {React.MouseEvent<HTMLElement>} event - Mouse event from interaction.
   @param {number} index - Index of clicked star.

   @returns {number} Computed index for filling stars based on click position.
   */
  const getUntilIndex = (event: React.MouseEvent<HTMLElement>, index: number): number => {
    const hasHalfFilledStar = isHalfRatingEnabled && isHalfClicked(event);
    return hasHalfFilledStar ? index - 0.5 : index;
  };

  /**
   Handles click events on stars to update rating.

   @param {React.MouseEvent<HTMLElement>} event - Click event from user interaction.
   @param {number} index - Index of clicked star.

   @returns {void}
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>, index: number): void => {
    const untilIndex = getUntilIndex(event, index);
    handleStarsStateUpdate(untilIndex);
    setIsHoverEffectLockEnabled(true);
  };

  /**
   Handles hover events to visually update stars based on interaction.

   @param {React.MouseEvent<HTMLDivElement>} event - Mouse move event from user interaction.
   @param {number} index - Index of hovered star.

   @returns {void}
   */
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number): void => {
    if (!isHalfRatingEnabled) {
      updateStarsState(createNewStarsState(index));
      return;
    }

    const element = event.currentTarget as HTMLDivElement;
    const rect = element.getBoundingClientRect();
    const midpoint = rect.width / 2;

    // Determine which side of a star was hovered over
    const isLeftSide = event.clientX < rect.left + midpoint;

    if (isLeftSide && lastSide !== 'L') {
      updateStarsState(createNewStarsState(index - 0.5));
      setLastSide('L');
    } else if (!isLeftSide && lastSide !== 'R') {
      updateStarsState(createNewStarsState(index));
      setLastSide('R');
    }
  };

  /**
   * Renders interactive star elements based on current state.

   * @returns {JSX.Element[]} Array of rendered star components as JSX elements.
   */
  const drawStars = (): JSX.Element[] => {
    const rightPaddingValue = dimension
      ? Math.max(dimension * 0.005, dimension / starsLength / 10)
      : 0.5;

    const shouldAddRightPadding = starsLength > 1;

    return starsState.map((star, index) => (
      <div
        style={{
          ...(shouldAddRightPadding &&
            index < starsLength - 1 && {
              paddingRight: `${rightPaddingValue}rem`,
            }),
          cursor: isReadOnly ? 'not-allowed' : 'pointer',
        }}
        key={index}
        {...(!isReadOnly && {
          onClick: (event) => handleClick(event, index + 1),
          ...(isHoverEnabled && {
            onMouseMove: !isHoverEffectLockEnabled
              ? (event) => handleMouseMove(event, index + 1)
              : isHalfRatingEnabled
                ? () => setIsHoverEffectLockEnabled(false)
                : undefined,
            onMouseLeave: handleMouseLeave,
          }),
        })}
      >
        {getStarSVGs(star)}
      </div>
    ));
  };

  /**
   * Resets hover state upon mouse leave action.

   * @returns {void}
   */
  const handleMouseLeave = (): void => {
    updateStarsState(previousStarsState);
    setLastSide(null);
    setIsHoverEffectLockEnabled(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        maxWidth: `${dimension}rem`,
      }}
    >
      {drawStars()}
    </div>
  );
}
