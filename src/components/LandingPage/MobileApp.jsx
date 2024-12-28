import React from 'react';
import { AppleIcon, PlayIcon } from 'lucide-react';
import mobileapp from '../assets/evault-app.jpg';


const MobileApp = () => {
return (
	<section className="py-20 bg-[#08448c] text-white">
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

				<div className="relative">
					<img
						src={mobileapp}
						alt="Mobile App"
						className="rounded-2xl mx-auto"
					/>
				</div>

				<div className="space-y-6">
					<h2 className="text-3xl md:text-[3rem] font-bold mb-4 text-orange-500">Get Our Mobile App</h2>
					<br />
					<p className="text-lg text-gray-200">
						Experience the power of eVault in your pocket. Download our mobile app
						for seamless access to all our services, anytime, anywhere.
					</p>
					<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
						<button className="flex items-center justify-center space-x-2 bg-black px-6 py-3 rounded-lg hover:bg-gray-900">
							<AppleIcon className="h-6 w-6" />
							<div className="text-left">
								<div className="text-xs">Download on the</div>
								<div className="text-sm font-semibold">App Store</div>
							</div>
						</button>
						<button className="flex items-center justify-center space-x-2 bg-black px-6 py-3 rounded-lg hover:bg-gray-900">
							<PlayIcon className="h-6 w-6" />
							<div className="text-left">
								<div className="text-xs">Get it on</div>
								<div className="text-sm font-semibold">Google Play</div>
							</div>
						</button>
					</div>
				</div>

				
			</div>
		</div>
	</section>
);
};

export default MobileApp;