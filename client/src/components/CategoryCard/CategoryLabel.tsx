interface CategoryLabelProps {
  name: string;
  comingSoon?: boolean;
}

// CategoryLabel component displays the category name, truncating if too long.
export default function CategoryLabel({ name }: CategoryLabelProps) {
  return (
    <span className="w-full flex flex-col items-center mt-3 font-medium">
      <span
        className="
        w-full
        text-center
        overflow-hidden
        [font-size:clamp(0.75rem,2vw,1rem)]
        leading-tight
        px-1
        break-words
        max-h-12
        "
        title={name}
      >
        {name}
      </span>
    </span>
  );
}
