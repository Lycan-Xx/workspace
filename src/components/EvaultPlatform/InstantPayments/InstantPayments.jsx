import { useState } from "react"
import { Search, SlidersHorizontal, DollarSign, GraduationCap, Building2, MapPin, Star } from "lucide-react"
import BusinessDetails from "./BusinessDetails"

// Mock data - replace with your actual PocketBase data
const mockBusinesses = [
  {
    id: "1",
    businessName: "Elite Academy",
    email: "info@eliteacademy.edu",
    phone: "+1 (555) 123-4567",
    description: "Premier educational institution offering comprehensive learning programs for students of all ages with experienced faculty and modern facilities.",
    bannerImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop",
    logoImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop",
    portfolioType: "school",
    address: "123 Education Street, Learning City",
    services: [
      {
        id: "s1",
        name: "Grade 1",
        description: "Annual tuition fee for Grade 1 students including books and materials",
        price: 2500,
        category: "Elementary",
        duration: "Annual",
      },
      {
        id: "s2",
        name: "Grade 2",
        description: "Annual tuition fee for Grade 2 students including books and materials",
        price: 2700,
        category: "Elementary",
        duration: "Annual",
      },
      {
        id: "s3",
        name: "After School Program",
        description: "Extended learning program with homework assistance",
        price: 800,
        category: "Education",
        duration: "Monthly",
      },
    ],
    paymentOptions: {
      bankTransfer: true,
      creditCard: true,
    },
    isActive: true,
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: "2",
    businessName: "TechSolutions Pro",
    email: "contact@techsolutions.com",
    phone: "+1 (555) 987-6543",
    description: "Leading technology consulting firm providing web development, mobile apps, and digital transformation services for businesses of all sizes.",
    bannerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
    logoImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    portfolioType: "business",
    address: "456 Tech Boulevard, Innovation District",
    services: [
      {
        id: "b1",
        name: "Website Development",
        description: "Custom responsive website development with modern design",
        price: 1500,
        category: "Technology",
        duration: "Project-based",
      },
      {
        id: "b2",
        name: "Mobile App Development",
        description: "Native and cross-platform mobile application development",
        price: 3000,
        category: "Technology",
        duration: "Project-based",
      },
      {
        id: "b3",
        name: "Digital Marketing",
        description: "Comprehensive digital marketing and SEO services",
        price: 800,
        category: "Marketing",
        duration: "Monthly",
      },
    ],
    paymentOptions: {
      bankTransfer: true,
      creditCard: true,
    },
    isActive: true,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: "3",
    businessName: "Sunshine Medical Center",
    email: "info@sunshinemedical.com",
    phone: "+1 (555) 456-7890",
    description: "Comprehensive healthcare services with experienced doctors and modern medical equipment. We provide quality care for the whole family.",
    bannerImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=400&fit=crop",
    logoImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop",
    portfolioType: "business",
    address: "789 Health Avenue, Medical District",
    services: [
      {
        id: "h1",
        name: "General Consultation",
        description: "Comprehensive health checkup with experienced physicians",
        price: 150,
        category: "Healthcare",
        duration: "Per visit",
      },
      {
        id: "h2",
        name: "Dental Care",
        description: "Complete dental examination and cleaning services",
        price: 200,
        category: "Healthcare",
        duration: "Per visit",
      },
      {
        id: "h3",
        name: "Annual Health Package",
        description: "Complete annual health screening package",
        price: 500,
        category: "Healthcare",
        duration: "Annual",
      },
    ],
    paymentOptions: {
      bankTransfer: true,
      creditCard: true,
    },
    isActive: true,
    rating: 4.7,
    reviewCount: 234,
  },
]

const InstantPayments = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [businesses] = useState(mockBusinesses)

  // Filter businesses based on search and category
  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.address.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "school" && business.portfolioType === "school") ||
      (selectedCategory === "business" && business.portfolioType === "business") ||
      business.services.some((service) => service.category.toLowerCase().includes(selectedCategory.toLowerCase()))
    
    return matchesSearch && matchesCategory && business.isActive
  })

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "school", label: "Schools" },
    { value: "business", label: "Businesses" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "finance", label: "Finance" },
    { value: "retail", label: "Retail" }
  ]

  const filters = ["All", "Favorites", "Recent", "Nearby", "Top Rated"]

  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business)
  }

  const handleBackToList = () => {
    setSelectedBusiness(null)
  }

  if (selectedBusiness) {
    return <BusinessDetails business={selectedBusiness} onBack={handleBackToList} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-[#025798] mb-2">Instant Payments</h1>
          <p className="text-lg text-gray-600">Find and pay businesses instantly - No signup required</p>
          <div className="flex justify-center mt-4 gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{businesses.length} Active Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for businesses, schools, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 h-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025798] focus:border-transparent transition-all"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal className="w-5 h-5 text-gray-400 hover:text-[#025798] transition-colors" />
              </button>

              {/* Filters Dropdown */}
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-56 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025798] focus:border-transparent px-3"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-600">
              Showing {filteredBusinesses.length} of {businesses.length} providers
            </span>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Sort by:</span>
              <select className="border-none bg-transparent text-[#025798] font-medium focus:ring-0">
                <option>Most Popular</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Listings - Improved List Format */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredBusinesses.map((business) => (
              <div
                key={business.id}
                className="flex items-center gap-6 p-6 hover:bg-gray-50 transition-all duration-300 cursor-pointer group"
                onClick={() => handleSelectBusiness(business)}
              >
                {/* Business Logo */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm bg-white group-hover:shadow-md transition-shadow">
                    {business.logoImage ? (
                      <img
                        src={business.logoImage}
                        alt={`${business.businessName} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full ${
                        business.portfolioType === "school" 
                          ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                          : "bg-gradient-to-br from-green-500 to-green-600"
                      } flex items-center justify-center`}>
                        {business.portfolioType === "school" ? (
                          <GraduationCap className="w-8 h-8 text-white" />
                        ) : (
                          <Building2 className="w-8 h-8 text-white" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#025798] transition-colors truncate">
                          {business.businessName}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            business.portfolioType === "school"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}
                        >
                          {business.portfolioType === "school" ? "🎓 School" : "🏢 Business"}
                        </span>
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{business.rating}</span>
                          <span className="text-sm text-gray-500">({business.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{business.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-6">
                      <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                        <DollarSign className="w-5 h-5" />
                        <span>From ${Math.min(...business.services.map((s) => s.price))}</span>
                      </div>
                      <div className="text-sm text-gray-500">{business.services.length} services available</div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{business.description}</p>

                  {/* Services Preview and Payment Methods */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {business.services.slice(0, 3).map((service) => (
                        <span
                          key={service.id}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border hover:bg-gray-200 transition-colors"
                        >
                          {service.name}
                        </span>
                      ))}
                      {business.services.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border">
                          +{business.services.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Payment Methods */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">Accepts:</span>
                      <div className="flex items-center gap-2">
                        {business.paymentOptions.bankTransfer && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md border border-blue-200 font-medium">
                            Bank
                          </span>
                        )}
                        {business.paymentOptions.creditCard && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md border border-green-200 font-medium">
                            Card
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredBusinesses.length === 0 && (
          <div className="bg-white rounded-xl p-12 shadow-md text-center">
            <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No providers found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any businesses or schools matching your search criteria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
              <button
                onClick={() => setSelectedCategory("all")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View All Categories
              </button>
            </div>
          </div>
        )}

        {/* Call to Action for Business Owners */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Are you a business or school owner?</h3>
          <p className="text-lg mb-6 opacity-90">
            Get listed on Instant Payments and start receiving payments from customers seamlessly
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Create Your Portfolio
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstantPayments