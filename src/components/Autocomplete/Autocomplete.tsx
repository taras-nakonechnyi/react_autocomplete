import { Person } from '../../types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';

type Props = {
  delay?: number;
  people: Person[];
  query: string;
  setQuery: (query: string) => void;
  setAppliedQuery: (query: string) => void;
};

export const Autocomplete: React.FC<Props> = ({
  delay = 300,
  people,
  query,
  setQuery,
  setAppliedQuery,
}) => {
  const [inputFocus, setInputFocus] = useState(false);
  const debouncedAppliedQuery = useCallback(
    debounce((newQuery: string) => {
      setAppliedQuery(newQuery);
    }, delay),
    [delay],
  );
  const filterPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setInputFocus(true);
    setQuery(newQuery);
    debouncedAppliedQuery(newQuery);
  };

  const handlBlurChange = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!event.relatedTarget) {
      setInputFocus(false);
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={query}
          onChange={filterPeople}
          className="input"
          data-cy="search-input"
          onFocus={() => {
            setInputFocus(true);
          }}
          onBlur={handlBlurChange}
        />
      </div>

      {inputFocus && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {people.map(({ name, sex }) => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={name}
                onMouseDown={(
                  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                ) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  setQuery(name);
                  setInputFocus(false);
                }}
              >
                <p
                  className={classNames('', {
                    'has-text-link': sex === 'm',
                    'has-text-danger': sex === 'f',
                  })}
                >
                  {name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
