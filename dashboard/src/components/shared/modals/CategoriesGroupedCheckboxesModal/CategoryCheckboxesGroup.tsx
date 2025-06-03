import React from 'react'

interface CategoryCheckboxesGroupProps<T> {
    category: string
    categoriesChoices :  Record<string, T[]>
}

function CategoryCheckboxesGroup<T> ({category,categoryChoices }:CategoryCheckboxesGroupProps<T> )  {
    const categoryChoices= categoriesChoices[category];
    
  
    return (
    <div>CategoryCheckboxesGroup</div>
  )
}

export default CategoryCheckboxesGroup