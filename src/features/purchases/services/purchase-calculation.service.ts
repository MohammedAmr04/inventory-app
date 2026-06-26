export const PurchaseCalculationService = {
  calculateSubtotal(items: { purchasePrice: number; quantity: number }[]): number {
    return items.reduce((sum, item) => sum + item.purchasePrice * item.quantity, 0);
  },

  calculateLineTotal(quantity: number, purchasePrice: number): number {
    return quantity * purchasePrice;
  },

  calculateTotalAmount(subtotal: number, discount: number): number {
    return subtotal - discount;
  },

  calculateDueAmount(totalAmount: number, paidAmount: number): number {
    return totalAmount - paidAmount;
  },
};
