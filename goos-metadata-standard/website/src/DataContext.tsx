// DataContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your context data
interface DataContextType {
  data: any; // Change this to a more specific type if needed
  setData: React.Dispatch<React.SetStateAction<any>>;
}

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(null); // Initialize with null or a default value

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the DataContext
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
