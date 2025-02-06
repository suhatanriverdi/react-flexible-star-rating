declare module 'react-flexible-star-rating' {
  interface StarRatingProps {
    starsLength?: number;
    isHalfRatingEnabled?: boolean;
    isHoverEnabled?: boolean;
    isReadOnly?: boolean;
    initialRating?: number;
    dimension?: number;
    color?: string;
    onRatingChange?: (newRating: number) => void;
  }

  export function StarRating(props: StarRatingProps): JSX.Element;
}
