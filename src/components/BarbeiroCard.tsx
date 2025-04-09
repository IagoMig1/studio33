import React from 'react';

interface BarbeiroProps {
  id: string;
  nome: string;
  foto: string;
  especialidade: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const BarbeiroCard: React.FC<BarbeiroProps> = ({
  id,
  nome,
  foto,
  especialidade,
  selected,
  onSelect
}) => {
  return (
    <div
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
        selected
          ? 'ring-2 ring-brand.DEFAULT transform scale-105'
          : 'hover:transform hover:scale-105'
      }`}
      onClick={() => onSelect(id)}
    >
      <img src={foto} alt={nome} className="w-full h-64 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-brand.black bg-opacity-80 text-white p-4">
        <h3 className="font-semibold text-lg">{nome}</h3>
        <p className="text-sm text-brand.gray">{especialidade}</p>
      </div>
      {selected && (
        <div className="absolute top-4 right-4 bg-brand.DEFAULT text-white rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
