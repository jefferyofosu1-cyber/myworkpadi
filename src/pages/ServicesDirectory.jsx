import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import './ServicesDirectory.css';

const SERVICE_CATEGORIES = [
  {
    id: "handyman",
    title: "Handyman & Home Repairs",
    description: "Hire a Tasker for help around the house or office.",
    tasks: [
      "Door, Cabinet & Furniture Repair", "Appliance Installation & Repairs",
      "TV Mounting", "Generator Servicing", "Borehole & Pump Servicing", 
      "Drywall Repair Service", "Flooring & Tiling", "Electrical Help",
      "Plumbing Maintenance", "Window Repair", "Ceiling Fan Installation",
      "Painting Services", "Carpentry & Construction", "Roof Tracking & Repairs",
      "Cabinet Installation", "Fence & Gate Installation", "Water Tank Installation"
    ]
  },
  {
    id: "moving",
    title: "Moving Services",
    description: "From heavy lifting to truck logistics, make your move with TaskGH.",
    tasks: [
      "Local Movers", "Truck-Assisted Help Moving", "Packing Services & Help",
      "Unpacking Services", "Heavy Lifting", "Junk Pickup & Disposal",
      "Furniture Movers", "Appliance Removal", "Storage Unit Moving",
      "Office Relocation"
    ]
  },
  {
    id: "assembly",
    title: "Furniture Assembly",
    description: "Taskers arrive with all the right tools for assembly.",
    tasks: [
      "General Furniture Assembly", "IKEA Assembly", "Desk Assembly",
      "Bed Assembly", "Wardrobe Assembly", "Patio Furniture",
      "Office Furniture Setup", "Disassemble Furniture", "Swing Set Assembly"
    ]
  },
  {
    id: "cleaning",
    title: "Cleaning Services",
    description: "Taskers will make your home or office sparkle.",
    tasks: [
      "House Cleaning Services", "Deep Cleaning", "Post-Construction Cleaning",
      "Move In / Move Out Cleaning", "Vacation Rental Cleaning", "Carpet Cleaning",
      "Car Washing (Home Service)", "Laundry Help", "Pressure Washing"
    ]
  },
  {
    id: "shopping",
    title: "Shopping & Delivery",
    description: "Market runs, errands, and precise package delivery.",
    tasks: [
      "Market Runs & Grocery Delivery", "Running Errands", "Delivery Service",
      "Wait in Line", "Deliver Big Furniture", "Drop off Donations",
      "Pick up & Delivery (Contactless)", "Office Supply Run", "Food Delivery"
    ]
  },
  {
    id: "yardwork",
    title: "Yard Work & Outdoor",
    description: "Hire a Tasker to help with landscaping.",
    tasks: [
      "Gardening Services", "Weed Removal", "Lawn Mowing",
      "Landscaping Services", "Gutter Cleaning", "Tree Trimming",
      "Compound Sweeping", "Fence Staining", "Pressure Washing (Outdoors)"
    ]
  },
  {
    id: "tech",
    title: "Tech & Office",
    description: "Virtual and in-person IT and administrative assistance.",
    tasks: [
      "Wifi Setup & Troubleshooting", "Computer Help", "Office Tech Setup",
      "Data Entry", "Virtual Assistant", "Interior Office Design"
    ]
  }
];

export default function ServicesDirectory() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Account for sticky navs
        behavior: 'smooth'
      });
    }
  };

  const filteredCategories = SERVICE_CATEGORIES.map(category => {
    if (!searchTerm) return category;
    const lowerSearch = searchTerm.toLowerCase();
    
    // Check if category title matches, or filter the sub-tasks
    const matchesTitle = category.title.toLowerCase().includes(lowerSearch);
    const filteredTasks = category.tasks.filter(task => task.toLowerCase().includes(lowerSearch));
    
    if (matchesTitle || filteredTasks.length > 0) {
      return {
        ...category,
        tasks: matchesTitle && filteredTasks.length === 0 ? category.tasks : filteredTasks
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="container">
          <h1>Services offered by TaskGH</h1>
          <p>Your trusted local professionals. Handymen, delivery runners, and much more. Our Taskers can tackle all your projects.</p>
          <div className="search-wrapper large-search">
            <Search className="search-icon" size={24} />
            <input 
              type="text" 
              placeholder="Search for a service... e.g. 'Plumbing' or 'Generator'" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container dir-layout">
        
        {/* Sticky Sidebar */}
        <aside className="dir-sidebar">
          <h3>Categories</h3>
          <nav>
            {SERVICE_CATEGORIES.map(cat => (
              <a 
                key={cat.id} 
                href={`#${cat.id}`} 
                onClick={(e) => handleScroll(e, cat.id)}
              >
                {cat.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content Grid */}
        <main className="dir-content">
          {filteredCategories.length === 0 ? (
            <div className="no-results">
              <h3>No services found for "{searchTerm}"</h3>
              <p>Try searching for broader terms like "Cleaning" or "Handyman".</p>
            </div>
          ) : (
            filteredCategories.map(category => (
              <section key={category.id} id={category.id} className="category-section">
                <div className="category-header">
                  <h2><Link to="/booking">{category.title}</Link></h2>
                  <p>{category.description}</p>
                </div>
                
                <div className="task-grid">
                  {category.tasks.map((task, idx) => (
                    <Link key={idx} to={`/booking?service=${encodeURIComponent(task)}`} className="task-link">
                      <span>{task}</span>
                      <ArrowRight size={16} className="task-arrow"/>
                    </Link>
                  ))}
                </div>
              </section>
            ))
          )}
        </main>

      </div>
    </div>
  );
}
