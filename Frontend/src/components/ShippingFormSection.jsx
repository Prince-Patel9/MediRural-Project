import React from 'react';

export default function ShippingFormSection({ shipping, handleShippingChange, errors = {} }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Shipping Details</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <input name="name" placeholder="Full Name" value={shipping.name} onChange={handleShippingChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.name && <span className="text-red-600 text-sm">{errors.name}</span>}
        </div>
        <div>
          <input name="email" placeholder="Email" value={shipping.email} onChange={handleShippingChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
        </div>
        <div>
          <input name="phone" placeholder="Phone" value={shipping.phone} onChange={handleShippingChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.phone && <span className="text-red-600 text-sm">{errors.phone}</span>}
        </div>
        <div>
          <input name="address" placeholder="Address" value={shipping.address} onChange={handleShippingChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.address && <span className="text-red-600 text-sm">{errors.address}</span>}
        </div>
        <div>
          <input name="city" placeholder="City" value={shipping.city} onChange={handleShippingChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.city && <span className="text-red-600 text-sm">{errors.city}</span>}
        </div>
        <div>
          <input name="state" placeholder="State" value={shipping.state} onChange={handleShippingChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.state && <span className="text-red-600 text-sm">{errors.state}</span>}
        </div>
        <div>
          <input name="pincode" placeholder="Pincode" value={shipping.pincode} onChange={handleShippingChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.pincode && <span className="text-red-600 text-sm">{errors.pincode}</span>}
        </div>
        <div>
          <input name="country" placeholder="Country" value={shipping.country} onChange={handleShippingChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.country && <span className="text-red-600 text-sm">{errors.country}</span>}
        </div>
      </div>
    </div>
  );
} 