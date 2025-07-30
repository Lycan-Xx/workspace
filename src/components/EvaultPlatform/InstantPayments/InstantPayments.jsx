"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, DollarSign } from "lucide-react"
import BusinessDetails from "./BusinessDetails"

// Mock data - replace with your actual data source
const mockBusinesses = [
  {
    id: "1",
    businessName: "Elite Academy",
    email: "info@eliteacademy.edu",
    phone: "+1 (555) 123-4567",
    description: "Premier educational institution offering comprehensive learning programs for students of all ages.",
    bannerImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop",
    logoImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop",
    portfolioType: "school",
    services: [
      {
        id: "s1",
        name: "Grade 1",
        description: "Annual tuition fee for Grade 1 students including books and materials",
        price: 2500,
        category: "Education",
        duration: "Annual",
      },
      {
        id: "s2",
        name: "Grade 2",
        description: "Annual tuition fee for Grade 2 students including books and materials",
        price: 2700,
        category: "Education",
        duration: "Annual",
      },
    ],
    paymentOptions: {
      bankTransfer: true,
      creditCard: true,
    },
    isActive: true,
  },
  // Add more mock businesses...
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
      business.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      business.services.some((service) => service.category.toLowerCase() === selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory && business.isActive
  })

  const categories = ["all", "education", "technology", "healthcare", "finance", "retail"]
  const filters = ["All", "Favorites", "Recent", "Nearby"]

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
          <p className="text-lg text-gray-600">Find and pay businesses instantly</p>
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
                placeholder="Search for businesses, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 h-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025798] focus:border-transparent transition-all"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal className="w-5 h-5 text-gray-400 hover:text-[#025798]" />
              </button>

              {/* Filters Dropdown */}
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
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
              className="w-full md:w-48 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025798] focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Business Listings - List Format */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="space-y-4">
            {filteredBusinesses.map((business) => (
              <div
                key={business.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group hover:border-blue-300"
                onClick={() => handleSelectBusiness(business)}
              >
                {/* Business Logo */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm bg-white">
                    {business.logoImage ? (
                      <img
                        src={business.logoImage || "/placeholder.svg"}
                        alt={`${business.businessName} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">{business.businessName.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#025798] transition-colors truncate">
                        {business.businessName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 text-xs rounded-md ${
                            business.portfolioType === "school"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {business.portfolioType === "school" ? "🎓 School" : "🏢 Business"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1 text-green-600 font-bold">
                        <DollarSign className="w-4 h-4" />
                        <span>From ${Math.min(...business.services.map((s) => s.price))}</span>
                      </div>
                      <div className="text-sm text-gray-500">{business.services.length} services</div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{business.description}</p>

                  {/* Services Preview */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {business.services.slice(0, 3).map((service) => (
                        <span
                          key={service.id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border"
                        >
                          {service.name}
                        </span>
                      ))}
                      {business.services.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border">
                          +{business.services.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Payment Methods */}
                    <div className="flex items-center gap-2">
                      {business.paymentOptions.bankTransfer && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md border">Bank</span>
                      )}
                      {business.paymentOptions.creditCard && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md border">Card</span>
                      )}
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
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No businesses found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstantPayments
