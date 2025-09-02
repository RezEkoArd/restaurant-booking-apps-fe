import { useState } from "react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus, 
  Minus, 
  User, 
  Printer,
  Save,
  ChefHat,
} from "lucide-react";

// Types
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface OrderItem {
  id: number;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

// Mock menu data
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Caesar Salad",
    description: "Fresh romaine lettuce, parmesan cheese, croutons",
    price: 16.98,
    category: "Appetizers"
  },
  {
    id: 2,
    name: "Buffalo Wings",
    description: "Crispy chicken wings with buffalo sauce and blue cheese",
    price: 14.99,
    category: "Appetizers"
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Golden fried mozzarella with marinara sauce",
    price: 8.99,
    category: "Appetizers"
  },
  {
    id: 4,
    name: "Spinach Artichoke Dip",
    description: "Creamy dip served with tortilla chips",
    price: 11.99,
    category: "Appetizers"
  }
];

const DetailOrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Appetizers");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: 1,
      menuItem: menuItems[0],
      quantity: 2
    },
    {
      id: 2,
      menuItem: menuItems[1],
      quantity: 1
    }
  ]);

  const categories = ["Appetizers", "Main Course", "Desserts", "Beverages", "Salads"];
  
  const filteredMenuItems = menuItems.filter(item => 
    item.category === selectedCategory &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToOrder = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menuItem.id === menuItem.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newOrderItem: OrderItem = {
        id: Date.now(),
        menuItem,
        quantity: 1
      };
      setOrderItems([...orderItems, newOrderItem]);
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems(orderItems.filter(item => item.id !== itemId));
    } else {
      setOrderItems(orderItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => 
      total + (item.menuItem.price * item.quantity), 0
    );
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Menu */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Table 12</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span>Sarah Johnson</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? "bg-gray-900 text-white" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {filteredMenuItems.map((item) => (
            <Card 
              key={item.id} 
              className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
              onClick={() => addToOrder(item)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="ml-4 bg-gray-900 hover:bg-gray-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToOrder(item);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Panel - Current Order */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Order Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Current Order</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Table 12</span>
            <span>•</span>
            <span>January 15, 2025</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {orderItems.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No items in order</p>
              <p className="text-sm text-gray-400">Start by selecting menu items</p>
            </div>
          ) : (
            orderItems.map((item) => (
              <Card key={item.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.menuItem.name}</h4>
                      <p className="text-sm text-gray-600">{formatCurrency(item.menuItem.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(item.menuItem.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => updateQuantity(item.id, 0)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>{formatCurrency(getTotalAmount())}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white gap-2 py-3"
                onClick={() => console.log("Send to Kitchen clicked")}
              >
                <ChefHat className="h-4 w-4" />
                Send to Kitchen
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => console.log("Save Draft clicked")}
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => console.log("Print Bill clicked")}
                >
                  <Printer className="h-4 w-4" />
                  Print Bill
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailOrderPage;