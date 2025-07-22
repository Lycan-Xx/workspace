import React from 'react';
import * as Icons from 'lucide-react';

export const CategoryCard = ({ category, onSelect }) => {
	const IconComponent = Icons[category.icon];

	return (
		<div 
			className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
			onClick={() => onSelect(category)}
		>
			<div className="flex items-center space-x-4">
				<div className="text-blue-600">
					{IconComponent && <IconComponent size={24} />}
				</div>
				<div>
					<h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
					<p className="text-sm text-gray-600">{category.description}</p>
				</div>
			</div>
		</div>
	);
};