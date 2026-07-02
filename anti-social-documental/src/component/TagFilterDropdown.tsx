import '../styles/tagFilterDropdown.css';

interface TagFilterDropdownProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tags: string[]) => void;
}

const TagFilterDropdown = ({ tags, selectedTags, onTagSelect }: TagFilterDropdownProps) => {
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter(t => t !== tag));
    } else {
      onTagSelect([...selectedTags, tag]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTags.length === tags.length) {
      onTagSelect([]);
    } else {
      onTagSelect([...tags]);
    }
  };

  return (
    <div className="tag-filter-bar">
      <button 
        className={`tag-filter-option ${selectedTags.length === 0 ? 'active' : ''}`}
        onClick={() => onTagSelect([])}
      >
        Todos
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          className={`tag-filter-option ${selectedTags.includes(tag) ? 'active' : ''}`}
          onClick={() => handleToggleTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilterDropdown;
