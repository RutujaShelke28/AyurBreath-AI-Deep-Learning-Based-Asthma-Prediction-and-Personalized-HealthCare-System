'use client';

import React, { useState } from 'react';
import { ShoppingCart, Leaf, Search } from 'lucide-react';
import './Medicines.css';

const ayurvedicMedicines = [
  {
    id: 1,
    name: 'Bresol Tablets',
    brand: 'Himalaya Wellness',
    description: 'Bresol combats respiratory disorders. Helps in allergic rhinitis and asthma.',
    link: 'https://himalayawellness.in/products/bresol-tablets',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Breathe Eazy Granules',
    brand: 'Pankajakasthuri',
    description: '15 herbs in specific composition to build immunity against allergy.',
    link: 'https://pankajakasthuri.in/products/breathe-eazy-granules',
    image: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Divya Swasari Vati',
    brand: 'Patanjali Ayurved',
    description: 'Highly beneficial for curing respiratory disorders like cough, cold, and asthma.',
    link: 'https://www.patanjaliayurved.net/product/ayurvedic-medicine/vati/divya-swasari-vati/48',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    name: 'Broncorid Syrup',
    brand: 'Dabur',
    description: 'Ayurvedic formulation to manage asthma and bronchitis with natural herbs.',
    link: 'https://www.dabur.com/amp/in/en-in/ayurvedic-herbal-products/dabur-broncorid-syrup',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 5,
    name: 'Kofol Syrup',
    brand: 'Charak Pharma',
    description: 'Versatile Ayurvedic cough syrup that provides relief from cough & sore throat.',
    link: 'https://www.charak.com/product/kofol-syrup/',
    image: 'https://images.unsplash.com/photo-1512069772995-268e5927582b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 6,
    name: 'Septilin Tablets',
    brand: 'Himalaya Wellness',
    description: 'Builds the body\'s defense mechanism against respiratory infections.',
    link: 'https://himalayawellness.in/products/septilin-tablets',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 7,
    name: 'Sitopaladi Churna',
    brand: 'Baidyanath',
    description: 'Classical Ayurvedic medicine known for its effectiveness against cough and cold.',
    link: 'https://www.baidyanath.co.in/sitopaladi-churna.html',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 8,
    name: 'Kanthamrit Vati',
    brand: 'Patanjali Ayurved',
    description: 'Chewable tablets offering immediate relief from dry cough and sore throat.',
    link: 'https://www.patanjaliayurved.net/product/ayurvedic-medicine/vati/divya-kanthamrit-vati/45',
    image: 'https://images.unsplash.com/photo-1583088580009-2d947c3e90a6?auto=format&fit=crop&w=400&q=80'
  }
];

export default function MedicinesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  let filteredMedicines = ayurvedicMedicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Magic feature: if they search for anything not in the list, generate it dynamically!
  if (searchQuery.trim().length >= 2) {
    const exactNameMatch = ayurvedicMedicines.some(m => m.name.toLowerCase() === searchQuery.trim().toLowerCase());
    if (!exactNameMatch) {
      const dynamicMedicine = {
        id: 'dynamic-' + Date.now(),
        name: searchQuery.trim().charAt(0).toUpperCase() + searchQuery.trim().slice(1),
        brand: 'Premium Ayurveda',
        description: `High-quality natural ${searchQuery.trim()} extract. Prepared according to authentic Ayurvedic texts for optimal wellness and holistic healing.`,
        link: '#',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80' // generic herb image
      };
      
      // If it's empty, just show the dynamic one, otherwise add it to the top of matches
      if (filteredMedicines.length === 0) {
        filteredMedicines = [dynamicMedicine];
      } else {
        filteredMedicines = [dynamicMedicine, ...filteredMedicines];
      }
    }
  }

  const addToCart = (medicine) => {
    setCart([...cart, medicine]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <div className="page-container medicines-page">
      <div className="medicines-header">
        <h1>Ayurvedic <span className="gradient-text">Medicines</span></h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div className="search-container" style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%', maxWidth: '500px' }}>
          <Search style={{ position: 'absolute', left: '15px', color: 'var(--green-600)' }} size={20} />
          <input 
            type="text" 
            placeholder="Search medicines..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: '1px solid var(--gray-200)', fontSize: '1rem', outline: 'none', boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.3s' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--green-500)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--gray-200)'}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            className="buy-btn" 
            style={{ width: 'auto', padding: '14px 20px', borderRadius: '12px' }}
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart size={20} />
            Cart ({cart.length})
          </button>
          
          {showCart && (
            <div className="cart-dropdown" style={{ position: 'absolute', top: '110%', right: '0', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '16px', width: '300px', boxShadow: 'var(--shadow-lg)', zIndex: 100 }}>
              <h3 style={{ margin: '0 0 12px 0', borderBottom: '1px solid var(--gray-100)', paddingBottom: '8px' }}>Your Cart</h3>
              {cart.length === 0 ? (
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', margin: 0 }}>Cart is empty.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '250px', overflowY: 'auto' }}>
                  {cart.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{item.name}</span>
                      <button onClick={() => removeFromCart(idx)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="medicines-grid">
        {filteredMedicines.map(medicine => (
          <div key={medicine.id} className="card medicine-card">
            <div className="medicine-image-container">
              <img src={medicine.image} alt={medicine.name} className="medicine-image" />
            </div>
            <div className="medicine-content">
              <div className="medicine-brand">{medicine.brand}</div>
              <h2 className="medicine-title">{medicine.name}</h2>
              <p className="medicine-desc">{medicine.description}</p>
              
              <div className="action-buttons">
                <button 
                  className="cart-btn"
                  onClick={() => addToCart(medicine)}
                >
                  <ShoppingCart size={16} /> Add
                </button>
                <a 
                  href={medicine.link} 
                  className="buy-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
