interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 text-gray-500">
      <p className="font-medium text-gray-700">{title}</p>
      <p className="text-sm mt-1">{description}</p>
    </div>
  );
}
