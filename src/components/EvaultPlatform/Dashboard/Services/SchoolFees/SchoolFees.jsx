import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import SchoolSearch from "./SchoolSearch";
import PaymentPopup from "../PaymentPopup";

const Carousel = ({ images, altText }) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
		}, 5000);

		return () => clearInterval(timer);
	}, [images.length]);

	return (
		<div className="relative w-full h-[400px] overflow-hidden rounded-xl">
			{images.map((image, index) => (
				<div
					key={image}
					className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
						index === currentIndex ? 'opacity-100' : 'opacity-0'
					}`}
				>
					<img
						src={image}
						alt={`${altText} - ${index + 1}`}
						className="w-full h-full object-cover rounded-xl"
					/>
				</div>
			))}
		</div>
	);
};

const SchoolFees = ({ onBack }) => {
	const [selectedSchool, setSelectedSchool] = useState(null);
	const [studentName, setStudentName] = useState("");
	const [email, setEmail] = useState("");
	const [text, setText] = useState("");
	const [amount, setAmount] = useState("");
	const [classLevel, setClassLevel] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleBackClick = () => {
		if (selectedSchool) {
			setSelectedSchool(null);
		} else {
			onBack();
		}
		setStudentName("");
		setEmail("");
		setMobileNumber("");
		setText("");
		setAmount("");
		setClassLevel("");
	};

	const handleProceed = () => {
		setIsPaymentDialogOpen(true);
	setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setIsDialogOpen(true); // Open the payment popup
		}, 5000);
	};

	return (
		<div className="max-w-6xl mx-auto p-6">
	{/* Back Button */}
		<button
			className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 mb-4"
			aria-label="Go back"
			onClick={handleBackClick}
		>
			<ArrowLeft className="w-5 h-5" />
			<span>{selectedSchool ? "Back" : "Go to Dashboard"}</span>
		</button>

		<div className="grid grid-cols-1 gap-8">
			{!selectedSchool && (
			<SchoolSearch onSelectSchool={(school) => setSelectedSchool(school)} />
			)}

			{selectedSchool && (
			<div>
			{/* Top Banner Section */}
			<div className="relative">
				<Carousel 
				images={[
				`https://picsum.photos/1200/400?random=${selectedSchool.name}-1`,
				`https://picsum.photos/1200/400?random=${selectedSchool.name}-2`,
				`https://picsum.photos/1200/400?random=${selectedSchool.name}-3`
				]}
				altText={selectedSchool.name}
				/>

				<div className="absolute -bottom-12 right-4 sm:right-8">
				<div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-4 border-white overflow-hidden shadow-lg">
				<img
					src={`https://picsum.photos/100?random=${selectedSchool.name}`}
					alt={`${selectedSchool.name} Owner`}
					className="w-full h-full object-cover"
				/>
				</div>
				</div>
			</div>

			{/* Description */}
						<div className="mb-8">
							<h3 className="text-xl font-bold text-gray-800">About {selectedSchool.name}</h3>
							<p className="mt-2 text-gray-600">{selectedSchool.description}</p>
						</div>

						{/* Payment Form */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 min-h-[500px]">
							{/* Left Column: Image Section */}
							<div
								className="rounded-lg bg-cover bg-center text-white flex flex-col items-center justify-center h-72 sm:h-96 md:h-full"
								style={{
									backgroundImage: `url('https://picsum.photos/600/800?random=${selectedSchool.name}')`,
								}}
							>
								<h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-4 bg-black bg-opacity-50 p-1 md:p-2 rounded-md">
									{selectedSchool.name}
								</h3>
							</div>

							{/* Payment Form Section */}
							<div className="flex flex-col justify-center space-y-6">
								<h3 className="text-lg sm:text-xl font-bold">Enter Payment Details</h3>

								{/* Class Level Selection */}
								<label className="block text-sm font-medium">Select Class</label>
								<select
									value={classLevel}
									onChange={(e) => setClassLevel(e.target.value)}
									className="border p-2 rounded w-full"
								>
									<option value="" disabled>Select class</option>
									{["Class 1", "Class 2", "Class 3", "Class 4"].map((className) => (
										<option key={className} value={className}>{className}</option>
									))}
								</select>

								{/* Student Name Input */}
								<label className="block text-sm font-medium">Student's Name</label>
								<input
									type="text"
									placeholder="Enter student's name"
									value={studentName}
									onChange={(e) => setStudentName(e.target.value)}
									className="border p-2 rounded w-full"
								/>

								{/* Email Address Input */}
								<label className="block text-sm font-medium">Email Address (Optional)</label>
								<input
									type="email"
									placeholder="Enter email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="border p-2 rounded w-full"
								/>

								{/* Mobile Number Input */}
								<label className="block text-sm font-medium">Phone Number (Optional)</label>
								<input
									type="text"
									placeholder="Enter your phone number"
									value={mobileNumber}
									onChange={(e) => setMobileNumber(e.target.value)}
									className="border p-2 rounded w-full"
								/>

								{/* Payment Purpose */}
								<label className="block text-sm font-medium">What are you paying for (Optional)</label>
								<input
									type="text"
									placeholder="Enter the payment info."
									value={text}
									onChange={(e) => setText(e.target.value)}
									className="border p-2 rounded w-full"
								/>

								{/* Amount Input */}
								<label className="block text-sm font-medium">Amount</label>
								<input
									type="number"
									placeholder="Enter amount"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									className="border p-2 rounded w-full"
								/>

				{/* Proceed Button */}
								<button
									onClick={handleProceed}
									disabled={!studentName || !classLevel || !amount || loading}
									className={clsx(
									"mt-6 px-6 py-3 rounded-md text-white font-bold text-sm transition duration-500",
									studentName && classLevel && amount && !loading
										? "bg-blue-500 hover:bg-blue-600"
										: "bg-gray-300 cursor-not-allowed"
									)}
								>
									{loading ? (
									<div className="flex items-center space-x-2">
										<span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
										<span>Processing...</span>
									</div>
									) : (
									"Proceed"
									)}
								</button>
								</div>
							</div>
							</div>
						)}
						</div>

						{/* Payment Popup */}
			{isPaymentDialogOpen && (
				<PaymentPopup
					isOpen={isPaymentDialogOpen}
					onClose={() => setIsPaymentDialogOpen(false)}
					serviceDetails={{
						service: selectedSchool?.name || "",
						class: classLevel,
						mobile: mobileNumber,
						email: email,
						studentName: studentName,
						paymentPurpose: text,
					}}
				/>
			)}

			{/* Help Dialog */}
			<button
				onClick={() => setIsDialogOpen(!isDialogOpen)}
				className="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600"
			>
				?
			</button>
			
			{isDialogOpen && (
				<div className="fixed bottom-20 right-6 bg-white shadow-lg rounded-lg p-4 w-64">
					<h3 className="text-lg font-bold mb-2">Contact Us</h3>
					<div className="flex flex-col space-y-2">
						<button
							onClick={() => window.location.href = "mailto:contact@school.com"}
							className="border p-2 rounded-lg bg-white hover:bg-blue-300 transition duration-200 flex items-center space-x-2"
						>
							<span>📧</span>
							<span>Email: contact@school.com</span>
						</button>
						<button
							onClick={() => window.location.href = "tel:+1234567890"}
							className="border p-2 rounded-lg bg-white hover:bg-blue-300 transition duration-200 flex items-center space-x-2"
						>
							<span>📞</span>
							<span>Phone: +1234567890</span>
						</button>
						<button
							onClick={() => window.location.href = "/livechat"}
							className="border p-2 rounded-lg bg-white hover:bg-blue-300 transition duration-200 flex items-center space-x-2"
						>
							<span>💬</span>
							<span>Live Chat</span>
						</button>
					</div>
					<button
						onClick={() => setIsDialogOpen(false)}
						className="mt-4 text-sm text-gray-500 underline"
					>
						Close
					</button>
				</div>
			)}
		</div>
	);
};

export default SchoolFees;
