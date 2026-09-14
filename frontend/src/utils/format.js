export const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
        return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
};

export const formatProjectPrice = (price, isCrore = false) => {
    if (!price) return '';
    return isCrore ? `₹${price} Cr` : `₹${price} L`;
};