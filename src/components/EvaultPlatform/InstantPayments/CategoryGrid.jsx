import React from 'react';
import { Smartphone, Signal, Wifi, Tv } from 'lucide-react';

const categories = [
	{
		icon: <Smartphone className="w-12 h-12 text-orange-500" />,
		title: 'Data Bundles',
		description: 'Affordable data plans for all networks.',
		route: 'databundles',
	},
	{
		icon: <Signal className="w-12 h-12 text-purple-500" />,
		title: 'Airtime',
		description: 'Instant airtime top-ups for all carriers.',
		route: 'airtime',
	},
	{
		icon: <Wifi className="w-12 h-12 text-teal-500" />,
		title: 'Electricity',
		description: 'Pay your electricity bills seamlessly.',
		route: 'electricity',
	},
	{
		icon: <Tv className="w-12 h-12 text-blue-500" />,
		title: 'Cable Subscriptions',
		description: 'Renew your Cable TV subscriptions instantly.',
		route: 'cable',
	},
];

const CategoryCard = ({ icon, title, description, onClick }) => (
	<div
		onClick={onClick}
		className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
	>
		<div className="mb-4">{icon}</div>
		<h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
		<p className="text-sm text-gray-600">{description}</p>
	</div>
);

const CategoryGrid = ({ onNavigate }) => {
	return (
		<div className="bg-white rounded-xl shadow-md p-6">
			<h3 className="text-xl font-bold text-[#025798] mb-6">Categories</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{categories.map((category, index) => (
					<CategoryCard
						key={index}
						{...category}
						onClick={() => onNavigate(category.route)}
					/>
				))}
			</div>
		</div>
	);
};

export default CategoryGrid;