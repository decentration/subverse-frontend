// ./components/DetailsInput.tsx

import React from 'react';

interface DetailsInputProps {
  label: string;
  value: string;
  disabled: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

}

const DetailsInput: React.FC<DetailsInputProps> = ({ label, value, disabled, onChange }) => {
  const containerStyle = {
    marginBottom: '16px',
    marginLeft: '10px',
    marginRight: '10px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#444',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    color: disabled ? '#999' : '#333',
    backgroundColor: disabled ? '#f5f5f5' : '#fff',
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>{label}</label>
      <input type="text" value={value} disabled={disabled} style={inputStyle}  onChange={onChange || (() => {})} />
    </div>
  );
};

export default DetailsInput;
