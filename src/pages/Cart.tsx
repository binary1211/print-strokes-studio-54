import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, Edit3, ShoppingBag, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button-enhanced";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/AppContext";
import { toast } from "sonner";

const Cart = () => {
  const navigate = useNavigate();
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = async () => {
    setIsApplyingCoupon(true);
    
    // Mock coupon validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(state.total * 0.1); // 10% discount
      toast.success('Coupon applied! 10% discount added.');
    } else if (couponCode.toUpperCase() === 'WELCOME20') {
      setDiscount(state.total * 0.2); // 20% discount
      toast.success('Welcome coupon applied! 20% discount added.');
    } else {
      toast.error('Invalid coupon code');
    }
    
    setIsApplyingCoupon(false);
  };

  const subtotal = state.total;
  const shipping = subtotal > 499 ? 0 : 49; // Free shipping above ₹499
  const tax = (subtotal - discount) * 0.18; // 18% GST
  const total = subtotal - discount + shipping + tax;

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Mock checkout process
    toast.success('Redirecting to checkout...');
    setTimeout(() => {
      navigate('/checkout');
    }, 1000);
  };

  if (state.items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any personalized items to your cart yet.
            </p>
            <Button asChild variant="brand" size="lg">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="-ml-2 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          
          {state.items.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
            >
              Clear Cart
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="card-elegant p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full sm:w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt="Product preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground text-center">
                        No Preview
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Product #{item.productId}</h3>
                        <p className="text-sm text-muted-foreground">
                          Variant: {item.variantId}
                        </p>
                        {item.personalizationSummary && (
                          <Badge variant="secondary" className="w-fit">
                            {item.personalizationSummary}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </div>
                      </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Edit Design Button */}
                        {item.design && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/product/${item.productId}?edit=${item.id}`)}
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit Design
                          </Button>
                        )}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-elegant p-6 sticky top-24">
              <h2 className="text-xl font-heading font-semibold mb-6">Order Summary</h2>
              
              {/* Coupon Code */}
              <div className="space-y-3 mb-6">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode}
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Try: SAVE10 or WELCOME20
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({state.itemCount} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (GST 18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Total */}
              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              {/* Shipping Notice */}
              {subtotal < 499 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-yellow-800">
                    Add ₹{(499 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Button
                variant="brand"
                size="lg"
                onClick={handleCheckout}
                className="w-full mb-4"
              >
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                asChild
                className="w-full"
              >
                <Link to="/">Continue Shopping</Link>
              </Button>

              {/* Security Notice */}
              <div className="text-xs text-muted-foreground text-center mt-4">
                🔒 Secure checkout • 7-day returns • Customer support
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;