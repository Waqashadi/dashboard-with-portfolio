interface RepositoryLanguageProps {
  language: string | null;
}

export function RepositoryLanguage({ language }: RepositoryLanguageProps) {
  if (!language) {
    return <span className="text-xs text-muted-foreground">Language not specified</span>;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
      <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
      {language}
    </span>
  );
}

export default RepositoryLanguage;
