interface SectionHeaderProps {
  title: string;
  description?: string;
}

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold tracking-tight">
        {title}
      </h2>

      {description && (
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}