import React, { useState, useEffect } from "react";
import { ArrowLeft, HelpCircle } from "lucide-react";
import clsx from "clsx";
import SchoolSearch from "./SchoolSearch";
import PaymentPopup from "../PaymentPopup";
import HelpDialog from './HelpDialog';

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
	const [isHelpOpen, setIsHelpOpen] = useState(false);

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
		<div className="max-w-6xl mx-auto p-4 sm:p-6">
	{/* Back Button */}
		<button
			className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 mb-4"
			aria-label="Go back"
			onClick={handleBackClick}
		>
			<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
			<span>{selectedSchool ? "Back" : "Go to Dashboard"}</span>
		</button>

		<div className="grid grid-cols-1 gap-6 sm:gap-8">
			{!selectedSchool && (
			<SchoolSearch onSelectSchool={(school) => setSelectedSchool(school)} />
			)}

			{selectedSchool && (
			<div>
			{/* Top Banner Section */}
			<div className="relative mb-16 sm:mb-20">
				<div className="h-48 sm:h-[400px] rounded-xl overflow-hidden">
				<Carousel 
				images={[
				`https://picsum.photos/1200/400?random=${selectedSchool.name}-1`,
				`https://picsum.photos/1200/400?random=${selectedSchool.name}-2`,
				`https://picsum.photos/1200/400?random=${selectedSchool.name}-3`
				]}
				altText={selectedSchool.name}
				/>
				</div>

				<div className="absolute -bottom-10 right-4">
				<div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl border-4 border-white overflow-hidden shadow-lg">
				<img
					src={`https://picsum.photos/100?random=${selectedSchool.name}`}
					alt={`${selectedSchool.name} Owner`}
					className="w-full h-full object-cover"
				/>
				</div>
				</div>
			</div>

			{/* Description */}
						<div className="mb-6 sm:mb-8 px-4 sm:px-0">
							<h3 className="text-lg sm:text-xl font-bold text-gray-800">About {selectedSchool.name}</h3>
							<p className="mt-2 text-sm sm:text-base text-gray-600">{selectedSchool.description}</p>
						</div>

						{/* Payment Form */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
							{/* Left Column: Image Section */}
							<div className="hidden lg:block rounded-lg overflow-hidden h-auto aspect-4/3">
								<img
									src={`https://picsum.photos/600/800?random=${selectedSchool.name}`}
									alt={selectedSchool.name}
									className="w-full h-full object-cover"
								/>
							</div>

							{/* Payment Form Section */}
							<div className="relative space-y-4 sm:space-y-6 p-4 sm:p-6 bg-white rounded-lg shadow-sm">
								<h3 className="text-lg sm:text-xl font-bold">Enter Payment Details</h3>

								{/* Form Fields */}
								{["Class", "Student's Name", "Email", "Phone", "Payment Purpose", "Amount"].map((label, index) => (
									<div key={index} className="space-y-1">
										<label className="block text-sm font-medium text-gray-700">
											{label} {label !== "Email" && label !== "Phone" && label !== "Payment Purpose" && <span className="text-red-500">*</span>}
										</label>
										{label === "Class" ? (
											<select
												value={classLevel}
												onChange={(e) => setClassLevel(e.target.value)}
												className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											>
												<option value="">Select class</option>
												{["Class 1", "Class 2", "Class 3", "Class 4"].map((className) => (
													<option key={className} value={className}>{className}</option>
												))}
											</select>
										) : (
											<input
												type={label === "Amount" ? "number" : "text"}
												placeholder={`Enter ${label.toLowerCase()}`}
												value={
													label === "Student's Name" ? studentName :
													label === "Email" ? email :
													label === "Phone" ? mobileNumber :
													label === "Payment Purpose" ? text :
													label === "Amount" ? amount : ""
												}
												onChange={(e) => {
													const val = e.target.value;
													if (label === "Student's Name") setStudentName(val);
													else if (label === "Email") setEmail(val);
													else if (label === "Phone") setMobileNumber(val);
													else if (label === "Payment Purpose") setText(val);
													else if (label === "Amount") setAmount(val);
												}}
												className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											/>
										)}
									</div>
								))}

								{/* Proceed Button Container */}
								<div className="relative pb-4 sm:pb-0">
									<button
										onClick={handleProceed}
										disabled={!studentName || !classLevel || !amount || loading}
										className={clsx(
											"mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-md text-white font-bold text-sm transition duration-500 w-full sm:w-auto",
											studentName && classLevel && amount && !loading
												? "bg-blue-500 hover:bg-blue-600"
												: "bg-gray-300 cursor-not-allowed"
										)}
									>
										{loading ? (
											<div className="flex items-center justify-center space-x-2">
												<span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 sm:w-5 sm:h-5"></span>
												<span>Processing...</span>
											</div>
										) : (
											"Proceed"
										)}
									</button>
								</div>
								</div>
							</div>
							</div>
						)}
						</div>

						{/* Fixed Help Button */}
						<button
							onClick={() => setIsHelpOpen(true)}
							className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white text-blue-500 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 active:bg-blue-100 transition-colors border-2 border-blue-500 z-40"
							aria-label="Get Help"
						>
							<HelpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
						</button>

						{/* Help Dialog */}
						<HelpDialog 
							isOpen={isHelpOpen}
							onClose={() => setIsHelpOpen(false)}
						/>

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
		</div>
	);
};

export default SchoolFees;
