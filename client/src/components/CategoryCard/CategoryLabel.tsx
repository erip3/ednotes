interface CategoryLabelProps {
  name: string;
  comingSoon?: boolean;
}

// CategoryLabel component displays the category name, truncating if too long.
export default function CategoryLabel({ name }: CategoryLabelProps) {
  return (
    <span className="mt-3 flex w-full flex-col items-center font-medium">
      <span
        className="
        max-h-12
        w-full
        overflow-hidden
        break-words
        px-1
        text-center
        leading-tight
        [font-size:clamp(0.75rem,2vw,1rem)]
        "
        title={name}
      >
        {name}
      </span>
    </span>
  );
}
