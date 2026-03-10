
export interface EventFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}
export function EventFilter({ selectedCategory, onCategoryChange }: EventFilterProps) {
  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'social', label: 'Social' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'meeting', label: 'Meetings' },
  ];

  return (
    <fieldset style={{ marginBottom: '24px' }}>
      <legend>Filter by category</legend>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            aria-pressed={selectedCategory === cat.value}
            onClick={() => onCategoryChange(cat.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              cursor: 'pointer',
              background: selectedCategory === cat.value ? '#007bff' : 'white',
              color: selectedCategory === cat.value ? 'white' : '#333',
              fontSize: '14px',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}