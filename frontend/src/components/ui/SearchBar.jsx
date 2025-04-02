import PropTypes from 'prop-types';
import { Search } from 'lucide-react';
import { Button } from './button';

export default function SearchBar({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "Search...",
  buttonText = "Search",
  className = ""
}) {
  return (
    <form onSubmit={onSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
        <Search className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    </form>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string
};